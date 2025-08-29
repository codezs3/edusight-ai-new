from django.urls import path
from . import views

app_name = 'admin_dashboard'

urlpatterns = [
    path('overview/', views.admin_dashboard_home, name='overview'),
    path('pages/', views.pages_management, name='pages'),
    path('menus/', views.menus_management, name='menus'),
    path('media/', views.media_management, name='media'),
    path('users/', views.users_management, name='users'),
    path('forms/', views.forms_management, name='forms'),
    path('analytics/', views.analytics_dashboard, name='analytics'),
    path('appearance/', views.appearance_management, name='appearance'),
    path('plugins/', views.plugins_management, name='plugins'),
    path('settings/', views.settings_management, name='settings'),
    path('backup/', views.backup_system, name='backup'),
    path('workflows/', views.workflow_management, name='workflows'),
    
    # New CRUD management pages
    path('students/', views.students_management, name='students'),
    path('assessments/', views.assessments_management, name='assessments'),
    path('ml-models/', views.ml_models_management, name='ml_models'),
    path('system-stats/', views.system_statistics, name='system_stats'),
]
