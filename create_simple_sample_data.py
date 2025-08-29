#!/usr/bin/env python
"""
Simple Sample Data Generator for EduSight Platform
This script creates basic sample data to get the platform working.
"""

import os
import sys
import django
from datetime import datetime, timedelta, date
import random
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edusight_django.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from students.models import User, School, Student, Parent, Teacher
from assessments.models import Assessment, AssessmentResult
from data_analytics.models import StudentAnalytics
from crm.models import Lead, LeadSource

def create_basic_data():
    """Create basic sample data."""
    print("🚀 Creating basic sample data...")
    
    # Create admin user if not exists
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@edusight.com',
            password='admin123',
            first_name='System',
            last_name='Administrator',
            role='admin'
        )
        print(f"   ✓ Created admin user: {admin.username}")
    
    # Create a sample school
    school, created = School.objects.get_or_create(
        name='Demo Public School',
        defaults={
            'address': 'Demo Address, Demo City',
            'phone': '+91-11-12345678',
            'email': 'info@demoschool.edu',
            'principal_name': 'Dr. Demo Principal',
            'established_year': 2000,
            'school_type': 'CBSE'
        }
    )
    if created:
        print(f"   ✓ Created school: {school.name}")
    
    # Create a sample teacher
    teacher_user, created = User.objects.get_or_create(
        username='teacher1',
        defaults={
            'email': 'teacher@demoschool.edu',
            'first_name': 'Demo',
            'last_name': 'Teacher',
            'role': 'teacher'
        }
    )
    if created:
        teacher_user.set_password('teacher123')
        teacher_user.save()
        
        teacher = Teacher.objects.create(
            user=teacher_user,
            school=school,
            subject_specialization='Mathematics',
            qualification='M.Sc Mathematics',
            experience_years=5
        )
        print(f"   ✓ Created teacher: {teacher_user.first_name} {teacher_user.last_name}")
    
    # Create sample parents and students
    for i in range(5):
        # Create parent
        parent_user, created = User.objects.get_or_create(
            username=f'parent{i+1}',
            defaults={
                'email': f'parent{i+1}@email.com',
                'first_name': f'Parent{i+1}',
                'last_name': 'Demo',
                'role': 'parent'
            }
        )
        if created:
            parent_user.set_password('parent123')
            parent_user.save()
            
            parent = Parent.objects.create(
                user=parent_user,
                occupation='Engineer',
                annual_income=800000,
                education_level='Graduate'
            )
            print(f"   ✓ Created parent: {parent_user.first_name}")
        else:
            parent = Parent.objects.get(user=parent_user)
        
        # Create student
        student_user, created = User.objects.get_or_create(
            username=f'student{i+1}',
            defaults={
                'email': f'student{i+1}@email.com',
                'first_name': f'Student{i+1}',
                'last_name': 'Demo',
                'role': 'student'
            }
        )
        if created:
            student_user.set_password('student123')
            student_user.save()
            
            student = Student.objects.create(
                user=student_user,
                school=school,
                grade=str(5 + i),
                section='A',
                roll_number=f'R{str(i+1).zfill(3)}',
                admission_date=date.today() - timedelta(days=365),
                parent=parent,
                date_of_birth=date.today() - timedelta(days=365*12),
                gender='M' if i % 2 == 0 else 'F',
                emergency_contact='+91-9876543210'
            )
            print(f"   ✓ Created student: {student_user.first_name} (Grade {student.grade})")
    
    # Create sample assessments
    assessment_data = [
        {
            'title': 'Mathematics Test',
            'description': 'Basic mathematics assessment',
            'assessment_type': 'academic',
            'curriculum': 'CBSE',
            'grade': '5',
            'subject': 'Mathematics',
            'duration_minutes': 60,
            'passing_score': 40.0
        },
        {
            'title': 'English Test',
            'description': 'Basic English assessment',
            'assessment_type': 'academic',
            'curriculum': 'CBSE',
            'grade': '6',
            'subject': 'English',
            'duration_minutes': 60,
            'passing_score': 40.0
        },
        {
            'title': 'Personality Assessment',
            'description': 'Basic personality test',
            'assessment_type': 'psychological',
            'curriculum': None,
            'grade': 'All',
            'subject': 'Psychology',
            'duration_minutes': 30,
            'passing_score': 0.0
        }
    ]
    
    teacher_user = User.objects.filter(role='teacher').first()
    for assess_data in assessment_data:
        assessment, created = Assessment.objects.get_or_create(
            title=assess_data['title'],
            defaults={
                **assess_data,
                'created_by': teacher_user
            }
        )
        if created:
            print(f"   ✓ Created assessment: {assessment.title}")
    
    # Create sample assessment results
    students = Student.objects.all()
    assessments = Assessment.objects.all()
    
    for student in students:
        for assessment in assessments[:2]:  # Only first 2 assessments
            result, created = AssessmentResult.objects.get_or_create(
                student=student,
                assessment=assessment,
                defaults={
                    'score': Decimal(str(random.uniform(60, 95))),
                    'percentage': Decimal(str(random.uniform(60, 95))),
                    'total_questions': 20,
                    'correct_answers': random.randint(12, 19),
                    'time_taken_minutes': random.randint(30, 60),
                    'completed': True,
                    'completed_at': timezone.now() - timedelta(days=random.randint(1, 30))
                }
            )
            if created:
                print(f"   ✓ {student.user.first_name} completed {assessment.title}")
    
    # Create basic analytics
    for student in students:
        analytics, created = StudentAnalytics.objects.get_or_create(
            student=student,
            date=timezone.now().date(),
            defaults={
                'academic_score': Decimal(str(random.uniform(70, 90))),
                'subject_performance': {
                    'Mathematics': random.uniform(70, 90),
                    'English': random.uniform(70, 90),
                    'Science': random.uniform(70, 90)
                },
                'attendance_rate': Decimal(str(random.uniform(85, 98))),
                'wellbeing_score': Decimal(str(random.uniform(70, 85))),
                'stress_level': Decimal(str(random.uniform(10, 30))),
                'emotional_health': Decimal(str(random.uniform(75, 90))),
                'fitness_score': Decimal(str(random.uniform(70, 85))),
                'physical_activity_level': Decimal(str(random.uniform(60, 80))),
                'career_readiness': Decimal(str(random.uniform(65, 80))),
                'learning_style': random.choice(['Visual', 'Auditory', 'Kinesthetic']),
                'risk_factors': [],
                'recommendations': ['Maintain good study habits', 'Keep up the good work']
            }
        )
        if created:
            print(f"   ✓ Created analytics for {student.user.first_name}")
    
    # Create sample CRM data
    lead_source, created = LeadSource.objects.get_or_create(
        name='Website',
        defaults={'description': 'Website inquiries'}
    )
    
    for i in range(3):
        lead, created = Lead.objects.get_or_create(
            email=f'lead{i+1}@email.com',
            defaults={
                'first_name': f'Lead{i+1}',
                'last_name': 'Parent',
                'phone': f'+91987654321{i}',
                'child_name': f'Child{i+1}',
                'child_age': 8 + i,
                'city': 'Demo City',
                'source': lead_source,
                'status': random.choice(['new', 'contacted', 'qualified']),
                'interested_in_academic': True,
                'initial_notes': f'Inquiry about assessment for {i+1}th child'
            }
        )
        if created:
            print(f"   ✓ Created lead: {lead.first_name} {lead.last_name}")
    
    print("✅ Basic sample data creation completed!")
    print(f"📊 Summary:")
    print(f"   • {School.objects.count()} school(s)")
    print(f"   • {Student.objects.count()} student(s)")
    print(f"   • {Teacher.objects.count()} teacher(s)")
    print(f"   • {Parent.objects.count()} parent(s)")
    print(f"   • {Assessment.objects.count()} assessment(s)")
    print(f"   • {AssessmentResult.objects.count()} assessment result(s)")
    print(f"   • {StudentAnalytics.objects.count()} analytics record(s)")
    print(f"   • {Lead.objects.count()} CRM lead(s)")
    print("\n🔐 Login credentials:")
    print("   • Admin: username='admin', password='admin123'")
    print("   • Teacher: username='teacher1', password='teacher123'")
    print("   • Students: username='student1' to 'student5', password='student123'")
    print("   • Parents: username='parent1' to 'parent5', password='parent123'")

if __name__ == '__main__':
    create_basic_data()
