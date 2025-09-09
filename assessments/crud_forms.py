"""
Comprehensive CRUD forms for all Quick Actions in EduSight.
"""

from django import forms
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from .crud_models import (
    Subject, Calendar, Exam, Progress, Curriculum, 
    Skill, Template, Maintenance
)
from .models import Assessment
from students.models import Student, School


class SubjectForm(forms.ModelForm):
    """Form for creating/editing subjects."""
    
    class Meta:
        model = Subject
        fields = [
            'name', 'code', 'description', 'curriculum', 
            'grade_levels', 'is_core', 'is_active'
        ]
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter subject name'
            }),
            'code': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., MATH101'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the subject'
            }),
            'curriculum': forms.Select(attrs={
                'class': 'form-control'
            }),
            'grade_levels': forms.SelectMultiple(attrs={
                'class': 'form-control',
                'size': 8
            }),
            'is_core': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add grade level choices
        grade_choices = [
            ('Nursery', 'Nursery'),
            ('LKG', 'LKG'),
            ('UKG', 'UKG'),
            ('Grade 1', 'Grade 1'),
            ('Grade 2', 'Grade 2'),
            ('Grade 3', 'Grade 3'),
            ('Grade 4', 'Grade 4'),
            ('Grade 5', 'Grade 5'),
            ('Grade 6', 'Grade 6'),
            ('Grade 7', 'Grade 7'),
            ('Grade 8', 'Grade 8'),
            ('Grade 9', 'Grade 9'),
            ('Grade 10', 'Grade 10'),
            ('Grade 11', 'Grade 11'),
            ('Grade 12', 'Grade 12'),
        ]
        self.fields['grade_levels'].choices = grade_choices


class CalendarForm(forms.ModelForm):
    """Form for creating/editing calendar events."""
    
    class Meta:
        model = Calendar
        fields = [
            'title', 'description', 'event_type', 'start_date', 'end_date',
            'is_all_day', 'location', 'school', 'grade', 'subject',
            'is_recurring', 'recurrence_pattern'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter event title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the event'
            }),
            'event_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'start_date': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'end_date': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'is_all_day': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'location': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter location'
            }),
            'school': forms.Select(attrs={
                'class': 'form-control'
            }),
            'grade': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Grade 10'
            }),
            'subject': forms.Select(attrs={
                'class': 'form-control'
            }),
            'is_recurring': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'recurrence_pattern': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Weekly, Monthly'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['school'].queryset = School.objects.filter(is_active=True)
        self.fields['subject'].queryset = Subject.objects.filter(is_active=True)


class ExamForm(forms.ModelForm):
    """Form for creating/editing exams."""
    
    class Meta:
        model = Exam
        fields = [
            'title', 'description', 'exam_type', 'subject', 'school',
            'grade', 'exam_date', 'duration_minutes', 'total_marks',
            'passing_marks', 'is_active'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter exam title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the exam'
            }),
            'exam_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'subject': forms.Select(attrs={
                'class': 'form-control'
            }),
            'school': forms.Select(attrs={
                'class': 'form-control'
            }),
            'grade': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Grade 10'
            }),
            'exam_date': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'duration_minutes': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'max': 480
            }),
            'total_marks': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'step': 0.01
            }),
            'passing_marks': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'step': 0.01
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['subject'].queryset = Subject.objects.filter(is_active=True)
        self.fields['school'].queryset = School.objects.filter(is_active=True)

    def clean(self):
        cleaned_data = super().clean()
        total_marks = cleaned_data.get('total_marks')
        passing_marks = cleaned_data.get('passing_marks')
        
        if total_marks and passing_marks and passing_marks > total_marks:
            raise forms.ValidationError('Passing marks cannot be greater than total marks.')
        
        return cleaned_data


class ProgressForm(forms.ModelForm):
    """Form for creating/editing progress records."""
    
    class Meta:
        model = Progress
        fields = [
            'student', 'subject', 'assessment', 'exam', 'marks_obtained',
            'total_marks', 'percentage', 'grade', 'remarks'
        ]
        widgets = {
            'student': forms.Select(attrs={
                'class': 'form-control'
            }),
            'subject': forms.Select(attrs={
                'class': 'form-control'
            }),
            'assessment': forms.Select(attrs={
                'class': 'form-control'
            }),
            'exam': forms.Select(attrs={
                'class': 'form-control'
            }),
            'marks_obtained': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'step': 0.01
            }),
            'total_marks': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 1,
                'step': 0.01
            }),
            'percentage': forms.NumberInput(attrs={
                'class': 'form-control',
                'min': 0,
                'max': 100,
                'step': 0.01
            }),
            'grade': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., A+, A, B+'
            }),
            'remarks': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Additional remarks'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['student'].queryset = Student.objects.filter(is_active=True)
        self.fields['subject'].queryset = Subject.objects.filter(is_active=True)
        self.fields['assessment'].queryset = Assessment.objects.filter(is_active=True)
        self.fields['exam'].queryset = Exam.objects.filter(is_active=True)

    def clean(self):
        cleaned_data = super().clean()
        marks_obtained = cleaned_data.get('marks_obtained')
        total_marks = cleaned_data.get('total_marks')
        percentage = cleaned_data.get('percentage')
        
        if marks_obtained and total_marks and marks_obtained > total_marks:
            raise forms.ValidationError('Marks obtained cannot be greater than total marks.')
        
        if marks_obtained and total_marks and not percentage:
            # Auto-calculate percentage
            cleaned_data['percentage'] = (marks_obtained / total_marks) * 100
        
        return cleaned_data


