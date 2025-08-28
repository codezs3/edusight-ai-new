#!/usr/bin/env python
"""
Create Sample Data for Django Edusight
This script creates comprehensive sample data for the Django application
"""

import os
import sys
import django
from datetime import datetime, date, timedelta
import json
import random

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edusight_django.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from students.models import User, School, Student, Teacher, Parent, Counselor, Attendance
from assessments.models import Assessment, AssessmentResult
from data_analytics.models import StudentAnalytics, SchoolAnalytics, PerformanceTrend
from ml_predictions.models import MLPrediction, MLModel


def create_schools():
    """Create sample schools."""
    print("[INFO] Creating schools...")
    
    schools_data = [
        {
            'name': 'Delhi Public School',
            'address': 'New Delhi, India',
            'phone': '+91 11 12345678',
            'email': 'info@dps.edu',
            'principal_name': 'Dr. Rajesh Gupta',
            'established_year': 1995,
            'school_type': 'CBSE'
        },
        {
            'name': 'Modern School',
            'address': 'Delhi, India',
            'phone': '+91 11 87654321',
            'email': 'info@modernschool.edu',
            'principal_name': 'Mrs. Priya Sharma',
            'established_year': 1980,
            'school_type': 'CBSE'
        },
        {
            'name': 'Kendriya Vidyalaya',
            'address': 'Delhi, India',
            'phone': '+91 11 11223344',
            'email': 'info@kv.edu',
            'principal_name': 'Mr. Amit Kumar',
            'established_year': 1970,
            'school_type': 'CBSE'
        },
        {
            'name': 'International School',
            'address': 'Mumbai, India',
            'phone': '+91 22 99887766',
            'email': 'info@international.edu',
            'principal_name': 'Dr. Sarah Johnson',
            'established_year': 2000,
            'school_type': 'IGCSE'
        }
    ]
    
    schools = []
    for school_data in schools_data:
        school, created = School.objects.get_or_create(
            name=school_data['name'],
            defaults=school_data
        )
        schools.append(school)
        if created:
            print(f"[SUCCESS] Created school: {school_data['name']}")
        else:
            print(f"[INFO] School already exists: {school_data['name']}")
    
    return schools


def create_users():
    """Create sample users."""
    print("[INFO] Creating users...")
    
    # Admin users
    admin_users = [
        {
            'username': 'admin',
            'email': 'admin@edusight.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'password': 'admin123',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True
        }
    ]
    
    # Teacher users
    teacher_users = [
        {
            'username': 'teacher1',
            'email': 'teacher1@school.edu',
            'first_name': 'Dr. Rajesh',
            'last_name': 'Gupta',
            'password': 'teacher123',
            'role': 'teacher'
        },
        {
            'username': 'teacher2',
            'email': 'teacher2@school.edu',
            'first_name': 'Mrs. Priya',
            'last_name': 'Sharma',
            'password': 'teacher123',
            'role': 'teacher'
        },
        {
            'username': 'teacher3',
            'email': 'teacher3@school.edu',
            'first_name': 'Mr. Amit',
            'last_name': 'Kumar',
            'password': 'teacher123',
            'role': 'teacher'
        }
    ]
    
    # Student users
    student_users = [
        {
            'username': 'student1',
            'email': 'student1@school.edu',
            'first_name': 'Arjun',
            'last_name': 'Kumar',
            'password': 'student123',
            'role': 'student'
        },
        {
            'username': 'student2',
            'email': 'student2@school.edu',
            'first_name': 'Priya',
            'last_name': 'Sharma',
            'password': 'student123',
            'role': 'student'
        },
        {
            'username': 'student3',
            'email': 'student3@school.edu',
            'first_name': 'Rahul',
            'last_name': 'Singh',
            'password': 'student123',
            'role': 'student'
        },
        {
            'username': 'student4',
            'email': 'student4@school.edu',
            'first_name': 'Ananya',
            'last_name': 'Patel',
            'password': 'student123',
            'role': 'student'
        },
        {
            'username': 'student5',
            'email': 'student5@school.edu',
            'first_name': 'Vikram',
            'last_name': 'Malhotra',
            'password': 'student123',
            'role': 'student'
        }
    ]
    
    # Parent users
    parent_users = [
        {
            'username': 'parent1',
            'email': 'parent1@example.com',
            'first_name': 'Rajesh',
            'last_name': 'Kumar',
            'password': 'parent123',
            'role': 'parent'
        },
        {
            'username': 'parent2',
            'email': 'parent2@example.com',
            'first_name': 'Priya',
            'last_name': 'Sharma',
            'password': 'parent123',
            'role': 'parent'
        }
    ]
    
    # Counselor users
    counselor_users = [
        {
            'username': 'counselor1',
            'email': 'counselor1@school.edu',
            'first_name': 'Dr. Meera',
            'last_name': 'Patel',
            'password': 'counselor123',
            'role': 'counselor'
        },
        {
            'username': 'counselor2',
            'email': 'counselor2@school.edu',
            'first_name': 'Dr. Sanjay',
            'last_name': 'Verma',
            'password': 'counselor123',
            'role': 'counselor'
        }
    ]
    
    all_users = admin_users + teacher_users + student_users + parent_users + counselor_users
    created_users = {}
    
    for user_data in all_users:
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['username'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'password': make_password(user_data['password']),
                'role': user_data['role'],
                'is_staff': user_data.get('is_staff', False),
                'is_superuser': user_data.get('is_superuser', False),
                'is_active': True
            }
        )
        created_users[user_data['role']] = created_users.get(user_data['role'], []) + [user]
        
        if created:
            print(f"[SUCCESS] Created user: {user_data['email']} ({user_data['role']})")
        else:
            print(f"[INFO] User already exists: {user_data['email']}")
    
    return created_users


