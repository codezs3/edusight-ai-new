from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView
from django.http import JsonResponse
from django.db.models import Q, Count, Avg, Max, Min, Sum
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import StudentAnalytics, SchoolAnalytics, PerformanceTrend, AnalyticsReport, DashboardMetrics
from students.models import Student, School
from assessments.models import Assessment, AssessmentResult


@login_required
def analytics_dashboard(request):
    """Main analytics dashboard."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Overall statistics
    total_students = Student.objects.count()
    total_schools = School.objects.count()
    total_assessments = Assessment.objects.count()
    total_results = AssessmentResult.objects.count()
    
    # Performance averages
    avg_academic = StudentAnalytics.objects.aggregate(Avg('academic_score'))['academic_score__avg'] or 0
    avg_psychological = StudentAnalytics.objects.aggregate(Avg('psychological_score'))['psychological_score__avg'] or 0
    avg_physical = StudentAnalytics.objects.aggregate(Avg('physical_score'))['physical_score__avg'] or 0
    
    # Recent trends
    recent_trends = PerformanceTrend.objects.values('date').annotate(
        avg_score=Avg('score'),
        count=Count('id')
    ).order_by('-date')[:30]
    
    # School performance
    school_performance = SchoolAnalytics.objects.select_related('school').order_by('-date')[:10]
    
    # Assessment type distribution
    assessment_distribution = Assessment.objects.values('assessment_type').annotate(
        count=Count('id')
    )
    
    # Grade-wise performance
    grade_performance = StudentAnalytics.objects.values('student__grade').annotate(
        avg_academic=Avg('academic_score'),
        avg_psychological=Avg('psychological_score'),
        avg_physical=Avg('physical_score'),
        student_count=Count('id')
    ).order_by('student__grade')
    
    context = {
        'total_students': total_students,
        'total_schools': total_schools,
        'total_assessments': total_assessments,
        'total_results': total_results,
        'avg_academic': avg_academic,
        'avg_psychological': avg_psychological,
        'avg_physical': avg_physical,
        'recent_trends': list(recent_trends),
        'school_performance': school_performance,
        'assessment_distribution': list(assessment_distribution),
        'grade_performance': list(grade_performance),
    }
    
    return render(request, 'data_analytics/analytics_dashboard.html', context)


@login_required
def student_analytics_detail(request, pk):
    """Detailed analytics for a specific student."""
    student = get_object_or_404(Student, pk=pk)
    
    # Check permissions
    if not (request.user.is_staff or 
            (hasattr(request.user, 'student_profile') and student == request.user.student_profile)):
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Get student analytics
    analytics = StudentAnalytics.objects.filter(student=student).first()
    
    # Get performance trends
    trends = PerformanceTrend.objects.filter(student=student).order_by('date')
    
    # Get assessment results by type
    academic_results = AssessmentResult.objects.filter(
        student=student,
        assessment__assessment_type='academic'
    ).order_by('-completed_at')
    
    psychological_results = AssessmentResult.objects.filter(
        student=student,
        assessment__assessment_type='psychological'
    ).order_by('-completed_at')
    
    physical_results = AssessmentResult.objects.filter(
        student=student,
        assessment__assessment_type='physical'
    ).order_by('-completed_at')
    
    # Calculate improvement trends
    academic_trend = academic_results.values('completed_at', 'percentage').order_by('completed_at')
    psychological_trend = psychological_results.values('completed_at', 'percentage').order_by('completed_at')
    physical_trend = physical_results.values('completed_at', 'percentage').order_by('completed_at')
    
    # Compare with class average
    class_avg = AssessmentResult.objects.filter(
        assessment__grade=student.grade
    ).aggregate(Avg('percentage'))['percentage__avg'] or 0
    
    context = {
        'student': student,
        'analytics': analytics,
        'trends': trends,
        'academic_results': academic_results,
        'psychological_results': psychological_results,
        'physical_results': physical_results,
        'academic_trend': list(academic_trend),
        'psychological_trend': list(psychological_trend),
        'physical_trend': list(physical_trend),
        'class_avg': class_avg,
    }
    
    return render(request, 'data_analytics/student_analytics_detail.html', context)


@login_required
def school_analytics(request, pk=None):
    """School-level analytics."""
    if pk:
        school = get_object_or_404(School, pk=pk)
        schools = [school]
    else:
        schools = School.objects.all()
    
    school_data = []
    
    for school in schools:
        # Get school analytics
        analytics = SchoolAnalytics.objects.filter(school=school).order_by('-date').first()
        
        # Get student count
        student_count = Student.objects.filter(school=school).count()
        
        # Get average performance
        avg_performance = StudentAnalytics.objects.filter(
            student__school=school
        ).aggregate(
            avg_academic=Avg('academic_score'),
            avg_psychological=Avg('psychological_score'),
            avg_physical=Avg('physical_score')
        )
        
        # Get assessment completion rate
        total_assessments = Assessment.objects.filter(curriculum=school.school_type).count()
        completed_assessments = AssessmentResult.objects.filter(
            student__school=school
        ).count()
        
        completion_rate = (completed_assessments / (total_assessments * student_count)) * 100 if student_count > 0 else 0
        
        school_data.append({
            'school': school,
            'analytics': analytics,
            'student_count': student_count,
            'avg_performance': avg_performance,
            'completion_rate': completion_rate,
        })
    
    context = {
        'schools': school_data,
        'single_school': pk is not None,
    }
    
    return render(request, 'data_analytics/school_analytics.html', context)


@login_required
def performance_comparison(request):
    """Compare performance across different dimensions."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Grade comparison
    grade_comparison = StudentAnalytics.objects.values('student__grade').annotate(
        avg_academic=Avg('academic_score'),
        avg_psychological=Avg('psychological_score'),
        avg_physical=Avg('physical_score'),
        student_count=Count('id')
    ).order_by('student__grade')
    
    # School comparison
    school_comparison = StudentAnalytics.objects.values('student__school__name').annotate(
        avg_academic=Avg('academic_score'),
        avg_psychological=Avg('psychological_score'),
        avg_physical=Avg('physical_score'),
        student_count=Count('id')
    ).order_by('student__school__name')
    
    # Assessment type comparison
    assessment_comparison = AssessmentResult.objects.values('assessment__assessment_type').annotate(
        avg_score=Avg('percentage'),
        total_assessments=Count('id')
    ).order_by('assessment__assessment_type')
    
    # Time-based comparison (last 6 months)
    six_months_ago = timezone.now() - timedelta(days=180)
    time_comparison = AssessmentResult.objects.filter(
        completed_at__gte=six_months_ago
    ).values('completed_at__month').annotate(
        avg_score=Avg('percentage'),
        assessment_count=Count('id')
    ).order_by('completed_at__month')
    
    context = {
        'grade_comparison': list(grade_comparison),
        'school_comparison': list(school_comparison),
        'assessment_comparison': list(assessment_comparison),
        'time_comparison': list(time_comparison),
    }
    
    return render(request, 'data_analytics/performance_comparison.html', context)


