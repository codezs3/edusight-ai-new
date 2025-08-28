from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    # Student management
    path('', views.StudentListView.as_view(), name='student_list'),
    path('create/', views.StudentCreateView.as_view(), name='student_create'),
    path('<int:pk>/', views.StudentDetailView.as_view(), name='student_detail'),
    path('<int:pk>/edit/', views.StudentUpdateView.as_view(), name='student_edit'),
    path('<int:pk>/dashboard/', views.student_dashboard, name='student_dashboard'),
    path('<int:pk>/analytics/', views.student_analytics, name='student_analytics'),
    
    # Attendance
    path('attendance/', views.attendance_view, name='attendance'),
    
    # API endpoints
    path('api/', views.student_api, name='student_api'),
    path('api/stats/', views.student_stats_api, name='student_stats_api'),
]
