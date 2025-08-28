from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
import json
import uuid

class WorkflowTemplate(models.Model):
    """Template for creating workflows"""
    CATEGORY_CHOICES = [
        ('assessment', 'Assessment'),
        ('student_support', 'Student Support'),
        ('communication', 'Communication'),
        ('administrative', 'Administrative'),
        ('epr_processing', 'EPR Processing'),
        ('alert_handling', 'Alert Handling'),
        ('custom', 'Custom'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('archived', 'Archived'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='custom')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # Workflow configuration
    workflow_config = models.JSONField(default=dict, help_text="JSON configuration for workflow steps")
    
    # Access control
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_workflows')
    is_public = models.BooleanField(default=False, help_text="Can be used by other admins")
    allowed_users = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='accessible_workflows')
    
    # Execution settings
    max_execution_time = models.IntegerField(default=300, help_text="Maximum execution time in seconds")
    retry_attempts = models.IntegerField(default=3, help_text="Number of retry attempts on failure")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.name} ({self.category})"
    
    def get_step_count(self):
        """Get number of steps in workflow"""
        steps = self.workflow_config.get('steps', [])
        return len(steps)
    
    def is_valid_workflow(self):
        """Validate workflow configuration"""
        try:
            steps = self.workflow_config.get('steps', [])
            if not steps:
                return False, "Workflow must have at least one step"
            
            for i, step in enumerate(steps):
                if 'action_type' not in step:
                    return False, f"Step {i+1} missing action_type"
                if 'name' not in step:
                    return False, f"Step {i+1} missing name"
            
            return True, "Valid"
        except Exception as e:
            return False, f"Configuration error: {str(e)}"