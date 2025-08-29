"""
Django Admin configuration for Assessment Workflow models
"""

from django.contrib import admin
from .workflow_models import (
    PricingPlan, AssessmentWorkflow, WorkflowStep, 
    FormSubmission, AssessmentReport, AssessmentForm
)


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'plan_type', 'price', 'currency', 'duration_months',
        'max_students', 'max_assessments_per_month', 'is_active'
    ]
    list_filter = ['plan_type', 'is_active', 'duration_months']
    search_fields = ['name', 'plan_type']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'plan_type', 'price', 'currency', 'duration_months', 'is_active')
        }),
        ('Features', {
            'fields': (
                'academic_assessments', 'physical_assessments', 
                'psychological_assessments', 'career_mapping',
                'ml_predictions', 'advanced_analytics', 
                'custom_reports', 'priority_support'
            )
        }),
        ('Limits', {
            'fields': ('max_students', 'max_assessments_per_month', 'max_reports_per_month')
        }),
        ('Additional Features', {
            'fields': ('features_list', 'limitations'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


class WorkflowStepInline(admin.TabularInline):
    model = WorkflowStep
    extra = 0
    readonly_fields = ['completed_at', 'created_at']
    fields = [
        'step_number', 'step_type', 'title', 'status', 
        'is_required', 'estimated_duration', 'completed_at'
    ]


@admin.register(AssessmentWorkflow)
class AssessmentWorkflowAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'student', 'workflow_type', 'pricing_plan', 
        'status', 'current_step', 'total_steps', 'created_at'
    ]
    list_filter = ['workflow_type', 'status', 'pricing_plan__plan_type', 'created_at']
    search_fields = ['name', 'student__user__first_name', 'student__user__last_name']
    readonly_fields = ['started_at', 'completed_at', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'workflow_type', 'student', 'created_by', 'pricing_plan')
        }),
        ('Progress', {
            'fields': ('status', 'current_step', 'total_steps')
        }),
        ('Configuration', {
            'fields': ('workflow_config', 'assessment_data', 'results'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('started_at', 'completed_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [WorkflowStepInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'student__user', 'pricing_plan', 'created_by'
        )


@admin.register(WorkflowStep)
class WorkflowStepAdmin(admin.ModelAdmin):
    list_display = [
        'workflow', 'step_number', 'title', 'step_type', 
        'status', 'is_required', 'estimated_duration'
    ]
    list_filter = ['step_type', 'status', 'is_required']
    search_fields = ['title', 'workflow__name']
    readonly_fields = ['completed_at', 'created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('workflow', 'step_number', 'step_type', 'title', 'description')
        }),
        ('Configuration', {
            'fields': ('status', 'is_required', 'estimated_duration')
        }),
        ('Data', {
            'fields': ('form_config', 'validation_rules', 'step_data'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('completed_at', 'created_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(AssessmentForm)
class AssessmentFormAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'form_type', 'pricing_plan', 'version', 
        'estimated_time', 'is_active'
    ]
    list_filter = ['form_type', 'pricing_plan__plan_type', 'is_active']
    search_fields = ['name', 'form_type']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'form_type', 'pricing_plan', 'description', 'version', 'is_active')
        }),
        ('Configuration', {
            'fields': ('estimated_time', 'form_schema', 'validation_rules', 'scoring_configuration'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        'workflow', 'form', 'is_valid', 'is_submitted', 'submitted_at'
    ]
    list_filter = ['is_valid', 'is_submitted', 'submitted_at']
    search_fields = ['workflow__name', 'form__name']
    readonly_fields = ['submitted_at', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('workflow', 'form', 'step')
        }),
        ('Status', {
            'fields': ('is_valid', 'is_submitted', 'submitted_at')
        }),
        ('Data', {
            'fields': ('submission_data', 'calculated_scores', 'validation_errors'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(AssessmentReport)
class AssessmentReportAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'workflow', 'report_type', 'status', 
        'file_size', 'generated_at'
    ]
    list_filter = ['report_type', 'status', 'generated_at']
    search_fields = ['title', 'workflow__name']
    readonly_fields = ['file_size', 'generated_at', 'created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'workflow', 'report_type', 'status')
        }),
        ('Content', {
            'fields': ('summary', 'recommendations'),
            'classes': ('collapse',)
        }),
        ('File Information', {
            'fields': ('pdf_file', 'file_size', 'expires_at')
        }),
        ('Data', {
            'fields': ('report_data',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('generated_at', 'created_at'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('workflow__student__user')


# Custom admin actions
@admin.action(description='Regenerate selected reports')
def regenerate_reports(modeladmin, request, queryset):
    """Regenerate selected assessment reports"""
    count = 0
    for report in queryset:
        if report.generate_report():
            count += 1
    
    modeladmin.message_user(
        request,
        f'Successfully regenerated {count} report(s).'
    )


@admin.action(description='Reset workflow to draft status')
def reset_workflows(modeladmin, request, queryset):
    """Reset selected workflows to draft status"""
    count = queryset.update(
        status='draft',
        current_step=1,
        started_at=None,
        completed_at=None
    )
    
    modeladmin.message_user(
        request,
        f'Successfully reset {count} workflow(s) to draft status.'
    )


# Add actions to admin classes
AssessmentReportAdmin.actions = [regenerate_reports]
AssessmentWorkflowAdmin.actions = [reset_workflows]