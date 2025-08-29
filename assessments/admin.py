"""
Django Admin configuration for Assessment Workflow models
"""

from django.contrib import admin
from .workflow_models import (
    PricingPlan, AssessmentWorkflow, WorkflowStep, 
    FormSubmission, AssessmentReport, AssessmentForm
)
from .psychometric_models import (
    AgeGroup, PsychometricTestCategory, PsychometricTest, 
    TestQuestion, TestSession, TestResponse, TestRecommendation, TestResult
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


# Psychometric Test Administration

@admin.register(AgeGroup)
class AgeGroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'min_age', 'max_age', 'grade_range']
    list_filter = ['min_age', 'max_age']
    search_fields = ['name', 'grade_range']


@admin.register(PsychometricTestCategory)
class PsychometricTestCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category_type', 'is_active', 'color_code']
    list_filter = ['category_type', 'is_active']
    search_fields = ['name', 'category_type']


class TestQuestionInline(admin.TabularInline):
    model = TestQuestion
    extra = 0
    fields = ['question_number', 'question_text', 'question_type', 'points', 'is_required']
    readonly_fields = ['question_number']


@admin.register(PsychometricTest)
class PsychometricTestAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'age_group', 'test_type', 
        'difficulty_level', 'duration_minutes', 'is_validated', 'is_active'
    ]
    list_filter = [
        'category__category_type', 'age_group__name', 'test_type', 
        'difficulty_level', 'is_validated', 'is_active'
    ]
    search_fields = ['name', 'category__name', 'age_group__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'age_group', 'test_type', 'difficulty_level')
        }),
        ('Configuration', {
            'fields': ('duration_minutes', 'max_score', 'is_validated', 'is_active')
        }),
        ('Age Adaptations', {
            'fields': (
                'uses_pictures', 'requires_reading', 'requires_writing', 'verbal_administration'
            )
        }),
        ('Content', {
            'fields': ('description', 'instructions', 'scoring_method', 'interpretation_guide'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [TestQuestionInline]


@admin.register(TestQuestion)
class TestQuestionAdmin(admin.ModelAdmin):
    list_display = [
        'test', 'question_number', 'question_type', 'points', 'is_required'
    ]
    list_filter = ['question_type', 'is_required', 'test__category__category_type']
    search_fields = ['test__name', 'question_text']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('test', 'question_number', 'question_text', 'question_type')
        }),
        ('Options & Scoring', {
            'fields': ('options', 'correct_answer', 'points', 'scoring_criteria')
        }),
        ('Age Adaptations', {
            'fields': ('uses_simple_language', 'includes_image', 'audio_file')
        }),
        ('Configuration', {
            'fields': ('is_required', 'order')
        })
    )


@admin.register(TestSession)
class TestSessionAdmin(admin.ModelAdmin):
    list_display = [
        'student', 'test', 'status', 'administration_mode', 
        'percentage_score', 'scheduled_date', 'completed_at'
    ]
    list_filter = [
        'status', 'administration_mode', 'test__category__category_type',
        'scheduled_date', 'completed_at'
    ]
    search_fields = [
        'student__user__first_name', 'student__user__last_name', 'test__name'
    ]
    readonly_fields = ['started_at', 'completed_at', 'created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('student', 'test', 'status', 'administered_by')
        }),
        ('Scheduling', {
            'fields': ('scheduled_date', 'started_at', 'completed_at')
        }),
        ('Administration', {
            'fields': ('administration_mode', 'testing_environment', 'special_accommodations')
        }),
        ('Results', {
            'fields': ('raw_score', 'percentage_score', 'standardized_score')
        }),
        ('Data', {
            'fields': ('session_data', 'notes'),
            'classes': ('collapse',)
        })
    )


@admin.register(TestRecommendation)
class TestRecommendationAdmin(admin.ModelAdmin):
    list_display = [
        'student', 'recommended_test', 'trigger_type', 'priority_level',
        'parent_response', 'is_shown_to_parent', 'recommended_date'
    ]
    list_filter = [
        'trigger_type', 'priority_level', 'parent_response', 
        'is_shown_to_parent', 'recommended_date'
    ]
    search_fields = [
        'student__user__first_name', 'student__user__last_name', 
        'recommended_test__name'
    ]
    readonly_fields = ['recommended_date', 'created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('student', 'recommended_test', 'trigger_type', 'priority_level')
        }),
        ('Recommendation Details', {
            'fields': ('recommendation_reason', 'expires_at')
        }),
        ('Parent Response', {
            'fields': (
                'is_shown_to_parent', 'parent_response', 
                'parent_response_date', 'parent_notes'
            )
        }),
        ('System Data', {
            'fields': ('created_by_system', 'recommended_date', 'created_at'),
            'classes': ('collapse',)
        })
    )


@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = [
        'session', 'get_student_name', 'get_test_name', 
        'get_overall_development_level', 'created_at'
    ]
    list_filter = ['session__test__category__category_type', 'created_at']
    search_fields = [
        'session__student__user__first_name', 
        'session__student__user__last_name',
        'session__test__name'
    ]
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Session Information', {
            'fields': ('session',)
        }),
        ('Scores & Analysis', {
            'fields': ('category_scores', 'strengths', 'areas_for_improvement')
        }),
        ('Interpretations', {
            'fields': ('interpretation_summary', 'detailed_interpretation', 'recommendations')
        }),
        ('Parent Information', {
            'fields': ('parent_summary', 'suggested_activities')
        }),
        ('Professional Data', {
            'fields': (
                'professional_notes', 'follow_up_recommendations',
                'peer_comparison', 'developmental_milestones'
            ),
            'classes': ('collapse',)
        }),
        ('Alerts', {
            'fields': ('concern_flags', 'referral_recommendations'),
            'classes': ('collapse',)
        })
    )
    
    def get_student_name(self, obj):
        return obj.session.student.user.get_full_name()
    get_student_name.short_description = 'Student'
    
    def get_test_name(self, obj):
        return obj.session.test.name
    get_test_name.short_description = 'Test'


@admin.register(TestResponse)
class TestResponseAdmin(admin.ModelAdmin):
    list_display = [
        'session', 'question', 'points_earned', 'is_correct', 
        'time_taken_seconds', 'response_timestamp'
    ]
    list_filter = ['is_correct', 'question__question_type', 'response_timestamp']
    search_fields = [
        'session__student__user__first_name',
        'session__student__user__last_name',
        'question__question_text'
    ]
    readonly_fields = ['response_timestamp']