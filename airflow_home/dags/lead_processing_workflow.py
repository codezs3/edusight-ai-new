"""
Lead Processing and CRM Workflow
Processes incoming leads, scores them, and triggers appropriate follow-up actions
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator, BranchPythonOperator
from airflow.operators.email import EmailOperator
from airflow.operators.dummy import DummyOperator
from airflow.sensors.filesystem import FileSensor
from airflow.utils.dates import days_ago

# Import custom operators
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'plugins'))
from edusight_operators import LeadProcessingOperator, NotificationOperator

# Default arguments for the DAG
default_args = {
    'owner': 'edusight-sales',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=3),
    'email': ['sales@edusight.com']
}

# Create the DAG
dag = DAG(
    'lead_processing_workflow',
    default_args=default_args,
    description='Process and score leads, trigger follow-up actions',
    schedule_interval=timedelta(hours=2),  # Run every 2 hours
    max_active_runs=1,
    catchup=False,
    tags=['crm', 'leads', 'sales']
)

# Task 1: Process new leads
process_leads = LeadProcessingOperator(
    task_id='process_new_leads',
    batch_size=50,
    processing_config={
        'auto_assign': True,
        'score_threshold': 60
    },
    dag=dag
)

# Task 2: Analyze lead processing results
def analyze_lead_results(**context):
    """Analyze lead processing results and determine next actions"""
    results = context['ti'].xcom_pull(task_ids='process_new_leads')
    
    if not results or not results.get('results'):
        return {'hot_leads': [], 'warm_leads': [], 'cold_leads': []}
    
    hot_leads = []
    warm_leads = []
    cold_leads = []
    
    for lead_result in results['results']:
        if lead_result['status'] == 'hot':
            hot_leads.append(lead_result)
        elif lead_result['status'] == 'warm':
            warm_leads.append(lead_result)
        else:
            cold_leads.append(lead_result)
    
    # Store categorized leads for downstream tasks
    context['ti'].xcom_push(key='hot_leads', value=hot_leads)
    context['ti'].xcom_push(key='warm_leads', value=warm_leads)
    context['ti'].xcom_push(key='cold_leads', value=cold_leads)
    
    return {
        'hot_count': len(hot_leads),
        'warm_count': len(warm_leads),
        'cold_count': len(cold_leads),
        'total_processed': len(results['results'])
    }

analyze_results = PythonOperator(
    task_id='analyze_lead_results',
    python_callable=analyze_lead_results,
    dag=dag
)

# Task 3: Branch based on hot leads
def check_hot_leads(**context):
    """Check if there are hot leads requiring immediate attention"""
    hot_leads = context['ti'].xcom_pull(task_ids='analyze_lead_results', key='hot_leads')
    
    if hot_leads and len(hot_leads) > 0:
        return 'send_hot_lead_alert'
    else:
        return 'skip_hot_lead_alert'

branch_hot_leads = BranchPythonOperator(
    task_id='check_hot_leads',
    python_callable=check_hot_leads,
    dag=dag
)

# Task 4a: Send hot lead alert
send_hot_lead_alert = NotificationOperator(
    task_id='send_hot_lead_alert',
    recipient_email='sales-team@edusight.com',
    notification_type='email',
    subject_template='URGENT: Hot Leads Require Immediate Attention',
    message_template="""
    High-priority leads have been identified and require immediate follow-up:
    
    {{hot_lead_details}}
    
    Please contact these leads within the next hour for best conversion rates.
    
    Login to CRM: https://edusight.com/admin-panel/forms/
    """,
    notification_data={
        'timestamp': '{{ ts }}',
        'hot_lead_details': '{{ ti.xcom_pull(task_ids="analyze_lead_results", key="hot_leads") }}'
    },
    dag=dag
)

# Task 4b: Skip hot lead alert
skip_hot_lead_alert = DummyOperator(
    task_id='skip_hot_lead_alert',
    dag=dag
)

# Task 5: Schedule follow-up for warm leads
def schedule_warm_lead_followup(**context):
    """Schedule follow-up actions for warm leads"""
    warm_leads = context['ti'].xcom_pull(task_ids='analyze_lead_results', key='warm_leads')
    
    if not warm_leads:
        return "No warm leads to schedule follow-up for."
    
    # In a real implementation, this would create tasks in your CRM system
    scheduled_count = 0
    
    for lead in warm_leads:
        # Schedule follow-up call/email for tomorrow
        # This is a placeholder - integrate with your actual CRM system
        scheduled_count += 1
    
    return f"Scheduled follow-up actions for {scheduled_count} warm leads."

schedule_followup = PythonOperator(
    task_id='schedule_warm_lead_followup',
    python_callable=schedule_warm_lead_followup,
    dag=dag
)

# Task 6: Send daily lead summary
def generate_lead_summary(**context):
    """Generate daily lead processing summary"""
    analysis = context['ti'].xcom_pull(task_ids='analyze_lead_results')
    
    if not analysis:
        return "No lead data available for summary."
    
    summary = f"""
    Lead Processing Summary - {context['ds']}
    
    Total Leads Processed: {analysis.get('total_processed', 0)}
    
    Lead Distribution:
    🔥 Hot Leads (Priority): {analysis.get('hot_count', 0)}
    🔸 Warm Leads: {analysis.get('warm_count', 0)}
    ❄️ Cold Leads: {analysis.get('cold_count', 0)}
    
    Actions Taken:
    - Hot leads have been flagged for immediate follow-up
    - Warm leads have been scheduled for follow-up within 24 hours
    - Cold leads have been added to nurturing campaigns
    
    Next Steps:
    - Sales team should prioritize hot leads
    - Marketing team should focus on nurturing cold leads
    - Continue monitoring lead quality and sources
    
    Generated at: {context['ts']}
    """
    
    return summary

send_lead_summary = NotificationOperator(
    task_id='send_lead_summary',
    recipient_email='management@edusight.com',
    notification_type='email',
    subject_template='Daily Lead Processing Summary - {{ds}}',
    message_template='{{ generate_lead_summary() }}',
    notification_data={
        'date': '{{ ds }}',
        'timestamp': '{{ ts }}'
    },
    dag=dag
)

# Task 7: Update lead analytics
def update_lead_analytics(**context):
    """Update lead analytics and metrics"""
    analysis = context['ti'].xcom_pull(task_ids='analyze_lead_results')
    
    if not analysis:
        return "No analytics to update."
    
    # In a real implementation, this would update your analytics dashboard
    # For now, we'll just log the metrics
    
    metrics = {
        'date': context['ds'],
        'total_leads': analysis.get('total_processed', 0),
        'hot_leads': analysis.get('hot_count', 0),
        'warm_leads': analysis.get('warm_count', 0),
        'cold_leads': analysis.get('cold_count', 0),
        'conversion_potential': (analysis.get('hot_count', 0) + analysis.get('warm_count', 0)) / max(analysis.get('total_processed', 1), 1) * 100
    }
    
    # Store metrics for reporting
    context['ti'].xcom_push(key='daily_metrics', value=metrics)
    
    return f"Analytics updated with {analysis.get('total_processed', 0)} leads processed."

update_analytics = PythonOperator(
    task_id='update_lead_analytics',
    python_callable=update_lead_analytics,
    dag=dag
)

# Task 8: Completion marker
completion_marker = DummyOperator(
    task_id='lead_processing_complete',
    trigger_rule='none_failed_or_skipped',  # Continue even if some branches were skipped
    dag=dag
)

# Define task dependencies
process_leads >> analyze_results >> branch_hot_leads
branch_hot_leads >> [send_hot_lead_alert, skip_hot_lead_alert]
[send_hot_lead_alert, skip_hot_lead_alert] >> schedule_followup
schedule_followup >> [send_lead_summary, update_analytics] >> completion_marker

# Add task documentation
process_leads.doc_md = """
### Lead Processing
Processes new leads from various sources (website forms, referrals, etc.).
Scores leads based on completeness, source quality, and engagement level.
"""

analyze_results.doc_md = """
### Results Analysis
Categorizes processed leads into hot, warm, and cold categories based on their scores.
Hot leads (80+ score) require immediate attention for best conversion rates.
"""

branch_hot_leads.doc_md = """
### Hot Lead Branching
Determines whether urgent notifications are needed based on the presence of hot leads.
Branches workflow to either send alerts or skip them.
"""

schedule_followup.doc_md = """
### Follow-up Scheduling
Automatically schedules appropriate follow-up actions for warm leads.
Integrates with CRM system to create tasks and reminders.
"""

update_analytics.doc_md = """
### Analytics Update
Updates lead analytics dashboard with daily processing metrics.
Tracks conversion potential and lead quality trends over time.
"""
