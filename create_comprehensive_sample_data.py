#!/usr/bin/env python
"""
Comprehensive Sample Data Generator for EduSight Platform
This script creates realistic sample data for all modules of the platform.
"""

import os
import sys
import django
from datetime import datetime, timedelta, date
import random
import json
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edusight_django.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.paginator import Paginator
from django.db import models
import django
from students.models import User, School, Student, Parent, Teacher, Counselor, Attendance, UserAnalytics
from assessments.models import Assessment, AssessmentResult
from data_analytics.models import StudentAnalytics, SchoolAnalytics, PerformanceTrend, AnalyticsReport, DashboardMetrics
from ml_predictions.models import MLPrediction, MLModel, PredictionCache
from crm.models import Lead, CallLog, Conversation, FollowUp, Appointment, FormSubmission, LeadSource

def clear_all_data():
    """Clear existing data to start fresh."""
    print("🗑️ Clearing existing data...")
    
    # Clear in dependency order
    PerformanceTrend.objects.all().delete()
    StudentAnalytics.objects.all().delete()
    SchoolAnalytics.objects.all().delete()
    AnalyticsReport.objects.all().delete()
    DashboardMetrics.objects.all().delete()
    
    MLPrediction.objects.all().delete()
    PredictionCache.objects.all().delete()
    MLModel.objects.all().delete()
    
    AssessmentResult.objects.all().delete()
    Assessment.objects.all().delete()
    
    Attendance.objects.all().delete()
    UserAnalytics.objects.all().delete()
    
    CallLog.objects.all().delete()
    Conversation.objects.all().delete()
    FollowUp.objects.all().delete()
    Appointment.objects.all().delete()
    FormSubmission.objects.all().delete()
    Lead.objects.all().delete()
    LeadSource.objects.all().delete()
    
    Student.objects.all().delete()
    Parent.objects.all().delete()
    Teacher.objects.all().delete()
    Counselor.objects.all().delete()
    School.objects.all().delete()
    
    # Clear users except superusers
    User.objects.filter(is_superuser=False).delete()
    
    print("✅ Existing data cleared.")

def create_schools():
    """Create sample schools."""
    print("🏫 Creating schools...")
    
    schools_data = [
        {
            'name': 'Delhi Public School',
            'school_type': 'CBSE',
            'address': 'Mathura Road, New Delhi, Delhi 110025',
            'phone': '+91-11-26372594',
            'email': 'info@dps.edu',
            'principal_name': 'Dr. Rajesh Kumar',
            'established_year': 1978
        },
        {
            'name': 'St. Xavier\'s High School',
            'school_type': 'ICSE',
            'address': '5 Park Street, Kolkata, West Bengal 700016',
            'phone': '+91-33-22297725',
            'email': 'principal@stxaviers.edu',
            'principal_name': 'Fr. Michael D\'Souza',
            'established_year': 1860
        },
        {
            'name': 'DAV Public School',
            'school_type': 'CBSE',
            'address': 'Sector 14, Gurgaon, Haryana 122001',
            'phone': '+91-124-2357890',
            'email': 'info@davgurgaon.com',
            'principal_name': 'Mrs. Priya Sharma',
            'established_year': 1995
        },
        {
            'name': 'Cambridge International School',
            'school_type': 'IGCSE',
            'address': 'Banjara Hills, Hyderabad, Telangana 500034',
            'phone': '+91-40-23456789',
            'email': 'admissions@cambridge.edu.in',
            'principal_name': 'Dr. Sarah Wilson',
            'established_year': 2005
        },
        {
            'name': 'International Baccalaureate School',
            'school_type': 'IB',
            'address': 'Whitefield, Bangalore, Karnataka 560066',
            'phone': '+91-80-28456789',
            'email': 'info@ibschool.edu.in',
            'principal_name': 'Dr. James Anderson',
            'established_year': 2010
        }
    ]
    
    schools = []
    for school_data in schools_data:
        school = School.objects.create(**school_data)
        schools.append(school)
        print(f"   ✓ Created {school.name}")
    
    return schools

