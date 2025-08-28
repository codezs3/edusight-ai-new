"""
System Maintenance and Monitoring Workflow
Performs regular system maintenance, backups, and health monitoring
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from airflow.operators.dummy import DummyOperator
from airflow.utils.dates import days_ago

# Import custom operators
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'plugins'))
from edusight_operators import DataBackupOperator, SystemHealthCheckOperator, NotificationOperator

# Default arguments for the DAG
default_args = {
    'owner': 'edusight-devops',
    'depends_on_past': False,
    'start_date': days_ago(1),
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'email': ['devops@edusight.com']
}

# Create the DAG
dag = DAG(
    'system_maintenance',
    default_args=default_args,
    description='System maintenance, backup, and monitoring workflow',
    schedule_interval='0 2 * * *',  # Run daily at 2 AM
    max_active_runs=1,
    catchup=False,
    tags=['maintenance', 'backup', 'monitoring']
)

# Task 1: System health check
health_check = SystemHealthCheckOperator(
    task_id='comprehensive_health_check',
    dag=dag
)

# Task 2: Database maintenance
def database_maintenance(**context):
    """Perform database maintenance tasks"""
    import sqlite3
    import os
    
    db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'db.sqlite3')
    
    if not os.path.exists(db_path):
        return "Database file not found, skipping maintenance."
    
    try:
        # Connect to database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get database size before optimization
        initial_size = os.path.getsize(db_path)
        
        # Run VACUUM to reclaim space
        cursor.execute("VACUUM;")
        
        # Update statistics
        cursor.execute("ANALYZE;")
        
        # Get database size after optimization
        final_size = os.path.getsize(db_path)
        space_saved = initial_size - final_size
        
        conn.close()
        
        return {
            'initial_size_mb': round(initial_size / (1024*1024), 2),
            'final_size_mb': round(final_size / (1024*1024), 2),
            'space_saved_mb': round(space_saved / (1024*1024), 2),
            'optimization_completed': True
        }
        
    except Exception as e:
        return {'error': str(e), 'optimization_completed': False}

db_maintenance = PythonOperator(
    task_id='database_maintenance',
    python_callable=database_maintenance,
    dag=dag
)

# Task 3: Create system backup
create_backup = DataBackupOperator(
    task_id='create_system_backup',
    backup_type='daily',
    retention_days=30,
    dag=dag
)

# Task 4: Clean up old log files
def cleanup_logs(**context):
    """Clean up old log files and temporary data"""
    import os
    import shutil
    from pathlib import Path
    
    project_path = Path(__file__).parent.parent.parent
    cleanup_summary = {
        'log_files_removed': 0,
        'temp_files_removed': 0,
        'space_freed_mb': 0
    }
    
    try:
        # Clean up Django logs older than 30 days
        logs_dir = project_path / 'logs'
        if logs_dir.exists():
            cutoff_date = datetime.now() - timedelta(days=30)
            
            for log_file in logs_dir.rglob('*.log'):
                if log_file.stat().st_mtime < cutoff_date.timestamp():
                    file_size = log_file.stat().st_size
                    log_file.unlink()
                    cleanup_summary['log_files_removed'] += 1
                    cleanup_summary['space_freed_mb'] += file_size / (1024*1024)
        
        # Clean up temporary files
        temp_dirs = [
            project_path / 'temp',
            project_path / 'tmp',
            project_path / 'media' / 'temp'
        ]
        
        for temp_dir in temp_dirs:
            if temp_dir.exists():
                for temp_file in temp_dir.rglob('*'):
                    if temp_file.is_file() and temp_file.stat().st_mtime < (datetime.now() - timedelta(days=7)).timestamp():
                        file_size = temp_file.stat().st_size
                        temp_file.unlink()
                        cleanup_summary['temp_files_removed'] += 1
                        cleanup_summary['space_freed_mb'] += file_size / (1024*1024)
        
        cleanup_summary['space_freed_mb'] = round(cleanup_summary['space_freed_mb'], 2)
        return cleanup_summary
        
    except Exception as e:
        return {'error': str(e), 'cleanup_completed': False}

cleanup_logs = PythonOperator(
    task_id='cleanup_old_logs',
    python_callable=cleanup_logs,
    dag=dag
)

# Task 5: Update system statistics
def update_system_stats(**context):
    """Update system statistics and metrics"""
    
    # Get health check results
    health_data = context['ti'].xcom_pull(task_ids='comprehensive_health_check')
    
    # Get backup results
    backup_data = context['ti'].xcom_pull(task_ids='create_system_backup')
    
    # Get database maintenance results
    db_maintenance_data = context['ti'].xcom_pull(task_ids='database_maintenance')
    
    # Get cleanup results
    cleanup_data = context['ti'].xcom_pull(task_ids='cleanup_old_logs')
    
    # Compile system statistics
    stats = {
        'maintenance_date': context['ds'],
        'system_health': health_data.get('overall_status', 'unknown') if health_data else 'unknown',
        'backup_created': backup_data.get('backup_file', 'none') if backup_data else 'none',
        'database_optimized': db_maintenance_data.get('optimization_completed', False) if db_maintenance_data else False,
        'logs_cleaned': cleanup_data.get('log_files_removed', 0) if cleanup_data else 0,
        'space_freed_mb': cleanup_data.get('space_freed_mb', 0) if cleanup_data else 0
    }
    
    # Store stats for reporting
    context['ti'].xcom_push(key='maintenance_stats', value=stats)
    
    return stats

update_stats = PythonOperator(
    task_id='update_system_statistics',
    python_callable=update_system_stats,
    dag=dag
)

# Task 6: Generate maintenance report
def generate_maintenance_report(**context):
    """Generate comprehensive maintenance report"""
    
    # Get all task results
    health_data = context['ti'].xcom_pull(task_ids='comprehensive_health_check')
    backup_data = context['ti'].xcom_pull(task_ids='create_system_backup')
    db_data = context['ti'].xcom_pull(task_ids='database_maintenance')
    cleanup_data = context['ti'].xcom_pull(task_ids='cleanup_old_logs')
    stats = context['ti'].xcom_pull(task_ids='update_system_statistics')
    
    # Generate report
    report = f"""
    EduSight System Maintenance Report
    Generated: {context['execution_date']}
    
    🏥 SYSTEM HEALTH CHECK
    Overall Status: {health_data.get('overall_status', 'Unknown').upper() if health_data else 'ERROR'}
    Database: {health_data.get('database', {}).get('status', 'Unknown') if health_data else 'Unknown'}
    Disk Space: {health_data.get('disk_space', {}).get('free_percentage', 'Unknown')}% free
    Memory Usage: {health_data.get('memory', {}).get('used_percentage', 'Unknown')}% used
    CPU Load: {health_data.get('system_load', {}).get('cpu_percentage', 'Unknown')}%
    
    💾 BACKUP STATUS
    Backup Created: {'✅ Success' if backup_data else '❌ Failed'}
    Backup File: {backup_data.get('backup_file', 'None') if backup_data else 'None'}
    Backup Size: {round(backup_data.get('backup_size', 0) / (1024*1024), 2) if backup_data else 0} MB
    
    🗄️ DATABASE MAINTENANCE
    Optimization: {'✅ Completed' if db_data and db_data.get('optimization_completed') else '❌ Failed'}
    Initial Size: {db_data.get('initial_size_mb', 'Unknown') if db_data else 'Unknown'} MB
    Final Size: {db_data.get('final_size_mb', 'Unknown') if db_data else 'Unknown'} MB
    Space Saved: {db_data.get('space_saved_mb', 0) if db_data else 0} MB
    
    🧹 CLEANUP OPERATIONS
    Log Files Removed: {cleanup_data.get('log_files_removed', 0) if cleanup_data else 0}
    Temp Files Removed: {cleanup_data.get('temp_files_removed', 0) if cleanup_data else 0}
    Total Space Freed: {cleanup_data.get('space_freed_mb', 0) if cleanup_data else 0} MB
    
    📊 SUMMARY
    Maintenance Status: {'✅ All tasks completed successfully' if all([health_data, backup_data, db_data, cleanup_data]) else '⚠️ Some tasks failed - review logs'}
    Next Maintenance: {(context['execution_date'] + timedelta(days=1)).strftime('%Y-%m-%d %H:%M')}
    
    For detailed logs, visit: http://localhost:8080/admin/airflow/log/?dag_id=system_maintenance&execution_date={context['execution_date']}
    
    Generated by EduSight Automated Maintenance System
    """
    
    return report

send_maintenance_report = NotificationOperator(
    task_id='send_maintenance_report',
    recipient_email='devops@edusight.com',
    notification_type='email',
    subject_template='System Maintenance Report - {{ds}}',
    message_template='{{ generate_maintenance_report() }}',
    notification_data={
        'date': '{{ ds }}',
        'execution_date': '{{ execution_date }}'
    },
    dag=dag
)

# Task 7: Performance monitoring
def monitor_performance(**context):
    """Monitor system performance metrics"""
    import psutil
    import time
    
    # Collect performance metrics over a short period
    cpu_samples = []
    memory_samples = []
    
    for i in range(5):
        cpu_samples.append(psutil.cpu_percent(interval=1))
        memory_samples.append(psutil.virtual_memory().percent)
        time.sleep(1)
    
    # Calculate averages
    avg_cpu = sum(cpu_samples) / len(cpu_samples)
    avg_memory = sum(memory_samples) / len(memory_samples)
    
    # Get disk I/O stats
    disk_io = psutil.disk_io_counters()
    
    # Get network stats
    network_io = psutil.net_io_counters()
    
    performance_metrics = {
        'timestamp': context['ts'],
        'cpu_usage_avg': round(avg_cpu, 2),
        'memory_usage_avg': round(avg_memory, 2),
        'disk_read_mb': round(disk_io.read_bytes / (1024*1024), 2),
        'disk_write_mb': round(disk_io.write_bytes / (1024*1024), 2),
        'network_sent_mb': round(network_io.bytes_sent / (1024*1024), 2),
        'network_recv_mb': round(network_io.bytes_recv / (1024*1024), 2)
    }
    
    # Check for performance alerts
    alerts = []
    if avg_cpu > 80:
        alerts.append(f"High CPU usage: {avg_cpu:.1f}%")
    if avg_memory > 85:
        alerts.append(f"High memory usage: {avg_memory:.1f}%")
    
    performance_metrics['alerts'] = alerts
    
    return performance_metrics

performance_monitor = PythonOperator(
    task_id='monitor_system_performance',
    python_callable=monitor_performance,
    dag=dag
)

# Task 8: Completion marker
completion_marker = DummyOperator(
    task_id='maintenance_complete',
    dag=dag
)

# Define task dependencies
health_check >> [db_maintenance, create_backup, cleanup_logs, performance_monitor]
[db_maintenance, create_backup, cleanup_logs, performance_monitor] >> update_stats
update_stats >> send_maintenance_report >> completion_marker

# Add task documentation
health_check.doc_md = """
### Comprehensive Health Check
Performs a thorough system health assessment including:
- Database connectivity and performance
- Disk space availability
- Memory usage
- CPU load
- Active user count
"""

db_maintenance.doc_md = """
### Database Maintenance
Optimizes the SQLite database by:
- Running VACUUM to reclaim unused space
- Updating table statistics with ANALYZE
- Reporting space savings achieved
"""

create_backup.doc_md = """
### System Backup
Creates a comprehensive backup including:
- Database files
- Media uploads
- Configuration files
- Automatically manages retention policy
"""

cleanup_logs.doc_md = """
### Log Cleanup
Removes old files to free disk space:
- Log files older than 30 days
- Temporary files older than 7 days
- Reports space freed
"""

performance_monitor.doc_md = """
### Performance Monitoring
Collects real-time performance metrics:
- CPU usage patterns
- Memory consumption
- Disk I/O statistics
- Network activity
- Generates alerts for resource issues
"""
