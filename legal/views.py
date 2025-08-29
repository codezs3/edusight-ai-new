from django.shortcuts import render
from django.http import HttpResponse
from django.template.loader import render_to_string


def terms_of_service(request):
    """Terms of Service page"""
    return render(request, 'legal/terms_of_service.html')


def privacy_policy(request):
    """Privacy Policy page"""
    return render(request, 'legal/privacy_policy.html')


def legal_disclaimer(request):
    """Legal Disclaimer page"""
    return render(request, 'legal/disclaimer.html')
