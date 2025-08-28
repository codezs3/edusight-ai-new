"""
CRM Views for EduSight Platform
Handles lead management, customer tracking, and follow-ups
"""

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib import messages
from django.utils import timezone
from django.db.models import Count, Q
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
import json

from .models import Lead, CallLog, Conversation, FollowUp, Appointment, FormSubmission, LeadSource


@login_required
def crm_dashboard(request):
    """Main CRM dashboard with key metrics"""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Key Metrics
    total_leads = Lead.objects.count()
    new_leads_today = Lead.objects.filter(created_at__date=timezone.now().date()).count()
    pending_followups = FollowUp.objects.filter(status='pending').count()
    appointments_today = Appointment.objects.filter(scheduled_date__date=timezone.now().date()).count()
    
    # Recent Activities
    recent_leads = Lead.objects.order_by('-created_at')[:10]
    recent_calls = CallLog.objects.order_by('-start_time')[:5]
    
    # Lead Status Distribution
    lead_status_stats = Lead.objects.values('status').annotate(count=Count('id'))
    
    context = {
        'total_leads': total_leads,
        'new_leads_today': new_leads_today,
        'pending_followups': pending_followups,
        'appointments_today': appointments_today,
        'recent_leads': recent_leads,
        'recent_calls': recent_calls,
        'lead_status_stats': list(lead_status_stats),
    }
    
    return render(request, 'crm/dashboard.html', context)


@login_required
def leads_list(request):
    """List all leads with filtering"""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    leads = Lead.objects.all()
    
    # Filtering
    status_filter = request.GET.get('status')
    if status_filter:
        leads = leads.filter(status=status_filter)
    
    # Search
    search_query = request.GET.get('search')
    if search_query:
        leads = leads.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(leads, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'status_choices': Lead.LEAD_STATUS_CHOICES,
        'current_filters': {
            'status': status_filter,
            'search': search_query,
        }
    }
    
    return render(request, 'crm/leads_list.html', context)


@csrf_exempt
def capture_form_submission(request):
    """Capture form submissions from website"""
    if request.method == 'POST':
        try:
            # Get form data
            if request.content_type == 'application/json':
                data = json.loads(request.body)
            else:
                data = request.POST.dict()
            
            # Create form submission record
            submission = FormSubmission.objects.create(
                form_type=data.get('form_type', 'contact'),
                form_data=data,
                ip_address=request.META.get('REMOTE_ADDR'),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                referrer_url=request.META.get('HTTP_REFERER', '')
            )
            
            # Try to create lead if email provided
            email = data.get('email')
            if email:
                lead, created = Lead.objects.get_or_create(
                    email=email,
                    defaults={
                        'first_name': data.get('first_name', data.get('name', 'Unknown')),
                        'last_name': data.get('last_name', ''),
                        'phone': data.get('phone', ''),
                        'child_name': data.get('child_name', ''),
                        'city': data.get('city', ''),
                        'status': 'new',
                        'initial_notes': data.get('message', '')
                    }
                )
                submission.lead = lead
                submission.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Form submitted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)