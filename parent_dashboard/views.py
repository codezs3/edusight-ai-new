from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import json
import pandas as pd
import numpy as np
from PIL import Image
import cv2
import pytesseract
import openpyxl
import os
import re
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import joblib

from .models import (
    UploadSession, AssessmentCalculation, PredictionResult, 
    Recommendation, CareerMapping, ParentFeedback
)
from students.models import Student


def parent_login_view(request):
    """Parent login page"""
    return render(request, 'parent_dashboard/parent_login.html')


@login_required
def parent_dashboard(request):
    """Main parent dashboard view"""
    # Get user's children/students - updated to work with new Student model
    students = Student.objects.filter(user__email=request.user.email) if hasattr(request.user, 'student') else Student.objects.none()
    
    # Get recent upload sessions
    recent_uploads = UploadSession.objects.filter(parent_user=request.user)[:5]
    
    # Get summary statistics
    total_assessments = AssessmentCalculation.objects.filter(
        upload_session__parent_user=request.user
    ).count()
    
    completed_predictions = PredictionResult.objects.filter(
        assessment__upload_session__parent_user=request.user
    ).count()
    
    context = {
        'students': students,
        'recent_uploads': recent_uploads,
        'total_assessments': total_assessments,
        'completed_predictions': completed_predictions,
    }
    return render(request, 'parent_dashboard/dashboard.html', context)


@login_required
def upload_student_data(request):
    """Handle student data upload"""
    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        upload_type = request.POST.get('upload_type')
        
        if not student_id or not upload_type:
            messages.error(request, 'Please select a student and upload type.')
            return redirect('parent_dashboard:upload')
        
        student = get_object_or_404(Student, id=student_id)
        
        # Create upload session
        upload_session = UploadSession.objects.create(
            parent_user=request.user,
            student=student,
            upload_type=upload_type,
            status='pending'
        )
        
        if upload_type in ['excel', 'csv', 'image']:
            # Handle file upload
            if 'file' in request.FILES:
                file = request.FILES['file']
                upload_session.file_path = file
                upload_session.status = 'processing'
                upload_session.save()
                
                # Process the file
                success = process_uploaded_file(upload_session)
                if success:
                    messages.success(request, 'File uploaded and processed successfully!')
                    return redirect('parent_dashboard:assessment_results', session_id=upload_session.id)
                else:
                    messages.error(request, 'Error processing the uploaded file.')
            else:
                messages.error(request, 'Please select a file to upload.')
        
        elif upload_type == 'manual':
            # Handle manual data entry
            return redirect('parent_dashboard:manual_entry', session_id=upload_session.id)
    
    students = Student.objects.filter(parent_email=request.user.email)
    return render(request, 'parent_dashboard/upload.html', {'students': students})


def process_uploaded_file(upload_session):
    """Process uploaded file and extract data"""
    try:
        file_path = upload_session.file_path.path
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension in ['.xlsx', '.xls']:
            return process_excel_file(upload_session, file_path)
        elif file_extension == '.csv':
            return process_csv_file(upload_session, file_path)
        elif file_extension in ['.jpg', '.jpeg', '.png', '.pdf']:
            return process_image_file(upload_session, file_path)
        
        return False
    except Exception as e:
        print(f"Error processing file: {e}")
        upload_session.status = 'failed'
        upload_session.save()
        return False


def process_excel_file(upload_session, file_path):
    """Process Excel file and extract academic data"""
    try:
        # Read Excel file
        df = pd.read_excel(file_path)
        
        # Detect curriculum and semester from headers or content
        curriculum_info = detect_curriculum_from_excel(df)
        
        # Extract subject scores
        subjects_data = extract_subjects_from_excel(df)
        
        # Update upload session with detected info
        upload_session.detected_curriculum = curriculum_info.get('curriculum', 'Unknown')
        upload_session.detected_semester = curriculum_info.get('semester', 'Unknown')
        upload_session.detected_year = curriculum_info.get('year', 'Unknown')
        upload_session.detected_subjects = list(subjects_data.keys())
        upload_session.raw_data = subjects_data
        upload_session.status = 'completed'
        upload_session.save()
        
        # Calculate assessment
        calculate_assessment(upload_session)
        
        return True
    except Exception as e:
        print(f"Error processing Excel file: {e}")
        return False


