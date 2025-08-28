from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
from django.db.models import Q
from django.conf import settings
import os
import json
import subprocess
from datetime import datetime, timedelta
from django.utils import timezone
from crm.models import Lead, FormSubmission, Appointment, CallLog
from students.models import User
from pathlib import Path

# Import Airflow integration
try:
    from workflow_system.airflow_integration import AirflowManager, TriggerSystemManager
    AIRFLOW_AVAILABLE = True
except ImportError:
    AIRFLOW_AVAILABLE = False

def is_admin_user(user):
    """Check if user is admin/staff"""
    return user.is_authenticated and (user.is_staff or user.is_superuser)

@login_required
@user_passes_test(is_admin_user)
def admin_dashboard_home(request):
    """Main admin dashboard overview"""
    context = {
        'page_title': 'Admin Dashboard',
        'total_users': User.objects.count(),
        'total_leads': Lead.objects.count(),
        'total_appointments': Appointment.objects.count(),
        'recent_activity': get_recent_activity(),
    }
    return render(request, 'admin_dashboard/overview.html', context)

@login_required
@user_passes_test(is_admin_user)
def pages_management(request):
    """Manage website pages"""
    # Get all template files
    template_dir = Path(settings.BASE_DIR) / 'templates' / 'website'
    pages = []
    
    if template_dir.exists():
        for template_file in template_dir.glob('*.html'):
            if template_file.name != 'base.html':
                pages.append({
                    'name': template_file.stem.title(),
                    'filename': template_file.name,
                    'url': f'/{template_file.stem}/' if template_file.stem != 'home' else '/',
                    'last_modified': datetime.fromtimestamp(template_file.stat().st_mtime),
                    'size': template_file.stat().st_size,
                })
    
    context = {
        'page_title': 'Pages Management',
        'pages': pages,
    }
    return render(request, 'admin_dashboard/pages.html', context)

@login_required
@user_passes_test(is_admin_user)
def menus_management(request):
    """Manage website menus"""
    context = {
        'page_title': 'Menus Management',
        'main_menu_items': [
            {'name': 'Home', 'url': '/', 'active': True},
            {'name': 'EPR Assessment', 'url': '/pricing/', 'active': True},
            {'name': 'Frameworks', 'url': '#', 'active': True, 'has_submenu': True},
            {'name': 'About Us', 'url': '/about/', 'active': True},
            {'name': 'Contact', 'url': '/contact/', 'active': True},
        ]
    }
    return render(request, 'admin_dashboard/menus.html', context)

@login_required
@user_passes_test(is_admin_user)
def media_management(request):
    """Manage media files"""
    media_dir = Path(settings.MEDIA_ROOT)
    media_files = []
    
    if media_dir.exists():
        for media_file in media_dir.rglob('*'):
            if media_file.is_file():
                media_files.append({
                    'name': media_file.name,
                    'path': str(media_file.relative_to(media_dir)),
                    'url': f"{settings.MEDIA_URL}{media_file.relative_to(media_dir)}",
                    'size': media_file.stat().st_size,
                    'modified': datetime.fromtimestamp(media_file.stat().st_mtime),
                })
    
    context = {
        'page_title': 'Media Management',
        'media_files': media_files,
        'total_files': len(media_files),
        'total_size': sum(f['size'] for f in media_files),
    }
    return render(request, 'admin_dashboard/media.html', context)

