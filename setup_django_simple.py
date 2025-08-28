#!/usr/bin/env python
"""
Django Setup Script for Edusight Analytics Platform
Simplified version without Unicode characters
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"[INFO] {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"[SUCCESS] {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def create_directories():
    """Create necessary directories."""
    directories = [
        'static',
        'media',
        'logs',
        'templates/base',
        'templates/students',
        'templates/assessments',
        'templates/analytics',
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
    
    print("[SUCCESS] Directories created successfully")

def setup_database():
    """Set up database and run migrations."""
    print("[INFO] Setting up database...")
    
    # Create migrations
    commands = [
        "python manage.py makemigrations",
        "python manage.py makemigrations students",
        "python manage.py makemigrations assessments", 
        "python manage.py makemigrations data_analytics",
        "python manage.py makemigrations ml_predictions",
        "python manage.py makemigrations dashboard",
        "python manage.py migrate",
    ]
    
    for command in commands:
        if not run_command(command, f"Running {command}"):
            print(f"[WARNING] {command} failed, continuing...")

def create_superuser():
    """Create a superuser for Django admin."""
    print("[INFO] Creating superuser...")
    
    superuser_script = '''
from students.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@edusight.com', 'admin123')
    print("Superuser created: admin/admin123")
else:
    print("Superuser already exists")
'''
    
    with open('create_superuser.py', 'w', encoding='utf-8') as f:
        f.write(superuser_script)
    
    run_command("python create_superuser.py", "Creating superuser")
    os.remove('create_superuser.py')

def create_sample_data():
    """Create sample data for testing."""
    print("[INFO] Creating sample data...")
    
    sample_data_script = '''
from students.models import User, School, Student, Parent
from assessments.models import Assessment
from django.utils import timezone
from datetime import date

# Create school
school, created = School.objects.get_or_create(
    name="Edusight Demo School",
    defaults={
        'address': "123 Education Street, Demo City",
        'phone': "9876543210",
        'email': "demo@edusightschool.com",
        'principal_name': "Dr. Demo Principal",
        'established_year': 2020,
        'school_type': "CBSE"
    }
)

if created:
    print("Demo school created")

# Create admin user if not exists
admin_user, created = User.objects.get_or_create(
    username='demo_admin',
    defaults={
        'first_name': 'Demo',
        'last_name': 'Administrator',
        'email': 'demo@edusight.com',
        'role': 'admin',
        'is_staff': True,
        'is_superuser': True
    }
)
admin_user.set_password('demo123')
admin_user.save()

if created:
    print("Demo admin user created")

# Create parent
parent_user, created = User.objects.get_or_create(
    username='demo_parent',
    defaults={
        'first_name': 'Demo',
        'last_name': 'Parent',
        'email': 'parent@edusight.com',
        'role': 'parent'
    }
)
parent_user.set_password('demo123')
parent_user.save()

parent, created = Parent.objects.get_or_create(
    user=parent_user,
    defaults={
        'occupation': 'Software Engineer',
        'education_level': 'Bachelor\'s Degree'
    }
)

if created:
    print("Demo parent created")

# Create student
student_user, created = User.objects.get_or_create(
    username='demo_student',
    defaults={
        'first_name': 'Demo',
        'last_name': 'Student',
        'email': 'student@edusight.com',
        'role': 'student'
    }
)
student_user.set_password('demo123')
student_user.save()

student, created = Student.objects.get_or_create(
    user=student_user,
    defaults={
        'school': school,
        'grade': '10',
        'section': 'A',
        'roll_number': 'STU001',
        'admission_date': date(2020, 6, 1),
        'parent': parent,
        'date_of_birth': date(2006, 3, 15),
        'gender': 'M',
        'emergency_contact': '9876543210'
    }
)

if created:
    print("Demo student created")

# Create sample assessments
assessments_data = [
    {
        'title': 'CBSE Grade 10 Mathematics',
        'assessment_type': 'academic',
        'curriculum': 'CBSE',
        'grade': '10',
        'subject': 'Mathematics'
    },
    {
        'title': 'Psychological Wellbeing Assessment',
        'assessment_type': 'psychological',
        'curriculum': 'CBSE',
        'grade': '10'
    },
    {
        'title': 'Physical Fitness Assessment',
        'assessment_type': 'physical',
        'curriculum': 'CBSE',
        'grade': '10'
    },
    {
        'title': 'DMIT Brain Mapping',
        'assessment_type': 'dmit',
        'curriculum': 'CBSE',
        'grade': '10'
    }
]

for assessment_data in assessments_data:
    assessment, created = Assessment.objects.get_or_create(
        title=assessment_data['title'],
        defaults={
            **assessment_data,
            'description': f"Sample {assessment_data['assessment_type']} assessment",
            'duration_minutes': 60,
            'created_by': admin_user
        }
    )
    
    if created:
        print(f"Created assessment: {assessment.title}")

print("Sample data creation completed!")
'''
    
    with open('create_sample_data.py', 'w', encoding='utf-8') as f:
        f.write(sample_data_script)
    
    run_command("python create_sample_data.py", "Creating sample data")
    os.remove('create_sample_data.py')

def main():
    """Main setup function."""
    print("Edusight Analytics Platform - Django Setup")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path('manage.py').exists():
        print("[ERROR] manage.py not found. Please run this script from the project root directory.")
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Set up database
    setup_database()
    
    # Create superuser
    create_superuser()
    
    # Create sample data
    create_sample_data()
    
    print("\n[SUCCESS] Django setup completed successfully!")
    print("\nNext Steps:")
    print("1. Start the Django development server: python manage.py runserver")
    print("2. Access the admin panel: http://localhost:8000/admin")
    print("3. Login with: admin/admin123 or demo_admin/demo123")
    print("4. Access the dashboard: http://localhost:8000/")
    print("\nDocumentation:")
    print("- Django Admin: http://localhost:8000/admin")
    print("- API Endpoints: http://localhost:8000/api/")
    print("- Dashboard: http://localhost:8000/dashboard/")

if __name__ == "__main__":
    main()
