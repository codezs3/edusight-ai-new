"""
URL configuration for the student portal app
Handles customer dashboard, data upload, validation, analysis, and reports
"""

from django.urls import path
from . import views

app_name = 'student_portal'

urlpatterns = [
    # Main dashboard
    path('', views.customer_dashboard, name='dashboard'),
    
    # Data management workflow
    path('upload/', views.data_upload, name='data_upload'),
    path('validation/', views.data_validation, name='data_validation'),
    path('analysis/', views.data_analysis, name='data_analysis'),
    
    # API endpoints for AJAX calls
    path('api/upload/', views.handle_file_upload, name='api_upload'),
    path('api/validation-action/', views.handle_validation_action, name='api_validation_action'),
    path('api/completion-status/', views.get_completion_status, name='api_completion_status'),
    path('api/analytics/', views.get_analytics_data, name='api_analytics'),
    path('api/predictions/', views.get_predictions_data, name='api_predictions'),
    
    # Report generation
    path('reports/', views.report_management, name='reports'),
    path('reports/generate/', views.generate_report, name='generate_report'),
    path('reports/download/<int:report_id>/', views.download_report, name='download_report'),
    
    # Data management
    path('data/edit/<str:entry_type>/<int:entry_id>/', views.edit_data_entry, name='edit_data_entry'),
    path('data/delete/<str:entry_type>/<int:entry_id>/', views.delete_data_entry, name='delete_data_entry'),
    
    # Analytics and insights
    path('insights/', views.detailed_insights, name='insights'),
    path('benchmarks/', views.benchmark_comparison, name='benchmarks'),
    path('predictions/', views.prediction_dashboard, name='predictions'),
    
    # Settings and profile
    path('settings/', views.profile_settings, name='settings'),
    path('notifications/', views.notification_center, name='notifications'),
    
    # Help and support
    path('help/', views.help_center, name='help'),
    path('tutorial/', views.interactive_tutorial, name='tutorial'),
]