def create_users_and_profiles(schools):
    """Create users and their profiles."""
    print("👥 Creating users and profiles...")
    
    # Create admin users
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
    
    # Create teachers
    teachers = []
    teacher_names = [
        ('Rajesh', 'Kumar', 'rajesh.kumar@school.edu'),
        ('Priya', 'Sharma', 'priya.sharma@school.edu'),
        ('Amit', 'Singh', 'amit.singh@school.edu'),
        ('Sunita', 'Gupta', 'sunita.gupta@school.edu'),
        ('Vikram', 'Patel', 'vikram.patel@school.edu'),
        ('Kavita', 'Reddy', 'kavita.reddy@school.edu'),
        ('Rahul', 'Agarwal', 'rahul.agarwal@school.edu'),
        ('Meera', 'Joshi', 'meera.joshi@school.edu')
    ]
    
    for i, (first_name, last_name, email) in enumerate(teacher_names):
        username = f"teacher_{i+1}"
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                email=email,
                password='teacher123',
                first_name=first_name,
                last_name=last_name,
                role='teacher',
                phone=f'+91-98765{random.randint(10000, 99999)}'
            )
            
            teacher = Teacher.objects.create(
                user=user,
                school=random.choice(schools),
                subject_specialization=['Mathematics', 'Science', 'English'][i % 3],
                qualification='M.Ed, B.Sc',
                experience_years=random.randint(2, 15)
            )
            teachers.append(teacher)
            print(f"   ✓ Created teacher: {user.first_name} {user.last_name}")
    
    # Create counselors
    counselors = []
    counselor_names = [
        ('Dr. Anjali', 'Mehta', 'anjali.mehta@counseling.com'),
        ('Dr. Rohit', 'Verma', 'rohit.verma@counseling.com'),
        ('Ms. Deepika', 'Nair', 'deepika.nair@counseling.com')
    ]
    
    for i, (first_name, last_name, email) in enumerate(counselor_names):
        username = f"counselor_{i+1}"
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                email=email,
                password='counselor123',
                first_name=first_name,
                last_name=last_name,
                role='counselor',
                phone=f'+91-98765{random.randint(10000, 99999)}'
            )
            
            counselor = Counselor.objects.create(
                user=user,
                school=random.choice(schools),
                license_number=f'LIC{2000 + i}',
                specialization=['Academic Counseling', 'Career Guidance', 'Psychological Support'][i]
            )
            counselors.append(counselor)
            print(f"   ✓ Created counselor: {user.first_name} {user.last_name}")
    
    # Create parents and students
    students = []
    parents = []
    
    student_data = [
        # Grade 1 students
        ('Aarav', 'Sharma', '1', 'A', 'M', '2017-03-15'),
        ('Diya', 'Patel', '1', 'A', 'F', '2017-07-22'),
        ('Arjun', 'Kumar', '1', 'B', 'M', '2017-05-10'),
        ('Ananya', 'Singh', '1', 'B', 'F', '2017-09-03'),
        
        # Grade 5 students
        ('Rohan', 'Gupta', '5', 'A', 'M', '2013-01-12'),
        ('Priya', 'Reddy', '5', 'A', 'F', '2013-04-18'),
        ('Karan', 'Joshi', '5', 'B', 'M', '2013-08-25'),
        ('Ishita', 'Agarwal', '5', 'B', 'F', '2013-12-07'),
        
        # Grade 8 students
        ('Aditya', 'Mehta', '8', 'A', 'M', '2010-02-14'),
        ('Shreya', 'Verma', '8', 'A', 'F', '2010-06-30'),
        ('Vivek', 'Nair', '8', 'B', 'M', '2010-10-11'),
        ('Riya', 'Bansal', '8', 'B', 'F', '2010-11-28'),
        
        # Grade 10 students
        ('Nikhil', 'Jain', '10', 'A', 'M', '2008-03-05'),
        ('Pooja', 'Yadav', '10', 'A', 'F', '2008-07-19'),
        ('Siddharth', 'Malhotra', '10', 'B', 'M', '2008-09-12'),
        ('Kavya', 'Sinha', '10', 'B', 'F', '2008-12-23'),
        
        # Grade 12 students
        ('Aryan', 'Chopra', '12', 'A', 'M', '2006-01-08'),
        ('Nisha', 'Kapoor', '12', 'A', 'F', '2006-05-15'),
        ('Rahul', 'Thakur', '12', 'B', 'M', '2006-08-20'),
        ('Simran', 'Bhatia', '12', 'B', 'F', '2006-11-02')
    ]
    
    for i, (first_name, last_name, grade, section, gender, dob_str) in enumerate(student_data):
        # Create parent
        parent_first = random.choice(['Rajesh', 'Suresh', 'Mahesh', 'Ramesh', 'Dinesh'])
        parent_last = last_name
        
        parent_username = f"parent_{i+1}"
        if not User.objects.filter(username=parent_username).exists():
            parent_user = User.objects.create_user(
                username=parent_username,
                email=f"{parent_first.lower()}.{parent_last.lower()}@parent.com",
                password='parent123',
                first_name=parent_first,
                last_name=parent_last,
                role='parent',
                phone=f'+91-98765{random.randint(10000, 99999)}'
            )
            
            parent = Parent.objects.create(
                user=parent_user,
                occupation=random.choice(['Engineer', 'Doctor', 'Teacher', 'Business', 'Government Officer']),
                annual_income=random.choice([500000, 800000, 1200000, 1500000, 2000000]),
                education_level=random.choice(['Graduate', 'Post Graduate', 'Professional'])
            )
            parents.append(parent)
            print(f"   ✓ Created parent: {parent_user.first_name} {parent_user.last_name}")
        else:
            parent = parents[i % len(parents)]
        
        # Create student
        student_username = f"student_{i+1}"
        if not User.objects.filter(username=student_username).exists():
            student_user = User.objects.create_user(
                username=student_username,
                email=f"{first_name.lower()}.{last_name.lower()}@student.com",
                password='student123',
                first_name=first_name,
                last_name=last_name,
                role='student',
                phone=f'+91-87654{random.randint(10000, 99999)}'
            )
            
            dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
            
            student = Student.objects.create(
                user=student_user,
                school=random.choice(schools),
                grade=grade,
                section=section,
                roll_number=f"{grade}{section}{str(i+1).zfill(2)}",
                admission_date=date.today() - timedelta(days=random.randint(365, 2555)),
                parent=parent,
                date_of_birth=dob,
                gender=gender,
                blood_group=random.choice(['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']),
                emergency_contact=f'+91-98765{random.randint(10000, 99999)}',
                medical_conditions=[],
                learning_style=random.choice(['Visual', 'Auditory', 'Kinesthetic']),
                strengths=['Mathematics', 'Science', 'Arts'][random.randint(0, 2)].split(),
                weaknesses=['Writing', 'Public Speaking', 'Time Management'][random.randint(0, 2)].split(),
                interests=['Sports', 'Music', 'Reading', 'Technology'][random.randint(0, 3)].split(),
                career_aspirations=random.choice([
                    'Engineer', 'Doctor', 'Teacher', 'Scientist', 'Artist', 
                    'Lawyer', 'Business Person', 'Researcher'
                ])
            )
            students.append(student)
            print(f"   ✓ Created student: {student_user.first_name} {student_user.last_name} (Grade {grade})")
    
    return students, teachers, counselors, parents

