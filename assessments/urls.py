"""
Assessment Framework URLs
"""

from django.urls import path
from . import assessment_views
from . import workflow_views

app_name = 'assessments'

urlpatterns = [
    # Assessment Dashboard
    path('', assessment_views.assessment_dashboard, name='dashboard'),
    
    # Framework Management
    path('academic-frameworks/', assessment_views.academic_framework_management, name='academic_frameworks'),
    path('pe-frameworks/', assessment_views.physical_framework_management, name='pe_frameworks'),
    path('psychological-frameworks/', assessment_views.psychological_framework_management, name='psychological_frameworks'),
    path('career-frameworks/', assessment_views.career_framework_management, name='career_frameworks'),
    
    # Comprehensive Assessment
    path('create/', assessment_views.comprehensive_assessment_view, name='create_assessment'),
    path('create/<int:student_id>/', assessment_views.comprehensive_assessment_view, name='create_student_assessment'),
    path('view/<int:assessment_id>/', assessment_views.view_assessment, name='view_assessment'),
    
    # Assessment Workflow URLs
    path('workflows/', workflow_views.workflow_dashboard, name='workflow_dashboard'),
    path('workflows/select/', workflow_views.select_workflow, name='select_workflow'),
    path('workflows/list/', workflow_views.workflow_list, name='workflow_list'),
    path('workflow/<int:workflow_id>/', workflow_views.workflow_detail, name='workflow_detail'),
    path('workflow/<int:workflow_id>/start/', workflow_views.start_workflow, name='start_workflow'),
    path('workflow/<int:workflow_id>/step/<int:step_number>/', workflow_views.workflow_step, name='workflow_step'),
    path('workflow/<int:workflow_id>/results/', workflow_views.workflow_results, name='workflow_results'),
    path('workflow/<int:workflow_id>/generate-report/', workflow_views.generate_report, name='generate_report'),
    path('workflow/<int:workflow_id>/report/<int:report_id>/download/', workflow_views.download_report, name='download_report'),
    
    # Workflow API Endpoints
    path('api/workflow/<int:workflow_id>/progress/', workflow_views.api_workflow_progress, name='api_workflow_progress'),
    
    # ML and API endpoints
    path('api/ml-prediction/', assessment_views.ml_prediction_api, name='ml_prediction_api'),
]