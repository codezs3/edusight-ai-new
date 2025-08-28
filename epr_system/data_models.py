"""
Comprehensive data models for academic, psychological, and physical frameworks
Handles data capture, file uploads, and year-wise tracking
"""

from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
import uuid
import json
import os

def get_upload_path(instance, filename):
    """Generate upload path for files"""
    year = timezone.now().year
    month = timezone.now().month
    return f'student_data/{instance.student.id}/{year}/{month}/{filename}'

class StudentDataProfile(models.Model):
    """Main profile for student data management"""
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='data_profile')
    
    # Data collection status
    academic_data_complete = models.BooleanField(default=False)
    psychological_data_complete = models.BooleanField(default=False)
    physical_data_complete = models.BooleanField(default=False)
    
    # Data sources
    data_sources = models.JSONField(default=list, help_text="List of data sources (manual, upload, api)")
    
    # Year-wise tracking
    academic_years = models.JSONField(default=list, help_text="List of academic years with data")
    
    # Current status
    current_academic_year = models.CharField(max_length=20, blank=True)
    last_data_update = models.DateTimeField(auto_now=True)
    
    # Payment and access
    payment_status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),
        ('expired', 'Expired')
    ], default='pending')
    
    plan_type = models.CharField(max_length=20, choices=[
        ('basic', 'Basic - ₹499'),
        ('gold', 'Gold - ₹899'),
        ('platinum', 'Platinum - ₹1499'),
        ('corporate', 'Corporate - ₹25000')
    ], default='basic')
    
    access_expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Data Profile - {self.student.get_full_name() or self.student.username}"
    
    def get_completion_percentage(self):
        """Calculate overall data completion percentage"""
        total_sections = 3
        completed_sections = sum([
            self.academic_data_complete,
            self.psychological_data_complete,
            self.physical_data_complete
        ])
        return (completed_sections / total_sections) * 100
    
    def add_academic_year(self, year):
        """Add an academic year to tracking"""
        if year not in self.academic_years:
            self.academic_years.append(year)
            self.save()

