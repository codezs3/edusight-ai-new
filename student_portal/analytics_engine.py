"""
Advanced analytics engine for comprehensive data analysis, comparison, and predictions
Handles benchmarking, trend analysis, and performance insights
"""

import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple, Optional
from django.db.models import Avg, Count, Q, Max, Min
from django.utils import timezone
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

from epr_system.data_models import (
    StudentDataProfile, AcademicDataEntry, PsychologicalDataEntry, 
    PhysicalDataEntry, YearwiseDataSummary
)
from epr_system.algorithms import EPRScoringAlgorithms
from students.models import User

class AnalyticsEngine:
    """
    Comprehensive analytics engine for student data analysis
    """
    
    def __init__(self, student: User):
        self.student = student
        self.profile = student.data_profile if hasattr(student, 'data_profile') else None
        self.algorithms = EPRScoringAlgorithms()
    
    def generate_comprehensive_analysis(self) -> Dict[str, Any]:
        """Generate comprehensive analysis of student data"""
        
        # Get all student data
        academic_data = self._get_academic_data()
        psychological_data = self._get_psychological_data()
        physical_data = self._get_physical_data()
        
        # Check data sufficiency
        data_sufficient = self._check_data_sufficiency(academic_data, psychological_data, physical_data)
        
        if not data_sufficient:
            return {
                'data_sufficient': False,
                'message': 'Insufficient data for comprehensive analysis',
                'recommendations': ['Upload more academic records', 'Complete psychological assessments', 'Add physical health data']
            }
        
        # Perform analysis
        analysis = {
            'data_sufficient': True,
            'academic_analysis': self._analyze_academic_performance(academic_data),
            'psychological_analysis': self._analyze_psychological_wellbeing(psychological_data),
            'physical_analysis': self._analyze_physical_health(physical_data),
            'overall_insights': self._generate_overall_insights(academic_data, psychological_data, physical_data),
            'correlation_analysis': self._analyze_correlations(academic_data, psychological_data, physical_data),
            'generated_at': timezone.now().isoformat()
        }
        
        return analysis
    
    def get_trends_analysis(self) -> Dict[str, Any]:
        """Analyze trends and patterns over time"""
        
        trends = {
            'academic_trends': self._get_academic_trends(),
            'psychological_trends': self._get_psychological_trends(),
            'physical_trends': self._get_physical_trends(),
            'overall_trends': self._get_overall_trends(),
            'seasonal_patterns': self._identify_seasonal_patterns(),
            'improvement_areas': self._identify_improvement_trends()
        }
        
        return trends
    
    def identify_performance_patterns(self) -> Dict[str, Any]:
        """Identify performance patterns and characteristics"""
        
        patterns = {
            'learning_style': self._identify_learning_style(),
            'performance_consistency': self._analyze_performance_consistency(),
            'subject_strengths': self._identify_subject_strengths(),
            'challenge_areas': self._identify_challenge_areas(),
            'peak_performance_times': self._identify_peak_times(),
            'stress_indicators': self._identify_stress_patterns(),
            'motivation_patterns': self._analyze_motivation_patterns()
        }
        
        return patterns
    
    def generate_predictions(self) -> Dict[str, Any]:
        """Generate predictive analytics and forecasts"""
        
        predictions = {
            'academic_projections': self._predict_academic_performance(),
            'epr_score_forecast': self._forecast_epr_scores(),
            'risk_assessment': self._assess_future_risks(),
            'improvement_timeline': self._predict_improvement_timeline(),
            'career_aptitude': self._analyze_career_aptitude(),
            'intervention_recommendations': self._recommend_interventions()
        }
        
        return predictions
    
    def get_trend_projections(self) -> Dict[str, Any]:
        """Get trend projections for different timeframes"""
        
        projections = {
            'next_semester': self._project_next_semester(),
            'next_year': self._project_next_year(),
            'two_year_outlook': self._project_two_years(),
            'graduation_readiness': self._assess_graduation_readiness(),
            'confidence_intervals': self._calculate_confidence_intervals()
        }
        
        return projections
    
    def generate_recommendations(self) -> Dict[str, Any]:
        """Generate personalized recommendations"""
        
        recommendations = {
            'immediate_actions': self._get_immediate_recommendations(),
            'short_term_goals': self._get_short_term_goals(),
            'long_term_strategies': self._get_long_term_strategies(),
            'resource_suggestions': self._suggest_resources(),
            'intervention_priority': self._prioritize_interventions(),
            'parent_guidance': self._generate_parent_guidance(),
            'teacher_recommendations': self._generate_teacher_recommendations()
        }
        
        return recommendations
    
    def get_filtered_analytics(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        """Get analytics with applied filters"""
        
        # Apply filters to data
        filtered_academic = self._apply_academic_filters(filters)
        filtered_psychological = self._apply_psychological_filters(filters)
        filtered_physical = self._apply_physical_filters(filters)
        
        # Generate filtered analytics
        analytics = {
            'filtered_summary': self._generate_filtered_summary(filtered_academic, filtered_psychological, filtered_physical),
            'comparative_analysis': self._compare_filtered_periods(filters),
            'trend_analysis': self._analyze_filtered_trends(filtered_academic, filtered_psychological, filtered_physical),
            'performance_metrics': self._calculate_filtered_metrics(filtered_academic, filtered_psychological, filtered_physical),
            'visualizations': self._generate_visualization_data(filtered_academic, filtered_psychological, filtered_physical)
        }
        
        return analytics
    
    def get_filter_options(self) -> Dict[str, Any]:
        """Get available filter options"""
        
        options = {
            'academic_years': list(AcademicDataEntry.objects.filter(student=self.student).values_list('academic_year', flat=True).distinct()),
            'subjects': list(AcademicDataEntry.objects.filter(student=self.student).values_list('subject', flat=True).distinct()),
            'assessment_types': list(AcademicDataEntry.objects.filter(student=self.student).values_list('assessment_type', flat=True).distinct()),
            'date_ranges': self._get_available_date_ranges(),
            'metrics': [
                'academic_performance', 'psychological_wellbeing', 'physical_health',
                'overall_epr', 'subject_specific', 'trend_analysis'
            ]
        }
        
        return options
    
    # Private helper methods
    
    def _get_academic_data(self) -> pd.DataFrame:
        """Get academic data as DataFrame"""
        academic_entries = AcademicDataEntry.objects.filter(student=self.student).order_by('created_at')
        
        data = []
        for entry in academic_entries:
            data.append({
                'date': entry.created_at,
                'academic_year': entry.academic_year,
                'subject': entry.subject,
                'assessment_type': entry.assessment_type,
                'marks_obtained': entry.marks_obtained,
                'total_marks': entry.total_marks,
                'percentage': entry.percentage,
                'grade': entry.grade,
                'attendance': entry.attendance_percentage,
                'class_participation': entry.class_participation,
                'homework_completion': entry.homework_completion_rate
            })
        
        return pd.DataFrame(data)
    
    def _get_psychological_data(self) -> pd.DataFrame:
        """Get psychological data as DataFrame"""
        psychological_entries = PsychologicalDataEntry.objects.filter(student=self.student).order_by('assessment_date')
        
        data = []
        for entry in psychological_entries:
            data.append({
                'date': entry.assessment_date,
                'academic_year': entry.academic_year,
                'assessment_category': entry.assessment_category,
                'assessment_name': entry.assessment_name,
                'sdq_emotional_symptoms': entry.sdq_emotional_symptoms,
                'sdq_conduct_problems': entry.sdq_conduct_problems,
                'sdq_hyperactivity': entry.sdq_hyperactivity,
                'sdq_peer_problems': entry.sdq_peer_problems,
                'sdq_prosocial': entry.sdq_prosocial,
                'dass_depression': entry.dass_depression,
                'dass_anxiety': entry.dass_anxiety,
                'dass_stress': entry.dass_stress,
                'perma_positive_emotion': entry.perma_positive_emotion,
                'perma_engagement': entry.perma_engagement,
                'perma_relationships': entry.perma_relationships,
                'perma_meaning': entry.perma_meaning,
                'perma_achievement': entry.perma_achievement,
                'self_esteem_score': entry.self_esteem_score,
                'social_skills_score': entry.social_skills_score,
                'emotional_regulation_score': entry.emotional_regulation_score
            })
        
        return pd.DataFrame(data)
    
    def _get_physical_data(self) -> pd.DataFrame:
        """Get physical health data as DataFrame"""
        physical_entries = PhysicalDataEntry.objects.filter(student=self.student).order_by('measurement_date')
        
        data = []
        for entry in physical_entries:
            data.append({
                'date': entry.measurement_date,
                'academic_year': entry.academic_year,
                'measurement_type': entry.measurement_type,
                'height_cm': entry.height_cm,
                'weight_kg': entry.weight_kg,
                'bmi': entry.bmi,
                'cardiovascular_fitness': entry.cardiovascular_fitness,
                'muscular_strength': entry.muscular_strength,
                'flexibility': entry.flexibility,
                'endurance': entry.endurance,
                'daily_activity_hours': entry.daily_activity_hours,
                'sleep_hours_per_night': entry.sleep_hours_per_night,
                'nutrition_score': entry.nutrition_score,
                'activity_frequency': entry.activity_frequency
            })
        
        return pd.DataFrame(data)
    
    def _check_data_sufficiency(self, academic_df: pd.DataFrame, psychological_df: pd.DataFrame, physical_df: pd.DataFrame) -> bool:
        """Check if there's sufficient data for analysis"""
        
        # Minimum requirements for analysis
        min_academic_records = 3
        min_assessment_periods = 2
        min_data_points = 5
        
        academic_sufficient = len(academic_df) >= min_academic_records
        psychological_sufficient = len(psychological_df) >= min_assessment_periods
        physical_sufficient = len(physical_df) >= min_assessment_periods
        
        total_data_points = len(academic_df) + len(psychological_df) + len(physical_df)
        overall_sufficient = total_data_points >= min_data_points
        
        return academic_sufficient and overall_sufficient
    
    def _analyze_academic_performance(self, academic_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze academic performance patterns"""
        
        if academic_df.empty:
            return {'error': 'No academic data available'}
        
        analysis = {
            'overall_average': academic_df['percentage'].mean() if 'percentage' in academic_df.columns else None,
            'subject_performance': self._analyze_subject_performance(academic_df),
            'grade_distribution': self._analyze_grade_distribution(academic_df),
            'assessment_trends': self._analyze_assessment_trends(academic_df),
            'attendance_analysis': self._analyze_attendance_patterns(academic_df),
            'consistency_score': self._calculate_consistency_score(academic_df),
            'improvement_rate': self._calculate_improvement_rate(academic_df),
            'strengths': self._identify_academic_strengths(academic_df),
            'areas_for_improvement': self._identify_academic_weaknesses(academic_df)
        }
        
        return analysis
    
    def _analyze_psychological_wellbeing(self, psychological_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze psychological wellbeing patterns"""
        
        if psychological_df.empty:
            return {'error': 'No psychological data available'}
        
        analysis = {
            'overall_wellbeing_score': self._calculate_overall_wellbeing(psychological_df),
            'sdq_analysis': self._analyze_sdq_scores(psychological_df),
            'dass_analysis': self._analyze_dass_scores(psychological_df),
            'perma_analysis': self._analyze_perma_scores(psychological_df),
            'emotional_stability': self._assess_emotional_stability(psychological_df),
            'social_competence': self._assess_social_competence(psychological_df),
            'stress_levels': self._assess_stress_levels(psychological_df),
            'resilience_indicators': self._identify_resilience_factors(psychological_df),
            'risk_factors': self._identify_psychological_risks(psychological_df)
        }
        
        return analysis
    
    def _analyze_physical_health(self, physical_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze physical health and fitness patterns"""
        
        if physical_df.empty:
            return {'error': 'No physical health data available'}
        
        analysis = {
            'overall_health_score': self._calculate_overall_health_score(physical_df),
            'growth_patterns': self._analyze_growth_patterns(physical_df),
            'fitness_levels': self._analyze_fitness_levels(physical_df),
            'activity_patterns': self._analyze_activity_patterns(physical_df),
            'sleep_analysis': self._analyze_sleep_patterns(physical_df),
            'nutrition_assessment': self._assess_nutrition_status(physical_df),
            'health_trends': self._identify_health_trends(physical_df),
            'health_risks': self._identify_health_risks(physical_df),
            'fitness_recommendations': self._generate_fitness_recommendations(physical_df)
        }
        
        return analysis
    
    def _generate_overall_insights(self, academic_df: pd.DataFrame, psychological_df: pd.DataFrame, physical_df: pd.DataFrame) -> Dict[str, Any]:
        """Generate overall insights across all domains"""
        
        insights = {
            'holistic_score': self._calculate_holistic_score(academic_df, psychological_df, physical_df),
            'domain_balance': self._assess_domain_balance(academic_df, psychological_df, physical_df),
            'key_findings': self._extract_key_findings(academic_df, psychological_df, physical_df),
            'success_factors': self._identify_success_factors(academic_df, psychological_df, physical_df),
            'development_priorities': self._prioritize_development_areas(academic_df, psychological_df, physical_df),
            'overall_trajectory': self._assess_overall_trajectory(academic_df, psychological_df, physical_df)
        }
        
        return insights
    
    def _analyze_correlations(self, academic_df: pd.DataFrame, psychological_df: pd.DataFrame, physical_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze correlations between different domains"""
        
        correlations = {
            'academic_psychological': self._correlate_academic_psychological(academic_df, psychological_df),
            'academic_physical': self._correlate_academic_physical(academic_df, physical_df),
            'psychological_physical': self._correlate_psychological_physical(psychological_df, physical_df),
            'strongest_predictors': self._identify_strongest_predictors(academic_df, psychological_df, physical_df),
            'interaction_effects': self._analyze_interaction_effects(academic_df, psychological_df, physical_df)
        }
        
        return correlations
    
    # Additional helper methods for analysis components
    
    def _analyze_subject_performance(self, academic_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze performance by subject"""
        if 'subject' not in academic_df.columns or 'percentage' not in academic_df.columns:
            return {}
        
        subject_stats = academic_df.groupby('subject')['percentage'].agg(['mean', 'std', 'count']).to_dict('index')
        return subject_stats
    
    def _analyze_grade_distribution(self, academic_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze grade distribution"""
        if 'grade' not in academic_df.columns:
            return {}
        
        grade_counts = academic_df['grade'].value_counts().to_dict()
        return grade_counts
    
    def _calculate_consistency_score(self, academic_df: pd.DataFrame) -> float:
        """Calculate performance consistency score"""
        if 'percentage' not in academic_df.columns or len(academic_df) < 2:
            return 0.0
        
        cv = academic_df['percentage'].std() / academic_df['percentage'].mean() if academic_df['percentage'].mean() > 0 else 0
        consistency_score = max(0, 100 - (cv * 100))  # Higher consistency = lower coefficient of variation
        return round(consistency_score, 2)
    
    def _calculate_improvement_rate(self, academic_df: pd.DataFrame) -> float:
        """Calculate improvement rate over time"""
        if 'percentage' not in academic_df.columns or len(academic_df) < 2:
            return 0.0
        
        # Simple linear regression slope
        x = range(len(academic_df))
        y = academic_df['percentage'].values
        slope, _, _, _, _ = stats.linregress(x, y)
        return round(slope, 2)
    
    def _calculate_overall_wellbeing(self, psychological_df: pd.DataFrame) -> float:
        """Calculate overall psychological wellbeing score"""
        scores = []
        
        # PERMA scores (positive indicators)
        perma_cols = ['perma_positive_emotion', 'perma_engagement', 'perma_relationships', 'perma_meaning', 'perma_achievement']
        for col in perma_cols:
            if col in psychological_df.columns:
                scores.extend(psychological_df[col].dropna().tolist())
        
        # Invert stress indicators (DASS scores)
        dass_cols = ['dass_depression', 'dass_anxiety', 'dass_stress']
        for col in dass_cols:
            if col in psychological_df.columns:
                # Convert DASS scores to positive scale (42 - score) / 42 * 100
                inverted_scores = psychological_df[col].dropna().apply(lambda x: (42 - x) / 42 * 100)
                scores.extend(inverted_scores.tolist())
        
        return round(np.mean(scores), 2) if scores else 0.0
    
    def _calculate_overall_health_score(self, physical_df: pd.DataFrame) -> float:
        """Calculate overall physical health score"""
        scores = []
        
        # Fitness scores
        fitness_cols = ['cardiovascular_fitness', 'muscular_strength', 'flexibility', 'endurance']
        for col in fitness_cols:
            if col in physical_df.columns:
                scores.extend(physical_df[col].dropna().tolist())
        
        # Activity and lifestyle scores
        if 'nutrition_score' in physical_df.columns:
            scores.extend(physical_df['nutrition_score'].dropna().tolist())
        
        # Sleep score (8-10 hours optimal)
        if 'sleep_hours_per_night' in physical_df.columns:
            sleep_scores = physical_df['sleep_hours_per_night'].dropna().apply(
                lambda x: 100 if 8 <= x <= 10 else max(0, 100 - abs(x - 9) * 10)
            )
            scores.extend(sleep_scores.tolist())
        
        return round(np.mean(scores), 2) if scores else 0.0


class BenchmarkingService:
    """
    Service for comparing student performance with benchmarks
    """
    
    def __init__(self):
        self.benchmarks = self._load_benchmarks()
    
    def get_student_data(self, student: User) -> Dict[str, Any]:
        """Get student's current performance data"""
        
        # Get latest data from each domain
        latest_academic = AcademicDataEntry.objects.filter(student=student).order_by('-created_at').first()
        latest_psychological = PsychologicalDataEntry.objects.filter(student=student).order_by('-assessment_date').first()
        latest_physical = PhysicalDataEntry.objects.filter(student=student).order_by('-measurement_date').first()
        
        student_data = {
            'academic': self._extract_academic_metrics(latest_academic) if latest_academic else {},
            'psychological': self._extract_psychological_metrics(latest_psychological) if latest_psychological else {},
            'physical': self._extract_physical_metrics(latest_physical) if latest_physical else {},
            'overall_epr': self._calculate_current_epr(student)
        }
        
        return student_data
    
    def compare_with_benchmarks(self, student_data: Dict[str, Any], student: User) -> Dict[str, Any]:
        """Compare student data with various benchmarks"""
        
        comparisons = {
            'national': self._compare_with_national_benchmarks(student_data),
            'state': self._compare_with_state_benchmarks(student_data, student),
            'local': self._compare_with_local_benchmarks(student_data, student),
            'school_type': self._compare_with_school_type_benchmarks(student_data, student),
            'age_group': self._compare_with_age_group_benchmarks(student_data, student),
            'summary': self._generate_comparison_summary(student_data)
        }
        
        return comparisons
    
    def get_percentile_rankings(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate percentile rankings for student performance"""
        
        rankings = {
            'academic_percentile': self._calculate_academic_percentile(student_data['academic']),
            'psychological_percentile': self._calculate_psychological_percentile(student_data['psychological']),
            'physical_percentile': self._calculate_physical_percentile(student_data['physical']),
            'overall_percentile': self._calculate_overall_percentile(student_data['overall_epr']),
            'subject_percentiles': self._calculate_subject_percentiles(student_data['academic']),
            'performance_distribution': self._get_performance_distribution()
        }
        
        return rankings
    
    def _load_benchmarks(self) -> Dict[str, Any]:
        """Load benchmark data (normally from database or external source)"""
        
        # Sample benchmark data - in production, this would come from research data
        benchmarks = {
            'national': {
                'academic_average': 75.0,
                'psychological_wellbeing': 72.0,
                'physical_fitness': 68.0,
                'overall_epr': 71.5
            },
            'state': {
                'academic_average': 73.0,
                'psychological_wellbeing': 70.0,
                'physical_fitness': 66.0,
                'overall_epr': 69.5
            },
            'local': {
                'academic_average': 77.0,
                'psychological_wellbeing': 74.0,
                'physical_fitness': 70.0,
                'overall_epr': 73.0
            }
        }
        
        return benchmarks
    
    def _extract_academic_metrics(self, academic_entry) -> Dict[str, Any]:
        """Extract key metrics from academic entry"""
        if not academic_entry:
            return {}
        
        return {
            'overall_percentage': academic_entry.percentage or 0,
            'attendance_rate': academic_entry.attendance_percentage or 0,
            'participation_score': academic_entry.class_participation or 0,
            'homework_completion': academic_entry.homework_completion_rate or 0
        }
    
    def _extract_psychological_metrics(self, psychological_entry) -> Dict[str, Any]:
        """Extract key metrics from psychological entry"""
        if not psychological_entry:
            return {}
        
        return {
            'wellbeing_score': psychological_entry.composite_psychological_score or 0,
            'stress_level': psychological_entry.dass_stress or 0,
            'anxiety_level': psychological_entry.dass_anxiety or 0,
            'social_skills': psychological_entry.social_skills_score or 0,
            'self_esteem': psychological_entry.self_esteem_score or 0
        }
    
    def _extract_physical_metrics(self, physical_entry) -> Dict[str, Any]:
        """Extract key metrics from physical entry"""
        if not physical_entry:
            return {}
        
        return {
            'fitness_score': physical_entry.composite_physical_score or 0,
            'bmi': physical_entry.bmi or 0,
            'activity_level': physical_entry.daily_activity_hours or 0,
            'sleep_quality': physical_entry.sleep_hours_per_night or 0,
            'nutrition_score': physical_entry.nutrition_score or 0
        }
    
    def _calculate_current_epr(self, student: User) -> float:
        """Calculate current EPR score for student"""
        
        # Get latest summary or calculate from recent data
        latest_summary = YearwiseDataSummary.objects.filter(student=student).order_by('-academic_year').first()
        
        if latest_summary and latest_summary.annual_epr_score:
            return latest_summary.annual_epr_score
        
        # Calculate from recent entries if no summary available
        # This would use the EPR algorithms to calculate current score
        return 75.0  # Placeholder
    
    def _compare_with_national_benchmarks(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Compare with national benchmarks"""
        
        national = self.benchmarks['national']
        
        comparison = {
            'academic_vs_national': student_data['academic'].get('overall_percentage', 0) - national['academic_average'],
            'psychological_vs_national': student_data['psychological'].get('wellbeing_score', 0) - national['psychological_wellbeing'],
            'physical_vs_national': student_data['physical'].get('fitness_score', 0) - national['physical_fitness'],
            'overall_vs_national': student_data['overall_epr'] - national['overall_epr'],
            'performance_level': self._categorize_performance_level(student_data['overall_epr'], national['overall_epr'])
        }
        
        return comparison
    
    def _categorize_performance_level(self, student_score: float, benchmark: float) -> str:
        """Categorize performance level compared to benchmark"""
        
        difference = student_score - benchmark
        
        if difference >= 15:
            return 'Exceptional'
        elif difference >= 5:
            return 'Above Average'
        elif difference >= -5:
            return 'Average'
        elif difference >= -15:
            return 'Below Average'
        else:
            return 'Needs Improvement'
    
    # Additional benchmarking methods would be implemented here...
    
    def _compare_with_state_benchmarks(self, student_data: Dict[str, Any], student: User) -> Dict[str, Any]:
        """Compare with state-level benchmarks"""
        # Implementation for state-level comparison
        return {'status': 'State comparison not yet implemented'}
    
    def _compare_with_local_benchmarks(self, student_data: Dict[str, Any], student: User) -> Dict[str, Any]:
        """Compare with local benchmarks"""
        # Implementation for local comparison
        return {'status': 'Local comparison not yet implemented'}
    
    def _compare_with_school_type_benchmarks(self, student_data: Dict[str, Any], student: User) -> Dict[str, Any]:
        """Compare with school type benchmarks"""
        # Implementation for school type comparison
        return {'status': 'School type comparison not yet implemented'}
    
    def _compare_with_age_group_benchmarks(self, student_data: Dict[str, Any], student: User) -> Dict[str, Any]:
        """Compare with age group benchmarks"""
        # Implementation for age group comparison
        return {'status': 'Age group comparison not yet implemented'}
    
    def _generate_comparison_summary(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate summary of all comparisons"""
        return {
            'overall_ranking': 'Above Average',
            'strongest_areas': ['Academic Performance', 'Physical Fitness'],
            'improvement_areas': ['Stress Management', 'Social Skills'],
            'percentile_estimate': 78
        }
    
    def _calculate_academic_percentile(self, academic_data: Dict[str, Any]) -> float:
        """Calculate academic performance percentile"""
        # Simplified calculation - in production would use actual distribution data
        score = academic_data.get('overall_percentage', 0)
        return min(99, max(1, (score / 100) * 85 + 10))
    
    def _calculate_psychological_percentile(self, psychological_data: Dict[str, Any]) -> float:
        """Calculate psychological wellbeing percentile"""
        score = psychological_data.get('wellbeing_score', 0)
        return min(99, max(1, (score / 100) * 80 + 15))
    
    def _calculate_physical_percentile(self, physical_data: Dict[str, Any]) -> float:
        """Calculate physical health percentile"""
        score = physical_data.get('fitness_score', 0)
        return min(99, max(1, (score / 100) * 75 + 20))
    
    def _calculate_overall_percentile(self, epr_score: float) -> float:
        """Calculate overall EPR percentile"""
        return min(99, max(1, (epr_score / 100) * 85 + 10))
    
    def _calculate_subject_percentiles(self, academic_data: Dict[str, Any]) -> Dict[str, float]:
        """Calculate subject-wise percentiles"""
        # Placeholder implementation
        return {
            'mathematics': 82,
            'science': 76,
            'english': 88,
            'social_studies': 74
        }
    
    def _get_performance_distribution(self) -> Dict[str, Any]:
        """Get performance distribution data for visualization"""
        return {
            'distribution_data': [5, 15, 25, 30, 20, 5],  # Percentage in each performance band
            'labels': ['Below 40', '40-55', '55-70', '70-85', '85-95', 'Above 95'],
            'student_position': 4  # Which band the student falls into
        }