def create_assessments(schools):
    """Create sample assessments."""
    print("📝 Creating assessments...")
    
    assessments_data = [
        # Academic Assessments
        {
            'title': 'Mathematics Mid-Term Exam',
            'description': 'Comprehensive mathematics assessment covering algebra and geometry',
            'assessment_type': 'academic',
            'curriculum': 'CBSE',
            'grade': '10',
            'subject': 'Mathematics',
            'duration_minutes': 180,
            'passing_score': 40.0
        },
        {
            'title': 'Science Unit Test',
            'description': 'Physics, Chemistry and Biology unit assessment',
            'assessment_type': 'academic',
            'curriculum': 'CBSE',
            'grade': '8',
            'subject': 'Science',
            'duration_minutes': 120,
            'passing_score': 35.0
        },
        {
            'title': 'English Literature Assessment',
            'description': 'Reading comprehension and writing skills evaluation',
            'assessment_type': 'academic',
            'curriculum': 'ICSE',
            'grade': '12',
            'subject': 'English',
            'duration_minutes': 150,
            'passing_score': 40.0
        },
        
        # Psychological Assessments
        {
            'title': 'Personality Assessment Inventory',
            'description': 'Comprehensive personality and behavioral assessment',
            'assessment_type': 'psychological',
            'curriculum': None,
            'grade': 'All',
            'subject': 'Psychology',
            'duration_minutes': 60,
            'passing_score': 0.0
        },
        {
            'title': 'Learning Style Evaluation',
            'description': 'Identify optimal learning methods for each student',
            'assessment_type': 'psychological',
            'curriculum': None,
            'grade': 'All',
            'subject': 'Educational Psychology',
            'duration_minutes': 45,
            'passing_score': 0.0
        },
        {
            'title': 'Stress and Anxiety Assessment',
            'description': 'Mental health and wellbeing evaluation',
            'assessment_type': 'psychological',
            'curriculum': None,
            'grade': '8+',
            'subject': 'Mental Health',
            'duration_minutes': 30,
            'passing_score': 0.0
        },
        
        # Physical Assessments
        {
            'title': 'Physical Fitness Test',
            'description': 'Comprehensive physical health and fitness assessment',
            'assessment_type': 'physical',
            'curriculum': None,
            'grade': 'All',
            'subject': 'Physical Education',
            'duration_minutes': 90,
            'passing_score': 50.0
        },
        {
            'title': 'Health Screening Assessment',
            'description': 'General health and medical assessment',
            'assessment_type': 'physical',
            'curriculum': None,
            'grade': 'All',
            'subject': 'Health Sciences',
            'duration_minutes': 60,
            'passing_score': 0.0
        },
        
        # DMIT Assessments
        {
            'title': 'Multiple Intelligence Assessment',
            'description': 'Dermatoglyphics Multiple Intelligence Test',
            'assessment_type': 'dmit',
            'curriculum': None,
            'grade': 'All',
            'subject': 'Intelligence Mapping',
            'duration_minutes': 120,
            'passing_score': 0.0
        },
        {
            'title': 'Career Aptitude Test',
            'description': 'Career guidance and aptitude assessment',
            'assessment_type': 'career',
            'curriculum': None,
            'grade': '10+',
            'subject': 'Career Counseling',
            'duration_minutes': 75,
            'passing_score': 0.0
        }
    ]
    
    assessments = []
    # Get a teacher to be the creator
    teacher_user = User.objects.filter(role='teacher').first()
    
    for assessment_data in assessments_data:
        assessment = Assessment.objects.create(
            created_by=teacher_user,
            **assessment_data
        )
        assessments.append(assessment)
        print(f"   ✓ Created assessment: {assessment.title}")
    
    return assessments

