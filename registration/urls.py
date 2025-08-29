from django.urls import path
from . import views

app_name = 'registration'

urlpatterns = [
    path('', views.signup_view, name='signup'),
    path('success/', views.signup_success, name='signup_success'),
]
