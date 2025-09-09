#!/usr/bin/env python3
"""
Sample Assessment Data Loader
Loads dummy assessment files into the EduSight system for testing
"""

import os
import sys
import django
import json
from datetime import datetime, timedelta
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edusight_django.settings')
django.setup()

from django.contrib.auth import get_user_model
from students.models import Student, School
from assessments.models import Assessment, AssessmentResult
from assessments.crud_models import Subject, Progress

User = get_user_model()

def create_sample_schools():
    """Create sample schools for testing"""
    schools_data = [
        {
            'name': 'Greenwood International School',
            'address': '123 Education Street, Bangalore, Karnataka, India',
            'phone': '+91-80-1234-5678',
            'email': 'info@greenwood.edu',
            'principal_name': 'Dr. Sarah Johnson',
            'established_year': 1995,
            'school_type': 'IB'
        },
        {
            'name': 'Delhi Public School',
            'address': '456 Knowledge Avenue, New Delhi, India',
            'phone': '+91-11-2345-6789',
            'email': 'info@dps.edu',
            'principal_name': 'Mr. Rajesh Kumar',
            'established_year': 1980,
            'school_type': 'CBSE'
        },
        {
            'name': 'Cambridge International School',
            'address': '789 Learning Road, Mumbai, Maharashtra, India',
            'phone': '+91-22-3456-7890',
            'email': 'info@cambridge.edu',
            'principal_name': 'Ms. Priya Sharma',
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
            print(f"✅ Created school: {school.name}")
        else:
            print(f"ℹ️  School already exists: {school.name}")
    
    return schools

def create_sample_users_and_students():
    """Create sample users and students"""
    schools = School.objects.all()
    if not schools:
        schools = create_sample_schools()
    
    # Create parent user
    parent_user, created = User.objects.get_or_create(
        email='parent@example.com',
        defaults={
            'username': 'parent',
            'first_name': 'Rajesh',
            'last_name': 'Sharma',
            'role': 'parent',
            'is_active': True
        }
    )
    if created:
        parent_user.set_password('password123')
        parent_user.save()
        print(f"✅ Created parent user: {parent_user.get_full_name()}")
    
    # Create parent profile
    from students.models import Parent
    parent, created = Parent.objects.get_or_create(
        user=parent_user,
        defaults={
            'occupation': 'Software Engineer',
            'education_level': 'Bachelor\'s Degree'
        }
    )
    if created:
        print(f"✅ Created parent profile: {parent.user.get_full_name()}")
    
    # Create students
    students_data = [
        {
            'name': 'Arjun Sharma',
            'grade': '10',
            'section': 'A',
            'school': schools[0],
            'parent': parent,
            'roll_number': 'STU001',
            'date_of_birth': '2008-05-15',
            'gender': 'M',
            'emergency_contact': '+91-9876543210'
        },
        {
            'name': 'Priya Patel',
            'grade': '9',
            'section': 'B',
            'school': schools[1],
            'parent': parent,
            'roll_number': 'STU002',
            'date_of_birth': '2009-08-22',
            'gender': 'F',
            'emergency_contact': '+91-9876543211'
        }
    ]
    
    students = []
    for student_data in students_data:
        # Create user for student
        email = f"{student_data['name'].lower().replace(' ', '.')}@student.edu"
        username = f"{student_data['name'].lower().replace(' ', '.')}"
        
        student_user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'first_name': student_data['name'].split()[0],
                'last_name': student_data['name'].split()[1],
                'role': 'student',
                'is_active': True
            }
        )
        if created:
            student_user.set_password('password123')
            student_user.save()
        
        # Create student profile
        student, created = Student.objects.get_or_create(
            user=student_user,
            defaults={
                'grade': student_data['grade'],
                'section': student_data['section'],
                'school': student_data['school'],
                'parent': student_data['parent'],
                'roll_number': student_data['roll_number'],
                'admission_date': '2023-04-01',
                'date_of_birth': student_data['date_of_birth'],
                'gender': student_data['gender'],
                'emergency_contact': student_data['emergency_contact']
            }
        )
        students.append(student)
        if created:
            print(f"✅ Created student: {student.user.get_full_name()}")
        else:
            print(f"ℹ️  Student already exists: {student.user.get_full_name()}")
    
    return students

