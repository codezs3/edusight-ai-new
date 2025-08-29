"""
URL configuration for edusight_django project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

# Import app views
from dashboard.views import (
    DashboardView, dashboard_api, student_list_api, 
    assessment_stats_api, ml_predictions_api
)

# Import website views for B2C
import website_views

urlpatterns = [
    # Admin interface
    path('admin/', admin.site.urls),
    
    # B2C Website URLs
    path('', website_views.website_home, name='website_home'),
    path('about/', website_views.website_about, name='website_about'),
    path('contact/', website_views.website_contact, name='website_contact'),
    path('pricing/', website_views.pricing_plans, name='pricing_plans'),
    path('book-assessment/', website_views.book_assessment, name='book_assessment'),
    # Legacy DMIT pages (keep for backward compatibility)
    path('dmit/', website_views.dmit_info, name='dmit_info'),
    path('book-appointment/', website_views.book_assessment, name='book_appointment'),
    
    # Framework pages
    path('frameworks/cbse/', website_views.framework_cbse, name='framework_cbse'),
    path('frameworks/icse/', website_views.framework_icse, name='framework_icse'),
    path('frameworks/igcse/', website_views.framework_igcse, name='framework_igcse'),
    path('frameworks/ib/', website_views.framework_ib, name='framework_ib'),
    path('frameworks/psychological/', website_views.framework_psychological, name='framework_psychological'),
    path('frameworks/physical/', website_views.framework_physical, name='framework_physical'),
    
    # AJAX endpoints
    path('ajax/contact/', website_views.ajax_contact_form, name='ajax_contact_form'),
    
    # Admin Dashboard (Internal)
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # Admin Management Panel
    path('admin-panel/', include('admin_dashboard.urls')),
    path('student-portal/', include('student_portal.urls')),
    path('parent-dashboard/', include('parent_dashboard.urls')),
    
    # API endpoints
    path('api/dashboard/', dashboard_api, name='dashboard_api'),
    path('api/students/', student_list_api, name='student_list_api'),
    path('api/assessments/stats/', assessment_stats_api, name='assessment_stats_api'),
    path('api/ml/predictions/', ml_predictions_api, name='ml_predictions_api'),
    
    # App URLs 
    path('students/', include('students.urls')),
    path('assessments/', include('assessments.urls')),
    path('analytics/', include('data_analytics.urls')),
    path('ml/', include('ml_predictions.urls')),
    path('crm/', include('crm.urls')),
    
    # Authentication (Django built-in)
    path('accounts/', include('django.contrib.auth.urls')),
    
    # Legacy redirects (for backward compatibility with PHP) - Using relative URLs
    path('dashboard.php', RedirectView.as_view(pattern_name='dashboard', permanent=True)),
    path('students.php', RedirectView.as_view(pattern_name='students:student_list', permanent=True)),
    path('assessments.php', RedirectView.as_view(pattern_name='assessments:assessment_list', permanent=True)),
    path('analytics.php', RedirectView.as_view(pattern_name='analytics:dashboard', permanent=True)),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