class DataUpload(models.Model):
    """Track all file uploads from students"""
    UPLOAD_TYPES = [
        ('academic', 'Academic Data'),
        ('psychological', 'Psychological Data'),
        ('physical', 'Physical Health Data'),
        ('report_card', 'Report Card'),
        ('medical_report', 'Medical Report'),
        ('assessment_result', 'Assessment Result'),
        ('other', 'Other')
    ]
    
    FILE_TYPES = [
        ('csv', 'CSV File'),
        ('excel', 'Excel File'),
        ('pdf', 'PDF Document'),
        ('doc', 'Word Document'),
        ('image', 'Image File'),
        ('other', 'Other')
    ]
    
    PROCESSING_STATUS = [
        ('pending', 'Pending Processing'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('needs_review', 'Needs Manual Review')
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='data_uploads')
    
    # File information
    file = models.FileField(
        upload_to=get_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=[
            'csv', 'xlsx', 'xls', 'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'bmp'
        ])]
    )
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)
    
    # Upload metadata
    upload_type = models.CharField(max_length=20, choices=UPLOAD_TYPES)
    academic_year = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    
    # Processing status
    processing_status = models.CharField(max_length=20, choices=PROCESSING_STATUS, default='pending')
    processing_notes = models.TextField(blank=True)
    extracted_data = models.JSONField(default=dict, help_text="Data extracted from file")
    validation_errors = models.JSONField(default=list, help_text="Validation errors found")
    
    # AI/ML processing
    ocr_text = models.TextField(blank=True, help_text="OCR extracted text")
    ai_extracted_fields = models.JSONField(default=dict, help_text="AI extracted structured data")
    confidence_score = models.FloatField(default=0.0, validators=[MinValueValidator(0), MaxValueValidator(1)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.original_filename}"
    
    def get_file_extension(self):
        """Get file extension"""
        return os.path.splitext(self.original_filename)[1].lower()

class AcademicDataEntry(models.Model):
    """Academic performance data entries"""
    SUBJECT_CHOICES = [
        ('mathematics', 'Mathematics'),
        ('science', 'Science'),
        ('english', 'English'),
        ('social_studies', 'Social Studies'),
        ('hindi', 'Hindi'),
        ('computer_science', 'Computer Science'),
        ('physics', 'Physics'),
        ('chemistry', 'Chemistry'),
        ('biology', 'Biology'),
        ('history', 'History'),
        ('geography', 'Geography'),
        ('economics', 'Economics'),
        ('arts', 'Arts'),
        ('physical_education', 'Physical Education'),
        ('other', 'Other')
    ]
    
    ASSESSMENT_TYPES = [
        ('unit_test', 'Unit Test'),
        ('mid_term', 'Mid Term Exam'),
        ('final_exam', 'Final Exam'),
        ('quarterly', 'Quarterly Assessment'),
        ('half_yearly', 'Half Yearly'),
        ('annual', 'Annual Exam'),
        ('project', 'Project Work'),
        ('assignment', 'Assignment'),
        ('practical', 'Practical Exam'),
        ('other', 'Other')
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='academic_entries')
    data_profile = models.ForeignKey(StudentDataProfile, on_delete=models.CASCADE, related_name='academic_entries')
    
    # Academic details
    academic_year = models.CharField(max_length=20)
    class_grade = models.CharField(max_length=10)
    subject = models.CharField(max_length=30, choices=SUBJECT_CHOICES)
    assessment_type = models.CharField(max_length=20, choices=ASSESSMENT_TYPES)
    
    # Scores and performance
    marks_obtained = models.FloatField(validators=[MinValueValidator(0)])
    total_marks = models.FloatField(validators=[MinValueValidator(0)])
    percentage = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    grade = models.CharField(max_length=5, blank=True)
    
    # Additional metrics
    class_rank = models.PositiveIntegerField(null=True, blank=True)
    total_students = models.PositiveIntegerField(null=True, blank=True)
    class_average = models.FloatField(null=True, blank=True)
    
    # Behavioral metrics
    attendance_percentage = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    homework_completion = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    class_participation = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Teacher feedback
    teacher_comments = models.TextField(blank=True)
    improvement_areas = models.JSONField(default=list)
    strengths = models.JSONField(default=list)
    
    # Data source tracking
    data_source = models.CharField(max_length=20, choices=[
        ('manual', 'Manual Entry'),
        ('upload', 'File Upload'),
        ('api', 'API Import')
    ], default='manual')
    
    source_file = models.ForeignKey(DataUpload, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-academic_year', 'subject', '-created_at']
        unique_together = ['student', 'academic_year', 'subject', 'assessment_type']
    
    def save(self, *args, **kwargs):
        # Calculate percentage if not provided
        if not self.percentage and self.marks_obtained and self.total_marks:
            self.percentage = (self.marks_obtained / self.total_marks) * 100
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.subject} ({self.academic_year})"

class PsychologicalDataEntry(models.Model):
    """Psychological assessment data entries"""
    ASSESSMENT_CATEGORIES = [
        ('cognitive', 'Cognitive Assessment'),
        ('emotional', 'Emotional Intelligence'),
        ('behavioral', 'Behavioral Assessment'),
        ('personality', 'Personality Test'),
        ('learning_style', 'Learning Style'),
        ('stress_anxiety', 'Stress & Anxiety'),
        ('social_skills', 'Social Skills'),
        ('motivation', 'Motivation Level'),
        ('self_esteem', 'Self Esteem'),
        ('other', 'Other')
    ]
    
    SCALE_TYPES = [
        ('likert_5', '1-5 Likert Scale'),
        ('likert_7', '1-7 Likert Scale'),
        ('percentage', 'Percentage (0-100)'),
        ('binary', 'Yes/No'),
        ('custom', 'Custom Scale')
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='psychological_entries')
    data_profile = models.ForeignKey(StudentDataProfile, on_delete=models.CASCADE, related_name='psychological_entries')
    
    # Assessment details
    assessment_date = models.DateField(default=timezone.now)
    academic_year = models.CharField(max_length=20)
    assessment_category = models.CharField(max_length=20, choices=ASSESSMENT_CATEGORIES)
    assessment_name = models.CharField(max_length=100)
    
    # Standardized test scores
    # SDQ (Strengths and Difficulties Questionnaire)
    sdq_emotional_symptoms = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)])
    sdq_conduct_problems = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)])
    sdq_hyperactivity = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)])
    sdq_peer_problems = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)])
    sdq_prosocial = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)])
    
    # DASS-21 (Depression, Anxiety, Stress Scale)
    dass_depression = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(42)])
    dass_anxiety = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(42)])
    dass_stress = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(42)])
    
    # PERMA (Positive Psychology)
    perma_positive_emotion = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    perma_engagement = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    perma_relationships = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    perma_meaning = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    perma_achievement = models.FloatField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    
    # Custom assessments
    custom_scores = models.JSONField(default=dict, help_text="Custom assessment scores")
    scale_type = models.CharField(max_length=20, choices=SCALE_TYPES, default='percentage')
    
    # Qualitative data
    behavioral_observations = models.TextField(blank=True)
    mood_patterns = models.JSONField(default=dict)
    sleep_patterns = models.JSONField(default=dict)
    social_interactions = models.TextField(blank=True)
    
    # Assessment context
    assessor_name = models.CharField(max_length=100, blank=True)
    assessment_environment = models.CharField(max_length=100, blank=True)
    assessment_duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    
    # Data source tracking
    data_source = models.CharField(max_length=20, choices=[
        ('manual', 'Manual Entry'),
        ('upload', 'File Upload'),
        ('survey', 'Online Survey'),
        ('interview', 'Interview')
    ], default='manual')
    
    source_file = models.ForeignKey(DataUpload, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-assessment_date', '-created_at']
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.assessment_name} ({self.assessment_date})"

