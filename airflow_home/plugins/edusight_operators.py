"""
Custom Airflow operators for EduSight platform operations
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

import django
from django.conf import settings as django_settings

# Add the project path to sys.path
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(project_path)

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'edusight_django.settings')
django.setup()

from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from airflow.exceptions import AirflowException
from airflow.hooks.base import BaseHook
from airflow.providers.email.operators.email import EmailOperator
from airflow.providers.http.hooks.http import HttpHook

# Import Django models
from django.contrib.auth import get_user_model
from assessments.models import Assessment, AssessmentResult
from students.models import Student
from crm.models import Lead, FormSubmission

User = get_user_model()
logger = logging.getLogger(__name__)

class EPRCalculationOperator(BaseOperator):
    """
    Operator to calculate EPR (Edusight Prism Rating) scores for students
    """
    
    template_fields = ['student_id', 'assessment_config']
    
    @apply_defaults
    def __init__(
        self,
        student_id: Optional[str] = None,
        student_ids: Optional[List[str]] = None,
        assessment_config: Optional[Dict[str, Any]] = None,
        force_recalculation: bool = False,
        *args,
        **kwargs
    ):
        super().__init__(*args, **kwargs)
        self.student_id = student_id
        self.student_ids = student_ids or []
        self.assessment_config = assessment_config or {}
        self.force_recalculation = force_recalculation
    
    def execute(self, context):
        """Execute EPR calculation"""
        try:
            # Import EPR algorithms
            from epr_system.algorithms import EPRScoringAlgorithms
            
            # Determine student IDs to process
            student_ids = []
            if self.student_id:
                student_ids.append(self.student_id)
            if self.student_ids:
                student_ids.extend(self.student_ids)
            
            if not student_ids:
                # Process all students if none specified
                student_ids = list(Student.objects.values_list('id', flat=True))
            
            results = []
            
            for student_id in student_ids:
                try:
                    student = Student.objects.get(id=student_id)
                    
                    # Get latest assessment data
                    latest_assessments = self._get_student_assessments(student)
                    
                    if not latest_assessments and not self.force_recalculation:
                        logger.info(f"No assessments found for student {student_id}, skipping")
                        continue
                    
                    # Calculate EPR scores
                    epr_result = self._calculate_epr_score(student, latest_assessments)
                    
                    # Store results
                    self._store_epr_results(student, epr_result)
                    
                    results.append({
                        'student_id': student_id,
                        'epr_score': epr_result.get('overall_score'),
                        'performance_band': epr_result.get('performance_band'),
                        'calculated_at': datetime.now().isoformat()
                    })
                    
                    logger.info(f"EPR calculated for student {student_id}: {epr_result.get('overall_score')}")
                    
                except Student.DoesNotExist:
                    logger.error(f"Student {student_id} not found")
                    continue
                except Exception as e:
                    logger.error(f"EPR calculation failed for student {student_id}: {str(e)}")
                    continue
            
            # Return results for downstream tasks
            return {
                'processed_students': len(results),
                'results': results,
                'execution_time': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"EPR calculation operator failed: {str(e)}")
            raise AirflowException(f"EPR calculation failed: {str(e)}")
    
    def _get_student_assessments(self, student):
        """Get latest assessments for a student"""
        assessments = {}
        
        # Get academic assessments
        if hasattr(student, 'academic_assessments'):
            latest_academic = student.academic_assessments.order_by('-assessment_date').first()
            if latest_academic:
                assessments['academic'] = latest_academic
        
        # Get psychological assessments
        if hasattr(student, 'psychological_assessments'):
            latest_psychological = student.psychological_assessments.order_by('-assessment_date').first()
            if latest_psychological:
                assessments['psychological'] = latest_psychological
        
        # Get physical assessments
        if hasattr(student, 'physical_assessments'):
            latest_physical = student.physical_assessments.order_by('-assessment_date').first()
            if latest_physical:
                assessments['physical'] = latest_physical
        
        return assessments
    
    def _calculate_epr_score(self, student, assessments):
        """Calculate EPR score using algorithms"""
        from epr_system.algorithms import EPRScoringAlgorithms
        
        # Extract scores from assessments
        academic_score = None
        psychological_score = None
        physical_score = None
        
        if 'academic' in assessments:
            academic_score = float(assessments['academic'].composite_academic_score or 0)
        
        if 'psychological' in assessments:
            psychological_score = float(assessments['psychological'].composite_psychological_score or 0)
        
        if 'physical' in assessments:
            physical_score = float(assessments['physical'].composite_physical_score or 0)
        
        # Calculate weighted overall score (default weights: Academic 40%, Psychological 30%, Physical 30%)
        weights = self.assessment_config.get('weights', {
            'academic': 0.4,
            'psychological': 0.3,
            'physical': 0.3
        })
        
        total_weight = 0
        weighted_sum = 0
        
        if academic_score is not None:
            weighted_sum += academic_score * weights['academic']
            total_weight += weights['academic']
        
        if psychological_score is not None:
            weighted_sum += psychological_score * weights['psychological']
            total_weight += weights['psychological']
        
        if physical_score is not None:
            weighted_sum += physical_score * weights['physical']
            total_weight += weights['physical']
        
        overall_score = (weighted_sum / total_weight) if total_weight > 0 else 0
        
        # Determine performance band
        if overall_score >= 85:
            performance_band = 'thriving'
        elif overall_score >= 70:
            performance_band = 'healthy_progress'
        elif overall_score >= 50:
            performance_band = 'needs_support'
        else:
            performance_band = 'at_risk'
        
        return {
            'overall_score': overall_score,
            'academic_score': academic_score,
            'psychological_score': psychological_score,
            'physical_score': physical_score,
            'performance_band': performance_band,
            'weights_used': weights
        }
    
    def _store_epr_results(self, student, epr_result):
        """Store EPR results in the database"""
        # This would store results in your EPR models
        # For now, we'll log the results
        logger.info(f"Storing EPR results for {student.id}: {epr_result}")

class StudentAssessmentOperator(BaseOperator):
    """
    Operator to trigger or process student assessments
    """
    
    template_fields = ['student_id', 'assessment_type', 'assessment_data']
    
    @apply_defaults
    def __init__(
        self,
        student_id: str,
        assessment_type: str,
        assessment_data: Dict[str, Any],
        auto_calculate_epr: bool = True,
        *args,
        **kwargs
    ):
        super().__init__(*args, **kwargs)
        self.student_id = student_id
        self.assessment_type = assessment_type
        self.assessment_data = assessment_data
        self.auto_calculate_epr = auto_calculate_epr
    
    def execute(self, context):
        """Execute assessment processing"""
        try:
            student = Student.objects.get(id=self.student_id)
            
            # Create assessment record
            assessment = Assessment.objects.create(
                student=student,
                assessment_type=self.assessment_type,
                assessment_data=self.assessment_data,
                status='completed',
                created_at=datetime.now()
            )
            
            # Create assessment result
            result_data = self._process_assessment_data(self.assessment_data, self.assessment_type)
            
            AssessmentResult.objects.create(
                assessment=assessment,
                result_data=result_data,
                score=result_data.get('total_score', 0),
                created_at=datetime.now()
            )
            
            logger.info(f"Assessment {assessment.id} processed for student {self.student_id}")
            
            # Trigger EPR calculation if enabled
            if self.auto_calculate_epr:
                context['ti'].xcom_push(key='trigger_epr_calculation', value=True)
                context['ti'].xcom_push(key='student_id', value=self.student_id)
            
            return {
                'assessment_id': assessment.id,
                'student_id': self.student_id,
                'assessment_type': self.assessment_type,
                'score': result_data.get('total_score', 0)
            }
            
        except Exception as e:
            logger.error(f"Assessment processing failed: {str(e)}")
            raise AirflowException(f"Assessment processing failed: {str(e)}")
    
    def _process_assessment_data(self, data, assessment_type):
        """Process assessment data based on type"""
        # Simple scoring logic - can be enhanced based on your needs
        if assessment_type == 'academic':
            return self._process_academic_assessment(data)
        elif assessment_type == 'psychological':
            return self._process_psychological_assessment(data)
        elif assessment_type == 'physical':
            return self._process_physical_assessment(data)
        else:
            return {'total_score': 0, 'processed_data': data}
    
    def _process_academic_assessment(self, data):
        """Process academic assessment data"""
        # Calculate academic score based on various metrics
        scores = []
        if 'test_scores' in data:
            scores.extend(data['test_scores'])
        if 'gpa' in data:
            scores.append(data['gpa'] * 20)  # Convert GPA to 0-100 scale
        if 'attendance' in data:
            scores.append(data['attendance'])
        
        total_score = sum(scores) / len(scores) if scores else 0
        
        return {
            'total_score': total_score,
            'component_scores': scores,
            'assessment_type': 'academic'
        }
    
    def _process_psychological_assessment(self, data):
        """Process psychological assessment data"""
        # Process psychological metrics
        total_score = data.get('overall_wellbeing_score', 0)
        
        return {
            'total_score': total_score,
            'wellbeing_indicators': data.get('indicators', {}),
            'assessment_type': 'psychological'
        }
    
    def _process_physical_assessment(self, data):
        """Process physical health assessment data"""
        # Process physical health metrics
        total_score = data.get('overall_health_score', 0)
        
        return {
            'total_score': total_score,
            'health_metrics': data.get('metrics', {}),
            'assessment_type': 'physical'
        }

class LeadProcessingOperator(BaseOperator):
    """
    Operator to process leads and form submissions
    """
    
    template_fields = ['lead_source', 'processing_config']
    
    @apply_defaults
    def __init__(
        self,
        lead_source: Optional[str] = None,
        processing_config: Optional[Dict[str, Any]] = None,
        batch_size: int = 100,
        *args,
        **kwargs
    ):
        super().__init__(*args, **kwargs)
        self.lead_source = lead_source
        self.processing_config = processing_config or {}
        self.batch_size = batch_size
    
    def execute(self, context):
        """Execute lead processing"""
        try:
            # Get unprocessed leads
            leads_query = Lead.objects.filter(status='new')
            
            if self.lead_source:
                leads_query = leads_query.filter(source=self.lead_source)
            
            leads = leads_query[:self.batch_size]
            
            processed_count = 0
            results = []
            
            for lead in leads:
                try:
                    # Process individual lead
                    result = self._process_lead(lead)
                    results.append(result)
                    processed_count += 1
                    
                    logger.info(f"Processed lead {lead.id}: {result['status']}")
                    
                except Exception as e:
                    logger.error(f"Failed to process lead {lead.id}: {str(e)}")
                    continue
            
            return {
                'processed_leads': processed_count,
                'total_leads': leads.count(),
                'results': results
            }
            
        except Exception as e:
            logger.error(f"Lead processing operator failed: {str(e)}")
            raise AirflowException(f"Lead processing failed: {str(e)}")
    
    def _process_lead(self, lead):
        """Process individual lead"""
        # Lead scoring logic
        score = self._calculate_lead_score(lead)
        
        # Update lead status based on score
        if score >= 80:
            lead.status = 'hot'
            lead.priority = 'high'
        elif score >= 60:
            lead.status = 'warm'
            lead.priority = 'medium'
        else:
            lead.status = 'cold'
            lead.priority = 'low'
        
        lead.score = score
        lead.processed_at = datetime.now()
        lead.save()
        
        return {
            'lead_id': lead.id,
            'score': score,
            'status': lead.status,
            'priority': lead.priority
        }
    
    def _calculate_lead_score(self, lead):
        """Calculate lead score based on various factors"""
        score = 0
        
        # Score based on lead source
        source_scores = {
            'website': 70,
            'referral': 90,
            'social_media': 50,
            'advertisement': 60,
            'direct': 80
        }
        score += source_scores.get(lead.source, 50)
        
        # Score based on engagement
        if hasattr(lead, 'form_submissions'):
            submission_count = lead.form_submissions.count()
            score += min(submission_count * 10, 30)  # Max 30 points for submissions
        
        # Score based on lead data completeness
        data = lead.lead_data or {}
        required_fields = ['name', 'email', 'phone']
        complete_fields = sum(1 for field in required_fields if data.get(field))
        score += (complete_fields / len(required_fields)) * 20  # Max 20 points for completeness
        
        return min(score, 100)  # Cap at 100

class NotificationOperator(BaseOperator):
    """
    Operator to send notifications to users
    """
    
    template_fields = ['recipient_id', 'message_template', 'notification_data']
    
    @apply_defaults
    def __init__(
        self,
        recipient_id: Optional[str] = None,
        recipient_email: Optional[str] = None,
        notification_type: str = 'email',
        message_template: str = '',
        subject_template: str = '',
        notification_data: Optional[Dict[str, Any]] = None,
        *args,
        **kwargs
    ):
        super().__init__(*args, **kwargs)
        self.recipient_id = recipient_id
        self.recipient_email = recipient_email
        self.notification_type = notification_type
        self.message_template = message_template
        self.subject_template = subject_template
        self.notification_data = notification_data or {}
    
    def execute(self, context):
        """Execute notification sending"""
        try:
            # Get recipient
            if self.recipient_id:
                recipient = User.objects.get(id=self.recipient_id)
                recipient_email = recipient.email
            else:
                recipient_email = self.recipient_email
            
            if not recipient_email:
                raise AirflowException("No recipient email specified")
            
            # Render message content
            message = self._render_template(self.message_template, self.notification_data)
            subject = self._render_template(self.subject_template, self.notification_data)
            
            # Send notification based on type
            if self.notification_type == 'email':
                return self._send_email(recipient_email, subject, message)
            elif self.notification_type == 'sms':
                return self._send_sms(recipient_email, message)  # Assuming phone number in email field for SMS
            else:
                raise AirflowException(f"Unsupported notification type: {self.notification_type}")
            
        except Exception as e:
            logger.error(f"Notification sending failed: {str(e)}")
            raise AirflowException(f"Notification failed: {str(e)}")
    
    def _render_template(self, template, data):
        """Render template with data"""
        try:
            # Simple template rendering - can be enhanced with Jinja2
            rendered = template
            for key, value in data.items():
                rendered = rendered.replace(f"{{{{{key}}}}}", str(value))
            return rendered
        except Exception as e:
            logger.error(f"Template rendering failed: {str(e)}")
            return template
    
    def _send_email(self, recipient_email, subject, message):
        """Send email notification"""
        from django.core.mail import send_mail
        
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email='noreply@edusight.com',
                recipient_list=[recipient_email],
                fail_silently=False
            )
            
            return {
                'notification_type': 'email',
                'recipient': recipient_email,
                'status': 'sent',
                'sent_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Email sending failed: {str(e)}")
            raise
    
    def _send_sms(self, phone_number, message):
        """Send SMS notification (placeholder)"""
        # Placeholder for SMS integration
        logger.info(f"SMS to {phone_number}: {message}")
        
        return {
            'notification_type': 'sms',
            'recipient': phone_number,
            'status': 'sent',
            'sent_at': datetime.now().isoformat()
        }

class DataBackupOperator(BaseOperator):
    """
    Operator to backup EduSight data
    """
    
    @apply_defaults
    def __init__(
        self,
        backup_type: str = 'full',
        backup_location: Optional[str] = None,
        retention_days: int = 30,
        *args,
        **kwargs
    ):
        super().__init__(*args, **kwargs)
        self.backup_type = backup_type
        self.backup_location = backup_location or os.path.join(project_path, 'backups')
        self.retention_days = retention_days
    
    def execute(self, context):
        """Execute data backup"""
        try:
            import shutil
            import zipfile
            from pathlib import Path
            
            # Create backup directory
            backup_dir = Path(self.backup_location)
            backup_dir.mkdir(parents=True, exist_ok=True)
            
            # Generate backup filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            backup_filename = f"edusight_backup_{self.backup_type}_{timestamp}.zip"
            backup_path = backup_dir / backup_filename
            
            # Create backup
            with zipfile.ZipFile(backup_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # Backup database
                db_path = Path(project_path) / 'db.sqlite3'
                if db_path.exists():
                    zipf.write(db_path, 'db.sqlite3')
                
                # Backup media files
                media_dir = Path(project_path) / 'media'
                if media_dir.exists():
                    for file_path in media_dir.rglob('*'):
                        if file_path.is_file():
                            arcname = f"media/{file_path.relative_to(media_dir)}"
                            zipf.write(file_path, arcname)
                
                # Backup configuration files
                config_files = ['requirements.txt', 'requirements_airflow.txt']
                for config_file in config_files:
                    config_path = Path(project_path) / config_file
                    if config_path.exists():
                        zipf.write(config_path, config_file)
            
            # Clean up old backups
            self._cleanup_old_backups(backup_dir)
            
            logger.info(f"Backup created: {backup_path}")
            
            return {
                'backup_type': self.backup_type,
                'backup_file': str(backup_path),
                'backup_size': backup_path.stat().st_size,
                'created_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Backup operation failed: {str(e)}")
            raise AirflowException(f"Backup failed: {str(e)}")
    
    def _cleanup_old_backups(self, backup_dir):
        """Clean up old backup files"""
        try:
            cutoff_date = datetime.now() - timedelta(days=self.retention_days)
            
            for backup_file in backup_dir.glob('edusight_backup_*.zip'):
                if backup_file.stat().st_mtime < cutoff_date.timestamp():
                    backup_file.unlink()
                    logger.info(f"Deleted old backup: {backup_file}")
                    
        except Exception as e:
            logger.error(f"Backup cleanup failed: {str(e)}")


# Additional utility operators can be added here
class SystemHealthCheckOperator(BaseOperator):
    """
    Operator to perform system health checks
    """
    
    @apply_defaults
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def execute(self, context):
        """Execute system health check"""
        try:
            health_status = {
                'database': self._check_database(),
                'disk_space': self._check_disk_space(),
                'memory': self._check_memory(),
                'active_users': self._check_active_users(),
                'system_load': self._check_system_load()
            }
            
            # Determine overall health
            overall_health = 'healthy' if all(
                status.get('status') == 'ok' for status in health_status.values()
            ) else 'degraded'
            
            health_status['overall_status'] = overall_health
            health_status['checked_at'] = datetime.now().isoformat()
            
            logger.info(f"System health check completed: {overall_health}")
            
            return health_status
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            raise AirflowException(f"Health check failed: {str(e)}")
    
    def _check_database(self):
        """Check database connectivity and performance"""
        try:
            from django.db import connection
            
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
            
            return {'status': 'ok', 'response_time': 'fast'}
            
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_disk_space(self):
        """Check available disk space"""
        try:
            import shutil
            
            total, used, free = shutil.disk_usage(project_path)
            free_percentage = (free / total) * 100
            
            if free_percentage > 20:
                status = 'ok'
            elif free_percentage > 10:
                status = 'warning'
            else:
                status = 'critical'
            
            return {
                'status': status,
                'free_space_gb': round(free / (1024**3), 2),
                'free_percentage': round(free_percentage, 2)
            }
            
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_memory(self):
        """Check memory usage"""
        try:
            import psutil
            
            memory = psutil.virtual_memory()
            
            if memory.percent < 80:
                status = 'ok'
            elif memory.percent < 90:
                status = 'warning'
            else:
                status = 'critical'
            
            return {
                'status': status,
                'used_percentage': memory.percent,
                'available_gb': round(memory.available / (1024**3), 2)
            }
            
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_active_users(self):
        """Check active user count"""
        try:
            # Count users active in last 24 hours
            from django.utils import timezone
            
            yesterday = timezone.now() - timedelta(days=1)
            active_count = User.objects.filter(last_login__gte=yesterday).count()
            
            return {
                'status': 'ok',
                'active_users_24h': active_count
            }
            
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
    
    def _check_system_load(self):
        """Check system load"""
        try:
            import psutil
            
            cpu_percent = psutil.cpu_percent(interval=1)
            
            if cpu_percent < 70:
                status = 'ok'
            elif cpu_percent < 85:
                status = 'warning'
            else:
                status = 'critical'
            
            return {
                'status': status,
                'cpu_percentage': cpu_percent
            }
            
        except Exception as e:
            return {'status': 'error', 'error': str(e)}
