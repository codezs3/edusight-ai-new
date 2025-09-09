"""
Career mapping and AI-powered career guidance views.
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

from .forms import CareerMappingForm, AIAnalysisForm
from .models import Assessment, AssessmentResult
from .ml_service import MLAssessmentService
from students.models import Student


@login_required
def career_mapping_dashboard(request):
    """Career mapping dashboard."""
    user = request.user
    
    # Get student's assessment history
    if hasattr(user, 'student_profile'):
        student = user.student_profile
        assessments = AssessmentResult.objects.filter(student=student).order_by('-completed_at')
        
        # Get latest assessment for career mapping
        latest_assessment = assessments.first()
        
        context = {
            'student': student,
            'assessments': assessments,
            'latest_assessment': latest_assessment,
            'title': 'Career Mapping Dashboard'
        }
    else:
        # For parents/admins viewing student data
        student_id = request.GET.get('student_id')
        if student_id:
            student = get_object_or_404(Student, id=student_id)
            assessments = AssessmentResult.objects.filter(student=student).order_by('-completed_at')
            latest_assessment = assessments.first()
            
            context = {
                'student': student,
                'assessments': assessments,
                'latest_assessment': latest_assessment,
                'title': f'Career Mapping - {student.user.get_full_name()}'
            }
        else:
            messages.error(request, 'Please select a student to view career mapping.')
            return redirect('dashboard')
    
    return render(request, 'assessments/career_mapping_dashboard.html', context)


@login_required
def career_mapping_form(request, student_id=None):
    """Career mapping form."""
    if student_id:
        student = get_object_or_404(Student, id=student_id)
    elif hasattr(request.user, 'student_profile'):
        student = request.user.student_profile
    else:
        messages.error(request, 'Student not found.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = CareerMappingForm(request.POST)
        if form.is_valid():
            # Process career mapping data
            career_data = {
                'student_id': student.id,
                'academic_strengths': form.cleaned_data['academic_strengths'],
                'academic_weaknesses': form.cleaned_data['academic_weaknesses'],
                'interests': form.cleaned_data['interests'],
                'preferred_career_fields': form.cleaned_data['preferred_career_fields'],
                'personality_type': form.cleaned_data['personality_type'],
                'work_environment': form.cleaned_data['work_environment'],
                'short_term_goals': form.cleaned_data['short_term_goals'],
                'long_term_goals': form.cleaned_data['long_term_goals'],
                'mapped_at': timezone.now().isoformat(),
                'mapped_by': request.user.id
            }
            
            # Generate AI-powered career recommendations
            ml_service = MLAssessmentService()
            career_recommendations = ml_service.generate_career_recommendations(
                career_data, 
                student
            )
            
            # Store career mapping data
            # You would save this to your database here
            
            messages.success(request, 'Career mapping completed successfully!')
            return redirect('career_mapping_results', student_id=student.id)
    else:
        form = CareerMappingForm()
    
    context = {
        'form': form,
        'student': student,
        'title': f'Career Mapping - {student.user.get_full_name()}'
    }
    return render(request, 'assessments/career_mapping_form.html', context)


@login_required
def career_mapping_results(request, student_id):
    """Display career mapping results with AI insights."""
    student = get_object_or_404(Student, id=student_id)
    
    # Get career mapping data (you would fetch from database)
    career_mapping_data = {
        'student_name': student.user.get_full_name(),
        'student_age': student.age,
        'student_grade': student.grade,
        'mapping_date': timezone.now().isoformat()
    }
    
    # Generate AI-powered career recommendations
    ml_service = MLAssessmentService()
    career_recommendations = ml_service.generate_career_recommendations(
        career_mapping_data, 
        student
    )
    
    # Get assessment history for context
    assessments = AssessmentResult.objects.filter(student=student).order_by('-completed_at')
    
    context = {
        'student': student,
        'career_mapping_data': career_mapping_data,
        'career_recommendations': career_recommendations,
        'assessments': assessments,
        'title': f'Career Recommendations - {student.user.get_full_name()}'
    }
    return render(request, 'assessments/career_mapping_results.html', context)


@login_required
def career_path_visualization(request, student_id):
    """Interactive career path visualization."""
    student = get_object_or_404(Student, id=student_id)
    
    # Generate career path data
    ml_service = MLAssessmentService()
    career_paths = ml_service.generate_career_paths(student)
    
    context = {
        'student': student,
        'career_paths': career_paths,
        'title': f'Career Path Visualization - {student.user.get_full_name()}'
    }
    return render(request, 'assessments/career_path_visualization.html', context)


@login_required
def skill_gap_analysis(request, student_id):
    """Skill gap analysis for career readiness."""
    student = get_object_or_404(Student, id=student_id)
    
    # Get student's current skills from assessments
    assessments = AssessmentResult.objects.filter(student=student)
    
    # Analyze skill gaps
    ml_service = MLAssessmentService()
    skill_analysis = ml_service.analyze_skill_gaps(student, assessments)
    
    context = {
        'student': student,
        'skill_analysis': skill_analysis,
        'assessments': assessments,
        'title': f'Skill Gap Analysis - {student.user.get_full_name()}'
    }
    return render(request, 'assessments/skill_gap_analysis.html', context)


@login_required
def career_roadmap(request, student_id, career_id):
    """Detailed career roadmap for specific career."""
    student = get_object_or_404(Student, id=student_id)
    
    # Get career details
    ml_service = MLAssessmentService()
    career_details = ml_service.get_career_details(career_id)
    roadmap = ml_service.generate_career_roadmap(student, career_id)
    
    context = {
        'student': student,
        'career_details': career_details,
        'roadmap': roadmap,
        'title': f'Career Roadmap - {career_details.get("title", "Career")}'
    }
    return render(request, 'assessments/career_roadmap.html', context)


@login_required
def ai_analysis_configuration(request, student_id):
    """Configure AI analysis parameters."""
    student = get_object_or_404(Student, id=student_id)
    
    if request.method == 'POST':
        form = AIAnalysisForm(request.POST)
        if form.is_valid():
            # Configure AI analysis
            analysis_config = {
                'analysis_depth': form.cleaned_data['analysis_depth'],
                'include_predictions': form.cleaned_data['include_predictions'],
                'include_career_mapping': form.cleaned_data['include_career_mapping'],
                'include_risk_assessment': form.cleaned_data['include_risk_assessment'],
                'include_recommendations': form.cleaned_data['include_recommendations'],
                'report_format': form.cleaned_data['report_format'],
                'configured_at': timezone.now().isoformat(),
                'configured_by': request.user.id
            }
            
            # Run AI analysis with configuration
            ml_service = MLAssessmentService()
            analysis_results = ml_service.run_configured_analysis(
                student, 
                analysis_config
            )
            
            messages.success(request, 'AI analysis completed successfully!')
            return redirect('ai_analysis_results', student_id=student.id)
    else:
        form = AIAnalysisForm()
    
    context = {
        'form': form,
        'student': student,
        'title': f'AI Analysis Configuration - {student.user.get_full_name()}'
    }
    return render(request, 'assessments/ai_analysis_configuration.html', context)


@login_required
def ai_analysis_results(request, student_id):
    """Display AI analysis results."""
    student = get_object_or_404(Student, id=student_id)
    
    # Get AI analysis results
    ml_service = MLAssessmentService()
    analysis_results = ml_service.get_analysis_results(student)
    
    context = {
        'student': student,
        'analysis_results': analysis_results,
        'title': f'AI Analysis Results - {student.user.get_full_name()}'
    }
    return render(request, 'assessments/ai_analysis_results.html', context)


@csrf_exempt
def career_mapping_api(request, student_id):
    """API endpoint for career mapping data."""
    if request.method == 'GET':
        student = get_object_or_404(Student, id=student_id)
        
        # Get career mapping data
        ml_service = MLAssessmentService()
        career_data = ml_service.get_career_mapping_data(student)
        
        return JsonResponse({
            'success': True,
            'student_id': student_id,
            'career_data': career_data
        })
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            student = get_object_or_404(Student, id=student_id)
            
            # Update career mapping
            ml_service = MLAssessmentService()
            result = ml_service.update_career_mapping(student, data)
            
            return JsonResponse({
                'success': True,
                'message': 'Career mapping updated successfully',
                'result': result
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)


@csrf_exempt
def career_recommendations_api(request, student_id):
    """API endpoint for career recommendations."""
    if request.method == 'GET':
        student = get_object_or_404(Student, id=student_id)
        
        # Get career recommendations
        ml_service = MLAssessmentService()
        recommendations = ml_service.get_career_recommendations(student)
        
        return JsonResponse({
            'success': True,
            'student_id': student_id,
            'recommendations': recommendations
        })


@csrf_exempt
def skill_analysis_api(request, student_id):
    """API endpoint for skill analysis."""
    if request.method == 'GET':
        student = get_object_or_404(Student, id=student_id)
        
        # Get skill analysis
        ml_service = MLAssessmentService()
        skill_analysis = ml_service.get_skill_analysis(student)
        
        return JsonResponse({
            'success': True,
            'student_id': student_id,
            'skill_analysis': skill_analysis
        })


@csrf_exempt
def career_path_api(request, student_id, career_id):
    """API endpoint for career path data."""
    if request.method == 'GET':
        student = get_object_or_404(Student, id=student_id)
        
        # Get career path
        ml_service = MLAssessmentService()
        career_path = ml_service.get_career_path(student, career_id)
        
        return JsonResponse({
            'success': True,
            'student_id': student_id,
            'career_id': career_id,
            'career_path': career_path
        })
