"""
Daily EPR (Edusight Prism Rating) Calculation Workflow
Calculates EPR scores for all students daily and sends alerts for at-risk students
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.email import EmailOperator
from airflow.operators.dummy import DummyOperator
from airflow.utils.dates import days_ago

# Import custom operators
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'plugins'))
from edusight_operators import EPRCalculationOperator, NotificationOperator, SystemHealthCheckOperator

# Default arguments for the DAG
default_args = {
    'owner': 'edusight-admin',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'email': ['admin@edusight.com']
}

# Create the DAG
dag = DAG(
    'epr_daily_calculation',
    default_args=default_args,
    description='Daily EPR calculation and monitoring workflow',
    schedule_interval='0 6 * * *',  # Run daily at 6 AM
    max_active_runs=1,
    catchup=False,
    tags=['epr', 'daily', 'assessment']
)

# Task 1: System health check
health_check = SystemHealthCheckOperator(
    task_id='system_health_check',
    dag=dag
)

# Task 2: Calculate EPR scores for all students
calculate_epr = EPRCalculationOperator(
    task_id='calculate_epr_scores',
    assessment_config={
        'weights': {
            'academic': 0.4,
            'psychological': 0.3,
            'physical': 0.3
        }
    },
    force_recalculation=False,
    dag=dag
)

# Task 3: Process EPR results and identify at-risk students
def process_epr_results(**context):
    """Process EPR calculation results"""
    import json
    
    # Get results from previous task
    epr_results = context['ti'].xcom_pull(task_ids='calculate_epr_scores')
    
    if not epr_results:
        return {'at_risk_students': [], 'total_processed': 0}
    
    results = epr_results.get('results', [])
    
    # Identify at-risk students (EPR score < 50 or performance band 'at_risk')
    at_risk_students = []
    needs_support_students = []
    
    for result in results:
        performance_band = result.get('performance_band', '')
        epr_score = result.get('epr_score', 0)
        
        if performance_band == 'at_risk' or epr_score < 50:
            at_risk_students.append(result)
        elif performance_band == 'needs_support' or epr_score < 70:
            needs_support_students.append(result)
    
    # Store results for downstream tasks
    context['ti'].xcom_push(key='at_risk_students', value=at_risk_students)
    context['ti'].xcom_push(key='needs_support_students', value=needs_support_students)
    
    return {
        'total_processed': len(results),
        'at_risk_count': len(at_risk_students),
        'needs_support_count': len(needs_support_students),
        'healthy_count': len(results) - len(at_risk_students) - len(needs_support_students)
    }

process_results = PythonOperator(
    task_id='process_epr_results',
    python_callable=process_epr_results,
    dag=dag
)

# Task 4: Send alerts for at-risk students
def generate_at_risk_alert(**context):
    """Generate alert message for at-risk students"""
    at_risk_students = context['ti'].xcom_pull(task_ids='process_epr_results', key='at_risk_students')
    
    if not at_risk_students:
        return "No at-risk students identified today."
    
    alert_message = f"""
    URGENT: {len(at_risk_students)} student(s) identified as at-risk based on EPR calculations.
    
    Students requiring immediate attention:
    """
    
    for student in at_risk_students[:10]:  # Limit to first 10 for readability
        alert_message += f"\n- Student ID: {student['student_id']}, EPR Score: {student['epr_score']:.1f}"
    
    if len(at_risk_students) > 10:
        alert_message += f"\n... and {len(at_risk_students) - 10} more students."
    
    alert_message += "\n\nPlease review these students and initiate appropriate support measures."
    
    return alert_message

send_at_risk_alert = NotificationOperator(
    task_id='send_at_risk_alert',
    recipient_email='counselors@edusight.com',
    notification_type='email',
    subject_template='URGENT: At-Risk Students Alert - {{date}}',
    message_template='{{ generate_at_risk_alert() }}',
    notification_data={
        'date': '{{ ds }}',
        'execution_date': '{{ execution_date }}'
    },
    dag=dag
)

# Task 5: Generate daily EPR report
def generate_daily_report(**context):
    """Generate daily EPR summary report"""
    process_summary = context['ti'].xcom_pull(task_ids='process_epr_results')
    
    if not process_summary:
        return "No EPR data available for report generation."
    
    report = f"""
    Daily EPR Calculation Report - {context['ds']}
    
    Summary:
    - Total Students Processed: {process_summary.get('total_processed', 0)}
    - Students Thriving: {process_summary.get('healthy_count', 0)}
    - Students Needing Support: {process_summary.get('needs_support_count', 0)}
    - Students At-Risk: {process_summary.get('at_risk_count', 0)}
    
    EPR Distribution:
    - Thriving (85+): {process_summary.get('healthy_count', 0)} students
    - Healthy Progress (70-84): {process_summary.get('needs_support_count', 0)} students  
    - Needs Support (50-69): {process_summary.get('needs_support_count', 0)} students
    - At Risk (<50): {process_summary.get('at_risk_count', 0)} students
    
    Recommendations:
    - Schedule counseling sessions for at-risk students
    - Review support programs for students needing additional help
    - Continue monitoring progress for all students
    
    Generated by EduSight Automated Workflow System
    Execution Date: {context['execution_date']}
    """
    
    return report

send_daily_report = NotificationOperator(
    task_id='send_daily_report',
    recipient_email='management@edusight.com',
    notification_type='email',
    subject_template='Daily EPR Report - {{date}}',
    message_template='{{ generate_daily_report() }}',
    notification_data={
        'date': '{{ ds }}',
        'execution_date': '{{ execution_date }}'
    },
    dag=dag
)

# Task 6: Completion marker
completion_marker = DummyOperator(
    task_id='epr_calculation_complete',
    dag=dag
)

# Define task dependencies
health_check >> calculate_epr >> process_results
process_results >> [send_at_risk_alert, send_daily_report] >> completion_marker

# Add task documentation
health_check.doc_md = """
### System Health Check
Performs a comprehensive health check of the EduSight system before running EPR calculations.
Checks database connectivity, disk space, memory usage, and system load.
"""

calculate_epr.doc_md = """
### EPR Score Calculation
Calculates Edusight Prism Rating (EPR) scores for all students based on their latest assessments.
Uses weighted scoring: Academic (40%), Psychological (30%), Physical (30%).
"""

process_results.doc_md = """
### Results Processing
Analyzes EPR calculation results to identify students in different performance bands.
Categorizes students as: Thriving, Healthy Progress, Needs Support, or At-Risk.
"""

send_at_risk_alert.doc_md = """
### At-Risk Alert
Sends urgent notifications to counselors and support staff about students identified as at-risk.
Triggered only when students have EPR scores below 50 or are classified as 'at_risk'.
"""

send_daily_report.doc_md = """
### Daily Report
Generates and sends a comprehensive daily report to management with EPR statistics and recommendations.
Includes distribution of students across performance bands and suggested actions.
"""
