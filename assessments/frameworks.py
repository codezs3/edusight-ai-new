"""
Comprehensive Assessment Frameworks for EduSight Platform
Implements academic, physical, psychological, and career mapping frameworks
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import json
from decimal import Decimal

User = get_user_model()


class AcademicFramework(models.Model):
    """Academic assessment framework based on various educational standards"""
    
    FRAMEWORK_CHOICES = [
        ('cbse', 'CBSE (Central Board of Secondary Education)'),
        ('icse', 'ICSE (Indian Certificate of Secondary Education)'),
        ('ib', 'IB (International Baccalaureate)'),
        ('igcse', 'IGCSE (International General Certificate of Secondary Education)'),
        ('cambridge', 'Cambridge International'),
        ('state_board', 'State Board'),
        ('ncert', 'NCERT Framework'),
        ('nep_2020', 'NEP 2020 Framework'),
    ]
    
    GRADE_LEVELS = [
        ('nursery', 'Nursery'),
        ('lkg', 'LKG'),
        ('ukg', 'UKG'),
        ('grade_1', 'Grade 1'),
        ('grade_2', 'Grade 2'),
        ('grade_3', 'Grade 3'),
        ('grade_4', 'Grade 4'),
        ('grade_5', 'Grade 5'),
        ('grade_6', 'Grade 6'),
        ('grade_7', 'Grade 7'),
        ('grade_8', 'Grade 8'),
        ('grade_9', 'Grade 9'),
        ('grade_10', 'Grade 10'),
        ('grade_11', 'Grade 11'),
        ('grade_12', 'Grade 12'),
    ]
    
    name = models.CharField(max_length=100)
    framework_type = models.CharField(max_length=20, choices=FRAMEWORK_CHOICES)
    grade_level = models.CharField(max_length=20, choices=GRADE_LEVELS)
    subject_areas = models.JSONField(default=list)  # List of subjects
    learning_objectives = models.JSONField(default=dict)  # Subject-wise objectives
    assessment_criteria = models.JSONField(default=dict)  # Grading criteria
    competency_levels = models.JSONField(default=dict)  # Skill level definitions
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['framework_type', 'grade_level']
        
    def __str__(self):
        return f"{self.get_framework_type_display()} - {self.get_grade_level_display()}"
    
    def get_subject_competencies(self, subject):
        """Get competency levels for a specific subject"""
        return self.competency_levels.get(subject, {})
    
    def calculate_grade(self, score, subject=None):
        """Calculate grade based on score and assessment criteria"""
        criteria = self.assessment_criteria.get(subject, self.assessment_criteria.get('default', {}))
        
        if score >= criteria.get('A+', 95):
            return 'A+'
        elif score >= criteria.get('A', 85):
            return 'A'
        elif score >= criteria.get('B+', 75):
            return 'B+'
        elif score >= criteria.get('B', 65):
            return 'B'
        elif score >= criteria.get('C+', 55):
            return 'C+'
        elif score >= criteria.get('C', 45):
            return 'C'
        elif score >= criteria.get('D', 35):
            return 'D'
        else:
            return 'F'


class PhysicalEducationFramework(models.Model):
    """Physical education and fitness assessment framework"""
    
    FRAMEWORK_TYPES = [
        ('fitness_gram', 'FitnessGram'),
        ('presidential', 'Presidential Youth Fitness'),
        ('eurofit', 'Eurofit'),
        ('aahperd', 'AAHPERD Health Related Fitness'),
        ('cooper', 'Cooper Institute Standards'),
        ('indian_fitness', 'Indian Fitness Standards'),
        ('who_standards', 'WHO Physical Activity Standards'),
    ]
    
    AGE_GROUPS = [
        ('5-7', '5-7 years'),
        ('8-10', '8-10 years'),
        ('11-13', '11-13 years'),
        ('14-16', '14-16 years'),
        ('17-18', '17-18 years'),
    ]
    
    name = models.CharField(max_length=100)
    framework_type = models.CharField(max_length=20, choices=FRAMEWORK_TYPES)
    age_group = models.CharField(max_length=10, choices=AGE_GROUPS)
    fitness_components = models.JSONField(default=dict)  # Cardio, strength, flexibility, etc.
    motor_skills = models.JSONField(default=dict)  # Fine and gross motor skills
    assessment_tests = models.JSONField(default=dict)  # Specific tests and benchmarks
    health_indicators = models.JSONField(default=dict)  # BMI, body composition, etc.
    performance_standards = models.JSONField(default=dict)  # Age/gender specific standards
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['framework_type', 'age_group']
        
    def __str__(self):
        return f"{self.get_framework_type_display()} - {self.age_group}"
    
    def assess_fitness_level(self, test_results, age, gender):
        """Assess overall fitness level based on test results"""
        standards = self.performance_standards.get(f"{age}_{gender}", {})
        fitness_scores = {}
        
        for component, result in test_results.items():
            standard = standards.get(component, {})
            if result >= standard.get('excellent', float('inf')):
                fitness_scores[component] = 'Excellent'
            elif result >= standard.get('good', float('inf')):
                fitness_scores[component] = 'Good'
            elif result >= standard.get('fair', float('inf')):
                fitness_scores[component] = 'Fair'
            elif result >= standard.get('needs_improvement', 0):
                fitness_scores[component] = 'Needs Improvement'
            else:
                fitness_scores[component] = 'Poor'
                
        return fitness_scores
    
    def calculate_motor_skills_score(self, skill_assessments):
        """Calculate motor skills development score"""
        total_score = 0
        assessed_skills = 0
        
        for skill_category, skills in self.motor_skills.items():
            for skill, weight in skills.items():
                if skill in skill_assessments:
                    total_score += skill_assessments[skill] * weight
                    assessed_skills += weight
                    
        return (total_score / assessed_skills * 100) if assessed_skills > 0 else 0


class PsychologicalFramework(models.Model):
    """Psychological and cognitive assessment framework"""
    
    FRAMEWORK_TYPES = [
        ('gardner_mi', 'Gardner Multiple Intelligences'),
        ('bloom_taxonomy', 'Bloom\'s Taxonomy'),
        ('eq_framework', 'Emotional Intelligence Framework'),
        ('big_five', 'Big Five Personality Traits'),
        ('sternberg_triarchic', 'Sternberg Triarchic Theory'),
        ('goleman_ei', 'Goleman Emotional Intelligence'),
        ('sel_framework', 'Social Emotional Learning'),
        ('resilience_framework', 'Resilience Assessment'),
        ('mindset_framework', 'Growth Mindset Assessment'),
    ]
    
    DEVELOPMENTAL_STAGES = [
        ('early_childhood', 'Early Childhood (3-6 years)'),
        ('middle_childhood', 'Middle Childhood (7-11 years)'),
        ('adolescence', 'Adolescence (12-18 years)'),
        ('young_adult', 'Young Adult (19-25 years)'),
    ]
    
    name = models.CharField(max_length=100)
    framework_type = models.CharField(max_length=30, choices=FRAMEWORK_TYPES)
    developmental_stage = models.CharField(max_length=20, choices=DEVELOPMENTAL_STAGES)
    cognitive_domains = models.JSONField(default=dict)  # Memory, attention, processing, etc.
    emotional_domains = models.JSONField(default=dict)  # Self-awareness, empathy, regulation
    social_domains = models.JSONField(default=dict)  # Communication, collaboration, leadership
    behavioral_indicators = models.JSONField(default=dict)  # Observable behaviors
    assessment_methods = models.JSONField(default=dict)  # Tests, observations, questionnaires
    intervention_strategies = models.JSONField(default=dict)  # Support strategies
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['framework_type', 'developmental_stage']
        
    def __str__(self):
        return f"{self.get_framework_type_display()} - {self.get_developmental_stage_display()}"
    
    def assess_cognitive_abilities(self, assessment_results):
        """Assess cognitive abilities based on framework"""
        cognitive_profile = {}
        
        for domain, indicators in self.cognitive_domains.items():
            domain_score = 0
            domain_count = 0
            
            for indicator, weight in indicators.items():
                if indicator in assessment_results:
                    domain_score += assessment_results[indicator] * weight
                    domain_count += weight
                    
            if domain_count > 0:
                cognitive_profile[domain] = domain_score / domain_count
                
        return cognitive_profile
    
    def assess_emotional_intelligence(self, assessment_results):
        """Assess emotional intelligence components"""
        ei_profile = {}
        
        for domain, indicators in self.emotional_domains.items():
            domain_score = 0
            domain_count = 0
            
            for indicator, weight in indicators.items():
                if indicator in assessment_results:
                    domain_score += assessment_results[indicator] * weight
                    domain_count += weight
                    
            if domain_count > 0:
                ei_profile[domain] = domain_score / domain_count
                
        return ei_profile
    
    def generate_intervention_plan(self, weak_areas):
        """Generate intervention strategies for identified weak areas"""
        interventions = []
        
        for area in weak_areas:
            if area in self.intervention_strategies:
                interventions.extend(self.intervention_strategies[area])
                
        return interventions


class CareerMappingFramework(models.Model):
    """Career guidance and mapping framework"""
    
    FRAMEWORK_TYPES = [
        ('holland_riasec', 'Holland RIASEC Model'),
        ('super_career', 'Super Career Development Theory'),
        ('gottfredson', 'Gottfredson Theory'),
        ('social_cognitive', 'Social Cognitive Career Theory'),
        ('values_based', 'Values-Based Career Framework'),
        ('skills_based', 'Skills-Based Career Mapping'),
        ('personality_career', 'Personality-Career Fit Model'),
        ('industry_4_0', 'Industry 4.0 Career Framework'),
    ]
    
    EDUCATION_LEVELS = [
        ('high_school', 'High School'),
        ('undergraduate', 'Undergraduate'),
        ('graduate', 'Graduate'),
        ('professional', 'Professional'),
        ('vocational', 'Vocational Training'),
    ]
    
    name = models.CharField(max_length=100)
    framework_type = models.CharField(max_length=30, choices=FRAMEWORK_TYPES)
    target_education_level = models.CharField(max_length=20, choices=EDUCATION_LEVELS)
    career_clusters = models.JSONField(default=dict)  # Industry clusters
    skill_requirements = models.JSONField(default=dict)  # Skills needed for careers
    personality_matches = models.JSONField(default=dict)  # Personality-career matches
    market_trends = models.JSONField(default=dict)  # Job market trends
    education_pathways = models.JSONField(default=dict)  # Educational requirements
    salary_information = models.JSONField(default=dict)  # Salary ranges
    growth_projections = models.JSONField(default=dict)  # Career growth data
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['framework_type', 'target_education_level']
        
    def __str__(self):
        return f"{self.get_framework_type_display()} - {self.get_target_education_level_display()}"
    
    def match_careers(self, student_profile):
        """Match careers based on student profile"""
        career_matches = {}
        
        # Skills-based matching
        student_skills = student_profile.get('skills', {})
        for career, required_skills in self.skill_requirements.items():
            match_score = 0
            for skill, importance in required_skills.items():
                if skill in student_skills:
                    match_score += student_skills[skill] * importance
            career_matches[career] = match_score
            
        # Personality-based matching
        student_personality = student_profile.get('personality', {})
        for career, personality_fit in self.personality_matches.items():
            personality_score = 0
            for trait, weight in personality_fit.items():
                if trait in student_personality:
                    personality_score += student_personality[trait] * weight
            if career in career_matches:
                career_matches[career] = (career_matches[career] + personality_score) / 2
            else:
                career_matches[career] = personality_score
                
        # Sort by match score
        sorted_matches = sorted(career_matches.items(), key=lambda x: x[1], reverse=True)
        return sorted_matches
    
    def get_career_pathway(self, career):
        """Get educational and skill development pathway for a career"""
        pathway = {
            'education_requirements': self.education_pathways.get(career, {}),
            'key_skills': self.skill_requirements.get(career, {}),
            'growth_projection': self.growth_projections.get(career, {}),
            'salary_range': self.salary_information.get(career, {}),
            'market_demand': self.market_trends.get(career, {})
        }
        return pathway


class MLAssessmentModel(models.Model):
    """Machine Learning models for assessment predictions"""
    
    MODEL_TYPES = [
        ('academic_predictor', 'Academic Performance Predictor'),
        ('behavioral_analyzer', 'Behavioral Pattern Analyzer'),
        ('career_recommender', 'Career Recommendation Engine'),
        ('learning_style', 'Learning Style Classifier'),
        ('risk_identifier', 'At-Risk Student Identifier'),
        ('skill_assessor', 'Skill Level Assessor'),
        ('personality_analyzer', 'Personality Trait Analyzer'),
        ('potential_predictor', 'Potential Development Predictor'),
    ]
    
    ALGORITHM_TYPES = [
        ('random_forest', 'Random Forest'),
        ('neural_network', 'Neural Network'),
        ('svm', 'Support Vector Machine'),
        ('gradient_boosting', 'Gradient Boosting'),
        ('decision_tree', 'Decision Tree'),
        ('naive_bayes', 'Naive Bayes'),
        ('ensemble', 'Ensemble Method'),
    ]
    
    name = models.CharField(max_length=100)
    model_type = models.CharField(max_length=30, choices=MODEL_TYPES)
    algorithm_type = models.CharField(max_length=20, choices=ALGORITHM_TYPES)
    version = models.CharField(max_length=10, default='1.0')
    accuracy_score = models.DecimalField(max_digits=5, decimal_places=4, null=True, blank=True)
    training_data_size = models.IntegerField(default=0)
    feature_importance = models.JSONField(default=dict)  # Feature importance scores
    model_parameters = models.JSONField(default=dict)  # Model hyperparameters
    validation_metrics = models.JSONField(default=dict)  # Validation results
    is_active = models.BooleanField(default=True)
    is_trained = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} v{self.version}"
    
    def predict(self, input_data):
        """Make predictions using the ML model"""
        # This would interface with the actual ML model
        # For now, returning a placeholder
        return {
            'prediction': 0.75,
            'confidence': 0.85,
            'features_used': list(input_data.keys()),
            'model_version': self.version
        }
    
    def get_feature_importance(self):
        """Get feature importance for model interpretability"""
        return self.feature_importance
    
    def update_training_data(self, new_data_size):
        """Update training data size"""
        self.training_data_size += new_data_size
        self.save()


class ComprehensiveAssessment(models.Model):
    """Comprehensive assessment combining all frameworks"""
    
    ASSESSMENT_TYPES = [
        ('initial', 'Initial Assessment'),
        ('periodic', 'Periodic Review'),
        ('progress', 'Progress Assessment'),
        ('diagnostic', 'Diagnostic Assessment'),
        ('comprehensive', 'Comprehensive Evaluation'),
    ]
    
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE)
    assessment_type = models.CharField(max_length=20, choices=ASSESSMENT_TYPES)
    academic_framework = models.ForeignKey(AcademicFramework, on_delete=models.CASCADE)
    pe_framework = models.ForeignKey(PhysicalEducationFramework, on_delete=models.CASCADE, null=True, blank=True)
    psychological_framework = models.ForeignKey(PsychologicalFramework, on_delete=models.CASCADE, null=True, blank=True)
    career_framework = models.ForeignKey(CareerMappingFramework, on_delete=models.CASCADE, null=True, blank=True)
    
    # Assessment Results
    academic_scores = models.JSONField(default=dict)  # Subject-wise scores
    physical_scores = models.JSONField(default=dict)  # Fitness and motor skills
    psychological_scores = models.JSONField(default=dict)  # Cognitive and emotional
    career_interests = models.JSONField(default=dict)  # Career preferences and aptitudes
    
    # ML Predictions
    ml_predictions = models.JSONField(default=dict)  # ML model predictions
    confidence_scores = models.JSONField(default=dict)  # Prediction confidence
    
    # Overall Results
    overall_score = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    strengths = models.JSONField(default=list)  # Identified strengths
    areas_for_improvement = models.JSONField(default=list)  # Areas needing work
    recommendations = models.JSONField(default=list)  # Personalized recommendations
    
    assessed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    assessment_date = models.DateTimeField(default=timezone.now)
    is_finalized = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-assessment_date']
        
    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.get_assessment_type_display()} ({self.assessment_date.date()})"
    
    def calculate_overall_score(self):
        """Calculate weighted overall score across all domains"""
        weights = {
            'academic': 0.40,
            'physical': 0.20,
            'psychological': 0.25,
            'career': 0.15
        }
        
        scores = {
            'academic': self.get_academic_average(),
            'physical': self.get_physical_average(),
            'psychological': self.get_psychological_average(),
            'career': self.get_career_average()
        }
        
        weighted_sum = sum(scores[domain] * weights[domain] for domain in weights.keys() if scores[domain] is not None)
        total_weight = sum(weights[domain] for domain in weights.keys() if scores[domain] is not None)
        
        self.overall_score = weighted_sum / total_weight if total_weight > 0 else 0
        self.save()
        return self.overall_score
    
    def get_academic_average(self):
        """Calculate average academic score"""
        if not self.academic_scores:
            return None
        scores = [score for score in self.academic_scores.values() if isinstance(score, (int, float))]
        return sum(scores) / len(scores) if scores else None
    
    def get_physical_average(self):
        """Calculate average physical score"""
        if not self.physical_scores:
            return None
        scores = [score for score in self.physical_scores.values() if isinstance(score, (int, float))]
        return sum(scores) / len(scores) if scores else None
    
    def get_psychological_average(self):
        """Calculate average psychological score"""
        if not self.psychological_scores:
            return None
        scores = [score for score in self.psychological_scores.values() if isinstance(score, (int, float))]
        return sum(scores) / len(scores) if scores else None
    
    def get_career_average(self):
        """Calculate average career readiness score"""
        if not self.career_interests:
            return None
        scores = [score for score in self.career_interests.values() if isinstance(score, (int, float))]
        return sum(scores) / len(scores) if scores else None
    
    def generate_ml_predictions(self):
        """Generate ML predictions for the assessment"""
        # This would use the actual ML models
        predictions = {}
        
        # Academic performance prediction
        if self.academic_scores:
            predictions['academic_trajectory'] = {
                'next_semester_gpa': 3.2,
                'graduation_probability': 0.85,
                'recommended_support_level': 'moderate'
            }
        
        # Career recommendations
        if self.career_interests and self.academic_scores:
            predictions['career_matches'] = [
                {'career': 'Software Engineer', 'match_score': 0.87},
                {'career': 'Data Scientist', 'match_score': 0.82},
                {'career': 'Research Scientist', 'match_score': 0.78}
            ]
        
        # Risk assessment
        predictions['risk_factors'] = {
            'academic_risk': 'low',
            'behavioral_risk': 'very_low',
            'dropout_risk': 0.15
        }
        
        self.ml_predictions = predictions
        self.save()
        return predictions
    
    def generate_recommendations(self):
        """Generate personalized recommendations"""
        recommendations = []
        
        # Academic recommendations
        if self.get_academic_average() and self.get_academic_average() < 70:
            recommendations.append({
                'type': 'academic',
                'priority': 'high',
                'title': 'Academic Support Program',
                'description': 'Enroll in targeted tutoring for subjects with scores below 70%',
                'timeline': '2-4 weeks'
            })
        
        # Physical recommendations
        if self.get_physical_average() and self.get_physical_average() < 60:
            recommendations.append({
                'type': 'physical',
                'priority': 'medium',
                'title': 'Fitness Improvement Plan',
                'description': 'Implement structured physical activity program',
                'timeline': '6-8 weeks'
            })
        
        # Psychological recommendations
        if self.get_psychological_average() and self.get_psychological_average() < 65:
            recommendations.append({
                'type': 'psychological',
                'priority': 'high',
                'title': 'Social-Emotional Learning Support',
                'description': 'Participate in SEL workshops and counseling sessions',
                'timeline': '4-6 weeks'
            })
        
        self.recommendations = recommendations
        self.save()
        return recommendations
