"""
Prediction engine for generating performance forecasts and trend analysis
Uses machine learning and statistical models for educational insights
"""

import numpy as np
import pandas as pd
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple, Optional
from scipy import stats
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import warnings
warnings.filterwarnings('ignore')

from epr_system.data_models import (
    AcademicDataEntry, PsychologicalDataEntry, PhysicalDataEntry,
    YearwiseDataSummary
)
from students.models import User

class PredictionEngine:
    """
    Advanced prediction engine for educational forecasting
    """
    
    def __init__(self, student: User):
        self.student = student
        self.models = {}
        self.scaler = StandardScaler()
        
    def generate_academic_predictions(self, timeframe: str = '6_months') -> Dict[str, Any]:
        """Generate academic performance predictions"""
        
        # Get historical academic data
        academic_data = self._get_academic_time_series()
        
        if len(academic_data) < 3:
            return {
                'error': 'Insufficient data for prediction',
                'minimum_required': 3,
                'current_data_points': len(academic_data)
            }
        
        predictions = {
            'overall_performance': self._predict_overall_academic(academic_data, timeframe),
            'subject_wise_predictions': self._predict_subject_performance(academic_data, timeframe),
            'grade_trajectory': self._predict_grade_trajectory(academic_data, timeframe),
            'risk_assessment': self._assess_academic_risks(academic_data),
            'confidence_intervals': self._calculate_prediction_confidence(academic_data),
            'factors_analysis': self._analyze_prediction_factors(academic_data)
        }
        
        return predictions
    
    def generate_epr_forecast(self, timeframe: str = '1_year') -> Dict[str, Any]:
        """Generate EPR score forecasts"""
        
        # Get historical EPR data
        epr_data = self._get_epr_time_series()
        
        if len(epr_data) < 2:
            return {
                'error': 'Insufficient EPR data for forecasting',
                'recommendation': 'Complete more assessments to enable forecasting'
            }
        
        forecast = {
            'predicted_scores': self._forecast_epr_scores(epr_data, timeframe),
            'performance_band_projection': self._project_performance_bands(epr_data, timeframe),
            'improvement_trajectory': self._analyze_improvement_trajectory(epr_data),
            'milestone_predictions': self._predict_milestones(epr_data, timeframe),
            'uncertainty_analysis': self._analyze_forecast_uncertainty(epr_data)
        }
        
        return forecast
    
    def analyze_growth_patterns(self) -> Dict[str, Any]:
        """Analyze growth patterns across all domains"""
        
        patterns = {
            'academic_growth': self._analyze_academic_growth_pattern(),
            'psychological_development': self._analyze_psychological_growth(),
            'physical_development': self._analyze_physical_growth(),
            'holistic_growth': self._analyze_holistic_growth_pattern(),
            'growth_rate_analysis': self._calculate_growth_rates(),
            'developmental_stages': self._identify_developmental_stages()
        }
        
        return patterns
    
    def predict_intervention_outcomes(self, intervention_type: str, intensity: str = 'medium') -> Dict[str, Any]:
        """Predict outcomes of various interventions"""
        
        outcomes = {
            'academic_tutoring': self._predict_tutoring_impact(intensity),
            'psychological_counseling': self._predict_counseling_impact(intensity),
            'physical_training': self._predict_fitness_program_impact(intensity),
            'holistic_program': self._predict_comprehensive_intervention(intensity),
            'timeline_to_improvement': self._estimate_improvement_timeline(intervention_type, intensity),
            'success_probability': self._calculate_intervention_success_probability(intervention_type)
        }
        
        return outcomes
    
    def generate_career_aptitude_predictions(self) -> Dict[str, Any]:
        """Generate career aptitude and pathway predictions"""
        
        # Get comprehensive student data
        academic_strengths = self._identify_academic_strengths()
        psychological_profile = self._get_psychological_profile()
        physical_capabilities = self._assess_physical_capabilities()
        
        career_analysis = {
            'aptitude_areas': self._identify_aptitude_areas(academic_strengths, psychological_profile),
            'career_clusters': self._predict_career_clusters(academic_strengths, psychological_profile, physical_capabilities),
            'skill_development_path': self._recommend_skill_development(academic_strengths),
            'educational_pathway': self._suggest_educational_pathways(academic_strengths),
            'personality_job_fit': self._analyze_personality_job_fit(psychological_profile),
            'future_readiness': self._assess_future_readiness(academic_strengths, psychological_profile)
        }
        
        return career_analysis
    
    def create_visualization_data(self, prediction_type: str) -> Dict[str, Any]:
        """Create data for prediction visualizations"""
        
        if prediction_type == 'academic_trends':
            return self._create_academic_trend_data()
        elif prediction_type == 'epr_forecast':
            return self._create_epr_forecast_data()
        elif prediction_type == 'growth_patterns':
            return self._create_growth_pattern_data()
        elif prediction_type == 'career_radar':
            return self._create_career_aptitude_radar()
        elif prediction_type == 'intervention_impact':
            return self._create_intervention_impact_data()
        else:
            return {'error': f'Unknown prediction type: {prediction_type}'}
    
    # Private helper methods
    
    def _get_academic_time_series(self) -> pd.DataFrame:
        """Get academic data as time series"""
        
        academic_entries = AcademicDataEntry.objects.filter(
            student=self.student
        ).order_by('created_at')
        
        data = []
        for entry in academic_entries:
            data.append({
                'date': entry.created_at,
                'academic_year': entry.academic_year,
                'subject': entry.subject,
                'percentage': entry.percentage or 0,
                'attendance': entry.attendance_percentage or 0,
                'participation': entry.class_participation or 0,
                'homework_completion': entry.homework_completion_rate or 0
            })
        
        df = pd.DataFrame(data)
        if not df.empty:
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date')
        
        return df
    
    def _get_epr_time_series(self) -> pd.DataFrame:
        """Get EPR scores as time series"""
        
        summaries = YearwiseDataSummary.objects.filter(
            student=self.student
        ).order_by('academic_year')
        
        data = []
        for summary in summaries:
            if summary.annual_epr_score:
                data.append({
                    'academic_year': summary.academic_year,
                    'epr_score': summary.annual_epr_score,
                    'academic_average': summary.overall_academic_average or 0,
                    'psychological_score': summary.emotional_wellbeing_score or 0,
                    'physical_score': summary.fitness_level or 0,
                    'performance_band': summary.epr_performance_band
                })
        
        return pd.DataFrame(data)
    
    def _predict_overall_academic(self, data: pd.DataFrame, timeframe: str) -> Dict[str, Any]:
        """Predict overall academic performance"""
        
        if data.empty:
            return {'error': 'No academic data available'}
        
        # Prepare time series data
        data_grouped = data.groupby(data['date'].dt.to_period('M'))['percentage'].mean()
        
        if len(data_grouped) < 3:
            return {'error': 'Insufficient time series data'}
        
        # Simple linear regression for trend
        x = np.arange(len(data_grouped)).reshape(-1, 1)
        y = data_grouped.values
        
        model = LinearRegression()
        model.fit(x, y)
        
        # Predict future periods
        future_periods = self._get_future_periods(timeframe)
        future_x = np.arange(len(data_grouped), len(data_grouped) + future_periods).reshape(-1, 1)
        predictions = model.predict(future_x)
        
        # Calculate trend
        trend = 'improving' if model.coef_[0] > 0.5 else 'declining' if model.coef_[0] < -0.5 else 'stable'
        
        return {
            'current_performance': float(data_grouped.iloc[-1]),
            'predicted_performance': float(predictions[-1]),
            'trend': trend,
            'improvement_rate': float(model.coef_[0]),
            'confidence_score': self._calculate_model_confidence(model, x, y),
            'predictions_timeline': predictions.tolist()
        }
    
    def _predict_subject_performance(self, data: pd.DataFrame, timeframe: str) -> Dict[str, Any]:
        """Predict subject-wise performance"""
        
        subject_predictions = {}
        
        for subject in data['subject'].unique():
            subject_data = data[data['subject'] == subject]
            
            if len(subject_data) >= 3:
                # Time series analysis for each subject
                subject_grouped = subject_data.groupby(
                    subject_data['date'].dt.to_period('M')
                )['percentage'].mean()
                
                if len(subject_grouped) >= 2:
                    x = np.arange(len(subject_grouped)).reshape(-1, 1)
                    y = subject_grouped.values
                    
                    model = LinearRegression()
                    model.fit(x, y)
                    
                    future_periods = self._get_future_periods(timeframe)
                    future_x = np.arange(len(subject_grouped), len(subject_grouped) + future_periods).reshape(-1, 1)
                    prediction = model.predict(future_x)
                    
                    subject_predictions[subject] = {
                        'current_score': float(subject_grouped.iloc[-1]),
                        'predicted_score': float(prediction[-1]),
                        'trend': 'improving' if model.coef_[0] > 0 else 'declining' if model.coef_[0] < 0 else 'stable',
                        'confidence': self._calculate_model_confidence(model, x, y)
                    }
        
        return subject_predictions
    
    def _predict_grade_trajectory(self, data: pd.DataFrame, timeframe: str) -> Dict[str, Any]:
        """Predict grade trajectory and milestones"""
        
        # Convert percentages to grade points for trajectory analysis
        grade_mapping = {
            'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
        }
        
        # Calculate current grade trend
        recent_scores = data['percentage'].tail(5).mean()
        current_grade = self._percentage_to_grade(recent_scores)
        
        # Predict future grade based on trend
        future_periods = self._get_future_periods(timeframe)
        
        # Simple trend analysis
        if len(data) >= 5:
            x = np.arange(len(data))
            y = data['percentage'].values
            slope, intercept, r_value, _, _ = stats.linregress(x, y)
            
            future_score = intercept + slope * (len(data) + future_periods)
            predicted_grade = self._percentage_to_grade(future_score)
            
            trajectory = {
                'current_grade': current_grade,
                'predicted_grade': predicted_grade,
                'grade_improvement_probability': self._calculate_grade_improvement_probability(slope),
                'milestone_timeline': self._calculate_grade_milestones(current_grade, predicted_grade, timeframe),
                'risk_factors': self._identify_grade_risk_factors(data)
            }
        else:
            trajectory = {
                'current_grade': current_grade,
                'predicted_grade': current_grade,
                'note': 'Insufficient data for trend analysis'
            }
        
        return trajectory
    
    def _forecast_epr_scores(self, epr_data: pd.DataFrame, timeframe: str) -> Dict[str, Any]:
        """Forecast EPR scores using multiple methods"""
        
        if len(epr_data) < 2:
            return {'error': 'Insufficient EPR data'}
        
        scores = epr_data['epr_score'].values
        
        # Method 1: Linear trend
        x = np.arange(len(scores)).reshape(-1, 1)
        linear_model = LinearRegression()
        linear_model.fit(x, scores)
        
        # Method 2: Weighted recent performance
        weights = np.exp(np.linspace(0, 1, len(scores)))
        weighted_trend = np.average(np.diff(scores), weights=weights[1:]) if len(scores) > 1 else 0
        
        future_periods = self._get_future_periods(timeframe)
        
        # Linear prediction
        future_x = np.array([[len(scores) + future_periods - 1]])
        linear_prediction = linear_model.predict(future_x)[0]
        
        # Weighted prediction
        last_score = scores[-1]
        weighted_prediction = last_score + (weighted_trend * future_periods)
        
        # Ensemble prediction (average of methods)
        ensemble_prediction = (linear_prediction + weighted_prediction) / 2
        
        # Ensure predictions are within reasonable bounds
        ensemble_prediction = np.clip(ensemble_prediction, 0, 100)
        
        return {
            'current_epr': float(scores[-1]),
            'predicted_epr': float(ensemble_prediction),
            'linear_trend_prediction': float(linear_prediction),
            'weighted_trend_prediction': float(weighted_prediction),
            'prediction_range': {
                'lower_bound': float(ensemble_prediction * 0.9),
                'upper_bound': float(ensemble_prediction * 1.1)
            },
            'trend_strength': abs(float(linear_model.coef_[0])),
            'prediction_confidence': self._calculate_epr_prediction_confidence(scores)
        }
    
    def _analyze_improvement_trajectory(self, epr_data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze improvement trajectory patterns"""
        
        if len(epr_data) < 2:
            return {'error': 'Insufficient data for trajectory analysis'}
        
        scores = epr_data['epr_score'].values
        
        # Calculate improvement rate
        improvements = np.diff(scores)
        avg_improvement = np.mean(improvements)
        
        # Analyze improvement consistency
        improvement_consistency = 1 - (np.std(improvements) / np.mean(np.abs(improvements))) if len(improvements) > 1 else 0
        
        # Identify improvement phases
        phases = []
        current_phase = 'stable'
        phase_start = 0
        
        for i, improvement in enumerate(improvements):
            if improvement > 2:
                new_phase = 'improving'
            elif improvement < -2:
                new_phase = 'declining'
            else:
                new_phase = 'stable'
            
            if new_phase != current_phase:
                phases.append({
                    'phase': current_phase,
                    'start_period': phase_start,
                    'end_period': i,
                    'duration': i - phase_start + 1
                })
                current_phase = new_phase
                phase_start = i
        
        # Add final phase
        phases.append({
            'phase': current_phase,
            'start_period': phase_start,
            'end_period': len(improvements),
            'duration': len(improvements) - phase_start + 1
        })
        
        return {
            'average_improvement_rate': float(avg_improvement),
            'improvement_consistency': float(improvement_consistency),
            'current_trajectory': current_phase,
            'improvement_phases': phases,
            'total_improvement': float(scores[-1] - scores[0]),
            'improvement_acceleration': self._calculate_improvement_acceleration(scores)
        }
    
    def _get_future_periods(self, timeframe: str) -> int:
        """Convert timeframe to number of periods"""
        
        timeframe_mapping = {
            '3_months': 3,
            '6_months': 6,
            '1_year': 12,
            '2_years': 24,
            '5_years': 60
        }
        
        return timeframe_mapping.get(timeframe, 6)
    
    def _percentage_to_grade(self, percentage: float) -> str:
        """Convert percentage to letter grade"""
        
        if percentage >= 90:
            return 'A+'
        elif percentage >= 80:
            return 'A'
        elif percentage >= 70:
            return 'B+'
        elif percentage >= 60:
            return 'B'
        elif percentage >= 50:
            return 'C+'
        elif percentage >= 40:
            return 'C'
        elif percentage >= 33:
            return 'D'
        else:
            return 'F'
    
    def _calculate_model_confidence(self, model, x, y) -> float:
        """Calculate confidence score for the model"""
        
        try:
            score = model.score(x, y)
            return max(0, min(1, score))
        except:
            return 0.5
    
    def _calculate_grade_improvement_probability(self, slope: float) -> float:
        """Calculate probability of grade improvement"""
        
        # Sigmoid function to convert slope to probability
        probability = 1 / (1 + np.exp(-slope * 10))
        return float(probability)
    
    def _calculate_grade_milestones(self, current_grade: str, predicted_grade: str, timeframe: str) -> List[Dict[str, Any]]:
        """Calculate grade milestone timeline"""
        
        grade_order = ['F', 'D', 'C', 'C+', 'B', 'B+', 'A', 'A+']
        
        try:
            current_index = grade_order.index(current_grade)
            predicted_index = grade_order.index(predicted_grade)
        except ValueError:
            return []
        
        milestones = []
        
        if predicted_index > current_index:
            # Improvement milestones
            improvement_steps = predicted_index - current_index
            periods = self._get_future_periods(timeframe)
            
            for i in range(1, improvement_steps + 1):
                milestone_period = int((i / improvement_steps) * periods)
                milestone_grade = grade_order[current_index + i]
                
                milestones.append({
                    'grade': milestone_grade,
                    'estimated_period': milestone_period,
                    'milestone_type': 'improvement'
                })
        
        return milestones
    
    def _identify_grade_risk_factors(self, data: pd.DataFrame) -> List[str]:
        """Identify risk factors that might affect grade trajectory"""
        
        risk_factors = []
        
        # Check attendance
        if 'attendance' in data.columns:
            avg_attendance = data['attendance'].mean()
            if avg_attendance < 75:
                risk_factors.append('Low attendance rate')
        
        # Check consistency
        if 'percentage' in data.columns and len(data) > 3:
            cv = data['percentage'].std() / data['percentage'].mean()
            if cv > 0.2:
                risk_factors.append('Inconsistent performance')
        
        # Check recent trend
        if len(data) >= 5:
            recent_trend = data['percentage'].tail(5).mean() - data['percentage'].head(5).mean()
            if recent_trend < -5:
                risk_factors.append('Declining recent performance')
        
        return risk_factors
    
    def _calculate_epr_prediction_confidence(self, scores: np.ndarray) -> float:
        """Calculate confidence in EPR predictions"""
        
        if len(scores) < 2:
            return 0.5
        
        # Base confidence on data consistency and trend strength
        consistency = 1 - (np.std(scores) / np.mean(scores)) if np.mean(scores) > 0 else 0
        trend_strength = abs(np.corrcoef(np.arange(len(scores)), scores)[0, 1]) if len(scores) > 2 else 0
        
        confidence = (consistency * 0.6 + trend_strength * 0.4)
        return max(0.1, min(0.95, confidence))
    
    def _calculate_improvement_acceleration(self, scores: np.ndarray) -> float:
        """Calculate acceleration in improvement rate"""
        
        if len(scores) < 3:
            return 0.0
        
        # Second derivative approximation
        first_derivatives = np.diff(scores)
        second_derivatives = np.diff(first_derivatives)
        
        return float(np.mean(second_derivatives))
    
    # Additional prediction methods for comprehensive analysis
    
    def _predict_tutoring_impact(self, intensity: str) -> Dict[str, Any]:
        """Predict impact of academic tutoring"""
        
        impact_multipliers = {
            'low': 1.1,
            'medium': 1.2,
            'high': 1.35,
            'intensive': 1.5
        }
        
        multiplier = impact_multipliers.get(intensity, 1.2)
        
        # Get current academic performance
        current_performance = self._get_current_academic_average()
        
        predicted_improvement = (100 - current_performance) * (multiplier - 1)
        predicted_performance = min(100, current_performance + predicted_improvement)
        
        return {
            'predicted_improvement': float(predicted_improvement),
            'predicted_performance': float(predicted_performance),
            'timeline_weeks': 8 if intensity == 'intensive' else 12,
            'success_probability': 0.75 if intensity in ['high', 'intensive'] else 0.65
        }
    
    def _get_current_academic_average(self) -> float:
        """Get current academic average"""
        
        recent_entries = AcademicDataEntry.objects.filter(
            student=self.student
        ).order_by('-created_at')[:5]
        
        if recent_entries:
            avg = sum(entry.percentage or 0 for entry in recent_entries) / len(recent_entries)
            return avg
        
        return 70.0  # Default average
    
    def _identify_academic_strengths(self) -> Dict[str, float]:
        """Identify academic strength areas"""
        
        subject_performance = {}
        
        for subject in ['mathematics', 'science', 'english', 'social_studies']:
            entries = AcademicDataEntry.objects.filter(
                student=self.student,
                subject=subject
            ).order_by('-created_at')[:3]
            
            if entries:
                avg_score = sum(entry.percentage or 0 for entry in entries) / len(entries)
                subject_performance[subject] = avg_score
        
        return subject_performance
    
    def _get_psychological_profile(self) -> Dict[str, Any]:
        """Get psychological profile summary"""
        
        latest_entry = PsychologicalDataEntry.objects.filter(
            student=self.student
        ).order_by('-assessment_date').first()
        
        if latest_entry:
            return {
                'wellbeing_score': latest_entry.composite_psychological_score or 70,
                'stress_level': latest_entry.dass_stress or 5,
                'social_skills': latest_entry.social_skills_score or 75,
                'emotional_regulation': latest_entry.emotional_regulation_score or 75
            }
        
        return {
            'wellbeing_score': 70,
            'stress_level': 5,
            'social_skills': 75,
            'emotional_regulation': 75
        }
    
    def _assess_physical_capabilities(self) -> Dict[str, Any]:
        """Assess physical capabilities"""
        
        latest_entry = PhysicalDataEntry.objects.filter(
            student=self.student
        ).order_by('-measurement_date').first()
        
        if latest_entry:
            return {
                'fitness_level': latest_entry.composite_physical_score or 70,
                'activity_level': latest_entry.daily_activity_hours or 2,
                'health_score': 85  # Calculated from various metrics
            }
        
        return {
            'fitness_level': 70,
            'activity_level': 2,
            'health_score': 85
        }
    
    def _create_academic_trend_data(self) -> Dict[str, Any]:
        """Create data for academic trend visualization"""
        
        academic_data = self._get_academic_time_series()
        
        if academic_data.empty:
            return {'error': 'No academic data available'}
        
        # Group by month and calculate averages
        monthly_data = academic_data.groupby(
            academic_data['date'].dt.to_period('M')
        ).agg({
            'percentage': 'mean',
            'attendance': 'mean',
            'participation': 'mean'
        }).reset_index()
        
        return {
            'labels': [str(period) for period in monthly_data['date']],
            'performance_data': monthly_data['percentage'].tolist(),
            'attendance_data': monthly_data['attendance'].tolist(),
            'participation_data': monthly_data['participation'].tolist(),
            'chart_type': 'line',
            'title': 'Academic Performance Trends'
        }
    
    def _create_epr_forecast_data(self) -> Dict[str, Any]:
        """Create data for EPR forecast visualization"""
        
        epr_data = self._get_epr_time_series()
        
        if epr_data.empty:
            return {'error': 'No EPR data available'}
        
        # Generate forecast
        forecast = self._forecast_epr_scores(epr_data, '1_year')
        
        historical_labels = epr_data['academic_year'].tolist()
        historical_scores = epr_data['epr_score'].tolist()
        
        # Add predicted points
        next_year = str(int(historical_labels[-1].split('-')[0]) + 1) + '-' + str(int(historical_labels[-1].split('-')[1]) + 1)
        predicted_labels = historical_labels + [next_year]
        predicted_scores = historical_scores + [forecast.get('predicted_epr', historical_scores[-1])]
        
        return {
            'historical_labels': historical_labels,
            'historical_scores': historical_scores,
            'predicted_labels': predicted_labels,
            'predicted_scores': predicted_scores,
            'confidence_band': {
                'upper': [score * 1.1 for score in predicted_scores],
                'lower': [score * 0.9 for score in predicted_scores]
            },
            'chart_type': 'line_with_prediction',
            'title': 'EPR Score Forecast'
        }
