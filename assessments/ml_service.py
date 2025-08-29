"""
Machine Learning Service for Assessment Predictions and Recommendations
Integrates various ML models for comprehensive student assessment
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.neural_network import MLPRegressor, MLPClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report
import joblib
import json
from datetime import datetime, timedelta
from django.conf import settings
import os
import logging

logger = logging.getLogger(__name__)


class AcademicPerformancePredictor:
    """Predicts academic performance based on historical data and current metrics"""
    
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_importance = {}
        
    def prepare_features(self, student_data):
        """Prepare features for academic prediction"""
        features = []
        
        # Academic history features
        features.extend([
            student_data.get('previous_gpa', 0),
            student_data.get('attendance_rate', 0),
            student_data.get('assignment_completion_rate', 0),
            student_data.get('test_average', 0),
            student_data.get('homework_average', 0)
        ])
        
        # Demographic features
        features.extend([
            student_data.get('age', 0),
            1 if student_data.get('gender') == 'M' else 0,
            student_data.get('socioeconomic_index', 0)
        ])
        
        # Behavioral features
        features.extend([
            student_data.get('study_hours_per_week', 0),
            student_data.get('extracurricular_participation', 0),
            student_data.get('teacher_rating', 0),
            student_data.get('peer_interaction_score', 0)
        ])
        
        # Learning style features
        features.extend([
            student_data.get('visual_learning_preference', 0),
            student_data.get('auditory_learning_preference', 0),
            student_data.get('kinesthetic_learning_preference', 0)
        ])
        
        return np.array(features).reshape(1, -1)
    
    def train(self, training_data):
        """Train the academic performance prediction model"""
        try:
            # Prepare training data
            X = []
            y = []
            
            for record in training_data:
                features = self.prepare_features(record)
                X.append(features.flatten())
                y.append(record.get('target_gpa', 0))
            
            X = np.array(X)
            y = np.array(y)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train model
            self.model.fit(X_scaled, y)
            self.is_trained = True
            
            # Calculate feature importance
            feature_names = [
                'previous_gpa', 'attendance_rate', 'assignment_completion_rate',
                'test_average', 'homework_average', 'age', 'gender',
                'socioeconomic_index', 'study_hours_per_week',
                'extracurricular_participation', 'teacher_rating',
                'peer_interaction_score', 'visual_learning_preference',
                'auditory_learning_preference', 'kinesthetic_learning_preference'
            ]
            
            self.feature_importance = dict(zip(
                feature_names, 
                self.model.feature_importances_
            ))
            
            logger.info("Academic performance model trained successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error training academic model: {e}")
            return False
    
    def predict(self, student_data):
        """Predict academic performance for a student"""
        if not self.is_trained:
            return None
            
        try:
            features = self.prepare_features(student_data)
            features_scaled = self.scaler.transform(features)
            
            prediction = self.model.predict(features_scaled)[0]
            
            # Calculate confidence based on model certainty
            confidence = min(0.95, max(0.5, 1.0 - (abs(prediction - student_data.get('previous_gpa', prediction)) / 4.0)))
            
            return {
                'predicted_gpa': round(prediction, 2),
                'confidence': round(confidence, 3),
                'risk_level': self._assess_risk_level(prediction),
                'recommendations': self._generate_academic_recommendations(student_data, prediction)
            }
            
        except Exception as e:
            logger.error(f"Error making academic prediction: {e}")
            return None
    
    def _assess_risk_level(self, predicted_gpa):
        """Assess academic risk level based on predicted GPA"""
        if predicted_gpa >= 3.5:
            return 'low'
        elif predicted_gpa >= 2.5:
            return 'moderate'
        else:
            return 'high'
    
    def _generate_academic_recommendations(self, student_data, predicted_gpa):
        """Generate academic recommendations based on prediction"""
        recommendations = []
        
        if predicted_gpa < 2.5:
            recommendations.extend([
                "Immediate academic intervention required",
                "Consider one-on-one tutoring",
                "Implement structured study schedule"
            ])
        elif predicted_gpa < 3.0:
            recommendations.extend([
                "Additional academic support recommended",
                "Join study groups",
                "Meet with academic advisor"
            ])
        
        if student_data.get('attendance_rate', 100) < 85:
            recommendations.append("Improve attendance rate")
        
        if student_data.get('study_hours_per_week', 10) < 5:
            recommendations.append("Increase dedicated study time")
            
        return recommendations


class BehavioralPatternAnalyzer:
    """Analyzes behavioral patterns and predicts interventions needed"""
    
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=8,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.is_trained = False
        
    def prepare_features(self, behavioral_data):
        """Prepare features for behavioral analysis"""
        features = []
        
        # Behavioral indicators
        features.extend([
            behavioral_data.get('attention_span_score', 0),
            behavioral_data.get('impulse_control_score', 0),
            behavioral_data.get('social_interaction_score', 0),
            behavioral_data.get('emotional_regulation_score', 0),
            behavioral_data.get('motivation_level', 0)
        ])
        
        # Environmental factors
        features.extend([
            behavioral_data.get('family_support_score', 0),
            behavioral_data.get('peer_influence_score', 0),
            behavioral_data.get('teacher_relationship_score', 0)
        ])
        
        # Academic behavior
        features.extend([
            behavioral_data.get('participation_rate', 0),
            behavioral_data.get('homework_completion_rate', 0),
            behavioral_data.get('classroom_behavior_score', 0)
        ])
        
        return np.array(features).reshape(1, -1)
    
    def analyze_behavior(self, behavioral_data):
        """Analyze behavioral patterns and provide insights"""
        try:
            # Calculate behavioral risk score
            risk_factors = []
            risk_score = 0
            
            # Check individual behavioral indicators
            if behavioral_data.get('attention_span_score', 100) < 60:
                risk_factors.append('attention_difficulties')
                risk_score += 0.2
                
            if behavioral_data.get('impulse_control_score', 100) < 60:
                risk_factors.append('impulse_control_issues')
                risk_score += 0.2
                
            if behavioral_data.get('social_interaction_score', 100) < 60:
                risk_factors.append('social_difficulties')
                risk_score += 0.15
                
            if behavioral_data.get('emotional_regulation_score', 100) < 60:
                risk_factors.append('emotional_regulation_challenges')
                risk_score += 0.25
                
            if behavioral_data.get('motivation_level', 100) < 50:
                risk_factors.append('low_motivation')
                risk_score += 0.2
            
            # Determine intervention level
            if risk_score >= 0.6:
                intervention_level = 'intensive'
            elif risk_score >= 0.3:
                intervention_level = 'moderate'
            else:
                intervention_level = 'minimal'
            
            return {
                'risk_factors': risk_factors,
                'risk_score': round(risk_score, 3),
                'intervention_level': intervention_level,
                'behavioral_profile': self._create_behavioral_profile(behavioral_data),
                'interventions': self._recommend_interventions(risk_factors, intervention_level)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing behavior: {e}")
            return None
    
    def _create_behavioral_profile(self, behavioral_data):
        """Create comprehensive behavioral profile"""
        profile = {}
        
        # Categorize scores
        for key, value in behavioral_data.items():
            if 'score' in key:
                if value >= 80:
                    level = 'excellent'
                elif value >= 70:
                    level = 'good'
                elif value >= 60:
                    level = 'fair'
                else:
                    level = 'needs_improvement'
                profile[key] = {'score': value, 'level': level}
                
        return profile
    
    def _recommend_interventions(self, risk_factors, intervention_level):
        """Recommend specific interventions based on risk factors"""
        interventions = []
        
        intervention_map = {
            'attention_difficulties': [
                'Implement attention training exercises',
                'Use structured learning environments',
                'Break tasks into smaller segments'
            ],
            'impulse_control_issues': [
                'Teach self-monitoring strategies',
                'Implement behavioral contracts',
                'Practice mindfulness techniques'
            ],
            'social_difficulties': [
                'Social skills training',
                'Peer interaction opportunities',
                'Communication workshops'
            ],
            'emotional_regulation_challenges': [
                'Emotional literacy programs',
                'Stress management techniques',
                'Counseling support'
            ],
            'low_motivation': [
                'Goal-setting workshops',
                'Achievement recognition programs',
                'Intrinsic motivation building'
            ]
        }
        
        for factor in risk_factors:
            if factor in intervention_map:
                interventions.extend(intervention_map[factor])
                
        # Add intensity-based interventions
        if intervention_level == 'intensive':
            interventions.extend([
                'Individual behavioral therapy',
                'Family involvement required',
                'Weekly progress monitoring'
            ])
        elif intervention_level == 'moderate':
            interventions.extend([
                'Group behavioral sessions',
                'Bi-weekly progress review'
            ])
            
        return list(set(interventions))  # Remove duplicates


class CareerRecommendationEngine:
    """Recommends careers based on student profile and market trends"""
    
    def __init__(self):
        self.career_database = self._load_career_database()
        self.market_trends = self._load_market_trends()
        
    def _load_career_database(self):
        """Load comprehensive career database"""
        return {
            'software_engineer': {
                'skills': {'programming': 0.9, 'problem_solving': 0.8, 'mathematics': 0.7},
                'personality': {'analytical': 0.8, 'detail_oriented': 0.7},
                'education': 'bachelor_computer_science',
                'growth_rate': 0.22,
                'salary_range': [70000, 150000]
            },
            'data_scientist': {
                'skills': {'mathematics': 0.9, 'statistics': 0.9, 'programming': 0.8},
                'personality': {'analytical': 0.9, 'curious': 0.8},
                'education': 'bachelor_mathematics_statistics',
                'growth_rate': 0.31,
                'salary_range': [95000, 180000]
            },
            'teacher': {
                'skills': {'communication': 0.9, 'patience': 0.8, 'empathy': 0.8},
                'personality': {'nurturing': 0.9, 'organized': 0.7},
                'education': 'bachelor_education',
                'growth_rate': 0.05,
                'salary_range': [40000, 70000]
            },
            'healthcare_worker': {
                'skills': {'empathy': 0.9, 'attention_to_detail': 0.8, 'physical_stamina': 0.7},
                'personality': {'caring': 0.9, 'patient': 0.8},
                'education': 'healthcare_certification',
                'growth_rate': 0.15,
                'salary_range': [45000, 120000]
            },
            'business_analyst': {
                'skills': {'analytical_thinking': 0.9, 'communication': 0.8, 'problem_solving': 0.8},
                'personality': {'logical': 0.8, 'detail_oriented': 0.7},
                'education': 'bachelor_business',
                'growth_rate': 0.11,
                'salary_range': [60000, 110000]
            }
        }
    
    def _load_market_trends(self):
        """Load current job market trends"""
        return {
            'high_growth_sectors': [
                'technology', 'healthcare', 'renewable_energy', 
                'data_science', 'cybersecurity'
            ],
            'emerging_roles': [
                'ai_specialist', 'sustainability_consultant', 
                'remote_work_coordinator'
            ],
            'skills_in_demand': [
                'digital_literacy', 'critical_thinking', 
                'adaptability', 'emotional_intelligence'
            ]
        }
    
    def recommend_careers(self, student_profile):
        """Recommend careers based on comprehensive student profile"""
        try:
            career_scores = {}
            
            # Extract student characteristics
            student_skills = student_profile.get('skills', {})
            student_personality = student_profile.get('personality', {})
            academic_scores = student_profile.get('academic_scores', {})
            interests = student_profile.get('interests', [])
            
            # Calculate match scores for each career
            for career, requirements in self.career_database.items():
                score = 0
                factors = 0
                
                # Skills matching
                for skill, importance in requirements['skills'].items():
                    if skill in student_skills:
                        score += student_skills[skill] * importance
                        factors += importance
                
                # Personality matching
                for trait, importance in requirements['personality'].items():
                    if trait in student_personality:
                        score += student_personality[trait] * importance
                        factors += importance
                
                # Academic alignment
                relevant_subjects = self._get_relevant_subjects(career)
                for subject in relevant_subjects:
                    if subject in academic_scores:
                        score += (academic_scores[subject] / 100) * 0.3
                        factors += 0.3
                
                # Interest alignment
                career_interests = self._get_career_interests(career)
                interest_match = len(set(interests) & set(career_interests)) / len(career_interests) if career_interests else 0
                score += interest_match * 0.4
                factors += 0.4
                
                # Market trend bonus
                if career in self.market_trends['high_growth_sectors']:
                    score += 0.2
                    factors += 0.2
                
                # Calculate final score
                final_score = score / factors if factors > 0 else 0
                career_scores[career] = {
                    'match_score': round(final_score, 3),
                    'growth_rate': requirements['growth_rate'],
                    'salary_range': requirements['salary_range'],
                    'education_required': requirements['education']
                }
            
            # Sort by match score
            sorted_careers = sorted(
                career_scores.items(), 
                key=lambda x: x[1]['match_score'], 
                reverse=True
            )
            
            return {
                'top_recommendations': sorted_careers[:5],
                'career_clusters': self._group_by_clusters(sorted_careers),
                'development_areas': self._identify_development_areas(student_profile, sorted_careers[:3])
            }
            
        except Exception as e:
            logger.error(f"Error recommending careers: {e}")
            return None
    
    def _get_relevant_subjects(self, career):
        """Get relevant academic subjects for a career"""
        subject_mapping = {
            'software_engineer': ['mathematics', 'computer_science', 'physics'],
            'data_scientist': ['mathematics', 'statistics', 'computer_science'],
            'teacher': ['education', 'psychology', 'communication'],
            'healthcare_worker': ['biology', 'chemistry', 'health_science'],
            'business_analyst': ['mathematics', 'business_studies', 'economics']
        }
        return subject_mapping.get(career, [])
    
    def _get_career_interests(self, career):
        """Get interests associated with a career"""
        interest_mapping = {
            'software_engineer': ['technology', 'problem_solving', 'innovation'],
            'data_scientist': ['research', 'analysis', 'mathematics'],
            'teacher': ['education', 'mentoring', 'communication'],
            'healthcare_worker': ['helping_others', 'health', 'medical_science'],
            'business_analyst': ['business', 'analysis', 'strategy']
        }
        return interest_mapping.get(career, [])
    
    def _group_by_clusters(self, sorted_careers):
        """Group careers by industry clusters"""
        clusters = {
            'technology': [],
            'healthcare': [],
            'education': [],
            'business': [],
            'science': []
        }
        
        cluster_mapping = {
            'software_engineer': 'technology',
            'data_scientist': 'technology',
            'teacher': 'education',
            'healthcare_worker': 'healthcare',
            'business_analyst': 'business'
        }
        
        for career, data in sorted_careers:
            cluster = cluster_mapping.get(career, 'other')
            if cluster in clusters:
                clusters[cluster].append((career, data))
                
        return clusters
    
    def _identify_development_areas(self, student_profile, top_careers):
        """Identify areas for student development based on top career matches"""
        development_areas = []
        
        # Analyze skill gaps
        student_skills = student_profile.get('skills', {})
        
        for career, data in top_careers:
            career_requirements = self.career_database[career]['skills']
            for skill, importance in career_requirements.items():
                current_level = student_skills.get(skill, 0)
                if current_level < 0.7 and importance > 0.6:  # Significant gap
                    development_areas.append({
                        'area': skill,
                        'current_level': current_level,
                        'target_level': importance,
                        'relevant_for': career
                    })
        
        return development_areas


class MLAssessmentService:
    """Main service class coordinating all ML assessment components"""
    
    def __init__(self):
        self.academic_predictor = AcademicPerformancePredictor()
        self.behavioral_analyzer = BehavioralPatternAnalyzer()
        self.career_engine = CareerRecommendationEngine()
        
    def comprehensive_assessment(self, student_data):
        """Perform comprehensive ML-based assessment"""
        try:
            results = {
                'timestamp': datetime.now().isoformat(),
                'student_id': student_data.get('student_id'),
                'assessment_type': 'comprehensive_ml'
            }
            
            # Academic performance prediction
            if 'academic_data' in student_data:
                academic_results = self.academic_predictor.predict(student_data['academic_data'])
                results['academic_prediction'] = academic_results
            
            # Behavioral analysis
            if 'behavioral_data' in student_data:
                behavioral_results = self.behavioral_analyzer.analyze_behavior(student_data['behavioral_data'])
                results['behavioral_analysis'] = behavioral_results
            
            # Career recommendations
            career_results = self.career_engine.recommend_careers(student_data)
            results['career_recommendations'] = career_results
            
            # Overall risk assessment
            results['overall_assessment'] = self._calculate_overall_assessment(results)
            
            return results
            
        except Exception as e:
            logger.error(f"Error in comprehensive assessment: {e}")
            return None
    
    def _calculate_overall_assessment(self, results):
        """Calculate overall assessment and risk levels"""
        overall = {
            'academic_risk': 'unknown',
            'behavioral_risk': 'unknown',
            'career_readiness': 'unknown',
            'intervention_priority': 'low',
            'success_probability': 0.5
        }
        
        # Academic risk
        if 'academic_prediction' in results:
            academic_risk = results['academic_prediction'].get('risk_level', 'unknown')
            overall['academic_risk'] = academic_risk
        
        # Behavioral risk
        if 'behavioral_analysis' in results:
            behavioral_risk_score = results['behavioral_analysis'].get('risk_score', 0)
            if behavioral_risk_score >= 0.6:
                overall['behavioral_risk'] = 'high'
            elif behavioral_risk_score >= 0.3:
                overall['behavioral_risk'] = 'moderate'
            else:
                overall['behavioral_risk'] = 'low'
        
        # Career readiness
        if 'career_recommendations' in results:
            top_match = results['career_recommendations']['top_recommendations'][0][1]['match_score']
            if top_match >= 0.8:
                overall['career_readiness'] = 'high'
            elif top_match >= 0.6:
                overall['career_readiness'] = 'moderate'
            else:
                overall['career_readiness'] = 'low'
        
        # Intervention priority
        high_risk_factors = 0
        if overall['academic_risk'] == 'high':
            high_risk_factors += 1
        if overall['behavioral_risk'] == 'high':
            high_risk_factors += 1
        if overall['career_readiness'] == 'low':
            high_risk_factors += 0.5
            
        if high_risk_factors >= 2:
            overall['intervention_priority'] = 'high'
        elif high_risk_factors >= 1:
            overall['intervention_priority'] = 'moderate'
        else:
            overall['intervention_priority'] = 'low'
        
        # Success probability
        risk_factors = [overall['academic_risk'], overall['behavioral_risk']]
        low_risk_count = risk_factors.count('low')
        moderate_risk_count = risk_factors.count('moderate')
        high_risk_count = risk_factors.count('high')
        
        success_prob = 0.9 - (moderate_risk_count * 0.2) - (high_risk_count * 0.4)
        overall['success_probability'] = max(0.1, min(0.95, success_prob))
        
        return overall
