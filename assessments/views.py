from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib import messages
from django.db.models import Q, Count, Avg, Max, Min
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.utils import timezone
from datetime import datetime, timedelta
import json

from .models import Assessment, AssessmentResult
from students.models import Student, School
from data_analytics.models import StudentAnalytics, PerformanceTrend


class AssessmentListView(LoginRequiredMixin, ListView):
    """List all assessments with filtering."""
    model = Assessment
    template_name = 'assessments/assessment_list.html'
    context_object_name = 'assessments'
    paginate_by = 20

    def get_queryset(self):
        queryset = Assessment.objects.select_related('created_by', 'school').all()
        
        # Search functionality
        search_query = self.request.GET.get('search', '')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(subject__icontains=search_query) |
                Q(curriculum__icontains=search_query)
            )
        
        # Filter by assessment type
        assessment_type = self.request.GET.get('type', '')
        if assessment_type:
            queryset = queryset.filter(assessment_type=assessment_type)
        
        # Filter by grade
        grade_filter = self.request.GET.get('grade', '')
        if grade_filter:
            queryset = queryset.filter(grade=grade_filter)
        
        # Filter by curriculum
        curriculum_filter = self.request.GET.get('curriculum', '')
        if curriculum_filter:
            queryset = queryset.filter(curriculum=curriculum_filter)
        
        return queryset.order_by('-created_at')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['assessment_types'] = Assessment.ASSESSMENT_TYPES
        context['curriculums'] = Assessment.CURRICULUM_CHOICES
        context['grades'] = Assessment.objects.values_list('grade', flat=True).distinct()
        context['total_assessments'] = Assessment.objects.count()
        context['search_query'] = self.request.GET.get('search', '')
        return context


class AssessmentDetailView(LoginRequiredMixin, DetailView):
    """Detailed view of an assessment."""
    model = Assessment
    template_name = 'assessments/assessment_detail.html'
    context_object_name = 'assessment'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        assessment = self.get_object()
        
        # Get assessment results
        context['results'] = AssessmentResult.objects.filter(
            assessment=assessment
        ).select_related('student__user').order_by('-completed_at')
        
        # Calculate statistics
        if context['results']:
            context['total_participants'] = context['results'].count()
            context['avg_score'] = context['results'].aggregate(Avg('percentage'))['percentage__avg']
            context['highest_score'] = context['results'].aggregate(Max('percentage'))['percentage__max']
            context['lowest_score'] = context['results'].aggregate(Min('percentage'))['percentage__min']
        
        return context


