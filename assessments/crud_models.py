"""
Additional models for comprehensive CRUD operations in EduSight.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from students.models import Student, School

User = get_user_model()


class Subject(models.Model):
    """Subject model for managing academic subjects."""
    
    CURRICULUM_CHOICES = [
        ('CBSE', 'CBSE'),
        ('ICSE', 'ICSE'),
        ('IGCSE', 'IGCSE'),
        ('IB', 'International Baccalaureate'),
    ]
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    description = models.TextField(blank=True)
    curriculum = models.CharField(max_length=10, choices=CURRICULUM_CHOICES)
    grade_levels = models.JSONField(default=list)  # List of applicable grades
    is_core = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'subjects'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.curriculum})"


class Calendar(models.Model):
    """Calendar model for managing academic calendar events."""
    
    EVENT_TYPE_CHOICES = [
        ('academic', 'Academic Event'),
        ('assessment', 'Assessment'),
        ('holiday', 'Holiday'),
        ('exam', 'Examination'),
        ('meeting', 'Meeting'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_all_day = models.BooleanField(default=False)
    location = models.CharField(max_length=200, blank=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)
    grade = models.CharField(max_length=10, blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=50, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'calendar_events'
        ordering = ['start_date']
    
    def __str__(self):
        return f"{self.title} - {self.start_date.strftime('%Y-%m-%d')}"


class Exam(models.Model):
    """Exam model for managing examinations."""
    
    EXAM_TYPE_CHOICES = [
        ('unit_test', 'Unit Test'),
        ('mid_term', 'Mid Term'),
        ('final', 'Final Exam'),
        ('board', 'Board Exam'),
        ('competitive', 'Competitive Exam'),
        ('mock', 'Mock Test'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    grade = models.CharField(max_length=10)
    exam_date = models.DateTimeField()
    duration_minutes = models.IntegerField()
    total_marks = models.DecimalField(max_digits=5, decimal_places=2)
    passing_marks = models.DecimalField(max_digits=5, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'exams'
        ordering = ['-exam_date']
    
    def __str__(self):
        return f"{self.title} - {self.subject.name} ({self.grade})"


class Progress(models.Model):
    """Progress model for tracking student progress."""
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    assessment = models.ForeignKey('Assessment', on_delete=models.CASCADE, null=True, blank=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, null=True, blank=True)
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    total_marks = models.DecimalField(max_digits=5, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5, blank=True)
    remarks = models.TextField(blank=True)
    date_recorded = models.DateTimeField(default=timezone.now)
    recorded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'progress_records'
        ordering = ['-date_recorded']
    
    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.subject.name} ({self.percentage}%)"


class Curriculum(models.Model):
    """Curriculum model for managing curriculum frameworks."""
    
    CURRICULUM_TYPE_CHOICES = [
        ('CBSE', 'CBSE'),
        ('ICSE', 'ICSE'),
        ('IGCSE', 'IGCSE'),
        ('IB', 'International Baccalaureate'),
        ('STATE', 'State Board'),
        ('CUSTOM', 'Custom'),
    ]
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    curriculum_type = models.CharField(max_length=10, choices=CURRICULUM_TYPE_CHOICES)
    description = models.TextField()
    grade_levels = models.JSONField(default=list)
    subjects = models.ManyToManyField(Subject, blank=True, related_name='curricula')
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'curricula'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.curriculum_type})"


class Skill(models.Model):
    """Skill model for managing skills and competencies."""
    
    SKILL_CATEGORY_CHOICES = [
        ('academic', 'Academic Skills'),
        ('cognitive', 'Cognitive Skills'),
        ('social', 'Social Skills'),
        ('emotional', 'Emotional Skills'),
        ('physical', 'Physical Skills'),
        ('creative', 'Creative Skills'),
        ('technical', 'Technical Skills'),
        ('leadership', 'Leadership Skills'),
    ]
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=SKILL_CATEGORY_CHOICES)
    grade_levels = models.JSONField(default=list)
    is_core = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'skills'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.category})"


class Template(models.Model):
    """Template model for managing assessment and report templates."""
    
    TEMPLATE_TYPE_CHOICES = [
        ('assessment', 'Assessment Template'),
        ('report', 'Report Template'),
        ('certificate', 'Certificate Template'),
        ('letter', 'Letter Template'),
        ('form', 'Form Template'),
    ]
    
    name = models.CharField(max_length=200)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    content = models.TextField()  # HTML/JSON content
    variables = models.JSONField(default=list)  # Available variables
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'templates'
        ordering = ['template_type', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.template_type})"


class Maintenance(models.Model):
    """Maintenance model for system maintenance records."""
    
    MAINTENANCE_TYPE_CHOICES = [
        ('scheduled', 'Scheduled Maintenance'),
        ('emergency', 'Emergency Maintenance'),
        ('update', 'System Update'),
        ('backup', 'Backup'),
        ('security', 'Security Update'),
        ('performance', 'Performance Optimization'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    scheduled_start = models.DateTimeField()
    scheduled_end = models.DateTimeField()
    actual_start = models.DateTimeField(null=True, blank=True)
    actual_end = models.DateTimeField(null=True, blank=True)
    affected_services = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'maintenance_records'
        ordering = ['-scheduled_start']
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"
