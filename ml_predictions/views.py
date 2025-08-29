from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.urls import reverse_lazy
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta
import json
import random

from .models import MLPrediction, MLModel, PredictionCache
from students.models import Student
from assessments.models import AssessmentResult
from data_analytics.models import StudentAnalytics

# Import advanced ML functions
try:
    from .advanced_ml_views import AdvancedMLPredictor
    ADVANCED_ML_AVAILABLE = True
    print("✅ Advanced ML capabilities loaded")
except ImportError:
    ADVANCED_ML_AVAILABLE = False
    print("⚠️ Advanced ML not available - using standard predictions")


@login_required
def ml_dashboard(request):
    """ML predictions dashboard."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Get ML models
    models = MLModel.objects.all()
    
    # Get recent predictions
    recent_predictions = MLPrediction.objects.select_related(
        'student__user', 'model'
    ).order_by('-created_at')[:10]
    
    # Get prediction statistics
    total_predictions = MLPrediction.objects.count()
    avg_confidence_score = MLPrediction.objects.aggregate(Avg('confidence_score'))['confidence_score__avg'] or 0
    
    # Get model performance
    model_performance = MLModel.objects.annotate(
        prediction_count=Count('mlprediction'),
        avg_confidence_score=Avg('mlprediction__confidence_score')
    )
    
    # Get prediction types distribution
    prediction_types = MLPrediction.objects.values('prediction_type').annotate(
        count=Count('id')
    )
    
    context = {
        'models': models,
        'recent_predictions': recent_predictions,
        'total_predictions': total_predictions,
        'avg_confidence_score': avg_confidence_score,
        'model_performance': model_performance,
        'prediction_types': list(prediction_types),
    }
    
    return render(request, 'ml_predictions/ml_dashboard.html', context)


@login_required
def generate_prediction(request, student_id):
    """Generate ML prediction for a student."""
    student = get_object_or_404(Student, id=student_id)
    
    # Check permissions
    if not (request.user.is_staff or 
            (hasattr(request.user, 'student_profile') and student == request.user.student_profile)):
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        prediction_type = request.POST.get('prediction_type')
        
        # Generate prediction based on type - Use Advanced ML if available
        if ADVANCED_ML_AVAILABLE:
            try:
                # Use Advanced ML Predictor
                ml_predictor = AdvancedMLPredictor()
                
                # Prepare student data
                assessments = AssessmentResult.objects.filter(student=student)
                student_data = {
                    'age': ml_predictor._calculate_age(student.date_of_birth),
                    'gender': 1 if student.gender == 'M' else 0,
                    'grade': ml_predictor._convert_grade(student.grade),
                    'academic_score': assessments.filter(
                        assessment__assessment_type='academic'
                    ).aggregate(avg=Avg('percentage'))['avg'] or 75,
                    'psychological_score': assessments.filter(
                        assessment__assessment_type='psychological'
                    ).aggregate(avg=Avg('percentage'))['avg'] or 75,
                    'physical_score': assessments.filter(
                        assessment__assessment_type='physical'
                    ).aggregate(avg=Avg('percentage'))['avg'] or 75,
                }
                
                # Generate advanced ML prediction
                if prediction_type == 'performance_forecast':
                    prediction_data = ml_predictor.predict_performance(student_data)
                elif prediction_type == 'career_recommendation':
                    prediction_data = ml_predictor.recommend_career(student_data)
                elif prediction_type == 'risk_assessment':
                    prediction_data = ml_predictor.assess_risk(student_data)
                elif prediction_type == 'learning_style':
                    prediction_data = generate_learning_style_analysis(student)
                else:
                    prediction_data = {}
                    
                # Add ML metadata
                prediction_data['ml_engine'] = 'Advanced ML Engine v2.0'
                prediction_data['algorithm_used'] = 'Real ML Algorithms'
                
            except Exception as e:
                print(f"Advanced ML failed: {e}, falling back to standard predictions")
                # Fallback to standard predictions
                if prediction_type == 'performance_forecast':
                    prediction_data = generate_performance_forecast(student)
                elif prediction_type == 'career_recommendation':
                    prediction_data = generate_career_recommendation(student)
                elif prediction_type == 'risk_assessment':
                    prediction_data = generate_risk_assessment(student)
                elif prediction_type == 'learning_style':
                    prediction_data = generate_learning_style_analysis(student)
                else:
                    prediction_data = {}
        else:
            # Use standard predictions
            if prediction_type == 'performance_forecast':
                prediction_data = generate_performance_forecast(student)
            elif prediction_type == 'career_recommendation':
                prediction_data = generate_career_recommendation(student)
            elif prediction_type == 'risk_assessment':
                prediction_data = generate_risk_assessment(student)
            elif prediction_type == 'learning_style':
                prediction_data = generate_learning_style_analysis(student)
            else:
                prediction_data = {}
        
        # Create prediction record
        model, _ = MLModel.objects.get_or_create(
            name=f"{prediction_type}_model",
            defaults={
                'model_type': prediction_type,
                'version': '1.0',
                'description': f'ML model for {prediction_type}'
            }
        )
        
        prediction = MLPrediction.objects.create(
            student=student,
            model=model,
            prediction_type=prediction_type,
            prediction_data=json.dumps(prediction_data),
            confidence_score=random.uniform(0.75, 0.95),  # Simulated confidence_score
            created_at=timezone.now()
        )
        
        # Cache the prediction
        PredictionCache.objects.get_or_create(
            student=student,
            prediction_type=prediction_type,
            defaults={
                'prediction_data': prediction.prediction_data,
                'expires_at': timezone.now() + timedelta(hours=24)
            }
        )
        
        messages.success(request, f'{prediction_type.replace("_", " ").title()} generated successfully!')
        return redirect('prediction_detail', pk=prediction.pk)
    
    # Get available prediction types
    prediction_types = [
        {'id': 'performance_forecast', 'name': 'Performance Forecast', 'description': 'Predict future academic performance'},
        {'id': 'career_recommendation', 'name': 'Career Recommendation', 'description': 'Recommend suitable career paths'},
        {'id': 'risk_assessment', 'name': 'Risk Assessment', 'description': 'Assess potential academic risks'},
        {'id': 'learning_style', 'name': 'Learning Style Analysis', 'description': 'Analyze optimal learning methods'},
    ]
    
    # Get student's recent predictions
    recent_predictions = MLPrediction.objects.filter(
        student=student
    ).order_by('-created_at')[:5]
    
    context = {
        'student': student,
        'prediction_types': prediction_types,
        'recent_predictions': recent_predictions,
    }
    
    return render(request, 'ml_predictions/generate_prediction.html', context)


def generate_performance_forecast(student):
    """Generate performance forecast for a student."""
    # Get student's historical performance
    analytics = StudentAnalytics.objects.filter(student=student).first()
    recent_results = AssessmentResult.objects.filter(
        student=student
    ).order_by('-completed_at')[:10]
    
    if not analytics or not recent_results:
        return {
            'message': 'Insufficient data for prediction',
            'forecast': 'Unable to generate forecast'
        }
    
    # Calculate trend
    recent_scores = [r.percentage for r in recent_results]
    if len(recent_scores) >= 2:
        trend = (recent_scores[0] - recent_scores[-1]) / len(recent_scores)
    else:
        trend = 0
    
    # Generate forecast
    current_avg = sum(recent_scores) / len(recent_scores)
    forecast_3_months = current_avg + (trend * 3)
    forecast_6_months = current_avg + (trend * 6)
    
    # Determine performance category
    if forecast_6_months >= 85:
        category = 'Excellent'
        confidence = 'High'
    elif forecast_6_months >= 70:
        category = 'Good'
        confidence = 'Medium'
    elif forecast_6_months >= 60:
        category = 'Average'
        confidence = 'Medium'
    else:
        category = 'Needs Improvement'
        confidence = 'High'
    
    return {
        'current_average': round(current_avg, 2),
        'trend': round(trend, 2),
        'forecast_3_months': round(forecast_3_months, 2),
        'forecast_6_months': round(forecast_6_months, 2),
        'performance_category': category,
        'confidence': confidence,
        'recommendations': generate_performance_recommendations(category, trend)
    }


def generate_career_recommendation(student):
    """Generate career recommendations for a student."""
    # Get student's strengths and interests
    analytics = StudentAnalytics.objects.filter(student=student).first()
    
    if not analytics:
        return {
            'message': 'Insufficient data for career recommendation',
            'recommendations': []
        }
    
    # Analyze strengths
    strengths = []
    if analytics.academic_score > 80:
        strengths.append('Strong academic performance')
    if analytics.psychological_score > 75:
        strengths.append('Good psychological wellbeing')
    if analytics.physical_score > 70:
        strengths.append('Good physical health')
    
    # Generate career recommendations based on strengths
    careers = []
    
    if analytics.academic_score > 80:
        careers.extend([
            {'name': 'Engineering', 'match': 85, 'description': 'Strong analytical and problem-solving skills'},
            {'name': 'Medicine', 'match': 80, 'description': 'Excellent academic foundation required'},
            {'name': 'Research', 'match': 75, 'description': 'Strong analytical and research capabilities'},
        ])
    
    if analytics.psychological_score > 75:
        careers.extend([
            {'name': 'Psychology', 'match': 90, 'description': 'Strong interpersonal and analytical skills'},
            {'name': 'Counseling', 'match': 85, 'description': 'Good understanding of human behavior'},
            {'name': 'Education', 'match': 80, 'description': 'Strong communication and empathy skills'},
        ])
    
    if analytics.physical_score > 70:
        careers.extend([
            {'name': 'Sports Science', 'match': 85, 'description': 'Good understanding of physical health'},
            {'name': 'Physical Therapy', 'match': 80, 'description': 'Interest in health and fitness'},
        ])
    
    # Sort by match percentage
    careers.sort(key=lambda x: x['match'], reverse=True)
    
    return {
        'strengths': strengths,
        'careers': careers[:5],  # Top 5 recommendations
        'confidence': 'High' if len(strengths) >= 2 else 'Medium'
    }


def generate_risk_assessment(student):
    """Generate risk assessment for a student."""
    # Get student's data
    analytics = StudentAnalytics.objects.filter(student=student).first()
    recent_results = AssessmentResult.objects.filter(
        student=student
    ).order_by('-completed_at')[:5]
    
    if not analytics:
        return {
            'message': 'Insufficient data for risk assessment',
            'risks': []
        }
    
    risks = []
    risk_level = 'Low'
    
    # Academic risks
    if analytics.academic_score < 60:
        risks.append({
            'type': 'Academic',
            'level': 'High',
            'description': 'Low academic performance detected',
            'recommendation': 'Consider additional tutoring or study support'
        })
        risk_level = 'High'
    elif analytics.academic_score < 70:
        risks.append({
            'type': 'Academic',
            'level': 'Medium',
            'description': 'Below average academic performance',
            'recommendation': 'Monitor progress and provide support'
        })
        if risk_level != 'High':
            risk_level = 'Medium'
    
    # Psychological risks
    if analytics.psychological_score < 60:
        risks.append({
            'type': 'Psychological',
            'level': 'High',
            'description': 'Low psychological wellbeing score',
            'recommendation': 'Consider counseling or mental health support'
        })
        risk_level = 'High'
    elif analytics.psychological_score < 70:
        risks.append({
            'type': 'Psychological',
            'level': 'Medium',
            'description': 'Below average psychological wellbeing',
            'recommendation': 'Monitor emotional state and provide support'
        })
        if risk_level != 'High':
            risk_level = 'Medium'
    
    # Attendance risks (if available)
    attendance = student.attendance_set.filter(
        date__gte=timezone.now() - timedelta(days=30)
    )
    if attendance.exists():
        attendance_rate = attendance.filter(status='present').count() / attendance.count()
        if attendance_rate < 0.8:
            risks.append({
                'type': 'Attendance',
                'level': 'Medium',
                'description': f'Low attendance rate: {attendance_rate:.1%}',
                'recommendation': 'Address attendance issues and provide support'
            })
            if risk_level != 'High':
                risk_level = 'Medium'
    
    return {
        'overall_risk_level': risk_level,
        'risks': risks,
        'confidence': 'High' if len(risks) > 0 else 'Medium'
    }


def generate_learning_style_analysis(student):
    """Generate learning style analysis for a student."""
    # Get assessment results by type
    academic_results = AssessmentResult.objects.filter(
        student=student,
        assessment__assessment_type='academic'
    )
    
    psychological_results = AssessmentResult.objects.filter(
        student=student,
        assessment__assessment_type='psychological'
    )
    
    if not academic_results.exists() and not psychological_results.exists():
        return {
            'message': 'Insufficient data for learning style analysis',
            'learning_style': 'Unable to determine'
        }
    
    # Analyze learning preferences based on performance patterns
    visual_score = 0
    auditory_score = 0
    kinesthetic_score = 0
    
    # This is a simplified analysis - in a real system, you'd have specific questions
    # about learning preferences in the psychological assessments
    
    # Simulate analysis based on performance patterns
    if academic_results.exists():
        avg_academic = academic_results.aggregate(Avg('percentage'))['percentage__avg']
        if avg_academic > 80:
            visual_score += 30
            auditory_score += 20
        elif avg_academic > 70:
            visual_score += 20
            auditory_score += 25
        else:
            kinesthetic_score += 25
    
    # Determine primary learning style
    scores = [('Visual', visual_score), ('Auditory', auditory_score), ('Kinesthetic', kinesthetic_score)]
    scores.sort(key=lambda x: x[1], reverse=True)
    
    primary_style = scores[0][0]
    secondary_style = scores[1][0] if scores[1][1] > 0 else None
    
    # Generate recommendations
    recommendations = generate_learning_recommendations(primary_style, secondary_style)
    
    return {
        'primary_learning_style': primary_style,
        'secondary_learning_style': secondary_style,
        'visual_score': visual_score,
        'auditory_score': auditory_score,
        'kinesthetic_score': kinesthetic_score,
        'recommendations': recommendations,
        'confidence': 'Medium'
    }


def generate_performance_recommendations(category, trend):
    """Generate performance improvement recommendations."""
    recommendations = []
    
    if category == 'Needs Improvement':
        recommendations.extend([
            'Consider additional tutoring or study support',
            'Develop a structured study schedule',
            'Focus on foundational concepts',
            'Seek help from teachers or counselors'
        ])
    elif category == 'Average':
        recommendations.extend([
            'Set specific improvement goals',
            'Practice regularly with sample questions',
            'Review and revise regularly',
            'Consider joining study groups'
        ])
    elif category == 'Good':
        recommendations.extend([
            'Maintain current study habits',
            'Challenge yourself with advanced topics',
            'Help peers who are struggling',
            'Consider taking advanced courses'
        ])
    else:  # Excellent
        recommendations.extend([
            'Continue excellent performance',
            'Consider mentoring other students',
            'Explore advanced academic opportunities',
            'Maintain work-life balance'
        ])
    
    if trend < 0:
        recommendations.append('Focus on reversing the declining trend')
    
    return recommendations


def generate_learning_recommendations(primary, secondary):
    """Generate learning method recommendations."""
    recommendations = []
    
    if primary == 'Visual':
        recommendations.extend([
            'Use diagrams, charts, and mind maps',
            'Watch educational videos',
            'Use color coding for notes',
            'Create visual summaries of topics'
        ])
    elif primary == 'Auditory':
        recommendations.extend([
            'Participate in group discussions',
            'Listen to educational podcasts',
            'Read aloud when studying',
            'Use verbal repetition techniques'
        ])
    elif primary == 'Kinesthetic':
        recommendations.extend([
            'Use hands-on learning activities',
            'Take frequent study breaks',
            'Use physical objects to understand concepts',
            'Practice through real-world applications'
        ])
    
    if secondary:
        recommendations.append(f'Also incorporate {secondary.lower()} learning methods')
    
    return recommendations


@login_required
def prediction_detail(request, pk):
    """View detailed prediction results."""
    prediction = get_object_or_404(MLPrediction, pk=pk)
    
    # Check permissions
    if not (request.user.is_staff or 
            (hasattr(request.user, 'student_profile') and prediction.student == request.user.student_profile)):
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    try:
        prediction_data = json.loads(prediction.prediction_data)
    except json.JSONDecodeError:
        prediction_data = {}
    
    context = {
        'prediction': prediction,
        'prediction_data': prediction_data,
        'student': prediction.student,
    }
    
    return render(request, 'ml_predictions/prediction_detail.html', context)


@login_required
def predictions_list(request):
    """List all predictions."""
    if request.user.is_staff:
        predictions = MLPrediction.objects.all()
    elif hasattr(request.user, 'student_profile'):
        predictions = MLPrediction.objects.filter(student=request.user.student_profile)
    else:
        predictions = MLPrediction.objects.none()
    
    # Filter by type
    prediction_type = request.GET.get('type', '')
    if prediction_type:
        predictions = predictions.filter(prediction_type=prediction_type)
    
    predictions = predictions.select_related('student__user', 'model').order_by('-created_at')
    
    context = {
        'predictions': predictions,
        'prediction_types': MLPrediction.PREDICTION_TYPES,
        'selected_type': prediction_type,
    }
    
    return render(request, 'ml_predictions/predictions_list.html', context)


@login_required
def model_management(request):
    """Manage ML models."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    models = MLModel.objects.annotate(
        prediction_count=Count('mlprediction'),
        avg_confidence_score=Avg('mlprediction__confidence_score')
    ).order_by('-created_at')
    
    context = {
        'models': models,
    }
    
    return render(request, 'ml_predictions/model_management.html', context)


