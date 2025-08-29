from django.urls import path
from . import views
from . import settings_views

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
    
    # Settings Management
    path('settings/overview/', settings_views.settings_overview, name='settings_overview'),
    path('settings/database/', settings_views.database_settings, name='database_settings'),
    path('settings/system/', settings_views.system_settings, name='system_settings'),
    path('settings/backup/<str:backup_name>/', settings_views.backup_download, name='backup_download'),
    path('api/backup/', settings_views.backup_api, name='backup_api'),
    
    # New CRUD management pages
    path('students/', views.students_management, name='students'),
    path('assessments/', views.assessments_management, name='assessments'),
    path('ml-models/', views.ml_models_management, name='ml_models'),
    path('system-stats/', views.system_statistics, name='system_stats'),
]
