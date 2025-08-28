"""
Django models for the data analytics app.
"""

from django.db import models
from django.utils import timezone
from students.models import Student, School, User


class StudentAnalytics(models.Model):
    """Student analytics model for tracking individual student performance metrics."""
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='student_analytics')
    date = models.DateField()
    
    # Academic metrics
    academic_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    subject_performance = models.JSONField(default=dict)  # Subject-wise scores
    attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Psychological metrics
    wellbeing_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    stress_level = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    emotional_health = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Physical metrics
    fitness_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    physical_activity_level = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Career metrics
    career_readiness = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    learning_style = models.CharField(max_length=50, blank=True, null=True)
    
    # Risk indicators
    risk_factors = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'student_analytics'
        unique_together = ['student', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.student} - {self.date} - Academic: {self.academic_score}%"


class SchoolAnalytics(models.Model):
    """School-level analytics model for aggregated school performance data."""
    
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='school_analytics')
    date = models.DateField()
    
    # Student metrics
    total_students = models.IntegerField(default=0)
    active_students = models.IntegerField(default=0)
    new_admissions = models.IntegerField(default=0)
    
    # Academic performance
    average_academic_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    academic_performance_distribution = models.JSONField(default=dict)
    subject_performance_summary = models.JSONField(default=dict)
    
    # Assessment metrics
    total_assessments = models.IntegerField(default=0)
    assessment_completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    average_assessment_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Wellbeing metrics
    average_wellbeing_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    students_at_risk = models.IntegerField(default=0)
    
    # Attendance metrics
    average_attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'school_analytics'
        unique_together = ['school', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.school.name} - {self.date} - Students: {self.total_students}"


class PerformanceTrend(models.Model):
    """Performance trend model for tracking changes over time."""
    
    TREND_TYPE_CHOICES = [
        ('academic', 'Academic Performance'),
        ('psychological', 'Psychological Wellbeing'),
        ('physical', 'Physical Health'),
        ('attendance', 'Attendance'),
        ('career', 'Career Readiness'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='performance_trends')
    trend_type = models.CharField(max_length=20, choices=TREND_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Trend data
    initial_value = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    final_value = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    change_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    trend_direction = models.CharField(max_length=10)  # 'increasing', 'decreasing', 'stable'
    
    # Data points
    data_points = models.JSONField(default=list)  # Time series data
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'performance_trends'
        ordering = ['-end_date']
    
    def __str__(self):
        return f"{self.student} - {self.get_trend_type_display()} - {self.trend_direction}"


class AnalyticsReport(models.Model):
    """Analytics report model for generating and storing reports."""
    
    REPORT_TYPE_CHOICES = [
        ('student_performance', 'Student Performance Report'),
        ('school_performance', 'School Performance Report'),
        ('assessment_analysis', 'Assessment Analysis Report'),
        ('wellbeing_report', 'Wellbeing Report'),
        ('career_guidance', 'Career Guidance Report'),
        ('risk_assessment', 'Risk Assessment Report'),
    ]
    
    report_type = models.CharField(max_length=30, choices=REPORT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    
    # Report scope
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='reports', blank=True, null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='reports', blank=True, null=True)
    
    # Report data
    report_data = models.JSONField()  # Structured report data
    charts_data = models.JSONField(default=dict)  # Chart configurations
    insights = models.JSONField(default=list)  # Key insights
    recommendations = models.JSONField(default=list)  # Recommendations
    
    # Report metadata
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generated_reports')
    generated_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'analytics_reports'
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_report_type_display()}"


class DashboardMetrics(models.Model):
    """Dashboard metrics model for real-time dashboard data."""
    
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='dashboard_metrics')
    date = models.DateField()
    
    # Key metrics
    total_students = models.IntegerField(default=0)
    active_assessments = models.IntegerField(default=0)
    completed_assessments = models.IntegerField(default=0)
    average_performance = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # Assessment type counts
    academic_assessments = models.IntegerField(default=0)
    psychological_assessments = models.IntegerField(default=0)
    physical_assessments = models.IntegerField(default=0)
    dmit_assessments = models.IntegerField(default=0)
    
    # Performance indicators
    high_performers = models.IntegerField(default=0)
    at_risk_students = models.IntegerField(default=0)
    attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    # ML predictions
    predictions_generated = models.IntegerField(default=0)
    prediction_accuracy = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'dashboard_metrics'
        unique_together = ['school', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.school.name} - {self.date} - Students: {self.total_students}"
