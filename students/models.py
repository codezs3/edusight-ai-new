"""
Django models for the students app.
Contains User, Student, School, and related models for the Edusight platform.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.db.models import Avg, Count, Sum, Q
import json


class User(AbstractUser):
    """
    Extended User model for Edusight platform.
    """
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('parent', 'Parent'),
        ('counselor', 'Counselor'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    last_login_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    email_verified_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
    
    @property
    def full_name(self):
        return self.get_full_name()
    
    @property
    def initials(self):
        words = self.get_full_name().split()
        initials = ''.join(word[0].upper() for word in words)
        return initials[:2]
    
    def get_analytics_summary(self):
        """Get user analytics summary."""
        from .models import UserAnalytics
        return UserAnalytics.objects.filter(user=self).aggregate(
            total_activities=Count('id'),
            avg_performance=Avg('performance_score'),
            last_activity=models.Max('created_at')
        )
    
    def get_performance_trend(self, days=30):
        """Get performance trend over specified days."""
        from .models import UserAnalytics
        return UserAnalytics.objects.filter(
            user=self,
            created_at__gte=timezone.now() - timezone.timedelta(days=days)
        ).order_by('created_at').values_list('performance_score', 'created_at')


class School(models.Model):
    """
    School model for managing educational institutions.
    """
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    principal_name = models.CharField(max_length=255)
    established_year = models.IntegerField()
    school_type = models.CharField(max_length=50)  # CBSE, ICSE, IGCSE, IB
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'schools'
        verbose_name = 'School'
        verbose_name_plural = 'Schools'
    
    def __str__(self):
        return self.name
    
    def get_student_count(self):
        return self.students.count()
    
    def get_teacher_count(self):
        return self.teachers.count()


class Student(models.Model):
    """
    Student model for managing student information and analytics.
    """
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='students')
    grade = models.CharField(max_length=10)  # Nursery, KG, 1, 2, ..., 12
    section = models.CharField(max_length=5)
    roll_number = models.CharField(max_length=20, unique=True)
    admission_date = models.DateField()
    parent = models.ForeignKey('Parent', on_delete=models.CASCADE, related_name='children')
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, blank=True, null=True)
    emergency_contact = models.CharField(max_length=15)
    medical_conditions = models.JSONField(default=list, blank=True)
    learning_style = models.CharField(max_length=50, blank=True, null=True)
    strengths = models.JSONField(default=list, blank=True)
    weaknesses = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)
    career_aspirations = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'students'
        verbose_name = 'Student'
        verbose_name_plural = 'Students'
        ordering = ['grade', 'section', 'roll_number']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - Grade {self.grade}{self.section}"
    
    def get_academic_performance(self, subject=None, period=30):
        """Get academic performance data."""
        from assessments.models import Assessment
        queryset = Assessment.objects.filter(
            student=self,
            assessment_type='academic',
            created_at__gte=timezone.now() - timezone.timedelta(days=period)
        )
        if subject:
            queryset = queryset.filter(subject=subject)
        return queryset.aggregate(
            avg_score=Avg('score'),
            total_assessments=Count('id'),
            highest_score=models.Max('score'),
            lowest_score=models.Min('score')
        )
    
    def get_psychological_wellbeing(self, period=30):
        """Get psychological wellbeing data."""
        from assessments.models import Assessment
        return Assessment.objects.filter(
            student=self,
            assessment_type='psychological',
            created_at__gte=timezone.now() - timezone.timedelta(days=period)
        ).aggregate(
            avg_score=Avg('score'),
            total_assessments=Count('id'),
            wellbeing_index=Avg('wellbeing_score')
        )
    
    def get_physical_health_metrics(self, period=30):
        """Get physical health metrics."""
        from assessments.models import Assessment
        return Assessment.objects.filter(
            student=self,
            assessment_type='physical',
            created_at__gte=timezone.now() - timezone.timedelta(days=period)
        ).aggregate(
            avg_score=Avg('score'),
            total_assessments=Count('id'),
            fitness_level=Avg('fitness_score')
        )
    
    def get_career_readiness_score(self):
        """Calculate career readiness score."""
        from assessments.models import Assessment
        career_assessments = Assessment.objects.filter(
            student=self,
            assessment_type='career'
        ).order_by('-created_at')[:5]
        
        if not career_assessments:
            return 0
        
        total_score = sum(assessment.score for assessment in career_assessments)
        return total_score / len(career_assessments)
    
    def get_attendance_rate(self, period=30):
        """Get attendance rate."""
        from .models import Attendance
        total_days = Attendance.objects.filter(
            student=self,
            date__gte=timezone.now().date() - timezone.timedelta(days=period)
        ).count()
        
        present_days = Attendance.objects.filter(
            student=self,
            date__gte=timezone.now().date() - timezone.timedelta(days=period),
            status='present'
        ).count()
        
        return (present_days / total_days * 100) if total_days > 0 else 0
    
    def get_ml_predictions(self):
        """Get ML predictions for this student."""
        from ml_predictions.models import MLPrediction
        return MLPrediction.objects.filter(student=self).order_by('-created_at')
    
    def get_performance_trend(self, assessment_type='academic', days=90):
        """Get performance trend over time."""
        from assessments.models import Assessment
        return Assessment.objects.filter(
            student=self,
            assessment_type=assessment_type,
            created_at__gte=timezone.now() - timezone.timedelta(days=days)
        ).order_by('created_at').values_list('score', 'created_at')
    
    def get_risk_factors(self):
        """Identify potential risk factors."""
        risk_factors = []
        
        # Academic risk
        academic_perf = self.get_academic_performance()
        if academic_perf['avg_score'] and academic_perf['avg_score'] < 40:
            risk_factors.append('Low academic performance')
        
        # Attendance risk
        attendance_rate = self.get_attendance_rate()
        if attendance_rate < 75:
            risk_factors.append('Low attendance')
        
        # Psychological risk
        psych_wellbeing = self.get_psychological_wellbeing()
        if psych_wellbeing['wellbeing_index'] and psych_wellbeing['wellbeing_index'] < 50:
            risk_factors.append('Psychological concerns')
        
        return risk_factors
    
    def get_recommendations(self):
        """Get personalized recommendations."""
        recommendations = []
        risk_factors = self.get_risk_factors()
        
        if 'Low academic performance' in risk_factors:
            recommendations.append('Consider additional tutoring or remedial classes')
        
        if 'Low attendance' in risk_factors:
            recommendations.append('Address attendance issues with parents and counselors')
        
        if 'Psychological concerns' in risk_factors:
            recommendations.append('Schedule counseling session for mental health support')
        
        return recommendations


class Teacher(models.Model):
    """
    Teacher model for managing teacher information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='teachers')
    subject_specialization = models.CharField(max_length=100)
    qualification = models.CharField(max_length=255)
    experience_years = models.IntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'teachers'
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.subject_specialization}"


class Parent(models.Model):
    """
    Parent model for managing parent information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_profile')
    occupation = models.CharField(max_length=100)
    annual_income = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    education_level = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'parents'
        verbose_name = 'Parent'
        verbose_name_plural = 'Parents'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - Parent"


class Counselor(models.Model):
    """
    Counselor model for managing counselor information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='counselor_profile')
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='counselors')
    specialization = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'counselors'
        verbose_name = 'Counselor'
        verbose_name_plural = 'Counselors'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.specialization}"


class Attendance(models.Model):
    """
    Attendance model for tracking student attendance.
    """
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'attendance'
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
        unique_together = ['student', 'date']
    
    def __str__(self):
        return f"{self.student} - {self.date} - {self.status}"


class UserAnalytics(models.Model):
    """
    User analytics model for tracking user activities and performance.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics')
    activity_type = models.CharField(max_length=50)
    performance_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_analytics'
        verbose_name = 'User Analytics'
        verbose_name_plural = 'User Analytics'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user} - {self.activity_type} - {self.created_at.date()}"
