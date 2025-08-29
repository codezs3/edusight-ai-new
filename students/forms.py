"""
Django forms for the students app.
Contains forms for User, Student, School, Parent, Teacher, and other models.
"""

from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date
import json

from .models import Student, School, Parent, Teacher, Counselor, Attendance

User = get_user_model()


class UserForm(forms.ModelForm):
    """Form for User model."""
    
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter password'
        }),
        required=False,
        help_text='Leave blank to keep current password (for editing)'
    )
    
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirm password'
        }),
        required=False,
        help_text='Enter the same password as above for verification'
    )
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone', 
                 'address', 'profile_image', 'password']
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter username'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter email address'
            }),
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter first name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter last name'
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter phone number'
            }),
            'address': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter address',
                'rows': 3
            }),
            'profile_image': forms.FileInput(attrs={
                'class': 'form-control'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make password required only for new users
        if not self.instance.pk:
            self.fields['password'].required = True
            self.fields['confirm_password'].required = True
    
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        
        # Only validate passwords if provided (for new users or password changes)
        if password or confirm_password:
            if password != confirm_password:
                raise ValidationError("Passwords do not match.")
            
            if len(password) < 8:
                raise ValidationError("Password must be at least 8 characters long.")
        
        return cleaned_data
    
    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password')
        
        if password:
            user.set_password(password)
        
        if commit:
            user.save()
        return user


class StudentForm(forms.ModelForm):
    """Form for Student model."""
    
    # Custom fields for better UX
    medical_conditions_text = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Enter medical conditions (one per line)',
            'rows': 3
        }),
        required=False,
        help_text='Enter each medical condition on a separate line'
    )
    
    strengths_text = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Enter strengths (one per line)',
            'rows': 3
        }),
        required=False,
        help_text='Enter each strength on a separate line'
    )
    
    weaknesses_text = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Enter weaknesses (one per line)',
            'rows': 3
        }),
        required=False,
        help_text='Enter each weakness on a separate line'
    )
    
    interests_text = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Enter interests (one per line)',
            'rows': 3
        }),
        required=False,
        help_text='Enter each interest on a separate line'
    )
    
    class Meta:
        model = Student
        fields = ['school', 'grade', 'section', 'roll_number', 'admission_date',
                 'parent', 'date_of_birth', 'gender', 'blood_group', 'emergency_contact',
                 'learning_style', 'career_aspirations']
        widgets = {
            'school': forms.Select(attrs={
                'class': 'form-select'
            }),
            'grade': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., 10, KG, Nursery'
            }),
            'section': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., A, B, C'
            }),
            'roll_number': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter roll number'
            }),
            'admission_date': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'parent': forms.Select(attrs={
                'class': 'form-select'
            }),
            'date_of_birth': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'gender': forms.Select(attrs={
                'class': 'form-select'
            }),
            'blood_group': forms.Select(attrs={
                'class': 'form-select'
            }),
            'emergency_contact': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter emergency contact number'
            }),
            'learning_style': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Visual, Auditory, Kinesthetic'
            }),
            'career_aspirations': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter career aspirations and goals',
                'rows': 3
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Pre-populate text fields from JSON fields if editing
        if self.instance.pk:
            if self.instance.medical_conditions:
                self.fields['medical_conditions_text'].initial = '\n'.join(self.instance.medical_conditions)
            if self.instance.strengths:
                self.fields['strengths_text'].initial = '\n'.join(self.instance.strengths)
            if self.instance.weaknesses:
                self.fields['weaknesses_text'].initial = '\n'.join(self.instance.weaknesses)
            if self.instance.interests:
                self.fields['interests_text'].initial = '\n'.join(self.instance.interests)
        
        # Filter active schools and parents
        self.fields['school'].queryset = School.objects.filter(is_active=True).order_by('name')
        self.fields['parent'].queryset = Parent.objects.select_related('user').filter(is_active=True).order_by('user__first_name')
    
    def clean_roll_number(self):
        roll_number = self.cleaned_data.get('roll_number')
        
        # Check for uniqueness (excluding current instance)
        queryset = Student.objects.filter(roll_number=roll_number)
        if self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise ValidationError("A student with this roll number already exists.")
        
        return roll_number
    
    def clean_date_of_birth(self):
        date_of_birth = self.cleaned_data.get('date_of_birth')
        
        if date_of_birth:
            # Check if date is not in future
            if date_of_birth > date.today():
                raise ValidationError("Date of birth cannot be in the future.")
            
            # Check minimum age (e.g., 3 years old)
            age = (date.today() - date_of_birth).days / 365.25
            if age < 3:
                raise ValidationError("Student must be at least 3 years old.")
            
            # Check maximum age (e.g., 25 years old)
            if age > 25:
                raise ValidationError("Student age cannot exceed 25 years.")
        
        return date_of_birth
    
    def clean_admission_date(self):
        admission_date = self.cleaned_data.get('admission_date')
        
        if admission_date:
            # Check if admission date is not in future
            if admission_date > date.today():
                raise ValidationError("Admission date cannot be in the future.")
        
        return admission_date
    
    def save(self, commit=True):
        student = super().save(commit=False)
        
        # Convert text fields to JSON fields
        medical_conditions_text = self.cleaned_data.get('medical_conditions_text', '')
        if medical_conditions_text:
            student.medical_conditions = [condition.strip() for condition in medical_conditions_text.split('\n') if condition.strip()]
        else:
            student.medical_conditions = []
        
        strengths_text = self.cleaned_data.get('strengths_text', '')
        if strengths_text:
            student.strengths = [strength.strip() for strength in strengths_text.split('\n') if strength.strip()]
        else:
            student.strengths = []
        
        weaknesses_text = self.cleaned_data.get('weaknesses_text', '')
        if weaknesses_text:
            student.weaknesses = [weakness.strip() for weakness in weaknesses_text.split('\n') if weakness.strip()]
        else:
            student.weaknesses = []
        
        interests_text = self.cleaned_data.get('interests_text', '')
        if interests_text:
            student.interests = [interest.strip() for interest in interests_text.split('\n') if interest.strip()]
        else:
            student.interests = []
        
        if commit:
            student.save()
        return student