@login_required
def trend_analysis(request):
    """Analyze performance trends over time."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Get date range from request
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    # Performance trends over time
    performance_trends = PerformanceTrend.objects.filter(
        date__gte=start_date
    ).values('date', 'assessment_type').annotate(
        avg_score=Avg('score'),
        count=Count('id')
    ).order_by('date', 'assessment_type')
    
    # Assessment completion trends
    assessment_trends = AssessmentResult.objects.filter(
        completed_at__gte=start_date
    ).values('completed_at__date').annotate(
        count=Count('id'),
        avg_percentage=Avg('percentage')
    ).order_by('completed_at__date')
    
    # Student engagement trends
    engagement_trends = AssessmentResult.objects.filter(
        completed_at__gte=start_date
    ).values('completed_at__date').annotate(
        unique_students=Count('student', distinct=True)
    ).order_by('completed_at__date')
    
    context = {
        'performance_trends': list(performance_trends),
        'assessment_trends': list(assessment_trends),
        'engagement_trends': list(engagement_trends),
        'days': days,
    }
    
    return render(request, 'data_analytics/trend_analysis.html', context)


@login_required
def generate_report(request):
    """Generate custom analytics reports."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        report_type = request.POST.get('report_type')
        date_from = request.POST.get('date_from')
        date_to = request.POST.get('date_to')
        filters = request.POST.get('filters', '{}')
        filters = json.loads(filters)
        
        # Generate report based on type
        if report_type == 'student_performance':
            report_data = generate_student_performance_report(date_from, date_to, filters)
        elif report_type == 'school_comparison':
            report_data = generate_school_comparison_report(date_from, date_to, filters)
        elif report_type == 'assessment_analysis':
            report_data = generate_assessment_analysis_report(date_from, date_to, filters)
        else:
            report_data = {}
        
        # Save report
        report = AnalyticsReport.objects.create(
            report_type=report_type,
            generated_by=request.user,
            parameters=json.dumps({
                'date_from': date_from,
                'date_to': date_to,
                'filters': filters
            }),
            data=json.dumps(report_data)
        )
        
        return JsonResponse({
            'success': True,
            'report_id': report.id,
            'data': report_data
        })
    
    # Get available report types
    report_types = [
        {'id': 'student_performance', 'name': 'Student Performance Report'},
        {'id': 'school_comparison', 'name': 'School Comparison Report'},
        {'id': 'assessment_analysis', 'name': 'Assessment Analysis Report'},
    ]
    
    context = {
        'report_types': report_types,
        'schools': School.objects.all(),
        'grades': Student.objects.values_list('grade', flat=True).distinct(),
    }
    
    return render(request, 'data_analytics/generate_report.html', context)


