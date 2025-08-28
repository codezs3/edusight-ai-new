"""
Scientific algorithms for EPR (Edusight Prism Rating) calculations
Based on validated psychological and educational assessment tools
"""

from decimal import Decimal
from typing import Dict, List, Tuple, Optional
import numpy as np

class EPRScoringAlgorithms:
    """
    Scientific scoring algorithms for the Edusight Prism Rating system
    """
    
    @staticmethod
    def calculate_academic_composite(
        standardized_test: Optional[float] = None,
        gpa: Optional[float] = None,
        attendance: Optional[float] = None,
        engagement: Optional[float] = None,
        learning_pace: Optional[float] = None,
        teacher_eval: Optional[float] = None,
        homework_completion: Optional[float] = None,
        class_participation: Optional[float] = None,
        weights: Optional[Dict[str, float]] = None
    ) -> Tuple[float, Dict[str, float]]:
        """
        Calculate composite academic score using weighted average
        
        Args:
            All parameters are on 0-100 scale except teacher_eval (1-10 scale)
            weights: Optional custom weights for each component
            
        Returns:
            Tuple of (composite_score, component_breakdown)
        """
        
        # Default weights based on educational research
        default_weights = {
            'standardized_test': 0.25,
            'gpa': 0.25,
            'attendance': 0.10,
            'engagement': 0.15,
            'learning_pace': 0.10,
            'teacher_eval': 0.15
        }
        
        if weights:
            default_weights.update(weights)
        
        scores = {}
        weighted_sum = 0
        total_weight = 0
        
        # Collect and weight available scores
        if standardized_test is not None:
            scores['standardized_test'] = standardized_test
            weighted_sum += standardized_test * default_weights['standardized_test']
            total_weight += default_weights['standardized_test']
        
        if gpa is not None:
            scores['gpa'] = gpa
            weighted_sum += gpa * default_weights['gpa']
            total_weight += default_weights['gpa']
        
        if attendance is not None:
            scores['attendance'] = attendance
            weighted_sum += attendance * default_weights['attendance']
            total_weight += default_weights['attendance']
        
        if engagement is not None:
            scores['engagement'] = engagement
            weighted_sum += engagement * default_weights['engagement']
            total_weight += default_weights['engagement']
        
        if learning_pace is not None:
            scores['learning_pace'] = learning_pace
            weighted_sum += learning_pace * default_weights['learning_pace']
            total_weight += default_weights['learning_pace']
        
        if teacher_eval is not None:
            # Convert 1-10 scale to 0-100 scale
            teacher_score = (teacher_eval - 1) * (100 / 9)
            scores['teacher_eval'] = teacher_score
            weighted_sum += teacher_score * default_weights['teacher_eval']
            total_weight += default_weights['teacher_eval']
        
        # Calculate composite score
        if total_weight > 0:
            composite_score = weighted_sum / total_weight
        else:
            composite_score = 0
        
        return composite_score, scores
    
    @staticmethod
    def calculate_sdq_score(
        emotional_symptoms: Optional[int] = None,
        conduct_problems: Optional[int] = None,
        hyperactivity: Optional[int] = None,
        peer_problems: Optional[int] = None,
        prosocial: Optional[int] = None
    ) -> Tuple[float, Dict[str, any]]:
        """
        Calculate SDQ (Strengths and Difficulties Questionnaire) composite score
        
        Args:
            All parameters are on 0-10 scale (raw SDQ scores)
            
        Returns:
            Tuple of (composite_score_0_100, breakdown)
        """
        
        breakdown = {}
        
        # Calculate total difficulties (first 4 subscales)
        difficulties = [emotional_symptoms, conduct_problems, hyperactivity, peer_problems]
        available_difficulties = [d for d in difficulties if d is not None]
        
        if available_difficulties:
            total_difficulties = sum(available_difficulties)
            breakdown['total_difficulties'] = total_difficulties
            
            # SDQ banding (Goodman, 1997)
            # Normal: 0-13, Borderline: 14-16, Abnormal: 17-40
            if total_difficulties <= 13:
                difficulties_score = 100  # Normal range
            elif total_difficulties <= 16:
                difficulties_score = 75   # Borderline
            else:
                # Abnormal range - scale from 40 down to 0
                difficulties_score = max(0, 75 - ((total_difficulties - 16) * 3))
        else:
            difficulties_score = None
        
        # Prosocial score (higher is better)
        if prosocial is not None:
            # Prosocial banding: Normal: 6-10, Borderline: 5, Abnormal: 0-4
            if prosocial >= 6:
                prosocial_score = 100
            elif prosocial == 5:
                prosocial_score = 75
            else:
                prosocial_score = max(0, prosocial * 12.5)  # Scale 0-4 to 0-50
            
            breakdown['prosocial'] = prosocial_score
        else:
            prosocial_score = None
        
        # Combine scores
        available_scores = [s for s in [difficulties_score, prosocial_score] if s is not None]
        if available_scores:
            composite_score = sum(available_scores) / len(available_scores)
        else:
            composite_score = 0
        
        breakdown['composite'] = composite_score
        return composite_score, breakdown
    
    @staticmethod
    def calculate_dass21_score(
        depression: Optional[int] = None,
        anxiety: Optional[int] = None,
        stress: Optional[int] = None
    ) -> Tuple[float, Dict[str, any]]:
        """
        Calculate DASS-21 composite score
        
        Args:
            All parameters are on 0-42 scale (DASS-21 raw scores)
            
        Returns:
            Tuple of (composite_score_0_100, breakdown)
        """
        
        breakdown = {}
        scores = []
        
        # DASS-21 severity ratings (Lovibond & Lovibond, 1995)
        def get_dass_severity_score(raw_score: int, scale_type: str) -> float:
            """Convert raw DASS score to 0-100 scale (inverted - lower distress = higher score)"""
            
            if scale_type == 'depression':
                # Depression: Normal 0-9, Mild 10-13, Moderate 14-20, Severe 21-27, Extremely Severe 28+
                if raw_score <= 9:
                    return 100
                elif raw_score <= 13:
                    return 80
                elif raw_score <= 20:
                    return 60
                elif raw_score <= 27:
                    return 40
                else:
                    return max(0, 40 - (raw_score - 28))
                    
            elif scale_type == 'anxiety':
                # Anxiety: Normal 0-7, Mild 8-9, Moderate 10-14, Severe 15-19, Extremely Severe 20+
                if raw_score <= 7:
                    return 100
                elif raw_score <= 9:
                    return 80
                elif raw_score <= 14:
                    return 60
                elif raw_score <= 19:
                    return 40
                else:
                    return max(0, 40 - (raw_score - 20))
                    
            elif scale_type == 'stress':
                # Stress: Normal 0-14, Mild 15-18, Moderate 19-25, Severe 26-33, Extremely Severe 34+
                if raw_score <= 14:
                    return 100
                elif raw_score <= 18:
                    return 80
                elif raw_score <= 25:
                    return 60
                elif raw_score <= 33:
                    return 40
                else:
                    return max(0, 40 - (raw_score - 34))
        
        if depression is not None:
            dep_score = get_dass_severity_score(depression, 'depression')
            scores.append(dep_score)
            breakdown['depression'] = dep_score
        
        if anxiety is not None:
            anx_score = get_dass_severity_score(anxiety, 'anxiety')
            scores.append(anx_score)
            breakdown['anxiety'] = anx_score
        
        if stress is not None:
            stress_score = get_dass_severity_score(stress, 'stress')
            scores.append(stress_score)
            breakdown['stress'] = stress_score
        
        # Calculate composite
        if scores:
            composite_score = sum(scores) / len(scores)
        else:
            composite_score = 0
        
        breakdown['composite'] = composite_score
        return composite_score, breakdown
    
    @staticmethod
    def calculate_perma_score(
        positive_emotion: Optional[float] = None,
        engagement: Optional[float] = None,
        relationships: Optional[float] = None,
        meaning: Optional[float] = None,
        achievement: Optional[float] = None
    ) -> Tuple[float, Dict[str, float]]:
        """
        Calculate PERMA Profiler composite score
        
        Args:
            All parameters are on 1-10 scale
            
        Returns:
            Tuple of (composite_score_0_100, breakdown)
        """
        
        scores = []
        breakdown = {}
        
        perma_components = {
            'positive_emotion': positive_emotion,
            'engagement': engagement,
            'relationships': relationships,
            'meaning': meaning,
            'achievement': achievement
        }
        
        for component, score in perma_components.items():
            if score is not None:
                # Convert 1-10 scale to 0-100 scale
                normalized_score = (score - 1) * (100 / 9)
                scores.append(normalized_score)
                breakdown[component] = normalized_score
        
        # Calculate composite
        if scores:
            composite_score = sum(scores) / len(scores)
        else:
            composite_score = 0
        
        breakdown['composite'] = composite_score
        return composite_score, breakdown
    
    @staticmethod
    def calculate_bmi_score(
        bmi: Optional[float] = None,
        age_years: Optional[int] = None,
        gender: Optional[str] = None
    ) -> Tuple[float, Dict[str, any]]:
        """
        Calculate BMI-based health score using CDC/WHO percentiles
        
        Args:
            bmi: Body Mass Index
            age_years: Age in years (for percentile calculation)
            gender: 'male' or 'female'
            
        Returns:
            Tuple of (health_score_0_100, breakdown)
        """
        
        if bmi is None:
            return 0, {'error': 'BMI required'}
        
        breakdown = {'bmi': bmi}
        
        # For adults (18+), use standard BMI categories
        if age_years is None or age_years >= 18:
            if 18.5 <= bmi <= 24.9:
                score = 100  # Normal weight
            elif 25.0 <= bmi <= 29.9:
                score = 75   # Overweight
            elif 30.0 <= bmi <= 34.9:
                score = 50   # Obese Class I
            elif 35.0 <= bmi <= 39.9:
                score = 25   # Obese Class II
            elif bmi >= 40:
                score = 10   # Obese Class III
            else:  # Underweight
                score = max(10, bmi * 5)
        else:
            # For children/adolescents, would need CDC growth charts
            # Simplified scoring for demonstration
            if 15 <= bmi <= 25:
                score = 100
            elif 25 < bmi <= 30:
                score = 75
            elif bmi > 30:
                score = 50
            else:
                score = max(25, bmi * 4)
        
        breakdown['score'] = score
        breakdown['category'] = 'normal' if score >= 90 else 'concern' if score >= 50 else 'high_risk'
        
        return score, breakdown
    
    @staticmethod
    def calculate_sleep_score(
        hours: Optional[float] = None,
        quality: Optional[float] = None,
        age_years: Optional[int] = None
    ) -> Tuple[float, Dict[str, any]]:
        """
        Calculate sleep health score
        
        Args:
            hours: Average sleep hours per night
            quality: Sleep quality score (0-100)
            age_years: Age for optimal sleep duration recommendations
            
        Returns:
            Tuple of (sleep_score_0_100, breakdown)
        """
        
        breakdown = {}
        scores = []
        
        # Sleep duration scoring
        if hours is not None:
            # Age-based optimal sleep hours (American Academy of Sleep Medicine)
            if age_years is None or age_years >= 18:
                optimal_range = (7, 9)
            elif age_years >= 14:
                optimal_range = (8, 10)
            elif age_years >= 6:
                optimal_range = (9, 11)
            else:
                optimal_range = (10, 13)
            
            min_optimal, max_optimal = optimal_range
            
            if min_optimal <= hours <= max_optimal:
                duration_score = 100
            elif hours < min_optimal:
                # Penalty for insufficient sleep
                duration_score = max(0, (hours / min_optimal) * 100)
            else:
                # Penalty for excessive sleep
                duration_score = max(0, 100 - ((hours - max_optimal) * 10))
            
            scores.append(duration_score)
            breakdown['duration_score'] = duration_score
            breakdown['hours'] = hours
            breakdown['optimal_range'] = optimal_range
        
        # Sleep quality scoring
        if quality is not None:
            scores.append(quality)
            breakdown['quality_score'] = quality
        
        # Calculate composite
        if scores:
            composite_score = sum(scores) / len(scores)
        else:
            composite_score = 0
        
        breakdown['composite'] = composite_score
        return composite_score, breakdown
    
    @staticmethod
    def generate_performance_insights(
        academic_score: Optional[float] = None,
        psychological_score: Optional[float] = None,
        physical_score: Optional[float] = None,
        overall_score: Optional[float] = None
    ) -> Dict[str, List[str]]:
        """
        Generate data-driven insights and recommendations
        
        Returns:
            Dictionary of insights categorized by domain
        """
        
        insights = {
            'strengths': [],
            'areas_for_improvement': [],
            'immediate_actions': [],
            'long_term_goals': []
        }
        
        # Identify strengths (scores >= 85)
        if academic_score and academic_score >= 85:
            insights['strengths'].append('Strong academic performance across multiple domains')
        if psychological_score and psychological_score >= 85:
            insights['strengths'].append('Excellent psychological well-being and emotional regulation')
        if physical_score and physical_score >= 85:
            insights['strengths'].append('Outstanding physical health and wellness habits')
        
        # Identify areas for improvement (scores < 70)
        if academic_score and academic_score < 70:
            insights['areas_for_improvement'].append('Academic performance needs targeted support')
            if academic_score < 50:
                insights['immediate_actions'].append('Urgent academic intervention required')
        
        if psychological_score and psychological_score < 70:
            insights['areas_for_improvement'].append('Psychological well-being requires attention')
            if psychological_score < 50:
                insights['immediate_actions'].append('Mental health support strongly recommended')
        
        if physical_score and physical_score < 70:
            insights['areas_for_improvement'].append('Physical health and wellness need improvement')
            if physical_score < 50:
                insights['immediate_actions'].append('Comprehensive health assessment recommended')
        
        # Overall performance insights
        if overall_score:
            if overall_score >= 85:
                insights['strengths'].append('Thriving overall - excellent holistic development')
            elif overall_score >= 70:
                insights['long_term_goals'].append('Continue building on current progress')
            elif overall_score >= 50:
                insights['long_term_goals'].append('Focus on systematic improvement across all domains')
            else:
                insights['immediate_actions'].append('Comprehensive support strategy needed')
        
        return insights
