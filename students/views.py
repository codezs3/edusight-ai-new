from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib import messages
from django.db.models import Q, Count, Avg
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.utils import timezone
from datetime import datetime, timedelta

from .models import User, School, Student, Teacher, Parent, Counselor, Attendance, UserAnalytics
from assessments.models import Assessment, AssessmentResult
from data_analytics.models import StudentAnalytics, PerformanceTrend


class StudentListView(LoginRequiredMixin, ListView):
    """List all students with search and filtering."""
    model = Student
    template_name = 'students/student_list.html'
    context_object_name = 'students'
    paginate_by = 20

    def get_queryset(self):
        queryset = Student.objects.select_related('user', 'school', 'parent').all()
        
        # Search functionality
        search_query = self.request.GET.get('search', '')
        if search_query:
            queryset = queryset.filter(
                Q(user__first_name__icontains=search_query) |
                Q(user__last_name__icontains=search_query) |
                Q(roll_number__icontains=search_query) |
                Q(grade__icontains=search_query) |
                Q(section__icontains=search_query)
            )
        
        # Filter by grade
        grade_filter = self.request.GET.get('grade', '')
        if grade_filter:
            queryset = queryset.filter(grade=grade_filter)
        
        # Filter by school
        school_filter = self.request.GET.get('school', '')
        if school_filter:
            queryset = queryset.filter(school_id=school_filter)
        
        return queryset.order_by('user__first_name', 'user__last_name')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['schools'] = School.objects.all()
        context['grades'] = Student.objects.values_list('grade', flat=True).distinct()
        context['total_students'] = Student.objects.count()
        context['search_query'] = self.request.GET.get('search', '')
        return context


class StudentDetailView(LoginRequiredMixin, DetailView):
    """Detailed view of a student with analytics."""
    model = Student
    template_name = 'students/student_detail.html'
    context_object_name = 'student'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        student = self.get_object()
        
        # Get student's assessment results
        context['assessment_results'] = AssessmentResult.objects.filter(
            student=student
        ).select_related('assessment').order_by('-completed_at')[:10]
        
        # Get student analytics
        context['analytics'] = StudentAnalytics.objects.filter(
            student=student
        ).first()
        
        # Get performance trends
        context['performance_trends'] = PerformanceTrend.objects.filter(
            student=student
        ).order_by('-date')[:6]
        
        # Get attendance data
        context['attendance'] = Attendance.objects.filter(
            student=student
        ).order_by('-date')[:30]
        
        # Calculate attendance percentage
        total_days = context['attendance'].count()
        present_days = context['attendance'].filter(status='present').count()
        context['attendance_percentage'] = (present_days / total_days * 100) if total_days > 0 else 0
        
        return context


class StudentCreateView(LoginRequiredMixin, CreateView):
    """Create a new student."""
    model = Student
    template_name = 'students/student_form.html'
    fields = ['school', 'grade', 'section', 'roll_number', 'admission_date', 
              'date_of_birth', 'gender', 'emergency_contact']
    success_url = reverse_lazy('students:student_list')

    def form_valid(self, form):
        # Create user account for the student
        user = User.objects.create_user(
            username=f"student_{form.cleaned_data['roll_number']}",
            first_name=self.request.POST.get('first_name'),
            last_name=self.request.POST.get('last_name'),
            email=self.request.POST.get('email'),
            role='student'
        )
        user.set_password('student123')  # Default password
        user.save()
        
        form.instance.user = user
        messages.success(self.request, 'Student created successfully!')
        return super().form_valid(form)


class StudentUpdateView(LoginRequiredMixin, UpdateView):
    """Update student information."""
    model = Student
    template_name = 'students/student_form.html'
    fields = ['school', 'grade', 'section', 'roll_number', 'admission_date', 
              'date_of_birth', 'gender', 'emergency_contact']
    success_url = reverse_lazy('students:student_list')

    def form_valid(self, form):
        messages.success(self.request, 'Student updated successfully!')
        return super().form_valid(form)


@login_required
def student_dashboard(request, pk):
    """Student's personal dashboard."""
    student = get_object_or_404(Student, pk=pk)
    
    # Get recent activities
    recent_assessments = AssessmentResult.objects.filter(
        student=student
    ).select_related('assessment').order_by('-completed_at')[:5]
    
    # Get performance summary
    performance_summary = AssessmentResult.objects.filter(
        student=student
    ).aggregate(
        avg_score=Avg('percentage'),
        total_assessments=Count('id')
    )
    
    # Get upcoming assessments
    upcoming_assessments = Assessment.objects.filter(
        grade=student.grade,
        curriculum=student.school.school_type
    ).exclude(
        assessmentresult__student=student
    )[:5]
    
    context = {
        'student': student,
        'recent_assessments': recent_assessments,
        'performance_summary': performance_summary,
        'upcoming_assessments': upcoming_assessments,
    }
    
    return render(request, 'students/student_dashboard.html', context)


@login_required
def attendance_view(request):
    """View and manage student attendance."""
    if request.method == 'POST':
        student_id = request.POST.get('student_id')
        date = request.POST.get('date')
        status = request.POST.get('status')
        
        student = get_object_or_404(Student, id=student_id)
        attendance, created = Attendance.objects.get_or_create(
            student=student,
            date=date,
            defaults={'status': status}
        )
        
        if not created:
            attendance.status = status
            attendance.save()
        
        return JsonResponse({'success': True})
    
    # Get attendance data for the current month
    current_month = timezone.now().month
    current_year = timezone.now().year
    
    students = Student.objects.all()
    attendance_data = {}
    
    for student in students:
        attendance_data[student.id] = {
            'student': student,
            'attendance': Attendance.objects.filter(
                student=student,
                date__month=current_month,
                date__year=current_year
            ).order_by('date')
        }
    
    context = {
        'attendance_data': attendance_data,
        'current_month': current_month,
        'current_year': current_year,
    }
    
    return render(request, 'students/attendance.html', context)


@login_required
def student_analytics(request, pk):
    """Detailed analytics for a student."""
    student = get_object_or_404(Student, pk=pk)
    
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
    
    # Calculate trends
    academic_trend = academic_results.values('completed_at', 'percentage').order_by('completed_at')
    psychological_trend = psychological_results.values('completed_at', 'percentage').order_by('completed_at')
    physical_trend = physical_results.values('completed_at', 'percentage').order_by('completed_at')
    
    context = {
        'student': student,
        'academic_results': academic_results,
        'psychological_results': psychological_results,
        'physical_results': physical_results,
        'academic_trend': list(academic_trend),
        'psychological_trend': list(psychological_trend),
        'physical_trend': list(physical_trend),
    }
    
    return render(request, 'students/student_analytics.html', context)


# API Views for AJAX requests
@login_required
def student_api(request):
    """API endpoint for student data."""
    students = Student.objects.select_related('user', 'school').all()
    
    data = []
    for student in students:
        data.append({
            'id': student.id,
            'name': f"{student.user.first_name} {student.user.last_name}",
            'roll_number': student.roll_number,
            'grade': student.grade,
            'section': student.section,
            'school': student.school.name,
            'email': student.user.email,
        })
    
    return JsonResponse({'students': data})


@login_required
def student_stats_api(request):
    """API endpoint for student statistics."""
    total_students = Student.objects.count()
    students_by_grade = Student.objects.values('grade').annotate(count=Count('id'))
    students_by_school = Student.objects.values('school__name').annotate(count=Count('id'))
    
    return JsonResponse({
        'total_students': total_students,
        'by_grade': list(students_by_grade),
        'by_school': list(students_by_school),
    })