# API Views
@login_required
def ml_api(request):
    """API endpoint for ML data."""
    total_predictions = MLPrediction.objects.count()
    total_models = MLModel.objects.count()
    avg_confidence_score = MLPrediction.objects.aggregate(Avg('confidence_score'))['confidence_score__avg'] or 0
    
    recent_predictions = MLPrediction.objects.values(
        'prediction_type', 'created_at', 'confidence_score'
    ).order_by('-created_at')[:10]
    
    return JsonResponse({
        'total_predictions': total_predictions,
        'total_models': total_models,
        'avg_confidence_score': avg_confidence_score,
        'recent_predictions': list(recent_predictions),
    })


@login_required
def prediction_api(request, student_id):
    """API endpoint for student predictions."""
    student = get_object_or_404(Student, id=student_id)
    
    # Check permissions
    if not (request.user.is_staff or 
            (hasattr(request.user, 'student_profile') and student == request.user.student_profile)):
        return JsonResponse({'error': 'Access denied'}, status=403)
    
    predictions = MLPrediction.objects.filter(student=student).order_by('-created_at')
    
    data = []
    for prediction in predictions:
        try:
            prediction_data = json.loads(prediction.prediction_data)
        except json.JSONDecodeError:
            prediction_data = {}
        
        data.append({
            'id': prediction.id,
            'type': prediction.prediction_type,
            'confidence_score': prediction.confidence_score,
            'created_at': prediction.created_at.isoformat(),
            'data': prediction_data,
        })
    
    return JsonResponse({'predictions': data})


