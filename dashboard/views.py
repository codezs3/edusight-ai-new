"""
Django views for the dashboard app.
"""

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView, ListView, DetailView
from django.http import JsonResponse
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone
from datetime import timedelta
import json

from students.models import Student, School, User, Attendance
from assessments.models import Assessment, AssessmentResult
from data_analytics.models import StudentAnalytics, SchoolAnalytics, DashboardMetrics
from ml_predictions.models import MLPrediction


class DashboardView(LoginRequiredMixin, TemplateView):
    """Main dashboard view."""
    template_name = 'dashboard/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Get user's school
        school = None
        if hasattr(user, 'student_profile'):
            school = user.student_profile.school
        elif hasattr(user, 'teacher_profile'):
            school = user.teacher_profile.school
        elif hasattr(user, 'counselor_profile'):
            school = user.counselor_profile.school
        
        # Get dashboard statistics
        context['stats'] = self.get_dashboard_stats(school)
        context['recent_activities'] = self.get_recent_activities(school)
        context['performance_trends'] = self.get_performance_trends(school)
        context['notifications'] = self.get_notifications(user)
        
        return context
    
    def get_dashboard_stats(self, school):
        """Get dashboard statistics."""
        if not school:
            return {}
        
        # Get date range for current month
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        stats = {
            'total_students': Student.objects.filter(school=school, is_active=True).count(),
            'total_teachers': school.teachers.filter(is_active=True).count(),
            'total_assessments': {
                'academic': Assessment.objects.filter(assessment_type='academic').count(),
                'psychological': Assessment.objects.filter(assessment_type='psychological').count(),
                'physical': Assessment.objects.filter(assessment_type='physical').count(),
                'dmit': Assessment.objects.filter(assessment_type='dmit').count(),
            },
            'monthly_assessments': AssessmentResult.objects.filter(
                student__school=school,
                completed_at__gte=start_of_month
            ).count(),
            'average_performance': AssessmentResult.objects.filter(
                student__school=school,
                completed=True
            ).aggregate(avg=Avg('percentage'))['avg'] or 0,
            'attendance_rate': self.get_attendance_rate(school),
        }
        
        return stats
    
    def get_recent_activities(self, school):
        """Get recent activities."""
        if not school:
            return []
        
        # Get recent assessment results
        recent_results = AssessmentResult.objects.filter(
            student__school=school
        ).select_related('student', 'assessment').order_by('-completed_at')[:10]
        
        activities = []
        for result in recent_results:
            activities.append({
                'type': 'assessment_completed',
                'student': result.student.user.get_full_name(),
                'assessment': result.assessment.title,
                'score': result.percentage,
                'time': result.completed_at,
            })
        
        return activities
    
    def get_performance_trends(self, school):
        """Get performance trends."""
        if not school:
            return {}
        
        # Get last 6 months of data
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=180)
        
        trends = {
            'academic': [],
            'psychological': [],
            'physical': [],
        }
        
        # Get monthly averages for each assessment type
        for assessment_type in trends.keys():
            monthly_data = AssessmentResult.objects.filter(
                student__school=school,
                assessment__assessment_type=assessment_type,
                completed=True,
                completed_at__date__gte=start_date
            ).extra(
                select={'month': "DATE_FORMAT(completed_at, '%%Y-%%m')"}
            ).values('month').annotate(
                avg_score=Avg('percentage')
            ).order_by('month')
            
            trends[assessment_type] = list(monthly_data)
        
        return trends
    
    def get_attendance_rate(self, school):
        """Calculate overall attendance rate."""
        today = timezone.now().date()
        start_of_month = today.replace(day=1)
        
        total_days = Attendance.objects.filter(
            student__school=school,
            date__gte=start_of_month
        ).count()
        
        present_days = Attendance.objects.filter(
            student__school=school,
            date__gte=start_of_month,
            status='present'
        ).count()
        
        return (present_days / total_days * 100) if total_days > 0 else 0
    
    def get_notifications(self, user):
        """Get user notifications."""
        from .models import DashboardNotification
        
        return DashboardNotification.objects.filter(
            recipients=user,
            is_read=False,
            is_dismissed=False
        ).order_by('-created_at')[:5]


