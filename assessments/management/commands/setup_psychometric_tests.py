"""
Management command to set up age-appropriate psychometric tests
Creates comprehensive test batteries for different age groups and grade levels
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from assessments.psychometric_models import (
    AgeGroup, PsychometricTestCategory, PsychometricTest, TestQuestion
)

User = get_user_model()


class Command(BaseCommand):
    help = 'Set up age-appropriate psychometric tests and categories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset all psychometric test data before creating new tests',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Resetting psychometric test data...')
            TestQuestion.objects.all().delete()
            PsychometricTest.objects.all().delete()
            PsychometricTestCategory.objects.all().delete()
            AgeGroup.objects.all().delete()
            self.stdout.write(self.style.WARNING('✓ Existing data cleared'))

        # Create age groups
        self._create_age_groups()
        
        # Create test categories
        self._create_test_categories()
        
        # Create psychometric tests
        self._create_psychometric_tests()
        
        # Create test questions
        self._create_test_questions()
        
        self.stdout.write(
            self.style.SUCCESS('\n🎉 Successfully set up age-appropriate psychometric test system!')
        )
        
        # Display summary
        self._display_summary()

    def _create_age_groups(self):
        """Create age groups for different developmental stages"""
        self.stdout.write('Creating age groups...')
        
        age_groups_data = [
            {
                'name': 'Early Childhood',
                'min_age': 3,
                'max_age': 6,
                'grade_range': 'Nursery-KG',
                'description': 'Early childhood developmental stage focusing on basic cognitive and social skills'
            },
            {
                'name': 'Elementary',
                'min_age': 6,
                'max_age': 11,
                'grade_range': '1-5',
                'description': 'Elementary school age focusing on foundational learning and social development'
            },
            {
                'name': 'Middle School',
                'min_age': 11,
                'max_age': 14,
                'grade_range': '6-8',
                'description': 'Middle school transition period with emphasis on identity and peer relationships'
            },
            {
                'name': 'High School',
                'min_age': 14,
                'max_age': 18,
                'grade_range': '9-12',
                'description': 'High school years focusing on personality development and career preparation'
            }
        ]
        
        for age_group_data in age_groups_data:
            age_group, created = AgeGroup.objects.get_or_create(
                name=age_group_data['name'],
                defaults=age_group_data
            )
            if created:
                self.stdout.write(f'  ✓ Created: {age_group.name}')

    def _create_test_categories(self):
        """Create psychometric test categories"""
        self.stdout.write('Creating test categories...')
        
        categories_data = [
            {
                'name': 'Cognitive Development',
                'category_type': 'cognitive',
                'description': 'Tests measuring cognitive abilities, problem-solving, and intellectual development',
                'icon': 'fas fa-brain',
                'color_code': '#3498db'
            },
            {
                'name': 'Emotional Intelligence',
                'category_type': 'emotional',
                'description': 'Assessment of emotional awareness, regulation, and social emotional skills',
                'icon': 'fas fa-heart',
                'color_code': '#e74c3c'
            },
            {
                'name': 'Social Skills',
                'category_type': 'social',
                'description': 'Evaluation of social interaction, communication, and relationship skills',
                'icon': 'fas fa-users',
                'color_code': '#2ecc71'
            },
            {
                'name': 'Behavioral Assessment',
                'category_type': 'behavioral',
                'description': 'Analysis of behavioral patterns, self-control, and adaptive behaviors',
                'icon': 'fas fa-user-check',
                'color_code': '#f39c12'
            },
            {
                'name': 'Learning Style',
                'category_type': 'learning_style',
                'description': 'Identification of preferred learning modalities and educational approaches',
                'icon': 'fas fa-graduation-cap',
                'color_code': '#9b59b6'
            },
            {
                'name': 'Attention & Focus',
                'category_type': 'attention',
                'description': 'Assessment of attention span, concentration, and focus abilities',
                'icon': 'fas fa-eye',
                'color_code': '#1abc9c'
            },
            {
                'name': 'Memory & Retention',
                'category_type': 'memory',
                'description': 'Evaluation of memory capacity, retention, and recall abilities',
                'icon': 'fas fa-memory',
                'color_code': '#34495e'
            },
            {
                'name': 'Creativity & Innovation',
                'category_type': 'creativity',
                'description': 'Assessment of creative thinking, imagination, and innovative problem-solving',
                'icon': 'fas fa-lightbulb',
                'color_code': '#f1c40f'
            },
            {
                'name': 'Stress & Anxiety',
                'category_type': 'stress',
                'description': 'Evaluation of stress levels, anxiety, and coping mechanisms',
                'icon': 'fas fa-shield-alt',
                'color_code': '#e67e22'
            },
            {
                'name': 'Motivation & Goals',
                'category_type': 'motivation',
                'description': 'Assessment of motivation levels, goal-setting, and achievement orientation',
                'icon': 'fas fa-target',
                'color_code': '#8e44ad'
            }
        ]
        
        for category_data in categories_data:
            category, created = PsychometricTestCategory.objects.get_or_create(
                category_type=category_data['category_type'],
                defaults=category_data
            )
            if created:
                self.stdout.write(f'  ✓ Created: {category.name}')

    def _create_psychometric_tests(self):
        """Create age-appropriate psychometric tests"""
        self.stdout.write('Creating psychometric tests...')
        
        # Get system user for test creation
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            admin_user = User.objects.create_user(
                email='system@edusight.ai',
                first_name='System',
                last_name='Administrator',
                role='admin',
                is_staff=True,
                is_superuser=True
            )
        
        # Test configurations for each age group
        test_configs = {
            'Early Childhood': [
                {
                    'category_type': 'cognitive',
                    'tests': [
                        {
                            'name': 'Picture Recognition & Matching',
                            'test_type': 'interactive',
                            'difficulty': 'beginner',
                            'duration': 15,
                            'uses_pictures': True,
                            'requires_reading': False,
                            'requires_writing': False,
                            'verbal_administration': True,
                            'description': 'Simple picture matching game to assess visual recognition and basic cognitive skills',
                            'instructions': 'Look at the pictures and find the matching pairs. Point to or touch the pictures that go together.'
                        },
                        {
                            'name': 'Shape & Color Sorting',
                            'test_type': 'interactive',
                            'difficulty': 'beginner',
                            'duration': 10,
                            'uses_pictures': True,
                            'requires_reading': False,
                            'requires_writing': False,
                            'verbal_administration': True,
                            'description': 'Sorting activity to assess classification and basic cognitive development',
                            'instructions': 'Sort the shapes by color or shape. Put the ones that are the same together.'
                        }
                    ]
                },
                {
                    'category_type': 'emotional',
                    'tests': [
                        {
                            'name': 'Feeling Faces Recognition',
                            'test_type': 'interactive',
                            'difficulty': 'beginner',
                            'duration': 12,
                            'uses_pictures': True,
                            'requires_reading': False,
                            'requires_writing': False,
                            'verbal_administration': True,
                            'description': 'Recognition of basic emotions through facial expressions',
                            'instructions': 'Look at each face and tell me how this person is feeling. Happy, sad, angry, or scared?'
                        }
                    ]
                },
                {
                    'category_type': 'social',
                    'tests': [
                        {
                            'name': 'Social Situation Stories',
                            'test_type': 'storytelling',
                            'difficulty': 'beginner',
                            'duration': 15,
                            'uses_pictures': True,
                            'requires_reading': False,
                            'requires_writing': False,
                            'verbal_administration': True,
                            'description': 'Simple social scenarios to assess social understanding',
                            'instructions': 'Look at the pictures and tell me what is happening. What should the children do?'
                        }
                    ]
                }
            ],
            'Elementary': [
                {
                    'category_type': 'cognitive',
                    'tests': [
                        {
                            'name': 'Pattern Recognition & Logic',
                            'test_type': 'puzzle',
                            'difficulty': 'intermediate',
                            'duration': 25,
                            'uses_pictures': True,
                            'requires_reading': True,
                            'requires_writing': False,
                            'verbal_administration': False,
                            'description': 'Pattern completion and logical reasoning tasks',
                            'instructions': 'Complete the patterns and solve the logic puzzles. Choose the best answer for each question.'
                        },
                        {
                            'name': 'Memory & Attention Span',
                            'test_type': 'performance',
                            'difficulty': 'intermediate',
                            'duration': 20,
                            'uses_pictures': True,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Assessment of working memory and sustained attention',
                            'instructions': 'Remember the sequences and patterns shown. Write down what you remember.'
                        }
                    ]
                },
                {
                    'category_type': 'learning_style',
                    'tests': [
                        {
                            'name': 'Learning Preferences Questionnaire',
                            'test_type': 'questionnaire',
                            'difficulty': 'intermediate',
                            'duration': 15,
                            'uses_pictures': False,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Identify preferred learning modalities and study preferences',
                            'instructions': 'Answer questions about how you like to learn and study. Choose the answer that best describes you.'
                        }
                    ]
                },
                {
                    'category_type': 'emotional',
                    'tests': [
                        {
                            'name': 'Emotional Regulation Assessment',
                            'test_type': 'scenario',
                            'difficulty': 'intermediate',
                            'duration': 20,
                            'uses_pictures': True,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Scenarios to assess emotional understanding and regulation strategies',
                            'instructions': 'Read each situation and choose what you would do. Explain your feelings and choices.'
                        }
                    ]
                }
            ],
            'Middle School': [
                {
                    'category_type': 'cognitive',
                    'tests': [
                        {
                            'name': 'Abstract Reasoning & Problem Solving',
                            'test_type': 'puzzle',
                            'difficulty': 'advanced',
                            'duration': 35,
                            'uses_pictures': True,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Complex reasoning tasks and abstract thinking assessment',
                            'instructions': 'Solve the complex problems and reasoning tasks. Show your thinking process.'
                        }
                    ]
                },
                {
                    'category_type': 'stress',
                    'tests': [
                        {
                            'name': 'Stress & Coping Assessment',
                            'test_type': 'questionnaire',
                            'difficulty': 'intermediate',
                            'duration': 25,
                            'uses_pictures': False,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Assessment of stress levels and coping strategies',
                            'instructions': 'Answer honestly about how you handle stress and difficult situations.'
                        }
                    ]
                },
                {
                    'category_type': 'social',
                    'tests': [
                        {
                            'name': 'Peer Relationships & Social Skills',
                            'test_type': 'scenario',
                            'difficulty': 'intermediate',
                            'duration': 30,
                            'uses_pictures': False,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Assessment of peer interaction and social competence',
                            'instructions': 'Read the social scenarios and explain how you would handle each situation.'
                        }
                    ]
                }
            ],
            'High School': [
                {
                    'category_type': 'motivation',
                    'tests': [
                        {
                            'name': 'Achievement Motivation & Goal Setting',
                            'test_type': 'questionnaire',
                            'difficulty': 'advanced',
                            'duration': 30,
                            'uses_pictures': False,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Assessment of motivation levels and goal-oriented behavior',
                            'instructions': 'Reflect on your goals, ambitions, and what motivates you to succeed.'
                        }
                    ]
                },
                {
                    'category_type': 'stress',
                    'tests': [
                        {
                            'name': 'Academic Stress & Well-being',
                            'test_type': 'questionnaire',
                            'difficulty': 'advanced',
                            'duration': 25,
                            'uses_pictures': False,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Comprehensive assessment of academic stress and mental well-being',
                            'instructions': 'Answer questions about your academic experience and mental health.'
                        }
                    ]
                },
                {
                    'category_type': 'creativity',
                    'tests': [
                        {
                            'name': 'Creative Thinking & Innovation',
                            'test_type': 'open_ended',
                            'difficulty': 'advanced',
                            'duration': 40,
                            'uses_pictures': False,
                            'requires_reading': True,
                            'requires_writing': True,
                            'verbal_administration': False,
                            'description': 'Assessment of creative thinking abilities and innovative problem-solving',
                            'instructions': 'Complete creative challenges and provide innovative solutions to problems.'
                        }
                    ]
                }
            ]
        }
        
        created_tests = 0
        for age_group_name, categories in test_configs.items():
            age_group = AgeGroup.objects.get(name=age_group_name)
            
            for category_config in categories:
                category = PsychometricTestCategory.objects.get(
                    category_type=category_config['category_type']
                )
                
                for test_data in category_config['tests']:
                    test, created = PsychometricTest.objects.get_or_create(
                        name=test_data['name'],
                        age_group=age_group,
                        category=category,
                        defaults={
                            'test_type': test_data['test_type'],
                            'difficulty_level': test_data['difficulty'],
                            'duration_minutes': test_data['duration'],
                            'uses_pictures': test_data['uses_pictures'],
                            'requires_reading': test_data['requires_reading'],
                            'requires_writing': test_data['requires_writing'],
                            'verbal_administration': test_data['verbal_administration'],
                            'description': test_data['description'],
                            'instructions': test_data['instructions'],
                            'max_score': 100,
                            'scoring_method': 'Standard percentage scoring based on correct responses',
                            'interpretation_guide': 'Scores above 80% indicate strong performance, 60-80% average, below 60% may need additional support',
                            'created_by': admin_user,
                            'is_validated': True
                        }
                    )
                    
                    if created:
                        created_tests += 1
                        self.stdout.write(f'  ✓ Created: {test.name} ({age_group.name})')
        
        self.stdout.write(f'Created {created_tests} psychometric tests')

    def _create_test_questions(self):
        """Create sample questions for each test"""
        self.stdout.write('Creating test questions...')
        
        # Sample questions for different test types
        question_templates = {
            'cognitive_early': [
                {
                    'question_text': 'Which shape is different from the others?',
                    'question_type': 'multiple_choice',
                    'options': ['Circle', 'Square', 'Triangle', 'Apple'],
                    'correct_answer': 'Apple',
                    'points': 5
                },
                {
                    'question_text': 'Count the animals in the picture',
                    'question_type': 'multiple_choice',
                    'options': ['1', '2', '3', '4'],
                    'correct_answer': '3',
                    'points': 5
                }
            ],
            'emotional_recognition': [
                {
                    'question_text': 'How is this person feeling?',
                    'question_type': 'multiple_choice',
                    'options': ['Happy', 'Sad', 'Angry', 'Scared'],
                    'correct_answer': 'Happy',
                    'points': 10
                },
                {
                    'question_text': 'What makes you feel happy?',
                    'question_type': 'open_ended',
                    'options': [],
                    'correct_answer': '',
                    'points': 10
                }
            ],
            'learning_style': [
                {
                    'question_text': 'When learning something new, I prefer to:',
                    'question_type': 'multiple_choice',
                    'options': ['See pictures and diagrams', 'Listen to explanations', 'Try it myself', 'Read about it'],
                    'correct_answer': '',  # No correct answer for preference
                    'points': 5
                },
                {
                    'question_text': 'I remember things better when I:',
                    'question_type': 'multiple_choice',
                    'options': ['Write them down', 'Say them out loud', 'Draw or visualize them', 'Practice doing them'],
                    'correct_answer': '',
                    'points': 5
                }
            ],
            'stress_assessment': [
                {
                    'question_text': 'How often do you feel overwhelmed by schoolwork?',
                    'question_type': 'likert_scale',
                    'options': ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
                    'correct_answer': '',
                    'points': 5
                },
                {
                    'question_text': 'When I feel stressed, I usually:',
                    'question_type': 'multiple_choice',
                    'options': ['Talk to someone', 'Do physical activity', 'Listen to music', 'Take deep breaths'],
                    'correct_answer': '',
                    'points': 5
                }
            ]
        }
        
        created_questions = 0
        tests = PsychometricTest.objects.all()
        
        for test in tests:
            # Determine question template based on test characteristics
            if test.category.category_type == 'cognitive' and test.age_group.name == 'Early Childhood':
                template = question_templates['cognitive_early']
            elif test.category.category_type == 'emotional':
                template = question_templates['emotional_recognition']
            elif test.category.category_type == 'learning_style':
                template = question_templates['learning_style']
            elif test.category.category_type == 'stress':
                template = question_templates['stress_assessment']
            else:
                # Default template
                template = [
                    {
                        'question_text': f'Sample question for {test.name}',
                        'question_type': 'multiple_choice',
                        'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                        'correct_answer': 'Option A',
                        'points': 10
                    }
                ]
            
            # Create questions for this test
            for i, question_data in enumerate(template, 1):
                question, created = TestQuestion.objects.get_or_create(
                    test=test,
                    question_number=i,
                    defaults={
                        'question_text': question_data['question_text'],
                        'question_type': question_data['question_type'],
                        'options': question_data['options'],
                        'correct_answer': question_data['correct_answer'],
                        'points': question_data['points'],
                        'uses_simple_language': True,
                        'is_required': True,
                        'order': i
                    }
                )
                
                if created:
                    created_questions += 1
        
        self.stdout.write(f'Created {created_questions} test questions')

    def _display_summary(self):
        """Display summary of created items"""
        self.stdout.write('\n' + '='*50)
        self.stdout.write('PSYCHOMETRIC TEST SYSTEM SUMMARY')
        self.stdout.write('='*50)
        
        age_groups = AgeGroup.objects.count()
        categories = PsychometricTestCategory.objects.count()
        tests = PsychometricTest.objects.count()
        questions = TestQuestion.objects.count()
        
        self.stdout.write(f'📊 Age Groups: {age_groups}')
        self.stdout.write(f'📁 Test Categories: {categories}')
        self.stdout.write(f'📝 Psychometric Tests: {tests}')
        self.stdout.write(f'❓ Test Questions: {questions}')
        
        self.stdout.write('\n📋 Age Groups Created:')
        for age_group in AgeGroup.objects.all():
            test_count = age_group.tests.count()
            self.stdout.write(f'   • {age_group.name} (Ages {age_group.min_age}-{age_group.max_age}): {test_count} tests')
        
        self.stdout.write('\n🧠 Test Categories:')
        for category in PsychometricTestCategory.objects.all():
            test_count = category.tests.count()
            self.stdout.write(f'   • {category.name}: {test_count} tests')
        
        self.stdout.write('\n' + '='*50)
        self.stdout.write('🚀 System ready for psychometric assessments!')
        self.stdout.write('   • Access dashboard: /assessments/psychometric/')
        self.stdout.write('   • Admin panel: /admin/assessments/')
        self.stdout.write('='*50)