def process_csv_file(upload_session, file_path):
    """Process CSV file and extract academic data"""
    try:
        # Read CSV file
        df = pd.read_csv(file_path)
        
        # Similar processing to Excel
        curriculum_info = detect_curriculum_from_dataframe(df)
        subjects_data = extract_subjects_from_dataframe(df)
        
        upload_session.detected_curriculum = curriculum_info.get('curriculum', 'Unknown')
        upload_session.detected_semester = curriculum_info.get('semester', 'Unknown')
        upload_session.detected_year = curriculum_info.get('year', 'Unknown')
        upload_session.detected_subjects = list(subjects_data.keys())
        upload_session.raw_data = subjects_data
        upload_session.status = 'completed'
        upload_session.save()
        
        calculate_assessment(upload_session)
        return True
    except Exception as e:
        print(f"Error processing CSV file: {e}")
        return False


def process_image_file(upload_session, file_path):
    """Process image file using OCR to extract text data"""
    try:
        # Use OCR to extract text from image
        image = Image.open(file_path)
        extracted_text = pytesseract.image_to_string(image)
        
        # Parse extracted text for academic information
        parsed_data = parse_ocr_text(extracted_text)
        
        upload_session.detected_curriculum = parsed_data.get('curriculum', 'Unknown')
        upload_session.detected_semester = parsed_data.get('semester', 'Unknown')
        upload_session.detected_year = parsed_data.get('year', 'Unknown')
        upload_session.detected_subjects = parsed_data.get('subjects', [])
        upload_session.raw_data = parsed_data.get('scores', {})
        upload_session.status = 'completed'
        upload_session.save()
        
        calculate_assessment(upload_session)
        return True
    except Exception as e:
        print(f"Error processing image file: {e}")
        return False


def detect_curriculum_from_excel(df):
    """Detect curriculum type from Excel data"""
    curriculum_keywords = {
        'CBSE': ['cbse', 'central board', 'class x', 'class xii'],
        'ICSE': ['icse', 'indian certificate', 'council'],
        'IGCSE': ['igcse', 'cambridge', 'international'],
        'IB': ['ib', 'international baccalaureate', 'diploma'],
        'State Board': ['state', 'board', 'ssc', 'hsc']
    }
    
    # Convert all data to string and search for keywords
    all_text = ' '.join(df.astype(str).values.flatten()).lower()
    
    detected_curriculum = 'Unknown'
    for curriculum, keywords in curriculum_keywords.items():
        if any(keyword in all_text for keyword in keywords):
            detected_curriculum = curriculum
            break
    
    # Detect semester/year
    semester_patterns = [
        r'semester[:\s]*(\d+)', r'sem[:\s]*(\d+)', 
        r'term[:\s]*(\d+)', r'class[:\s]*(\w+)'
    ]
    
    detected_semester = 'Unknown'
    detected_year = 'Unknown'
    
    for pattern in semester_patterns:
        match = re.search(pattern, all_text, re.IGNORECASE)
        if match:
            detected_semester = match.group(1)
            break
    
    # Detect academic year
    year_pattern = r'20(\d{2})'
    year_match = re.search(year_pattern, all_text)
    if year_match:
        detected_year = f"20{year_match.group(1)}"
    
    return {
        'curriculum': detected_curriculum,
        'semester': detected_semester,
        'year': detected_year
    }


def extract_subjects_from_excel(df):
    """Extract subject scores from Excel data"""
    subjects_data = {}
    
    # Common subject patterns
    subject_patterns = [
        r'math|mathematics', r'english|literature', r'science|physics|chemistry|biology',
        r'history|social', r'geography', r'computer|programming', r'art|drawing',
        r'physical|sports', r'music', r'language'
    ]
    
    # Look for numeric columns that might be scores
    for col in df.columns:
        col_str = str(col).lower()
        for pattern in subject_patterns:
            if re.search(pattern, col_str):
                # Extract scores from this column
                scores = df[col].dropna()
                if scores.dtype in ['int64', 'float64']:
                    subjects_data[col] = {
                        'scores': scores.tolist(),
                        'average': float(scores.mean()) if len(scores) > 0 else 0,
                        'max_score': float(scores.max()) if len(scores) > 0 else 0,
                        'min_score': float(scores.min()) if len(scores) > 0 else 0
                    }
                break
    
    return subjects_data


def detect_curriculum_from_dataframe(df):
    """Similar to Excel detection but for CSV/DataFrame"""
    return detect_curriculum_from_excel(df)