def create_assessment_results(students, assessments):
    """Create sample assessment results."""
    print("📊 Creating assessment results...")
    
    for student in students:
        # Each student takes 3-7 assessments
        student_assessments = random.sample(assessments, random.randint(3, min(7, len(assessments))))
        
        for assessment in student_assessments:
            # Generate realistic scores based on assessment type
            if assessment.assessment_type == 'academic':
                base_score = random.uniform(45, 95)
            elif assessment.assessment_type == 'psychological':
                base_score = random.uniform(60, 85)
            elif assessment.assessment_type == 'physical':
                base_score = random.uniform(50, 90)
            else:  # dmit, wellbeing
                base_score = random.uniform(65, 85)
            
            # Add some variation based on grade
            grade_multiplier = 1.0
            if student.grade in ['1', '2', '3']:
                grade_multiplier = 0.9
            elif student.grade in ['10', '12']:
                grade_multiplier = 1.1
            
            final_score = min(100, base_score * grade_multiplier)
            
            # Create the result
            result = AssessmentResult.objects.create(
                student=student,
                assessment=assessment,
                score=Decimal(str(round(final_score, 2))),
                percentage=Decimal(str(round(final_score, 2))),
                total_questions=random.randint(15, 25),
                correct_answers=int(final_score * 0.2),
                time_taken_minutes=random.randint(
                    int(assessment.duration_minutes * 0.5),
                    assessment.duration_minutes
                ),
                completed=True,
                responses={f"q{i}": random.choice(['A', 'B', 'C', 'D']) for i in range(1, 20)},
                completed_at=timezone.now() - timedelta(days=random.randint(1, 180))
            )
            
            print(f"   ✓ {student.user.first_name} completed {assessment.title}: {final_score:.1f}%")

