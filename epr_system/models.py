from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from decimal import Decimal
import json

class EPRConfiguration(models.Model):
    """Configuration for EPR scoring weights and thresholds"""
    name = models.CharField(max_length=100, unique=True, default='default')
    
    # Domain weights (should total 100%)
    academic_weight = models.DecimalField(max_digits=5, decimal_places=2, default=40.00)
    psychological_weight = models.DecimalField(max_digits=5, decimal_places=2, default=30.00)
    physical_weight = models.DecimalField(max_digits=5, decimal_places=2, default=30.00)
    
    # Performance band thresholds
    thriving_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=85.00)
    healthy_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=70.00)
    support_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    
    # Age group settings
    age_group = models.CharField(max_length=50, default='general')
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"EPR Config: {self.name} ({self.age_group})"
    
    def get_performance_band(self, score):
        """Determine performance band based on score"""
        if score >= self.thriving_threshold:
            return 'thriving'
        elif score >= self.healthy_threshold:
            return 'healthy_progress'
        elif score >= self.support_threshold:
            return 'needs_support'
        else:
            return 'at_risk'

class AcademicAssessment(models.Model):
    """Academic performance assessment"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='academic_assessments')
    assessment_date = models.DateTimeField(default=timezone.now)
    
    # Academic metrics (0-100 scale)
    standardized_test_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    gpa_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    attendance_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    engagement_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    learning_pace_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    
    # Teacher evaluation (1-10 scale, converted to 0-100)
    teacher_evaluation = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    
    # Additional metrics
    homework_completion_rate = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    class_participation = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    
    # Calculated scores
    composite_academic_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Metadata
    assessor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conducted_academic_assessments', null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-assessment_date']
    
    def calculate_composite_score(self):
        """Calculate composite academic score"""
        scores = []
        
        # Collect available scores
        if self.standardized_test_score is not None:
            scores.append(float(self.standardized_test_score))
        if self.gpa_score is not None:
            scores.append(float(self.gpa_score))
        if self.attendance_score is not None:
            scores.append(float(self.attendance_score))
        if self.engagement_score is not None:
            scores.append(float(self.engagement_score))
        if self.learning_pace_score is not None:
            scores.append(float(self.learning_pace_score))
        if self.teacher_evaluation is not None:
            scores.append(float(self.teacher_evaluation) * 10)  # Convert to 0-100 scale
        if self.homework_completion_rate is not None:
            scores.append(float(self.homework_completion_rate))
        if self.class_participation is not None:
            scores.append(float(self.class_participation))
        
        if scores:
            self.composite_academic_score = Decimal(str(sum(scores) / len(scores)))
        else:
            self.composite_academic_score = None
        
        return self.composite_academic_score
    
    def save(self, *args, **kwargs):
        self.calculate_composite_score()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Academic Assessment - {self.student.get_full_name()} ({self.assessment_date.date()})"

class PsychologicalAssessment(models.Model):
    """Psychological well-being assessment"""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='psychological_assessments')
    assessment_date = models.DateTimeField(default=timezone.now)
    
    # SDQ (Strengths and Difficulties Questionnaire) scores
    sdq_emotional_symptoms = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    sdq_conduct_problems = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    sdq_hyperactivity = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    sdq_peer_problems = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    sdq_prosocial = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    
    # DASS-21 scores (0-42 scale each)
    dass_depression = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(42)], null=True, blank=True)
    dass_anxiety = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(42)], null=True, blank=True)
    dass_stress = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(42)], null=True, blank=True)
    
    # PERMA Profiler (1-10 scale each)
    perma_positive_emotion = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    perma_engagement = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    perma_relationships = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    perma_meaning = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    perma_achievement = models.DecimalField(max_digits=4, decimal_places=2, validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    
    # Additional psychological metrics
    self_esteem_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    social_skills_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    emotional_regulation_score = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    
    # Calculated scores
    composite_psychological_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Metadata
    assessor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conducted_psychological_assessments', null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-assessment_date']
    
    def calculate_sdq_total_difficulties(self):
        """Calculate SDQ total difficulties score"""
        scores = [self.sdq_emotional_symptoms, self.sdq_conduct_problems, 
                 self.sdq_hyperactivity, self.sdq_peer_problems]
        scores = [s for s in scores if s is not None]
        return sum(scores) if scores else None
    
    def calculate_composite_score(self):
        """Calculate composite psychological score"""
        scores = []
        
        # SDQ scoring (inverted - lower is better, so we subtract from 100)
        sdq_total = self.calculate_sdq_total_difficulties()
        if sdq_total is not None:
            sdq_score = max(0, 100 - (sdq_total * 2.5))  # Convert 0-40 scale to 0-100 (inverted)
            scores.append(sdq_score)
        
        # DASS-21 scoring (inverted - lower is better)
        if self.dass_depression is not None:
            dass_dep_score = max(0, 100 - (self.dass_depression * 100 / 42))
            scores.append(dass_dep_score)
        if self.dass_anxiety is not None:
            dass_anx_score = max(0, 100 - (self.dass_anxiety * 100 / 42))
            scores.append(dass_anx_score)
        if self.dass_stress is not None:
            dass_str_score = max(0, 100 - (self.dass_stress * 100 / 42))
            scores.append(dass_str_score)
        
        # PERMA scoring (1-10 scale converted to 0-100)
        perma_scores = [self.perma_positive_emotion, self.perma_engagement, 
                       self.perma_relationships, self.perma_meaning, self.perma_achievement]
        for perma_score in perma_scores:
            if perma_score is not None:
                scores.append(float(perma_score) * 10)  # Convert to 0-100 scale
        
        # Direct 0-100 scores
        direct_scores = [self.self_esteem_score, self.social_skills_score, self.emotional_regulation_score]
        for score in direct_scores:
            if score is not None:
                scores.append(float(score))
        
        if scores:
            self.composite_psychological_score = Decimal(str(sum(scores) / len(scores)))
        else:
            self.composite_psychological_score = None
        
        return self.composite_psychological_score
    
    def save(self, *args, **kwargs):
        self.calculate_composite_score()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Psychological Assessment - {self.student.get_full_name()} ({self.assessment_date.date()})"