def generate_student_performance_report(date_from, date_to, filters):
    """Generate student performance report."""
    queryset = StudentAnalytics.objects.all()
    
    if date_from:
        queryset = queryset.filter(created_at__date__gte=date_from)
    if date_to:
        queryset = queryset.filter(created_at__date__lte=date_to)
    
    if 'grade' in filters:
        queryset = queryset.filter(student__grade=filters['grade'])
    if 'school' in filters:
        queryset = queryset.filter(student__school_id=filters['school'])
    
    return {
        'total_students': queryset.count(),
        'avg_academic': queryset.aggregate(Avg('academic_score'))['academic_score__avg'] or 0,
        'avg_psychological': queryset.aggregate(Avg('psychological_score'))['psychological_score__avg'] or 0,
        'avg_physical': queryset.aggregate(Avg('physical_score'))['physical_score__avg'] or 0,
        'top_performers': list(queryset.order_by('-academic_score')[:10].values(
            'student__user__first_name', 'student__user__last_name', 'academic_score'
        )),
    }


def generate_school_comparison_report(date_from, date_to, filters):
    """Generate school comparison report."""
    queryset = SchoolAnalytics.objects.all()
    
    if date_from:
        queryset = queryset.filter(date__gte=date_from)
    if date_to:
        queryset = queryset.filter(date__lte=date_to)
    
    return {
        'schools': list(queryset.values('school__name', 'total_students', 'avg_performance')),
        'top_school': queryset.order_by('-avg_performance').first(),
    }


def generate_assessment_analysis_report(date_from, date_to, filters):
    """Generate assessment analysis report."""
    queryset = AssessmentResult.objects.all()
    
    if date_from:
        queryset = queryset.filter(completed_at__date__gte=date_from)
    if date_to:
        queryset = queryset.filter(completed_at__date__lte=date_to)
    
    if 'assessment_type' in filters:
        queryset = queryset.filter(assessment__assessment_type=filters['assessment_type'])
    
    return {
        'total_assessments': queryset.count(),
        'avg_score': queryset.aggregate(Avg('percentage'))['percentage__avg'] or 0,
        'by_type': list(queryset.values('assessment__assessment_type').annotate(
            count=Count('id'), avg_score=Avg('percentage')
        )),
    }


@login_required
def view_report(request, pk):
    """View a generated report."""
    report = get_object_or_404(AnalyticsReport, pk=pk)
    
    # Check permissions
    if not (request.user.is_staff or report.generated_by == request.user):
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    try:
        report_data = json.loads(report.data)
        parameters = json.loads(report.parameters)
    except json.JSONDecodeError:
        report_data = {}
        parameters = {}
    
    context = {
        'report': report,
        'report_data': report_data,
        'parameters': parameters,
    }
    
    return render(request, 'data_analytics/view_report.html', context)


@login_required
def reports_list(request):
    """List all generated reports."""
    if request.user.is_staff:
        reports = AnalyticsReport.objects.all()
    else:
        reports = AnalyticsReport.objects.filter(generated_by=request.user)
    
    reports = reports.order_by('-created_at')
    
    context = {
        'reports': reports,
    }
    
    return render(request, 'data_analytics/reports_list.html', context)


# API Views for real-time data
@login_required
def analytics_api(request):
    """API endpoint for analytics data."""
    # Overall statistics
    total_students = Student.objects.count()
    total_assessments = Assessment.objects.count()
    total_results = AssessmentResult.objects.count()
    
    # Performance averages
    avg_academic = StudentAnalytics.objects.aggregate(Avg('academic_score'))['academic_score__avg'] or 0
    avg_psychological = StudentAnalytics.objects.aggregate(Avg('psychological_score'))['psychological_score__avg'] or 0
    avg_physical = StudentAnalytics.objects.aggregate(Avg('physical_score'))['physical_score__avg'] or 0
    
    # Recent trends (last 7 days)
    week_ago = timezone.now() - timedelta(days=7)
    recent_trends = PerformanceTrend.objects.filter(
        date__gte=week_ago
    ).values('date').annotate(
        avg_score=Avg('score')
    ).order_by('date')
    
    return JsonResponse({
        'total_students': total_students,
        'total_assessments': total_assessments,
        'total_results': total_results,
        'avg_academic': avg_academic,
        'avg_psychological': avg_psychological,
        'avg_physical': avg_physical,
        'recent_trends': list(recent_trends),
    })


@login_required
def performance_api(request):
    """API endpoint for performance data."""
    # Grade-wise performance
    grade_performance = StudentAnalytics.objects.values('student__grade').annotate(
        avg_academic=Avg('academic_score'),
        avg_psychological=Avg('psychological_score'),
        avg_physical=Avg('physical_score'),
        student_count=Count('id')
    ).order_by('student__grade')
    
    # School performance
    school_performance = StudentAnalytics.objects.values('student__school__name').annotate(
        avg_academic=Avg('academic_score'),
        avg_psychological=Avg('psychological_score'),
        avg_physical=Avg('physical_score'),
        student_count=Count('id')
    ).order_by('student__school__name')
    
    return JsonResponse({
        'grade_performance': list(grade_performance),
        'school_performance': list(school_performance),
    })
