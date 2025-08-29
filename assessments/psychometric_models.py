"""
Psychometric Assessment Models
Age-appropriate and class-wise psychometric tests for comprehensive child development evaluation
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import json

User = settings.AUTH_USER_MODEL


class AgeGroup(models.Model):
    """Age groups for psychometric test categorization"""
    name = models.CharField(max_length=50)  # Early Childhood, Elementary, Middle School, High School
    min_age = models.IntegerField()
    max_age = models.IntegerField()
    grade_range = models.CharField(max_length=50)  # "Nursery-KG", "1-3", "4-6", "7-9", "10-12"
    description = models.TextField()
    
    class Meta:
        db_table = 'psychometric_age_groups'
        ordering = ['min_age']
    
    def __str__(self):
        return f"{self.name} (Ages {self.min_age}-{self.max_age})"


class PsychometricTestCategory(models.Model):
    """Categories of psychometric tests"""
    CATEGORY_CHOICES = [
        ('cognitive', 'Cognitive Development'),
        ('emotional', 'Emotional Intelligence'),
        ('social', 'Social Skills'),
        ('behavioral', 'Behavioral Assessment'),
        ('personality', 'Personality Traits'),
        ('learning_style', 'Learning Style'),
        ('attention', 'Attention & Focus'),
        ('memory', 'Memory & Retention'),
        ('creativity', 'Creativity & Innovation'),
        ('stress', 'Stress & Anxiety'),
        ('motivation', 'Motivation & Goal Setting'),
        ('communication', 'Communication Skills'),
    ]
    
    name = models.CharField(max_length=100)
    category_type = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='fas fa-brain')
    color_code = models.CharField(max_length=7, default='#3498db')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'psychometric_test_categories'
        verbose_name_plural = 'Psychometric Test Categories'
    
    def __str__(self):
        return self.name


class PsychometricTest(models.Model):
    """Individual psychometric tests"""
    TEST_TYPES = [
        ('questionnaire', 'Questionnaire'),
        ('scenario', 'Scenario-Based'),
        ('interactive', 'Interactive Game'),
        ('observation', 'Observation-Based'),
        ('performance', 'Performance Task'),
        ('drawing', 'Drawing Assessment'),
        ('storytelling', 'Storytelling'),
        ('puzzle', 'Puzzle/Problem Solving'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.ForeignKey(PsychometricTestCategory, on_delete=models.CASCADE, related_name='tests')
    age_group = models.ForeignKey(AgeGroup, on_delete=models.CASCADE, related_name='tests')
    test_type = models.CharField(max_length=20, choices=TEST_TYPES)
    difficulty_level = models.CharField(max_length=15, choices=DIFFICULTY_LEVELS)
    
    description = models.TextField()
    instructions = models.TextField()
    duration_minutes = models.IntegerField(help_text="Expected duration in minutes")
    
    # Age-specific adaptations
    uses_pictures = models.BooleanField(default=False, help_text="Uses visual/picture elements")
    requires_reading = models.BooleanField(default=True, help_text="Requires reading ability")
    requires_writing = models.BooleanField(default=True, help_text="Requires writing ability")
    verbal_administration = models.BooleanField(default=False, help_text="Can be administered verbally")
    
    # Scoring and interpretation
    max_score = models.IntegerField(default=100)
    scoring_method = models.TextField(help_text="How to calculate scores")
    interpretation_guide = models.TextField(help_text="How to interpret results")
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_validated = models.BooleanField(default=False, help_text="Psychologically validated")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'psychometric_tests'
        ordering = ['age_group__min_age', 'category__name', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.age_group.name})"
    
    def is_suitable_for_age(self, age):
        """Check if test is suitable for given age"""
        return self.age_group.min_age <= age <= self.age_group.max_age
    
    def get_age_adaptations(self):
        """Get age-specific adaptations for this test"""
        adaptations = []
        if self.uses_pictures:
            adaptations.append("Visual/Picture-based")
        if self.verbal_administration:
            adaptations.append("Verbal administration available")
        if not self.requires_reading:
            adaptations.append("No reading required")
        if not self.requires_writing:
            adaptations.append("No writing required")
        return adaptations


class TestQuestion(models.Model):
    """Questions for psychometric tests"""
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('true_false', 'True/False'),
        ('likert_scale', 'Likert Scale'),
        ('open_ended', 'Open Ended'),
        ('scenario_choice', 'Scenario Choice'),
        ('image_selection', 'Image Selection'),
        ('drawing', 'Drawing/Creative'),
        ('ranking', 'Ranking'),
        ('matching', 'Matching'),
    ]
    
    test = models.ForeignKey(PsychometricTest, on_delete=models.CASCADE, related_name='questions')
    question_number = models.IntegerField()
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    
    # Age-appropriate content
    uses_simple_language = models.BooleanField(default=True)
    includes_image = models.ImageField(upload_to='test_images/', blank=True, null=True)
    audio_file = models.FileField(upload_to='test_audio/', blank=True, null=True)
    
    # Scoring
    correct_answer = models.TextField(blank=True, null=True)
    scoring_criteria = models.JSONField(default=dict, help_text="Scoring criteria for this question")
    points = models.IntegerField(default=1)
    
    # Options for multiple choice questions
    options = models.JSONField(default=list, help_text="Answer options for multiple choice")
    
    is_required = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'psychometric_test_questions'
        ordering = ['test', 'question_number']
        unique_together = ['test', 'question_number']
    
    def __str__(self):
        return f"{self.test.name} - Q{self.question_number}"


class TestSession(models.Model):
    """Individual test session for a student"""
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='test_sessions')
    test = models.ForeignKey(PsychometricTest, on_delete=models.CASCADE)
    
    # Session management
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='scheduled')
    scheduled_date = models.DateTimeField()
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    # Administration details
    administered_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='administered_tests')
    administration_mode = models.CharField(max_length=20, choices=[
        ('self_administered', 'Self-Administered'),
        ('supervised', 'Supervised'),
        ('guided', 'Guided'),
        ('parent_assisted', 'Parent-Assisted'),
    ], default='self_administered')
    
    # Environment and conditions
    testing_environment = models.CharField(max_length=100, default='Home')
    special_accommodations = models.TextField(blank=True, null=True)
    
    # Results
    raw_score = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    percentage_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    standardized_score = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    
    # Metadata
    session_data = models.JSONField(default=dict, help_text="Detailed session data and responses")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'psychometric_test_sessions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student} - {self.test.name} ({self.status})"
    
    def calculate_scores(self):
        """Calculate various score types for the session"""
        if self.status != 'completed':
            return None
            
        responses = TestResponse.objects.filter(session=self)
        total_points = sum(response.points_earned for response in responses)
        max_possible = sum(q.points for q in self.test.questions.all())
        
        self.raw_score = total_points
        self.percentage_score = (total_points / max_possible) * 100 if max_possible > 0 else 0
        
        # Calculate standardized score based on age group norms
        # This would typically involve statistical normalization
        self.standardized_score = self.percentage_score  # Simplified for now
        
        self.save()
        return {
            'raw_score': self.raw_score,
            'percentage_score': self.percentage_score,
            'standardized_score': self.standardized_score
        }


class TestResponse(models.Model):
    """Student responses to test questions"""
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name='responses')
    question = models.ForeignKey(TestQuestion, on_delete=models.CASCADE)
    
    # Response data
    response_text = models.TextField(blank=True, null=True)
    response_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    response_data = models.JSONField(default=dict, help_text="Complex response data")
    
    # Timing
    time_taken_seconds = models.IntegerField(blank=True, null=True)
    response_timestamp = models.DateTimeField(auto_now_add=True)
    
    # Scoring
    points_earned = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    is_correct = models.BooleanField(blank=True, null=True)
    
    class Meta:
        db_table = 'psychometric_test_responses'
        unique_together = ['session', 'question']
    
    def __str__(self):
        return f"{self.session.student} - {self.question}"


class TestRecommendation(models.Model):
    """Automatic test recommendations for students"""
    TRIGGER_TYPES = [
        ('new_student', 'New Student Registration'),
        ('age_milestone', 'Age Milestone'),
        ('grade_transition', 'Grade Transition'),
        ('performance_concern', 'Performance Concern'),
        ('parent_request', 'Parent Request'),
        ('routine_assessment', 'Routine Assessment'),
        ('behavioral_indicator', 'Behavioral Indicator'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='test_recommendations')
    recommended_test = models.ForeignKey(PsychometricTest, on_delete=models.CASCADE)
    
    # Recommendation details
    trigger_type = models.CharField(max_length=20, choices=TRIGGER_TYPES)
    priority_level = models.CharField(max_length=10, choices=PRIORITY_LEVELS)
    recommendation_reason = models.TextField()
    
    # Timing
    recommended_date = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(blank=True, null=True)
    
    # Status tracking
    is_shown_to_parent = models.BooleanField(default=False)
    parent_response = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('postponed', 'Postponed'),
    ], default='pending')
    
    parent_response_date = models.DateTimeField(blank=True, null=True)
    parent_notes = models.TextField(blank=True, null=True)
    
    # System data
    created_at = models.DateTimeField(auto_now_add=True)
    created_by_system = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'psychometric_test_recommendations'
        ordering = ['-priority_level', '-created_at']
    
    def __str__(self):
        return f"{self.student} - {self.recommended_test.name} ({self.priority_level})"
    
    def is_expired(self):
        """Check if recommendation has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False


