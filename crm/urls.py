from django.urls import path
from . import views

app_name = 'crm'

urlpatterns = [
    # CRM Dashboard
    path('', views.crm_dashboard, name='dashboard'),
    
    # Lead management
    path('leads/', views.leads_list, name='leads_list'),
    path('leads/create/', views.lead_create, name='lead_create'),
    path('leads/<int:pk>/', views.lead_detail, name='lead_detail'),
    path('leads/<int:pk>/edit/', views.lead_edit, name='lead_edit'),
    path('leads/<int:pk>/delete/', views.lead_delete, name='lead_delete'),
    
    # Follow-ups
    path('followups/', views.followups_list, name='followups_list'),
    path('followups/create/', views.followup_create, name='followup_create'),
    path('followups/<int:pk>/complete/', views.complete_followup, name='complete_followup'),
    
    # Appointments
    path('appointments/', views.appointments_list, name='appointments_list'),
    path('appointments/create/', views.appointment_create, name='appointment_create'),
    path('appointments/<int:pk>/', views.appointment_detail, name='appointment_detail'),
    path('appointments/<int:pk>/edit/', views.appointment_edit, name='appointment_edit'),
    
    # Call logs
    path('calls/', views.call_logs_list, name='calls_list'),
    path('calls/create/', views.call_log_create, name='call_create'),
    
    # Form submissions
    path('forms/', views.form_submissions_list, name='forms_list'),
    path('forms/<int:pk>/', views.form_submission_detail, name='form_detail'),
    
    # Reports
    path('reports/', views.crm_reports, name='reports'),
    path('reports/leads/', views.leads_report, name='leads_report'),
    path('reports/conversion/', views.conversion_report, name='conversion_report'),
    
    # API endpoints
    path('api/capture-form/', views.capture_form_submission, name='capture_form'),
    path('api/leads/', views.leads_api, name='leads_api'),
    path('api/stats/', views.crm_stats_api, name='stats_api'),
]