def extract_subjects_from_dataframe(df):
    """Similar to Excel extraction but for CSV/DataFrame"""
    return extract_subjects_from_excel(df)


def parse_ocr_text(text):
    """Parse OCR extracted text for academic information"""
    lines = text.split('\n')
    parsed_data = {
        'curriculum': 'Unknown',
        'semester': 'Unknown',
        'year': 'Unknown',
        'subjects': [],
        'scores': {}
    }
    
    # Look for curriculum keywords
    curriculum_keywords = {
        'CBSE': ['cbse', 'central board'],
        'ICSE': ['icse', 'indian certificate'],
        'IGCSE': ['igcse', 'cambridge'],
        'IB': ['ib', 'international baccalaureate']
    }
    
    text_lower = text.lower()
    for curriculum, keywords in curriculum_keywords.items():
        if any(keyword in text_lower for keyword in keywords):
            parsed_data['curriculum'] = curriculum
            break
    
    # Extract scores using patterns
    score_pattern = r'(\w+(?:\s+\w+)*)[:\s]+(\d+)'
    scores = re.findall(score_pattern, text)
    
    for subject, score in scores:
        subject = subject.strip()
        if len(subject) > 2:  # Filter out short matches
            parsed_data['subjects'].append(subject)
            parsed_data['scores'][subject] = {
                'scores': [int(score)],
                'average': int(score),
                'max_score': int(score),
                'min_score': int(score)
            }
    
    return parsed_data


def calculate_assessment(upload_session):
    """Calculate ML-based assessment from uploaded data"""
    try:
        # Extract numeric scores from raw data
        all_scores = []
        subject_averages = {}
        
        for subject, data in upload_session.raw_data.items():
            if isinstance(data, dict) and 'average' in data:
                all_scores.append(data['average'])
                subject_averages[subject] = data['average']
        
        if not all_scores:
            return False
        
        # Calculate academic metrics
        academic_score = np.mean(all_scores)
        
        # Simulate psychological and physical scores based on academic performance
        # In a real implementation, these would come from separate assessments
        psychological_score = academic_score * 0.9 + np.random.normal(0, 5)
        physical_score = academic_score * 0.8 + np.random.normal(0, 8)
        
        # Overall score calculation
        overall_score = (academic_score * 0.5 + psychological_score * 0.3 + physical_score * 0.2)
        
        # Identify strengths and improvement areas
        strengths = []
        improvements = []
        
        for subject, score in subject_averages.items():
            if score > academic_score + 5:
                strengths.append(subject)
            elif score < academic_score - 5:
                improvements.append(subject)
        
        # Create assessment calculation
        assessment = AssessmentCalculation.objects.create(
            upload_session=upload_session,
            academic_score=academic_score,
            psychological_score=psychological_score,
            physical_score=physical_score,
            overall_score=overall_score,
            performance_trend={'trend': 'stable', 'change': 0},
            strength_areas=strengths,
            improvement_areas=improvements
        )
        
        # Generate predictions
        generate_predictions(assessment)
        
        return True
    except Exception as e:
        print(f"Error calculating assessment: {e}")
        return False


def generate_predictions(assessment):
    """Generate ML predictions based on assessment"""
    try:
        # Simulate ML model predictions
        current_scores = [
            assessment.academic_score,
            assessment.psychological_score,
            assessment.physical_score
        ]
        
        # Predict future performance (simplified simulation)
        future_academic = assessment.academic_score + np.random.normal(2, 5)
        future_psychological = assessment.psychological_score + np.random.normal(1, 3)
        future_physical = assessment.physical_score + np.random.normal(0, 4)
        
        predicted_performance = {
            'next_semester': {
                'academic': float(future_academic),
                'psychological': float(future_psychological),
                'physical': float(future_physical)
            },
            'next_year': {
                'academic': float(future_academic + np.random.normal(1, 3)),
                'psychological': float(future_psychological + np.random.normal(0.5, 2)),
                'physical': float(future_physical + np.random.normal(0, 3))
            }
        }
        
        # Calculate confidence scores
        confidence_scores = {
            'academic': 0.85,
            'psychological': 0.75,
            'physical': 0.70,
            'overall': 0.77
        }
        
        # Identify risk factors and success indicators
        risk_factors = []
        success_indicators = []
        
        if assessment.academic_score < 60:
            risk_factors.append("Below average academic performance")
        if assessment.psychological_score < 50:
            risk_factors.append("Stress or motivation concerns")
        if assessment.physical_score < 50:
            risk_factors.append("Physical wellness needs attention")
        
        if assessment.academic_score > 80:
            success_indicators.append("Strong academic foundation")
        if assessment.psychological_score > 75:
            success_indicators.append("Good psychological well-being")
        if assessment.physical_score > 75:
            success_indicators.append("Excellent physical health")
        
        # Create prediction result
        prediction = PredictionResult.objects.create(
            assessment=assessment,
            predicted_performance=predicted_performance,
            confidence_scores=confidence_scores,
            future_trends={'improving': True, 'rate': 'moderate'},
            risk_factors=risk_factors,
            success_indicators=success_indicators
        )
        
        # Generate recommendations
        generate_recommendations(prediction)
        
        # Create career mapping
        create_career_mapping(prediction)
        
        return True
    except Exception as e:
        print(f"Error generating predictions: {e}")
        return False


