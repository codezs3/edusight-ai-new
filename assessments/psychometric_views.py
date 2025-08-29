"""
Psychometric Test Views
Views for handling psychometric test administration and recommendations
"""

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.utils import timezone
from django.db import transaction
from django.core.paginator import Paginator
import json

from .psychometric_models import (
    PsychometricTest, TestRecommendation, TestSession, 
    TestResponse, TestResult, AgeGroup, PsychometricTestCategory
)
from .psychometric_service import PsychometricTestService, TestNotificationService
from students.models import Student


def is_parent(user):
    """Check if user is a parent"""
    return user.role == 'parent'


@login_required
@user_passes_test(is_parent)
def psychometric_dashboard(request):
    """Main psychometric dashboard for parents"""
    parent = request.user.parent_profile
    students = Student.objects.filter(parent=parent)
    
    # Get notifications for all students
    notifications = TestNotificationService.get_dashboard_notifications(request.user)
    
    # Get completion status for each student
    student_data = []
    for student in students:
        status = PsychometricTestService.check_test_completion_status(student)
        recommendations = PsychometricTestService.get_pending_recommendations(student)
        
        student_data.append({
            'student': student,
            'completion_rate': status['completion_rate'],
            'completed_tests': len(status['completed']),
            'pending_recommendations': recommendations.count(),
            'high_priority_recommendations': recommendations.filter(priority_level='high').count()
        })
    
    context = {
        'students': student_data,
        'notifications': notifications,
        'total_students': len(students),
        'students_with_recommendations': len([s for s in student_data if s['pending_recommendations'] > 0])
    }
    
    return render(request, 'assessments/psychometric/dashboard.html', context)


@login_required
@user_passes_test(is_parent)
def student_recommendations(request, student_id):
    """View recommendations for a specific student"""
    student = get_object_or_404(Student, id=student_id, parent__user=request.user)
    
    # Get all recommendations
    recommendations = TestRecommendation.objects.filter(
        student=student
    ).select_related('recommended_test', 'recommended_test__category').order_by('-priority_level', '-created_at')
    
    # Get age-appropriate tests
    age_appropriate_tests = PsychometricTestService.get_age_appropriate_tests(student)
    completion_status = PsychometricTestService.check_test_completion_status(student)
    
    # Paginate recommendations
    paginator = Paginator(recommendations, 10)
    page = request.GET.get('page')
    recommendations_page = paginator.get_page(page)
    
    context = {
        'student': student,
        'recommendations': recommendations_page,
        'age_appropriate_tests': age_appropriate_tests,
        'completion_status': completion_status,
        'age_groups': AgeGroup.objects.all(),
        'test_categories': PsychometricTestCategory.objects.filter(is_active=True)
    }
    
    return render(request, 'assessments/psychometric/recommendations.html', context)


@login_required
@user_passes_test(is_parent)
def respond_to_recommendation(request, recommendation_id):
    """Handle parent response to test recommendation"""
    recommendation = get_object_or_404(
        TestRecommendation, 
        id=recommendation_id,
        student__parent__user=request.user
    )
    
    if request.method == 'POST':
        response = request.POST.get('response')
        notes = request.POST.get('notes', '')
        
        if response in ['accepted', 'declined', 'postponed']:
            recommendation.parent_response = response
            recommendation.parent_response_date = timezone.now()
            recommendation.parent_notes = notes
            recommendation.is_shown_to_parent = True
            recommendation.save()
            
            if response == 'accepted':
                # Create test session
                session = TestSession.objects.create(
                    student=recommendation.student,
                    test=recommendation.recommended_test,
                    scheduled_date=timezone.now() + timezone.timedelta(days=1),
                    administered_by=request.user,
                    administration_mode='parent_assisted'
                )
                
                messages.success(request, f'Test "{recommendation.recommended_test.name}" has been scheduled for your child.')
                return redirect('assessments:start_test_session', session_id=session.id)
            
            elif response == 'declined':
                messages.info(request, 'Recommendation declined. You can always reconsider later.')
            
            elif response == 'postponed':
                # Extend expiry date
                recommendation.expires_at = timezone.now() + timezone.timedelta(days=30)
                recommendation.save()
                messages.info(request, 'Recommendation postponed for 30 days.')
        
        return redirect('assessments:student_recommendations', student_id=recommendation.student.id)
    
    context = {
        'recommendation': recommendation,
        'student': recommendation.student
    }
    
    return render(request, 'assessments/psychometric/respond_recommendation.html', context)


@login_required
@user_passes_test(is_parent)
def start_test_session(request, session_id):
    """Start a psychometric test session"""
    session = get_object_or_404(
        TestSession,
        id=session_id,
        student__parent__user=request.user
    )
    
    if session.status != 'scheduled':
        messages.error(request, 'This test session is not available for starting.')
        return redirect('assessments:psychometric_dashboard')
    
    # Start the session
    session.status = 'in_progress'
    session.started_at = timezone.now()
    session.save()
    
    # Get first question
    first_question = session.test.questions.order_by('question_number').first()
    
    if not first_question:
        messages.error(request, 'This test has no questions configured.')
        return redirect('assessments:psychometric_dashboard')
    
    return redirect('assessments:test_question', session_id=session.id, question_number=1)