class CurriculumForm(forms.ModelForm):
    """Form for creating/editing curricula."""
    
    class Meta:
        model = Curriculum
        fields = [
            'name', 'code', 'curriculum_type', 'description', 
            'grade_levels', 'subjects', 'is_active'
        ]
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter curriculum name'
            }),
            'code': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., CBSE2024'
            }),
            'curriculum_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the curriculum'
            }),
            'grade_levels': forms.SelectMultiple(attrs={
                'class': 'form-control',
                'size': 8
            }),
            'subjects': forms.SelectMultiple(attrs={
                'class': 'form-control',
                'size': 10
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['subjects'].queryset = Subject.objects.filter(is_active=True)
        
        # Add grade level choices
        grade_choices = [
            ('Nursery', 'Nursery'),
            ('LKG', 'LKG'),
            ('UKG', 'UKG'),
            ('Grade 1', 'Grade 1'),
            ('Grade 2', 'Grade 2'),
            ('Grade 3', 'Grade 3'),
            ('Grade 4', 'Grade 4'),
            ('Grade 5', 'Grade 5'),
            ('Grade 6', 'Grade 6'),
            ('Grade 7', 'Grade 7'),
            ('Grade 8', 'Grade 8'),
            ('Grade 9', 'Grade 9'),
            ('Grade 10', 'Grade 10'),
            ('Grade 11', 'Grade 11'),
            ('Grade 12', 'Grade 12'),
        ]
        self.fields['grade_levels'].choices = grade_choices


class SkillForm(forms.ModelForm):
    """Form for creating/editing skills."""
    
    class Meta:
        model = Skill
        fields = [
            'name', 'code', 'description', 'category', 
            'grade_levels', 'is_core', 'is_active'
        ]
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter skill name'
            }),
            'code': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., CRIT_THINK'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the skill'
            }),
            'category': forms.Select(attrs={
                'class': 'form-control'
            }),
            'grade_levels': forms.SelectMultiple(attrs={
                'class': 'form-control',
                'size': 8
            }),
            'is_core': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Add grade level choices
        grade_choices = [
            ('Nursery', 'Nursery'),
            ('LKG', 'LKG'),
            ('UKG', 'UKG'),
            ('Grade 1', 'Grade 1'),
            ('Grade 2', 'Grade 2'),
            ('Grade 3', 'Grade 3'),
            ('Grade 4', 'Grade 4'),
            ('Grade 5', 'Grade 5'),
            ('Grade 6', 'Grade 6'),
            ('Grade 7', 'Grade 7'),
            ('Grade 8', 'Grade 8'),
            ('Grade 9', 'Grade 9'),
            ('Grade 10', 'Grade 10'),
            ('Grade 11', 'Grade 11'),
            ('Grade 12', 'Grade 12'),
        ]
        self.fields['grade_levels'].choices = grade_choices


class TemplateForm(forms.ModelForm):
    """Form for creating/editing templates."""
    
    class Meta:
        model = Template
        fields = [
            'name', 'template_type', 'description', 'content', 
            'variables', 'is_default', 'is_active'
        ]
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter template name'
            }),
            'template_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the template'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 10,
                'placeholder': 'Enter template content (HTML/JSON)'
            }),
            'variables': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Enter available variables (JSON array)'
            }),
            'is_default': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            })
        }


class MaintenanceForm(forms.ModelForm):
    """Form for creating/editing maintenance records."""
    
    class Meta:
        model = Maintenance
        fields = [
            'title', 'description', 'maintenance_type', 'status',
            'scheduled_start', 'scheduled_end', 'actual_start', 'actual_end',
            'affected_services', 'notes'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter maintenance title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the maintenance'
            }),
            'maintenance_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'status': forms.Select(attrs={
                'class': 'form-control'
            }),
            'scheduled_start': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'scheduled_end': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'actual_start': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'actual_end': forms.DateTimeInput(attrs={
                'class': 'form-control',
                'type': 'datetime-local'
            }),
            'affected_services': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'List affected services (JSON array)'
            }),
            'notes': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Additional notes'
            })
        }

    def clean(self):
        cleaned_data = super().clean()
        scheduled_start = cleaned_data.get('scheduled_start')
        scheduled_end = cleaned_data.get('scheduled_end')
        
        if scheduled_start and scheduled_end and scheduled_start >= scheduled_end:
            raise forms.ValidationError('Scheduled end time must be after start time.')
        
        return cleaned_data


# ==================== SEARCH AND FILTER FORMS ====================

class AssessmentSearchForm(forms.Form):
    """Form for searching and filtering assessments."""
    search = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search assessments...'
        })
    )
    assessment_type = forms.ChoiceField(
        choices=[('', 'All Types')] + Assessment.ASSESSMENT_TYPE_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    curriculum = forms.ChoiceField(
        choices=[('', 'All Curricula')] + Assessment.CURRICULUM_CHOICES,
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    grade = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Grade'
        })
    )
    is_active = forms.ChoiceField(
        choices=[('', 'All'), ('true', 'Active'), ('false', 'Inactive')],
        required=False,
        widget=forms.Select(attrs={'class': 'form-control'})
    )


class ProgressSearchForm(forms.Form):
    """Form for searching and filtering progress records."""
    student = forms.ModelChoiceField(
        queryset=Student.objects.filter(is_active=True),
        required=False,
        empty_label="All Students",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    subject = forms.ModelChoiceField(
        queryset=Subject.objects.filter(is_active=True),
        required=False,
        empty_label="All Subjects",
        widget=forms.Select(attrs={'class': 'form-control'})
    )
    start_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        })
    )
    end_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        })
    )
