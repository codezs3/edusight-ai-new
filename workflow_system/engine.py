"""
Workflow execution engine for the EduSight platform
Handles workflow execution, step processing, and trigger evaluation
"""

import json
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.contrib.auth import get_user_model
from django.apps import apps

from .models import (
    WorkflowTemplate, WorkflowExecution, WorkflowStepExecution, 
    WorkflowVariable, WorkflowTrigger, WorkflowAuditLog
)

User = get_user_model()
logger = logging.getLogger(__name__)

class WorkflowEngine:
    """Main workflow execution engine"""
    
    def __init__(self):
        self.step_processors = {
            'send_email': self._process_send_email,
            'send_sms': self._process_send_sms,
            'create_notification': self._process_create_notification,
            'update_record': self._process_update_record,
            'create_assessment': self._process_create_assessment,
            'run_epr_calculation': self._process_run_epr_calculation,
            'create_alert': self._process_create_alert,
            'assign_task': self._process_assign_task,
            'wait_for_approval': self._process_wait_for_approval,
            'conditional_branch': self._process_conditional_branch,
            'loop': self._process_loop,
            'http_request': self._process_http_request,
            'custom_function': self._process_custom_function,
        }
    
    def execute_workflow(self, workflow_template: WorkflowTemplate, 
                        context: Dict[str, Any] = None, 
                        trigger: WorkflowTrigger = None,
                        started_by: User = None) -> WorkflowExecution:
        """Execute a workflow template"""
        
        if context is None:
            context = {}
        
        # Create execution record
        execution = WorkflowExecution.objects.create(
            workflow_template=workflow_template,
            trigger=trigger,
            started_by=started_by,
            input_context=context,
            status='pending'
        )
        
        # Log execution start
        WorkflowAuditLog.objects.create(
            action_type='execution_started',
            user=started_by,
            workflow_template=workflow_template,
            workflow_execution=execution,
            description=f"Workflow execution started: {workflow_template.name}",
            metadata={'trigger_id': str(trigger.id) if trigger else None}
        )
        
        try:
            # Start execution
            execution.status = 'running'
            execution.started_at = timezone.now()
            execution.save()
            
            # Process workflow steps
            result = self._execute_workflow_steps(execution, context)
            
            # Update execution status
            execution.status = 'completed' if result['success'] else 'failed'
            execution.completed_at = timezone.now()
            execution.output_context = result.get('output_context', {})
            execution.error_message = result.get('error_message', '')
            execution.save()
            
            # Log completion
            WorkflowAuditLog.objects.create(
                action_type='execution_completed' if result['success'] else 'execution_failed',
                user=started_by,
                workflow_template=workflow_template,
                workflow_execution=execution,
                description=f"Workflow execution {'completed' if result['success'] else 'failed'}: {workflow_template.name}",
                metadata={'duration_seconds': execution.get_duration().total_seconds() if execution.get_duration() else 0}
            )
            
        except Exception as e:
            logger.error(f"Workflow execution failed: {str(e)}")
            execution.status = 'failed'
            execution.completed_at = timezone.now()
            execution.error_message = str(e)
            execution.save()
            
            # Log failure
            WorkflowAuditLog.objects.create(
                action_type='execution_failed',
                user=started_by,
                workflow_template=workflow_template,
                workflow_execution=execution,
                description=f"Workflow execution failed: {workflow_template.name}",
                metadata={'error': str(e)}
            )
        
        return execution
    
    def _execute_workflow_steps(self, execution: WorkflowExecution, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute workflow steps sequentially"""
        
        steps = execution.workflow_template.workflow_config.get('steps', [])
        if not steps:
            return {'success': False, 'error_message': 'No steps defined in workflow'}
        
        current_context = context.copy()
        
        for i, step_config in enumerate(steps):
            try:
                # Create step execution record
                step_execution = WorkflowStepExecution.objects.create(
                    workflow_execution=execution,
                    workflow_step=None,  # We're using config-based steps
                    status='running',
                    input_data=current_context,
                    started_at=timezone.now()
                )
                
                # Process step
                step_result = self._process_step(step_config, current_context, execution)
                
                # Update step execution
                step_execution.status = 'completed' if step_result['success'] else 'failed'
                step_execution.output_data = step_result.get('output_data', {})
                step_execution.error_message = step_result.get('error_message', '')
                step_execution.completed_at = timezone.now()
                step_execution.save()
                
                if not step_result['success']:
                    return {
                        'success': False,
                        'error_message': f"Step {i+1} failed: {step_result.get('error_message', 'Unknown error')}",
                        'output_context': current_context
                    }
                
                # Update context with step output
                if 'output_data' in step_result:
                    current_context.update(step_result['output_data'])
                
                # Update execution progress
                execution.completed_steps.append(i)
                execution.save()
                
                # Check for conditional branching or early termination
                if step_result.get('terminate_workflow'):
                    break
                
            except Exception as e:
                logger.error(f"Step {i+1} execution failed: {str(e)}")
                return {
                    'success': False,
                    'error_message': f"Step {i+1} execution failed: {str(e)}",
                    'output_context': current_context
                }
        
        return {
            'success': True,
            'output_context': current_context
        }
    
    def _process_step(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                     execution: WorkflowExecution) -> Dict[str, Any]:
        """Process an individual workflow step"""
        
        action_type = step_config.get('action_type')
        if action_type not in self.step_processors:
            return {
                'success': False,
                'error_message': f"Unknown action type: {action_type}"
            }
        
        # Add delay if specified
        delay = step_config.get('delay_seconds', 0)
        if delay > 0:
            time.sleep(delay)
        
        # Execute step processor
        processor = self.step_processors[action_type]
        return processor(step_config, context, execution)
    
    def _process_send_email(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                           execution: WorkflowExecution) -> Dict[str, Any]:
        """Process send email step"""
        try:
            config = step_config.get('configuration', {})
            
            # Extract email parameters
            to_email = self._resolve_value(config.get('to_email', ''), context)
            subject = self._resolve_value(config.get('subject', ''), context)
            message = self._resolve_value(config.get('message', ''), context)
            from_email = config.get('from_email', settings.DEFAULT_FROM_EMAIL)
            
            if not all([to_email, subject, message]):
                return {
                    'success': False,
                    'error_message': 'Missing required email parameters (to_email, subject, message)'
                }
            
            # Send email
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=[to_email],
                fail_silently=False
            )
            
            return {
                'success': True,
                'output_data': {
                    'email_sent': True,
                    'email_to': to_email,
                    'email_subject': subject
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error_message': f"Email sending failed: {str(e)}"
            }
    
    def _process_send_sms(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                         execution: WorkflowExecution) -> Dict[str, Any]:
        """Process send SMS step"""
        # Placeholder for SMS integration
        return {
            'success': True,
            'output_data': {'sms_sent': True, 'message': 'SMS functionality not implemented yet'}
        }
    
    def _process_create_notification(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                                   execution: WorkflowExecution) -> Dict[str, Any]:
        """Process create notification step"""
        try:
            config = step_config.get('configuration', {})
            
            # Get notification parameters
            user_id = self._resolve_value(config.get('user_id', ''), context)
            title = self._resolve_value(config.get('title', ''), context)
            message = self._resolve_value(config.get('message', ''), context)
            notification_type = config.get('type', 'info')
            
            # Create notification (assuming you have a notification system)
            # This would integrate with your existing notification system
            
            return {
                'success': True,
                'output_data': {
                    'notification_created': True,
                    'notification_title': title,
                    'notification_user_id': user_id
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error_message': f"Notification creation failed: {str(e)}"
            }
    
    def _process_update_record(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                              execution: WorkflowExecution) -> Dict[str, Any]:
        """Process update record step"""
        try:
            config = step_config.get('configuration', {})
            
            model_name = config.get('model_name')
            record_id = self._resolve_value(config.get('record_id', ''), context)
            update_fields = config.get('update_fields', {})
            
            if not all([model_name, record_id, update_fields]):
                return {
                    'success': False,
                    'error_message': 'Missing required parameters (model_name, record_id, update_fields)'
                }
            
            # Get model class
            try:
                model_class = apps.get_model(model_name)
            except LookupError:
                return {
                    'success': False,
                    'error_message': f"Model not found: {model_name}"
                }
            
            # Update record
            record = model_class.objects.get(pk=record_id)
            for field, value in update_fields.items():
                resolved_value = self._resolve_value(value, context)
                setattr(record, field, resolved_value)
            record.save()
            
            return {
                'success': True,
                'output_data': {
                    'record_updated': True,
                    'model': model_name,
                    'record_id': record_id,
                    'updated_fields': list(update_fields.keys())
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error_message': f"Record update failed: {str(e)}"
            }
    
    def _process_create_assessment(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                                  execution: WorkflowExecution) -> Dict[str, Any]:
        """Process create assessment step"""
        # Placeholder for assessment creation
        return {
            'success': True,
            'output_data': {'assessment_created': True}
        }
    
    def _process_run_epr_calculation(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                                    execution: WorkflowExecution) -> Dict[str, Any]:
        """Process EPR calculation step"""
        try:
            config = step_config.get('configuration', {})
            student_id = self._resolve_value(config.get('student_id', ''), context)
            
            if not student_id:
                return {
                    'success': False,
                    'error_message': 'Student ID required for EPR calculation'
                }
            
            # Import and run EPR calculation
            # This would integrate with your EPR system
            from epr_system.algorithms import EPRScoringAlgorithms
            
            # Placeholder for EPR calculation
            epr_score = 85.5  # This would be calculated based on actual data
            
            return {
                'success': True,
                'output_data': {
                    'epr_calculated': True,
                    'student_id': student_id,
                    'epr_score': epr_score
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error_message': f"EPR calculation failed: {str(e)}"
            }
    
    def _process_create_alert(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                             execution: WorkflowExecution) -> Dict[str, Any]:
        """Process create alert step"""
        # Placeholder for alert creation
        return {
            'success': True,
            'output_data': {'alert_created': True}
        }
    
    def _process_assign_task(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                            execution: WorkflowExecution) -> Dict[str, Any]:
        """Process assign task step"""
        # Placeholder for task assignment
        return {
            'success': True,
            'output_data': {'task_assigned': True}
        }
    
    def _process_wait_for_approval(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                                  execution: WorkflowExecution) -> Dict[str, Any]:
        """Process wait for approval step"""
        # This would typically pause the workflow and wait for manual approval
        return {
            'success': True,
            'output_data': {'approval_required': True, 'workflow_paused': True}
        }
    
    def _process_conditional_branch(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                                   execution: WorkflowExecution) -> Dict[str, Any]:
        """Process conditional branch step"""
        try:
            config = step_config.get('configuration', {})
            conditions = config.get('conditions', [])
            
            # Evaluate conditions
            condition_met = self._evaluate_conditions(conditions, context)
            
            return {
                'success': True,
                'output_data': {
                    'condition_met': condition_met,
                    'branch_taken': 'true' if condition_met else 'false'
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error_message': f"Conditional branch evaluation failed: {str(e)}"
            }
    
    def _process_loop(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                     execution: WorkflowExecution) -> Dict[str, Any]:
        """Process loop step"""
        # Placeholder for loop processing
        return {
            'success': True,
            'output_data': {'loop_executed': True}
        }
    
    def _process_http_request(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                             execution: WorkflowExecution) -> Dict[str, Any]:
        """Process HTTP request step"""
        try:
            import requests
            
            config = step_config.get('configuration', {})
            url = self._resolve_value(config.get('url', ''), context)
            method = config.get('method', 'GET').upper()
            headers = config.get('headers', {})
            data = config.get('data', {})
            
            # Resolve dynamic values in headers and data
            resolved_headers = {k: self._resolve_value(v, context) for k, v in headers.items()}
            resolved_data = {k: self._resolve_value(v, context) for k, v in data.items()}
            
            # Make HTTP request
            response = requests.request(
                method=method,
                url=url,
                headers=resolved_headers,
                json=resolved_data if method in ['POST', 'PUT', 'PATCH'] else None,
                timeout=30
            )
            
            return {
                'success': True,
                'output_data': {
                    'http_request_sent': True,
                    'response_status': response.status_code,
                    'response_data': response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error_message': f"HTTP request failed: {str(e)}"
            }
    
    def _process_custom_function(self, step_config: Dict[str, Any], context: Dict[str, Any], 
                                execution: WorkflowExecution) -> Dict[str, Any]:
        """Process custom function step"""
        try:
            config = step_config.get('configuration', {})
            function_name = config.get('function_name')
            
            if not function_name:
                return {
                    'success': False,
                    'error_message': 'Custom function name not specified'
                }
            
            # Execute custom function (implement based on your needs)
            # This could load and execute custom Python functions
            
            return {
                'success': True,
                'output_data': {'custom_function_executed': True, 'function_name': function_name}
            }
            
        except Exception as e:
            return {
                'success': False,
                'error_message': f"Custom function execution failed: {str(e)}"
            }
    
    def _resolve_value(self, value: Any, context: Dict[str, Any]) -> Any:
        """Resolve dynamic values using context variables"""
        if isinstance(value, str) and value.startswith('{{') and value.endswith('}}'):
            # Extract variable name
            var_name = value[2:-2].strip()
            return self._get_nested_value(context, var_name)
        return value
    
    def _get_nested_value(self, data: Dict[str, Any], path: str) -> Any:
        """Get nested value using dot notation"""
        try:
            keys = path.split('.')
            value = data
            for key in keys:
                if isinstance(value, dict):
                    value = value.get(key)
                else:
                    value = getattr(value, key, None)
                if value is None:
                    break
            return value
        except (AttributeError, KeyError, TypeError):
            return None
    
    def _evaluate_conditions(self, conditions: List[Dict[str, Any]], context: Dict[str, Any]) -> bool:
        """Evaluate a list of conditions"""
        if not conditions:
            return True
        
        for condition in conditions:
            field = condition.get('field')
            operator = condition.get('operator')
            expected_value = condition.get('value')
            
            if not all([field, operator]):
                continue
            
            field_value = self._get_nested_value(context, field)
            
            if not self._evaluate_single_condition(field_value, operator, expected_value):
                return False
        
        return True
    
    def _evaluate_single_condition(self, field_value: Any, operator: str, expected_value: Any) -> bool:
        """Evaluate a single condition"""
        if operator == 'equals':
            return field_value == expected_value
        elif operator == 'not_equals':
            return field_value != expected_value
        elif operator == 'greater_than':
            try:
                return float(field_value) > float(expected_value)
            except (ValueError, TypeError):
                return False
        elif operator == 'less_than':
            try:
                return float(field_value) < float(expected_value)
            except (ValueError, TypeError):
                return False
        elif operator == 'contains':
            return str(expected_value).lower() in str(field_value).lower()
        
        return False


class TriggerManager:
    """Manages workflow triggers and their evaluation"""
    
    def __init__(self):
        self.engine = WorkflowEngine()
    
    def evaluate_triggers(self, event_type: str, context_data: Dict[str, Any]) -> List[WorkflowExecution]:
        """Evaluate all active triggers for a given event type"""
        
        active_triggers = WorkflowTrigger.objects.filter(
            is_active=True,
            event_type=event_type
        )
        
        executions = []
        
        for trigger in active_triggers:
            if trigger.evaluate_conditions(context_data):
                # Execute workflow
                execution = self.engine.execute_workflow(
                    workflow_template=trigger.workflow_template,
                    context=context_data,
                    trigger=trigger
                )
                executions.append(execution)
        
        return executions
    
    def trigger_workflow_manually(self, workflow_template: WorkflowTemplate, 
                                 context: Dict[str, Any] = None, 
                                 user: User = None) -> WorkflowExecution:
        """Manually trigger a workflow"""
        
        return self.engine.execute_workflow(
            workflow_template=workflow_template,
            context=context or {},
            started_by=user
        )