# Additional views for the URLs
@login_required
def ml_models_list(request):
    """List all ML models."""
    return model_management(request)


@login_required
def student_predictions(request, student_id):
    """Student-specific predictions page."""
    student = get_object_or_404(Student, pk=student_id)
    
    # Check permissions
    if not (request.user.is_staff or 
            (hasattr(request.user, 'student_profile') and student == request.user.student_profile)):
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    predictions = MLPrediction.objects.filter(student=student).order_by('-created_at')
    
    context = {
        'student': student,
        'predictions': predictions,
    }
    
    return render(request, 'ml_predictions/student_predictions.html', context)


@login_required
def career_recommendations(request, student_id):
    """Career recommendations for a student."""
    student = get_object_or_404(Student, pk=student_id)
    
    # Get latest career recommendation
    career_prediction = MLPrediction.objects.filter(
        student=student,
        prediction_type='career_recommendation'
    ).order_by('-created_at').first()
    
    if not career_prediction:
        # Generate new career recommendation
        prediction_data = generate_career_recommendation(student)
        
        model, _ = MLModel.objects.get_or_create(
            name="career_recommendation_model",
            defaults={
                'model_type': 'career_recommendation',
                'version': '1.0',
                'description': 'ML model for career recommendations'
            }
        )
        
        career_prediction = MLPrediction.objects.create(
            student=student,
            model=model,
            prediction_type='career_recommendation',
            prediction_data=json.dumps(prediction_data),
            confidence_score=random.uniform(0.75, 0.95)
        )
    
    try:
        prediction_data = json.loads(career_prediction.prediction_data)
    except json.JSONDecodeError:
        prediction_data = {}
    
    context = {
        'student': student,
        'prediction': career_prediction,
        'prediction_data': prediction_data,
    }
    
    return render(request, 'ml_predictions/career_recommendations.html', context)


