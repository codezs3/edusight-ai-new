from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.db.models import Q, Count
from django.utils import timezone
import json

from .models import (
    WorkflowTemplate, WorkflowTrigger, WorkflowExecution, 
    WorkflowStepExecution, WorkflowAuditLog
)
from .engine import WorkflowEngine, TriggerManager

def is_admin_user(user):
    """Check if user is admin"""
    return user.is_superuser or user.is_staff

@login_required
@user_passes_test(is_admin_user)
def workflow_dashboard(request):
    """Main workflow management dashboard"""
    
    # Get statistics
    stats = {
        'total_workflows': WorkflowTemplate.objects.count(),
        'active_workflows': WorkflowTemplate.objects.filter(status='active').count(),
        'total_triggers': WorkflowTrigger.objects.count(),
        'active_triggers': WorkflowTrigger.objects.filter(is_active=True).count(),
        'total_executions': WorkflowExecution.objects.count(),
        'successful_executions': WorkflowExecution.objects.filter(status='completed').count(),
        'failed_executions': WorkflowExecution.objects.filter(status='failed').count(),
    }
    
    # Recent executions
    recent_executions = WorkflowExecution.objects.select_related(
        'workflow_template', 'trigger', 'started_by'
    ).order_by('-created_at')[:10]
    
    # Recent audit logs
    recent_logs = WorkflowAuditLog.objects.select_related(
        'user', 'workflow_template'
    ).order_by('-created_at')[:10]
    
    context = {
        'page_title': 'Workflow Management Dashboard',
        'stats': stats,
        'recent_executions': recent_executions,
        'recent_logs': recent_logs,
    }
    
    return render(request, 'workflow_system/dashboard.html', context)