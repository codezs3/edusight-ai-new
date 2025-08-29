from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView
from django.http import JsonResponse
from django.contrib import messages
from django.db.models import Q, Count, Avg, Max, Min, Sum, Prefetch
from django.utils import timezone
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.db import transaction
from django.conf import settings
from datetime import datetime, timedelta
import json
import logging

# Configure logging
logger = logging.getLogger(__name__)

from .models import StudentAnalytics, SchoolAnalytics, PerformanceTrend, AnalyticsReport, DashboardMetrics
from students.models import Student, School
from assessments.models import Assessment, AssessmentResult


@login_required
@cache_page(300)  # Cache for 5 minutes
def analytics_dashboard(request):
    """
    Optimized main analytics dashboard with caching and efficient queries.
    """
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Check cache first for expensive computations
    cache_key = f'analytics_dashboard_{request.user.id}'
    cached_data = cache.get(cache_key)
    
    if cached_data:
        logger.info(f"Analytics dashboard cache hit for user {request.user.id}")
        return render(request, 'data_analytics/analytics_dashboard.html', cached_data)
    
    try:
        with transaction.atomic():
            # Use efficient single-query aggregations where possible
            stats_query = {
                'total_students': Student.objects.count(),
                'total_schools': School.objects.count(), 
                'total_assessments': Assessment.objects.count(),
                'total_results': AssessmentResult.objects.count()
            }
            
            # Optimized performance averages with single query
            performance_averages = StudentAnalytics.objects.aggregate(
                avg_academic=Avg('academic_score'),
                avg_psychological=Avg('wellbeing_score'),
                avg_physical=Avg('fitness_score'),
                total_records=Count('id')
            )
            
            # Efficient recent trends with limited data
            recent_trends = PerformanceTrend.objects.values('end_date').annotate(
                avg_score=Avg('final_value'),
                count=Count('id')
            ).order_by('-end_date')[:20]  # Reduced to 20 for better performance
            
            # Optimized school performance with select_related
            school_performance = SchoolAnalytics.objects.select_related('school').order_by('-date')[:10]
            
            # Single query for assessment distribution
            assessment_distribution = list(Assessment.objects.values('assessment_type').annotate(
                count=Count('id')
            ))
            
            # Efficient grade-wise performance
            grade_performance = list(StudentAnalytics.objects.values('student__grade').annotate(
                avg_academic=Avg('academic_score'),
                avg_psychological=Avg('wellbeing_score'),
                avg_physical=Avg('fitness_score'),
                student_count=Count('id')
            ).order_by('student__grade'))
            
            context = {
                **stats_query,
                'avg_academic': performance_averages.get('avg_academic') or 0,
                'avg_psychological': performance_averages.get('avg_psychological') or 0,
                'avg_physical': performance_averages.get('avg_physical') or 0,
                'total_analytics_records': performance_averages.get('total_records') or 0,
                'recent_trends': list(recent_trends),
                'school_performance': school_performance,
                'assessment_distribution': assessment_distribution,
                'grade_performance': grade_performance,
            }
            
            # Cache the context for 5 minutes
            cache.set(cache_key, context, 300)
            logger.info(f"Analytics dashboard data cached for user {request.user.id}")
            
    except Exception as e:
        logger.error(f"Error in analytics dashboard: {str(e)}")
        messages.error(request, 'Error loading analytics data.')
        context = {
            'total_students': 0,
            'total_schools': 0,
            'total_assessments': 0,
            'total_results': 0,
            'avg_academic': 0,
            'avg_psychological': 0,
            'avg_physical': 0,
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
    trends = PerformanceTrend.objects.filter(student=student).order_by('end_date')
    
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
            avg_psychological=Avg('wellbeing_score'),
            avg_physical=Avg('fitness_score')
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
        avg_psychological=Avg('wellbeing_score'),
        avg_physical=Avg('fitness_score'),
        student_count=Count('id')
    ).order_by('student__grade')
    
    # School comparison
    school_comparison = StudentAnalytics.objects.values('student__school__name').annotate(
        avg_academic=Avg('academic_score'),
        avg_psychological=Avg('wellbeing_score'),
        avg_physical=Avg('fitness_score'),
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
        'avg_psychological': queryset.aggregate(Avg('wellbeing_score'))['wellbeing_score__avg'] or 0,
        'avg_physical': queryset.aggregate(Avg('fitness_score'))['fitness_score__avg'] or 0,
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
    avg_psychological = StudentAnalytics.objects.aggregate(Avg('wellbeing_score'))['wellbeing_score__avg'] or 0
    avg_physical = StudentAnalytics.objects.aggregate(Avg('fitness_score'))['fitness_score__avg'] or 0
    
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
        avg_psychological=Avg('wellbeing_score'),
        avg_physical=Avg('fitness_score'),
        student_count=Count('id')
    ).order_by('student__grade')
    
    # School performance
    school_performance = StudentAnalytics.objects.values('student__school__name').annotate(
        avg_academic=Avg('academic_score'),
        avg_psychological=Avg('wellbeing_score'),
        avg_physical=Avg('fitness_score'),
        student_count=Count('id')
    ).order_by('student__school__name')
    
    return JsonResponse({
        'grade_performance': list(grade_performance),
        'school_performance': list(school_performance),
    })