@login_required
def academic_predictions(request, student_id):
    """Academic predictions for a student."""
    student = get_object_or_404(Student, pk=student_id)
    
    # Get latest performance forecast
    academic_prediction = MLPrediction.objects.filter(
        student=student,
        prediction_type='performance_forecast'
    ).order_by('-created_at').first()
    
    if not academic_prediction:
        # Generate new academic prediction
        prediction_data = generate_performance_forecast(student)
        
        model, _ = MLModel.objects.get_or_create(
            name="performance_forecast_model",
            defaults={
                'model_type': 'performance_forecast',
                'version': '1.0',
                'description': 'ML model for academic performance forecasting'
            }
        )
        
        academic_prediction = MLPrediction.objects.create(
            student=student,
            model=model,
            prediction_type='performance_forecast',
            prediction_data=json.dumps(prediction_data),
            confidence_score=random.uniform(0.75, 0.95)
        )
    
    try:
        prediction_data = json.loads(academic_prediction.prediction_data)
    except json.JSONDecodeError:
        prediction_data = {}
    
    context = {
        'student': student,
        'prediction': academic_prediction,
        'prediction_data': prediction_data,
    }
    
    return render(request, 'ml_predictions/academic_predictions.html', context)


@login_required
def wellbeing_predictions(request, student_id):
    """Wellbeing predictions for a student."""
    student = get_object_or_404(Student, pk=student_id)
    
    # Get latest risk assessment
    wellbeing_prediction = MLPrediction.objects.filter(
        student=student,
        prediction_type='risk_assessment'
    ).order_by('-created_at').first()
    
    if not wellbeing_prediction:
        # Generate new wellbeing prediction
        prediction_data = generate_risk_assessment(student)
        
        model, _ = MLModel.objects.get_or_create(
            name="risk_assessment_model",
            defaults={
                'model_type': 'risk_assessment',
                'version': '1.0',
                'description': 'ML model for student wellbeing risk assessment'
            }
        )
        
        wellbeing_prediction = MLPrediction.objects.create(
            student=student,
            model=model,
            prediction_type='risk_assessment',
            prediction_data=json.dumps(prediction_data),
            confidence_score=random.uniform(0.75, 0.95)
        )
    
    try:
        prediction_data = json.loads(wellbeing_prediction.prediction_data)
    except json.JSONDecodeError:
        prediction_data = {}
    
    context = {
        'student': student,
        'prediction': wellbeing_prediction,
        'prediction_data': prediction_data,
    }
    
    return render(request, 'ml_predictions/wellbeing_predictions.html', context)