@login_required
@user_passes_test(is_parent)
def test_question(request, session_id, question_number):
    """Display and handle individual test questions"""
    session = get_object_or_404(
        TestSession,
        id=session_id,
        student__parent__user=request.user,
        status='in_progress'
    )
    
    question = get_object_or_404(
        session.test.questions,
        question_number=question_number
    )
    
    # Get or create response
    response, created = TestResponse.objects.get_or_create(
        session=session,
        question=question,
        defaults={'response_timestamp': timezone.now()}
    )
    
    if request.method == 'POST':
        # Save response
        response_data = {}
        
        if question.question_type == 'multiple_choice':
            response.response_text = request.POST.get('answer')
            response_data['selected_option'] = request.POST.get('answer')
        
        elif question.question_type == 'likert_scale':
            response.response_value = request.POST.get('rating')
            response_data['rating'] = request.POST.get('rating')
        
        elif question.question_type == 'true_false':
            response.response_text = request.POST.get('answer')
            response_data['answer'] = request.POST.get('answer')
        
        elif question.question_type == 'open_ended':
            response.response_text = request.POST.get('text_answer')
        
        elif question.question_type == 'ranking':
            rankings = request.POST.getlist('rankings[]')
            response_data['rankings'] = rankings
        
        response.response_data = response_data
        response.time_taken_seconds = request.POST.get('time_taken', 0)
        response.save()
        
        # Calculate points (simplified scoring)
        response.points_earned = calculate_question_score(question, response)
        response.save()
        
        # Move to next question or complete test
        next_question = session.test.questions.filter(
            question_number__gt=question_number
        ).order_by('question_number').first()
        
        if next_question:
            return redirect('assessments:test_question', 
                          session_id=session.id, 
                          question_number=next_question.question_number)
        else:
            # Complete the test
            return redirect('assessments:complete_test_session', session_id=session.id)
    
    # Get progress info
    total_questions = session.test.questions.count()
    completed_questions = TestResponse.objects.filter(session=session).count()
    progress_percentage = (completed_questions / total_questions) * 100 if total_questions > 0 else 0
    
    context = {
        'session': session,
        'question': question,
        'response': response,
        'question_number': question_number,
        'total_questions': total_questions,
        'progress_percentage': progress_percentage,
        'is_last_question': question_number == total_questions
    }
    
    return render(request, 'assessments/psychometric/test_question.html', context)


@login_required
@user_passes_test(is_parent)
def complete_test_session(request, session_id):
    """Complete a test session and generate results"""
    session = get_object_or_404(
        TestSession,
        id=session_id,
        student__parent__user=request.user,
        status='in_progress'
    )
    
    with transaction.atomic():
        # Mark session as completed
        session.status = 'completed'
        session.completed_at = timezone.now()
        session.save()
        
        # Calculate scores
        scores = session.calculate_scores()
        
        # Generate results
        result = generate_test_results(session)
        
        messages.success(request, f'Test completed successfully! Results are now available.')
    
    return redirect('assessments:test_results', session_id=session.id)


@login_required
@user_passes_test(is_parent)
def test_results(request, session_id):
    """Display test results"""
    session = get_object_or_404(
        TestSession,
        id=session_id,
        student__parent__user=request.user,
        status='completed'
    )
    
    try:
        result = session.result
    except TestResult.DoesNotExist:
        result = generate_test_results(session)
    
    context = {
        'session': session,
        'result': result,
        'student': session.student
    }
    
    return render(request, 'assessments/psychometric/test_results.html', context)


