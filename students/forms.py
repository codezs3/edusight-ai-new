"""
Django forms for the students app.
"""

from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, Student, School, Parent, Teacher, Counselor


class UserForm(forms.ModelForm):
    """Form for creating/editing users."""
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'address', 'is_active']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'role': forms.Select(attrs={'class': 'form-control'}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class StudentForm(forms.ModelForm):
    """Form for creating/editing students."""
    
    class Meta:
        model = Student
        fields = [
            'school', 'grade', 'section', 'roll_number', 'admission_date',
            'date_of_birth', 'gender', 'blood_group', 'emergency_contact',
            'medical_conditions', 'learning_style', 'strengths', 'weaknesses',
            'interests', 'career_aspirations', 'is_active'
        ]
        widgets = {
            'school': forms.Select(attrs={'class': 'form-control'}),
            'grade': forms.TextInput(attrs={'class': 'form-control'}),
            'section': forms.TextInput(attrs={'class': 'form-control'}),
            'roll_number': forms.TextInput(attrs={'class': 'form-control'}),
            'admission_date': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'date_of_birth': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'gender': forms.Select(attrs={'class': 'form-control'}),
            'blood_group': forms.Select(attrs={'class': 'form-control'}),
            'emergency_contact': forms.TextInput(attrs={'class': 'form-control'}),
            'medical_conditions': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'learning_style': forms.TextInput(attrs={'class': 'form-control'}),
            'strengths': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'weaknesses': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'interests': forms.Textarea(attrs={'class': 'form-control', 'rows': 2}),
            'career_aspirations': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class SchoolForm(forms.ModelForm):
    """Form for creating/editing schools."""
    
    class Meta:
        model = School
        fields = [
            'name', 'address', 'phone', 'email', 'principal_name',
            'established_year', 'school_type', 'is_active'
        ]
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
            'principal_name': forms.TextInput(attrs={'class': 'form-control'}),
            'established_year': forms.NumberInput(attrs={'class': 'form-control'}),
            'school_type': forms.TextInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class ParentForm(forms.ModelForm):
    """Form for creating/editing parents."""
    
    class Meta:
        model = Parent
        fields = ['occupation', 'annual_income', 'education_level', 'is_active']
        widgets = {
            'occupation': forms.TextInput(attrs={'class': 'form-control'}),
            'annual_income': forms.NumberInput(attrs={'class': 'form-control'}),
            'education_level': forms.TextInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class TeacherForm(forms.ModelForm):
    """Form for creating/editing teachers."""
    
    class Meta:
        model = Teacher
        fields = [
            'school', 'subject_specialization', 'qualification',
            'experience_years', 'is_active'
        ]
        widgets = {
            'school': forms.Select(attrs={'class': 'form-control'}),
            'subject_specialization': forms.TextInput(attrs={'class': 'form-control'}),
            'qualification': forms.TextInput(attrs={'class': 'form-control'}),
            'experience_years': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class CounselorForm(forms.ModelForm):
    """Form for creating/editing counselors."""
    
    class Meta:
        model = Counselor
        fields = ['school', 'specialization', 'license_number', 'is_active']
        widgets = {
            'school': forms.Select(attrs={'class': 'form-control'}),
            'specialization': forms.TextInput(attrs={'class': 'form-control'}),
            'license_number': forms.TextInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }


class StudentCreateForm(forms.Form):
    """Combined form for creating a student with user account."""
    
    # User fields
    username = forms.CharField(max_length=150, widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
    first_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs={'class': 'form-control'}))
    last_name = forms.CharField(max_length=30, widget=forms.TextInput(attrs={'class': 'form-control'}))
    phone = forms.CharField(max_length=15, required=False, widget=forms.TextInput(attrs={'class': 'form-control'}))
    address = forms.CharField(required=False, widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3}))
    
    # Student fields
    school = forms.ModelChoiceField(queryset=School.objects.filter(is_active=True), widget=forms.Select(attrs={'class': 'form-control'}))
    grade = forms.CharField(max_length=10, widget=forms.TextInput(attrs={'class': 'form-control'}))
    section = forms.CharField(max_length=5, widget=forms.TextInput(attrs={'class': 'form-control'}))
    roll_number = forms.CharField(max_length=20, widget=forms.TextInput(attrs={'class': 'form-control'}))
    admission_date = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}))
    date_of_birth = forms.DateField(widget=forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}))
    gender = forms.ChoiceField(choices=Student.GENDER_CHOICES, widget=forms.Select(attrs={'class': 'form-control'}))
    blood_group = forms.ChoiceField(choices=Student.BLOOD_GROUP_CHOICES, required=False, widget=forms.Select(attrs={'class': 'form-control'}))
    emergency_contact = forms.CharField(max_length=15, widget=forms.TextInput(attrs={'class': 'form-control'}))
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("A user with this username already exists.")
        return username
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with this email already exists.")
        return email
    
    def clean_roll_number(self):
        roll_number = self.cleaned_data.get('roll_number')
        if Student.objects.filter(roll_number=roll_number).exists():
            raise forms.ValidationError("A student with this roll number already exists.")
        return roll_number