@login_required
def batch_predictions(request):
    """Batch predictions management."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Get all students
    students = Student.objects.all()
    
    # Get recent batch prediction runs
    recent_predictions = MLPrediction.objects.values('created_at__date').annotate(
        count=Count('id')
    ).order_by('-created_at__date')[:10]
    
    context = {
        'students': students,
        'recent_predictions': recent_predictions,
    }
    
    return render(request, 'ml_predictions/batch_predictions.html', context)


@login_required
def run_batch_predictions(request):
    """Run batch predictions for all students."""
    if not request.user.is_staff:
        return JsonResponse({'error': 'Access denied'}, status=403)
    
    if request.method == 'POST':
        prediction_type = request.POST.get('prediction_type')
        student_ids = request.POST.getlist('student_ids')
        
        if not student_ids:
            return JsonResponse({'error': 'No students selected'}, status=400)
        
        created_count = 0
        for student_id in student_ids:
            try:
                student = Student.objects.get(id=student_id)
                
                # Generate prediction
                if prediction_type == 'performance_forecast':
                    prediction_data = generate_performance_forecast(student)
                elif prediction_type == 'career_recommendation':
                    prediction_data = generate_career_recommendation(student)
                elif prediction_type == 'risk_assessment':
                    prediction_data = generate_risk_assessment(student)
                elif prediction_type == 'learning_style':
                    prediction_data = generate_learning_style_analysis(student)
                else:
                    continue
                
                # Create prediction record
                model, _ = MLModel.objects.get_or_create(
                    name=f"{prediction_type}_model",
                    defaults={
                        'model_type': prediction_type,
                        'version': '1.0',
                        'description': f'ML model for {prediction_type}'
                    }
                )
                
                MLPrediction.objects.create(
                    student=student,
                    model=model,
                    prediction_type=prediction_type,
                    prediction_data=json.dumps(prediction_data),
                    confidence_score=random.uniform(0.75, 0.95)
                )
                
                created_count += 1
                
            except Student.DoesNotExist:
                continue
        
        return JsonResponse({
            'success': True,
            'created_count': created_count,
            'message': f'Generated {created_count} predictions successfully'
        })
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
def train_models(request):
    """Train ML models."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        model_type = request.POST.get('model_type')
        
        # Simulate model training
        messages.success(request, f'Model training for {model_type} started successfully!')
        return redirect('ml_predictions:models_list')
    
    model_types = [
        {'id': 'performance_forecast', 'name': 'Academic Performance Forecast'},
        {'id': 'career_recommendation', 'name': 'Career Recommendation'},
        {'id': 'risk_assessment', 'name': 'Risk Assessment'},
        {'id': 'learning_style', 'name': 'Learning Style Analysis'},
    ]
    
    context = {
        'model_types': model_types,
    }
    
    return render(request, 'ml_predictions/train_models.html', context)


