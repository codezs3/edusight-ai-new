from django.urls import path
from . import views

app_name = 'parent_dashboard'

urlpatterns = [
    # Parent login
    path('login/', views.parent_login_view, name='parent_login'),
    
    # Main dashboard
    path('', views.parent_dashboard, name='dashboard'),
    path('comprehensive/', views.comprehensive_dashboard_view, name='comprehensive_dashboard'),
    
    # 5-Step Workflow
    path('workflow/', views.assessment_workflow, name='workflow'),
    path('workflow/step/<int:step>/', views.workflow_step, name='workflow_step'),
    
    # Framework-specific views
    path('academic-assessment/', views.academic_assessment_view, name='academic_assessment'),
    path('physical-assessment/', views.physical_assessment_view, name='physical_assessment'),
    path('psychological-assessment/', views.psychological_assessment_view, name='psychological_assessment'),
    path('career-mapping/', views.career_mapping_view, name='career_mapping'),
    
    # ML and Analytics
    path('ml-insights/', views.ml_insights_view, name='ml_insights'),
    path('risk-assessment/', views.risk_assessment_view, name='risk_assessment'),
    path('recommendations/', views.recommendations_view, name='recommendations'),
    
    # Upload and data entry
    path('upload/', views.upload_student_data, name='upload'),
    path('manual-entry/<int:session_id>/', views.manual_entry, name='manual_entry'),
    
    # Assessment and results
    path('results/<int:session_id>/', views.assessment_results, name='assessment_results'),
    
    # API endpoints for workflow
    path('api/upload-file/', views.api_upload_file, name='api_upload_file'),
    path('api/process-data/', views.api_process_data, name='api_process_data'),
    path('api/generate-report/<int:session_id>/', views.api_generate_report, name='api_generate_report'),
    path('api/ml-prediction/', views.api_ml_prediction, name='api_ml_prediction'),
    path('api/framework-analysis/', views.api_framework_analysis, name='api_framework_analysis'),
    
    # Career exploration
    path('career-explorer/<int:student_id>/', views.career_explorer, name='career_explorer'),
    
    # Progress tracking
    path('progress/<int:student_id>/', views.progress_tracking, name='progress_tracking'),
    
    # Feedback
    path('feedback/', views.provide_feedback, name='provide_feedback'),
]