class TestResult(models.Model):
    """Comprehensive test results and interpretations"""
    session = models.OneToOneField(TestSession, on_delete=models.CASCADE, related_name='result')
    
    # Detailed results
    category_scores = models.JSONField(default=dict, help_text="Scores by category/dimension")
    strengths = models.JSONField(default=list, help_text="Identified strengths")
    areas_for_improvement = models.JSONField(default=list, help_text="Areas needing attention")
    
    # Age-appropriate interpretations
    interpretation_summary = models.TextField()
    detailed_interpretation = models.TextField()
    recommendations = models.TextField()
    
    # Parent-friendly explanations
    parent_summary = models.TextField(help_text="Simple explanation for parents")
    suggested_activities = models.JSONField(default=list, help_text="Suggested activities to support development")
    
    # Professional insights
    professional_notes = models.TextField(blank=True, null=True)
    follow_up_recommendations = models.TextField(blank=True, null=True)
    
    # Comparison data
    peer_comparison = models.JSONField(default=dict, help_text="Comparison with age/grade peers")
    developmental_milestones = models.JSONField(default=dict, help_text="Developmental milestone tracking")
    
    # Flags and alerts
    concern_flags = models.JSONField(default=list, help_text="Areas of concern requiring attention")
    referral_recommendations = models.JSONField(default=list, help_text="Professional referral recommendations")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'psychometric_test_results'
    
    def __str__(self):
        return f"Results: {self.session.student} - {self.session.test.name}"
    
    def get_overall_development_level(self):
        """Get overall development level description"""
        if not self.category_scores:
            return "Assessment pending"
            
        avg_score = sum(self.category_scores.values()) / len(self.category_scores)
        
        if avg_score >= 85:
            return "Above Average Development"
        elif avg_score >= 70:
            return "Average Development"
        elif avg_score >= 55:
            return "Below Average Development"
        else:
            return "Needs Additional Support"
