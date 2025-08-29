"""
Psychometric Test Service
Automatic test recommendations and triggers based on student data
"""

from django.utils import timezone
from django.db.models import Q
from datetime import datetime, timedelta
import logging

from .psychometric_models import (
    PsychometricTest, TestRecommendation, AgeGroup, 
    PsychometricTestCategory, TestSession
)
from students.models import Student

logger = logging.getLogger(__name__)


class PsychometricTestService:
    """Service for managing psychometric test recommendations and triggers"""
    
    @classmethod
    def trigger_recommendations_for_student(cls, student, trigger_type='new_student'):
        """
        Generate test recommendations for a student based on various triggers
        """
        try:
            age = cls._calculate_age(student.date_of_birth)
            grade_level = cls._extract_grade_number(student.grade)
            
            # Get appropriate age group
            age_group = cls._get_age_group_for_student(age, grade_level)
            if not age_group:
                logger.warning(f"No age group found for student {student} (age: {age}, grade: {grade_level})")
                return []
            
            recommendations = []
            
            # Core recommendations based on trigger type
            if trigger_type == 'new_student':
                recommendations.extend(cls._get_new_student_recommendations(student, age_group))
            elif trigger_type == 'grade_transition':
                recommendations.extend(cls._get_grade_transition_recommendations(student, age_group))
            elif trigger_type == 'age_milestone':
                recommendations.extend(cls._get_age_milestone_recommendations(student, age_group))
            elif trigger_type == 'performance_concern':
                recommendations.extend(cls._get_performance_concern_recommendations(student, age_group))
            elif trigger_type == 'parent_request':
                recommendations.extend(cls._get_parent_request_recommendations(student, age_group))
            
            # Create recommendation records
            created_recommendations = []
            for rec_data in recommendations:
                recommendation = TestRecommendation.objects.create(
                    student=student,
                    recommended_test=rec_data['test'],
                    trigger_type=trigger_type,
                    priority_level=rec_data['priority'],
                    recommendation_reason=rec_data['reason'],
                    expires_at=timezone.now() + timedelta(days=rec_data.get('expires_days', 30))
                )
                created_recommendations.append(recommendation)
            
            logger.info(f"Created {len(created_recommendations)} recommendations for {student}")
            return created_recommendations
            
        except Exception as e:
            logger.error(f"Error creating recommendations for {student}: {str(e)}")
            return []
    
    @classmethod
    def _get_new_student_recommendations(cls, student, age_group):
        """Get recommendations for new student registration"""
        recommendations = []
        
        # Essential baseline assessments for all new students
        essential_categories = [
            'cognitive', 'emotional', 'social', 'learning_style'
        ]
        
        for category in essential_categories:
            tests = PsychometricTest.objects.filter(
                age_group=age_group,
                category__category_type=category,
                is_active=True,
                is_validated=True
            ).order_by('difficulty_level')[:1]  # Get easiest test first
            
            for test in tests:
                priority = 'high' if category in ['cognitive', 'learning_style'] else 'medium'
                recommendations.append({
                    'test': test,
                    'priority': priority,
                    'reason': f'Baseline {category} assessment for new student registration',
                    'expires_days': 45
                })
        
        return recommendations
    
    @classmethod
    def _get_grade_transition_recommendations(cls, student, age_group):
        """Get recommendations for students transitioning grades"""
        recommendations = []
        
        # Grade transition assessments
        transition_categories = ['cognitive', 'emotional', 'stress', 'motivation']
        
        for category in transition_categories:
            tests = PsychometricTest.objects.filter(
                age_group=age_group,
                category__category_type=category,
                is_active=True
            )[:1]
            
            for test in tests:
                recommendations.append({
                    'test': test,
                    'priority': 'medium',
                    'reason': f'Grade transition assessment - monitoring {category} development',
                    'expires_days': 30
                })
        
        return recommendations
    
    @classmethod
    def _get_age_milestone_recommendations(cls, student, age_group):
        """Get recommendations for age milestones"""
        recommendations = []
        age = cls._calculate_age(student.date_of_birth)
        
        # Key developmental milestones
        milestone_ages = {
            6: ['cognitive', 'social'],  # School readiness
            9: ['cognitive', 'emotional'],  # Middle childhood
            12: ['emotional', 'social', 'stress'],  # Pre-adolescence
            15: ['personality', 'stress', 'motivation'],  # Adolescence
            17: ['personality', 'motivation', 'communication']  # Late adolescence
        }
        
        if age in milestone_ages:
            for category in milestone_ages[age]:
                tests = PsychometricTest.objects.filter(
                    age_group=age_group,
                    category__category_type=category,
                    is_active=True
                )[:1]
                
                for test in tests:
                    recommendations.append({
                        'test': test,
                        'priority': 'medium',
                        'reason': f'Age {age} developmental milestone assessment',
                        'expires_days': 60
                    })
        
        return recommendations
    
    @classmethod
    def _get_performance_concern_recommendations(cls, student, age_group):
        """Get recommendations for performance concerns"""
        recommendations = []
        
        # Focus on learning and attention
        concern_categories = ['cognitive', 'attention', 'memory', 'learning_style', 'stress']
        
        for category in concern_categories:
            tests = PsychometricTest.objects.filter(
                age_group=age_group,
                category__category_type=category,
                is_active=True
            )[:1]
            
            for test in tests:
                priority = 'high' if category in ['cognitive', 'attention'] else 'medium'
                recommendations.append({
                    'test': test,
                    'priority': priority,
                    'reason': f'Performance concern - {category} assessment needed',
                    'expires_days': 14
                })
        
        return recommendations
    
    @classmethod
    def _get_parent_request_recommendations(cls, student, age_group):
        """Get recommendations based on parent request"""
        recommendations = []
        
        # Comprehensive assessment suite
        all_categories = [
            'cognitive', 'emotional', 'social', 'behavioral', 
            'learning_style', 'attention', 'creativity'
        ]
        
        for category in all_categories:
            tests = PsychometricTest.objects.filter(
                age_group=age_group,
                category__category_type=category,
                is_active=True
            )[:1]
            
            for test in tests:
                recommendations.append({
                    'test': test,
                    'priority': 'medium',
                    'reason': f'Parent-requested comprehensive {category} assessment',
                    'expires_days': 60
                })
        
        return recommendations
    
    @classmethod
    def get_pending_recommendations(cls, student):
        """Get all pending recommendations for a student"""
        return TestRecommendation.objects.filter(
            student=student,
            parent_response='pending',
            expires_at__gt=timezone.now()
        ).select_related('recommended_test', 'recommended_test__category').order_by('-priority_level', '-created_at')
    
    @classmethod
    def get_age_appropriate_tests(cls, student):
        """Get all age-appropriate tests for a student"""
        age = cls._calculate_age(student.date_of_birth)
        grade_level = cls._extract_grade_number(student.grade)
        age_group = cls._get_age_group_for_student(age, grade_level)
        
        if not age_group:
            return PsychometricTest.objects.none()
        
        return PsychometricTest.objects.filter(
            age_group=age_group,
            is_active=True
        ).select_related('category', 'age_group')
    
    @classmethod
    def check_test_completion_status(cls, student):
        """Check which tests the student has completed"""
        completed_tests = TestSession.objects.filter(
            student=student,
            status='completed'
        ).values_list('test_id', flat=True)
        
        age_appropriate_tests = cls.get_age_appropriate_tests(student)
        
        status = {
            'completed': list(completed_tests),
            'pending': [],
            'recommended': [],
            'completion_rate': 0
        }
        
        total_tests = age_appropriate_tests.count()
        if total_tests > 0:
            status['completion_rate'] = (len(completed_tests) / total_tests) * 100
        
        # Get pending and recommended tests
        for test in age_appropriate_tests:
            if test.id not in completed_tests:
                if TestRecommendation.objects.filter(
                    student=student, 
                    recommended_test=test,
                    parent_response='pending'
                ).exists():
                    status['recommended'].append(test.id)
                else:
                    status['pending'].append(test.id)
        
        return status
    
    @classmethod
    def _calculate_age(cls, birth_date):
        """Calculate age in years"""
        today = timezone.now().date()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    
    @classmethod
    def _extract_grade_number(cls, grade_str):
        """Extract numeric grade from grade string"""
        import re
        if not grade_str:
            return 0
        
        # Handle special cases
        grade_lower = grade_str.lower()
        if 'nursery' in grade_lower or 'pre' in grade_lower:
            return 0
        if 'kg' in grade_lower or 'kindergarten' in grade_lower:
            return 0
        
        # Extract number
        numbers = re.findall(r'\d+', grade_str)
        return int(numbers[0]) if numbers else 0
    
    @classmethod
    def _get_age_group_for_student(cls, age, grade_level):
        """Get appropriate age group for student"""
        # First try by age
        age_group = AgeGroup.objects.filter(
            min_age__lte=age,
            max_age__gte=age
        ).first()
        
        if age_group:
            return age_group
        
        # Fallback to grade-based mapping
        grade_mappings = {
            0: 'Early Childhood',  # Nursery/KG
            1: 'Elementary',
            2: 'Elementary',
            3: 'Elementary',
            4: 'Elementary',
            5: 'Elementary',
            6: 'Middle School',
            7: 'Middle School',
            8: 'Middle School',
            9: 'High School',
            10: 'High School',
            11: 'High School',
            12: 'High School',
        }
        
        group_name = grade_mappings.get(grade_level, 'Elementary')
        return AgeGroup.objects.filter(name=group_name).first()


