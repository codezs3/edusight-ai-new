from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    # Analytics dashboard
    path('', views.analytics_dashboard, name='dashboard'),
    path('students/', views.student_analytics_dashboard, name='student_dashboard'),
    path('school/', views.school_analytics_dashboard, name='school_dashboard'),
    
    # Student analytics
    path('student/<int:student_id>/', views.student_detailed_analytics, name='student_detail'),
    path('student/<int:student_id>/performance/', views.student_performance_trends, name='student_performance'),
    path('student/<int:student_id>/reports/', views.student_reports, name='student_reports'),
    
    # Comparative analytics
    path('compare/', views.comparative_analytics, name='compare'),
    path('benchmarks/', views.benchmark_analytics, name='benchmarks'),
    
    # Reports
    path('reports/', views.analytics_reports, name='reports'),
    path('reports/generate/', views.generate_analytics_report, name='generate_report'),
    
    # API endpoints
    path('api/dashboard/', views.analytics_dashboard_api, name='dashboard_api'),
    path('api/student/<int:student_id>/', views.student_analytics_api, name='student_api'),
    path('api/trends/', views.analytics_trends_api, name='trends_api'),
]