# Additional view functions for the URLs
@login_required
def student_analytics_dashboard(request):
    """Student analytics dashboard."""
    return analytics_dashboard(request)


@login_required  
def school_analytics_dashboard(request):
    """School analytics dashboard."""
    return school_analytics(request)


@login_required
def student_detailed_analytics(request, student_id):
    """Detailed analytics for a specific student."""
    return student_analytics_detail(request, student_id)


@login_required
def student_performance_trends(request, student_id):
    """Performance trends for a specific student."""
    student = get_object_or_404(Student, pk=student_id)
    
    # Get performance trends over time
    trends = PerformanceTrend.objects.filter(student=student).order_by('end_date')
    
    # Group by assessment type
    academic_trends = trends.filter(assessment_type='academic').values('date', 'score')
    psychological_trends = trends.filter(assessment_type='psychological').values('date', 'score')
    physical_trends = trends.filter(assessment_type='physical').values('date', 'score')
    
    context = {
        'student': student,
        'academic_trends': list(academic_trends),
        'psychological_trends': list(psychological_trends),
        'physical_trends': list(physical_trends),
    }
    
    return render(request, 'data_analytics/student_performance_trends.html', context)


@login_required
def student_reports(request, student_id):
    """Reports for a specific student."""
    student = get_object_or_404(Student, pk=student_id)
    
    # Get all reports for this student
    reports = AnalyticsReport.objects.filter(
        parameters__icontains=f'"student_id": {student_id}'
    ).order_by('-created_at')
    
    context = {
        'student': student,
        'reports': reports,
    }
    
    return render(request, 'data_analytics/student_reports.html', context)


@login_required
def comparative_analytics(request):
    """Comparative analytics view."""
    return performance_comparison(request)


@login_required
def benchmark_analytics(request):
    """Benchmark analytics view."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # National/Regional benchmarks (mock data)
    benchmarks = {
        'academic': {'national_avg': 75.5, 'regional_avg': 72.3, 'school_avg': 0},
        'psychological': {'national_avg': 68.2, 'regional_avg': 65.8, 'school_avg': 0},
        'physical': {'national_avg': 71.0, 'regional_avg': 69.5, 'school_avg': 0},
    }
    
    # Calculate school averages
    school_avg = StudentAnalytics.objects.aggregate(
        academic=Avg('academic_score'),
        psychological=Avg('wellbeing_score'),
        physical=Avg('fitness_score')
    )
    
    benchmarks['academic']['school_avg'] = school_avg['academic'] or 0
    benchmarks['psychological']['school_avg'] = school_avg['psychological'] or 0  
    benchmarks['physical']['school_avg'] = school_avg['physical'] or 0
    
    context = {
        'benchmarks': benchmarks,
    }
    
    return render(request, 'data_analytics/benchmark_analytics.html', context)


@login_required
def analytics_reports(request):
    """Analytics reports view."""
    return reports_list(request)


@login_required
def generate_analytics_report(request):
    """Generate analytics report."""
    return generate_report(request)


# API endpoints
@login_required
def analytics_dashboard_api(request):
    """API for analytics dashboard."""
    return analytics_api(request)


@login_required
def student_analytics_api(request, student_id):
    """API for student analytics."""
    student = get_object_or_404(Student, pk=student_id)
    
    # Get student analytics
    analytics = StudentAnalytics.objects.filter(student=student).first()
    
    # Get recent assessment results
    recent_results = AssessmentResult.objects.filter(
        student=student
    ).order_by('-completed_at')[:10]
    
    data = {
        'student_id': student.id,
        'student_name': f"{student.user.first_name} {student.user.last_name}",
        'analytics': {
            'academic_score': analytics.academic_score if analytics else 0,
            'wellbeing_score': analytics.wellbeing_score if analytics else 0,
            'fitness_score': analytics.fitness_score if analytics else 0,
        } if analytics else {},
        'recent_results': [
            {
                'assessment': result.assessment.title,
                'score': result.percentage,
                'date': result.completed_at.isoformat(),
            }
            for result in recent_results
        ]
    }
    
    return JsonResponse(data)


@login_required
def analytics_trends_api(request):
    """API for analytics trends."""
    days = int(request.GET.get('days', 30))
    start_date = timezone.now() - timedelta(days=days)
    
    # Performance trends over time
    trends = PerformanceTrend.objects.filter(
        date__gte=start_date
    ).values('date', 'assessment_type').annotate(
        avg_score=Avg('score')
    ).order_by('date')
    
    return JsonResponse({
        'trends': list(trends)
    })
