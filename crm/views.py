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


# Additional CRUD views for CRM
@login_required
def lead_create(request):
    """Create a new lead."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        # Create new lead
        lead = Lead.objects.create(
            first_name=request.POST.get('first_name'),
            last_name=request.POST.get('last_name'),
            email=request.POST.get('email'),
            phone=request.POST.get('phone'),
            child_name=request.POST.get('child_name', ''),
            child_age=request.POST.get('child_age') or None,
            city=request.POST.get('city', ''),
            status=request.POST.get('status', 'new'),
            initial_notes=request.POST.get('notes', ''),
            created_by=request.user
        )
        
        messages.success(request, 'Lead created successfully!')
        return redirect('crm:lead_detail', pk=lead.pk)
    
    # Get lead sources for form
    lead_sources = LeadSource.objects.all()
    
    context = {
        'lead_sources': lead_sources,
        'status_choices': Lead.LEAD_STATUS_CHOICES,
    }
    
    return render(request, 'crm/lead_form.html', context)


@login_required
def lead_detail(request, pk):
    """View lead details."""
    lead = get_object_or_404(Lead, pk=pk)
    
    # Get related records
    call_logs = CallLog.objects.filter(lead=lead).order_by('-start_time')
    followups = FollowUp.objects.filter(lead=lead).order_by('-scheduled_date')
    appointments = Appointment.objects.filter(lead=lead).order_by('-scheduled_date')
    conversations = Conversation.objects.filter(lead=lead).order_by('-created_at')
    
    context = {
        'lead': lead,
        'call_logs': call_logs,
        'followups': followups,
        'appointments': appointments,
        'conversations': conversations,
    }
    
    return render(request, 'crm/lead_detail.html', context)


@login_required
def lead_edit(request, pk):
    """Edit a lead."""
    lead = get_object_or_404(Lead, pk=pk)
    
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        # Update lead
        lead.first_name = request.POST.get('first_name')
        lead.last_name = request.POST.get('last_name')
        lead.email = request.POST.get('email')
        lead.phone = request.POST.get('phone')
        lead.child_name = request.POST.get('child_name', '')
        lead.child_age = request.POST.get('child_age') or None
        lead.city = request.POST.get('city', '')
        lead.status = request.POST.get('status')
        lead.initial_notes = request.POST.get('notes', '')
        lead.save()
        
        messages.success(request, 'Lead updated successfully!')
        return redirect('crm:lead_detail', pk=lead.pk)
    
    context = {
        'lead': lead,
        'status_choices': Lead.LEAD_STATUS_CHOICES,
    }
    
    return render(request, 'crm/lead_form.html', context)


@login_required
def lead_delete(request, pk):
    """Delete a lead."""
    lead = get_object_or_404(Lead, pk=pk)
    
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        lead.delete()
        messages.success(request, 'Lead deleted successfully!')
        return redirect('crm:leads_list')
    
    context = {
        'lead': lead,
    }
    
    return render(request, 'crm/lead_confirm_delete.html', context)


@login_required
def followups_list(request):
    """List all follow-ups."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    followups = FollowUp.objects.select_related('lead').order_by('-scheduled_date')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        followups = followups.filter(status=status_filter)
    
    # Pagination
    paginator = Paginator(followups, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'status_choices': FollowUp.STATUS_CHOICES,
        'current_status': status_filter,
    }
    
    return render(request, 'crm/followups_list.html', context)


@login_required
def followup_create(request):
    """Create a new follow-up."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        lead_id = request.POST.get('lead_id')
        lead = get_object_or_404(Lead, id=lead_id)
        
        followup = FollowUp.objects.create(
            lead=lead,
            scheduled_date=request.POST.get('scheduled_date'),
            scheduled_time=request.POST.get('scheduled_time'),
            notes=request.POST.get('notes', ''),
            created_by=request.user
        )
        
        messages.success(request, 'Follow-up scheduled successfully!')
        return redirect('crm:lead_detail', pk=lead.pk)
    
    # Get leads for form
    leads = Lead.objects.filter(status__in=['new', 'contacted', 'qualified'])
    
    context = {
        'leads': leads,
    }
    
    return render(request, 'crm/followup_form.html', context)


@login_required
def complete_followup(request, pk):
    """Complete a follow-up."""
    followup = get_object_or_404(FollowUp, pk=pk)
    
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        followup.status = 'completed'
        followup.completion_notes = request.POST.get('completion_notes', '')
        followup.completed_at = timezone.now()
        followup.save()
        
        messages.success(request, 'Follow-up completed successfully!')
        return redirect('crm:followups_list')
    
    context = {
        'followup': followup,
    }
    
    return render(request, 'crm/complete_followup.html', context)


@login_required
def appointments_list(request):
    """List all appointments."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    appointments = Appointment.objects.select_related('lead').order_by('-scheduled_date')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        appointments = appointments.filter(status=status_filter)
    
    # Pagination
    paginator = Paginator(appointments, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'status_choices': Appointment.STATUS_CHOICES,
        'current_status': status_filter,
    }
    
    return render(request, 'crm/appointments_list.html', context)