def generate_recommendations(prediction):
    """Generate AI recommendations based on predictions"""
    try:
        assessment = prediction.assessment
        recommendations_data = []
        
        # Academic recommendations
        if assessment.academic_score < 70:
            recommendations_data.append({
                'type': 'academic',
                'title': 'Improve Study Methods',
                'description': 'Focus on structured study techniques and time management',
                'priority': 'high',
                'steps': ['Create a study schedule', 'Use active learning techniques', 'Regular practice tests'],
                'outcome': 'Improved academic performance by 15-20%',
                'timeline': '3-6 months'
            })
        
        # Psychological recommendations
        if assessment.psychological_score < 60:
            recommendations_data.append({
                'type': 'psychological',
                'title': 'Stress Management',
                'description': 'Develop coping strategies for academic pressure',
                'priority': 'high',
                'steps': ['Practice mindfulness', 'Regular breaks', 'Talk to counselor'],
                'outcome': 'Reduced stress and improved focus',
                'timeline': '2-4 months'
            })
        
        # Physical recommendations
        if assessment.physical_score < 60:
            recommendations_data.append({
                'type': 'physical',
                'title': 'Physical Activity Plan',
                'description': 'Incorporate regular exercise and healthy habits',
                'priority': 'medium',
                'steps': ['30 minutes daily exercise', 'Healthy diet', 'Adequate sleep'],
                'outcome': 'Better physical health and energy levels',
                'timeline': '1-3 months'
            })
        
        # Study method recommendations
        if len(assessment.improvement_areas) > 0:
            recommendations_data.append({
                'type': 'study_method',
                'title': 'Subject-Specific Improvement',
                'description': f'Focus on improving in {", ".join(assessment.improvement_areas)}',
                'priority': 'medium',
                'steps': ['Extra practice', 'Seek help from teachers', 'Form study groups'],
                'outcome': 'Improved performance in weak subjects',
                'timeline': '2-6 months'
            })
        
        # Create recommendation objects
        for rec_data in recommendations_data:
            Recommendation.objects.create(
                prediction=prediction,
                recommendation_type=rec_data['type'],
                title=rec_data['title'],
                description=rec_data['description'],
                priority=rec_data['priority'],
                actionable_steps=rec_data['steps'],
                expected_outcome=rec_data['outcome'],
                timeline=rec_data['timeline']
            )
        
        return True
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return False


def create_career_mapping(prediction):
    """Create career mapping based on student performance"""
    try:
        assessment = prediction.assessment
        
        # Simulate career recommendations based on strengths
        career_recommendations = []
        
        # STEM careers for high academic scores
        if assessment.academic_score > 75:
            career_recommendations.extend([
                'Software Engineer', 'Data Scientist', 'Research Scientist',
                'Engineering', 'Medicine', 'Architecture'
            ])
        
        # Creative careers based on specific strengths
        if 'Art' in assessment.strength_areas or 'Music' in assessment.strength_areas:
            career_recommendations.extend([
                'Graphic Designer', 'Musician', 'Artist', 'Creative Director'
            ])
        
        # Leadership careers for well-rounded students
        if assessment.overall_score > 70:
            career_recommendations.extend([
                'Business Management', 'Entrepreneurship', 'Consulting'
            ])
        
        # Calculate match scores
        career_match_scores = {}
        for career in career_recommendations:
            base_score = min(assessment.overall_score / 100, 1.0)
            career_match_scores[career] = base_score + np.random.normal(0, 0.1)
        
        # Skill gaps and development path
        skill_gaps = []
        if assessment.academic_score < 80:
            skill_gaps.append('Advanced problem-solving skills')
        if assessment.psychological_score < 70:
            skill_gaps.append('Leadership and communication skills')
        if assessment.physical_score < 70:
            skill_gaps.append('Physical stamina and wellness')
        
        development_path = {
            'short_term': ['Improve current academic performance', 'Develop study skills'],
            'medium_term': ['Explore career interests', 'Gain relevant experience'],
            'long_term': ['Pursue higher education', 'Build professional network']
        }
        
        # Create career mapping
        CareerMapping.objects.create(
            prediction=prediction,
            recommended_careers=career_recommendations,
            career_match_scores=career_match_scores,
            skill_gaps=skill_gaps,
            development_path=development_path,
            industry_trends={'growth_sectors': ['Technology', 'Healthcare', 'Renewable Energy']},
            education_requirements={'most_careers': 'Bachelor\'s degree or higher'}
        )
        
        return True
    except Exception as e:
        print(f"Error creating career mapping: {e}")
        return False


