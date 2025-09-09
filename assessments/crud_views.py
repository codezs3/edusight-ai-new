"""
Comprehensive CRUD views for all Quick Actions in EduSight.
"""

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy, reverse
from django.contrib import messages
from django.db.models import Q, Count, Avg, Max, Min, Sum
from django.http import JsonResponse, HttpResponse
from django.core.paginator import Paginator
from django.utils import timezone
from django.forms import modelform_factory
from datetime import datetime, timedelta
import json
import csv

from .crud_models import (
    Subject, Calendar, Exam, Progress, Curriculum, 
    Skill, Template, Maintenance
)
from .models import Assessment, AssessmentResult
from students.models import Student, School, User


# ==================== SUBJECTS CRUD ====================

class SubjectListView(LoginRequiredMixin, ListView):
    """List all subjects with filtering and search."""
    model = Subject
    template_name = 'assessments/crud/subject_list.html'
    context_object_name = 'subjects'
    paginate_by = 20

    def get_queryset(self):
        queryset = Subject.objects.select_related('created_by').all()
        
        # Search functionality
        search_query = self.request.GET.get('search', '')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(code__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        
        # Filter by curriculum
        curriculum = self.request.GET.get('curriculum', '')
        if curriculum:
            queryset = queryset.filter(curriculum=curriculum)
        
        # Filter by grade level
        grade = self.request.GET.get('grade', '')
        if grade:
            queryset = queryset.filter(grade_levels__contains=[grade])
        
        return queryset.order_by('name')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['curriculum_choices'] = Subject.CURRICULUM_CHOICES
        context['search_query'] = self.request.GET.get('search', '')
        context['selected_curriculum'] = self.request.GET.get('curriculum', '')
        context['selected_grade'] = self.request.GET.get('grade', '')
        return context


class SubjectCreateView(LoginRequiredMixin, CreateView):
    """Create new subject."""
    model = Subject
    template_name = 'assessments/crud/subject_form.html'
    fields = [
        'name', 'code', 'description', 'curriculum', 
        'grade_levels', 'is_core', 'is_active'
    ]
    success_url = reverse_lazy('assessments:subject_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Subject created successfully!')
        return super().form_valid(form)


class SubjectUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing subject."""
    model = Subject
    template_name = 'assessments/crud/subject_form.html'
    fields = [
        'name', 'code', 'description', 'curriculum', 
        'grade_levels', 'is_core', 'is_active'
    ]
    success_url = reverse_lazy('assessments:subject_list')

    def form_valid(self, form):
        messages.success(self.request, 'Subject updated successfully!')
        return super().form_valid(form)


class SubjectDeleteView(LoginRequiredMixin, DeleteView):
    """Delete subject."""
    model = Subject
    template_name = 'assessments/crud/subject_confirm_delete.html'
    success_url = reverse_lazy('assessments:subject_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Subject deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== CALENDAR CRUD ====================

class CalendarListView(LoginRequiredMixin, ListView):
    """List all calendar events."""
    model = Calendar
    template_name = 'assessments/crud/calendar_list.html'
    context_object_name = 'events'
    paginate_by = 20

    def get_queryset(self):
        queryset = Calendar.objects.select_related('created_by', 'school', 'subject').all()
        
        # Filter by date range
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                start_date__date__gte=start_date,
                end_date__date__lte=end_date
            )
        
        # Filter by event type
        event_type = self.request.GET.get('event_type', '')
        if event_type:
            queryset = queryset.filter(event_type=event_type)
        
        return queryset.order_by('start_date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event_type_choices'] = Calendar.EVENT_TYPE_CHOICES
        return context


class CalendarCreateView(LoginRequiredMixin, CreateView):
    """Create new calendar event."""
    model = Calendar
    template_name = 'assessments/crud/calendar_form.html'
    fields = [
        'title', 'description', 'event_type', 'start_date', 'end_date',
        'is_all_day', 'location', 'school', 'grade', 'subject',
        'is_recurring', 'recurrence_pattern'
    ]
    success_url = reverse_lazy('assessments:calendar_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Calendar event created successfully!')
        return super().form_valid(form)


class CalendarUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing calendar event."""
    model = Calendar
    template_name = 'assessments/crud/calendar_form.html'
    fields = [
        'title', 'description', 'event_type', 'start_date', 'end_date',
        'is_all_day', 'location', 'school', 'grade', 'subject',
        'is_recurring', 'recurrence_pattern'
    ]
    success_url = reverse_lazy('assessments:calendar_list')

    def form_valid(self, form):
        messages.success(self.request, 'Calendar event updated successfully!')
        return super().form_valid(form)


class CalendarDeleteView(LoginRequiredMixin, DeleteView):
    """Delete calendar event."""
    model = Calendar
    template_name = 'assessments/crud/calendar_confirm_delete.html'
    success_url = reverse_lazy('assessments:calendar_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Calendar event deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== EXAMS CRUD ====================

class ExamListView(LoginRequiredMixin, ListView):
    """List all exams."""
    model = Exam
    template_name = 'assessments/crud/exam_list.html'
    context_object_name = 'exams'
    paginate_by = 20

    def get_queryset(self):
        queryset = Exam.objects.select_related('subject', 'school', 'created_by').all()
        
        # Filter by exam type
        exam_type = self.request.GET.get('exam_type', '')
        if exam_type:
            queryset = queryset.filter(exam_type=exam_type)
        
        # Filter by subject
        subject = self.request.GET.get('subject', '')
        if subject:
            queryset = queryset.filter(subject_id=subject)
        
        # Filter by date range
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                exam_date__date__gte=start_date,
                exam_date__date__lte=end_date
            )
        
        return queryset.order_by('-exam_date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['exam_type_choices'] = Exam.EXAM_TYPE_CHOICES
        context['subjects'] = Subject.objects.filter(is_active=True)
        return context


class ExamCreateView(LoginRequiredMixin, CreateView):
    """Create new exam."""
    model = Exam
    template_name = 'assessments/crud/exam_form.html'
    fields = [
        'title', 'description', 'exam_type', 'subject', 'school',
        'grade', 'exam_date', 'duration_minutes', 'total_marks',
        'passing_marks', 'is_active'
    ]
    success_url = reverse_lazy('assessments:exam_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Exam created successfully!')
        return super().form_valid(form)


class ExamUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing exam."""
    model = Exam
    template_name = 'assessments/crud/exam_form.html'
    fields = [
        'title', 'description', 'exam_type', 'subject', 'school',
        'grade', 'exam_date', 'duration_minutes', 'total_marks',
        'passing_marks', 'is_active'
    ]
    success_url = reverse_lazy('assessments:exam_list')

    def form_valid(self, form):
        messages.success(self.request, 'Exam updated successfully!')
        return super().form_valid(form)


class ExamDeleteView(LoginRequiredMixin, DeleteView):
    """Delete exam."""
    model = Exam
    template_name = 'assessments/crud/exam_confirm_delete.html'
    success_url = reverse_lazy('assessments:exam_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Exam deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== PROGRESS CRUD ====================

class ProgressListView(LoginRequiredMixin, ListView):
    """List all progress records."""
    model = Progress
    template_name = 'assessments/crud/progress_list.html'
    context_object_name = 'progress_records'
    paginate_by = 20

    def get_queryset(self):
        queryset = Progress.objects.select_related(
            'student', 'subject', 'assessment', 'exam', 'recorded_by'
        ).all()
        
        # Filter by student
        student = self.request.GET.get('student', '')
        if student:
            queryset = queryset.filter(student_id=student)
        
        # Filter by subject
        subject = self.request.GET.get('subject', '')
        if subject:
            queryset = queryset.filter(subject_id=subject)
        
        # Filter by date range
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(
                date_recorded__date__gte=start_date,
                date_recorded__date__lte=end_date
            )
        
        return queryset.order_by('-date_recorded')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['students'] = Student.objects.filter(is_active=True)
        context['subjects'] = Subject.objects.filter(is_active=True)
        return context


class ProgressCreateView(LoginRequiredMixin, CreateView):
    """Create new progress record."""
    model = Progress
    template_name = 'assessments/crud/progress_form.html'
    fields = [
        'student', 'subject', 'assessment', 'exam', 'marks_obtained',
        'total_marks', 'percentage', 'grade', 'remarks'
    ]
    success_url = reverse_lazy('assessments:progress_list')

    def form_valid(self, form):
        form.instance.recorded_by = self.request.user
        # Calculate percentage if not provided
        if not form.instance.percentage:
            form.instance.percentage = (form.instance.marks_obtained / form.instance.total_marks) * 100
        messages.success(self.request, 'Progress record created successfully!')
        return super().form_valid(form)


class ProgressUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing progress record."""
    model = Progress
    template_name = 'assessments/crud/progress_form.html'
    fields = [
        'student', 'subject', 'assessment', 'exam', 'marks_obtained',
        'total_marks', 'percentage', 'grade', 'remarks'
    ]
    success_url = reverse_lazy('assessments:progress_list')

    def form_valid(self, form):
        messages.success(self.request, 'Progress record updated successfully!')
        return super().form_valid(form)


class ProgressDeleteView(LoginRequiredMixin, DeleteView):
    """Delete progress record."""
    model = Progress
    template_name = 'assessments/crud/progress_confirm_delete.html'
    success_url = reverse_lazy('assessments:progress_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Progress record deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== CURRICULUM CRUD ====================

class CurriculumListView(LoginRequiredMixin, ListView):
    """List all curricula."""
    model = Curriculum
    template_name = 'assessments/crud/curriculum_list.html'
    context_object_name = 'curricula'
    paginate_by = 20

    def get_queryset(self):
        queryset = Curriculum.objects.select_related('created_by').prefetch_related('subjects').all()
        
        # Filter by curriculum type
        curriculum_type = self.request.GET.get('curriculum_type', '')
        if curriculum_type:
            queryset = queryset.filter(curriculum_type=curriculum_type)
        
        return queryset.order_by('name')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['curriculum_type_choices'] = Curriculum.CURRICULUM_TYPE_CHOICES
        return context


class CurriculumCreateView(LoginRequiredMixin, CreateView):
    """Create new curriculum."""
    model = Curriculum
    template_name = 'assessments/crud/curriculum_form.html'
    fields = [
        'name', 'code', 'curriculum_type', 'description', 
        'grade_levels', 'subjects', 'is_active'
    ]
    success_url = reverse_lazy('assessments:curriculum_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Curriculum created successfully!')
        return super().form_valid(form)


class CurriculumUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing curriculum."""
    model = Curriculum
    template_name = 'assessments/crud/curriculum_form.html'
    fields = [
        'name', 'code', 'curriculum_type', 'description', 
        'grade_levels', 'subjects', 'is_active'
    ]
    success_url = reverse_lazy('assessments:curriculum_list')

    def form_valid(self, form):
        messages.success(self.request, 'Curriculum updated successfully!')
        return super().form_valid(form)


class CurriculumDeleteView(LoginRequiredMixin, DeleteView):
    """Delete curriculum."""
    model = Curriculum
    template_name = 'assessments/crud/curriculum_confirm_delete.html'
    success_url = reverse_lazy('assessments:curriculum_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Curriculum deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== SKILLS CRUD ====================

class SkillListView(LoginRequiredMixin, ListView):
    """List all skills."""
    model = Skill
    template_name = 'assessments/crud/skill_list.html'
    context_object_name = 'skills'
    paginate_by = 20

    def get_queryset(self):
        queryset = Skill.objects.select_related('created_by').all()
        
        # Filter by category
        category = self.request.GET.get('category', '')
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset.order_by('category', 'name')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['category_choices'] = Skill.SKILL_CATEGORY_CHOICES
        return context


class SkillCreateView(LoginRequiredMixin, CreateView):
    """Create new skill."""
    model = Skill
    template_name = 'assessments/crud/skill_form.html'
    fields = [
        'name', 'code', 'description', 'category', 
        'grade_levels', 'is_core', 'is_active'
    ]
    success_url = reverse_lazy('assessments:skill_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Skill created successfully!')
        return super().form_valid(form)


class SkillUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing skill."""
    model = Skill
    template_name = 'assessments/crud/skill_form.html'
    fields = [
        'name', 'code', 'description', 'category', 
        'grade_levels', 'is_core', 'is_active'
    ]
    success_url = reverse_lazy('assessments:skill_list')

    def form_valid(self, form):
        messages.success(self.request, 'Skill updated successfully!')
        return super().form_valid(form)


class SkillDeleteView(LoginRequiredMixin, DeleteView):
    """Delete skill."""
    model = Skill
    template_name = 'assessments/crud/skill_confirm_delete.html'
    success_url = reverse_lazy('assessments:skill_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Skill deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== TEMPLATES CRUD ====================

class TemplateListView(LoginRequiredMixin, ListView):
    """List all templates."""
    model = Template
    template_name = 'assessments/crud/template_list.html'
    context_object_name = 'templates'
    paginate_by = 20

    def get_queryset(self):
        queryset = Template.objects.select_related('created_by').all()
        
        # Filter by template type
        template_type = self.request.GET.get('template_type', '')
        if template_type:
            queryset = queryset.filter(template_type=template_type)
        
        return queryset.order_by('template_type', 'name')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['template_type_choices'] = Template.TEMPLATE_TYPE_CHOICES
        return context


class TemplateCreateView(LoginRequiredMixin, CreateView):
    """Create new template."""
    model = Template
    template_name = 'assessments/crud/template_form.html'
    fields = [
        'name', 'template_type', 'description', 'content', 
        'variables', 'is_default', 'is_active'
    ]
    success_url = reverse_lazy('assessments:template_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Template created successfully!')
        return super().form_valid(form)


class TemplateUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing template."""
    model = Template
    template_name = 'assessments/crud/template_form.html'
    fields = [
        'name', 'template_type', 'description', 'content', 
        'variables', 'is_default', 'is_active'
    ]
    success_url = reverse_lazy('assessments:template_list')

    def form_valid(self, form):
        messages.success(self.request, 'Template updated successfully!')
        return super().form_valid(form)


class TemplateDeleteView(LoginRequiredMixin, DeleteView):
    """Delete template."""
    model = Template
    template_name = 'assessments/crud/template_confirm_delete.html'
    success_url = reverse_lazy('assessments:template_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Template deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== MAINTENANCE CRUD ====================

class MaintenanceListView(LoginRequiredMixin, ListView):
    """List all maintenance records."""
    model = Maintenance
    template_name = 'assessments/crud/maintenance_list.html'
    context_object_name = 'maintenance_records'
    paginate_by = 20

    def get_queryset(self):
        queryset = Maintenance.objects.select_related('created_by').all()
        
        # Filter by status
        status = self.request.GET.get('status', '')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by maintenance type
        maintenance_type = self.request.GET.get('maintenance_type', '')
        if maintenance_type:
            queryset = queryset.filter(maintenance_type=maintenance_type)
        
        return queryset.order_by('-scheduled_start')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['status_choices'] = Maintenance.STATUS_CHOICES
        context['maintenance_type_choices'] = Maintenance.MAINTENANCE_TYPE_CHOICES
        return context


class MaintenanceCreateView(LoginRequiredMixin, CreateView):
    """Create new maintenance record."""
    model = Maintenance
    template_name = 'assessments/crud/maintenance_form.html'
    fields = [
        'title', 'description', 'maintenance_type', 'status',
        'scheduled_start', 'scheduled_end', 'actual_start', 'actual_end',
        'affected_services', 'notes'
    ]
    success_url = reverse_lazy('assessments:maintenance_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Maintenance record created successfully!')
        return super().form_valid(form)


class MaintenanceUpdateView(LoginRequiredMixin, UpdateView):
    """Update existing maintenance record."""
    model = Maintenance
    template_name = 'assessments/crud/maintenance_form.html'
    fields = [
        'title', 'description', 'maintenance_type', 'status',
        'scheduled_start', 'scheduled_end', 'actual_start', 'actual_end',
        'affected_services', 'notes'
    ]
    success_url = reverse_lazy('assessments:maintenance_list')

    def form_valid(self, form):
        messages.success(self.request, 'Maintenance record updated successfully!')
        return super().form_valid(form)


class MaintenanceDeleteView(LoginRequiredMixin, DeleteView):
    """Delete maintenance record."""
    model = Maintenance
    template_name = 'assessments/crud/maintenance_confirm_delete.html'
    success_url = reverse_lazy('assessments:maintenance_list')

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Maintenance record deleted successfully!')
        return super().delete(request, *args, **kwargs)


# ==================== API VIEWS ====================

@login_required
def get_subjects_api(request):
    """API endpoint to get subjects for AJAX requests."""
    curriculum = request.GET.get('curriculum', '')
    grade = request.GET.get('grade', '')
    
    subjects = Subject.objects.filter(is_active=True)
    
    if curriculum:
        subjects = subjects.filter(curriculum=curriculum)
    
    if grade:
        subjects = subjects.filter(grade_levels__contains=[grade])
    
    data = [{'id': s.id, 'name': s.name, 'code': s.code} for s in subjects]
    return JsonResponse({'subjects': data})


@login_required
def get_students_api(request):
    """API endpoint to get students for AJAX requests."""
    school = request.GET.get('school', '')
    grade = request.GET.get('grade', '')
    
    students = Student.objects.filter(is_active=True)
    
    if school:
        students = students.filter(school_id=school)
    
    if grade:
        students = students.filter(grade=grade)
    
    data = [{'id': s.id, 'name': s.user.get_full_name(), 'grade': s.grade} for s in students]
    return JsonResponse({'students': data})


@login_required
def export_data_api(request):
    """Export data in various formats."""
    data_type = request.GET.get('type', 'assessments')
    format_type = request.GET.get('format', 'csv')
    
    if data_type == 'assessments':
        queryset = Assessment.objects.all()
        filename = 'assessments'
    elif data_type == 'subjects':
        queryset = Subject.objects.all()
        filename = 'subjects'
    elif data_type == 'exams':
        queryset = Exam.objects.all()
        filename = 'exams'
    else:
        return JsonResponse({'error': 'Invalid data type'}, status=400)
    
    if format_type == 'csv':
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}.csv"'
        
        writer = csv.writer(response)
        # Add CSV headers and data based on the model
        # Implementation depends on specific model fields
        
        return response
    
    return JsonResponse({'error': 'Invalid format'}, status=400)


# ==================== DASHBOARD ANALYTICS ====================

@login_required
def dashboard_analytics_api(request):
    """API endpoint for dashboard analytics data."""
    # Get date range
    days = int(request.GET.get('days', 30))
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)
    
    # Calculate metrics
    total_assessments = Assessment.objects.count()
    completed_assessments = AssessmentResult.objects.filter(
        completed_at__gte=start_date
    ).count()
    
    avg_score = AssessmentResult.objects.filter(
        completed_at__gte=start_date
    ).aggregate(avg_score=Avg('total_score'))['avg_score'] or 0
    
    active_users = User.objects.filter(
        last_login__gte=start_date
    ).count()
    
    # Assessment type distribution
    assessment_types = Assessment.objects.values('assessment_type').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Recent activity
    recent_assessments = AssessmentResult.objects.filter(
        completed_at__gte=start_date
    ).select_related('student', 'assessment').order_by('-completed_at')[:10]
    
    data = {
        'total_assessments': total_assessments,
        'completed_assessments': completed_assessments,
        'average_score': round(avg_score, 2),
        'active_users': active_users,
        'assessment_types': list(assessment_types),
        'recent_assessments': [
            {
                'id': ra.id,
                'student_name': ra.student.user.get_full_name(),
                'assessment_title': ra.assessment.title,
                'score': ra.total_score,
                'completed_at': ra.completed_at.isoformat()
            }
            for ra in recent_assessments
        ]
    }
    
    return JsonResponse(data)
