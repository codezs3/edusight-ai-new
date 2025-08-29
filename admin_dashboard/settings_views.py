"""
Settings management views for the admin dashboard.
Handles system configuration, backup management, and various settings.
"""

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.management import call_command
from django.utils import timezone
from django.core.cache import cache
import os
import json
import subprocess
from datetime import datetime, timedelta
import tempfile


def is_admin_user(user):
    """Check if user is admin."""
    return user.is_authenticated and (user.is_superuser or user.role == 'admin')


@login_required
@user_passes_test(is_admin_user)
def settings_overview(request):
    """Settings overview page."""
    
    # Get system information
    system_info = {
        'django_version': get_django_version(),
        'python_version': get_python_version(),
        'database_engine': settings.DATABASES['default']['ENGINE'],
        'debug_mode': settings.DEBUG,
        'allowed_hosts': settings.ALLOWED_HOSTS,
        'time_zone': settings.TIME_ZONE,
        'language_code': settings.LANGUAGE_CODE,
        'media_root': settings.MEDIA_ROOT,
        'static_root': getattr(settings, 'STATIC_ROOT', 'Not set'),
    }
    
    # Get backup information
    backup_info = get_backup_info()
    
    # Get cache information
    cache_info = get_cache_info()
    
    context = {
        'system_info': system_info,
        'backup_info': backup_info,
        'cache_info': cache_info,
    }
    
    return render(request, 'admin_dashboard/settings/overview.html', context)


@login_required
@user_passes_test(is_admin_user)
def database_settings(request):
    """Database settings and backup management."""
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'create_backup':
            try:
                backup_format = request.POST.get('format', 'json')
                include_media = request.POST.get('include_media') == 'on'
                
                # Create backup
                backup_file = create_database_backup(backup_format, include_media)
                
                messages.success(request, f'Database backup created successfully: {backup_file}')
                
            except Exception as e:
                messages.error(request, f'Backup failed: {str(e)}')
        
        elif action == 'cleanup_backups':
            try:
                days = int(request.POST.get('cleanup_days', 30))
                cleanup_old_backups(days)
                messages.success(request, f'Old backups cleaned up (older than {days} days)')
                
            except Exception as e:
                messages.error(request, f'Cleanup failed: {str(e)}')
        
        return redirect('admin_dashboard:database_settings')
    
    # Get backup list
    backups = get_backup_list()
    
    context = {
        'backups': backups,
    }
    
    return render(request, 'admin_dashboard/settings/database.html', context)


@login_required
@user_passes_test(is_admin_user)
def system_settings(request):
    """System configuration settings."""
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'clear_cache':
            try:
                cache.clear()
                messages.success(request, 'System cache cleared successfully')
            except Exception as e:
                messages.error(request, f'Cache clear failed: {str(e)}')
        
        elif action == 'restart_server':
            try:
                # This would typically require supervisor or systemd integration
                messages.info(request, 'Server restart command sent (manual restart may be required)')
            except Exception as e:
                messages.error(request, f'Server restart failed: {str(e)}')
        
        elif action == 'update_settings':
            try:
                # Handle settings updates
                update_system_settings(request.POST)
                messages.success(request, 'System settings updated successfully')
            except Exception as e:
                messages.error(request, f'Settings update failed: {str(e)}')
        
        return redirect('admin_dashboard:system_settings')
    
    # Get current settings
    current_settings = get_current_settings()
    
    context = {
        'current_settings': current_settings,
    }
    
    return render(request, 'admin_dashboard/settings/system.html', context)


@login_required
@user_passes_test(is_admin_user)
def backup_download(request, backup_name):
    """Download backup file."""
    
    backup_dir = os.path.join(settings.BASE_DIR, 'backups')
    backup_path = os.path.join(backup_dir, backup_name)
    
    if not os.path.exists(backup_path):
        messages.error(request, 'Backup file not found')
        return redirect('admin_dashboard:database_settings')
    
    # Security check - ensure file is in backup directory
    if not backup_path.startswith(backup_dir):
        messages.error(request, 'Invalid backup file')
        return redirect('admin_dashboard:database_settings')
    
    try:
        response = FileResponse(
            open(backup_path, 'rb'),
            as_attachment=True,
            filename=backup_name
        )
        return response
    except Exception as e:
        messages.error(request, f'Download failed: {str(e)}')
        return redirect('admin_dashboard:database_settings')


@login_required
@user_passes_test(is_admin_user)
@csrf_exempt
def backup_api(request):
    """API endpoint for backup operations."""
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')
            
            if action == 'create_backup':
                backup_format = data.get('format', 'json')
                include_media = data.get('include_media', False)
                
                backup_file = create_database_backup(backup_format, include_media)
                
                return JsonResponse({
                    'status': 'success',
                    'message': 'Backup created successfully',
                    'backup_file': backup_file
                })
            
            elif action == 'delete_backup':
                backup_name = data.get('backup_name')
                
                backup_dir = os.path.join(settings.BASE_DIR, 'backups')
                backup_path = os.path.join(backup_dir, backup_name)
                
                if os.path.exists(backup_path) and backup_path.startswith(backup_dir):
                    os.remove(backup_path)
                    return JsonResponse({
                        'status': 'success',
                        'message': 'Backup deleted successfully'
                    })
                else:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'Backup file not found'
                    })
            
            elif action == 'get_backup_info':
                backups = get_backup_list()
                return JsonResponse({
                    'status': 'success',
                    'backups': backups
                })
            
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid action'
                })
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            })
    
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'})