def create_students(users, schools, parents):
    """Create student profiles."""
    print("[INFO] Creating student profiles...")
    
    student_profiles = [
        {
            'user': users['student'][0],
            'school': schools[0],
            'parent': parents[0],
            'grade': '11',
            'section': 'A',
            'roll_number': 'STU001',
            'admission_date': date(2023, 6, 1),
            'date_of_birth': date(2006, 3, 15),
            'gender': 'M',
            'emergency_contact': '+91 98765 43210'
        },
        {
            'user': users['student'][1],
            'school': schools[0],
            'parent': parents[1],
            'grade': '12',
            'section': 'B',
            'roll_number': 'STU002',
            'admission_date': date(2022, 6, 1),
            'date_of_birth': date(2005, 7, 22),
            'gender': 'F',
            'emergency_contact': '+91 98765 43211'
        },
        {
            'user': users['student'][2],
            'school': schools[1],
            'parent': parents[0],
            'grade': '10',
            'section': 'A',
            'roll_number': 'STU003',
            'admission_date': date(2024, 6, 1),
            'date_of_birth': date(2007, 11, 8),
            'gender': 'M',
            'emergency_contact': '+91 98765 43212'
        },
        {
            'user': users['student'][3],
            'school': schools[0],
            'parent': parents[1],
            'grade': '11',
            'section': 'C',
            'roll_number': 'STU004',
            'admission_date': date(2023, 6, 1),
            'date_of_birth': date(2006, 1, 30),
            'gender': 'F',
            'emergency_contact': '+91 98765 43213'
        },
        {
            'user': users['student'][4],
            'school': schools[1],
            'parent': parents[0],
            'grade': '12',
            'section': 'A',
            'roll_number': 'STU005',
            'admission_date': date(2022, 6, 1),
            'date_of_birth': date(2005, 9, 12),
            'gender': 'M',
            'emergency_contact': '+91 98765 43214'
        }
    ]
    
    students = []
    for profile_data in student_profiles:
        student, created = Student.objects.get_or_create(
            user=profile_data['user'],
            defaults=profile_data
        )
        students.append(student)
        if created:
            print(f"[SUCCESS] Created student: {profile_data['user'].first_name} {profile_data['user'].last_name}")
        else:
            print(f"[INFO] Student already exists: {profile_data['user'].first_name} {profile_data['user'].last_name}")
    
    return students


def create_teachers(users, schools):
    """Create teacher profiles."""
    print("[INFO] Creating teacher profiles...")
    
    teacher_profiles = [
        {
            'user': users['teacher'][0],
            'school': schools[0],
            'subject_specialization': 'Mathematics',
            'qualification': 'Ph.D. in Mathematics',
            'experience_years': 8
        },
        {
            'user': users['teacher'][1],
            'school': schools[0],
            'subject_specialization': 'Physics',
            'qualification': 'M.Sc. in Physics',
            'experience_years': 5
        },
        {
            'user': users['teacher'][2],
            'school': schools[1],
            'subject_specialization': 'English',
            'qualification': 'M.A. in English Literature',
            'experience_years': 6
        }
    ]
    
    teachers = []
    for profile_data in teacher_profiles:
        teacher, created = Teacher.objects.get_or_create(
            user=profile_data['user'],
            defaults=profile_data
        )
        teachers.append(teacher)
        if created:
            print(f"[SUCCESS] Created teacher: {profile_data['user'].first_name} {profile_data['user'].last_name}")
        else:
            print(f"[INFO] Teacher already exists: {profile_data['user'].first_name} {profile_data['user'].last_name}")
    
    return teachers


