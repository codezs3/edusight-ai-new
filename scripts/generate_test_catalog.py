#!/usr/bin/env python3
"""
Script to generate comprehensive test catalog with 1000+ assessments.
"""

import os
import sys
import django
import random
from decimal import Decimal
from datetime import datetime, timedelta

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edusight_django.settings')
django.setup()

from django.contrib.auth import get_user_model
from assessments.test_catalog_models import TestCategory, TestCatalog
from students.models import User

User = get_user_model()


def create_test_categories():
    """Create test categories."""
    categories_data = [
        # Academic Categories
        {'name': 'Mathematics', 'description': 'Mathematical concepts and problem-solving skills', 'icon': 'calculator', 'color': '#3B82F6'},
        {'name': 'Science', 'description': 'Scientific knowledge and experimental skills', 'icon': 'beaker', 'color': '#10B981'},
        {'name': 'English Language', 'description': 'Language skills, literature, and communication', 'icon': 'book-open', 'color': '#F59E0B'},
        {'name': 'Social Studies', 'description': 'History, geography, and social sciences', 'icon': 'globe-alt', 'color': '#EF4444'},
        {'name': 'Computer Science', 'description': 'Programming, technology, and digital literacy', 'icon': 'computer-desktop', 'color': '#8B5CF6'},
        {'name': 'Arts & Design', 'description': 'Creative arts, design, and aesthetic skills', 'icon': 'paint-brush', 'color': '#EC4899'},
        
        # Psychological Categories
        {'name': 'Personality Assessment', 'description': 'Personality traits and behavioral patterns', 'icon': 'user-circle', 'color': '#06B6D4'},
        {'name': 'Cognitive Assessment', 'description': 'Mental abilities and cognitive functions', 'icon': 'brain', 'color': '#84CC16'},
        {'name': 'Emotional Intelligence', 'description': 'Emotional awareness and management skills', 'icon': 'heart', 'color': '#F97316'},
        {'name': 'Learning Styles', 'description': 'Preferred learning methods and approaches', 'icon': 'academic-cap', 'color': '#6366F1'},
        {'name': 'Attention & Focus', 'description': 'Concentration and attention span assessment', 'icon': 'eye', 'color': '#14B8A6'},
        {'name': 'Memory Assessment', 'description': 'Memory capacity and retention abilities', 'icon': 'cpu-chip', 'color': '#A855F7'},
        
        # Physical Categories
        {'name': 'Physical Fitness', 'description': 'Physical health and fitness assessment', 'icon': 'heart', 'color': '#DC2626'},
        {'name': 'Motor Skills', 'description': 'Fine and gross motor skill development', 'icon': 'hand-raised', 'color': '#059669'},
        {'name': 'Sports Assessment', 'description': 'Athletic abilities and sports performance', 'icon': 'trophy', 'color': '#D97706'},
        {'name': 'Health & Wellness', 'description': 'Overall health and wellness evaluation', 'icon': 'shield-check', 'color': '#7C3AED'},
        
        # Career Categories
        {'name': 'Career Aptitude', 'description': 'Career interests and aptitude assessment', 'icon': 'briefcase', 'color': '#0891B2'},
        {'name': 'Skill Assessment', 'description': 'Professional and technical skills evaluation', 'icon': 'wrench-screwdriver', 'color': '#65A30D'},
        {'name': 'Leadership Assessment', 'description': 'Leadership qualities and potential', 'icon': 'users', 'color': '#C2410C'},
        {'name': 'Communication Skills', 'description': 'Verbal and written communication abilities', 'icon': 'chat-bubble-left-right', 'color': '#7C2D12'},
        
        # Specialized Categories
        {'name': 'DMIT Assessment', 'description': 'Dermatoglyphics Multiple Intelligence Test', 'icon': 'finger-print', 'color': '#BE185D'},
        {'name': 'IQ Assessment', 'description': 'Intelligence quotient and cognitive abilities', 'icon': 'light-bulb', 'color': '#1D4ED8'},
        {'name': 'Creativity Assessment', 'description': 'Creative thinking and innovation skills', 'icon': 'sparkles', 'color': '#7C3AED'},
        {'name': 'Problem Solving', 'description': 'Analytical and problem-solving capabilities', 'icon': 'puzzle-piece', 'color': '#059669'},
    ]
    
    categories = []
    for cat_data in categories_data:
        category, created = TestCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        categories.append(category)
        if created:
            print(f"Created category: {category.name}")
    
    return categories