# Helper functions

def get_django_version():
    """Get Django version."""
    import django
    return django.get_version()


def get_python_version():
    """Get Python version."""
    import sys
    return f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"


def get_backup_info():
    """Get backup information."""
    backup_dir = os.path.join(settings.BASE_DIR, 'backups')
    
    if not os.path.exists(backup_dir):
        return {
            'total_backups': 0,
            'total_size': 0,
            'latest_backup': None,
        }
    
    backups = []
    total_size = 0
    
    for filename in os.listdir(backup_dir):
        file_path = os.path.join(backup_dir, filename)
        if os.path.isfile(file_path):
            stat = os.stat(file_path)
            backups.append({
                'name': filename,
                'size': stat.st_size,
                'created': datetime.fromtimestamp(stat.st_mtime),
            })
            total_size += stat.st_size
    
    backups.sort(key=lambda x: x['created'], reverse=True)
    
    return {
        'total_backups': len(backups),
        'total_size': total_size,
        'latest_backup': backups[0] if backups else None,
    }


def get_cache_info():
    """Get cache information."""
    try:
        cache_stats = cache._cache.get_stats() if hasattr(cache._cache, 'get_stats') else {}
        return {
            'backend': settings.CACHES['default']['BACKEND'],
            'location': settings.CACHES['default'].get('LOCATION', 'N/A'),
            'stats': cache_stats,
        }
    except:
        return {
            'backend': 'Unknown',
            'location': 'N/A',
            'stats': {},
        }


def get_backup_list():
    """Get list of available backups."""
    backup_dir = os.path.join(settings.BASE_DIR, 'backups')
    
    if not os.path.exists(backup_dir):
        return []
    
    backups = []
    
    for filename in os.listdir(backup_dir):
        file_path = os.path.join(backup_dir, filename)
        if os.path.isfile(file_path):
            stat = os.stat(file_path)
            
            # Try to load metadata if available
            metadata_file = file_path.replace('.json', '_metadata.json').replace('.sql', '_metadata.json').replace('.gz', '_metadata.json')
            metadata = {}
            
            if os.path.exists(metadata_file):
                try:
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                except:
                    pass
            
            backups.append({
                'name': filename,
                'size': stat.st_size,
                'size_mb': stat.st_size / (1024 * 1024),
                'created': datetime.fromtimestamp(stat.st_mtime),
                'format': metadata.get('format', 'unknown'),
                'database': metadata.get('database', 'default'),
                'encrypted': metadata.get('encrypted', False),
                'include_media': metadata.get('include_media', False),
            })
    
    return sorted(backups, key=lambda x: x['created'], reverse=True)


def create_database_backup(backup_format='json', include_media=False):
    """Create database backup."""
    
    # Use management command
    backup_args = [
        '--format', backup_format,
        '--output-dir', 'backups',
    ]
    
    if include_media:
        backup_args.append('--include-media')
    
    try:
        output = call_command('backup_database', *backup_args)
        return output
    except Exception as e:
        raise Exception(f'Backup creation failed: {str(e)}')


def cleanup_old_backups(days=30):
    """Clean up old backup files."""
    
    backup_dir = os.path.join(settings.BASE_DIR, 'backups')
    
    if not os.path.exists(backup_dir):
        return
    
    cutoff_date = datetime.now() - timedelta(days=days)
    
    for filename in os.listdir(backup_dir):
        file_path = os.path.join(backup_dir, filename)
        if os.path.isfile(file_path):
            file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
            
            if file_mtime < cutoff_date:
                os.remove(file_path)


def get_current_settings():
    """Get current system settings."""
    
    return {
        'debug': settings.DEBUG,
        'allowed_hosts': settings.ALLOWED_HOSTS,
        'time_zone': settings.TIME_ZONE,
        'language_code': settings.LANGUAGE_CODE,
        'use_tz': settings.USE_TZ,
        'use_i18n': settings.USE_I18N,
        'media_url': settings.MEDIA_URL,
        'static_url': settings.STATIC_URL,
        'session_expire_at_browser_close': settings.SESSION_EXPIRE_AT_BROWSER_CLOSE,
        'session_cookie_age': settings.SESSION_COOKIE_AGE,
        'csrf_cookie_secure': getattr(settings, 'CSRF_COOKIE_SECURE', False),
        'session_cookie_secure': getattr(settings, 'SESSION_COOKIE_SECURE', False),
    }


def update_system_settings(post_data):
    """Update system settings (limited to runtime changeable settings)."""
    
    # This function would typically update a settings file or database
    # For security reasons, we'll only allow certain runtime settings
    
    updatable_settings = {
        'SESSION_COOKIE_AGE': int,
        'SESSION_EXPIRE_AT_BROWSER_CLOSE': bool,
    }
    
    for setting, type_cast in updatable_settings.items():
        value = post_data.get(setting.lower())
        if value is not None:
            try:
                if type_cast == bool:
                    value = value.lower() in ('true', '1', 'on', 'yes')
                else:
                    value = type_cast(value)
                
                # Update runtime setting (this would persist to database in production)
                setattr(settings, setting, value)
                
            except (ValueError, TypeError):
                continue