def create_parents(users):
    """Create parent profiles."""
    print("[INFO] Creating parent profiles...")
    
    parent_profiles = [
        {
            'user': users['parent'][0],
            'occupation': 'Software Engineer',
            'education_level': 'Bachelor\'s Degree',
            'annual_income': 800000.00
        },
        {
            'user': users['parent'][1],
            'occupation': 'Doctor',
            'education_level': 'MBBS',
            'annual_income': 1200000.00
        }
    ]
    
    parents = []
    for profile_data in parent_profiles:
        parent, created = Parent.objects.get_or_create(
            user=profile_data['user'],
            defaults=profile_data
        )
        parents.append(parent)
        if created:
            print(f"[SUCCESS] Created parent: {profile_data['user'].first_name} {profile_data['user'].last_name}")
        else:
            print(f"[INFO] Parent already exists: {profile_data['user'].first_name} {profile_data['user'].last_name}")
    
    return parents


def create_counselors(users, schools):
    """Create counselor profiles."""
    print("[INFO] Creating counselor profiles...")
    
    counselor_profiles = [
        {
            'user': users['counselor'][0],
            'school': schools[0],
            'specialization': 'Career Counseling',
            'license_number': 'PSY001'
        },
        {
            'user': users['counselor'][1],
            'school': schools[1],
            'specialization': 'Student Wellbeing',
            'license_number': 'PSY002'
        }
    ]
    
    counselors = []
    for profile_data in counselor_profiles:
        counselor, created = Counselor.objects.get_or_create(
            user=profile_data['user'],
            defaults=profile_data
        )
        counselors.append(counselor)
        if created:
            print(f"[SUCCESS] Created counselor: {profile_data['user'].first_name} {profile_data['user'].last_name}")
        else:
            print(f"[INFO] Counselor already exists: {profile_data['user'].first_name} {profile_data['user'].last_name}")
    
    return counselors


def create_assessments(students, teachers):
    """Create sample assessments and results."""
    print("[INFO] Creating assessments and results...")
    
    assessment_types = ['academic', 'psychological', 'physical']
    subjects = ['Mathematics', 'Physics', 'English', 'Science', 'History']
    curricula = ['CBSE', 'ICSE', 'IGCSE', 'IB']
    
    assessments = []
    for i in range(20):
        assessment_type = random.choice(assessment_types)
        subject = random.choice(subjects) if assessment_type == 'academic' else 'General'
        curriculum = random.choice(curricula)
        grade = random.choice(['9', '10', '11', '12'])
        
        assessment, created = Assessment.objects.get_or_create(
            title=f'{assessment_type.title()} Assessment {i+1}',
            defaults={
                'description': f'Sample {assessment_type} assessment for {subject}',
                'assessment_type': assessment_type,
                'curriculum': curriculum,
                'grade': grade,
                'subject': subject,
                'duration_minutes': random.randint(30, 90),
                'passing_score': 40.0,
                'max_score': 100.0,
                'created_by': random.choice(teachers).user
            }
        )
        assessments.append(assessment)
        
        if created:
            print(f"[SUCCESS] Created assessment: {assessment.title}")
    
    # Create assessment results
    for assessment in assessments:
        for student in students:
            if random.random() < 0.7:  # 70% chance of taking the assessment
                percentage = random.randint(40, 95)
                
                result, created = AssessmentResult.objects.get_or_create(
                    student=student,
                    assessment=assessment,
                    defaults={
                        'score': percentage,
                        'percentage': percentage,
                        'total_questions': random.randint(10, 50),
                        'correct_answers': int((percentage / 100) * random.randint(10, 50)),
                        'time_taken_minutes': random.randint(15, 60),
                        'completed': True,
                        'completed_at': datetime.now() - timedelta(days=random.randint(1, 30)),
                        'responses': json.dumps({'sample': 'data'})
                    }
                )
                
                if created:
                    print(f"[SUCCESS] Created result: {student.user.first_name} - {assessment.title} - {percentage}%")
    
    return assessments


def create_attendance(students):
    """Create sample attendance records."""
    print("[INFO] Creating attendance records...")
    
    for student in students:
        for i in range(30):  # Last 30 days
            attendance_date = date.today() - timedelta(days=i)
            status = 'present' if random.random() > 0.1 else 'absent'  # 90% attendance rate
            
            attendance, created = Attendance.objects.get_or_create(
                student=student,
                date=attendance_date,
                defaults={'status': status}
            )
            
            if created:
                print(f"[SUCCESS] Created attendance: {student.user.first_name} - {attendance_date} - {status}")


