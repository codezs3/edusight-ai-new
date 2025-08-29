from django.urls import path
from . import views

app_name = 'assessments'

urlpatterns = [
    # Assessment management
    path('', views.AssessmentListView.as_view(), name='assessment_list'),
    path('create/', views.AssessmentCreateView.as_view(), name='assessment_create'),
    path('<int:pk>/', views.AssessmentDetailView.as_view(), name='assessment_detail'),
    path('<int:pk>/edit/', views.AssessmentUpdateView.as_view(), name='assessment_edit'),
    path('<int:pk>/delete/', views.AssessmentDeleteView.as_view(), name='assessment_delete'),
    path('<int:pk>/take/', views.take_assessment, name='take_assessment'),
    
    # Assessment results
    path('results/', views.assessment_results_list, name='results_list'),
    path('results/<int:pk>/', views.assessment_result_detail, name='result_detail'),
    
    # Analytics
    path('analytics/', views.assessment_analytics, name='analytics'),
    
    # API endpoints
    path('api/', views.assessment_api, name='assessment_api'),
    path('api/stats/', views.assessment_stats_api, name='assessment_stats_api'),
]
