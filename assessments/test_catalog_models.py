"""
Test Catalog models for managing comprehensive assessment repository.
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

User = get_user_model()


class TestCategory(models.Model):
    """Test category model for organizing assessments."""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='academic-cap')  # Heroicon name
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    parent_category = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'test_categories'
        ordering = ['sort_order', 'name']
        verbose_name_plural = 'Test Categories'
    
    def __str__(self):
        return self.name


class TestCatalog(models.Model):
    """Comprehensive test catalog model for TestVault."""
    
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    TARGET_AUDIENCE_CHOICES = [
        ('nursery', 'Nursery (2-4 years)'),
        ('pre_primary', 'Pre-Primary (4-6 years)'),
        ('primary', 'Primary (6-10 years)'),
        ('middle', 'Middle School (10-14 years)'),
        ('secondary', 'Secondary (14-16 years)'),
        ('senior_secondary', 'Senior Secondary (16-18 years)'),
        ('adult', 'Adult (18+ years)'),
        ('all_ages', 'All Ages'),
    ]
    
    ASSESSMENT_TYPE_CHOICES = [
        ('academic', 'Academic Assessment'),
        ('psychological', 'Psychological Assessment'),
        ('physical', 'Physical Assessment'),
        ('career', 'Career Assessment'),
        ('dmit', 'DMIT Assessment'),
        ('aptitude', 'Aptitude Test'),
        ('personality', 'Personality Test'),
        ('skill', 'Skill Assessment'),
        ('cognitive', 'Cognitive Assessment'),
        ('behavioral', 'Behavioral Assessment'),
    ]
    
    CURRICULUM_CHOICES = [
        ('CBSE', 'CBSE'),
        ('ICSE', 'ICSE'),
        ('IGCSE', 'IGCSE'),
        ('IB', 'International Baccalaureate'),
        ('STATE', 'State Board'),
        ('GENERAL', 'General'),
        ('INTERNATIONAL', 'International'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    short_description = models.CharField(max_length=500)
    
    # Categorization
    category = models.ForeignKey(TestCategory, on_delete=models.CASCADE)
    assessment_type = models.CharField(max_length=20, choices=ASSESSMENT_TYPE_CHOICES)
    curriculum = models.CharField(max_length=15, choices=CURRICULUM_CHOICES, default='GENERAL')
    
    # Target Audience
    target_audience = models.CharField(max_length=20, choices=TARGET_AUDIENCE_CHOICES)
    grade_levels = models.JSONField(default=list)  # List of applicable grades
    age_range_min = models.IntegerField(default=0)
    age_range_max = models.IntegerField(default=100)
    
    # Test Details
    difficulty = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES, default='intermediate')
    duration_minutes = models.IntegerField(default=60)
    total_questions = models.IntegerField(default=50)
    passing_score = models.DecimalField(max_digits=5, decimal_places=2, default=40.0)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100.0)
    
    # Pricing and Availability
    price_inr = models.DecimalField(max_digits=8, decimal_places=2, default=99.00)
    is_free = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_popular = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    
    # AI Analytics
    ai_insights = models.JSONField(default=dict, blank=True)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, default=75.0)
    average_score = models.DecimalField(max_digits=5, decimal_places=2, default=65.0)
    completion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=85.0)
    
    # Content and Media
    instructions = models.TextField(blank=True)
    prerequisites = models.TextField(blank=True)
    learning_outcomes = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    icon_name = models.CharField(max_length=50, default='academic-cap')
    cover_image_url = models.URLField(blank=True)
    
    # Statistics
    total_attempts = models.IntegerField(default=0)
    total_completions = models.IntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.0)
    total_ratings = models.IntegerField(default=0)
    
    # Status and Metadata
    is_active = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'test_catalog'
        ordering = ['-is_featured', '-is_popular', '-created_at']
        indexes = [
            models.Index(fields=['assessment_type']),
            models.Index(fields=['category']),
            models.Index(fields=['target_audience']),
            models.Index(fields=['curriculum']),
            models.Index(fields=['is_active', 'is_published']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.get_assessment_type_display()}"
    
    def get_absolute_url(self):
        return f"/testvault/{self.slug}"
    
    def get_price_display(self):
        if self.is_free:
            return "Free"
        return f"₹{self.price_inr}"
    
    def get_difficulty_color(self):
        colors = {
            'beginner': '#10B981',
            'intermediate': '#F59E0B',
            'advanced': '#EF4444',
            'expert': '#8B5CF6',
        }
        return colors.get(self.difficulty, '#6B7280')
    
    def get_rating_stars(self):
        """Get star rating display."""
        full_stars = int(self.average_rating)
        half_star = self.average_rating - full_stars >= 0.5
        empty_stars = 5 - full_stars - (1 if half_star else 0)
        return {
            'full': full_stars,
            'half': 1 if half_star else 0,
            'empty': empty_stars
        }


class TestReview(models.Model):
    """Test review model for user feedback."""
    
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    
    test = models.ForeignKey(TestCatalog, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATING_CHOICES)
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified = models.BooleanField(default=False)
    is_helpful = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'test_reviews'
        ordering = ['-created_at']
        unique_together = ['test', 'user']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.test.title} ({self.rating} stars)"


class TestAttempt(models.Model):
    """Test attempt model for tracking user test attempts."""
    
    STATUS_CHOICES = [
        ('started', 'Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
        ('expired', 'Expired'),
    ]
    
    test = models.ForeignKey(TestCatalog, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='started')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    time_taken_minutes = models.IntegerField(null=True, blank=True)
    responses = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'test_attempts'
        ordering = ['-started_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.test.title} ({self.status})"