@login_required
def appointment_create(request):
    """Create a new appointment."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        lead_id = request.POST.get('lead_id')
        lead = get_object_or_404(Lead, id=lead_id)
        
        appointment = Appointment.objects.create(
            lead=lead,
            scheduled_date=request.POST.get('scheduled_date'),
            scheduled_time=request.POST.get('scheduled_time'),
            appointment_type=request.POST.get('appointment_type'),
            location=request.POST.get('location', ''),
            notes=request.POST.get('notes', ''),
            created_by=request.user
        )
        
        messages.success(request, 'Appointment scheduled successfully!')
        return redirect('crm:appointment_detail', pk=appointment.pk)
    
    # Get leads for form
    leads = Lead.objects.filter(status__in=['new', 'contacted', 'qualified'])
    
    context = {
        'leads': leads,
        'appointment_types': Appointment.APPOINTMENT_TYPE_CHOICES,
    }
    
    return render(request, 'crm/appointment_form.html', context)


@login_required
def appointment_detail(request, pk):
    """View appointment details."""
    appointment = get_object_or_404(Appointment, pk=pk)
    
    context = {
        'appointment': appointment,
    }
    
    return render(request, 'crm/appointment_detail.html', context)


@login_required
def appointment_edit(request, pk):
    """Edit an appointment."""
    appointment = get_object_or_404(Appointment, pk=pk)
    
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        appointment.scheduled_date = request.POST.get('scheduled_date')
        appointment.scheduled_time = request.POST.get('scheduled_time')
        appointment.appointment_type = request.POST.get('appointment_type')
        appointment.location = request.POST.get('location', '')
        appointment.notes = request.POST.get('notes', '')
        appointment.status = request.POST.get('status')
        appointment.save()
        
        messages.success(request, 'Appointment updated successfully!')
        return redirect('crm:appointment_detail', pk=appointment.pk)
    
    context = {
        'appointment': appointment,
        'appointment_types': Appointment.APPOINTMENT_TYPE_CHOICES,
        'status_choices': Appointment.STATUS_CHOICES,
    }
    
    return render(request, 'crm/appointment_form.html', context)


@login_required
def call_logs_list(request):
    """List all call logs."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    call_logs = CallLog.objects.select_related('lead').order_by('-start_time')
    
    # Pagination
    paginator = Paginator(call_logs, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
    }
    
    return render(request, 'crm/call_logs_list.html', context)


@login_required
def call_log_create(request):
    """Create a new call log."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    if request.method == 'POST':
        lead_id = request.POST.get('lead_id')
        lead = get_object_or_404(Lead, id=lead_id)
        
        call_log = CallLog.objects.create(
            lead=lead,
            call_type=request.POST.get('call_type'),
            duration_minutes=request.POST.get('duration_minutes') or 0,
            notes=request.POST.get('notes', ''),
            outcome=request.POST.get('outcome', ''),
            created_by=request.user,
            start_time=timezone.now()
        )
        
        messages.success(request, 'Call log created successfully!')
        return redirect('crm:lead_detail', pk=lead.pk)
    
    # Get leads for form
    leads = Lead.objects.all()
    
    context = {
        'leads': leads,
        'call_types': CallLog.CALL_TYPE_CHOICES,
    }
    
    return render(request, 'crm/call_log_form.html', context)


@login_required
def form_submissions_list(request):
    """List all form submissions."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    submissions = FormSubmission.objects.order_by('-created_at')
    
    # Filter by form type
    form_type = request.GET.get('form_type')
    if form_type:
        submissions = submissions.filter(form_type=form_type)
    
    # Pagination
    paginator = Paginator(submissions, 25)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    # Get unique form types for filter
    form_types = FormSubmission.objects.values_list('form_type', flat=True).distinct()
    
    context = {
        'page_obj': page_obj,
        'form_types': form_types,
        'current_form_type': form_type,
    }
    
    return render(request, 'crm/form_submissions_list.html', context)