@login_required
def dashboard_api(request):
    """API endpoint for dashboard data."""
    if request.method == 'GET':
        user = request.user
        
        # Get user's school
        school = None
        if hasattr(user, 'student_profile'):
            school = user.student_profile.school
        elif hasattr(user, 'teacher_profile'):
            school = user.teacher_profile.school
        elif hasattr(user, 'counselor_profile'):
            school = user.counselor_profile.school
        
        # Get real-time statistics
        stats = get_dashboard_stats(school)
        
        return JsonResponse({
            'success': True,
            'data': {
                'stats': stats,
                'timestamp': timezone.now().isoformat(),
            }
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


@login_required
def student_list_api(request):
    """API endpoint for student list."""
    if request.method == 'GET':
        user = request.user
        
        # Get user's school
        school = None
        if hasattr(user, 'student_profile'):
            school = user.student_profile.school
        elif hasattr(user, 'teacher_profile'):
            school = user.teacher_profile.school
        elif hasattr(user, 'counselor_profile'):
            school = user.counselor_profile.school
        
        if not school:
            return JsonResponse({'success': False, 'error': 'School not found'})
        
        # Get students with basic info
        students = Student.objects.filter(school=school, is_active=True).select_related('user')
        
        student_data = []
        for student in students:
            # Get latest academic performance
            latest_result = AssessmentResult.objects.filter(
                student=student,
                assessment__assessment_type='academic',
                completed=True
            ).order_by('-completed_at').first()
            
            student_data.append({
                'id': student.id,
                'name': student.user.get_full_name(),
                'grade': student.grade,
                'section': student.section,
                'roll_number': student.roll_number,
                'latest_score': latest_result.percentage if latest_result else None,
                'attendance_rate': student.get_attendance_rate(),
            })
        
        return JsonResponse({
            'success': True,
            'data': student_data
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


@login_required
def assessment_stats_api(request):
    """API endpoint for assessment statistics."""
    if request.method == 'GET':
        user = request.user
        
        # Get user's school
        school = None
        if hasattr(user, 'student_profile'):
            school = user.student_profile.school
        elif hasattr(user, 'teacher_profile'):
            school = user.teacher_profile.school
        elif hasattr(user, 'counselor_profile'):
            school = user.counselor_profile.school
        
        if not school:
            return JsonResponse({'success': False, 'error': 'School not found'})
        
        # Get assessment statistics by type
        assessment_stats = {}
        for assessment_type in ['academic', 'psychological', 'physical', 'dmit']:
            results = AssessmentResult.objects.filter(
                student__school=school,
                assessment__assessment_type=assessment_type,
                completed=True
            )
            
            assessment_stats[assessment_type] = {
                'total_assessments': results.count(),
                'average_score': results.aggregate(avg=Avg('percentage'))['avg'] or 0,
                'completion_rate': (results.count() / Assessment.objects.filter(
                    assessment_type=assessment_type
                ).count() * 100) if Assessment.objects.filter(assessment_type=assessment_type).count() > 0 else 0,
            }
        
        return JsonResponse({
            'success': True,
            'data': assessment_stats
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


@login_required
def ml_predictions_api(request):
    """API endpoint for ML predictions."""
    if request.method == 'GET':
        user = request.user
        
        # Get user's school
        school = None
        if hasattr(user, 'student_profile'):
            school = user.student_profile.school
        elif hasattr(user, 'teacher_profile'):
            school = user.teacher_profile.school
        elif hasattr(user, 'counselor_profile'):
            school = user.counselor_profile.school
        
        if not school:
            return JsonResponse({'success': False, 'error': 'School not found'})
        
        # Get recent ML predictions
        recent_predictions = MLPrediction.objects.filter(
            student__school=school
        ).select_related('student__user').order_by('-created_at')[:10]
        
        prediction_data = []
        for prediction in recent_predictions:
            prediction_data.append({
                'student_name': prediction.student.user.get_full_name(),
                'prediction_type': prediction.get_prediction_type_display(),
                'confidence_score': prediction.confidence_score,
                'created_at': prediction.created_at.isoformat(),
            })
        
        return JsonResponse({
            'success': True,
            'data': prediction_data
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid request method'})


def get_dashboard_stats(school):
    """Helper function to get dashboard statistics."""
    if not school:
        return {}
    
    today = timezone.now().date()
    start_of_month = today.replace(day=1)
    
    return {
        'total_students': Student.objects.filter(school=school, is_active=True).count(),
        'total_teachers': school.teachers.filter(is_active=True).count(),
        'total_assessments': {
            'academic': Assessment.objects.filter(assessment_type='academic').count(),
            'psychological': Assessment.objects.filter(assessment_type='psychological').count(),
            'physical': Assessment.objects.filter(assessment_type='physical').count(),
            'dmit': Assessment.objects.filter(assessment_type='dmit').count(),
        },
        'monthly_assessments': AssessmentResult.objects.filter(
            student__school=school,
            completed_at__gte=start_of_month
        ).count(),
        'average_performance': AssessmentResult.objects.filter(
            student__school=school,
            completed=True
        ).aggregate(avg=Avg('percentage'))['avg'] or 0,
    }