class AssessmentCreateView(LoginRequiredMixin, CreateView):
    """Create a new assessment."""
    model = Assessment
    template_name = 'assessments/assessment_form.html'
    fields = ['title', 'description', 'assessment_type', 'curriculum', 'grade', 
              'subject', 'duration_minutes', 'total_questions', 'passing_percentage']
    success_url = reverse_lazy('assessment_list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        messages.success(self.request, 'Assessment created successfully!')
        return super().form_valid(form)


class AssessmentUpdateView(LoginRequiredMixin, UpdateView):
    """Update assessment information."""
    model = Assessment
    template_name = 'assessments/assessment_form.html'
    fields = ['title', 'description', 'assessment_type', 'curriculum', 'grade', 
              'subject', 'duration_minutes', 'total_questions', 'passing_percentage']
    success_url = reverse_lazy('assessment_list')

    def form_valid(self, form):
        messages.success(self.request, 'Assessment updated successfully!')
        return super().form_valid(form)


@login_required
def take_assessment(request, pk):
    """Take an assessment."""
    assessment = get_object_or_404(Assessment, pk=pk)
    
    # Check if student has already taken this assessment
    if hasattr(request.user, 'student_profile'):
        existing_result = AssessmentResult.objects.filter(
            student=request.user.student_profile,
            assessment=assessment
        ).first()
        
        if existing_result:
            messages.warning(request, 'You have already taken this assessment.')
            return redirect('assessment_result_detail', pk=existing_result.pk)
    
    if request.method == 'POST':
        # Process assessment submission
        answers = request.POST.get('answers', '{}')
        answers = json.loads(answers)
        
        # Calculate score (simplified - in real app, you'd have actual questions)
        total_questions = assessment.total_questions or 10
        correct_answers = len([a for a in answers.values() if a == 'correct'])
        percentage = (correct_answers / total_questions) * 100
        
        # Create assessment result
        if hasattr(request.user, 'student_profile'):
            result = AssessmentResult.objects.create(
                student=request.user.student_profile,
                assessment=assessment,
                score=correct_answers,
                total_questions=total_questions,
                percentage=percentage,
                answers=answers,
                completed_at=timezone.now()
            )
            
            # Update analytics
            update_student_analytics(request.user.student_profile, assessment, percentage)
            
            messages.success(request, f'Assessment completed! Your score: {percentage:.1f}%')
            return redirect('assessment_result_detail', pk=result.pk)
    
    # Generate sample questions based on assessment type
    questions = generate_sample_questions(assessment)
    
    context = {
        'assessment': assessment,
        'questions': questions,
    }
    
    return render(request, 'assessments/take_assessment.html', context)


@login_required
def assessment_result_detail(request, pk):
    """View assessment result details."""
    result = get_object_or_404(AssessmentResult, pk=pk)
    
    # Check if user has permission to view this result
    if not (request.user.is_staff or 
            (hasattr(request.user, 'student_profile') and result.student == request.user.student_profile)):
        messages.error(request, 'You do not have permission to view this result.')
        return redirect('assessment_list')
    
    context = {
        'result': result,
        'assessment': result.assessment,
        'student': result.student,
    }
    
    return render(request, 'assessments/assessment_result_detail.html', context)


@login_required
def assessment_results_list(request):
    """List all assessment results."""
    if request.user.is_staff:
        results = AssessmentResult.objects.select_related('student__user', 'assessment').all()
    elif hasattr(request.user, 'student_profile'):
        results = AssessmentResult.objects.filter(student=request.user.student_profile).select_related('assessment')
    else:
        results = AssessmentResult.objects.none()
    
    # Filter by assessment
    assessment_filter = request.GET.get('assessment', '')
    if assessment_filter:
        results = results.filter(assessment_id=assessment_filter)
    
    # Filter by date range
    date_from = request.GET.get('date_from', '')
    date_to = request.GET.get('date_to', '')
    
    if date_from:
        results = results.filter(completed_at__date__gte=date_from)
    if date_to:
        results = results.filter(completed_at__date__lte=date_to)
    
    # Pagination
    paginator = Paginator(results.order_by('-completed_at'), 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'assessments': Assessment.objects.all(),
        'date_from': date_from,
        'date_to': date_to,
        'assessment_filter': assessment_filter,
    }
    
    return render(request, 'assessments/assessment_results_list.html', context)


@login_required
def assessment_analytics(request):
    """Analytics dashboard for assessments."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Overall statistics
    total_assessments = Assessment.objects.count()
    total_results = AssessmentResult.objects.count()
    avg_score = AssessmentResult.objects.aggregate(Avg('percentage'))['percentage__avg'] or 0
    
    # Assessment type breakdown
    assessment_type_stats = Assessment.objects.values('assessment_type').annotate(
        count=Count('id')
    )
    
    # Recent results
    recent_results = AssessmentResult.objects.select_related(
        'student__user', 'assessment'
    ).order_by('-completed_at')[:10]
    
    # Performance trends
    performance_trends = AssessmentResult.objects.values('completed_at__date').annotate(
        avg_percentage=Avg('percentage'),
        count=Count('id')
    ).order_by('-completed_at__date')[:30]
    
    context = {
        'total_assessments': total_assessments,
        'total_results': total_results,
        'avg_score': avg_score,
        'assessment_type_stats': assessment_type_stats,
        'recent_results': recent_results,
        'performance_trends': list(performance_trends),
    }
    
    return render(request, 'assessments/assessment_analytics.html', context)


def generate_sample_questions(assessment):
    """Generate sample questions based on assessment type."""
    questions = []
    
    if assessment.assessment_type == 'academic':
        if assessment.subject == 'Mathematics':
            questions = [
                {'id': 1, 'question': 'What is 15 + 27?', 'options': ['40', '42', '43', '41'], 'correct': '42'},
                {'id': 2, 'question': 'What is 8 × 7?', 'options': ['54', '56', '58', '60'], 'correct': '56'},
                {'id': 3, 'question': 'What is 100 ÷ 4?', 'options': ['20', '25', '30', '35'], 'correct': '25'},
            ]
        elif assessment.subject == 'Science':
            questions = [
                {'id': 1, 'question': 'What is the chemical symbol for water?', 'options': ['H2O', 'CO2', 'O2', 'N2'], 'correct': 'H2O'},
                {'id': 2, 'question': 'Which planet is closest to the Sun?', 'options': ['Venus', 'Mercury', 'Earth', 'Mars'], 'correct': 'Mercury'},
                {'id': 3, 'question': 'What is the largest organ in the human body?', 'options': ['Heart', 'Brain', 'Skin', 'Liver'], 'correct': 'Skin'},
            ]
        else:
            questions = [
                {'id': 1, 'question': 'Sample question 1?', 'options': ['A', 'B', 'C', 'D'], 'correct': 'A'},
                {'id': 2, 'question': 'Sample question 2?', 'options': ['A', 'B', 'C', 'D'], 'correct': 'B'},
                {'id': 3, 'question': 'Sample question 3?', 'options': ['A', 'B', 'C', 'D'], 'correct': 'C'},
            ]
    
    elif assessment.assessment_type == 'psychological':
        questions = [
            {'id': 1, 'question': 'I prefer working in groups rather than alone.', 'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], 'correct': 'Neutral'},
            {'id': 2, 'question': 'I enjoy solving complex problems.', 'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], 'correct': 'Neutral'},
            {'id': 3, 'question': 'I feel anxious when speaking in front of large groups.', 'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], 'correct': 'Neutral'},
        ]
    
    elif assessment.assessment_type == 'physical':
        questions = [
            {'id': 1, 'question': 'How often do you exercise?', 'options': ['Never', 'Rarely', 'Sometimes', 'Often', 'Daily'], 'correct': 'Neutral'},
            {'id': 2, 'question': 'What is your preferred physical activity?', 'options': ['Running', 'Swimming', 'Cycling', 'Team Sports', 'Gym'], 'correct': 'Neutral'},
            {'id': 3, 'question': 'How would you rate your overall fitness?', 'options': ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'], 'correct': 'Neutral'},
        ]
    
    else:  # DMIT or other types
        questions = [
            {'id': 1, 'question': 'I learn best through visual materials.', 'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], 'correct': 'Neutral'},
            {'id': 2, 'question': 'I prefer hands-on learning activities.', 'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], 'correct': 'Neutral'},
            {'id': 3, 'question': 'I enjoy reading and writing tasks.', 'options': ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'], 'correct': 'Neutral'},
        ]
    
    return questions


def update_student_analytics(student, assessment, percentage):
    """Update student analytics after assessment completion."""
    # Update or create student analytics
    analytics, created = StudentAnalytics.objects.get_or_create(
        student=student,
        defaults={
            'academic_score': 0,
            'psychological_score': 0,
            'physical_score': 0,
            'career_readiness': 0,
        }
    )
    
    # Update scores based on assessment type
    if assessment.assessment_type == 'academic':
        analytics.academic_score = percentage
    elif assessment.assessment_type == 'psychological':
        analytics.psychological_score = percentage
    elif assessment.assessment_type == 'physical':
        analytics.physical_score = percentage
    
    analytics.save()
    
    # Create performance trend
    PerformanceTrend.objects.create(
        student=student,
        assessment_type=assessment.assessment_type,
        score=percentage,
        date=timezone.now().date()
    )


# API Views
@login_required
def assessment_api(request):
    """API endpoint for assessment data."""
    assessments = Assessment.objects.all()
    
    data = []
    for assessment in assessments:
        data.append({
            'id': assessment.id,
            'title': assessment.title,
            'type': assessment.assessment_type,
            'curriculum': assessment.curriculum,
            'grade': assessment.grade,
            'subject': assessment.subject,
            'duration': assessment.duration_minutes,
        })
    
    return JsonResponse({'assessments': data})


@login_required
def assessment_stats_api(request):
    """API endpoint for assessment statistics."""
    total_assessments = Assessment.objects.count()
    total_results = AssessmentResult.objects.count()
    avg_score = AssessmentResult.objects.aggregate(Avg('percentage'))['percentage__avg'] or 0
    
    by_type = Assessment.objects.values('assessment_type').annotate(count=Count('id'))
    by_curriculum = Assessment.objects.values('curriculum').annotate(count=Count('id'))
    
    return JsonResponse({
        'total_assessments': total_assessments,
        'total_results': total_results,
        'avg_score': avg_score,
        'by_type': list(by_type),
        'by_curriculum': list(by_curriculum),
    })
