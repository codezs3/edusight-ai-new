"""
URL Configuration for EduSight B2C Website
"""

from django.urls import path
from . import website_views

urlpatterns = [
    # Main website pages
    path('', website_views.website_home, name='website_home'),
    path('about/', website_views.website_about, name='website_about'),
    path('contact/', website_views.website_contact, name='website_contact'),
    
    # DMIT pages
    path('dmit/', website_views.dmit_info, name='dmit_info'),
    path('book-appointment/', website_views.book_appointment, name='book_appointment'),
    
    # Framework pages
    path('frameworks/cbse/', website_views.framework_cbse, name='framework_cbse'),
    path('frameworks/icse/', website_views.framework_icse, name='framework_icse'),
    path('frameworks/igcse/', website_views.framework_igcse, name='framework_igcse'),
    path('frameworks/ib/', website_views.framework_ib, name='framework_ib'),
    path('frameworks/psychological/', website_views.framework_psychological, name='framework_psychological'),
    path('frameworks/physical/', website_views.framework_physical, name='framework_physical'),
    
    # AJAX endpoints
    path('ajax/contact/', website_views.ajax_contact_form, name='ajax_contact_form'),
]
