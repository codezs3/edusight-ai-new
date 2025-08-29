from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    # Student management
    path('', views.student_list, name='student_list'),
    path('create/', views.student_create, name='student_create'),
    path('<int:pk>/', views.student_detail, name='student_detail'),
    path('<int:pk>/edit/', views.student_edit, name='student_edit'),
    path('<int:pk>/analytics/', views.student_analytics, name='student_analytics'),
    
    # Attendance
    path('attendance/', views.attendance_view, name='attendance'),
    
    # API endpoints
    path('api/', views.student_api, name='student_api'),
]
