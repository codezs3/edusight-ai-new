"""
Assessment Workflow Views
Handles Basic, Premium, and Enterprise assessment workflows
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.core.paginator import Paginator
from django.db import transaction
from django.utils import timezone
from django.conf import settings
import json
import logging

from .workflow_models import (
    PricingPlan, AssessmentWorkflow, WorkflowStep, 
    FormSubmission, AssessmentReport, AssessmentForm
)
from .workflow_forms import (
    WorkflowSelectionForm, AssessmentFormFactory, 
    StepNavigationForm, AcademicAssessmentForm,
    PhysicalEducationForm, PsychologicalAssessmentForm, CareerMappingForm
)
from students.models import Student

logger = logging.getLogger(__name__)


@login_required
def workflow_dashboard(request):
    """Main dashboard for assessment workflows"""
    
    # Get user's active workflows
    workflows = AssessmentWorkflow.objects.filter(
        created_by=request.user
    ).order_by('-created_at')[:10]
    
    # Get available pricing plans
    pricing_plans = PricingPlan.objects.filter(is_active=True)
    
    # Get user's students
    students = Student.objects.filter(parent=request.user)
    
    # Calculate usage statistics
    total_assessments = workflows.count()
    completed_assessments = workflows.filter(status='completed').count()
    in_progress = workflows.filter(status='in_progress').count()
    
    context = {
        'workflows': workflows,
        'pricing_plans': pricing_plans,
        'students': students,
        'stats': {
            'total_assessments': total_assessments,
            'completed_assessments': completed_assessments,
            'in_progress': in_progress,
            'completion_rate': (completed_assessments / total_assessments * 100) if total_assessments > 0 else 0
        }
    }
    
    return render(request, 'assessments/workflow_dashboard.html', context)


@login_required
def select_workflow(request):
    """Select workflow type and pricing plan"""
    
    if request.method == 'POST':
        form = WorkflowSelectionForm(request.POST, user=request.user)
        
        if form.is_valid():
            student = form.cleaned_data['student']
            pricing_plan = form.cleaned_data['pricing_plan']
            assessment_types = form.cleaned_data['assessment_types']
            
            # Create new workflow
            workflow = _create_workflow(
                student=student,
                pricing_plan=pricing_plan,
                assessment_types=assessment_types,
                created_by=request.user
            )
            
            messages.success(request, f'Assessment workflow created successfully for {student.user.get_full_name()}')
            return redirect('assessments:workflow_detail', workflow_id=workflow.id)
    
    else:
        form = WorkflowSelectionForm(user=request.user)
    
    # Get pricing plan details for display
    pricing_plans = PricingPlan.objects.filter(is_active=True)
    
    context = {
        'form': form,
        'pricing_plans': pricing_plans
    }
    
    return render(request, 'assessments/select_workflow.html', context)


@login_required
def workflow_detail(request, workflow_id):
    """Display detailed workflow with steps"""
    
    workflow = get_object_or_404(
        AssessmentWorkflow, 
        id=workflow_id, 
        created_by=request.user
    )
    
    # Get workflow steps
    steps = WorkflowStep.objects.filter(workflow=workflow).order_by('step_number')
    
    # Calculate progress
    progress_percentage = workflow.get_progress_percentage()
    
    context = {
        'workflow': workflow,
        'steps': steps,
        'progress_percentage': progress_percentage,
        'can_start': workflow.status == 'draft',
        'can_continue': workflow.status == 'in_progress',
        'is_completed': workflow.status == 'completed'
    }
    
    return render(request, 'assessments/workflow_detail.html', context)


@login_required
def start_workflow(request, workflow_id):
    """Start an assessment workflow"""
    
    workflow = get_object_or_404(
        AssessmentWorkflow, 
        id=workflow_id, 
        created_by=request.user
    )
    
    if workflow.status != 'draft':
        messages.error(request, 'This workflow has already been started')
        return redirect('assessments:workflow_detail', workflow_id=workflow.id)
    
    # Start the workflow
    workflow.start_workflow()
    
    messages.success(request, 'Assessment workflow started successfully')
    return redirect('assessments:workflow_step', workflow_id=workflow.id, step_number=1)


@login_required
def workflow_step(request, workflow_id, step_number):
    """Handle individual workflow steps"""
    
    workflow = get_object_or_404(
        AssessmentWorkflow, 
        id=workflow_id, 
        created_by=request.user
    )
    
    step = get_object_or_404(
        WorkflowStep, 
        workflow=workflow, 
        step_number=step_number
    )
    
    # Check if step is accessible
    if step_number > workflow.current_step:
        messages.error(request, 'You must complete previous steps first')
        return redirect('assessments:workflow_detail', workflow_id=workflow.id)
    
    # Handle form submission
    if request.method == 'POST':
        return _handle_step_submission(request, workflow, step)
    
    # Display step form
    return _display_step_form(request, workflow, step)


def _handle_step_submission(request, workflow, step):
    """Handle step form submission"""
    
    # Determine form type based on step
    form = _get_step_form(step, workflow, request.POST)
    
    if form and form.is_valid():
        # Save form data
        form_data = form.cleaned_data
        
        # Create form submission record
        submission = FormSubmission.objects.create(
            workflow=workflow,
            form=_get_assessment_form_for_step(step),
            step=step,
            submission_data=form_data
        )
        
        # Validate and score submission
        if submission.validate_and_score():
            submission.submit()
            
            # Complete the step
            step.complete_step(form_data)
            
            # Move to next step or complete workflow
            if workflow.current_step <= workflow.total_steps:
                messages.success(request, f'Step {step.step_number} completed successfully')
                return redirect('assessments:workflow_step', 
                              workflow_id=workflow.id, 
                              step_number=workflow.current_step)
            else:
                # Workflow completed
                _complete_workflow(workflow)
                messages.success(request, 'Assessment completed successfully!')
                return redirect('assessments:workflow_results', workflow_id=workflow.id)
        else:
            messages.error(request, 'Please correct the errors in your submission')
    
    # Redisplay form with errors
    return _display_step_form(request, workflow, step, form)


def _display_step_form(request, workflow, step, form=None):
    """Display step form"""
    
    if not form:
        form = _get_step_form(step, workflow)
    
    # Get step configuration
    step_config = {
        'workflow': workflow,
        'step': step,
        'form': form,
        'progress_percentage': workflow.get_progress_percentage(),
        'is_last_step': step.step_number == workflow.total_steps,
        'can_go_back': step.step_number > 1,
        'step_type': step.step_type
    }
    
    # Determine template based on step type
    template_mapping = {
        'data_upload': 'assessments/steps/data_upload.html',
        'academic_assessment': 'assessments/steps/academic_assessment.html',
        'physical_assessment': 'assessments/steps/physical_assessment.html',
        'psychological_assessment': 'assessments/steps/psychological_assessment.html',
        'ml_analysis': 'assessments/steps/ml_analysis.html',
        'review_results': 'assessments/steps/review_results.html',
        'generate_report': 'assessments/steps/generate_report.html',
    }
    
    template = template_mapping.get(step.step_type, 'assessments/steps/generic_step.html')
    
    return render(request, template, step_config)


def _get_step_form(step, workflow, data=None):
    """Get appropriate form for workflow step"""
    
    pricing_plan = workflow.pricing_plan
    
    if step.step_type == 'academic_assessment':
        return AcademicAssessmentForm(
            data=data,
            pricing_plan=pricing_plan,
            workflow=workflow
        )
    elif step.step_type == 'physical_assessment':
        if pricing_plan.physical_assessments:
            return PhysicalEducationForm(
                data=data,
                pricing_plan=pricing_plan,
                workflow=workflow
            )
    elif step.step_type == 'psychological_assessment':
        if pricing_plan.psychological_assessments:
            return PsychologicalAssessmentForm(
                data=data,
                pricing_plan=pricing_plan,
                workflow=workflow
            )
    elif step.step_type == 'career_mapping':
        if pricing_plan.career_mapping:
            return CareerMappingForm(
                data=data,
                pricing_plan=pricing_plan,
                workflow=workflow
            )
    
    # Default navigation form
    return StepNavigationForm(data=data)


@login_required
def workflow_results(request, workflow_id):
    """Display workflow results"""
    
    workflow = get_object_or_404(
        AssessmentWorkflow, 
        id=workflow_id, 
        created_by=request.user
    )
    
    if workflow.status != 'completed':
        messages.error(request, 'This assessment is not yet completed')
        return redirect('assessments:workflow_detail', workflow_id=workflow.id)
    
    # Get all form submissions
    submissions = FormSubmission.objects.filter(
        workflow=workflow,
        is_submitted=True
    )
    
    # Compile results
    results = _compile_workflow_results(workflow, submissions)
    
    # Check if report exists
    report = AssessmentReport.objects.filter(workflow=workflow).first()
    
    context = {
        'workflow': workflow,
        'results': results,
        'submissions': submissions,
        'report': report,
        'can_generate_report': not report or report.status == 'failed'
    }
    
    return render(request, 'assessments/workflow_results.html', context)


@login_required
@csrf_exempt
def generate_report(request, workflow_id):
    """Generate assessment report"""
    
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    workflow = get_object_or_404(
        AssessmentWorkflow, 
        id=workflow_id, 
        created_by=request.user
    )
    
    if workflow.status != 'completed':
        return JsonResponse({'error': 'Workflow not completed'}, status=400)
    
    try:
        # Check if report already exists
        report = AssessmentReport.objects.filter(workflow=workflow).first()
        
        if report and report.status == 'completed':
            return JsonResponse({
                'status': 'success',
                'message': 'Report already exists',
                'report_id': report.id
            })
        
        # Create new report
        if not report:
            report = AssessmentReport.objects.create(
                workflow=workflow,
                report_type=_determine_report_type(workflow.pricing_plan),
                title=f'Assessment Report - {workflow.student.user.get_full_name()}'
            )
        
        # Generate report asynchronously if possible
        if report.generate_report():
            return JsonResponse({
                'status': 'success',
                'message': 'Report generated successfully',
                'report_id': report.id
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Failed to generate report'
            }, status=500)
            
    except Exception as e:
        logger.error(f"Error generating report for workflow {workflow_id}: {str(e)}")
        return JsonResponse({
            'status': 'error',
            'message': 'An error occurred while generating the report'
        }, status=500)


@login_required
def download_report(request, workflow_id, report_id):
    """Download generated report"""
    
    workflow = get_object_or_404(
        AssessmentWorkflow, 
        id=workflow_id, 
        created_by=request.user
    )
    
    report = get_object_or_404(
        AssessmentReport,
        id=report_id,
        workflow=workflow
    )
    
    if report.status != 'completed' or not report.pdf_file:
        messages.error(request, 'Report is not available for download')
        return redirect('assessments:workflow_results', workflow_id=workflow.id)
    
    # Serve the file
    from django.http import FileResponse
    response = FileResponse(
        report.pdf_file,
        as_attachment=True,
        filename=f'assessment_report_{workflow.student.user.get_full_name()}_{timezone.now().strftime("%Y%m%d")}.pdf'
    )
    
    return response


@login_required
def workflow_list(request):
    """List all user's workflows with filtering and pagination"""
    
    workflows = AssessmentWorkflow.objects.filter(
        created_by=request.user
    ).order_by('-created_at')
    
    # Filtering
    status_filter = request.GET.get('status')
    plan_filter = request.GET.get('plan')
    student_filter = request.GET.get('student')
    
    if status_filter:
        workflows = workflows.filter(status=status_filter)
    
    if plan_filter:
        workflows = workflows.filter(pricing_plan__plan_type=plan_filter)
    
    if student_filter:
        workflows = workflows.filter(student__id=student_filter)
    
    # Pagination
    paginator = Paginator(workflows, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Filter options for template
    students = Student.objects.filter(parent=request.user)
    pricing_plans = PricingPlan.objects.filter(is_active=True)
    
    context = {
        'page_obj': page_obj,
        'students': students,
        'pricing_plans': pricing_plans,
        'current_filters': {
            'status': status_filter,
            'plan': plan_filter,
            'student': student_filter
        }
    }
    
    return render(request, 'assessments/workflow_list.html', context)


@login_required
@csrf_exempt
def api_workflow_progress(request, workflow_id):
    """API endpoint for workflow progress"""
    
    workflow = get_object_or_404(
        AssessmentWorkflow, 
        id=workflow_id, 
        created_by=request.user
    )
    
    steps = WorkflowStep.objects.filter(workflow=workflow).order_by('step_number')
    
    progress_data = {
        'workflow_id': workflow.id,
        'current_step': workflow.current_step,
        'total_steps': workflow.total_steps,
        'progress_percentage': workflow.get_progress_percentage(),
        'status': workflow.status,
        'steps': [
            {
                'step_number': step.step_number,
                'title': step.title,
                'status': step.status,
                'is_current': step.step_number == workflow.current_step,
                'is_completed': step.status == 'completed'
            }
            for step in steps
        ]
    }
    
    return JsonResponse(progress_data)


# Helper functions

def _create_workflow(student, pricing_plan, assessment_types, created_by):
    """Create a new assessment workflow with steps"""
    
    with transaction.atomic():
        # Determine workflow type
        workflow_type = _determine_workflow_type(pricing_plan, assessment_types)
        
        # Create workflow
        workflow = AssessmentWorkflow.objects.create(
            name=f'{pricing_plan.name} Assessment - {student.user.get_full_name()}',
            workflow_type=workflow_type,
            pricing_plan=pricing_plan,
            student=student,
            created_by=created_by,
            workflow_config={
                'assessment_types': assessment_types,
                'plan_features': {
                    'ml_predictions': pricing_plan.ml_predictions,
                    'advanced_analytics': pricing_plan.advanced_analytics,
                    'custom_reports': pricing_plan.custom_reports
                }
            }
        )
        
        # Create workflow steps
        _create_workflow_steps(workflow, assessment_types, pricing_plan)
        
        return workflow


def _determine_workflow_type(pricing_plan, assessment_types):
    """Determine workflow type based on plan and assessments"""
    
    if pricing_plan.plan_type == 'basic':
        return 'basic_academic'
    elif pricing_plan.plan_type == 'premium':
        return 'premium_comprehensive'
    else:
        return 'enterprise_advanced'


def _create_workflow_steps(workflow, assessment_types, pricing_plan):
    """Create workflow steps based on assessment types and plan"""
    
    step_configs = [
        {
            'step_number': 1,
            'step_type': 'data_upload',
            'title': 'Data Upload & Basic Information',
            'description': 'Upload student data and basic information',
            'is_required': True,
            'estimated_duration': 10
        }
    ]
    
    # Add assessment steps based on types
    step_counter = 2
    
    if 'academic' in assessment_types:
        step_configs.append({
            'step_number': step_counter,
            'step_type': 'academic_assessment',
            'title': 'Academic Assessment',
            'description': 'Comprehensive academic performance evaluation',
            'is_required': True,
            'estimated_duration': 20 if pricing_plan.plan_type == 'basic' else 30
        })
        step_counter += 1
    
    if 'physical' in assessment_types and pricing_plan.physical_assessments:
        step_configs.append({
            'step_number': step_counter,
            'step_type': 'physical_assessment',
            'title': 'Physical Education Assessment',
            'description': 'Physical fitness and motor skills evaluation',
            'is_required': True,
            'estimated_duration': 25
        })
        step_counter += 1
    
    if 'psychological' in assessment_types and pricing_plan.psychological_assessments:
        step_configs.append({
            'step_number': step_counter,
            'step_type': 'psychological_assessment',
            'title': 'Psychological Assessment',
            'description': 'Social-emotional learning and behavioral evaluation',
            'is_required': True,
            'estimated_duration': 35
        })
        step_counter += 1
    
    # Add ML analysis step for premium and enterprise
    if pricing_plan.ml_predictions:
        step_configs.append({
            'step_number': step_counter,
            'step_type': 'ml_analysis',
            'title': 'AI Analysis & Predictions',
            'description': 'Machine learning analysis and predictions',
            'is_required': False,
            'estimated_duration': 5
        })
        step_counter += 1
    
    # Final steps
    step_configs.extend([
        {
            'step_number': step_counter,
            'step_type': 'review_results',
            'title': 'Review Results',
            'description': 'Review and verify assessment results',
            'is_required': True,
            'estimated_duration': 15
        },
        {
            'step_number': step_counter + 1,
            'step_type': 'generate_report',
            'title': 'Generate Report',
            'description': 'Generate comprehensive assessment report',
            'is_required': True,
            'estimated_duration': 5
        }
    ])
    
    # Update total steps
    workflow.total_steps = len(step_configs)
    workflow.save()
    
    # Create step objects
    for config in step_configs:
        WorkflowStep.objects.create(
            workflow=workflow,
            **config
        )


def _complete_workflow(workflow):
    """Complete the workflow and trigger final processing"""
    
    workflow.status = 'completed'
    workflow.completed_at = timezone.now()
    
    # Compile final results
    submissions = FormSubmission.objects.filter(
        workflow=workflow,
        is_submitted=True
    )
    
    final_results = _compile_workflow_results(workflow, submissions)
    
    # Add ML insights if available
    if workflow.pricing_plan.ml_predictions:
        ml_insights = _generate_ml_insights(workflow, final_results)
        final_results['ml_insights'] = ml_insights
    
    workflow.results = final_results
    workflow.save()


def _compile_workflow_results(workflow, submissions):
    """Compile comprehensive workflow results"""
    
    results = {
        'overall_score': 0,
        'assessment_scores': {},
        'detailed_analysis': {},
        'recommendations': [],
        'completed_at': timezone.now().isoformat()
    }
    
    total_score = 0
    assessment_count = 0
    
    for submission in submissions:
        form_type = submission.form.form_type
        scores = submission.calculated_scores
        
        if 'academic' in form_type:
            results['assessment_scores']['academic'] = scores
        elif 'physical' in form_type:
            results['assessment_scores']['physical'] = scores
        elif 'psychological' in form_type:
            results['assessment_scores']['psychological'] = scores
        elif 'career' in form_type:
            results['assessment_scores']['career'] = scores
        
        # Add to overall score
        if scores.get('overall_score'):
            total_score += scores['overall_score']
            assessment_count += 1
    
    # Calculate overall score
    if assessment_count > 0:
        results['overall_score'] = total_score / assessment_count
    
    return results


def _generate_ml_insights(workflow, results):
    """Generate ML insights for completed workflow"""
    
    # This would integrate with actual ML models
    # For now, return mock insights
    
    insights = {
        'predictions': {
            'academic_trajectory': 'Positive upward trend expected',
            'risk_factors': ['Time management', 'Math anxiety'],
            'strengths': ['Creative thinking', 'Verbal communication'],
            'growth_areas': ['Quantitative reasoning', 'Focus retention']
        },
        'recommendations': [
            'Consider additional math support',
            'Encourage creative writing activities',
            'Implement time management strategies',
            'Explore STEM enrichment programs'
        ],
        'confidence_score': 0.85
    }
    
    return insights


def _determine_report_type(pricing_plan):
    """Determine report type based on pricing plan"""
    
    if pricing_plan.plan_type == 'basic':
        return 'basic'
    elif pricing_plan.plan_type == 'premium':
        return 'comprehensive'
    else:
        return 'detailed'


def _get_assessment_form_for_step(step):
    """Get AssessmentForm model instance for step"""
    
    # This would retrieve the appropriate AssessmentForm model
    # For now, return a mock form
    form, created = AssessmentForm.objects.get_or_create(
        form_type=f"{step.step_type}_{step.workflow.pricing_plan.plan_type}",
        pricing_plan=step.workflow.pricing_plan,
        defaults={
            'name': step.title,
            'description': step.description,
            'estimated_time': step.estimated_duration
        }
    )
    
    return form