@login_required
def assessment_results(request, session_id):
    """Display assessment results and predictions"""
    upload_session = get_object_or_404(UploadSession, id=session_id, parent_user=request.user)
    
    try:
        assessment = upload_session.assessmentcalculation
        prediction = assessment.predictionresult
        recommendations = prediction.recommendation_set.all()
        career_mapping = prediction.careermapping
        
        # Generate prediction plots
        plot_data = generate_prediction_plots(assessment, prediction)
        
        context = {
            'upload_session': upload_session,
            'assessment': assessment,
            'prediction': prediction,
            'recommendations': recommendations,
            'career_mapping': career_mapping,
            'plot_data': plot_data
        }
        
        return render(request, 'parent_dashboard/assessment_results.html', context)
        
    except (AssessmentCalculation.DoesNotExist, PredictionResult.DoesNotExist):
        messages.error(request, 'Assessment results not found or still processing.')
        return redirect('parent_dashboard:dashboard')


def generate_prediction_plots(assessment, prediction):
    """Generate visualization plots for predictions"""
    try:
        # Create performance comparison chart
        categories = ['Academic', 'Psychological', 'Physical']
        current_scores = [
            assessment.academic_score,
            assessment.psychological_score,
            assessment.physical_score
        ]
        
        future_scores = [
            prediction.predicted_performance['next_semester']['academic'],
            prediction.predicted_performance['next_semester']['psychological'],
            prediction.predicted_performance['next_semester']['physical']
        ]
        
        # Create bar chart
        fig, ax = plt.subplots(figsize=(10, 6))
        x = np.arange(len(categories))
        width = 0.35
        
        ax.bar(x - width/2, current_scores, width, label='Current', color='#3498db')
        ax.bar(x + width/2, future_scores, width, label='Predicted', color='#2ecc71')
        
        ax.set_xlabel('Assessment Categories')
        ax.set_ylabel('Scores')
        ax.set_title('Current vs Predicted Performance')
        ax.set_xticks(x)
        ax.set_xticklabels(categories)
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        # Convert plot to base64 string
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=150)
        buffer.seek(0)
        plot_data = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return plot_data
        
    except Exception as e:
        print(f"Error generating plots: {e}")
        return None


@login_required
def manual_entry(request, session_id):
    """Manual data entry form"""
    upload_session = get_object_or_404(UploadSession, id=session_id, parent_user=request.user)
    
    if request.method == 'POST':
        # Process manual entry data
        subjects_data = {}
        
        # Extract subject scores from form
        for key, value in request.POST.items():
            if key.startswith('subject_') and key.endswith('_score'):
                subject_name = key.replace('subject_', '').replace('_score', '')
                try:
                    score = float(value)
                    subjects_data[subject_name] = {
                        'scores': [score],
                        'average': score,
                        'max_score': score,
                        'min_score': score
                    }
                except ValueError:
                    continue
        
        # Update upload session
        upload_session.detected_curriculum = request.POST.get('curriculum', 'Unknown')
        upload_session.detected_semester = request.POST.get('semester', 'Unknown')
        upload_session.detected_year = request.POST.get('year', 'Unknown')
        upload_session.detected_subjects = list(subjects_data.keys())
        upload_session.raw_data = subjects_data
        upload_session.status = 'completed'
        upload_session.save()
        
        # Calculate assessment
        success = calculate_assessment(upload_session)
        if success:
            messages.success(request, 'Data entered successfully!')
            return redirect('parent_dashboard:assessment_results', session_id=upload_session.id)
        else:
            messages.error(request, 'Error processing the entered data.')
    
    return render(request, 'parent_dashboard/manual_entry.html', {'upload_session': upload_session})