def create_student_analytics(students):
    """Create student analytics data."""
    print("📈 Creating student analytics...")
    
    for student in students:
        # Calculate scores based on assessment results
        results = AssessmentResult.objects.filter(student=student)
        
        academic_results = results.filter(assessment__assessment_type='academic')
        psychological_results = results.filter(assessment__assessment_type='psychological')
        physical_results = results.filter(assessment__assessment_type='physical')
        
        academic_score = academic_results.aggregate(avg=django.db.models.Avg('percentage'))['avg'] or 75.0
        psychological_score = psychological_results.aggregate(avg=django.db.models.Avg('percentage'))['avg'] or 75.0
        physical_score = physical_results.aggregate(avg=django.db.models.Avg('percentage'))['avg'] or 75.0
        
        # Create analytics record
        analytics = StudentAnalytics.objects.create(
            student=student,
            date=timezone.now().date(),
            academic_score=Decimal(str(round(float(academic_score), 2))),
            subject_performance={
                'Mathematics': round(random.uniform(60, 95), 1),
                'Science': round(random.uniform(65, 90), 1),
                'English': round(random.uniform(70, 88), 1),
                'Social Studies': round(random.uniform(68, 85), 1)
            },
            attendance_rate=Decimal(str(round(random.uniform(85, 98), 2))),
            wellbeing_score=Decimal(str(round(float(psychological_score), 2))),
            stress_level=Decimal(str(round(random.uniform(10, 40), 2))),
            emotional_health=Decimal(str(round(random.uniform(70, 95), 2))),
            fitness_score=Decimal(str(round(float(physical_score), 2))),
            physical_activity_level=Decimal(str(round(random.uniform(60, 90), 2))),
            career_readiness=Decimal(str(round(random.uniform(65, 85), 2))),
            learning_style=student.learning_style,
            risk_factors=[],
            recommendations=[
                "Maintain good study habits",
                "Continue physical activities",
                "Focus on stress management"
            ]
        )
        
        # Create performance trends
        for i in range(3):  # Reduce to 3 to avoid too much data
            start_date = timezone.now().date() - timedelta(days=(i+1)*30)
            end_date = timezone.now().date() - timedelta(days=i*30)
            
            for trend_type in ['academic', 'psychological', 'physical']:
                base_score = float(academic_score) if trend_type == 'academic' else \
                           float(psychological_score) if trend_type == 'psychological' else \
                           float(physical_score)
                
                # Add some trend variation
                initial_variation = random.uniform(-10, 10)
                final_variation = random.uniform(-10, 10)
                
                initial_value = max(0, min(100, base_score + initial_variation))
                final_value = max(0, min(100, base_score + final_variation))
                
                change_percentage = ((final_value - initial_value) / initial_value * 100) if initial_value > 0 else 0
                
                if change_percentage > 5:
                    trend_direction = 'increasing'
                elif change_percentage < -5:
                    trend_direction = 'decreasing'
                else:
                    trend_direction = 'stable'
                
                PerformanceTrend.objects.create(
                    student=student,
                    trend_type=trend_type,
                    start_date=start_date,
                    end_date=end_date,
                    initial_value=Decimal(str(round(initial_value, 2))),
                    final_value=Decimal(str(round(final_value, 2))),
                    change_percentage=Decimal(str(round(change_percentage, 2))),
                    trend_direction=trend_direction
                )
        
        print(f"   ✓ Created analytics for {student.user.first_name} {student.user.last_name}")