@login_required
def form_submission_detail(request, pk):
    """View form submission details."""
    submission = get_object_or_404(FormSubmission, pk=pk)
    
    context = {
        'submission': submission,
    }
    
    return render(request, 'crm/form_submission_detail.html', context)


@login_required
def crm_reports(request):
    """CRM reports dashboard."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Key metrics
    total_leads = Lead.objects.count()
    new_leads_this_month = Lead.objects.filter(
        created_at__month=timezone.now().month
    ).count()
    converted_leads = Lead.objects.filter(status='converted').count()
    conversion_rate = (converted_leads / total_leads * 100) if total_leads > 0 else 0
    
    # Lead source statistics
    lead_sources = Lead.objects.values('source__name').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Status distribution
    status_distribution = Lead.objects.values('status').annotate(
        count=Count('id')
    )
    
    context = {
        'total_leads': total_leads,
        'new_leads_this_month': new_leads_this_month,
        'converted_leads': converted_leads,
        'conversion_rate': conversion_rate,
        'lead_sources': lead_sources,
        'status_distribution': list(status_distribution),
    }
    
    return render(request, 'crm/reports_dashboard.html', context)


@login_required
def leads_report(request):
    """Detailed leads report."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Get date range from request
    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    
    leads = Lead.objects.all()
    
    if date_from:
        leads = leads.filter(created_at__date__gte=date_from)
    if date_to:
        leads = leads.filter(created_at__date__lte=date_to)
    
    # Generate statistics
    total_leads = leads.count()
    leads_by_status = leads.values('status').annotate(count=Count('id'))
    leads_by_source = leads.values('source__name').annotate(count=Count('id'))
    leads_by_month = leads.values('created_at__month').annotate(count=Count('id'))
    
    context = {
        'total_leads': total_leads,
        'leads_by_status': list(leads_by_status),
        'leads_by_source': list(leads_by_source),
        'leads_by_month': list(leads_by_month),
        'date_from': date_from,
        'date_to': date_to,
    }
    
    return render(request, 'crm/leads_report.html', context)


@login_required
def conversion_report(request):
    """Conversion funnel report."""
    if not request.user.is_staff:
        messages.error(request, 'Access denied.')
        return redirect('dashboard')
    
    # Conversion funnel
    total_leads = Lead.objects.count()
    contacted_leads = Lead.objects.filter(status__in=['contacted', 'qualified', 'converted']).count()
    qualified_leads = Lead.objects.filter(status__in=['qualified', 'converted']).count()
    converted_leads = Lead.objects.filter(status='converted').count()
    
    # Calculate conversion rates
    contact_rate = (contacted_leads / total_leads * 100) if total_leads > 0 else 0
    qualification_rate = (qualified_leads / contacted_leads * 100) if contacted_leads > 0 else 0
    conversion_rate = (converted_leads / qualified_leads * 100) if qualified_leads > 0 else 0
    
    context = {
        'total_leads': total_leads,
        'contacted_leads': contacted_leads,
        'qualified_leads': qualified_leads,
        'converted_leads': converted_leads,
        'contact_rate': contact_rate,
        'qualification_rate': qualification_rate,
        'conversion_rate': conversion_rate,
    }
    
    return render(request, 'crm/conversion_report.html', context)


# API endpoints
@login_required
def leads_api(request):
    """API endpoint for leads data."""
    leads = Lead.objects.select_related('source').all()
    
    data = []
    for lead in leads:
        data.append({
            'id': lead.id,
            'name': f"{lead.first_name} {lead.last_name}",
            'email': lead.email,
            'phone': lead.phone,
            'status': lead.status,
            'source': lead.source.name if lead.source else 'Unknown',
            'created_at': lead.created_at.isoformat(),
        })
    
    return JsonResponse({'leads': data})


@login_required
def crm_stats_api(request):
    """API endpoint for CRM statistics."""
    total_leads = Lead.objects.count()
    new_leads_today = Lead.objects.filter(
        created_at__date=timezone.now().date()
    ).count()
    pending_followups = FollowUp.objects.filter(status='pending').count()
    appointments_today = Appointment.objects.filter(
        scheduled_date__date=timezone.now().date()
    ).count()
    
    return JsonResponse({
        'total_leads': total_leads,
        'new_leads_today': new_leads_today,
        'pending_followups': pending_followups,
        'appointments_today': appointments_today,
    })