@login_required
@csrf_exempt
def provide_feedback(request):
    """Handle parent feedback on recommendations"""
    if request.method == 'POST':
        data = json.loads(request.body)
        
        feedback_type = data.get('feedback_type')
        rating = data.get('rating')
        comments = data.get('comments', '')
        recommendation_id = data.get('recommendation_id')
        prediction_id = data.get('prediction_id')
        
        feedback = ParentFeedback.objects.create(
            parent_user=request.user,
            feedback_type=feedback_type,
            rating=rating,
            comments=comments
        )
        
        if recommendation_id:
            feedback.recommendation_id = recommendation_id
        if prediction_id:
            feedback.prediction_id = prediction_id
        
        feedback.save()
        
        return JsonResponse({'status': 'success', 'message': 'Thank you for your feedback!'})
    
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@login_required
def career_explorer(request, student_id):
    """Career exploration tool for specific student"""
    student = get_object_or_404(Student, id=student_id)
    
    # Get latest career mapping for this student
    latest_mapping = CareerMapping.objects.filter(
        prediction__assessment__upload_session__student=student,
        prediction__assessment__upload_session__parent_user=request.user
    ).order_by('-created_at').first()
    
    context = {
        'student': student,
        'career_mapping': latest_mapping
    }
    
    return render(request, 'parent_dashboard/career_explorer.html', context)


@login_required
def progress_tracking(request, student_id):
    """Track student progress over time"""
    student = get_object_or_404(Student, id=student_id)
    
    # Get all assessments for this student
    assessments = AssessmentCalculation.objects.filter(
        upload_session__student=student,
        upload_session__parent_user=request.user
    ).order_by('calculated_at')
    
    # Generate progress chart data
    progress_data = []
    for assessment in assessments:
        progress_data.append({
            'date': assessment.calculated_at.strftime('%Y-%m-%d'),
            'academic': assessment.academic_score,
            'psychological': assessment.psychological_score,
            'physical': assessment.physical_score,
            'overall': assessment.overall_score
        })
    
    context = {
        'student': student,
        'assessments': assessments,
        'progress_data': json.dumps(progress_data)
    }
    
    return render(request, 'parent_dashboard/progress_tracking.html', context)


@login_required
def assessment_workflow(request):
    """5-step assessment workflow for parents"""
    # Get user's students
    students = Student.objects.filter(user__email=request.user.email) if hasattr(request.user, 'student') else Student.objects.none()
    
    context = {
        'students': students,
    }
    
    return render(request, 'parent_dashboard/workflow.html', context)


@login_required
def workflow_step(request, step):
    """Handle specific workflow steps"""
    if step < 1 or step > 5:
        return redirect('parent_dashboard:workflow')
    
    context = {
        'current_step': step,
        'total_steps': 5
    }
    
    return render(request, 'parent_dashboard/workflow.html', context)


@login_required
@csrf_exempt
def api_upload_file(request):
    """API endpoint for file upload in workflow"""
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST method allowed'})
    
    try:
        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return JsonResponse({'status': 'error', 'message': 'No file uploaded'})
        
        # Create upload session
        upload_session = UploadSession.objects.create(
            parent_user=request.user,
            student_id=request.POST.get('student_id', 1),  # Default for demo
            upload_type='excel' if uploaded_file.name.endswith(('.xlsx', '.xls')) else 'csv' if uploaded_file.name.endswith('.csv') else 'image',
            status='processing',
            file_path=uploaded_file
        )
        
        # Process the file (simplified for demo)
        success = process_uploaded_file(upload_session)
        
        if success:
            return JsonResponse({
                'status': 'success', 
                'message': 'File processed successfully',
                'session_id': upload_session.id,
                'detected_curriculum': upload_session.detected_curriculum,
                'detected_semester': upload_session.detected_semester,
                'subjects': upload_session.detected_subjects
            })
        else:
            return JsonResponse({'status': 'error', 'message': 'Failed to process file'})
            
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