def create_ml_models_and_predictions(students):
    """Create ML models and predictions."""
    print("🤖 Creating ML models and predictions...")
    
    # Create ML models
    models_data = [
        {
            'name': 'Academic Performance Predictor',
            'model_type': 'performance_forecast',
            'version': '2.1',
            'description': 'Predicts future academic performance based on historical data',
            'accuracy_score': Decimal('0.89'),
            'training_data_size': 15000,
            'feature_count': 25,
            'is_active': True
        },
        {
            'name': 'Career Recommendation Engine',
            'model_type': 'career_recommendation',
            'version': '1.8',
            'description': 'Recommends suitable career paths based on interests and abilities',
            'accuracy_score': Decimal('0.82'),
            'training_data_size': 8500,
            'feature_count': 18,
            'is_active': True
        },
        {
            'name': 'Risk Assessment Model',
            'model_type': 'risk_assessment',
            'version': '1.5',
            'description': 'Identifies students at risk of academic or psychological issues',
            'accuracy_score': Decimal('0.91'),
            'training_data_size': 12000,
            'feature_count': 22,
            'is_active': True
        },
        {
            'name': 'Learning Style Analyzer',
            'model_type': 'learning_style',
            'version': '1.3',
            'description': 'Determines optimal learning methods for individual students',
            'accuracy_score': Decimal('0.78'),
            'training_data_size': 6000,
            'feature_count': 15,
            'is_active': True
        }
    ]
    
    models = []
    for model_data in models_data:
        model = MLModel.objects.create(**model_data)
        models.append(model)
        print(f"   ✓ Created ML model: {model.name}")
    
    # Create predictions for students
    prediction_types = ['performance_forecast', 'career_recommendation', 'risk_assessment', 'learning_style']
    
    for student in students:
        # Each student gets 2-4 predictions
        num_predictions = random.randint(2, 4)
        selected_types = random.sample(prediction_types, num_predictions)
        
        for pred_type in selected_types:
            model = next((m for m in models if m.model_type == pred_type), models[0])
            
            # Generate prediction data based on type
            if pred_type == 'performance_forecast':
                prediction_data = {
                    'current_average': round(random.uniform(70, 90), 2),
                    'forecast_3_months': round(random.uniform(72, 92), 2),
                    'forecast_6_months': round(random.uniform(74, 94), 2),
                    'confidence': random.choice(['High', 'Medium', 'Low']),
                    'recommendations': [
                        'Continue current study patterns',
                        'Focus on weak areas',
                        'Seek additional help if needed'
                    ]
                }
            elif pred_type == 'career_recommendation':
                careers = [
                    {'name': 'Software Engineer', 'match': random.randint(75, 95)},
                    {'name': 'Data Scientist', 'match': random.randint(70, 90)},
                    {'name': 'Teacher', 'match': random.randint(65, 85)},
                    {'name': 'Doctor', 'match': random.randint(60, 88)},
                    {'name': 'Business Analyst', 'match': random.randint(70, 92)}
                ]
                prediction_data = {
                    'top_careers': sorted(careers, key=lambda x: x['match'], reverse=True)[:3],
                    'strengths': ['Analytical thinking', 'Problem solving', 'Communication'],
                    'recommendations': ['Explore STEM fields', 'Develop programming skills', 'Consider internships']
                }
            elif pred_type == 'risk_assessment':
                prediction_data = {
                    'overall_risk': random.choice(['Low', 'Medium', 'High']),
                    'academic_risk': random.choice(['Low', 'Medium']),
                    'psychological_risk': random.choice(['Low', 'Medium']),
                    'recommendations': [
                        'Monitor academic progress',
                        'Encourage social activities',
                        'Maintain regular counseling sessions'
                    ]
                }
            else:  # learning_style
                prediction_data = {
                    'primary_style': random.choice(['Visual', 'Auditory', 'Kinesthetic']),
                    'visual_score': random.randint(20, 40),
                    'auditory_score': random.randint(15, 35),
                    'kinesthetic_score': random.randint(20, 40),
                    'recommendations': [
                        'Use visual aids for learning',
                        'Practice active listening',
                        'Incorporate hands-on activities'
                    ]
                }
            
            MLPrediction.objects.create(
                student=student,
                model=model,
                prediction_type=pred_type,
                input_data={
                    'age': 2024 - student.date_of_birth.year,
                    'grade': student.grade,
                    'gender': student.gender,
                    'school_type': student.school.school_type
                },
                prediction_result=prediction_data,
                confidence_score=Decimal(str(round(random.uniform(0.75, 0.95), 3))),
                processing_time_ms=random.randint(150, 800),
                accuracy=Decimal(str(round(random.uniform(0.75, 0.95), 3)))
            )
            
            print(f"   ✓ Generated {pred_type} prediction for {student.user.first_name}")

