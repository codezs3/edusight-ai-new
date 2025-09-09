"""
Django forms for the assessments app with AI-based career mapping.
"""

from django import forms
from django.core.validators import MinValueValidator, MaxValueValidator
from .models import Assessment, AssessmentResult
from students.models import Student, School


class AssessmentForm(forms.ModelForm):
    """Form for creating/editing assessments with AI features."""
    
    class Meta:
        model = Assessment
        fields = [
            'title', 'description', 'assessment_type', 'curriculum', 
            'grade', 'subject', 'duration_minutes', 'passing_score', 
            'max_score', 'is_active'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter assessment title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Describe the assessment purpose and content'
            }),
            'assessment_type': forms.Select(attrs={
                'class': 'form-control',
                'id': 'assessment-type'
            }),
            'curriculum': forms.Select(attrs={
                'class': 'form-control',
                'id': 'curriculum'
            }),
            'grade': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Grade 10, Class 5'
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Mathematics, Science'
            }),
            'duration_minutes': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'max': 300
            }),
            'passing_score': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'max': 100,
                'step': 0.1
            }),
            'max_score': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'max': 1000,
                'step': 0.1
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }


class AssessmentResultForm(forms.ModelForm):
    """Form for assessment results with AI analysis."""
    
    class Meta:
        model = AssessmentResult
        fields = [
            'student', 'assessment', 'score', 'total_questions', 
            'correct_answers', 'time_taken_minutes', 'completed',
            'wellbeing_score', 'fitness_score', 'career_readiness_score',
            'responses', 'analysis_data'
        ]
        widgets = {
            'student': forms.Select(attrs={'class': 'form-control'}),
            'assessment': forms.Select(attrs={'class': 'form-control'}),
            'score': forms.NumberInput(attrs={
                'class': 'form-control',
                'step': 0.1
            }),
            'total_questions': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1
            }),
            'correct_answers': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0
            }),
            'time_taken_minutes': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0
            }),
            'completed': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'wellbeing_score': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'max': 100,
                'step': 0.1
            }),
            'fitness_score': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'max': 100,
                'step': 0.1
            }),
            'career_readiness_score': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'max': 100,
                'step': 0.1
            }),
            'responses': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 6,
                'placeholder': 'JSON format responses'
            }),
            'analysis_data': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 6,
                'placeholder': 'AI analysis data in JSON format'
            }),
        }


class GuestAssessmentForm(forms.Form):
    """Form for guest assessment without registration."""
    
    # Student Information
    student_name = forms.CharField(
        max_length=255,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter student name'
        })
    )
    
    student_age = forms.IntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(18)],
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'min': 3,
            'max': 18
        })
    )
    
    student_grade = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'e.g., Grade 10, Class 5'
        })
    )
    
    # Contact Information
    parent_name = forms.CharField(
        max_length=255,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Parent/Guardian name'
        })
    )
    
    parent_email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'parent@example.com'
        })
    )
    
    parent_phone = forms.CharField(
        max_length=15,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': '+91 9876543210'
        })
    )
    
    # Assessment Preferences
    assessment_type = forms.ChoiceField(
        choices=[
            ('comprehensive', 'Comprehensive Assessment (Academic + Psychological + Physical)'),
            ('academic_only', 'Academic Assessment Only'),
            ('career_focused', 'Career-Focused Assessment'),
            ('custom', 'Custom Assessment')
        ],
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
    
    curriculum = forms.ChoiceField(
        choices=[
            ('CBSE', 'CBSE'),
            ('ICSE', 'ICSE'),
            ('IGCSE', 'IGCSE'),
            ('IB', 'International Baccalaureate'),
            ('STATE', 'State Board'),
            ('OTHER', 'Other')
        ],
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
    
    # Additional Information
    special_requirements = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'Any special requirements or notes...'
        })
    )
    
    consent_data_processing = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        })
    )
    
    consent_career_mapping = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        })
    )


class CareerMappingForm(forms.Form):
    """Form for career mapping and recommendations."""
    
    # Academic Performance
    academic_strengths = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'List academic strengths and subjects of interest'
        })
    )
    
    academic_weaknesses = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'Areas that need improvement'
        })
    )
    
    # Interests and Hobbies
    interests = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 3,
            'placeholder': 'Hobbies, interests, and activities'
        })
    )
    
    # Career Preferences
    preferred_career_fields = forms.MultipleChoiceField(
        choices=[
            ('STEM', 'Science, Technology, Engineering, Mathematics'),
            ('MEDICAL', 'Medical and Healthcare'),
            ('BUSINESS', 'Business and Management'),
            ('ARTS', 'Arts and Creative Fields'),
            ('SPORTS', 'Sports and Physical Education'),
            ('SOCIAL', 'Social Work and Community Service'),
            ('LAW', 'Law and Legal Services'),
            ('EDUCATION', 'Education and Teaching'),
            ('MEDIA', 'Media and Communication'),
            ('FINANCE', 'Finance and Banking'),
            ('OTHER', 'Other')
        ],
        widget=forms.CheckboxSelectMultiple(attrs={
            'class': 'form-check-input'
        })
    )
    
    # Personality Traits
    personality_type = forms.ChoiceField(
        choices=[
            ('EXTROVERT', 'Extrovert - Outgoing and social'),
            ('INTROVERT', 'Introvert - Reserved and thoughtful'),
            ('AMBIVERT', 'Ambivert - Balanced between both'),
            ('UNKNOWN', 'Not sure')
        ],
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
    
    # Work Environment Preferences
    work_environment = forms.MultipleChoiceField(
        choices=[
            ('OFFICE', 'Traditional Office Environment'),
            ('REMOTE', 'Remote/Work from Home'),
            ('FIELD', 'Field Work/Outdoor'),
            ('LAB', 'Laboratory/Research Environment'),
            ('CLASSROOM', 'Educational Environment'),
            ('CLINIC', 'Healthcare/Clinical Environment'),
            ('CREATIVE', 'Creative/Studio Environment'),
            ('TRAVEL', 'Travel-based Work')
        ],
        widget=forms.CheckboxSelectMultiple(attrs={
            'class': 'form-check-input'
        })
    )
    
    # Future Goals
    short_term_goals = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 2,
            'placeholder': 'Goals for next 2-3 years'
        })
    )
    
    long_term_goals = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 2,
            'placeholder': 'Long-term career aspirations'
        })
    )


class AIAnalysisForm(forms.Form):
    """Form for AI analysis configuration."""
    
    analysis_depth = forms.ChoiceField(
        choices=[
            ('basic', 'Basic Analysis - Quick overview'),
            ('standard', 'Standard Analysis - Detailed insights'),
            ('comprehensive', 'Comprehensive Analysis - Full AI assessment')
        ],
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
    
    include_predictions = forms.BooleanField(
        initial=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        })
    )
    
    include_career_mapping = forms.BooleanField(
        initial=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        })
    )
    
    include_risk_assessment = forms.BooleanField(
        initial=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        })
    )
    
    include_recommendations = forms.BooleanField(
        initial=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        })
    )
    
    report_format = forms.ChoiceField(
        choices=[
            ('pdf', 'PDF Report'),
            ('html', 'Interactive HTML Report'),
            ('json', 'JSON Data Export'),
            ('excel', 'Excel Spreadsheet')
        ],
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