@login_required
def api_trigger_recommendations(request):
    """API endpoint to trigger test recommendations for a student"""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST method required'}, status=405)
    
    try:
        data = json.loads(request.body)
        student_id = data.get('student_id')
        trigger_type = data.get('trigger_type', 'parent_request')
        
        student = get_object_or_404(Student, id=student_id)
        
        # Check permissions
        if request.user.role == 'parent' and student.parent.user != request.user:
            return JsonResponse({'error': 'Permission denied'}, status=403)
        
        # Generate recommendations
        recommendations = PsychometricTestService.trigger_recommendations_for_student(
            student, trigger_type
        )
        
        # Create notification data
        notification = TestNotificationService.create_popup_notification(
            student, recommendations
        )
        
        return JsonResponse({
            'success': True,
            'recommendations_count': len(recommendations),
            'notification': notification
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
def api_get_notifications(request):
    """API endpoint to get psychometric test notifications"""
    if request.user.role == 'parent':
        notifications = TestNotificationService.get_dashboard_notifications(request.user)
        return JsonResponse({
            'notifications': notifications,
            'count': len(notifications)
        })
    
    return JsonResponse({'notifications': [], 'count': 0})


def calculate_question_score(question, response):
    """Calculate score for a question response"""
    if not response.response_text and not response.response_value:
        return 0
    
    # Simplified scoring logic
    if question.question_type == 'multiple_choice':
        if response.response_text == question.correct_answer:
            return question.points
        return 0
    
    elif question.question_type == 'true_false':
        if response.response_text == question.correct_answer:
            return question.points
        return 0
    
    elif question.question_type == 'likert_scale':
        # For likert scales, all responses get partial credit
        return question.points * 0.8  # 80% credit for participation
    
    elif question.question_type == 'open_ended':
        # Open ended questions need manual scoring or NLP
        return question.points * 0.7  # 70% credit for participation
    
    return question.points * 0.5  # Default partial credit


def generate_test_results(session):
    """Generate comprehensive test results"""
    from .psychometric_models import TestResult
    
    # Check if results already exist
    try:
        return session.result
    except TestResult.DoesNotExist:
        pass
    
    responses = session.responses.all()
    test = session.test
    student = session.student
    
    # Calculate category scores
    category_scores = {}
    category_questions = {}
    
    for response in responses:
        category = response.question.test.category.category_type
        if category not in category_scores:
            category_scores[category] = 0
            category_questions[category] = 0
        
        category_scores[category] += response.points_earned
        category_questions[category] += response.question.points
    
    # Normalize scores to percentages
    for category in category_scores:
        if category_questions[category] > 0:
            category_scores[category] = (category_scores[category] / category_questions[category]) * 100
    
    # Generate interpretations
    strengths = []
    areas_for_improvement = []
    
    for category, score in category_scores.items():
        if score >= 80:
            strengths.append(f"Strong {category} skills")
        elif score < 60:
            areas_for_improvement.append(f"{category.title()} development needed")
    
    # Create result
    result = TestResult.objects.create(
        session=session,
        category_scores=category_scores,
        strengths=strengths,
        areas_for_improvement=areas_for_improvement,
        interpretation_summary=f"Overall performance shows {session.percentage_score:.1f}% completion rate.",
        detailed_interpretation=generate_detailed_interpretation(session, category_scores),
        recommendations=generate_recommendations_text(session, category_scores),
        parent_summary=generate_parent_summary(session, category_scores),
        suggested_activities=generate_suggested_activities(session, category_scores)
    )
    
    return result


def generate_detailed_interpretation(session, category_scores):
    """Generate detailed interpretation of results"""
    student_name = session.student.user.first_name
    test_name = session.test.name
    
    interpretation = f"{student_name} completed the {test_name} assessment. "
    
    high_scores = [cat for cat, score in category_scores.items() if score >= 80]
    low_scores = [cat for cat, score in category_scores.items() if score < 60]
    
    if high_scores:
        interpretation += f"Strengths were observed in {', '.join(high_scores)}. "
    
    if low_scores:
        interpretation += f"Areas for development include {', '.join(low_scores)}. "
    
    interpretation += "These results provide insights into the child's current developmental stage and can guide future learning activities."
    
    return interpretation


def generate_recommendations_text(session, category_scores):
    """Generate recommendations based on results"""
    recommendations = []
    
    for category, score in category_scores.items():
        if score < 60:
            recommendations.append(f"Focus on {category} development through targeted activities and practice")
        elif score >= 80:
            recommendations.append(f"Continue to challenge {category} abilities with advanced activities")
    
    if not recommendations:
        recommendations.append("Continue current developmental activities and maintain regular assessment")
    
    return ". ".join(recommendations) + "."


def generate_parent_summary(session, category_scores):
    """Generate parent-friendly summary"""
    student_name = session.student.user.first_name
    avg_score = sum(category_scores.values()) / len(category_scores) if category_scores else 0
    
    if avg_score >= 80:
        level = "excellent"
    elif avg_score >= 70:
        level = "good"
    elif avg_score >= 60:
        level = "average"
    else:
        level = "developing"
    
    return f"{student_name} showed {level} performance in this assessment. The results help us understand their current developmental stage and guide future activities to support their growth."


def generate_suggested_activities(session, category_scores):
    """Generate suggested activities based on results"""
    activities = []
    
    for category, score in category_scores.items():
        if category == 'cognitive' and score < 70:
            activities.extend([
                "Puzzle games and brain teasers",
                "Memory games and card matching",
                "Age-appropriate logic problems"
            ])
        elif category == 'emotional' and score < 70:
            activities.extend([
                "Emotion identification games",
                "Storytelling about feelings",
                "Art therapy activities"
            ])
        elif category == 'social' and score < 70:
            activities.extend([
                "Group play activities",
                "Role-playing games",
                "Team sports or group activities"
            ])
    
    if not activities:
        activities = [
            "Continue regular reading activities",
            "Engage in creative play",
            "Maintain social interactions with peers"
        ]
    
    return activities[:6]  # Limit to 6 activities
