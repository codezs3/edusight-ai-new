from django.urls import path
from . import views

app_name = 'parent_dashboard'

urlpatterns = [
    # Parent login
    path('login/', views.parent_login_view, name='parent_login'),
    
    # Main dashboard
    path('', views.parent_dashboard, name='dashboard'),
    
    # 5-Step Workflow
    path('workflow/', views.assessment_workflow, name='workflow'),
    path('workflow/step/<int:step>/', views.workflow_step, name='workflow_step'),
    
    # Upload and data entry
    path('upload/', views.upload_student_data, name='upload'),
    path('manual-entry/<int:session_id>/', views.manual_entry, name='manual_entry'),
    
    # Assessment and results
    path('results/<int:session_id>/', views.assessment_results, name='assessment_results'),
    
    # API endpoints for workflow
    path('api/upload-file/', views.api_upload_file, name='api_upload_file'),
    path('api/process-data/', views.api_process_data, name='api_process_data'),
    path('api/generate-report/<int:session_id>/', views.api_generate_report, name='api_generate_report'),
    
    # Career exploration
    path('career-explorer/<int:student_id>/', views.career_explorer, name='career_explorer'),
    
    # Progress tracking
    path('progress/<int:student_id>/', views.progress_tracking, name='progress_tracking'),
    
    # Feedback
    path('feedback/', views.provide_feedback, name='provide_feedback'),
]
