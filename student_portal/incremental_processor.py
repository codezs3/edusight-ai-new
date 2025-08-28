"""
Incremental data update and recalculation system
Handles ongoing data additions and automatically updates all analytics and scores
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from django.db import transaction
from django.utils import timezone
from django.core.cache import cache
from django.db.models import Q, Max, Min
from celery import shared_task

from epr_system.data_models import (
    StudentDataProfile, DataUpload, AcademicDataEntry, 
    PsychologicalDataEntry, PhysicalDataEntry, DataValidationIssue,
    YearwiseDataSummary
)
from epr_system.algorithms import EPRScoringAlgorithms
from students.models import User
from .analytics_engine import AnalyticsEngine, BenchmarkingService
from .prediction_engine import PredictionEngine

# Set up logging
logger = logging.getLogger(__name__)

class IncrementalProcessor:
    """
    Manages incremental data updates and automated recalculations
    """
    
    def __init__(self, student: User):
        self.student = student
        self.profile = student.data_profile if hasattr(student, 'data_profile') else None
        self.scoring_algorithms = EPRScoringAlgorithms()
        
    def process_new_data_entry(self, entry_type: str, entry_id: int) -> Dict[str, Any]:
        """Process a new data entry and trigger all necessary updates"""
        
        logger.info(f"Processing new {entry_type} entry {entry_id} for student {self.student.id}")
        
        try:
            with transaction.atomic():
                # Get the new entry
                entry = self._get_entry_by_type_and_id(entry_type, entry_id)
                if not entry:
                    return {'success': False, 'error': 'Entry not found'}
                
                # Update completion status
                self._update_completion_status(entry_type)
                
                # Recalculate domain scores
                domain_updates = self._recalculate_domain_scores(entry_type, entry)
                
                # Update yearly summaries
                yearly_updates = self._update_yearly_summaries(entry)
                
                # Recalculate EPR scores
                epr_updates = self._recalculate_epr_scores()
                
                # Update analytics cache
                self._update_analytics_cache()
                
                # Trigger workflow if needed
                workflow_triggered = self._trigger_workflows_if_needed(entry_type, entry)
                
                # Generate notifications
                notifications = self._generate_update_notifications(entry_type, entry, epr_updates)
                
                result = {
                    'success': True,
                    'entry_type': entry_type,
                    'entry_id': entry_id,
                    'domain_updates': domain_updates,
                    'yearly_updates': yearly_updates,
                    'epr_updates': epr_updates,
                    'workflow_triggered': workflow_triggered,
                    'notifications': notifications,
                    'processed_at': timezone.now()
                }
                
                # Log successful processing
                logger.info(f"Successfully processed new {entry_type} entry for student {self.student.id}")
                
                return result
                
        except Exception as e:
            logger.error(f"Error processing new {entry_type} entry: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def handle_bulk_data_update(self, entries: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Handle bulk data updates efficiently"""
        
        logger.info(f"Processing bulk data update with {len(entries)} entries for student {self.student.id}")
        
        try:
            with transaction.atomic():
                processed_entries = []
                failed_entries = []
                
                # Process each entry
                for entry_info in entries:
                    try:
                        result = self.process_new_data_entry(
                            entry_info['entry_type'], 
                            entry_info['entry_id']
                        )
                        
                        if result['success']:
                            processed_entries.append(entry_info)
                        else:
                            failed_entries.append({**entry_info, 'error': result['error']})
                            
                    except Exception as e:
                        failed_entries.append({**entry_info, 'error': str(e)})
                
                # Final recalculations after all entries processed
                final_epr_update = self._recalculate_epr_scores()
                final_analytics_update = self._update_analytics_cache()
                
                return {
                    'success': True,
                    'processed_count': len(processed_entries),
                    'failed_count': len(failed_entries),
                    'processed_entries': processed_entries,
                    'failed_entries': failed_entries,
                    'final_epr_update': final_epr_update,
                    'final_analytics_update': final_analytics_update
                }
                
        except Exception as e:
            logger.error(f"Error in bulk data update: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def recalculate_all_metrics(self, force: bool = False) -> Dict[str, Any]:
        """Recalculate all metrics for the student"""
        
        cache_key = f"full_recalculation_{self.student.id}"
        
        # Check if recalculation was done recently (unless forced)
        if not force and cache.get(cache_key):
            return {'success': False, 'message': 'Full recalculation done recently'}
        
        logger.info(f"Starting full metrics recalculation for student {self.student.id}")
        
        try:
            with transaction.atomic():
                # Recalculate domain scores
                academic_scores = self._recalculate_academic_scores()
                psychological_scores = self._recalculate_psychological_scores()
                physical_scores = self._recalculate_physical_scores()
                
                # Update all yearly summaries
                yearly_summaries = self._rebuild_yearly_summaries()
                
                # Recalculate EPR scores
                epr_scores = self._recalculate_all_epr_scores()
                
                # Update completion status
                completion_update = self._update_all_completion_status()
                
                # Clear and rebuild analytics cache
                analytics_update = self._rebuild_analytics_cache()
                
                # Update benchmarking data
                benchmarking_update = self._update_benchmarking_data()
                
                # Set cache to prevent frequent recalculations
                cache.set(cache_key, True, timeout=3600)  # 1 hour
                
                result = {
                    'success': True,
                    'academic_scores': academic_scores,
                    'psychological_scores': psychological_scores,
                    'physical_scores': physical_scores,
                    'yearly_summaries': yearly_summaries,
                    'epr_scores': epr_scores,
                    'completion_update': completion_update,
                    'analytics_update': analytics_update,
                    'benchmarking_update': benchmarking_update,
                    'recalculated_at': timezone.now()
                }
                
                logger.info(f"Completed full metrics recalculation for student {self.student.id}")
                return result
                
        except Exception as e:
            logger.error(f"Error in full metrics recalculation: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def handle_data_correction(self, entry_type: str, entry_id: int, corrections: Dict[str, Any]) -> Dict[str, Any]:
        """Handle data corrections and trigger necessary updates"""
        
        logger.info(f"Processing data correction for {entry_type} entry {entry_id}")
        
        try:
            with transaction.atomic():
                # Get and update the entry
                entry = self._get_entry_by_type_and_id(entry_type, entry_id)
                if not entry:
                    return {'success': False, 'error': 'Entry not found'}
                
                # Store original values for comparison
                original_values = self._extract_key_values(entry)
                
                # Apply corrections
                updated_entry = self._apply_corrections(entry, corrections)
                
                # Calculate impact of changes
                impact_analysis = self._analyze_correction_impact(original_values, updated_entry)
                
                # Recalculate affected metrics
                affected_updates = self._recalculate_affected_metrics(entry_type, updated_entry, impact_analysis)
                
                # Update downstream calculations
                downstream_updates = self._update_downstream_calculations(entry_type, updated_entry)
                
                return {
                    'success': True,
                    'entry_type': entry_type,
                    'entry_id': entry_id,
                    'corrections_applied': corrections,
                    'impact_analysis': impact_analysis,
                    'affected_updates': affected_updates,
                    'downstream_updates': downstream_updates,
                    'corrected_at': timezone.now()
                }
                
        except Exception as e:
            logger.error(f"Error processing data correction: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def schedule_periodic_updates(self) -> Dict[str, Any]:
        """Schedule periodic updates for the student"""
        
        # Check what updates are needed
        updates_needed = self._check_updates_needed()
        
        scheduled_tasks = []
        
        # Schedule EPR recalculation if needed
        if updates_needed.get('epr_recalculation'):
            task = schedule_epr_recalculation.delay(self.student.id)
            scheduled_tasks.append({'task': 'epr_recalculation', 'task_id': task.id})
        
        # Schedule analytics update if needed
        if updates_needed.get('analytics_update'):
            task = schedule_analytics_update.delay(self.student.id)
            scheduled_tasks.append({'task': 'analytics_update', 'task_id': task.id})
        
        # Schedule yearly summary update if needed
        if updates_needed.get('yearly_summary'):
            task = schedule_yearly_summary_update.delay(self.student.id)
            scheduled_tasks.append({'task': 'yearly_summary', 'task_id': task.id})
        
        return {
            'updates_needed': updates_needed,
            'scheduled_tasks': scheduled_tasks,
            'scheduled_at': timezone.now()
        }
    
    # Private helper methods
    
    def _get_entry_by_type_and_id(self, entry_type: str, entry_id: int):
        """Get entry by type and ID"""
        
        if entry_type == 'academic':
            return AcademicDataEntry.objects.filter(id=entry_id, student=self.student).first()
        elif entry_type == 'psychological':
            return PsychologicalDataEntry.objects.filter(id=entry_id, student=self.student).first()
        elif entry_type == 'physical':
            return PhysicalDataEntry.objects.filter(id=entry_id, student=self.student).first()
        else:
            return None
    
    def _update_completion_status(self, entry_type: str):
        """Update profile completion status"""
        
        if not self.profile:
            return
        
        if entry_type == 'academic':
            self.profile.academic_data_complete = AcademicDataEntry.objects.filter(student=self.student).exists()
        elif entry_type == 'psychological':
            self.profile.psychological_data_complete = PsychologicalDataEntry.objects.filter(student=self.student).exists()
        elif entry_type == 'physical':
            self.profile.physical_data_complete = PhysicalDataEntry.objects.filter(student=self.student).exists()
        
        self.profile.last_updated = timezone.now()
        self.profile.save()
    
    def _recalculate_domain_scores(self, entry_type: str, entry) -> Dict[str, Any]:
        """Recalculate scores for the affected domain"""
        
        updates = {}
        
        if entry_type == 'academic':
            updates = self._recalculate_academic_scores()
        elif entry_type == 'psychological':
            updates = self._recalculate_psychological_scores()
        elif entry_type == 'physical':
            updates = self._recalculate_physical_scores()
        
        return updates
    
    def _recalculate_academic_scores(self) -> Dict[str, Any]:
        """Recalculate academic domain scores"""
        
        academic_entries = AcademicDataEntry.objects.filter(student=self.student)
        
        if not academic_entries.exists():
            return {'message': 'No academic data available'}
        
        # Calculate overall academic average
        total_weighted_score = 0
        total_weight = 0
        
        for entry in academic_entries:
            if entry.percentage:
                weight = entry.total_marks or 100
                total_weighted_score += entry.percentage * weight
                total_weight += weight
        
        overall_average = total_weighted_score / total_weight if total_weight > 0 else 0
        
        # Calculate subject-wise averages
        subject_averages = {}
        for subject in academic_entries.values_list('subject', flat=True).distinct():
            subject_entries = academic_entries.filter(subject=subject)
            subject_avg = subject_entries.aggregate(avg=models.Avg('percentage'))['avg'] or 0
            subject_averages[subject] = subject_avg
        
        # Update profile
        if self.profile:
            self.profile.overall_academic_average = overall_average
            self.profile.save()
        
        return {
            'overall_average': overall_average,
            'subject_averages': subject_averages,
            'total_entries': academic_entries.count()
        }
    
    def _recalculate_psychological_scores(self) -> Dict[str, Any]:
        """Recalculate psychological domain scores"""
        
        psychological_entries = PsychologicalDataEntry.objects.filter(student=self.student)
        
        if not psychological_entries.exists():
            return {'message': 'No psychological data available'}
        
        # Get latest entry for current scores
        latest_entry = psychological_entries.order_by('-assessment_date').first()
        
        if latest_entry:
            # Calculate composite score using EPR algorithms
            composite_score = self.scoring_algorithms.calculate_psychological_composite_score(latest_entry)
            
            # Update the entry with composite score
            latest_entry.composite_psychological_score = composite_score
            latest_entry.save()
            
            return {
                'composite_score': composite_score,
                'latest_assessment_date': latest_entry.assessment_date,
                'total_assessments': psychological_entries.count()
            }
        
        return {'message': 'No valid psychological assessments'}
    
    def _recalculate_physical_scores(self) -> Dict[str, Any]:
        """Recalculate physical domain scores"""
        
        physical_entries = PhysicalDataEntry.objects.filter(student=self.student)
        
        if not physical_entries.exists():
            return {'message': 'No physical data available'}
        
        # Get latest entry for current scores
        latest_entry = physical_entries.order_by('-measurement_date').first()
        
        if latest_entry:
            # Calculate composite score using EPR algorithms
            composite_score = self.scoring_algorithms.calculate_physical_composite_score(latest_entry)
            
            # Update the entry with composite score
            latest_entry.composite_physical_score = composite_score
            latest_entry.save()
            
            return {
                'composite_score': composite_score,
                'latest_measurement_date': latest_entry.measurement_date,
                'total_measurements': physical_entries.count()
            }
        
        return {'message': 'No valid physical measurements'}
    
    def _update_yearly_summaries(self, entry) -> Dict[str, Any]:
        """Update yearly summaries affected by the new entry"""
        
        # Determine which academic years are affected
        affected_years = []
        
        if hasattr(entry, 'academic_year') and entry.academic_year:
            affected_years.append(entry.academic_year)
        
        # Also update current academic year
        current_year = self.profile.current_academic_year if self.profile else f"{datetime.now().year}-{datetime.now().year + 1}"
        if current_year not in affected_years:
            affected_years.append(current_year)
        
        updated_summaries = []
        
        for year in affected_years:
            summary, created = YearwiseDataSummary.objects.get_or_create(
                student=self.student,
                academic_year=year,
                defaults={
                    'overall_academic_average': 0,
                    'emotional_wellbeing_score': 0,
                    'fitness_level': 0,
                    'annual_epr_score': 0
                }
            )
            
            # Recalculate summary for this year
            year_data = self._calculate_yearly_summary_data(year)
            
            summary.overall_academic_average = year_data.get('academic_average', 0)
            summary.emotional_wellbeing_score = year_data.get('psychological_score', 0)
            summary.fitness_level = year_data.get('physical_score', 0)
            summary.annual_epr_score = year_data.get('epr_score', 0)
            summary.epr_performance_band = self._get_performance_band(year_data.get('epr_score', 0))
            summary.last_updated = timezone.now()
            summary.save()
            
            updated_summaries.append({
                'academic_year': year,
                'created': created,
                'epr_score': summary.annual_epr_score,
                'performance_band': summary.epr_performance_band
            })
        
        return {
            'affected_years': affected_years,
            'updated_summaries': updated_summaries
        }
    
    def _calculate_yearly_summary_data(self, academic_year: str) -> Dict[str, float]:
        """Calculate summary data for a specific academic year"""
        
        # Get data for the year
        academic_data = AcademicDataEntry.objects.filter(
            student=self.student,
            academic_year=academic_year
        )
        
        psychological_data = PsychologicalDataEntry.objects.filter(
            student=self.student,
            academic_year=academic_year
        )
        
        physical_data = PhysicalDataEntry.objects.filter(
            student=self.student,
            academic_year=academic_year
        )
        
        # Calculate averages
        academic_avg = academic_data.aggregate(avg=models.Avg('percentage'))['avg'] or 0
        
        psychological_avg = 0
        if psychological_data.exists():
            latest_psych = psychological_data.order_by('-assessment_date').first()
            psychological_avg = latest_psych.composite_psychological_score or 0
        
        physical_avg = 0
        if physical_data.exists():
            latest_phys = physical_data.order_by('-measurement_date').first()
            physical_avg = latest_phys.composite_physical_score or 0
        
        # Calculate EPR score
        epr_score = self.scoring_algorithms.calculate_epr_score(
            academic_avg, psychological_avg, physical_avg
        )
        
        return {
            'academic_average': academic_avg,
            'psychological_score': psychological_avg,
            'physical_score': physical_avg,
            'epr_score': epr_score
        }
    
    def _recalculate_epr_scores(self) -> Dict[str, Any]:
        """Recalculate EPR scores for all academic years"""
        
        summaries = YearwiseDataSummary.objects.filter(student=self.student)
        updated_scores = []
        
        for summary in summaries:
            # Recalculate EPR score
            year_data = self._calculate_yearly_summary_data(summary.academic_year)
            
            old_score = summary.annual_epr_score
            new_score = year_data.get('epr_score', 0)
            
            summary.annual_epr_score = new_score
            summary.epr_performance_band = self._get_performance_band(new_score)
            summary.save()
            
            updated_scores.append({
                'academic_year': summary.academic_year,
                'old_score': old_score,
                'new_score': new_score,
                'change': new_score - old_score,
                'performance_band': summary.epr_performance_band
            })
        
        return {
            'updated_scores': updated_scores,
            'total_summaries_updated': len(updated_scores)
        }
    
    def _get_performance_band(self, epr_score: float) -> str:
        """Get performance band for EPR score"""
        
        if epr_score >= 85:
            return "Thriving"
        elif epr_score >= 70:
            return "Healthy Progress"
        elif epr_score >= 50:
            return "Needs Support"
        else:
            return "At-Risk"
    
    def _update_analytics_cache(self) -> Dict[str, Any]:
        """Update analytics cache with new data"""
        
        try:
            # Clear existing cache
            cache_keys = [
                f"analytics_comprehensive_{self.student.id}",
                f"analytics_trends_{self.student.id}",
                f"analytics_patterns_{self.student.id}",
                f"benchmarking_data_{self.student.id}",
                f"predictions_academic_{self.student.id}",
                f"predictions_epr_{self.student.id}"
            ]
            
            for key in cache_keys:
                cache.delete(key)
            
            # Pre-populate cache with new analytics
            analytics_engine = AnalyticsEngine(self.student)
            
            # Generate and cache new analytics
            comprehensive_analysis = analytics_engine.generate_comprehensive_analysis()
            cache.set(f"analytics_comprehensive_{self.student.id}", comprehensive_analysis, timeout=3600)
            
            trends_analysis = analytics_engine.get_trends_analysis()
            cache.set(f"analytics_trends_{self.student.id}", trends_analysis, timeout=3600)
            
            patterns_analysis = analytics_engine.identify_performance_patterns()
            cache.set(f"analytics_patterns_{self.student.id}", patterns_analysis, timeout=3600)
            
            return {
                'cache_updated': True,
                'keys_cleared': len(cache_keys),
                'new_analytics_cached': True
            }
            
        except Exception as e:
            logger.error(f"Error updating analytics cache: {str(e)}")
            return {'cache_updated': False, 'error': str(e)}
    
    def _trigger_workflows_if_needed(self, entry_type: str, entry) -> Dict[str, Any]:
        """Trigger Airflow workflows if certain conditions are met"""
        
        triggered_workflows = []
        
        # Check if EPR calculation workflow should be triggered
        if self._should_trigger_epr_workflow(entry_type, entry):
            # This would integrate with Airflow to trigger EPR calculation workflow
            triggered_workflows.append('epr_daily_calculation')
        
        # Check if alert workflow should be triggered
        if self._should_trigger_alert_workflow(entry_type, entry):
            triggered_workflows.append('alert_generation')
        
        # Check if report generation workflow should be triggered
        if self._should_trigger_report_workflow(entry_type, entry):
            triggered_workflows.append('report_generation')
        
        return {
            'workflows_triggered': triggered_workflows,
            'trigger_count': len(triggered_workflows)
        }
    
    def _should_trigger_epr_workflow(self, entry_type: str, entry) -> bool:
        """Check if EPR calculation workflow should be triggered"""
        
        # Trigger if this is a significant update
        if entry_type in ['academic', 'psychological', 'physical']:
            # Check if enough new data has been added
            total_entries = (
                AcademicDataEntry.objects.filter(student=self.student).count() +
                PsychologicalDataEntry.objects.filter(student=self.student).count() +
                PhysicalDataEntry.objects.filter(student=self.student).count()
            )
            
            # Trigger workflow if we have sufficient data
            return total_entries >= 5
        
        return False
    
    def _should_trigger_alert_workflow(self, entry_type: str, entry) -> bool:
        """Check if alert workflow should be triggered"""
        
        # Trigger alerts for concerning scores
        if entry_type == 'psychological':
            if hasattr(entry, 'dass_stress') and entry.dass_stress and entry.dass_stress > 20:
                return True
            if hasattr(entry, 'dass_depression') and entry.dass_depression and entry.dass_depression > 20:
                return True
        
        if entry_type == 'academic':
            if hasattr(entry, 'percentage') and entry.percentage and entry.percentage < 40:
                return True
        
        return False
    
    def _should_trigger_report_workflow(self, entry_type: str, entry) -> bool:
        """Check if report generation workflow should be triggered"""
        
        # Trigger if this completes minimum requirements for a report
        if self.profile:
            completion_percentage = self.profile.get_completion_percentage()
            return completion_percentage >= 70
        
        return False
    
    def _generate_update_notifications(self, entry_type: str, entry, epr_updates: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate notifications about the update"""
        
        notifications = []
        
        # EPR score change notification
        if epr_updates and epr_updates.get('updated_scores'):
            for score_update in epr_updates['updated_scores']:
                if abs(score_update.get('change', 0)) >= 5:  # Significant change
                    notifications.append({
                        'type': 'epr_change',
                        'title': 'EPR Score Updated',
                        'message': f"Your EPR score has changed by {score_update['change']:+.1f} points",
                        'academic_year': score_update['academic_year'],
                        'new_score': score_update['new_score'],
                        'priority': 'medium'
                    })
        
        # Completion milestone notification
        if self.profile:
            completion_percentage = self.profile.get_completion_percentage()
            if completion_percentage in [25, 50, 75, 90]:  # Milestone percentages
                notifications.append({
                    'type': 'completion_milestone',
                    'title': 'Data Completion Milestone',
                    'message': f"You've reached {completion_percentage}% data completion!",
                    'completion_percentage': completion_percentage,
                    'priority': 'low'
                })
        
        # Performance band change notification
        if epr_updates and epr_updates.get('updated_scores'):
            for score_update in epr_updates['updated_scores']:
                old_band = self._get_performance_band(score_update.get('old_score', 0))
                new_band = score_update.get('performance_band')
                
                if old_band != new_band:
                    notifications.append({
                        'type': 'performance_band_change',
                        'title': 'Performance Band Updated',
                        'message': f"Your performance band has changed from {old_band} to {new_band}",
                        'old_band': old_band,
                        'new_band': new_band,
                        'priority': 'high'
                    })
        
        return notifications
    
    def _check_updates_needed(self) -> Dict[str, bool]:
        """Check what updates are needed for the student"""
        
        updates_needed = {
            'epr_recalculation': False,
            'analytics_update': False,
            'yearly_summary': False,
            'benchmarking_update': False
        }
        
        # Check if EPR recalculation is needed
        latest_summary = YearwiseDataSummary.objects.filter(student=self.student).order_by('-last_updated').first()
        if latest_summary:
            time_since_update = timezone.now() - latest_summary.last_updated
            if time_since_update > timedelta(days=1):
                updates_needed['epr_recalculation'] = True
        
        # Check if analytics update is needed
        cache_key = f"analytics_comprehensive_{self.student.id}"
        if not cache.get(cache_key):
            updates_needed['analytics_update'] = True
        
        # Check if yearly summary needs update
        current_year = f"{datetime.now().year}-{datetime.now().year + 1}"
        current_summary = YearwiseDataSummary.objects.filter(
            student=self.student,
            academic_year=current_year
        ).first()
        
        if not current_summary:
            updates_needed['yearly_summary'] = True
        
        return updates_needed
    
    def _extract_key_values(self, entry) -> Dict[str, Any]:
        """Extract key values from an entry for comparison"""
        
        key_values = {}
        
        if hasattr(entry, 'percentage'):
            key_values['percentage'] = entry.percentage
        if hasattr(entry, 'dass_stress'):
            key_values['dass_stress'] = entry.dass_stress
        if hasattr(entry, 'dass_anxiety'):
            key_values['dass_anxiety'] = entry.dass_anxiety
        if hasattr(entry, 'dass_depression'):
            key_values['dass_depression'] = entry.dass_depression
        if hasattr(entry, 'bmi'):
            key_values['bmi'] = entry.bmi
        if hasattr(entry, 'cardiovascular_fitness'):
            key_values['cardiovascular_fitness'] = entry.cardiovascular_fitness
        
        return key_values
    
    def _apply_corrections(self, entry, corrections: Dict[str, Any]):
        """Apply corrections to an entry"""
        
        for field, value in corrections.items():
            if hasattr(entry, field):
                setattr(entry, field, value)
        
        entry.save()
        return entry
    
    def _analyze_correction_impact(self, original_values: Dict[str, Any], updated_entry) -> Dict[str, Any]:
        """Analyze the impact of data corrections"""
        
        current_values = self._extract_key_values(updated_entry)
        
        impact = {
            'fields_changed': [],
            'significant_changes': [],
            'impact_level': 'low'
        }
        
        for field, original_value in original_values.items():
            current_value = current_values.get(field)
            
            if original_value != current_value:
                impact['fields_changed'].append(field)
                
                # Check if change is significant
                if isinstance(original_value, (int, float)) and isinstance(current_value, (int, float)):
                    change_percentage = abs((current_value - original_value) / original_value * 100) if original_value != 0 else 100
                    
                    if change_percentage > 10:  # More than 10% change
                        impact['significant_changes'].append({
                            'field': field,
                            'original_value': original_value,
                            'new_value': current_value,
                            'change_percentage': change_percentage
                        })
        
        # Determine overall impact level
        if len(impact['significant_changes']) >= 3:
            impact['impact_level'] = 'high'
        elif len(impact['significant_changes']) >= 1:
            impact['impact_level'] = 'medium'
        
        return impact
    
    def _recalculate_affected_metrics(self, entry_type: str, updated_entry, impact_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Recalculate metrics affected by the correction"""
        
        updates = {}
        
        if impact_analysis['impact_level'] in ['medium', 'high']:
            # Recalculate domain scores
            domain_updates = self._recalculate_domain_scores(entry_type, updated_entry)
            updates['domain_scores'] = domain_updates
            
            # Recalculate EPR scores if high impact
            if impact_analysis['impact_level'] == 'high':
                epr_updates = self._recalculate_epr_scores()
                updates['epr_scores'] = epr_updates
        
        return updates
    
    def _update_downstream_calculations(self, entry_type: str, updated_entry) -> Dict[str, Any]:
        """Update calculations downstream from the corrected entry"""
        
        # Update yearly summaries
        yearly_updates = self._update_yearly_summaries(updated_entry)
        
        # Update analytics cache
        analytics_updates = self._update_analytics_cache()
        
        return {
            'yearly_summaries': yearly_updates,
            'analytics_cache': analytics_updates
        }


# Celery tasks for asynchronous processing

@shared_task
def schedule_epr_recalculation(student_id: int):
    """Scheduled task for EPR recalculation"""
    
    try:
        student = User.objects.get(id=student_id)
        processor = IncrementalProcessor(student)
        result = processor._recalculate_epr_scores()
        
        logger.info(f"Scheduled EPR recalculation completed for student {student_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error in scheduled EPR recalculation for student {student_id}: {str(e)}")
        return {'success': False, 'error': str(e)}

@shared_task
def schedule_analytics_update(student_id: int):
    """Scheduled task for analytics update"""
    
    try:
        student = User.objects.get(id=student_id)
        processor = IncrementalProcessor(student)
        result = processor._update_analytics_cache()
        
        logger.info(f"Scheduled analytics update completed for student {student_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error in scheduled analytics update for student {student_id}: {str(e)}")
        return {'success': False, 'error': str(e)}

@shared_task
def schedule_yearly_summary_update(student_id: int):
    """Scheduled task for yearly summary update"""
    
    try:
        student = User.objects.get(id=student_id)
        processor = IncrementalProcessor(student)
        
        # Update current year summary
        current_year = f"{datetime.now().year}-{datetime.now().year + 1}"
        dummy_entry = type('DummyEntry', (), {'academic_year': current_year})()
        result = processor._update_yearly_summaries(dummy_entry)
        
        logger.info(f"Scheduled yearly summary update completed for student {student_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error in scheduled yearly summary update for student {student_id}: {str(e)}")
        return {'success': False, 'error': str(e)}

@shared_task
def process_incremental_update(student_id: int, entry_type: str, entry_id: int):
    """Process incremental update asynchronously"""
    
    try:
        student = User.objects.get(id=student_id)
        processor = IncrementalProcessor(student)
        result = processor.process_new_data_entry(entry_type, entry_id)
        
        logger.info(f"Incremental update processed for student {student_id}, {entry_type} entry {entry_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error processing incremental update: {str(e)}")
        return {'success': False, 'error': str(e)}


class UpdateManager:
    """
    Manager class for coordinating all update operations
    """
    
    @staticmethod
    def handle_new_data(student: User, entry_type: str, entry_id: int, async_processing: bool = True) -> Dict[str, Any]:
        """Handle new data entry with optional async processing"""
        
        if async_processing:
            # Process asynchronously
            task = process_incremental_update.delay(student.id, entry_type, entry_id)
            return {
                'success': True,
                'processing': 'async',
                'task_id': task.id,
                'message': 'Update processing started in background'
            }
        else:
            # Process synchronously
            processor = IncrementalProcessor(student)
            return processor.process_new_data_entry(entry_type, entry_id)
    
    @staticmethod
    def force_full_recalculation(student: User) -> Dict[str, Any]:
        """Force full recalculation of all metrics"""
        
        processor = IncrementalProcessor(student)
        return processor.recalculate_all_metrics(force=True)
    
    @staticmethod
    def get_update_status(student: User) -> Dict[str, Any]:
        """Get current update status for student"""
        
        processor = IncrementalProcessor(student)
        updates_needed = processor._check_updates_needed()
        
        # Get last update times
        last_epr_update = YearwiseDataSummary.objects.filter(
            student=student
        ).aggregate(latest=Max('last_updated'))['latest']
        
        return {
            'updates_needed': updates_needed,
            'last_epr_update': last_epr_update,
            'data_completion': student.data_profile.get_completion_percentage() if hasattr(student, 'data_profile') else 0,
            'status_checked_at': timezone.now()
        }