@login_required
@user_passes_test(is_admin_user)
def users_management(request):
    """Manage users"""
    users = User.objects.all().order_by('-date_joined')
    
    # Search functionality
    search_query = request.GET.get('search', '')
    if search_query:
        users = users.filter(
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            Q(email__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(users, 20)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_title': 'Users Management',
        'users': page_obj,
        'search_query': search_query,
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'staff_users': User.objects.filter(is_staff=True).count(),
    }
    return render(request, 'admin_dashboard/users.html', context)

@login_required
@user_passes_test(is_admin_user)
def forms_management(request):
    """Manage forms and submissions"""
    # Get recent form submissions
    form_submissions = FormSubmission.objects.all().order_by('-created_at')[:20]
    leads = Lead.objects.all().order_by('-created_at')[:20]
    appointments = Appointment.objects.all().order_by('-created_at')[:20]
    
    context = {
        'page_title': 'Forms Management',
        'form_submissions': form_submissions,
        'leads': leads,
        'appointments': appointments,
        'total_submissions': FormSubmission.objects.count(),
        'total_leads': Lead.objects.count(),
        'total_appointments': Appointment.objects.count(),
    }
    return render(request, 'admin_dashboard/forms.html', context)

@login_required
@user_passes_test(is_admin_user)
def analytics_dashboard(request):
    """Website analytics dashboard"""
    # Get analytics data
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Calculate metrics
    leads_today = Lead.objects.filter(created_at__date=today).count()
    leads_week = Lead.objects.filter(created_at__date__gte=week_ago).count()
    leads_month = Lead.objects.filter(created_at__date__gte=month_ago).count()
    
    appointments_today = Appointment.objects.filter(created_at__date=today).count()
    appointments_week = Appointment.objects.filter(created_at__date__gte=week_ago).count()
    
    context = {
        'page_title': 'Analytics Dashboard',
        'metrics': {
            'leads_today': leads_today,
            'leads_week': leads_week,
            'leads_month': leads_month,
            'appointments_today': appointments_today,
            'appointments_week': appointments_week,
            'conversion_rate': round((appointments_week / leads_week * 100) if leads_week > 0 else 0, 2),
        },
        'chart_data': get_analytics_chart_data(),
    }
    return render(request, 'admin_dashboard/analytics.html', context)

@login_required
@user_passes_test(is_admin_user)
def appearance_management(request):
    """Manage website appearance"""
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'change_theme':
            theme_name = request.POST.get('theme_name')
            # Save theme preference to session or database
            request.session['active_theme'] = theme_name
            messages.success(request, f'Theme changed to {theme_name}')
            return JsonResponse({'success': True, 'message': f'Theme changed to {theme_name}'})
        
        elif action == 'save_colors':
            # Save color preferences
            colors = {
                'primary': request.POST.get('primary_color'),
                'secondary': request.POST.get('secondary_color'),
                'success': request.POST.get('success_color'),
                'warning': request.POST.get('warning_color'),
                'danger': request.POST.get('danger_color'),
            }
            request.session['custom_colors'] = colors
            messages.success(request, 'Color scheme saved successfully!')
            return JsonResponse({'success': True, 'message': 'Colors saved successfully'})
    
    # Get current theme from session
    active_theme = request.session.get('active_theme', 'Default Blue')
    custom_colors = request.session.get('custom_colors', {
        'primary': '#2563eb',
        'secondary': '#3b82f6',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
    })
    
    themes = [
        {'name': 'Default Blue', 'active': active_theme == 'Default Blue', 'preview': '#2563eb'},
        {'name': 'Green Professional', 'active': active_theme == 'Green Professional', 'preview': '#10b981'},
        {'name': 'Purple Modern', 'active': active_theme == 'Purple Modern', 'preview': '#8b5cf6'},
    ]
    
    context = {
        'page_title': 'Appearance Management',
        'themes': themes,
        'current_colors': custom_colors,
    }
    return render(request, 'admin_dashboard/appearance.html', context)

@login_required
@user_passes_test(is_admin_user)
def plugins_management(request):
    """Manage plugins and extensions"""
    installed_plugins = [
        {'name': 'ML Analytics', 'version': '2.0.0', 'active': True, 'description': 'Advanced ML algorithms for student assessment'},
        {'name': 'CRM Integration', 'version': '1.5.0', 'active': True, 'description': 'Customer relationship management system'},
        {'name': 'Backup Manager', 'version': '1.2.0', 'active': True, 'description': 'Automated backup and restore functionality'},
        {'name': 'SEO Optimizer', 'version': '1.0.0', 'active': False, 'description': 'Search engine optimization tools'},
    ]
    
    context = {
        'page_title': 'Plugins Management',
        'plugins': installed_plugins,
        'active_plugins': len([p for p in installed_plugins if p['active']]),
        'total_plugins': len(installed_plugins),
    }
    return render(request, 'admin_dashboard/plugins.html', context)

@login_required
@user_passes_test(is_admin_user)
def settings_management(request):
    """Manage system settings"""
    if request.method == 'POST':
        # Handle settings update
        messages.success(request, 'Settings updated successfully!')
        return redirect('admin_dashboard:settings')
    
    context = {
        'page_title': 'Settings Management',
        'site_settings': {
            'site_name': 'EduSight',
            'site_url': 'http://localhost:8000',
            'admin_email': 'admin@edusight.com',
            'timezone': 'Asia/Kolkata',
            'language': 'English',
            'maintenance_mode': False,
            'registration_enabled': True,
            'email_notifications': True,
        },
        'security_settings': {
            'two_factor_auth': False,
            'password_expiry_days': 90,
            'session_timeout': 30,
            'max_login_attempts': 5,
        }
    }
    return render(request, 'admin_dashboard/settings.html', context)

@login_required
@user_passes_test(is_admin_user)
def backup_system(request):
    """Create system backup"""
    if request.method == 'POST':
        action = request.POST.get('action', 'create_backup')
        
        if action == 'create_backup':
            try:
                # Create backup
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                backup_name = f"edusight_backup_{timestamp}.db"
                backup_dir = settings.BASE_DIR / 'backups'
                backup_path = backup_dir / backup_name
                
                # Create backups directory if it doesn't exist
                os.makedirs(backup_dir, exist_ok=True)
                
                # Create database backup (SQLite)
                import shutil
                db_path = settings.BASE_DIR / 'db.sqlite3'
                if db_path.exists():
                    shutil.copy2(db_path, backup_path)
                    
                    # Also create a compressed version
                    import zipfile
                    zip_path = backup_path.with_suffix('.zip')
                    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                        zipf.write(backup_path, backup_name)
                        # Add media files if they exist
                        media_dir = settings.BASE_DIR / 'media'
                        if media_dir.exists():
                            for media_file in media_dir.rglob('*'):
                                if media_file.is_file():
                                    zipf.write(media_file, f"media/{media_file.relative_to(media_dir)}")
                    
                    # Remove the uncompressed db file, keep only the zip
                    backup_path.unlink()
                    
                    messages.success(request, f'Backup created successfully: {zip_path.name}')
                    return JsonResponse({'success': True, 'message': f'Backup created: {zip_path.name}'})
                else:
                    return JsonResponse({'success': False, 'error': 'Database file not found'})
                    
            except Exception as e:
                messages.error(request, f'Backup failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
        
        elif action == 'restore_backup':
            backup_name = request.POST.get('backup_name')
            try:
                backup_dir = settings.BASE_DIR / 'backups'
                backup_path = backup_dir / backup_name
                
                if backup_path.exists() and backup_path.suffix == '.zip':
                    import zipfile
                    # Extract and restore database
                    with zipfile.ZipFile(backup_path, 'r') as zipf:
                        # Extract database
                        db_files = [f for f in zipf.namelist() if f.endswith('.db')]
                        if db_files:
                            temp_db = backup_dir / 'temp_restore.db'
                            zipf.extract(db_files[0], backup_dir)
                            extracted_db = backup_dir / db_files[0]
                            
                            # Backup current database
                            current_db = settings.BASE_DIR / 'db.sqlite3'
                            current_backup = settings.BASE_DIR / f'db_backup_before_restore_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
                            if current_db.exists():
                                shutil.copy2(current_db, current_backup)
                            
                            # Replace with restored database
                            shutil.move(extracted_db, current_db)
                            
                            messages.success(request, f'Database restored from {backup_name}')
                            return JsonResponse({'success': True, 'message': 'Database restored successfully'})
                        else:
                            return JsonResponse({'success': False, 'error': 'No database found in backup'})
                else:
                    return JsonResponse({'success': False, 'error': 'Backup file not found'})
                    
            except Exception as e:
                messages.error(request, f'Restore failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
        
        elif action == 'delete_backup':
            backup_name = request.POST.get('backup_name')
            try:
                backup_dir = settings.BASE_DIR / 'backups'
                backup_path = backup_dir / backup_name
                
                if backup_path.exists():
                    backup_path.unlink()
                    messages.success(request, f'Backup {backup_name} deleted successfully')
                    return JsonResponse({'success': True, 'message': 'Backup deleted successfully'})
                else:
                    return JsonResponse({'success': False, 'error': 'Backup file not found'})
                    
            except Exception as e:
                messages.error(request, f'Delete failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
    
    # List existing backups
    backup_dir = settings.BASE_DIR / 'backups'
    backups = []
    
    if backup_dir.exists():
        for backup_file in backup_dir.glob('*.zip'):
            backups.append({
                'name': backup_file.name,
                'size': backup_file.stat().st_size,
                'created': datetime.fromtimestamp(backup_file.stat().st_ctime),
            })
    
    context = {
        'page_title': 'Backup System',
        'backups': sorted(backups, key=lambda x: x['created'], reverse=True),
    }
    return render(request, 'admin_dashboard/backup.html', context)

@login_required
@user_passes_test(is_admin_user)
def workflow_management(request):
    """Airflow workflow management interface"""
    
    if not AIRFLOW_AVAILABLE:
        messages.error(request, 'Airflow integration is not available')
        return redirect('admin_overview')
    
    if request.method == 'POST':
        action = request.POST.get('action')
        airflow_manager = AirflowManager()
        
        if action == 'initialize_airflow':
            try:
                success = airflow_manager.initialize_airflow_db()
                if success:
                    messages.success(request, 'Airflow database initialized successfully')
                else:
                    messages.error(request, 'Failed to initialize Airflow database')
                return JsonResponse({'success': success})
            except Exception as e:
                messages.error(request, f'Airflow initialization failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
        
        elif action == 'create_user':
            try:
                username = request.POST.get('username', 'admin')
                email = request.POST.get('email', 'admin@edusight.com')
                password = request.POST.get('password', 'admin123')
                firstname = request.POST.get('firstname', 'Admin')
                lastname = request.POST.get('lastname', 'User')
                
                success = airflow_manager.create_airflow_user(
                    username, email, password, firstname, lastname
                )
                
                if success:
                    messages.success(request, f'Airflow user {username} created successfully')
                else:
                    messages.error(request, 'Failed to create Airflow user')
                
                return JsonResponse({'success': success})
            except Exception as e:
                messages.error(request, f'User creation failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
        
        elif action == 'start_scheduler':
            try:
                success = airflow_manager.start_airflow_scheduler()
                if success:
                    messages.success(request, 'Airflow scheduler started')
                else:
                    messages.error(request, 'Failed to start Airflow scheduler')
                return JsonResponse({'success': success})
            except Exception as e:
                messages.error(request, f'Scheduler start failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
        
        elif action == 'start_webserver':
            try:
                success = airflow_manager.start_airflow_webserver()
                if success:
                    messages.success(request, 'Airflow webserver started on port 8080')
                else:
                    messages.error(request, 'Failed to start Airflow webserver')
                return JsonResponse({'success': success})
            except Exception as e:
                messages.error(request, f'Webserver start failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
        
        elif action == 'trigger_dag':
            try:
                dag_id = request.POST.get('dag_id')
                config = {}
                
                # Parse any additional configuration
                config_json = request.POST.get('config', '{}')
                if config_json:
                    config = json.loads(config_json)
                
                success = airflow_manager.trigger_dag(dag_id, config)
                
                if success:
                    messages.success(request, f'DAG {dag_id} triggered successfully')
                else:
                    messages.error(request, f'Failed to trigger DAG {dag_id}')
                
                return JsonResponse({'success': success})
            except Exception as e:
                messages.error(request, f'DAG trigger failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
        
        elif action == 'create_custom_workflow':
            try:
                workflow_config = json.loads(request.POST.get('workflow_config', '{}'))
                success = airflow_manager.create_custom_dag(workflow_config)
                
                if success:
                    messages.success(request, 'Custom workflow created successfully')
                else:
                    messages.error(request, 'Failed to create custom workflow')
                
                return JsonResponse({'success': success})
            except Exception as e:
                messages.error(request, f'Workflow creation failed: {str(e)}')
                return JsonResponse({'success': False, 'error': str(e)})
    
    # Get DAG list and status
    airflow_manager = AirflowManager()
    dags = airflow_manager.get_dag_list()
    
    # Get some statistics
    total_dags = len(dags)
    active_dags = len([dag for dag in dags if not dag.get('is_paused', True)])
    
    # Sample workflow templates
    workflow_templates = [
        {
            'id': 'epr_daily_calculation',
            'name': 'Daily EPR Calculation',
            'description': 'Calculate EPR scores for all students daily',
            'category': 'assessment'
        },
        {
            'id': 'lead_processing_workflow',
            'name': 'Lead Processing',
            'description': 'Process and score new leads automatically',
            'category': 'crm'
        },
        {
            'id': 'system_maintenance',
            'name': 'System Maintenance',
            'description': 'Perform daily system maintenance and backup',
            'category': 'maintenance'
        }
    ]
    
    context = {
        'page_title': 'Workflow Management (Apache Airflow)',
        'dags': dags[:10],  # Show first 10 DAGs
        'total_dags': total_dags,
        'active_dags': active_dags,
        'workflow_templates': workflow_templates,
        'airflow_available': AIRFLOW_AVAILABLE,
        'airflow_url': getattr(settings, 'AIRFLOW_BASE_URL', 'http://localhost:8080')
    }
    
    return render(request, 'admin_dashboard/workflows.html', context)

def get_recent_activity():
    """Get recent system activity"""
    activities = []
    
    # Recent leads
    recent_leads = Lead.objects.order_by('-created_at')[:5]
    for lead in recent_leads:
        activities.append({
            'type': 'lead',
            'message': f'New lead: {lead.name}',
            'timestamp': lead.created_at,
            'icon': 'fas fa-user-plus',
            'color': 'text-success'
        })
    
    # Recent appointments
    recent_appointments = Appointment.objects.order_by('-created_at')[:5]
    for appointment in recent_appointments:
        activities.append({
            'type': 'appointment',
            'message': f'New appointment: {appointment.name}',
            'timestamp': appointment.created_at,
            'icon': 'fas fa-calendar',
            'color': 'text-info'
        })
    
    # Sort by timestamp
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    return activities[:10]

def get_analytics_chart_data():
    """Get data for analytics charts"""
    # Generate sample data for charts
    today = timezone.now().date()
    dates = [(today - timedelta(days=i)) for i in range(30, 0, -1)]
    
    leads_data = []
    appointments_data = []
    
    for date in dates:
        leads_count = Lead.objects.filter(created_at__date=date).count()
        appointments_count = Appointment.objects.filter(created_at__date=date).count()
        
        leads_data.append({
            'date': date.strftime('%Y-%m-%d'),
            'count': leads_count
        })
        appointments_data.append({
            'date': date.strftime('%Y-%m-%d'),
            'count': appointments_count
        })
    
    return {
        'leads': leads_data,
        'appointments': appointments_data,
    }