def load_assessment_data():
    """Load assessment data from JSON files"""
    sample_dir = project_root / 'uploads' / 'sample_assessments'
    
    if not sample_dir.exists():
        print(f"❌ Sample assessments directory not found: {sample_dir}")
        return
    
    students = Student.objects.all()
    if not students:
        students = create_sample_users_and_students()
    
    assessment_files = [
        'academic_sample_1.json',
        'psychological_sample_1.json',
        'physical_sample_1.json',
        'combined_360_sample_1.json',
        'academic_sample_2.json',
        'psychological_sample_2.json'
    ]
    
    for filename in assessment_files:
        file_path = sample_dir / filename
        if not file_path.exists():
            print(f"⚠️  File not found: {filename}")
            continue
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Get student
            student_name = data.get('student_name', '')
            student = None
            for s in students:
                if s.user.name == student_name:
                    student = s
                    break
            
            if not student:
                print(f"⚠️  Student not found for: {student_name}")
                continue
            
            # Create assessment
            assessment, created = Assessment.objects.get_or_create(
                assessment_id=data.get('assessment_id'),
                defaults={
                    'student': student,
                    'assessment_type': data.get('assessment_type'),
                    'date_completed': datetime.strptime(data.get('date_completed'), '%Y-%m-%d').date(),
                    'status': 'completed',
                    'raw_data': json.dumps(data)
                }
            )
            
            if created:
                print(f"✅ Loaded assessment: {assessment.assessment_type} for {student.user.name}")
            else:
                print(f"ℹ️  Assessment already exists: {assessment.assessment_type} for {student.user.name}")
            
            # Create assessment result
            overall_score = data.get('overall_academic_score') or data.get('overall_psychological_score') or data.get('overall_physical_score') or data.get('overall_edusight_score')
            
            if overall_score:
                result, created = AssessmentResult.objects.get_or_create(
                    assessment=assessment,
                    defaults={
                        'overall_score': overall_score,
                        'detailed_scores': json.dumps(data),
                        'recommendations': json.dumps(data.get('recommendations', [])),
                        'created_at': datetime.now()
                    }
                )
                
                if created:
                    print(f"✅ Created result for assessment: {overall_score}%")
        
        except Exception as e:
            print(f"❌ Error loading {filename}: {str(e)}")

def create_sample_subjects():
    """Create sample subjects"""
    subjects_data = [
        {'name': 'Mathematics', 'code': 'MATH', 'description': 'Mathematical concepts and problem solving'},
        {'name': 'Science', 'code': 'SCI', 'description': 'Physics, Chemistry, and Biology'},
        {'name': 'English', 'code': 'ENG', 'description': 'Language and Literature'},
        {'name': 'History', 'code': 'HIST', 'description': 'World and Indian History'},
        {'name': 'Physical Education', 'code': 'PE', 'description': 'Physical fitness and sports'},
        {'name': 'Art', 'code': 'ART', 'description': 'Creative arts and design'}
    ]
    
    # Get or create a user for the created_by field
    admin_user, created = User.objects.get_or_create(
        email='admin@edusight.com',
        defaults={
            'name': 'System Admin',
            'role': 'ADMIN',
            'is_active': True
        }
    )
    
    for subject_data in subjects_data:
        subject, created = Subject.objects.get_or_create(
            name=subject_data['name'],
            defaults={
                'code': subject_data['code'],
                'description': subject_data['description'],
                'created_by': admin_user
            }
        )
        if created:
            print(f"✅ Created subject: {subject.name}")
        else:
            print(f"ℹ️  Subject already exists: {subject.name}")

def create_sample_progress():
    """Create sample progress records"""
    students = Student.objects.all()
    subjects = Subject.objects.all()
    
    if not students or not subjects:
        print("⚠️  No students or subjects found. Creating them first...")
        create_sample_users_and_students()
        create_sample_subjects()
        students = Student.objects.all()
        subjects = Subject.objects.all()
    
    # Get admin user
    admin_user = User.objects.filter(role='ADMIN').first()
    if not admin_user:
        admin_user, _ = User.objects.get_or_create(
            email='admin@edusight.com',
            defaults={
                'name': 'System Admin',
                'role': 'ADMIN',
                'is_active': True
            }
        )
    
    for student in students:
        for subject in subjects:
            # Create progress record
            marks_obtained = 75 + (hash(student.user.get_full_name() + subject.name) % 25)  # Random score between 75-100
            total_marks = 100
            percentage = (marks_obtained / total_marks) * 100
            
            progress, created = Progress.objects.get_or_create(
                student=student,
                subject=subject,
                defaults={
                    'marks_obtained': marks_obtained,
                    'total_marks': total_marks,
                    'percentage': percentage,
                    'grade': 'A',
                    'remarks': f'Progress record for {student.user.get_full_name()} in {subject.name}',
                    'recorded_by': admin_user
                }
            )
            if created:
                print(f"✅ Created progress: {student.user.get_full_name()} - {subject.name}: {progress.percentage}%")

def main():
    """Main function to load all sample data"""
    print("🚀 Starting sample data loading...")
    print("=" * 50)
    
    try:
        # Create sample schools
        print("\n📚 Creating sample schools...")
        create_sample_schools()
        
        # Create sample users and students
        print("\n👥 Creating sample users and students...")
        create_sample_users_and_students()
        
        # Create sample subjects
        print("\n📖 Creating sample subjects...")
        create_sample_subjects()
        
        # Create sample progress records
        print("\n📊 Creating sample progress records...")
        create_sample_progress()
        
        # Load assessment data
        print("\n📋 Loading assessment data...")
        load_assessment_data()
        
        print("\n" + "=" * 50)
        print("✅ Sample data loading completed successfully!")
        print("\n📊 Summary:")
        print(f"   Schools: {School.objects.count()}")
        print(f"   Users: {User.objects.count()}")
        print(f"   Students: {Student.objects.count()}")
        print(f"   Assessments: {Assessment.objects.count()}")
        print(f"   Assessment Results: {AssessmentResult.objects.count()}")
        print(f"   Subjects: {Subject.objects.count()}")
        print(f"   Progress Records: {Progress.objects.count()}")
        
        print("\n🔑 Test Credentials:")
        print("   Parent: parent@example.com / password123")
        print("   Student: arjun.sharma@student.edu / password123")
        print("   Admin: admin@edusight.com / password123")
        
    except Exception as e:
        print(f"\n❌ Error during sample data loading: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