def create_crm_data():
    """Create CRM sample data."""
    print("💼 Creating CRM data...")
    
    # Create lead sources
    sources_data = [
        {'name': 'Website', 'description': 'Organic website traffic'},
        {'name': 'Google Ads', 'description': 'Paid search advertising'},
        {'name': 'Facebook', 'description': 'Social media marketing'},
        {'name': 'Referral', 'description': 'Word of mouth referrals'},
        {'name': 'School Events', 'description': 'Education fairs and events'},
        {'name': 'Cold Calling', 'description': 'Outbound sales calls'}
    ]
    
    sources = []
    for source_data in sources_data:
        source = LeadSource.objects.create(**source_data)
        sources.append(source)
        print(f"   ✓ Created lead source: {source.name}")
    
    # Create leads
    leads_data = [
        ('Rajesh', 'Kumar', 'rajesh.kumar@email.com', '+91-9876543210', 'Aarav Kumar', 8, 'Delhi'),
        ('Priya', 'Sharma', 'priya.sharma@email.com', '+91-9876543211', 'Diya Sharma', 12, 'Mumbai'),
        ('Amit', 'Patel', 'amit.patel@email.com', '+91-9876543212', 'Arjun Patel', 5, 'Ahmedabad'),
        ('Sunita', 'Gupta', 'sunita.gupta@email.com', '+91-9876543213', 'Ananya Gupta', 10, 'Pune'),
        ('Vikram', 'Singh', 'vikram.singh@email.com', '+91-9876543214', 'Rohan Singh', 7, 'Bangalore'),
        ('Kavita', 'Reddy', 'kavita.reddy@email.com', '+91-9876543215', 'Priya Reddy', 6, 'Hyderabad'),
        ('Rahul', 'Joshi', 'rahul.joshi@email.com', '+91-9876543216', 'Karan Joshi', 9, 'Chennai'),
        ('Meera', 'Agarwal', 'meera.agarwal@email.com', '+91-9876543217', 'Ishita Agarwal', 11, 'Kolkata'),
        ('Deepak', 'Mehta', 'deepak.mehta@email.com', '+91-9876543218', 'Aditya Mehta', 4, 'Jaipur'),
        ('Pooja', 'Verma', 'pooja.verma@email.com', '+91-9876543219', 'Shreya Verma', 3, 'Lucknow')
    ]
    
    leads = []
    admin_user = User.objects.filter(is_staff=True).first()
    
    for i, (first_name, last_name, email, phone, child_name, child_age, city) in enumerate(leads_data):
        lead = Lead.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            phone=phone,
            child_name=child_name,
            child_age=child_age,
            city=city,
            source=random.choice(sources),
            status=random.choice(['new', 'contacted', 'qualified', 'not_interested', 'converted']),
            interest_level=random.randint(1, 10),
            budget_range=random.choice(['<50000', '50000-100000', '100000-200000', '>200000']),
            preferred_contact_time=random.choice(['morning', 'afternoon', 'evening']),
            initial_notes=f"Interested in assessment services for {child_name}",
            created_by=admin_user,
            created_at=timezone.now() - timedelta(days=random.randint(1, 90))
        )
        leads.append(lead)
        print(f"   ✓ Created lead: {first_name} {last_name}")
    
    # Create follow-ups and appointments
    for lead in leads[:7]:  # Create follow-ups for first 7 leads
        FollowUp.objects.create(
            lead=lead,
            scheduled_date=timezone.now().date() + timedelta(days=random.randint(1, 30)),
            scheduled_time=timezone.now().time(),
            notes=f"Follow up call scheduled for {lead.first_name}",
            status=random.choice(['pending', 'completed', 'cancelled']),
            created_by=admin_user
        )
        print(f"   ✓ Created follow-up for {lead.first_name}")
    
    for lead in leads[:5]:  # Create appointments for first 5 leads
        Appointment.objects.create(
            lead=lead,
            scheduled_date=timezone.now().date() + timedelta(days=random.randint(1, 14)),
            scheduled_time=timezone.now().time(),
            appointment_type=random.choice(['consultation', 'assessment', 'follow_up', 'demo']),
            location=random.choice(['office', 'online', 'school']),
            notes=f"Initial consultation with {lead.first_name}",
            status=random.choice(['scheduled', 'completed', 'cancelled', 'rescheduled']),
            created_by=admin_user
        )
        print(f"   ✓ Created appointment for {lead.first_name}")
    
    # Create call logs
    for lead in leads[:8]:
        for _ in range(random.randint(1, 3)):
            CallLog.objects.create(
                lead=lead,
                call_type=random.choice(['outbound', 'inbound']),
                start_time=timezone.now() - timedelta(days=random.randint(1, 30)),
                duration_minutes=random.randint(5, 45),
                notes=f"Discussed assessment options with {lead.first_name}",
                outcome=random.choice(['interested', 'not_interested', 'callback_requested', 'appointment_scheduled']),
                created_by=admin_user
            )
        print(f"   ✓ Created call logs for {lead.first_name}")

