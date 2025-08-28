"""
Django models for ML predictions app.
"""

from django.db import models
from django.utils import timezone
from students.models import Student, User


class MLPrediction(models.Model):
    """ML prediction model for storing machine learning predictions."""
    
    PREDICTION_TYPE_CHOICES = [
        ('academic_performance', 'Academic Performance'),
        ('career_recommendation', 'Career Recommendation'),
        ('psychological_wellbeing', 'Psychological Wellbeing'),
        ('learning_style', 'Learning Style'),
        ('attendance_pattern', 'Attendance Pattern'),
        ('risk_assessment', 'Risk Assessment'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='ml_predictions')
    prediction_type = models.CharField(max_length=30, choices=PREDICTION_TYPE_CHOICES)
    input_data = models.JSONField()  # Input data used for prediction
    prediction_result = models.JSONField()  # ML prediction output
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    model_version = models.CharField(max_length=50, default='v1.0')
    processing_time_ms = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ml_predictions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student} - {self.get_prediction_type_display()} - {self.confidence_score}%"


class MLModel(models.Model):
    """ML model metadata for tracking deployed models."""
    
    MODEL_TYPE_CHOICES = [
        ('neural_network', 'Neural Network'),
        ('random_forest', 'Random Forest'),
        ('svm', 'Support Vector Machine'),
        ('linear_regression', 'Linear Regression'),
        ('logistic_regression', 'Logistic Regression'),
        ('gradient_boosting', 'Gradient Boosting'),
    ]
    
    name = models.CharField(max_length=100)
    model_type = models.CharField(max_length=20, choices=MODEL_TYPE_CHOICES)
    version = models.CharField(max_length=20)
    file_path = models.CharField(max_length=255)
    accuracy_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ml_models'
        unique_together = ['name', 'version']
    
    def __str__(self):
        return f"{self.name} v{self.version} - {self.get_model_type_display()}"


class PredictionCache(models.Model):
    """Cache for ML predictions to improve performance."""
    
    cache_key = models.CharField(max_length=255, unique=True)
    prediction_data = models.JSONField()
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'prediction_cache'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.cache_key} - Expires: {self.expires_at}"
    
    def is_expired(self):
        return timezone.now() > self.expires_at
