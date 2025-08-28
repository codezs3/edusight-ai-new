"""
CRM Models for EduSight Platform
Handles lead generation, customer management, and follow-ups
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import RegexValidator
import uuid


class LeadSource(models.Model):
    """Source of leads (Website, Social Media, Referral, etc.)"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'crm_lead_sources'


class Lead(models.Model):
    """Lead/Prospect information"""
    
    LEAD_STATUS_CHOICES = [
        ('new', 'New Lead'),
        ('contacted', 'Contacted'),
        ('interested', 'Interested'),
        ('qualified', 'Qualified'),
        ('appointment_scheduled', 'Appointment Scheduled'),
        ('converted', 'Converted'),
        ('not_interested', 'Not Interested'),
        ('lost', 'Lost'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Basic Information
    lead_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be in format: '+999999999'. Up to 15 digits allowed.")
    phone = models.CharField(validators=[phone_regex], max_length=17)
    
    # Additional Information
    child_name = models.CharField(max_length=100, blank=True)
    child_age = models.IntegerField(null=True, blank=True)
    child_grade = models.CharField(max_length=20, blank=True)
    school_name = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    
    # Lead Management
    source = models.ForeignKey(LeadSource, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=30, choices=LEAD_STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_leads')
    
    # Services Interested In
    interested_in_dmit = models.BooleanField(default=False)
    interested_in_academic = models.BooleanField(default=False)
    interested_in_psychological = models.BooleanField(default=False)
    interested_in_career_guidance = models.BooleanField(default=False)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_contacted = models.DateTimeField(null=True, blank=True)
    next_followup = models.DateTimeField(null=True, blank=True)
    
    # Notes
    initial_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def days_since_created(self):
        return (timezone.now() - self.created_at).days
    
    class Meta:
        db_table = 'crm_leads'
        ordering = ['-created_at']


class CallLog(models.Model):
    """Log of all calls made to leads/customers"""
    
    CALL_TYPE_CHOICES = [
        ('outbound', 'Outbound'),
        ('inbound', 'Inbound'),
    ]
    
    CALL_STATUS_CHOICES = [
        ('answered', 'Answered'),
        ('no_answer', 'No Answer'),
        ('busy', 'Busy'),
        ('voicemail', 'Voicemail'),
        ('wrong_number', 'Wrong Number'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='call_logs')
    caller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    call_type = models.CharField(max_length=10, choices=CALL_TYPE_CHOICES)
    call_status = models.CharField(max_length=15, choices=CALL_STATUS_CHOICES)
    
    # Time Tracking
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)  # Duration in minutes
    
    # Call Details
    purpose = models.CharField(max_length=200)
    notes = models.TextField()
    outcome = models.TextField(blank=True)
    next_action = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Call to {self.lead.full_name} on {self.start_time.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        db_table = 'crm_call_logs'
        ordering = ['-start_time']


class Conversation(models.Model):
    """Record of all conversations and interactions"""
    
    CONVERSATION_TYPE_CHOICES = [
        ('phone', 'Phone Call'),
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
        ('meeting', 'In-Person Meeting'),
        ('video_call', 'Video Call'),
        ('website_chat', 'Website Chat'),
        ('social_media', 'Social Media'),
        ('other', 'Other'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='conversations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Staff member
    
    conversation_type = models.CharField(max_length=15, choices=CONVERSATION_TYPE_CHOICES)
    subject = models.CharField(max_length=200)
    content = models.TextField()
    
    # Time Tracking
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    
    # Attachments (optional)
    attachments = models.FileField(upload_to='crm/conversations/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.conversation_type} with {self.lead.full_name} - {self.subject}"
    
    class Meta:
        db_table = 'crm_conversations'
        ordering = ['-start_time']


class FollowUp(models.Model):
    """Scheduled follow-ups and reminders"""
    
    FOLLOWUP_TYPE_CHOICES = [
        ('call', 'Phone Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('whatsapp', 'WhatsApp'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('missed', 'Missed'),
        ('rescheduled', 'Rescheduled'),
        ('cancelled', 'Cancelled'),
    ]
    
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='followups')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    followup_type = models.CharField(max_length=10, choices=FOLLOWUP_TYPE_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    
    # Scheduling
    scheduled_date = models.DateTimeField()
    completed_date = models.DateTimeField(null=True, blank=True)
    
    # Details
    purpose = models.CharField(max_length=200)
    notes = models.TextField(blank=True)
    result = models.TextField(blank=True)
    
    # Reminders
    reminder_sent = models.BooleanField(default=False)
    reminder_time = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Follow-up with {self.lead.full_name} on {self.scheduled_date.strftime('%Y-%m-%d')}"
    
    class Meta:
        db_table = 'crm_followups'
        ordering = ['scheduled_date']


class Appointment(models.Model):
    """DMIT and consultation appointments"""
    
    APPOINTMENT_TYPE_CHOICES = [
        ('dmit', 'DMIT Test'),
        ('consultation', 'Educational Consultation'),
        ('career_guidance', 'Career Guidance'),
        ('academic_assessment', 'Academic Assessment'),
        ('psychological_assessment', 'Psychological Assessment'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    LOCATION_CHOICES = [
        ('home', 'Home Visit'),
        ('center', 'Our Center'),
        ('online', 'Online'),
    ]
    
    appointment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='appointments')
    
    # Appointment Details
    appointment_type = models.CharField(max_length=25, choices=APPOINTMENT_TYPE_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='scheduled')
    location_type = models.CharField(max_length=10, choices=LOCATION_CHOICES, default='home')
    
    # Scheduling
    scheduled_date = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    
    # Location Details
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, default=2999.00)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment
    payment_status = models.CharField(max_length=20, default='pending')
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    
    # Staff Assignment
    assigned_counselor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_appointments')
    
    # Notes
    special_instructions = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Calculate final price
        self.final_price = self.price - (self.price * self.discount / 100)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.appointment_type} - {self.lead.full_name} on {self.scheduled_date.strftime('%Y-%m-%d')}"
    
    class Meta:
        db_table = 'crm_appointments'
        ordering = ['scheduled_date']


class FormSubmission(models.Model):
    """Track all form submissions from website"""
    
    FORM_TYPE_CHOICES = [
        ('contact', 'Contact Form'),
        ('dmit_inquiry', 'DMIT Inquiry'),
        ('appointment_booking', 'Appointment Booking'),
        ('newsletter', 'Newsletter Signup'),
        ('callback_request', 'Callback Request'),
        ('free_consultation', 'Free Consultation'),
    ]
    
    submission_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    form_type = models.CharField(max_length=20, choices=FORM_TYPE_CHOICES)
    
    # Form Data (stored as JSON)
    form_data = models.JSONField()
    
    # Lead Association
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer_url = models.URLField(blank=True)
    
    # Processing
    processed = models.BooleanField(default=False)
    processed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.form_type} submission - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        db_table = 'crm_form_submissions'
        ordering = ['-created_at']