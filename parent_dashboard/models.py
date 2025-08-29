from django.db import models
from django.conf import settings
from students.models import Student
import json


class UploadSession(models.Model):
    """Track file upload sessions for parents"""
    UPLOAD_TYPES = [
        ('excel', 'Excel File'),
        ('csv', 'CSV File'),
        ('image', 'Image/Document'),
        ('manual', 'Manual Entry')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Upload'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ]
    
    parent_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    upload_type = models.CharField(max_length=20, choices=UPLOAD_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file_path = models.FileField(upload_to='parent_uploads/', null=True, blank=True)
    detected_curriculum = models.CharField(max_length=100, null=True, blank=True)
    detected_semester = models.CharField(max_length=50, null=True, blank=True)
    detected_year = models.CharField(max_length=50, null=True, blank=True)
    detected_subjects = models.JSONField(default=list)
    raw_data = models.JSONField(default=dict)
    processed_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.parent_user.username} - {self.student.name} - {self.upload_type}"


class AssessmentCalculation(models.Model):
    """Store ML-based assessment calculations"""
    upload_session = models.OneToOneField(UploadSession, on_delete=models.CASCADE)
    academic_score = models.FloatField(null=True, blank=True)
    psychological_score = models.FloatField(null=True, blank=True)
    physical_score = models.FloatField(null=True, blank=True)
    overall_score = models.FloatField(null=True, blank=True)
    performance_trend = models.JSONField(default=dict)
    strength_areas = models.JSONField(default=list)
    improvement_areas = models.JSONField(default=list)
    calculated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Assessment for {self.upload_session.student.name}"


class PredictionResult(models.Model):
    """Store ML prediction results"""
    assessment = models.OneToOneField(AssessmentCalculation, on_delete=models.CASCADE)
    predicted_performance = models.JSONField(default=dict)
    confidence_scores = models.JSONField(default=dict)
    future_trends = models.JSONField(default=dict)
    risk_factors = models.JSONField(default=list)
    success_indicators = models.JSONField(default=list)
    predicted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Predictions for {self.assessment.upload_session.student.name}"


class Recommendation(models.Model):
    """AI-generated recommendations for students"""
    RECOMMENDATION_TYPES = [
        ('academic', 'Academic'),
        ('psychological', 'Psychological'),
        ('physical', 'Physical'),
        ('career', 'Career'),
        ('study_method', 'Study Method'),
        ('extracurricular', 'Extracurricular')
    ]
    
    PRIORITY_LEVELS = [
        ('high', 'High Priority'),
        ('medium', 'Medium Priority'),
        ('low', 'Low Priority')
    ]
    
    prediction = models.ForeignKey(PredictionResult, on_delete=models.CASCADE)
    recommendation_type = models.CharField(max_length=20, choices=RECOMMENDATION_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS)
    actionable_steps = models.JSONField(default=list)
    expected_outcome = models.TextField()
    timeline = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['priority', '-created_at']
    
    def __str__(self):
        return f"{self.title} for {self.prediction.assessment.upload_session.student.name}"


class CareerMapping(models.Model):
    """Career path mapping based on student assessments"""
    prediction = models.OneToOneField(PredictionResult, on_delete=models.CASCADE)
    recommended_careers = models.JSONField(default=list)
    career_match_scores = models.JSONField(default=dict)
    skill_gaps = models.JSONField(default=list)
    development_path = models.JSONField(default=dict)
    industry_trends = models.JSONField(default=dict)
    education_requirements = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Career mapping for {self.prediction.assessment.upload_session.student.name}"


class ParentFeedback(models.Model):
    """Parent feedback on recommendations and predictions"""
    FEEDBACK_TYPES = [
        ('helpful', 'Helpful'),
        ('not_helpful', 'Not Helpful'),
        ('partially_helpful', 'Partially Helpful'),
        ('inaccurate', 'Inaccurate')
    ]
    
    parent_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    recommendation = models.ForeignKey(Recommendation, on_delete=models.CASCADE, null=True, blank=True)
    prediction = models.ForeignKey(PredictionResult, on_delete=models.CASCADE, null=True, blank=True)
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    comments = models.TextField(blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Feedback from {self.parent_user.username}"
