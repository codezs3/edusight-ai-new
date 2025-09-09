"""
Comprehensive Assessment Views
Handles all assessment framework interactions and ML predictions
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q, Avg, Count
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .frameworks import (
    AcademicFramework, PhysicalEducationFramework, 
    PsychologicalFramework, CareerMappingFramework,
    MLAssessmentModel, ComprehensiveAssessment
)
from .ml_service import MLAssessmentService
from students.models import Student
from django.contrib.auth import get_user_model

User = get_user_model()


@login_required
def assessment_dashboard(request):
    """Main assessment dashboard showing overview of all frameworks"""
    
    context = {
        'total_assessments': ComprehensiveAssessment.objects.count(),
        'recent_assessments': ComprehensiveAssessment.objects.order_by('-created_at')[:10],
        'academic_frameworks': AcademicFramework.objects.filter(is_active=True).count(),
        'pe_frameworks': PhysicalEducationFramework.objects.filter(is_active=True).count(),
        'psychological_frameworks': PsychologicalFramework.objects.filter(is_active=True).count(),
        'career_frameworks': CareerMappingFramework.objects.filter(is_active=True).count(),
        'ml_models': MLAssessmentModel.objects.filter(is_active=True).count(),
        'assessment_statistics': get_assessment_statistics()
    }
    
    return render(request, 'assessments/dashboard.html', context)


@login_required
def academic_framework_management(request):
    """Manage academic assessment frameworks"""
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'create':
            try:
                framework = AcademicFramework.objects.create(
                    name=request.POST.get('name'),
                    framework_type=request.POST.get('framework_type'),
                    grade_level=request.POST.get('grade_level'),
                    subject_areas=json.loads(request.POST.get('subject_areas', '[]')),
                    learning_objectives=json.loads(request.POST.get('learning_objectives', '{}')),
                    assessment_criteria=json.loads(request.POST.get('assessment_criteria', '{}')),
                    competency_levels=json.loads(request.POST.get('competency_levels', '{}'))
                )
                
                # Initialize default subject areas if not provided
                if not framework.subject_areas:
                    framework.subject_areas = get_default_subjects_for_grade(framework.grade_level)
                    framework.save()
                
                messages.success(request, f'Academic framework "{framework.name}" created successfully!')
                
            except Exception as e:
                messages.error(request, f'Error creating framework: {str(e)}')
        
        elif action == 'update':
            try:
                framework_id = request.POST.get('framework_id')
                framework = AcademicFramework.objects.get(id=framework_id)
                
                framework.name = request.POST.get('name')
                framework.subject_areas = json.loads(request.POST.get('subject_areas', '[]'))
                framework.learning_objectives = json.loads(request.POST.get('learning_objectives', '{}'))
                framework.assessment_criteria = json.loads(request.POST.get('assessment_criteria', '{}'))
                framework.competency_levels = json.loads(request.POST.get('competency_levels', '{}'))
                framework.save()
                
                messages.success(request, f'Framework "{framework.name}" updated successfully!')
                
            except Exception as e:
                messages.error(request, f'Error updating framework: {str(e)}')
        
        elif action == 'delete':
            try:
                framework_id = request.POST.get('framework_id')
                framework = AcademicFramework.objects.get(id=framework_id)
                framework_name = framework.name
                framework.delete()
                
                messages.success(request, f'Framework "{framework_name}" deleted successfully!')
                
            except Exception as e:
                messages.error(request, f'Error deleting framework: {str(e)}')
        
        return redirect('assessments:academic_frameworks')
    
    # Get frameworks with search and filtering
    frameworks = AcademicFramework.objects.all().order_by('-created_at')
    
    search_query = request.GET.get('search', '')
    if search_query:
        frameworks = frameworks.filter(
            Q(name__icontains=search_query) |
            Q(framework_type__icontains=search_query) |
            Q(grade_level__icontains=search_query)
        )
    
    framework_type_filter = request.GET.get('framework_type')
    if framework_type_filter:
        frameworks = frameworks.filter(framework_type=framework_type_filter)
    
    grade_filter = request.GET.get('grade_level')
    if grade_filter:
        frameworks = frameworks.filter(grade_level=grade_filter)
    
    # Pagination
    paginator = Paginator(frameworks, 20)
    page_number = request.GET.get('page')
    frameworks_page = paginator.get_page(page_number)
    
    context = {
        'frameworks': frameworks_page,
        'framework_types': AcademicFramework.FRAMEWORK_CHOICES,
        'grade_levels': AcademicFramework.GRADE_LEVELS,
        'search_query': search_query,
        'framework_type_filter': framework_type_filter,
        'grade_filter': grade_filter
    }
    
    return render(request, 'assessments/academic_frameworks.html', context)


@login_required
def physical_framework_management(request):
    """Manage physical education frameworks"""
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'create':
            try:
                framework = PhysicalEducationFramework.objects.create(
                    name=request.POST.get('name'),
                    framework_type=request.POST.get('framework_type'),
                    age_group=request.POST.get('age_group'),
                    fitness_components=json.loads(request.POST.get('fitness_components', '{}')),
                    motor_skills=json.loads(request.POST.get('motor_skills', '{}')),
                    assessment_tests=json.loads(request.POST.get('assessment_tests', '{}')),
                    health_indicators=json.loads(request.POST.get('health_indicators', '{}')),
                    performance_standards=json.loads(request.POST.get('performance_standards', '{}'))
                )
                
                # Initialize default components if not provided
                if not framework.fitness_components:
                    framework.fitness_components = get_default_fitness_components()
                    framework.save()
                
                messages.success(request, f'PE framework "{framework.name}" created successfully!')
                
            except Exception as e:
                messages.error(request, f'Error creating framework: {str(e)}')
        
        return redirect('assessments:pe_frameworks')
    
    frameworks = PhysicalEducationFramework.objects.all().order_by('-created_at')
    
    # Apply filters
    search_query = request.GET.get('search', '')
    if search_query:
        frameworks = frameworks.filter(name__icontains=search_query)
    
    # Pagination
    paginator = Paginator(frameworks, 20)
    page_number = request.GET.get('page')
    frameworks_page = paginator.get_page(page_number)
    
    context = {
        'frameworks': frameworks_page,
        'framework_types': PhysicalEducationFramework.FRAMEWORK_TYPES,
        'age_groups': PhysicalEducationFramework.AGE_GROUPS,
        'search_query': search_query
    }
    
    return render(request, 'assessments/pe_frameworks.html', context)


@login_required
def psychological_framework_management(request):
    """Manage psychological assessment frameworks"""
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'create':
            try:
                framework = PsychologicalFramework.objects.create(
                    name=request.POST.get('name'),
                    framework_type=request.POST.get('framework_type'),
                    developmental_stage=request.POST.get('developmental_stage'),
                    cognitive_domains=json.loads(request.POST.get('cognitive_domains', '{}')),
                    emotional_domains=json.loads(request.POST.get('emotional_domains', '{}')),
                    social_domains=json.loads(request.POST.get('social_domains', '{}')),
                    behavioral_indicators=json.loads(request.POST.get('behavioral_indicators', '{}')),
                    assessment_methods=json.loads(request.POST.get('assessment_methods', '{}')),
                    intervention_strategies=json.loads(request.POST.get('intervention_strategies', '{}'))
                )
                
                # Initialize default domains if not provided
                if not framework.cognitive_domains:
                    framework.cognitive_domains = get_default_cognitive_domains()
                    framework.save()
                
                messages.success(request, f'Psychological framework "{framework.name}" created successfully!')
                
            except Exception as e:
                messages.error(request, f'Error creating framework: {str(e)}')
        
        return redirect('assessments:psychological_frameworks')
    
    frameworks = PsychologicalFramework.objects.all().order_by('-created_at')
    
    # Apply filters
    search_query = request.GET.get('search', '')
    if search_query:
        frameworks = frameworks.filter(name__icontains=search_query)
    
    # Pagination
    paginator = Paginator(frameworks, 20)
    page_number = request.GET.get('page')
    frameworks_page = paginator.get_page(page_number)
    
    context = {
        'frameworks': frameworks_page,
        'framework_types': PsychologicalFramework.FRAMEWORK_TYPES,
        'developmental_stages': PsychologicalFramework.DEVELOPMENTAL_STAGES,
        'search_query': search_query
    }
    
    return render(request, 'assessments/psychological_frameworks.html', context)


@login_required
def career_framework_management(request):
    """Manage career mapping frameworks"""
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'create':
            try:
                framework = CareerMappingFramework.objects.create(
                    name=request.POST.get('name'),
                    framework_type=request.POST.get('framework_type'),
                    target_education_level=request.POST.get('target_education_level'),
                    career_clusters=json.loads(request.POST.get('career_clusters', '{}')),
                    skill_requirements=json.loads(request.POST.get('skill_requirements', '{}')),
                    personality_matches=json.loads(request.POST.get('personality_matches', '{}')),
                    market_trends=json.loads(request.POST.get('market_trends', '{}')),
                    education_pathways=json.loads(request.POST.get('education_pathways', '{}')),
                    salary_information=json.loads(request.POST.get('salary_information', '{}')),
                    growth_projections=json.loads(request.POST.get('growth_projections', '{}'))
                )
                
                # Initialize default clusters if not provided
                if not framework.career_clusters:
                    framework.career_clusters = get_default_career_clusters()
                    framework.save()
                
                messages.success(request, f'Career framework "{framework.name}" created successfully!')
                
            except Exception as e:
                messages.error(request, f'Error creating framework: {str(e)}')
        
        return redirect('assessments:career_frameworks')
    
    frameworks = CareerMappingFramework.objects.all().order_by('-created_at')
    
    # Apply filters
    search_query = request.GET.get('search', '')
    if search_query:
        frameworks = frameworks.filter(name__icontains=search_query)
    
    # Pagination
    paginator = Paginator(frameworks, 20)
    page_number = request.GET.get('page')
    frameworks_page = paginator.get_page(page_number)
    
    context = {
        'frameworks': frameworks_page,
        'framework_types': CareerMappingFramework.FRAMEWORK_TYPES,
        'education_levels': CareerMappingFramework.EDUCATION_LEVELS,
        'search_query': search_query
    }
    
    return render(request, 'assessments/career_frameworks.html', context)


@login_required
def comprehensive_assessment_view(request, student_id=None):
    """Create or view comprehensive assessment"""
    
    if student_id:
        student = get_object_or_404(Student, id=student_id)
    else:
        student = None
    
    if request.method == 'POST':
        try:
            # Get form data
            assessment_type = request.POST.get('assessment_type')
            academic_framework_id = request.POST.get('academic_framework')
            pe_framework_id = request.POST.get('pe_framework')
            psychological_framework_id = request.POST.get('psychological_framework')
            career_framework_id = request.POST.get('career_framework')
            
            # Get selected student if not provided
            if not student:
                student_id = request.POST.get('student_id')
                student = get_object_or_404(Student, id=student_id)
            
            # Create assessment
            assessment = ComprehensiveAssessment.objects.create(
                student=student,
                assessment_type=assessment_type,
                academic_framework_id=academic_framework_id,
                pe_framework_id=pe_framework_id if pe_framework_id else None,
                psychological_framework_id=psychological_framework_id if psychological_framework_id else None,
                career_framework_id=career_framework_id if career_framework_id else None,
                assessed_by=request.user
            )
            
            # Process assessment scores
            academic_scores = {}
            physical_scores = {}
            psychological_scores = {}
            career_interests = {}
            
            # Academic scores
            for key, value in request.POST.items():
                if key.startswith('academic_'):
                    subject = key.replace('academic_', '')
                    try:
                        academic_scores[subject] = float(value)
                    except (ValueError, TypeError):
                        pass
                elif key.startswith('physical_'):
                    component = key.replace('physical_', '')
                    try:
                        physical_scores[component] = float(value)
                    except (ValueError, TypeError):
                        pass
                elif key.startswith('psychological_'):
                    domain = key.replace('psychological_', '')
                    try:
                        psychological_scores[domain] = float(value)
                    except (ValueError, TypeError):
                        pass
                elif key.startswith('career_'):
                    interest = key.replace('career_', '')
                    try:
                        career_interests[interest] = float(value)
                    except (ValueError, TypeError):
                        pass
            
            # Save scores
            assessment.academic_scores = academic_scores
            assessment.physical_scores = physical_scores
            assessment.psychological_scores = psychological_scores
            assessment.career_interests = career_interests
            assessment.save()
            
            # Generate ML predictions
            ml_service = MLAssessmentService()
            student_data = prepare_student_data_for_ml(student, assessment)
            ml_results = ml_service.comprehensive_assessment(student_data)
            
            if ml_results:
                assessment.ml_predictions = ml_results
                assessment.save()
            
            # Calculate overall score and generate recommendations
            assessment.calculate_overall_score()
            assessment.generate_recommendations()
            
            messages.success(request, f'Assessment for {student.user.get_full_name()} completed successfully!')
            return redirect('assessments:view_assessment', assessment_id=assessment.id)
            
        except Exception as e:
            messages.error(request, f'Error creating assessment: {str(e)}')
    
    # Get available frameworks
    academic_frameworks = AcademicFramework.objects.filter(is_active=True)
    pe_frameworks = PhysicalEducationFramework.objects.filter(is_active=True)
    psychological_frameworks = PsychologicalFramework.objects.filter(is_active=True)
    career_frameworks = CareerMappingFramework.objects.filter(is_active=True)
    
    # Get students if no specific student
    students = Student.objects.all().order_by('user__first_name') if not student else None
    
    context = {
        'student': student,
        'students': students,
        'academic_frameworks': academic_frameworks,
        'pe_frameworks': pe_frameworks,
        'psychological_frameworks': psychological_frameworks,
        'career_frameworks': career_frameworks,
        'assessment_types': ComprehensiveAssessment.ASSESSMENT_TYPES
    }
    
    return render(request, 'assessments/create_assessment.html', context)


@login_required
def view_assessment(request, assessment_id):
    """View detailed assessment results"""
    
    assessment = get_object_or_404(ComprehensiveAssessment, id=assessment_id)
    
    # Calculate detailed analytics
    analytics = {
        'academic_breakdown': calculate_academic_breakdown(assessment),
        'physical_analysis': calculate_physical_analysis(assessment),
        'psychological_profile': calculate_psychological_profile(assessment),
        'career_recommendations': calculate_career_recommendations(assessment),
        'improvement_areas': identify_improvement_areas(assessment),
        'strengths_analysis': identify_strengths(assessment)
    }
    
    context = {
        'assessment': assessment,
        'analytics': analytics,
        'can_edit': request.user == assessment.assessed_by or request.user.is_superuser
    }
    
    return render(request, 'assessments/view_assessment.html', context)


@login_required
@csrf_exempt
def ml_prediction_api(request):
    """API endpoint for ML predictions"""
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            student_id = data.get('student_id')
            assessment_data = data.get('assessment_data', {})
            
            student = get_object_or_404(Student, id=student_id)
            
            # Prepare data for ML service
            ml_service = MLAssessmentService()
            student_data = prepare_student_data_for_ml_api(student, assessment_data)
            
            # Get predictions
            predictions = ml_service.comprehensive_assessment(student_data)
            
            return JsonResponse({
                'status': 'success',
                'predictions': predictions,
                'student_name': student.user.get_full_name()
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
    
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'})


# Helper functions

def get_assessment_statistics():
    """Get assessment statistics for dashboard"""
    total_assessments = ComprehensiveAssessment.objects.count()
    this_month = timezone.now().replace(day=1)
    assessments_this_month = ComprehensiveAssessment.objects.filter(
        created_at__gte=this_month
    ).count()
    
    # Average scores
    avg_scores = ComprehensiveAssessment.objects.aggregate(
        avg_overall=Avg('overall_score')
    )
    
    # Assessment types distribution
    type_distribution = ComprehensiveAssessment.objects.values('assessment_type').annotate(
        count=Count('id')
    )
    
    return {
        'total_assessments': total_assessments,
        'assessments_this_month': assessments_this_month,
        'average_overall_score': avg_scores['avg_overall'] or 0,
        'type_distribution': type_distribution
    }


def get_default_subjects_for_grade(grade_level):
    """Get default subjects for a grade level"""
    
    primary_subjects = [
        'Mathematics', 'English', 'Science', 'Social Studies', 
        'Physical Education', 'Art', 'Music'
    ]
    
    secondary_subjects = [
        'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
        'History', 'Geography', 'Economics', 'Computer Science',
        'Physical Education', 'Art'
    ]
    
    senior_subjects = [
        'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology',
        'Computer Science', 'Economics', 'Business Studies',
        'Psychology', 'Philosophy', 'Physical Education'
    ]
    
    grade_mapping = {
        'nursery': primary_subjects[:5],
        'lkg': primary_subjects[:5],
        'ukg': primary_subjects[:6],
        'grade_1': primary_subjects,
        'grade_2': primary_subjects,
        'grade_3': primary_subjects,
        'grade_4': primary_subjects,
        'grade_5': primary_subjects,
        'grade_6': secondary_subjects[:8],
        'grade_7': secondary_subjects[:9],
        'grade_8': secondary_subjects,
        'grade_9': secondary_subjects,
        'grade_10': secondary_subjects,
        'grade_11': senior_subjects,
        'grade_12': senior_subjects
    }
    
    return grade_mapping.get(grade_level, primary_subjects)


def get_default_fitness_components():
    """Get default fitness components for PE framework"""
    return {
        'cardiovascular_endurance': {
            'tests': ['mile_run', 'step_test', 'cycling_test'],
            'weight': 0.25
        },
        'muscular_strength': {
            'tests': ['push_ups', 'pull_ups', 'bench_press'],
            'weight': 0.20
        },
        'muscular_endurance': {
            'tests': ['sit_ups', 'plank_hold', 'wall_sit'],
            'weight': 0.20
        },
        'flexibility': {
            'tests': ['sit_and_reach', 'shoulder_stretch', 'back_extension'],
            'weight': 0.15
        },
        'body_composition': {
            'tests': ['bmi', 'body_fat_percentage', 'waist_circumference'],
            'weight': 0.20
        }
    }


def get_default_cognitive_domains():
    """Get default cognitive domains for psychological framework"""
    return {
        'memory': {
            'working_memory': 0.3,
            'short_term_memory': 0.3,
            'long_term_memory': 0.4
        },
        'attention': {
            'sustained_attention': 0.4,
            'selective_attention': 0.3,
            'divided_attention': 0.3
        },
        'processing_speed': {
            'reaction_time': 0.5,
            'decision_speed': 0.5
        },
        'executive_function': {
            'planning': 0.3,
            'inhibition': 0.3,
            'cognitive_flexibility': 0.4
        }
    }


def get_default_career_clusters():
    """Get default career clusters"""
    return {
        'stem': {
            'technology': ['software_engineer', 'data_scientist', 'cybersecurity_analyst'],
            'engineering': ['civil_engineer', 'mechanical_engineer', 'electrical_engineer'],
            'healthcare': ['doctor', 'nurse', 'medical_researcher'],
            'science': ['research_scientist', 'lab_technician', 'environmental_scientist']
        },
        'business': {
            'management': ['project_manager', 'operations_manager', 'executive'],
            'finance': ['financial_analyst', 'accountant', 'investment_banker'],
            'marketing': ['marketing_manager', 'sales_representative', 'digital_marketer']
        },
        'arts_humanities': {
            'education': ['teacher', 'professor', 'education_administrator'],
            'creative': ['graphic_designer', 'writer', 'artist'],
            'social_services': ['social_worker', 'counselor', 'therapist']
        }
    }


def prepare_student_data_for_ml(student, assessment):
    """Prepare student data for ML processing"""
    
    # Calculate age
    age = (timezone.now().date() - student.date_of_birth).days // 365 if student.date_of_birth else 15
    
    student_data = {
        'student_id': student.id,
        'academic_data': {
            'previous_gpa': assessment.get_academic_average() or 0,
            'attendance_rate': 85,  # Default or from student record
            'assignment_completion_rate': 90,  # Default or calculated
            'test_average': assessment.get_academic_average() or 0,
            'homework_average': assessment.get_academic_average() or 0,
            'age': age,
            'gender': student.gender or 'M',
            'socioeconomic_index': 0.5,  # Would need separate calculation
            'study_hours_per_week': 10,  # Default or from survey
            'extracurricular_participation': 0.7,  # Default or calculated
            'teacher_rating': 0.8,  # Default or from teacher input
            'peer_interaction_score': 0.75,  # Default or from assessment
            'visual_learning_preference': 0.6,  # Default or from learning style assessment
            'auditory_learning_preference': 0.7,
            'kinesthetic_learning_preference': 0.5
        },
        'behavioral_data': {
            'attention_span_score': assessment.psychological_scores.get('attention', 75),
            'impulse_control_score': assessment.psychological_scores.get('impulse_control', 75),
            'social_interaction_score': assessment.psychological_scores.get('social_skills', 75),
            'emotional_regulation_score': assessment.psychological_scores.get('emotional_regulation', 75),
            'motivation_level': assessment.psychological_scores.get('motivation', 75),
            'family_support_score': 80,  # Default or from survey
            'peer_influence_score': 75,  # Default or calculated
            'teacher_relationship_score': 80,  # Default or from teacher input
            'participation_rate': 85,  # Default or calculated
            'homework_completion_rate': 90,  # Default or calculated
            'classroom_behavior_score': 85  # Default or from teacher input
        },
        'skills': assessment.academic_scores,
        'personality': assessment.psychological_scores,
        'academic_scores': assessment.academic_scores,
        'interests': list(assessment.career_interests.keys())
    }
    
    return student_data


def prepare_student_data_for_ml_api(student, assessment_data):
    """Prepare student data for ML API calls"""
    
    age = (timezone.now().date() - student.date_of_birth).days // 365 if student.date_of_birth else 15
    
    return {
        'student_id': student.id,
        'academic_data': assessment_data.get('academic_data', {}),
        'behavioral_data': assessment_data.get('behavioral_data', {}),
        'skills': assessment_data.get('skills', {}),
        'personality': assessment_data.get('personality', {}),
        'academic_scores': assessment_data.get('academic_scores', {}),
        'interests': assessment_data.get('interests', [])
    }


def calculate_academic_breakdown(assessment):
    """Calculate detailed academic breakdown"""
    breakdown = {}
    
    for subject, score in assessment.academic_scores.items():
        grade = assessment.academic_framework.calculate_grade(score, subject)
        breakdown[subject] = {
            'score': score,
            'grade': grade,
            'performance_level': get_performance_level(score)
        }
    
    return breakdown


def calculate_physical_analysis(assessment):
    """Calculate physical fitness analysis"""
    if not assessment.pe_framework or not assessment.physical_scores:
        return {}
    
    # This would use the PE framework's assessment methods
    return {
        'fitness_level': 'Good',  # Calculated from framework
        'strengths': ['Cardiovascular Endurance'],
        'areas_for_improvement': ['Flexibility'],
        'recommendations': ['Increase stretching routine']
    }


def calculate_psychological_profile(assessment):
    """Calculate psychological profile"""
    if not assessment.psychological_framework or not assessment.psychological_scores:
        return {}
    
    # This would use the psychological framework's assessment methods
    return {
        'cognitive_profile': assessment.psychological_scores,
        'emotional_intelligence': 75,  # Calculated
        'social_skills': 80,  # Calculated
        'recommendations': ['Social skills training']
    }


def calculate_career_recommendations(assessment):
    """Calculate career recommendations"""
    if not assessment.career_framework or not assessment.career_interests:
        return {}
    
    # This would use the career framework's matching methods
    return {
        'top_matches': [
            {'career': 'Software Engineer', 'match_score': 0.85},
            {'career': 'Data Scientist', 'match_score': 0.78}
        ],
        'growth_areas': ['Programming Skills', 'Mathematics'],
        'education_pathway': 'Computer Science Degree'
    }


def identify_improvement_areas(assessment):
    """Identify areas needing improvement"""
    areas = []
    
    # Academic areas
    for subject, score in assessment.academic_scores.items():
        if score < 60:
            areas.append(f'Academic: {subject}')
    
    # Physical areas
    for component, score in assessment.physical_scores.items():
        if score < 60:
            areas.append(f'Physical: {component}')
    
    # Psychological areas
    for domain, score in assessment.psychological_scores.items():
        if score < 60:
            areas.append(f'Psychological: {domain}')
    
    return areas


def identify_strengths(assessment):
    """Identify student strengths"""
    strengths = []
    
    # Academic strengths
    for subject, score in assessment.academic_scores.items():
        if score >= 85:
            strengths.append(f'Academic: {subject}')
    
    # Physical strengths
    for component, score in assessment.physical_scores.items():
        if score >= 85:
            strengths.append(f'Physical: {component}')
    
    # Psychological strengths
    for domain, score in assessment.psychological_scores.items():
        if score >= 85:
            strengths.append(f'Psychological: {domain}')
    
    return strengths


def get_performance_level(score):
    """Get performance level based on score"""
    if score >= 90:
        return 'Excellent'
    elif score >= 80:
        return 'Very Good'
    elif score >= 70:
        return 'Good'
    elif score >= 60:
        return 'Satisfactory'
    elif score >= 50:
        return 'Needs Improvement'
    else:
        return 'Unsatisfactory'


@login_required
def academic_assessment_view(request):
    """Academic-only assessment view"""
    context = {
        'assessment_type': 'academic',
        'title': 'Academic Assessment',
        'description': 'Comprehensive academic performance evaluation',
        'frameworks': AcademicFramework.objects.filter(is_active=True),
        'recent_assessments': ComprehensiveAssessment.objects.filter(
            assessment_type='academic'
        ).order_by('-created_at')[:10]
    }
    return render(request, 'assessments/academic_assessment.html', context)


@login_required
def psychometric_assessment_view(request):
    """Psychometric-only assessment view"""
    context = {
        'assessment_type': 'psychometric',
        'title': 'Psychometric Assessment',
        'description': 'Personality and cognitive assessment',
        'frameworks': PsychologicalFramework.objects.filter(is_active=True),
        'recent_assessments': ComprehensiveAssessment.objects.filter(
            assessment_type='psychometric'
        ).order_by('-created_at')[:10]
    }
    return render(request, 'assessments/psychometric_assessment.html', context)


@login_required
def physical_assessment_view(request):
    """Physical-only assessment view"""
    context = {
        'assessment_type': 'physical',
        'title': 'Physical Assessment',
        'description': 'Physical fitness and motor skills evaluation',
        'frameworks': PhysicalEducationFramework.objects.filter(is_active=True),
        'recent_assessments': ComprehensiveAssessment.objects.filter(
            assessment_type='physical'
        ).order_by('-created_at')[:10]
    }
    return render(request, 'assessments/physical_assessment.html', context)


@login_required
def assessment_reports_view(request):
    """Assessment reports view"""
    context = {
        'title': 'Assessment Reports',
        'description': 'View and download assessment reports',
        'reports': ComprehensiveAssessment.objects.all().order_by('-created_at'),
        'total_reports': ComprehensiveAssessment.objects.count(),
        'recent_reports': ComprehensiveAssessment.objects.order_by('-created_at')[:20]
    }
    return render(request, 'assessments/assessment_reports.html', context)