class PhysicalDataEntry(models.Model):
    """Physical health and fitness data entries"""
    MEASUREMENT_TYPES = [
        ('anthropometric', 'Height/Weight/BMI'),
        ('fitness', 'Fitness Assessment'),
        ('health_checkup', 'Health Checkup'),
        ('sports_performance', 'Sports Performance'),
        ('nutrition', 'Nutrition Assessment'),
        ('activity_tracking', 'Activity Tracking'),
        ('other', 'Other')
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='physical_entries')
    data_profile = models.ForeignKey(StudentDataProfile, on_delete=models.CASCADE, related_name='physical_entries')
    
    # Measurement details
    measurement_date = models.DateField(default=timezone.now)
    academic_year = models.CharField(max_length=20)
    measurement_type = models.CharField(max_length=20, choices=MEASUREMENT_TYPES)
    
    # Anthropometric data
    height_cm = models.FloatField(null=True, blank=True, validators=[MinValueValidator(50), MaxValueValidator(250)])
    weight_kg = models.FloatField(null=True, blank=True, validators=[MinValueValidator(10), MaxValueValidator(200)])
    bmi = models.FloatField(null=True, blank=True, validators=[MinValueValidator(10), MaxValueValidator(50)])
    bmi_percentile = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Fitness metrics
    cardiovascular_fitness = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    muscular_strength = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    flexibility = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    endurance = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Specific fitness tests
    push_ups_count = models.PositiveIntegerField(null=True, blank=True)
    sit_ups_count = models.PositiveIntegerField(null=True, blank=True)
    run_time_minutes = models.FloatField(null=True, blank=True)
    run_distance_meters = models.FloatField(null=True, blank=True)
    
    # Health indicators
    blood_pressure_systolic = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(60), MaxValueValidator(200)])
    blood_pressure_diastolic = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(40), MaxValueValidator(120)])
    heart_rate_bpm = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(50), MaxValueValidator(200)])
    
    # Activity and lifestyle
    daily_activity_hours = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(24)])
    sleep_hours_per_night = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(24)])
    screen_time_hours = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(24)])
    
    # Nutrition data
    nutrition_score = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    water_intake_liters = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(10)])
    meal_regularity_score = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Sports and activities
    sports_activities = models.JSONField(default=list, help_text="List of sports/activities participated")
    activity_frequency = models.JSONField(default=dict, help_text="Frequency of different activities")
    
    # Medical data
    medical_conditions = models.JSONField(default=list, help_text="List of medical conditions")
    medications = models.JSONField(default=list, help_text="List of medications")
    allergies = models.JSONField(default=list, help_text="List of allergies")
    
    # Assessment context
    measured_by = models.CharField(max_length=100, blank=True)
    measurement_location = models.CharField(max_length=100, blank=True)
    equipment_used = models.TextField(blank=True)
    
    # Data source tracking
    data_source = models.CharField(max_length=20, choices=[
        ('manual', 'Manual Entry'),
        ('upload', 'File Upload'),
        ('device', 'Wearable Device'),
        ('medical', 'Medical Report')
    ], default='manual')
    
    source_file = models.ForeignKey(DataUpload, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-measurement_date', '-created_at']
    
    def save(self, *args, **kwargs):
        # Calculate BMI if height and weight are provided
        if self.height_cm and self.weight_kg and not self.bmi:
            height_m = self.height_cm / 100
            self.bmi = self.weight_kg / (height_m ** 2)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.measurement_type} ({self.measurement_date})"