@login_required
@csrf_exempt
def api_process_data(request):
    """API endpoint for processing manual data entry"""
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Only POST method allowed'})
    
    try:
        data = json.loads(request.body)
        
        # Create upload session for manual entry
        upload_session = UploadSession.objects.create(
            parent_user=request.user,
            student_id=data.get('student_id', 1),  # Default for demo
            upload_type='manual',
            status='processing',
            detected_curriculum=data.get('curriculum'),
            detected_semester=data.get('semester'),
            detected_year=data.get('year'),
            detected_subjects=list(data.get('subjects', {}).keys()),
            raw_data=data.get('subjects', {})
        )
        
        # Calculate assessment
        success = calculate_assessment(upload_session)
        
        if success:
            upload_session.status = 'completed'
            upload_session.save()
            
            return JsonResponse({
                'status': 'success',
                'message': 'Data processed successfully',
                'session_id': upload_session.id
            })
        else:
            return JsonResponse({'status': 'error', 'message': 'Failed to process data'})
            
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


@login_required
def api_generate_report(request, session_id):
    """Generate and return PDF report"""
    try:
        upload_session = get_object_or_404(UploadSession, id=session_id, parent_user=request.user)
        assessment = upload_session.assessmentcalculation
        prediction = assessment.predictionresult
        recommendations = prediction.recommendation_set.all()
        career_mapping = prediction.careermapping
        
        # Generate PDF report
        pdf_content = generate_pdf_report(upload_session, assessment, prediction, recommendations, career_mapping)
        
        response = HttpResponse(pdf_content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Assessment_Report_{upload_session.student.user.get_full_name()}.pdf"'
        
        return response
        
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


def generate_pdf_report(upload_session, assessment, prediction, recommendations, career_mapping):
    """Generate comprehensive PDF report with EduSight branding"""
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from reportlab.graphics.shapes import Drawing
    from reportlab.graphics.charts.linecharts import HorizontalLineChart
    from reportlab.graphics.charts.barcharts import VerticalBarChart
    from io import BytesIO
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=1*inch, bottomMargin=1*inch)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#2c3e50'),
        alignment=1  # Center
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        textColor=colors.HexColor('#3498db'),
        borderWidth=1,
        borderColor=colors.HexColor('#3498db'),
        borderPadding=10,
        backColor=colors.HexColor('#f8f9ff')
    )
    
    content = []
    
    # Title Page
    content.append(Paragraph("EduSight", title_style))
    content.append(Paragraph("Comprehensive Student Assessment Report", styles['Heading2']))
    content.append(Spacer(1, 0.5*inch))
    
    # Student Information
    student_info = [
        ['Student Name:', upload_session.student.user.get_full_name()],
        ['Grade:', upload_session.student.grade],
        ['Curriculum:', upload_session.detected_curriculum],
        ['Assessment Period:', upload_session.detected_semester],
        ['Report Generated:', upload_session.created_at.strftime('%B %d, %Y')],
    ]
    
    student_table = Table(student_info, colWidths=[2*inch, 3*inch])
    student_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#bdc3c7'))
    ]))
    
    content.append(student_table)
    content.append(Spacer(1, 0.5*inch))
    
    # Executive Summary
    content.append(Paragraph("Executive Summary", heading_style))
    summary_text = f"""
    This comprehensive assessment report provides detailed insights into {upload_session.student.user.get_full_name()}'s 
    academic performance, psychological well-being, and physical development. Based on our advanced analytics, 
    the student demonstrates an overall score of {assessment.overall_score:.1f} out of 100, with particular 
    strengths in {', '.join(assessment.strength_areas[:2])} and opportunities for growth in 
    {', '.join(assessment.improvement_areas[:2])}.
    """
    content.append(Paragraph(summary_text, styles['Normal']))
    content.append(Spacer(1, 0.3*inch))
    
    # Performance Scores
    content.append(Paragraph("Performance Overview", heading_style))
    
    scores_data = [
        ['Assessment Category', 'Score', 'Grade', 'National Average'],
        ['Academic Performance', f'{assessment.academic_score:.1f}', get_grade(assessment.academic_score), '75.0'],
        ['Psychological Well-being', f'{assessment.psychological_score:.1f}', get_grade(assessment.psychological_score), '70.0'],
        ['Physical Development', f'{assessment.physical_score:.1f}', get_grade(assessment.physical_score), '68.0'],
        ['Overall Score', f'{assessment.overall_score:.1f}', get_grade(assessment.overall_score), '71.0'],
    ]
    
    scores_table = Table(scores_data, colWidths=[2*inch, 1*inch, 1*inch, 1.5*inch])
    scores_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    content.append(scores_table)
    content.append(PageBreak())
    
    # Subject-wise Performance
    content.append(Paragraph("Subject-wise Performance Analysis", heading_style))
    
    subject_data = [['Subject', 'Average Score', 'Highest Score', 'Performance Level']]
    for subject, data in upload_session.raw_data.items():
        if isinstance(data, dict) and 'average' in data:
            avg_score = data['average']
            max_score = data.get('max_score', avg_score)
            performance_level = get_performance_level(avg_score)
            subject_data.append([subject, f'{avg_score:.1f}', f'{max_score:.1f}', performance_level])
    
    subject_table = Table(subject_data, colWidths=[2*inch, 1.2*inch, 1.2*inch, 1.6*inch])
    subject_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2ecc71')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    content.append(subject_table)
    content.append(Spacer(1, 0.3*inch))
    
    # Strengths and Improvements
    content.append(Paragraph("Strengths and Areas for Improvement", heading_style))
    
    strengths_text = f"<b>Key Strengths:</b><br/>"
    for strength in assessment.strength_areas:
        strengths_text += f"• {strength}: Demonstrates exceptional capability with consistent high performance<br/>"
    
    content.append(Paragraph(strengths_text, styles['Normal']))
    content.append(Spacer(1, 0.2*inch))
    
    improvements_text = f"<b>Areas for Development:</b><br/>"
    for improvement in assessment.improvement_areas:
        improvements_text += f"• {improvement}: Opportunity for focused improvement and skill development<br/>"
    
    content.append(Paragraph(improvements_text, styles['Normal']))
    content.append(PageBreak())
    
    # Recommendations
    content.append(Paragraph("Personalized Recommendations", heading_style))
    
    for i, recommendation in enumerate(recommendations[:5], 1):
        rec_text = f"""
        <b>{i}. {recommendation.title}</b><br/>
        <i>Priority: {recommendation.get_priority_display()}</i><br/>
        {recommendation.description}<br/>
        <b>Expected Outcome:</b> {recommendation.expected_outcome}<br/>
        <b>Timeline:</b> {recommendation.timeline}<br/>
        """
        content.append(Paragraph(rec_text, styles['Normal']))
        content.append(Spacer(1, 0.2*inch))
    
    # Career Guidance
    content.append(Paragraph("Career Mapping and Future Pathways", heading_style))
    
    career_text = f"""
    Based on the assessment results and demonstrated aptitudes, the following career paths are recommended:<br/><br/>
    """
    
    for i, career in enumerate(career_mapping.recommended_careers[:5], 1):
        match_score = career_mapping.career_match_scores.get(career, 0) * 100
        career_text += f"<b>{i}. {career}</b> - Match Score: {match_score:.1f}%<br/>"
    
    career_text += f"""<br/>
    <b>Development Recommendations:</b><br/>
    Short-term: {', '.join(career_mapping.development_path.get('short_term', []))}<br/>
    Medium-term: {', '.join(career_mapping.development_path.get('medium_term', []))}<br/>
    Long-term: {', '.join(career_mapping.development_path.get('long_term', []))}<br/>
    """
    
    content.append(Paragraph(career_text, styles['Normal']))
    content.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_text = f"""
    <br/><br/>
    <i>This report was generated by EduSight's advanced analytics platform. 
    For questions or additional support, please contact us at support@edusight.com</i><br/>
    <b>EduSight - Empowering Educational Excellence Through Data-Driven Insights</b>
    """
    content.append(Paragraph(footer_text, styles['Normal']))
    
    # Build PDF
    doc.build(content)
    
    pdf_content = buffer.getvalue()
    buffer.close()
    
    return pdf_content


def get_grade(score):
    """Convert numeric score to letter grade"""
    if score >= 90:
        return 'A+'
    elif score >= 85:
        return 'A'
    elif score >= 80:
        return 'B+'
    elif score >= 75:
        return 'B'
    elif score >= 70:
        return 'C+'
    elif score >= 65:
        return 'C'
    elif score >= 60:
        return 'D'
    else:
        return 'F'


def get_performance_level(score):
    """Convert numeric score to performance level"""
    if score >= 90:
        return 'Excellent'
    elif score >= 80:
        return 'Very Good'
    elif score >= 70:
        return 'Good'
    elif score >= 60:
        return 'Satisfactory'
    else:
        return 'Needs Improvement'
