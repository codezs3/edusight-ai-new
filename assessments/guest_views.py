"""
Guest assessment views - No registration required.
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import uuid
import os
from datetime import datetime, timedelta

from .forms import GuestAssessmentForm, CareerMappingForm, AIAnalysisForm
from .models import Assessment, AssessmentResult
from .ml_service import MLAssessmentService
from .psychometric_service import PsychometricTestService


def guest_assessment_landing(request):
    """Landing page for guest assessment."""
    context = {
        'title': 'Guest Assessment - EduSight AI',
        'description': 'Experience AI-powered assessment without registration',
        'features': [
            'No registration required',
            'AI-powered analysis',
            'Career mapping insights',
            'Comprehensive reports',
            'Instant results'
        ]
    }
    return render(request, 'assessments/guest_landing.html', context)


def guest_assessment_form(request):
    """Guest assessment form."""
    if request.method == 'POST':
        form = GuestAssessmentForm(request.POST)
        if form.is_valid():
            # Create guest session
            session_id = str(uuid.uuid4())
            guest_data = {
                'session_id': session_id,
                'student_name': form.cleaned_data['student_name'],
                'student_age': form.cleaned_data['student_age'],
                'student_grade': form.cleaned_data['student_grade'],
                'parent_name': form.cleaned_data['parent_name'],
                'parent_email': form.cleaned_data['parent_email'],
                'parent_phone': form.cleaned_data['parent_phone'],
                'assessment_type': form.cleaned_data['assessment_type'],
                'curriculum': form.cleaned_data['curriculum'],
                'special_requirements': form.cleaned_data['special_requirements'],
                'created_at': timezone.now().isoformat(),
                'status': 'form_completed'
            }
            
            # Store in session
            request.session['guest_assessment'] = guest_data
            
            messages.success(request, 'Assessment form submitted successfully!')
            return redirect('guest_assessment_upload', session_id=session_id)
    else:
        form = GuestAssessmentForm()
    
    context = {
        'form': form,
        'title': 'Guest Assessment Form'
    }
    return render(request, 'assessments/guest_form.html', context)


def guest_assessment_upload(request, session_id):
    """Document upload for guest assessment."""
    guest_data = request.session.get('guest_assessment')
    if not guest_data or guest_data.get('session_id') != session_id:
        messages.error(request, 'Invalid session. Please start over.')
        return redirect('guest_assessment_landing')
    
    if request.method == 'POST':
        # Handle file uploads
        uploaded_files = []
        for key, file in request.FILES.items():
            if file:
                # Save file
                filename = f"guest_{session_id}_{file.name}"
                file_path = default_storage.save(f"guest_uploads/{filename}", file)
                uploaded_files.append({
                    'name': file.name,
                    'path': file_path,
                    'size': file.size,
                    'type': file.content_type
                })
        
        if uploaded_files:
            # Update guest data
            guest_data['uploaded_files'] = uploaded_files
            guest_data['status'] = 'files_uploaded'
            request.session['guest_assessment'] = guest_data
            
            messages.success(request, f'{len(uploaded_files)} files uploaded successfully!')
            return redirect('guest_assessment_workflow', session_id=session_id)
        else:
            messages.error(request, 'Please upload at least one document.')
    
    context = {
        'session_id': session_id,
        'student_name': guest_data.get('student_name'),
        'title': 'Upload Documents'
    }
    return render(request, 'assessments/guest_upload.html', context)


def guest_assessment_workflow(request, session_id):
    """Guest assessment workflow processing."""
    guest_data = request.session.get('guest_assessment')
    if not guest_data or guest_data.get('session_id') != session_id:
        messages.error(request, 'Invalid session. Please start over.')
        return redirect('guest_assessment_landing')
    
    # Initialize ML service
    ml_service = MLAssessmentService()
    psychometric_service = PsychometricTestService()
    
    if request.method == 'POST':
        # Start assessment workflow
        try:
            # Process uploaded documents
            uploaded_files = guest_data.get('uploaded_files', [])
            if not uploaded_files:
                messages.error(request, 'No files uploaded. Please upload documents first.')
                return redirect('guest_assessment_upload', session_id=session_id)
            
            # Create assessment session
            assessment_data = {
                'session_id': session_id,
                'student_name': guest_data['student_name'],
                'student_age': guest_data['student_age'],
                'student_grade': guest_data['student_grade'],
                'assessment_type': guest_data['assessment_type'],
                'curriculum': guest_data['curriculum'],
                'files': uploaded_files,
                'started_at': timezone.now().isoformat(),
                'status': 'processing'
            }
            
            # Update guest data
            guest_data['assessment_data'] = assessment_data
            guest_data['status'] = 'processing'
            request.session['guest_assessment'] = guest_data
            
            # Start AI processing
            results = process_guest_assessment(assessment_data, ml_service, psychometric_service)
            
            # Store results
            guest_data['results'] = results
            guest_data['status'] = 'completed'
            guest_data['completed_at'] = timezone.now().isoformat()
            request.session['guest_assessment'] = guest_data
            
            messages.success(request, 'Assessment completed successfully!')
            return redirect('guest_assessment_results', session_id=session_id)
            
        except Exception as e:
            messages.error(request, f'Error processing assessment: {str(e)}')
            return redirect('guest_assessment_workflow', session_id=session_id)
    
    context = {
        'session_id': session_id,
        'student_name': guest_data.get('student_name'),
        'uploaded_files': guest_data.get('uploaded_files', []),
        'title': 'Assessment Processing'
    }
    return render(request, 'assessments/guest_workflow.html', context)


def guest_assessment_results(request, session_id):
    """Display guest assessment results."""
    guest_data = request.session.get('guest_assessment')
    if not guest_data or guest_data.get('session_id') != session_id:
        messages.error(request, 'Invalid session. Please start over.')
        return redirect('guest_assessment_landing')
    
    results = guest_data.get('results')
    if not results:
        messages.error(request, 'No results found. Please complete the assessment.')
        return redirect('guest_assessment_workflow', session_id=session_id)
    
    context = {
        'session_id': session_id,
        'student_name': guest_data.get('student_name'),
        'results': results,
        'assessment_data': guest_data.get('assessment_data'),
        'title': 'Assessment Results'
    }
    return render(request, 'assessments/guest_results.html', context)


def guest_career_mapping(request, session_id):
    """Career mapping for guest assessment."""
    guest_data = request.session.get('guest_assessment')
    if not guest_data or guest_data.get('session_id') != session_id:
        messages.error(request, 'Invalid session. Please start over.')
        return redirect('guest_assessment_landing')
    
    if request.method == 'POST':
        form = CareerMappingForm(request.POST)
        if form.is_valid():
            # Process career mapping
            career_data = {
                'academic_strengths': form.cleaned_data['academic_strengths'],
                'academic_weaknesses': form.cleaned_data['academic_weaknesses'],
                'interests': form.cleaned_data['interests'],
                'preferred_career_fields': form.cleaned_data['preferred_career_fields'],
                'personality_type': form.cleaned_data['personality_type'],
                'work_environment': form.cleaned_data['work_environment'],
                'short_term_goals': form.cleaned_data['short_term_goals'],
                'long_term_goals': form.cleaned_data['long_term_goals'],
                'mapped_at': timezone.now().isoformat()
            }
            
            # Generate career recommendations
            career_recommendations = generate_career_recommendations(career_data, guest_data)
            
            # Update guest data
            guest_data['career_mapping'] = career_data
            guest_data['career_recommendations'] = career_recommendations
            request.session['guest_assessment'] = guest_data
            
            messages.success(request, 'Career mapping completed!')
            return redirect('guest_career_results', session_id=session_id)
    else:
        form = CareerMappingForm()
    
    context = {
        'form': form,
        'session_id': session_id,
        'student_name': guest_data.get('student_name'),
        'title': 'Career Mapping'
    }
    return render(request, 'assessments/guest_career_mapping.html', context)


def guest_career_results(request, session_id):
    """Display career mapping results."""
    guest_data = request.session.get('guest_assessment')
    if not guest_data or guest_data.get('session_id') != session_id:
        messages.error(request, 'Invalid session. Please start over.')
        return redirect('guest_assessment_landing')
    
    career_recommendations = guest_data.get('career_recommendations')
    if not career_recommendations:
        messages.error(request, 'No career recommendations found. Please complete career mapping.')
        return redirect('guest_career_mapping', session_id=session_id)
    
    context = {
        'session_id': session_id,
        'student_name': guest_data.get('student_name'),
        'career_recommendations': career_recommendations,
        'career_mapping': guest_data.get('career_mapping'),
        'title': 'Career Recommendations'
    }
    return render(request, 'assessments/guest_career_results.html', context)


def guest_download_report(request, session_id):
    """Download guest assessment report."""
    guest_data = request.session.get('guest_assessment')
    if not guest_data or guest_data.get('session_id') != session_id:
        messages.error(request, 'Invalid session.')
        return redirect('guest_assessment_landing')
    
    # Generate report
    report_data = generate_guest_report(guest_data)
    
    # Create PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="edusight_assessment_report_{session_id}.pdf"'
    
    # Generate PDF (you would use a library like ReportLab here)
    # For now, return JSON
    response = JsonResponse(report_data, json_dumps_params={'indent': 2})
    response['Content-Disposition'] = f'attachment; filename="edusight_assessment_report_{session_id}.json"'
    
    return response


@csrf_exempt
@require_http_methods(["POST"])
def guest_assessment_api(request):
    """API endpoint for guest assessment processing."""
    try:
        data = json.loads(request.body)
        session_id = data.get('session_id')
        
        if not session_id:
            return JsonResponse({'error': 'Session ID required'}, status=400)
        
        # Process assessment
        ml_service = MLAssessmentService()
        results = ml_service.process_guest_assessment(data)
        
        return JsonResponse({
            'success': True,
            'session_id': session_id,
            'results': results
        })
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)


# Helper functions

def process_guest_assessment(assessment_data, ml_service, psychometric_service):
    """Process guest assessment with AI services."""
    try:
        # Academic analysis
        academic_results = ml_service.analyze_academic_performance(
            assessment_data['files'],
            assessment_data['curriculum']
        )
        
        # Psychometric analysis
        psychometric_results = psychometric_service.analyze_personality_traits(
            assessment_data['student_age']
        )
        
        # Career readiness assessment
        career_readiness = ml_service.assess_career_readiness(
            academic_results,
            psychometric_results,
            assessment_data['student_age']
        )
        
        # Generate insights
        insights = ml_service.generate_insights(
            academic_results,
            psychometric_results,
            career_readiness
        )
        
        return {
            'academic_analysis': academic_results,
            'psychometric_analysis': psychometric_results,
            'career_readiness': career_readiness,
            'insights': insights,
            'overall_score': calculate_overall_score(academic_results, psychometric_results),
            'recommendations': generate_recommendations(insights),
            'processed_at': timezone.now().isoformat()
        }
        
    except Exception as e:
        raise Exception(f"Assessment processing failed: {str(e)}")


def generate_career_recommendations(career_data, guest_data):
    """Generate career recommendations based on mapping data."""
    # This would integrate with your career mapping AI service
    recommendations = {
        'top_careers': [
            {
                'title': 'Software Engineer',
                'match_score': 85,
                'description': 'High match based on analytical skills and interest in technology',
                'education_path': 'Computer Science or Engineering degree',
                'salary_range': '₹6-15 LPA',
                'growth_prospects': 'Excellent'
            },
            {
                'title': 'Data Scientist',
                'match_score': 78,
                'description': 'Strong match for analytical and problem-solving abilities',
                'education_path': 'Statistics, Mathematics, or Computer Science',
                'salary_range': '₹8-20 LPA',
                'growth_prospects': 'Very High'
            }
        ],
        'alternative_careers': [
            {
                'title': 'Research Scientist',
                'match_score': 72,
                'description': 'Good match for analytical thinking and research interest',
                'education_path': 'PhD in relevant field',
                'salary_range': '₹5-12 LPA',
                'growth_prospects': 'Good'
            }
        ],
        'skill_development': [
            'Programming languages (Python, Java)',
            'Data analysis tools',
            'Critical thinking',
            'Communication skills'
        ],
        'next_steps': [
            'Take advanced mathematics courses',
            'Participate in coding competitions',
            'Join STEM clubs and activities',
            'Consider internships in tech companies'
        ]
    }
    
    return recommendations


def calculate_overall_score(academic_results, psychometric_results):
    """Calculate overall assessment score."""
    academic_score = academic_results.get('overall_score', 0)
    psychometric_score = psychometric_results.get('overall_score', 0)
    
    # Weighted average (70% academic, 30% psychometric)
    overall_score = (academic_score * 0.7) + (psychometric_score * 0.3)
    return round(overall_score, 1)


def generate_recommendations(insights):
    """Generate actionable recommendations."""
    recommendations = []
    
    if insights.get('academic_strengths'):
        recommendations.append({
            'type': 'strength',
            'title': 'Leverage Academic Strengths',
            'description': f"Focus on {', '.join(insights['academic_strengths'])} subjects",
            'priority': 'high'
        })
    
    if insights.get('improvement_areas'):
        recommendations.append({
            'type': 'improvement',
            'title': 'Address Improvement Areas',
            'description': f"Work on {', '.join(insights['improvement_areas'])}",
            'priority': 'medium'
        })
    
    if insights.get('career_aptitude'):
        recommendations.append({
            'type': 'career',
            'title': 'Explore Career Paths',
            'description': f"Consider careers in {insights['career_aptitude']}",
            'priority': 'high'
        })
    
    return recommendations


def generate_guest_report(guest_data):
    """Generate comprehensive guest assessment report."""
    report = {
        'student_info': {
            'name': guest_data.get('student_name'),
            'age': guest_data.get('student_age'),
            'grade': guest_data.get('student_grade'),
            'assessment_date': guest_data.get('completed_at')
        },
        'assessment_summary': guest_data.get('results', {}),
        'career_mapping': guest_data.get('career_mapping', {}),
        'career_recommendations': guest_data.get('career_recommendations', {}),
        'report_generated_at': timezone.now().isoformat(),
        'session_id': guest_data.get('session_id')
    }
    
    return report