def generate_academic_tests(categories, admin_user):
    """Generate academic assessment tests."""
    academic_tests = []
    
    # Mathematics Tests
    math_category = next(cat for cat in categories if cat.name == 'Mathematics')
    math_tests = [
        {'title': 'Basic Arithmetic Mastery', 'description': 'Fundamental arithmetic operations and number sense', 'grade_levels': ['1', '2', '3'], 'difficulty': 'beginner'},
        {'title': 'Algebra Fundamentals', 'description': 'Introduction to algebraic thinking and equations', 'grade_levels': ['6', '7', '8'], 'difficulty': 'intermediate'},
        {'title': 'Geometry & Spatial Reasoning', 'description': 'Shapes, angles, and spatial visualization', 'grade_levels': ['4', '5', '6'], 'difficulty': 'intermediate'},
        {'title': 'Calculus Advanced', 'description': 'Differential and integral calculus concepts', 'grade_levels': ['11', '12'], 'difficulty': 'expert'},
        {'title': 'Statistics & Probability', 'description': 'Data analysis and probability concepts', 'grade_levels': ['9', '10', '11'], 'difficulty': 'advanced'},
        {'title': 'Trigonometry Mastery', 'description': 'Trigonometric functions and identities', 'grade_levels': ['10', '11'], 'difficulty': 'advanced'},
        {'title': 'Number Theory', 'description': 'Properties of numbers and mathematical proofs', 'grade_levels': ['11', '12'], 'difficulty': 'expert'},
        {'title': 'Linear Algebra', 'description': 'Vectors, matrices, and linear transformations', 'grade_levels': ['12'], 'difficulty': 'expert'},
    ]
    
    for test_data in math_tests:
        test = create_test(
            title=test_data['title'],
            description=test_data['description'],
            category=math_category,
            assessment_type='academic',
            grade_levels=test_data['grade_levels'],
            difficulty=test_data['difficulty'],
            duration_minutes=random.randint(45, 120),
            total_questions=random.randint(30, 80),
            created_by=admin_user
        )
        academic_tests.append(test)
    
    # Science Tests
    science_category = next(cat for cat in categories if cat.name == 'Science')
    science_tests = [
        {'title': 'Physics Fundamentals', 'description': 'Basic physics concepts and principles', 'grade_levels': ['9', '10'], 'difficulty': 'intermediate'},
        {'title': 'Chemistry Basics', 'description': 'Chemical reactions and periodic table', 'grade_levels': ['8', '9', '10'], 'difficulty': 'intermediate'},
        {'title': 'Biology Essentials', 'description': 'Cell biology and life processes', 'grade_levels': ['7', '8', '9'], 'difficulty': 'intermediate'},
        {'title': 'Environmental Science', 'description': 'Ecosystems and environmental conservation', 'grade_levels': ['6', '7', '8'], 'difficulty': 'intermediate'},
        {'title': 'Advanced Physics', 'description': 'Quantum mechanics and relativity', 'grade_levels': ['11', '12'], 'difficulty': 'expert'},
        {'title': 'Organic Chemistry', 'description': 'Carbon compounds and organic reactions', 'grade_levels': ['11', '12'], 'difficulty': 'expert'},
        {'title': 'Molecular Biology', 'description': 'DNA, RNA, and protein synthesis', 'grade_levels': ['11', '12'], 'difficulty': 'advanced'},
        {'title': 'Astronomy & Space', 'description': 'Solar system and cosmic phenomena', 'grade_levels': ['5', '6', '7'], 'difficulty': 'intermediate'},
    ]
    
    for test_data in science_tests:
        test = create_test(
            title=test_data['title'],
            description=test_data['description'],
            category=science_category,
            assessment_type='academic',
            grade_levels=test_data['grade_levels'],
            difficulty=test_data['difficulty'],
            duration_minutes=random.randint(45, 120),
            total_questions=random.randint(30, 80),
            created_by=admin_user
        )
        academic_tests.append(test)
    
    return academic_tests