class TestNotificationService:
    """Service for managing test notifications and popups"""
    
    @classmethod
    def create_popup_notification(cls, student, recommendations):
        """Create popup notification data for parent dashboard"""
        if not recommendations:
            return None
        
        # Group recommendations by priority
        high_priority = [r for r in recommendations if r.priority_level == 'high']
        medium_priority = [r for r in recommendations if r.priority_level == 'medium']
        
        notification_data = {
            'student_name': student.user.get_full_name(),
            'student_id': student.id,
            'total_recommendations': len(recommendations),
            'high_priority_count': len(high_priority),
            'message': cls._generate_popup_message(student, high_priority, medium_priority),
            'recommendations': [
                {
                    'id': rec.id,
                    'test_name': rec.recommended_test.name,
                    'category': rec.recommended_test.category.name,
                    'priority': rec.priority_level,
                    'reason': rec.recommendation_reason,
                    'duration': rec.recommended_test.duration_minutes,
                    'description': rec.recommended_test.description,
                    'age_appropriate': True
                }
                for rec in recommendations[:5]  # Limit to top 5
            ],
            'show_popup': True,
            'popup_type': 'urgent' if high_priority else 'standard'
        }
        
        return notification_data
    
    @classmethod
    def _generate_popup_message(cls, student, high_priority, medium_priority):
        """Generate appropriate popup message"""
        student_name = student.user.first_name
        
        if high_priority:
            return f"Important psychological assessments are recommended for {student_name} based on their profile. These tests will help us better understand their development and provide personalized guidance."
        elif medium_priority:
            return f"We've identified some beneficial psychological assessments for {student_name} that could provide valuable insights into their learning style and development."
        else:
            return f"Optional psychological assessments are available for {student_name} to enhance their learning experience."
    
    @classmethod
    def get_dashboard_notifications(cls, parent_user):
        """Get all notifications for parent dashboard"""
        from students.models import Student
        
        students = Student.objects.filter(parent__user=parent_user)
        all_notifications = []
        
        for student in students:
            recommendations = PsychometricTestService.get_pending_recommendations(student)
            if recommendations:
                notification = cls.create_popup_notification(student, recommendations)
                if notification:
                    all_notifications.append(notification)
        
        return all_notifications
