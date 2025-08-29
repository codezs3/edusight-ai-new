from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import datetime
import json


def signup_view(request):
    """User registration view with mandatory legal agreements"""
    if request.method == 'POST':
        try:
            # Extract form data
            first_name = request.POST.get('first_name', '').strip()
            last_name = request.POST.get('last_name', '').strip()
            email = request.POST.get('email', '').strip()
            username = request.POST.get('username', '').strip()
            password1 = request.POST.get('password1', '')
            password2 = request.POST.get('password2', '')
            user_type = request.POST.get('user_type', 'parent')
            phone = request.POST.get('phone', '').strip()
            country = request.POST.get('country', '').strip()
            
            # Legal agreements
            agree_terms = request.POST.get('agree_terms') == 'on'
            agree_privacy = request.POST.get('agree_privacy') == 'on'
            agree_disclaimer = request.POST.get('agree_disclaimer') == 'on'
            agree_professional = request.POST.get('agree_professional') == 'on'
            agree_age = request.POST.get('agree_age') == 'on'
            agree_marketing = request.POST.get('agree_marketing') == 'on'
            agreement_timestamp = request.POST.get('agreement_timestamp')
            
            # Validation
            errors = []
            
            if not all([first_name, last_name, email, username, password1, password2]):
                errors.append("All required fields must be filled.")
            
            if password1 != password2:
                errors.append("Passwords do not match.")
            
            if len(password1) < 8:
                errors.append("Password must be at least 8 characters long.")
            
            if not all([agree_terms, agree_privacy, agree_disclaimer, agree_professional, agree_age]):
                errors.append("All required legal agreements must be accepted.")
            
            # Check if username exists
            if User.objects.filter(username=username).exists():
                errors.append("Username already exists.")
            
            # Check if email exists
            if User.objects.filter(email=email).exists():
                errors.append("Email already registered.")
            
            if errors:
                for error in errors:
                    messages.error(request, error)
                return render(request, 'registration/signup.html')
            
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=first_name,
                last_name=last_name
            )
            
            # Store additional information in user profile (if profile model exists)
            # For now, we'll store it in session or create a UserProfile model later
            
            # Store legal agreement information
            legal_agreements = {
                'terms_accepted': agree_terms,
                'privacy_accepted': agree_privacy,
                'disclaimer_accepted': agree_disclaimer,
                'professional_consultation_understood': agree_professional,
                'age_confirmed': agree_age,
                'marketing_consent': agree_marketing,
                'agreement_timestamp': agreement_timestamp,
                'user_type': user_type,
                'phone': phone,
                'country': country,
                'ip_address': get_client_ip(request),
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            }
            
            # Store in session for now (later move to UserProfile model)
            request.session['legal_agreements'] = legal_agreements
            
            # Log the user in
            login(request, user)
            
            messages.success(request, f'Welcome to EduSight, {first_name}! Your account has been created successfully.')
            
            # Redirect based on user type
            if user_type == 'parent':
                return redirect('parent_dashboard:dashboard')
            elif user_type == 'student':
                return redirect('dashboard')  # Student dashboard
            elif user_type == 'educator':
                return redirect('admin_dashboard:overview')  # Admin dashboard
            else:
                return redirect('dashboard')
            
        except Exception as e:
            messages.error(request, f'An error occurred while creating your account: {str(e)}')
            return render(request, 'registration/signup.html')
    
    return render(request, 'registration/signup.html')


def signup_success(request):
    """Signup success page"""
    return render(request, 'registration/signup_success.html')


def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