class DataValidationIssue(models.Model):
    """Track data validation issues that need user attention"""
    ISSUE_TYPES = [
        ('missing_data', 'Missing Required Data'),
        ('invalid_value', 'Invalid Value'),
        ('duplicate_entry', 'Duplicate Entry'),
        ('inconsistent_data', 'Inconsistent Data'),
        ('format_error', 'Format Error'),
        ('range_error', 'Value Out of Range'),
        ('other', 'Other Issue')
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low - Optional Fix'),
        ('medium', 'Medium - Recommended Fix'),
        ('high', 'High - Should Fix'),
        ('critical', 'Critical - Must Fix')
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed')
    ]
    
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='validation_issues')
    
    # Issue details
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPES)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    
    # Related data
    data_category = models.CharField(max_length=20, choices=[
        ('academic', 'Academic'),
        ('psychological', 'Psychological'),
        ('physical', 'Physical')
    ])
    
    field_name = models.CharField(max_length=100)
    current_value = models.TextField(blank=True)
    suggested_value = models.TextField(blank=True)
    
    # Description and resolution
    description = models.TextField()
    resolution_notes = models.TextField(blank=True)
    
    # Related objects
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['severity', '-created_at']
    
    def __str__(self):
        return f"{self.student.get_full_name()} - {self.issue_type} ({self.severity})"

class YearwiseDataSummary(models.Model):
    """Summary of student data for each academic year"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='yearly_summaries')
    academic_year = models.CharField(max_length=20)
    
    # Data completeness
    academic_data_count = models.PositiveIntegerField(default=0)
    psychological_data_count = models.PositiveIntegerField(default=0)
    physical_data_count = models.PositiveIntegerField(default=0)
    
    # Academic summary
    overall_academic_average = models.FloatField(null=True, blank=True)
    best_subjects = models.JSONField(default=list)
    improvement_needed_subjects = models.JSONField(default=list)
    attendance_average = models.FloatField(null=True, blank=True)
    
    # Psychological summary
    stress_level_average = models.FloatField(null=True, blank=True)
    emotional_wellbeing_score = models.FloatField(null=True, blank=True)
    social_skills_score = models.FloatField(null=True, blank=True)
    
    # Physical summary
    fitness_level = models.FloatField(null=True, blank=True)
    health_indicators = models.JSONField(default=dict)
    activity_level = models.FloatField(null=True, blank=True)
    
    # EPR scores for the year
    annual_epr_score = models.FloatField(null=True, blank=True)
    epr_performance_band = models.CharField(max_length=20, blank=True)
    
    # Trends and insights
    improvement_trends = models.JSONField(default=dict)
    areas_of_concern = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['student', 'academic_year']
        ordering = ['-academic_year']
    
    def __str__(self):
        return f"{self.student.get_full_name()} - Summary {self.academic_year}"
