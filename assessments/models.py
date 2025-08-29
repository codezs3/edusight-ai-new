"""
Django models for the assessments app.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from students.models import Student, User


class Assessment(models.Model):
    """Assessment model for managing different types of assessments."""
    
    ASSESSMENT_TYPE_CHOICES = [
        ('academic', 'Academic Assessment'),
        ('psychological', 'Psychological Assessment'),
        ('physical', 'Physical Assessment'),
        ('career', 'Career Assessment'),
        ('dmit', 'DMIT Assessment'),
    ]
    
    CURRICULUM_CHOICES = [
        ('CBSE', 'CBSE'),
        ('ICSE', 'ICSE'),
        ('IGCSE', 'IGCSE'),
        ('IB', 'International Baccalaureate'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    assessment_type = models.CharField(max_length=20, choices=ASSESSMENT_TYPE_CHOICES)
    curriculum = models.CharField(max_length=10, choices=CURRICULUM_CHOICES, blank=True, null=True)
    grade = models.CharField(max_length=10)  # Nursery to Grade 12
    subject = models.CharField(max_length=100, blank=True, null=True)
    duration_minutes = models.IntegerField(default=60)
    passing_score = models.DecimalField(max_digits=5, decimal_places=2, default=40.0)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100.0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_assessments')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'assessments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_assessment_type_display()}"


class AssessmentResult(models.Model):
    """Assessment result model for storing student assessment results."""
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='assessment_results')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='results')
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    total_questions = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    time_taken_minutes = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    # Additional scores for different assessment types
    wellbeing_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    fitness_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    career_readiness_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    
    # Detailed responses
    responses = models.JSONField(default=dict, blank=True)
    analysis_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'assessment_results'
        ordering = ['-completed_at', '-started_at']
    
    def __str__(self):
        return f"{self.student} - {self.assessment.title} - {self.score}%"
    
    def save(self, *args, **kwargs):
        if self.score and self.assessment.max_score:
            from decimal import Decimal
            self.percentage = (self.score / Decimal(str(self.assessment.max_score))) * 100
        super().save(*args, **kwargs)
    
    def get_performance_level(self):
        """Get performance level based on percentage."""
        if self.percentage >= 90:
            return 'Excellent'
        elif self.percentage >= 80:
            return 'Very Good'
        elif self.percentage >= 70:
            return 'Good'
        elif self.percentage >= 60:
            return 'Average'
        elif self.percentage >= 50:
            return 'Below Average'
        else:
            return 'Needs Improvement'
