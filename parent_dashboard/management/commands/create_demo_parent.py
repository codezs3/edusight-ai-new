from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta
import random
import json

from students.models import Student
from parent_dashboard.models import (
    UploadSession, AssessmentCalculation, PredictionResult,
    Recommendation, CareerMapping, ParentFeedback
)


class Command(BaseCommand):
    help = 'Create demo parent user with sample data'

    def handle(self, *args, **options):
        User = get_user_model()
        # Create demo parent user
        demo_parent, created = User.objects.get_or_create(
            username='demo_parent',
            defaults={
                'email': 'demo.parent@edusight.com',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'is_active': True
            }
        )
        
        if created:
            demo_parent.set_password('demo123')
            demo_parent.save()
            self.stdout.write(self.style.SUCCESS(f'Created demo parent user: {demo_parent.username}'))
        else:
            self.stdout.write(self.style.WARNING(f'Demo parent user already exists: {demo_parent.username}'))

        # Create demo student user first
        demo_student_user, created = User.objects.get_or_create(
            username='alex_johnson',
            defaults={
                'email': 'alex.johnson@student.com',
                'first_name': 'Alex',
                'last_name': 'Johnson',
                'role': 'student',
                'is_active': True
            }
        )
        
        if created:
            demo_student_user.set_password('student123')
            demo_student_user.save()

        # Create demo student
        demo_student, created = Student.objects.get_or_create(
            user=demo_student_user,
            defaults={
                'roll_number': 'ST2024001',
                'grade': 'Grade 8',
                'section': 'A',
                'date_of_birth': datetime(2010, 5, 15).date(),
                'admission_date': timezone.now().date() - timedelta(days=365),
                'gender': 'Male',
                'blood_group': 'A+',
                'emergency_contact': 'Sarah Johnson (+1-555-0124)',
                'medical_conditions': 'None',
                'is_active': True
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created demo student: {demo_student.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Demo student already exists: {demo_student.name}'))

        # Create sample upload sessions and assessments
        self.create_sample_assessments(demo_parent, demo_student)
        
        self.stdout.write(self.style.SUCCESS('Demo parent dashboard setup completed!'))
        self.stdout.write(self.style.SUCCESS('Login credentials:'))
        self.stdout.write(self.style.SUCCESS('Username: demo_parent'))
        self.stdout.write(self.style.SUCCESS('Password: demo123'))

    def create_sample_assessments(self, parent, student):
        # Create multiple assessment sessions over time
        subjects_data = [
            {
                'semester': 'Semester 1 2024',
                'curriculum': 'CBSE',
                'subjects': {
                    'Mathematics': {'scores': [88, 92, 85], 'average': 88.3, 'max_score': 92, 'min_score': 85},
                    'English': {'scores': [85, 88, 90], 'average': 87.7, 'max_score': 90, 'min_score': 85},
                    'Science': {'scores': [90, 87, 93], 'average': 90.0, 'max_score': 93, 'min_score': 87},
                    'Social Studies': {'scores': [82, 85, 80], 'average': 82.3, 'max_score': 85, 'min_score': 80},
                    'Hindi': {'scores': [75, 78, 80], 'average': 77.7, 'max_score': 80, 'min_score': 75},
                    'Computer Science': {'scores': [95, 98, 94], 'average': 95.7, 'max_score': 98, 'min_score': 94}
                }
            },
            {
                'semester': 'Semester 2 2024',
                'curriculum': 'CBSE',
                'subjects': {
                    'Mathematics': {'scores': [90, 94, 88], 'average': 90.7, 'max_score': 94, 'min_score': 88},
                    'English': {'scores': [88, 91, 89], 'average': 89.3, 'max_score': 91, 'min_score': 88},
                    'Science': {'scores': [92, 89, 95], 'average': 92.0, 'max_score': 95, 'min_score': 89},
                    'Social Studies': {'scores': [85, 87, 83], 'average': 85.0, 'max_score': 87, 'min_score': 83},
                    'Hindi': {'scores': [78, 82, 85], 'average': 81.7, 'max_score': 85, 'min_score': 78},
                    'Computer Science': {'scores': [97, 96, 98], 'average': 97.0, 'max_score': 98, 'min_score': 96}
                }
            },
            {
                'semester': 'Semester 1 2025',
                'curriculum': 'CBSE',
                'subjects': {
                    'Mathematics': {'scores': [92, 96, 90], 'average': 92.7, 'max_score': 96, 'min_score': 90},
                    'English': {'scores': [90, 93, 91], 'average': 91.3, 'max_score': 93, 'min_score': 90},
                    'Science': {'scores': [94, 91, 97], 'average': 94.0, 'max_score': 97, 'min_score': 91},
                    'Social Studies': {'scores': [87, 89, 85], 'average': 87.0, 'max_score': 89, 'min_score': 85},
                    'Hindi': {'scores': [82, 85, 88], 'average': 85.0, 'max_score': 88, 'min_score': 82},
                    'Computer Science': {'scores': [98, 99, 97], 'average': 98.0, 'max_score': 99, 'min_score': 97}
                }
            }
        ]

        for i, assessment_data in enumerate(subjects_data):
            # Create upload session
            upload_session = UploadSession.objects.create(
                parent_user=parent,
                student=student,
                upload_type='excel',
                status='completed',
                detected_curriculum=assessment_data['curriculum'],
                detected_semester=assessment_data['semester'],
                detected_year='2024-2025',
                detected_subjects=list(assessment_data['subjects'].keys()),
                raw_data=assessment_data['subjects'],
                created_at=timezone.now() - timedelta(days=(len(subjects_data)-i-1)*60)
            )

            # Calculate assessment scores
            all_scores = [subject['average'] for subject in assessment_data['subjects'].values()]
            academic_score = sum(all_scores) / len(all_scores)
            
            # Simulate psychological and physical scores
            psychological_score = academic_score * 0.9 + random.uniform(-5, 5)
            physical_score = academic_score * 0.85 + random.uniform(-8, 8)
            overall_score = (academic_score * 0.5 + psychological_score * 0.3 + physical_score * 0.2)

            # Identify strengths and improvements
            strengths = []
            improvements = []
            for subject, data in assessment_data['subjects'].items():
                if data['average'] > academic_score + 3:
                    strengths.append(subject)
                elif data['average'] < academic_score - 3:
                    improvements.append(subject)

            # Create assessment
            assessment = AssessmentCalculation.objects.create(
                upload_session=upload_session,
                academic_score=academic_score,
                psychological_score=psychological_score,
                physical_score=physical_score,
                overall_score=overall_score,
                performance_trend={'trend': 'improving', 'change': 2.5 if i > 0 else 0},
                strength_areas=strengths,
                improvement_areas=improvements
            )

            # Create predictions
            future_academic = academic_score + random.uniform(1, 4)
            future_psychological = psychological_score + random.uniform(0, 3)
            future_physical = physical_score + random.uniform(-1, 2)

            prediction = PredictionResult.objects.create(
                assessment=assessment,
                predicted_performance={
                    'next_semester': {
                        'academic': future_academic,
                        'psychological': future_psychological,
                        'physical': future_physical
                    },
                    'next_year': {
                        'academic': future_academic + random.uniform(0, 2),
                        'psychological': future_psychological + random.uniform(0, 2),
                        'physical': future_physical + random.uniform(0, 2)
                    }
                },
                confidence_scores={
                    'academic': 0.88,
                    'psychological': 0.75,
                    'physical': 0.72,
                    'overall': 0.78
                },
                future_trends={'improving': True, 'rate': 'steady'},
                risk_factors=['Time management could be improved'] if academic_score < 85 else [],
                success_indicators=['Strong analytical skills', 'Excellent in STEM subjects', 'Consistent improvement']
            )

            # Create recommendations
            recommendations_data = [
                {
                    'type': 'academic',
                    'title': 'Advanced Mathematics Program',
                    'description': 'Enroll in advanced mathematics courses to further develop exceptional math skills',
                    'priority': 'medium',
                    'steps': ['Join math olympiad preparation', 'Take advanced calculus course', 'Participate in math competitions'],
                    'outcome': 'Enhanced mathematical reasoning and problem-solving skills',
                    'timeline': '6-12 months'
                },
                {
                    'type': 'career',
                    'title': 'STEM Career Exploration',
                    'description': 'Explore engineering and computer science career paths',
                    'priority': 'high',
                    'steps': ['Visit tech companies', 'Attend coding bootcamps', 'Meet with career counselor'],
                    'outcome': 'Clear career direction and informed decision making',
                    'timeline': '3-6 months'
                },
                {
                    'type': 'study_method',
                    'title': 'Language Skills Enhancement',
                    'description': 'Focus on improving Hindi language skills for well-rounded development',
                    'priority': 'low',
                    'steps': ['Additional Hindi practice', 'Read Hindi literature', 'Join language exchange program'],
                    'outcome': 'Improved communication skills in Hindi',
                    'timeline': '4-8 months'
                }
            ]

            for rec_data in recommendations_data:
                Recommendation.objects.create(
                    prediction=prediction,
                    recommendation_type=rec_data['type'],
                    title=rec_data['title'],
                    description=rec_data['description'],
                    priority=rec_data['priority'],
                    actionable_steps=rec_data['steps'],
                    expected_outcome=rec_data['outcome'],
                    timeline=rec_data['timeline']
                )

            # Create career mapping
            CareerMapping.objects.create(
                prediction=prediction,
                recommended_careers=[
                    'Software Engineer', 'Data Scientist', 'Computer Systems Analyst',
                    'Cybersecurity Specialist', 'AI/ML Engineer', 'Research Scientist'
                ],
                career_match_scores={
                    'Software Engineer': 0.92,
                    'Data Scientist': 0.89,
                    'Computer Systems Analyst': 0.85,
                    'Cybersecurity Specialist': 0.82,
                    'AI/ML Engineer': 0.88,
                    'Research Scientist': 0.79
                },
                skill_gaps=['Advanced programming languages', 'Data visualization', 'Public speaking'],
                development_path={
                    'short_term': ['Learn Python programming', 'Complete online data science course'],
                    'medium_term': ['Internship at tech company', 'Build portfolio projects'],
                    'long_term': ['Bachelor\'s in Computer Science', 'Gain industry experience']
                },
                industry_trends={'growth_sectors': ['Artificial Intelligence', 'Cybersecurity', 'Cloud Computing']},
                education_requirements={'recommended': 'Bachelor\'s in Computer Science or related field'}
            )

        self.stdout.write(self.style.SUCCESS(f'Created {len(subjects_data)} sample assessments for demo student'))