class SchoolForm(forms.ModelForm):
    """Form for School model."""
    
    class Meta:
        model = School
        fields = ['name', 'address', 'phone', 'email', 'principal_name',
                 'established_year', 'school_type', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter school name'
            }),
            'address': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter school address',
                'rows': 3
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter phone number'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter email address'
            }),
            'principal_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter principal name'
            }),
            'established_year': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter establishment year'
            }),
            'school_type': forms.Select(attrs={
                'class': 'form-select'
            }, choices=[
                ('CBSE', 'CBSE'),
                ('ICSE', 'ICSE'),
                ('IGCSE', 'IGCSE'),
                ('IB', 'International Baccalaureate'),
                ('State Board', 'State Board'),
                ('Other', 'Other'),
            ]),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }
    
    def clean_established_year(self):
        established_year = self.cleaned_data.get('established_year')
        
        if established_year:
            current_year = timezone.now().year
            if established_year > current_year:
                raise ValidationError("Establishment year cannot be in the future.")
            if established_year < 1800:
                raise ValidationError("Establishment year must be reasonable (after 1800).")
        
        return established_year
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        
        # Check for uniqueness (excluding current instance)
        queryset = School.objects.filter(email=email)
        if self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)
        
        if queryset.exists():
            raise ValidationError("A school with this email already exists.")
        
        return email


class ParentForm(forms.ModelForm):
    """Form for Parent model."""
    
    class Meta:
        model = Parent
        fields = ['occupation', 'annual_income', 'education_level', 'is_active']
        widgets = {
            'occupation': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter occupation'
            }),
            'annual_income': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter annual income'
            }),
            'education_level': forms.Select(attrs={
                'class': 'form-select'
            }, choices=[
                ('High School', 'High School'),
                ('Diploma', 'Diploma'),
                ('Bachelor\'s Degree', 'Bachelor\'s Degree'),
                ('Master\'s Degree', 'Master\'s Degree'),
                ('Doctorate', 'Doctorate'),
                ('Professional Degree', 'Professional Degree'),
                ('Other', 'Other'),
            ]),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }
    
    def clean_annual_income(self):
        annual_income = self.cleaned_data.get('annual_income')
        
        if annual_income is not None and annual_income < 0:
            raise ValidationError("Annual income cannot be negative.")
        
        return annual_income


class TeacherForm(forms.ModelForm):
    """Form for Teacher model."""
    
    class Meta:
        model = Teacher
        fields = ['school', 'subject_specialization', 'qualification', 'experience_years', 'is_active']
        widgets = {
            'school': forms.Select(attrs={
                'class': 'form-select'
            }),
            'subject_specialization': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter subject specialization'
            }),
            'qualification': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter qualification'
            }),
            'experience_years': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter years of experience'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['school'].queryset = School.objects.filter(is_active=True).order_by('name')
    
    def clean_experience_years(self):
        experience_years = self.cleaned_data.get('experience_years')
        
        if experience_years is not None:
            if experience_years < 0:
                raise ValidationError("Experience years cannot be negative.")
            if experience_years > 50:
                raise ValidationError("Experience years seems unrealistic (maximum 50 years).")
        
        return experience_years