def create_attendance_data(students):
    """Create attendance data for students."""
    print("📅 Creating attendance data...")
    
    # Create attendance for the last 30 days
    for student in students:
        for i in range(30):
            attendance_date = timezone.now().date() - timedelta(days=i)
            
            # Skip weekends
            if attendance_date.weekday() >= 5:
                continue
            
            # 95% attendance rate overall
            status = 'present' if random.random() < 0.95 else random.choice(['absent', 'late'])
            
            Attendance.objects.create(
                student=student,
                date=attendance_date,
                status=status,
                check_in_time=timezone.now().time() if status != 'absent' else None,
                notes='Regular attendance' if status == 'present' else 
                      'Sick leave' if status == 'absent' else 'Traffic delay'
            )
        
        print(f"   ✓ Created attendance records for {student.user.first_name}")

def main():
    """Main function to create all sample data."""
    print("🚀 Starting comprehensive sample data creation...")
    print("=" * 60)
    
    # Clear existing data
    clear_all_data()
    
    # Create data in dependency order
    schools = create_schools()
    students, teachers, counselors, parents = create_users_and_profiles(schools)
    assessments = create_assessments(schools)
    create_assessment_results(students, assessments)
    create_student_analytics(students)
    create_ml_models_and_predictions(students)
    create_crm_data()
    create_attendance_data(students)
    
    print("=" * 60)
    print("✅ Sample data creation completed successfully!")
    print(f"📊 Created:")
    print(f"   • {len(schools)} schools")
    print(f"   • {len(students)} students")
    print(f"   • {len(teachers)} teachers")
    print(f"   • {len(counselors)} counselors")
    print(f"   • {len(parents)} parents")
    print(f"   • {len(assessments)} assessments")
    print(f"   • {AssessmentResult.objects.count()} assessment results")
    print(f"   • {StudentAnalytics.objects.count()} student analytics records")
    print(f"   • {MLPrediction.objects.count()} ML predictions")
    print(f"   • {Lead.objects.count()} CRM leads")
    print(f"   • {Attendance.objects.count()} attendance records")
    print("\n🎉 Your EduSight platform is now populated with comprehensive sample data!")
    print("🔐 Login credentials:")
    print("   • Admin: username='admin', password='admin123'")
    print("   • Teachers: username='teacher_1' to 'teacher_8', password='teacher123'")
    print("   • Students: username='student_1' to 'student_20', password='student123'")
    print("   • Parents: username='parent_1' to 'parent_20', password='parent123'")
    print("   • Counselors: username='counselor_1' to 'counselor_3', password='counselor123'")

if __name__ == '__main__':
    main()