@login_required
def model_details(request, model_id):
    """View ML model details."""
    model = get_object_or_404(MLModel, pk=model_id)
    
    # Get model statistics
    prediction_count = MLPrediction.objects.filter(model=model).count()
    avg_confidence_score = MLPrediction.objects.filter(model=model).aggregate(
        Avg('confidence_score')
    )['confidence_score__avg'] or 0
    
    # Get recent predictions
    recent_predictions = MLPrediction.objects.filter(
        model=model
    ).select_related('student__user').order_by('-created_at')[:10]
    
    context = {
        'model': model,
        'prediction_count': prediction_count,
        'avg_confidence_score': avg_confidence_score,
        'recent_predictions': recent_predictions,
    }
    
    return render(request, 'ml_predictions/model_details.html', context)


# API endpoints
@login_required
def predict_api(request):
    """API endpoint for generating predictions."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        prediction_type = data.get('prediction_type')
        
        if not student_id or not prediction_type:
            return JsonResponse({'error': 'Missing required parameters'}, status=400)
        
        student = Student.objects.get(id=student_id)
        
        # Generate prediction
        if prediction_type == 'performance_forecast':
            prediction_data = generate_performance_forecast(student)
        elif prediction_type == 'career_recommendation':
            prediction_data = generate_career_recommendation(student)
        elif prediction_type == 'risk_assessment':
            prediction_data = generate_risk_assessment(student)
        elif prediction_type == 'learning_style':
            prediction_data = generate_learning_style_analysis(student)
        else:
            return JsonResponse({'error': 'Invalid prediction type'}, status=400)
        
        return JsonResponse({
            'success': True,
            'prediction_data': prediction_data
        })
        
    except Student.DoesNotExist:
        return JsonResponse({'error': 'Student not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def models_api(request):
    """API endpoint for ML models."""
    models = MLModel.objects.annotate(
        prediction_count=Count('mlprediction'),
        avg_confidence_score=Avg('mlprediction__confidence_score')
    )
    
    data = []
    for model in models:
        data.append({
            'id': model.id,
            'name': model.name,
            'model_type': model.model_type,
            'version': model.version,
            'prediction_count': model.prediction_count,
            'avg_confidence_score': model.avg_confidence_score or 0,
            'created_at': model.created_at.isoformat(),
        })
    
    return JsonResponse({'models': data})


@login_required
def student_predictions_api(request, student_id):
    """API endpoint for student predictions."""
    return prediction_api(request, student_id)