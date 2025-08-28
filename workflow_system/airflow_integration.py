"""
Airflow integration module for EduSight
Provides interface between Django and Apache Airflow
"""

import os
import json
import requests
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class AirflowManager:
    """
    Manager class for interacting with Apache Airflow
    """
    
    def __init__(self):
        self.airflow_base_url = getattr(settings, 'AIRFLOW_BASE_URL', 'http://localhost:8080')
        self.airflow_home = getattr(settings, 'AIRFLOW_HOME', os.path.join(settings.BASE_DIR, 'airflow_home'))
        self.dags_folder = os.path.join(self.airflow_home, 'dags')
        
        # Airflow API credentials (if authentication is enabled)
        self.airflow_username = getattr(settings, 'AIRFLOW_USERNAME', '')
        self.airflow_password = getattr(settings, 'AIRFLOW_PASSWORD', '')
    
    def get_auth_headers(self):
        """Get authentication headers for Airflow API"""
        if self.airflow_username and self.airflow_password:
            import base64
            credentials = base64.b64encode(f"{self.airflow_username}:{self.airflow_password}".encode()).decode()
            return {'Authorization': f'Basic {credentials}'}
        return {}
    
    def get_dag_list(self) -> List[Dict[str, Any]]:
        """Get list of all DAGs from Airflow"""
        try:
            response = requests.get(
                f"{self.airflow_base_url}/api/v1/dags",
                headers=self.get_auth_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('dags', [])
            else:
                logger.error(f"Failed to get DAG list: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting DAG list: {str(e)}")
            return []
    
    def get_dag_details(self, dag_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific DAG"""
        try:
            response = requests.get(
                f"{self.airflow_base_url}/api/v1/dags/{dag_id}",
                headers=self.get_auth_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get DAG details for {dag_id}: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting DAG details for {dag_id}: {str(e)}")
            return None
    
    def trigger_dag(self, dag_id: str, config: Optional[Dict[str, Any]] = None) -> bool:
        """Trigger a DAG run"""
        try:
            payload = {}
            if config:
                payload['conf'] = config
            
            response = requests.post(
                f"{self.airflow_base_url}/api/v1/dags/{dag_id}/dagRuns",
                headers={**self.get_auth_headers(), 'Content-Type': 'application/json'},
                json=payload,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"Successfully triggered DAG: {dag_id}")
                return True
            else:
                logger.error(f"Failed to trigger DAG {dag_id}: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error triggering DAG {dag_id}: {str(e)}")
            return False
    
    def get_dag_runs(self, dag_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent DAG runs for a specific DAG"""
        try:
            response = requests.get(
                f"{self.airflow_base_url}/api/v1/dags/{dag_id}/dagRuns",
                headers=self.get_auth_headers(),
                params={'limit': limit, 'order_by': '-start_date'},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('dag_runs', [])
            else:
                logger.error(f"Failed to get DAG runs for {dag_id}: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting DAG runs for {dag_id}: {str(e)}")
            return []
    
    def get_task_instances(self, dag_id: str, dag_run_id: str) -> List[Dict[str, Any]]:
        """Get task instances for a specific DAG run"""
        try:
            response = requests.get(
                f"{self.airflow_base_url}/api/v1/dags/{dag_id}/dagRuns/{dag_run_id}/taskInstances",
                headers=self.get_auth_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                return data.get('task_instances', [])
            else:
                logger.error(f"Failed to get task instances: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error getting task instances: {str(e)}")
            return []
    
    def pause_dag(self, dag_id: str) -> bool:
        """Pause a DAG"""
        try:
            response = requests.patch(
                f"{self.airflow_base_url}/api/v1/dags/{dag_id}",
                headers={**self.get_auth_headers(), 'Content-Type': 'application/json'},
                json={'is_paused': True},
                timeout=30
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Error pausing DAG {dag_id}: {str(e)}")
            return False
    
    def unpause_dag(self, dag_id: str) -> bool:
        """Unpause a DAG"""
        try:
            response = requests.patch(
                f"{self.airflow_base_url}/api/v1/dags/{dag_id}",
                headers={**self.get_auth_headers(), 'Content-Type': 'application/json'},
                json={'is_paused': False},
                timeout=30
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"Error unpausing DAG {dag_id}: {str(e)}")
            return False
    
    def create_custom_dag(self, dag_config: Dict[str, Any]) -> bool:
        """Create a custom DAG based on configuration"""
        try:
            dag_id = dag_config.get('dag_id')
            if not dag_id:
                raise ValueError("DAG ID is required")
            
            # Generate DAG file content
            dag_content = self._generate_dag_content(dag_config)
            
            # Write DAG file
            dag_file_path = os.path.join(self.dags_folder, f"{dag_id}.py")
            with open(dag_file_path, 'w') as f:
                f.write(dag_content)
            
            logger.info(f"Created custom DAG: {dag_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error creating custom DAG: {str(e)}")
            return False
    
    def _generate_dag_content(self, config: Dict[str, Any]) -> str:
        """Generate DAG file content based on configuration"""
        
        dag_id = config['dag_id']
        description = config.get('description', 'Custom EduSight workflow')
        schedule_interval = config.get('schedule_interval', '@daily')
        tasks = config.get('tasks', [])
        
        # Start building DAG content
        dag_content = f'''"""
{description}
Generated automatically by EduSight Workflow Manager
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.dummy import DummyOperator
from airflow.utils.dates import days_ago

# Import custom operators
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'plugins'))
from edusight_operators import *

# Default arguments
default_args = {{
    'owner': 'edusight-admin',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    'email': ['admin@edusight.com']
}}

# Create DAG
dag = DAG(
    '{dag_id}',
    default_args=default_args,
    description='{description}',
    schedule_interval='{schedule_interval}',
    max_active_runs=1,
    catchup=False,
    tags=['custom', 'edusight']
)

'''
        
        # Add tasks
        task_objects = []
        for i, task_config in enumerate(tasks):
            task_id = task_config.get('task_id', f'task_{i+1}')
            task_type = task_config.get('task_type', 'dummy')
            
            if task_type == 'epr_calculation':
                dag_content += self._generate_epr_task(task_id, task_config)
            elif task_type == 'notification':
                dag_content += self._generate_notification_task(task_id, task_config)
            elif task_type == 'lead_processing':
                dag_content += self._generate_lead_processing_task(task_id, task_config)
            elif task_type == 'backup':
                dag_content += self._generate_backup_task(task_id, task_config)
            else:
                dag_content += self._generate_dummy_task(task_id, task_config)
            
            task_objects.append(task_id)
        
        # Add task dependencies
        if len(task_objects) > 1:
            dag_content += '\n# Task dependencies\n'
            for i in range(len(task_objects) - 1):
                dag_content += f'{task_objects[i]} >> {task_objects[i+1]}\n'
        
        return dag_content
    
    def _generate_epr_task(self, task_id: str, config: Dict[str, Any]) -> str:
        return f'''
# EPR Calculation Task
{task_id} = EPRCalculationOperator(
    task_id='{task_id}',
    assessment_config={config.get('assessment_config', {})},
    force_recalculation={config.get('force_recalculation', False)},
    dag=dag
)

'''
    
    def _generate_notification_task(self, task_id: str, config: Dict[str, Any]) -> str:
        return f'''
# Notification Task
{task_id} = NotificationOperator(
    task_id='{task_id}',
    recipient_email='{config.get('recipient_email', 'admin@edusight.com')}',
    notification_type='{config.get('notification_type', 'email')}',
    subject_template='{config.get('subject_template', 'EduSight Notification')}',
    message_template='{config.get('message_template', 'This is an automated notification.')}',
    dag=dag
)

'''
    
    def _generate_lead_processing_task(self, task_id: str, config: Dict[str, Any]) -> str:
        return f'''
# Lead Processing Task
{task_id} = LeadProcessingOperator(
    task_id='{task_id}',
    batch_size={config.get('batch_size', 50)},
    processing_config={config.get('processing_config', {})},
    dag=dag
)

'''
    
    def _generate_backup_task(self, task_id: str, config: Dict[str, Any]) -> str:
        return f'''
# Backup Task
{task_id} = DataBackupOperator(
    task_id='{task_id}',
    backup_type='{config.get('backup_type', 'full')}',
    retention_days={config.get('retention_days', 30)},
    dag=dag
)

'''
    
    def _generate_dummy_task(self, task_id: str, config: Dict[str, Any]) -> str:
        return f'''
# Dummy Task
{task_id} = DummyOperator(
    task_id='{task_id}',
    dag=dag
)

'''
    
    def start_airflow_scheduler(self) -> bool:
        """Start Airflow scheduler"""
        try:
            # Set environment variable for Airflow home
            env = os.environ.copy()
            env['AIRFLOW_HOME'] = self.airflow_home
            
            # Start scheduler
            subprocess.Popen(
                ['airflow', 'scheduler'],
                env=env,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            
            logger.info("Airflow scheduler started")
            return True
            
        except Exception as e:
            logger.error(f"Error starting Airflow scheduler: {str(e)}")
            return False
    
    def start_airflow_webserver(self) -> bool:
        """Start Airflow webserver"""
        try:
            # Set environment variable for Airflow home
            env = os.environ.copy()
            env['AIRFLOW_HOME'] = self.airflow_home
            
            # Start webserver
            subprocess.Popen(
                ['airflow', 'webserver', '-p', '8080'],
                env=env,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            
            logger.info("Airflow webserver started on port 8080")
            return True
            
        except Exception as e:
            logger.error(f"Error starting Airflow webserver: {str(e)}")
            return False
    
    def initialize_airflow_db(self) -> bool:
        """Initialize Airflow database"""
        try:
            # Set environment variable for Airflow home
            env = os.environ.copy()
            env['AIRFLOW_HOME'] = self.airflow_home
            
            # Initialize database
            result = subprocess.run(
                ['airflow', 'db', 'init'],
                env=env,
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                logger.info("Airflow database initialized successfully")
                return True
            else:
                logger.error(f"Airflow database initialization failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing Airflow database: {str(e)}")
            return False
    
    def create_airflow_user(self, username: str, email: str, password: str, firstname: str, lastname: str) -> bool:
        """Create Airflow admin user"""
        try:
            # Set environment variable for Airflow home
            env = os.environ.copy()
            env['AIRFLOW_HOME'] = self.airflow_home
            
            # Create user
            result = subprocess.run([
                'airflow', 'users', 'create',
                '--username', username,
                '--email', email,
                '--password', password,
                '--firstname', firstname,
                '--lastname', lastname,
                '--role', 'Admin'
            ], env=env, capture_output=True, text=True)
            
            if result.returncode == 0:
                logger.info(f"Airflow user {username} created successfully")
                return True
            else:
                logger.error(f"Airflow user creation failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Error creating Airflow user: {str(e)}")
            return False


class TriggerSystemManager:
    """
    Manager for trigger-based workflow execution
    """
    
    def __init__(self):
        self.airflow_manager = AirflowManager()
    
    def create_event_trigger(self, event_type: str, conditions: List[Dict[str, Any]], 
                           workflow_config: Dict[str, Any]) -> bool:
        """Create an event-based trigger"""
        try:
            # Create a sensor DAG that monitors for the event
            sensor_dag_config = {
                'dag_id': f'trigger_{event_type}_{datetime.now().strftime("%Y%m%d_%H%M%S")}',
                'description': f'Event trigger for {event_type}',
                'schedule_interval': '@once',  # Run once when triggered
                'tasks': [
                    {
                        'task_id': 'event_sensor',
                        'task_type': 'sensor',
                        'config': {
                            'event_type': event_type,
                            'conditions': conditions
                        }
                    },
                    {
                        'task_id': 'execute_workflow',
                        'task_type': 'workflow_execution',
                        'config': workflow_config
                    }
                ]
            }
            
            return self.airflow_manager.create_custom_dag(sensor_dag_config)
            
        except Exception as e:
            logger.error(f"Error creating event trigger: {str(e)}")
            return False
    
    def trigger_workflow_on_model_change(self, model_name: str, operation: str, workflow_id: str):
        """Trigger workflow when a Django model changes"""
        # This would be called from Django signals
        try:
            self.airflow_manager.trigger_dag(
                workflow_id,
                config={
                    'model_name': model_name,
                    'operation': operation,
                    'timestamp': datetime.now().isoformat()
                }
            )
            return True
            
        except Exception as e:
            logger.error(f"Error triggering workflow on model change: {str(e)}")
            return False
    
    def schedule_recurring_workflow(self, workflow_id: str, cron_expression: str, config: Dict[str, Any] = None):
        """Schedule a workflow to run on a cron schedule"""
        try:
            # Update DAG schedule interval
            # This would require modifying the DAG file or creating a new scheduled version
            return self.airflow_manager.trigger_dag(workflow_id, config)
            
        except Exception as e:
            logger.error(f"Error scheduling recurring workflow: {str(e)}")
            return False
