"""
Management command to create demo assessment workflows for testing
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta
import random
import json

from assessments.workflow_models import (
    PricingPlan, AssessmentWorkflow, WorkflowStep, 
    FormSubmission, AssessmentForm
)
from students.models import Student, Parent, School

User = get_user_model()


class Command(BaseCommand):
    help = 'Create demo assessment workflows for testing'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--count',
            type=int,
            default=5,
            help='Number of demo workflows to create (default: 5)'
        )
        
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing demo workflows before creating new ones'
        )
    
    def handle(self, *args, **options):
        count = options['count']
        clear_existing = options['clear']
        
        if clear_existing:
            self.stdout.write('Clearing existing demo workflows...')
            AssessmentWorkflow.objects.filter(
                name__startswith='Demo:'
            ).delete()
            self.stdout.write(
                self.style.WARNING('✓ Existing demo workflows cleared')
            )
        
        self.stdout.write(f'Creating {count} demo workflows...')
        
        # Get or create demo users, school, and students
        demo_school = self._create_demo_school()
        demo_users = self._create_demo_users()
        demo_students = self._create_demo_students(demo_users, demo_school)
        pricing_plans = list(PricingPlan.objects.filter(is_active=True))
        
        if not pricing_plans:
            self.stdout.write(
                self.style.ERROR('No pricing plans found. Run setup_pricing_plans first.')
            )
            return
        
        workflows_created = 0
        
        for i in range(count):
            try:
                workflow = self._create_demo_workflow(
                    i + 1, demo_students, pricing_plans
                )
                self._create_workflow_steps(workflow)
                
                # Randomly progress some workflows
                if random.choice([True, False]):
                    self._progress_workflow(workflow)
                
                workflows_created += 1
                self.stdout.write(f'✓ Created: {workflow.name}')
                
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'✗ Error creating workflow {i+1}: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\n🎉 Successfully created {workflows_created} demo workflows!')
        )
        
        # Display summary
        self._display_summary()
    
    def _create_demo_school(self):
        """Create a demo school"""
        school, created = School.objects.get_or_create(
            name='Demo International Academy',
            defaults={
                'address': '123 Education Street, Learning City, LC 12345',
                'phone': '+1-555-DEMO-EDU',
                'email': 'admin@demoacademy.edu',
                'principal_name': 'Dr. Sarah Thompson',
                'school_type': 'CBSE',
                'established_year': 2010,
                'is_active': True,
            }
        )
        return school
    
    def _create_demo_users(self):
        """Create demo parent users"""
        demo_users = []
        
        parent_data = [
            ('Sarah', 'Johnson', 'sarah.johnson@demo.com'),
            ('Michael', 'Chen', 'michael.chen@demo.com'),
            ('Emily', 'Rodriguez', 'emily.rodriguez@demo.com'),
            ('David', 'Smith', 'david.smith@demo.com'),
            ('Lisa', 'Williams', 'lisa.williams@demo.com'),
        ]
        
        for first_name, last_name, email in parent_data:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'parent',
                    'is_active': True,
                }
            )
            demo_users.append(user)
        
        return demo_users
    
    def _create_demo_students(self, demo_users, demo_school):
        """Create demo students for the parent users"""
        demo_students = []
        
        student_data = [
            ('Alex', 'Johnson', 'Grade 8', 'A', 'ST2024001'),
            ('Emma', 'Chen', 'Grade 6', 'B', 'ST2024002'),
            ('Carlos', 'Rodriguez', 'Grade 10', 'A', 'ST2024003'),
            ('Sophie', 'Smith', 'Grade 7', 'C', 'ST2024004'),
            ('Ryan', 'Williams', 'Grade 9', 'B', 'ST2024005'),
            ('Maya', 'Johnson', 'Grade 5', 'A', 'ST2024006'),
            ('Lucas', 'Chen', 'Grade 11', 'A', 'ST2024007'),
            ('Isabella', 'Rodriguez', 'Grade 8', 'B', 'ST2024008'),
        ]
        
        for i, (first_name, last_name, grade, section, roll_number) in enumerate(student_data):
            parent_user = demo_users[i % len(demo_users)]
            
            # Create or get parent profile
            parent_profile, created = Parent.objects.get_or_create(
                user=parent_user,
                defaults={
                    'occupation': random.choice(['Engineer', 'Teacher', 'Doctor', 'Manager', 'Consultant']),
                    'education_level': random.choice(['Bachelor', 'Master', 'PhD', 'High School']),
                    'annual_income': random.randint(30000, 150000),
                }
            )
            
            # Create student user
            student_email = f"{first_name.lower()}.{last_name.lower()}@students.demo.com"
            student_user, created = User.objects.get_or_create(
                email=student_email,
                defaults={
                    'username': f"student_{roll_number}",
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'student',
                    'is_active': True,
                }
            )
            
            # Create student record
            student, created = Student.objects.get_or_create(
                user=student_user,
                defaults={
                    'school': demo_school,  # Add school
                    'roll_number': roll_number,
                    'grade': grade,
                    'section': section,
                    'parent': parent_profile,  # Use parent profile instead of user
                    'date_of_birth': datetime(2008 + random.randint(-3, 3), 
                                           random.randint(1, 12), 
                                           random.randint(1, 28)).date(),
                    'admission_date': timezone.now().date() - timedelta(days=random.randint(30, 365)),
                    'gender': random.choice(['M', 'F']),  # Use model choices
                    'blood_group': random.choice(['A+', 'B+', 'O+', 'AB+']),
                    'interests': json.dumps(['Mathematics', 'Science', 'Arts']),
                    'strengths': json.dumps(['Problem Solving', 'Creativity']),
                    'weaknesses': json.dumps(['Time Management']),
                    'career_aspirations': 'Engineer, Doctor, Teacher',  # TextField
                    'emergency_contact': '+1-555-0123',  # Required field
                }
            )
            demo_students.append(student)
        
        return demo_students
    
    def _create_demo_workflow(self, index, demo_students, pricing_plans):
        """Create a single demo workflow"""
        student = random.choice(demo_students)
        pricing_plan = random.choice(pricing_plans)
        
        # Determine workflow type and assessment types
        workflow_type = self._determine_workflow_type(pricing_plan)
        assessment_types = self._get_assessment_types(pricing_plan)
        
        workflow = AssessmentWorkflow.objects.create(
            name=f'Demo: {pricing_plan.name} - {student.user.get_full_name()}',
            workflow_type=workflow_type,
            pricing_plan=pricing_plan,
            student=student,
            created_by=student.parent.user,  # Use parent.user
            workflow_config={
                'assessment_types': assessment_types,
                'plan_features': {
                    'ml_predictions': pricing_plan.ml_predictions,
                    'advanced_analytics': pricing_plan.advanced_analytics,
                    'custom_reports': pricing_plan.custom_reports
                },
                'demo_data': True
            }
        )
        
        return workflow
    
    def _determine_workflow_type(self, pricing_plan):
        """Determine workflow type based on pricing plan"""
        if pricing_plan.plan_type == 'basic':
            return 'basic_academic'
        elif pricing_plan.plan_type == 'premium':
            return 'premium_comprehensive'
        else:
            return 'enterprise_advanced'
    
    def _get_assessment_types(self, pricing_plan):
        """Get available assessment types for the pricing plan"""
        types = ['academic']
        
        if pricing_plan.physical_assessments:
            types.append('physical')
        if pricing_plan.psychological_assessments:
            types.append('psychological')
        if pricing_plan.career_mapping:
            types.append('career')
        
        return types
    
    def _create_workflow_steps(self, workflow):
        """Create workflow steps for the demo workflow"""
        assessment_types = workflow.workflow_config.get('assessment_types', ['academic'])
        pricing_plan = workflow.pricing_plan
        
        step_configs = [
            {
                'step_number': 1,
                'step_type': 'data_upload',
                'title': 'Data Upload & Basic Information',
                'description': 'Upload student data and basic information',
                'is_required': True,
                'estimated_duration': 10
            }
        ]
        
        step_counter = 2
        
        # Add assessment steps
        if 'academic' in assessment_types:
            step_configs.append({
                'step_number': step_counter,
                'step_type': 'academic_assessment',
                'title': 'Academic Assessment',
                'description': 'Comprehensive academic performance evaluation',
                'is_required': True,
                'estimated_duration': 20 if pricing_plan.plan_type == 'basic' else 30
            })
            step_counter += 1
        
        if 'physical' in assessment_types:
            step_configs.append({
                'step_number': step_counter,
                'step_type': 'physical_assessment',
                'title': 'Physical Education Assessment',
                'description': 'Physical fitness and motor skills evaluation',
                'is_required': True,
                'estimated_duration': 25
            })
            step_counter += 1
        
        if 'psychological' in assessment_types:
            step_configs.append({
                'step_number': step_counter,
                'step_type': 'psychological_assessment',
                'title': 'Psychological Assessment',
                'description': 'Social-emotional learning and behavioral evaluation',
                'is_required': True,
                'estimated_duration': 35
            })
            step_counter += 1
        
        # Add ML analysis for premium/enterprise
        if pricing_plan.ml_predictions:
            step_configs.append({
                'step_number': step_counter,
                'step_type': 'ml_analysis',
                'title': 'AI Analysis & Predictions',
                'description': 'Machine learning analysis and predictions',
                'is_required': False,
                'estimated_duration': 5
            })
            step_counter += 1
        
        # Final steps
        step_configs.extend([
            {
                'step_number': step_counter,
                'step_type': 'review_results',
                'title': 'Review Results',
                'description': 'Review and verify assessment results',
                'is_required': True,
                'estimated_duration': 15
            },
            {
                'step_number': step_counter + 1,
                'step_type': 'generate_report',
                'title': 'Generate Report',
                'description': 'Generate comprehensive assessment report',
                'is_required': True,
                'estimated_duration': 5
            }
        ])
        
        # Update total steps
        workflow.total_steps = len(step_configs)
        workflow.save()
        
        # Create step objects
        for config in step_configs:
            WorkflowStep.objects.create(
                workflow=workflow,
                **config
            )
    
    def _progress_workflow(self, workflow):
        """Randomly progress a workflow to simulate real usage"""
        progress_options = [
            ('draft', 1),
            ('in_progress', random.randint(2, workflow.total_steps - 1)),
            ('completed', workflow.total_steps),
        ]
        
        status, current_step = random.choice(progress_options)
        
        workflow.status = status
        workflow.current_step = current_step
        
        if status != 'draft':
            workflow.started_at = timezone.now() - timedelta(
                days=random.randint(1, 30)
            )
        
        if status == 'completed':
            workflow.completed_at = workflow.started_at + timedelta(
                hours=random.randint(1, 48)
            )
            
            # Add mock results
            workflow.results = self._generate_mock_results(workflow)
        
        workflow.save()
        
        # Update step statuses
        steps = WorkflowStep.objects.filter(workflow=workflow).order_by('step_number')
        
        for step in steps:
            if step.step_number < current_step:
                step.status = 'completed'
                step.completed_at = workflow.started_at + timedelta(
                    hours=step.step_number * 2
                )
            elif step.step_number == current_step and status == 'in_progress':
                step.status = 'in_progress'
            
            step.save()
    
    def _generate_mock_results(self, workflow):
        """Generate mock assessment results"""
        assessment_types = workflow.workflow_config.get('assessment_types', ['academic'])
        
        results = {
            'overall_score': random.randint(65, 95),
            'assessment_scores': {},
            'completed_at': timezone.now().isoformat()
        }
        
        # Generate scores for each assessment type
        for assessment_type in assessment_types:
            results['assessment_scores'][assessment_type] = {
                'overall_score': random.randint(60, 95),
                'detailed_scores': {
                    'category_1': random.randint(70, 100),
                    'category_2': random.randint(60, 90),
                    'category_3': random.randint(65, 95),
                }
            }
        
        # Add ML insights for premium/enterprise
        if workflow.pricing_plan.ml_predictions:
            results['ml_insights'] = {
                'predictions': {
                    'academic_trajectory': random.choice([
                        'Strong upward trend expected',
                        'Steady progress anticipated',
                        'Moderate improvement likely'
                    ]),
                    'risk_factors': random.sample([
                        'Time management', 'Math anxiety', 'Social confidence',
                        'Reading comprehension', 'Physical fitness'
                    ], 2),
                    'strengths': random.sample([
                        'Creative thinking', 'Problem solving', 'Leadership',
                        'Communication', 'Analytical skills'
                    ], 3),
                },
                'confidence_score': random.uniform(0.75, 0.95)
            }
        
        return results
    
    def _display_summary(self):
        """Display summary of created workflows"""
        workflows = AssessmentWorkflow.objects.filter(
            name__startswith='Demo:'
        )
        
        self.stdout.write('\nDemo Workflow Summary:')
        self.stdout.write('=' * 50)
        
        by_status = {}
        by_plan = {}
        
        for workflow in workflows:
            # Count by status
            status = workflow.get_status_display()
            by_status[status] = by_status.get(status, 0) + 1
            
            # Count by plan
            plan = workflow.pricing_plan.name
            by_plan[plan] = by_plan.get(plan, 0) + 1
        
        self.stdout.write(f'\n📊 Total Demo Workflows: {workflows.count()}')
        
        self.stdout.write('\n📈 By Status:')
        for status, count in by_status.items():
            self.stdout.write(f'   • {status}: {count}')
        
        self.stdout.write('\n💳 By Pricing Plan:')
        for plan, count in by_plan.items():
            self.stdout.write(f'   • {plan}: {count}')
        
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write('🚀 Demo workflows ready for testing!')
        self.stdout.write('   • Access dashboard: /assessments/workflows/')
        self.stdout.write('   • Login as demo parents to test workflows')
        self.stdout.write('   • Admin panel: /admin/assessments/assessmentworkflow/')