class CounselorForm(forms.ModelForm):
    """Form for Counselor model."""
    
    class Meta:
        model = Counselor
        fields = ['school', 'specialization', 'license_number', 'is_active']
        widgets = {
            'school': forms.Select(attrs={
                'class': 'form-select'
            }),
            'specialization': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter specialization'
            }),
            'license_number': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter license number'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['school'].queryset = School.objects.filter(is_active=True).order_by('name')


class AttendanceForm(forms.ModelForm):
    """Form for Attendance model."""
    
    class Meta:
        model = Attendance
        fields = ['student', 'date', 'status', 'remarks']
        widgets = {
            'student': forms.Select(attrs={
                'class': 'form-select'
            }),
            'date': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'status': forms.Select(attrs={
                'class': 'form-select'
            }),
            'remarks': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Enter remarks (optional)',
                'rows': 2
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['student'].queryset = Student.objects.select_related('user').filter(is_active=True).order_by('user__first_name')
    
    def clean_date(self):
        date_value = self.cleaned_data.get('date')
        
        if date_value:
            # Don't allow future dates
            if date_value > date.today():
                raise ValidationError("Attendance date cannot be in the future.")
        
        return date_value
    
    def clean(self):
        cleaned_data = super().clean()
        student = cleaned_data.get('student')
        date_value = cleaned_data.get('date')
        
        if student and date_value:
            # Check for duplicate attendance records
            queryset = Attendance.objects.filter(student=student, date=date_value)
            if self.instance.pk:
                queryset = queryset.exclude(pk=self.instance.pk)
            
            if queryset.exists():
                raise ValidationError("Attendance record for this student on this date already exists.")
        
        return cleaned_data


class BulkAttendanceForm(forms.Form):
    """Form for bulk attendance marking."""
    
    date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        }),
        initial=date.today
    )
    
    grade = forms.CharField(
        max_length=10,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter grade (e.g., 10, KG)'
        })
    )
    
    section = forms.CharField(
        max_length=5,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter section (optional)'
        })
    )
    
    def clean_date(self):
        date_value = self.cleaned_data.get('date')
        
        if date_value and date_value > date.today():
            raise ValidationError("Attendance date cannot be in the future.")
        
        return date_value


class StudentSearchForm(forms.Form):
    """Form for student search and filtering."""
    
    search = forms.CharField(
        max_length=255,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Search by name, roll number, email...'
        })
    )
    
    grade = forms.CharField(
        max_length=10,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Filter by grade'
        })
    )
    
    school = forms.ModelChoiceField(
        queryset=School.objects.filter(is_active=True).order_by('name'),
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-select'
        })
    )
    
    status = forms.ChoiceField(
        choices=[
            ('', 'All'),
            ('active', 'Active'),
            ('inactive', 'Inactive'),
        ],
        required=False,
        widget=forms.Select(attrs={
            'class': 'form-select'
        })
    )
    
    sort_by = forms.ChoiceField(
        choices=[
            ('grade', 'Grade'),
            ('user__first_name', 'First Name'),
            ('user__last_name', 'Last Name'),
            ('roll_number', 'Roll Number'),
            ('admission_date', 'Admission Date'),
        ],
        required=False,
        initial='grade',
        widget=forms.Select(attrs={
            'class': 'form-select'
        })
    )


class DataExportForm(forms.Form):
    """Form for data export options."""
    
    EXPORT_FORMATS = [
        ('csv', 'CSV'),
        ('excel', 'Excel'),
        ('pdf', 'PDF'),
        ('json', 'JSON'),
    ]
    
    export_format = forms.ChoiceField(
        choices=EXPORT_FORMATS,
        widget=forms.Select(attrs={
            'class': 'form-select'
        })
    )
    
    include_inactive = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        }),
        help_text='Include inactive records in export'
    )
    
    date_from = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        }),
        help_text='Filter records from this date'
    )
    
    date_to = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        }),
        help_text='Filter records up to this date'
    )
    
    def clean(self):
        cleaned_data = super().clean()
        date_from = cleaned_data.get('date_from')
        date_to = cleaned_data.get('date_to')
        
        if date_from and date_to:
            if date_from > date_to:
                raise ValidationError("'From' date must be before 'To' date.")
        
        return cleaned_data