def generate_psychological_tests(categories, admin_user):
    """Generate psychological assessment tests."""
    psych_tests = []
    
    # Personality Tests
    personality_category = next(cat for cat in categories if cat.name == 'Personality Assessment')
    personality_tests = [
        {'title': 'Big Five Personality Test', 'description': 'Comprehensive personality assessment based on OCEAN model', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Myers-Briggs Type Indicator', 'description': 'Personality type assessment and career guidance', 'target_audience': 'secondary', 'difficulty': 'intermediate'},
        {'title': 'DISC Personality Assessment', 'description': 'Behavioral style and communication preferences', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Enneagram Personality Test', 'description': 'Nine personality types and growth patterns', 'target_audience': 'adult', 'difficulty': 'advanced'},
        {'title': '16PF Personality Test', 'description': 'Comprehensive personality factor assessment', 'target_audience': 'adult', 'difficulty': 'advanced'},
        {'title': 'Holland Career Interest Test', 'description': 'Career interests and work environment preferences', 'target_audience': 'secondary', 'difficulty': 'intermediate'},
    ]
    
    for test_data in personality_tests:
        test = create_test(
            title=test_data['title'],
            description=test_data['description'],
            category=personality_category,
            assessment_type='personality',
            target_audience=test_data['target_audience'],
            difficulty=test_data['difficulty'],
            duration_minutes=random.randint(30, 90),
            total_questions=random.randint(50, 200),
            created_by=admin_user
        )
        psych_tests.append(test)
    
    # Cognitive Tests
    cognitive_category = next(cat for cat in categories if cat.name == 'Cognitive Assessment')
    cognitive_tests = [
        {'title': 'Working Memory Assessment', 'description': 'Short-term memory and information processing', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Processing Speed Test', 'description': 'Mental processing speed and efficiency', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Executive Function Assessment', 'description': 'Planning, organization, and self-regulation', 'target_audience': 'all_ages', 'difficulty': 'advanced'},
        {'title': 'Attention & Concentration Test', 'description': 'Focus and sustained attention abilities', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Visual-Spatial Reasoning', 'description': 'Spatial awareness and visual processing', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Verbal Reasoning Assessment', 'description': 'Language-based reasoning and comprehension', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
    ]
    
    for test_data in cognitive_tests:
        test = create_test(
            title=test_data['title'],
            description=test_data['description'],
            category=cognitive_category,
            assessment_type='cognitive',
            target_audience=test_data['target_audience'],
            difficulty=test_data['difficulty'],
            duration_minutes=random.randint(30, 90),
            total_questions=random.randint(40, 120),
            created_by=admin_user
        )
        psych_tests.append(test)
    
    return psych_tests


def generate_physical_tests(categories, admin_user):
    """Generate physical assessment tests."""
    physical_tests = []
    
    # Physical Fitness Tests
    fitness_category = next(cat for cat in categories if cat.name == 'Physical Fitness')
    fitness_tests = [
        {'title': 'Cardiovascular Endurance Test', 'description': 'Heart and lung fitness assessment', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Muscular Strength Assessment', 'description': 'Upper and lower body strength evaluation', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Flexibility & Mobility Test', 'description': 'Joint range of motion and flexibility', 'target_audience': 'all_ages', 'difficulty': 'beginner'},
        {'title': 'Body Composition Analysis', 'description': 'Body fat percentage and muscle mass', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Balance & Coordination Test', 'description': 'Postural stability and motor coordination', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'Agility & Speed Assessment', 'description': 'Quick movement and reaction time', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
    ]
    
    for test_data in fitness_tests:
        test = create_test(
            title=test_data['title'],
            description=test_data['description'],
            category=fitness_category,
            assessment_type='physical',
            target_audience=test_data['target_audience'],
            difficulty=test_data['difficulty'],
            duration_minutes=random.randint(20, 60),
            total_questions=random.randint(20, 50),
            created_by=admin_user
        )
        physical_tests.append(test)
    
    return physical_tests


def generate_career_tests(categories, admin_user):
    """Generate career assessment tests."""
    career_tests = []
    
    # Career Aptitude Tests
    career_category = next(cat for cat in categories if cat.name == 'Career Aptitude')
    career_aptitude_tests = [
        {'title': 'Career Interest Profiler', 'description': 'Comprehensive career interest assessment', 'target_audience': 'secondary', 'difficulty': 'intermediate'},
        {'title': 'Aptitude Test Suite', 'description': 'Multiple aptitude areas assessment', 'target_audience': 'secondary', 'difficulty': 'intermediate'},
        {'title': 'Work Values Assessment', 'description': 'Core work values and preferences', 'target_audience': 'secondary', 'difficulty': 'intermediate'},
        {'title': 'Skills Gap Analysis', 'description': 'Current skills vs. career requirements', 'target_audience': 'adult', 'difficulty': 'advanced'},
        {'title': 'Entrepreneurship Readiness', 'description': 'Entrepreneurial skills and mindset', 'target_audience': 'adult', 'difficulty': 'advanced'},
        {'title': 'Leadership Potential Assessment', 'description': 'Leadership qualities and development areas', 'target_audience': 'adult', 'difficulty': 'advanced'},
    ]
    
    for test_data in career_aptitude_tests:
        test = create_test(
            title=test_data['title'],
            description=test_data['description'],
            category=career_category,
            assessment_type='career',
            target_audience=test_data['target_audience'],
            difficulty=test_data['difficulty'],
            duration_minutes=random.randint(45, 120),
            total_questions=random.randint(60, 150),
            created_by=admin_user
        )
        career_tests.append(test)
    
    return career_tests


def generate_dmit_tests(categories, admin_user):
    """Generate DMIT assessment tests."""
    dmit_tests = []
    
    dmit_category = next(cat for cat in categories if cat.name == 'DMIT Assessment')
    dmit_test_data = [
        {'title': 'DMIT Complete Assessment', 'description': 'Comprehensive dermatoglyphics analysis for all intelligence types', 'target_audience': 'all_ages', 'difficulty': 'advanced'},
        {'title': 'DMIT Learning Style Analysis', 'description': 'Preferred learning methods and study techniques', 'target_audience': 'all_ages', 'difficulty': 'intermediate'},
        {'title': 'DMIT Career Guidance', 'description': 'Career recommendations based on fingerprint analysis', 'target_audience': 'secondary', 'difficulty': 'advanced'},
        {'title': 'DMIT Talent Identification', 'description': 'Natural talents and hidden potential discovery', 'target_audience': 'all_ages', 'difficulty': 'advanced'},
        {'title': 'DMIT Parent-Child Compatibility', 'description': 'Understanding parent-child relationship dynamics', 'target_audience': 'adult', 'difficulty': 'intermediate'},
    ]
    
    for test_data in dmit_test_data:
        test = create_test(
            title=test_data['title'],
            description=test_data['description'],
            category=dmit_category,
            assessment_type='dmit',
            target_audience=test_data['target_audience'],
            difficulty=test_data['difficulty'],
            duration_minutes=random.randint(60, 180),
            total_questions=random.randint(30, 80),
            created_by=admin_user
        )
        dmit_tests.append(test)
    
    return dmit_tests


def create_test(title, description, category, assessment_type, created_by, **kwargs):
    """Create a test with default values and random analytics."""
    slug = title.lower().replace(' ', '-').replace('&', 'and').replace(',', '').replace('(', '').replace(')', '')
    
    # Generate random AI analytics
    ai_insights = {
        'success_rate': round(random.uniform(70, 95), 1),
        'avg_score': round(random.uniform(60, 85), 1),
        'completion_rate': round(random.uniform(80, 98), 1),
        'difficulty_rating': round(random.uniform(2.5, 4.5), 1),
        'recommended_for': random.choice([
            'Students seeking academic improvement',
            'Parents wanting to understand their child better',
            'Career changers exploring new paths',
            'Individuals interested in self-discovery',
            'Professionals seeking skill development'
        ]),
        'key_benefits': random.sample([
            'Comprehensive analysis',
            'Personalized recommendations',
            'Detailed insights',
            'Actionable results',
            'Professional guidance'
        ], 3)
    }
    
    # Generate learning outcomes
    learning_outcomes = [
        f"Understand {title.lower()} concepts",
        "Identify strengths and areas for improvement",
        "Receive personalized recommendations",
        "Gain insights into learning preferences"
    ]
    
    # Generate tags
    tags = [assessment_type, category.name.lower(), kwargs.get('difficulty', 'intermediate')]
    if 'grade_levels' in kwargs:
        tags.extend([f"grade-{g}" for g in kwargs['grade_levels'][:2]])
    
    test = TestCatalog.objects.create(
        title=title,
        slug=slug,
        description=description,
        short_description=description[:200] + "..." if len(description) > 200 else description,
        category=category,
        assessment_type=assessment_type,
        curriculum=kwargs.get('curriculum', 'GENERAL'),
        target_audience=kwargs.get('target_audience', 'all_ages'),
        grade_levels=kwargs.get('grade_levels', []),
        age_range_min=kwargs.get('age_range_min', 5),
        age_range_max=kwargs.get('age_range_max', 18),
        difficulty=kwargs.get('difficulty', 'intermediate'),
        duration_minutes=kwargs.get('duration_minutes', 60),
        total_questions=kwargs.get('total_questions', 50),
        passing_score=kwargs.get('passing_score', 40.0),
        max_score=kwargs.get('max_score', 100.0),
        price_inr=kwargs.get('price_inr', 99.00),
        is_free=kwargs.get('is_free', False),
        is_premium=kwargs.get('is_premium', True),
        is_featured=kwargs.get('is_featured', False),
        is_popular=kwargs.get('is_popular', False),
        is_new=kwargs.get('is_new', False),
        ai_insights=ai_insights,
        success_rate=ai_insights['success_rate'],
        average_score=ai_insights['avg_score'],
        completion_rate=ai_insights['completion_rate'],
        instructions=f"Complete all questions to the best of your ability. Take your time and read each question carefully.",
        prerequisites=kwargs.get('prerequisites', 'No prerequisites required'),
        learning_outcomes=learning_outcomes,
        tags=tags,
        icon_name=category.icon,
        total_attempts=random.randint(0, 1000),
        total_completions=random.randint(0, 800),
        average_rating=round(random.uniform(3.5, 5.0), 1),
        total_ratings=random.randint(0, 200),
        is_active=True,
        is_published=True,
        created_by=created_by,
        published_at=datetime.now() - timedelta(days=random.randint(1, 365))
    )
    
    return test


def main():
    """Main function to generate test catalog."""
    print("Starting test catalog generation...")
    
    # Get or create admin user
    try:
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@edusight.com',
                password='admin123',
                is_superuser=True,
                is_staff=True
            )
            print("Created admin user")
    except Exception as e:
        print(f"Error creating admin user: {e}")
        return
    
    # Create categories
    print("Creating test categories...")
    categories = create_test_categories()
    
    # Generate tests by category
    all_tests = []
    
    print("Generating academic tests...")
    academic_tests = generate_academic_tests(categories, admin_user)
    all_tests.extend(academic_tests)
    
    print("Generating psychological tests...")
    psych_tests = generate_psychological_tests(categories, admin_user)
    all_tests.extend(psych_tests)
    
    print("Generating physical tests...")
    physical_tests = generate_physical_tests(categories, admin_user)
    all_tests.extend(physical_tests)
    
    print("Generating career tests...")
    career_tests = generate_career_tests(categories, admin_user)
    all_tests.extend(career_tests)
    
    print("Generating DMIT tests...")
    dmit_tests = generate_dmit_tests(categories, admin_user)
    all_tests.extend(dmit_tests)
    
    # Generate additional tests to reach 1000+
    print("Generating additional tests to reach 1000+...")
    additional_tests_needed = 1000 - len(all_tests)
    
    for i in range(additional_tests_needed):
        category = random.choice(categories)
        assessment_type = random.choice(['academic', 'psychological', 'physical', 'career', 'aptitude', 'personality', 'cognitive', 'behavioral'])
        
        # Generate random test data
        test_titles = [
            f"Advanced {category.name} Assessment {i+1}",
            f"Comprehensive {category.name} Evaluation {i+1}",
            f"Professional {category.name} Test {i+1}",
            f"Expert {category.name} Analysis {i+1}",
            f"Master {category.name} Assessment {i+1}",
        ]
        
        title = random.choice(test_titles)
        description = f"Comprehensive assessment covering various aspects of {category.name.lower()}. Designed to provide detailed insights and personalized recommendations."
        
        test = create_test(
            title=title,
            description=description,
            category=category,
            assessment_type=assessment_type,
            target_audience=random.choice(['primary', 'middle', 'secondary', 'senior_secondary', 'adult', 'all_ages']),
            difficulty=random.choice(['beginner', 'intermediate', 'advanced', 'expert']),
            duration_minutes=random.randint(30, 180),
            total_questions=random.randint(20, 100),
            created_by=admin_user
        )
        all_tests.append(test)
        
        if (i + 1) % 100 == 0:
            print(f"Generated {i + 1} additional tests...")
    
    print(f"\nTest catalog generation completed!")
    print(f"Total categories created: {len(categories)}")
    print(f"Total tests created: {len(all_tests)}")
    print(f"Tests by type:")
    
    # Count tests by type
    type_counts = {}
    for test in all_tests:
        type_counts[test.assessment_type] = type_counts.get(test.assessment_type, 0) + 1
    
    for test_type, count in type_counts.items():
        print(f"  {test_type}: {count}")


if __name__ == '__main__':
    main()