def create_analytics(students):
    """Create sample analytics data."""
    print("[INFO] Creating analytics data...")
    
    for student in students:
        analytics, created = StudentAnalytics.objects.get_or_create(
            student=student,
            date=date.today(),
            defaults={
                'academic_score': random.randint(60, 95),
                'wellbeing_score': random.randint(65, 90),
                'fitness_score': random.randint(55, 85),
                'career_readiness': random.randint(50, 80),
                'attendance_rate': random.randint(75, 95),
                'stress_level': random.randint(20, 60),
                'emotional_health': random.randint(60, 90),
                'physical_activity_level': random.randint(50, 85),
                'learning_style': random.choice(['Visual', 'Auditory', 'Kinesthetic']),
                'subject_performance': json.dumps({'Mathematics': random.randint(60, 95), 'Science': random.randint(65, 90)}),
                'risk_factors': json.dumps([]),
                'recommendations': json.dumps([])
            }
        )
        
        if created:
            print(f"[SUCCESS] Created analytics for: {student.user.first_name}")
        
        # Create performance trends
        for i in range(6):  # Last 6 months
            trend_date = date.today() - timedelta(days=30*i)
            start_date = trend_date - timedelta(days=30)
            end_date = trend_date
            initial_value = random.randint(60, 90)
            final_value = random.randint(60, 90)
            change_percentage = ((final_value - initial_value) / initial_value) * 100 if initial_value > 0 else 0
            trend_direction = 'increasing' if change_percentage > 0 else 'decreasing' if change_percentage < 0 else 'stable'
            
            PerformanceTrend.objects.get_or_create(
                student=student,
                trend_type=random.choice(['academic', 'psychological', 'physical']),
                start_date=start_date,
                end_date=end_date,
                defaults={
                    'initial_value': initial_value,
                    'final_value': final_value,
                    'change_percentage': change_percentage,
                    'trend_direction': trend_direction,
                    'data_points': json.dumps([{'date': str(start_date), 'value': initial_value}, {'date': str(end_date), 'value': final_value}])
                }
            )


def create_ml_models():
    """Create sample ML models."""
    print("[INFO] Creating ML models...")
    
    models_data = [
        {
            'name': 'Performance Prediction Model',
            'model_type': 'neural_network',
            'version': '1.0',
            'file_path': '/models/performance_prediction_v1.0.pkl',
            'accuracy_score': 0.85
        },
        {
            'name': 'Career Recommendation Model',
            'model_type': 'random_forest',
            'version': '1.0',
            'file_path': '/models/career_recommendation_v1.0.pkl',
            'accuracy_score': 0.78
        },
        {
            'name': 'Risk Assessment Model',
            'model_type': 'gradient_boosting',
            'version': '1.0',
            'file_path': '/models/risk_assessment_v1.0.pkl',
            'accuracy_score': 0.82
        },
        {
            'name': 'Wellbeing Analysis Model',
            'model_type': 'svm',
            'version': '1.0',
            'file_path': '/models/wellbeing_analysis_v1.0.pkl',
            'accuracy_score': 0.79
        }
    ]
    
    for model_data in models_data:
        model, created = MLModel.objects.get_or_create(
            name=model_data['name'],
            version=model_data['version'],
            defaults={
                'model_type': model_data['model_type'],
                'file_path': model_data['file_path'],
                'accuracy_score': model_data['accuracy_score'],
                'is_active': True
            }
        )
        
        if created:
            print(f"[SUCCESS] Created ML model: {model_data['name']}")


def main():
    """Main function to create all sample data."""
    print("=" * 60)
    print("Creating Sample Data for Django Edusight")
    print("=" * 60)
    
    try:
        # Create data in order
        schools = create_schools()
        users = create_users()
        parents = create_parents(users)
        students = create_students(users, schools, parents)
        teachers = create_teachers(users, schools)
        counselors = create_counselors(users, schools)
        assessments = create_assessments(students, teachers)
        create_attendance(students)
        create_analytics(students)
        create_ml_models()
        
        print("\n" + "=" * 60)
        print("[SUCCESS] Sample data creation completed!")
        print("=" * 60)
        
        # Print summary
        print(f"Schools: {School.objects.count()}")
        print(f"Users: {User.objects.count()}")
        print(f"Students: {Student.objects.count()}")
        print(f"Teachers: {Teacher.objects.count()}")
        print(f"Parents: {Parent.objects.count()}")
        print(f"Counselors: {Counselor.objects.count()}")
        print(f"Assessments: {Assessment.objects.count()}")
        print(f"Assessment Results: {AssessmentResult.objects.count()}")
        print(f"Student Analytics: {StudentAnalytics.objects.count()}")
        print(f"ML Models: {MLModel.objects.count()}")
        
        print("\nLogin Credentials:")
        print("Admin: admin@edusight.com / admin123")
        print("Teacher: teacher1@school.edu / teacher123")
        print("Student: student1@school.edu / student123")
        print("Parent: parent1@example.com / parent123")
        print("Counselor: counselor1@school.edu / counselor123")
        
    except Exception as e:
        print(f"[ERROR] Sample data creation failed: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
