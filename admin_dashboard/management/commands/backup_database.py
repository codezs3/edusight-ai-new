"""
Django management command for database backup functionality.
Supports multiple database backends and compression options.
"""

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.utils import timezone
from django.core.management import call_command
from django.db import connections
import os
import subprocess
import gzip
import shutil
import json
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Create a backup of the database with multiple format options'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--output-dir',
            type=str,
            default='backups',
            help='Directory to store backup files (default: backups)'
        )
        
        parser.add_argument(
            '--format',
            type=str,
            choices=['json', 'sql', 'compressed'],
            default='json',
            help='Backup format: json (Django fixture), sql (raw SQL), compressed (gzipped json)'
        )
        
        parser.add_argument(
            '--database',
            type=str,
            default='default',
            help='Database alias to backup (default: default)'
        )
        
        parser.add_argument(
            '--exclude-apps',
            nargs='*',
            default=['sessions', 'admin', 'contenttypes', 'auth.Permission'],
            help='Apps to exclude from backup'
        )
        
        parser.add_argument(
            '--cleanup-days',
            type=int,
            default=30,
            help='Delete backups older than N days (default: 30, 0 to disable)'
        )
        
        parser.add_argument(
            '--include-media',
            action='store_true',
            help='Include media files in backup'
        )
        
        parser.add_argument(
            '--encrypt',
            action='store_true',
            help='Encrypt backup file (requires cryptography package)'
        )
    
    def handle(self, *args, **options):
        """Execute the backup command."""
        try:
            self.stdout.write(
                self.style.SUCCESS('Starting database backup...')
            )
            
            # Create backup directory
            backup_dir = self._create_backup_directory(options['output_dir'])
            
            # Generate backup filename
            timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
            backup_filename = f"edusight_backup_{timestamp}"
            
            # Perform backup based on format
            backup_file = None
            if options['format'] == 'json':
                backup_file = self._create_json_backup(
                    backup_dir, backup_filename, options
                )
            elif options['format'] == 'sql':
                backup_file = self._create_sql_backup(
                    backup_dir, backup_filename, options
                )
            elif options['format'] == 'compressed':
                backup_file = self._create_compressed_backup(
                    backup_dir, backup_filename, options
                )
            
            # Include media files if requested
            if options['include_media']:
                media_backup = self._backup_media_files(backup_dir, timestamp)
                self.stdout.write(
                    self.style.SUCCESS(f'Media backup created: {media_backup}')
                )
            
            # Encrypt backup if requested
            if options['encrypt'] and backup_file:
                backup_file = self._encrypt_backup(backup_file)
            
            # Create backup metadata
            metadata_file = self._create_backup_metadata(
                backup_dir, timestamp, backup_file, options
            )
            
            # Cleanup old backups
            if options['cleanup_days'] > 0:
                self._cleanup_old_backups(backup_dir, options['cleanup_days'])
            
            # Generate backup report
            backup_size = os.path.getsize(backup_file) if backup_file else 0
            backup_size_mb = backup_size / (1024 * 1024)
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'\nBackup completed successfully!\n'
                    f'File: {backup_file}\n'
                    f'Size: {backup_size_mb:.2f} MB\n'
                    f'Format: {options["format"]}\n'
                    f'Database: {options["database"]}\n'
                    f'Metadata: {metadata_file}'
                )
            )
            
            return backup_file
            
        except Exception as e:
            raise CommandError(f'Backup failed: {str(e)}')
    
    def _create_backup_directory(self, output_dir):
        """Create backup directory if it doesn't exist."""
        backup_dir = os.path.join(settings.BASE_DIR, output_dir)
        os.makedirs(backup_dir, exist_ok=True)
        return backup_dir
    
    def _create_json_backup(self, backup_dir, filename, options):
        """Create JSON format backup using Django's dumpdata."""
        backup_file = os.path.join(backup_dir, f"{filename}.json")
        
        # Prepare exclude list
        exclude_list = []
        for app in options['exclude_apps']:
            exclude_list.extend(['--exclude', app])
        
        # Create the backup
        with open(backup_file, 'w') as f:
            call_command(
                'dumpdata',
                '--database', options['database'],
                '--format', 'json',
                '--indent', 2,
                *exclude_list,
                stdout=f
            )
        
        return backup_file
    
    def _create_sql_backup(self, backup_dir, filename, options):
        """Create SQL backup using database-specific tools."""
        backup_file = os.path.join(backup_dir, f"{filename}.sql")
        
        db_config = settings.DATABASES[options['database']]
        engine = db_config['ENGINE']
        
        if 'postgresql' in engine:
            return self._create_postgresql_backup(backup_file, db_config)
        elif 'mysql' in engine:
            return self._create_mysql_backup(backup_file, db_config)
        elif 'sqlite' in engine:
            return self._create_sqlite_backup(backup_file, db_config)
        else:
            raise CommandError(f'SQL backup not supported for {engine}')
    
    def _create_postgresql_backup(self, backup_file, db_config):
        """Create PostgreSQL backup using pg_dump."""
        cmd = [
            'pg_dump',
            '--host', db_config.get('HOST', 'localhost'),
            '--port', str(db_config.get('PORT', 5432)),
            '--username', db_config['USER'],
            '--dbname', db_config['NAME'],
            '--no-password',
            '--clean',
            '--create',
            '--file', backup_file
        ]
        
        env = os.environ.copy()
        env['PGPASSWORD'] = db_config['PASSWORD']
        
        result = subprocess.run(cmd, env=env, capture_output=True, text=True)
        
        if result.returncode != 0:
            raise CommandError(f'PostgreSQL backup failed: {result.stderr}')
        
        return backup_file
    
    def _create_mysql_backup(self, backup_file, db_config):
        """Create MySQL backup using mysqldump."""
        cmd = [
            'mysqldump',
            f'--host={db_config.get("HOST", "localhost")}',
            f'--port={db_config.get("PORT", 3306)}',
            f'--user={db_config["USER"]}',
            f'--password={db_config["PASSWORD"]}',
            '--single-transaction',
            '--routines',
            '--triggers',
            db_config['NAME']
        ]
        
        with open(backup_file, 'w') as f:
            result = subprocess.run(cmd, stdout=f, stderr=subprocess.PIPE, text=True)
        
        if result.returncode != 0:
            raise CommandError(f'MySQL backup failed: {result.stderr}')
        
        return backup_file
    
    def _create_sqlite_backup(self, backup_file, db_config):
        """Create SQLite backup by copying the database file."""
        db_path = db_config['NAME']
        
        if not os.path.exists(db_path):
            raise CommandError(f'SQLite database not found: {db_path}')
        
        shutil.copy2(db_path, backup_file)
        return backup_file
    
    def _create_compressed_backup(self, backup_dir, filename, options):
        """Create compressed JSON backup."""
        json_file = self._create_json_backup(backup_dir, filename, options)
        compressed_file = f"{json_file}.gz"
        
        with open(json_file, 'rb') as f_in:
            with gzip.open(compressed_file, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        # Remove uncompressed file
        os.remove(json_file)
        
        return compressed_file
    
    def _backup_media_files(self, backup_dir, timestamp):
        """Create backup of media files."""
        media_backup_file = os.path.join(backup_dir, f"media_backup_{timestamp}.tar.gz")
        
        if os.path.exists(settings.MEDIA_ROOT):
            cmd = [
                'tar', '-czf', media_backup_file,
                '-C', os.path.dirname(settings.MEDIA_ROOT),
                os.path.basename(settings.MEDIA_ROOT)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode != 0:
                self.stdout.write(
                    self.style.WARNING(f'Media backup failed: {result.stderr}')
                )
                return None
        else:
            self.stdout.write(
                self.style.WARNING('Media directory not found, skipping media backup')
            )
            return None
        
        return media_backup_file
    
    def _encrypt_backup(self, backup_file):
        """Encrypt backup file using Fernet encryption."""
        try:
            from cryptography.fernet import Fernet
        except ImportError:
            self.stdout.write(
                self.style.WARNING(
                    'Cryptography package not found, skipping encryption'
                )
            )
            return backup_file
        
        # Generate or load encryption key
        key_file = os.path.join(os.path.dirname(backup_file), 'backup.key')
        
        if os.path.exists(key_file):
            with open(key_file, 'rb') as f:
                key = f.read()
        else:
            key = Fernet.generate_key()
            with open(key_file, 'wb') as f:
                f.write(key)
            self.stdout.write(
                self.style.WARNING(f'New encryption key generated: {key_file}')
            )
        
        # Encrypt the backup
        fernet = Fernet(key)
        encrypted_file = f"{backup_file}.encrypted"
        
        with open(backup_file, 'rb') as f_in:
            with open(encrypted_file, 'wb') as f_out:
                f_out.write(fernet.encrypt(f_in.read()))
        
        # Remove unencrypted file
        os.remove(backup_file)
        
        return encrypted_file
    
    def _create_backup_metadata(self, backup_dir, timestamp, backup_file, options):
        """Create metadata file for the backup."""
        metadata = {
            'timestamp': timestamp,
            'created_at': timezone.now().isoformat(),
            'backup_file': os.path.basename(backup_file) if backup_file else None,
            'format': options['format'],
            'database': options['database'],
            'excluded_apps': options['exclude_apps'],
            'django_version': self._get_django_version(),
            'python_version': self._get_python_version(),
            'database_engine': settings.DATABASES[options['database']]['ENGINE'],
            'file_size': os.path.getsize(backup_file) if backup_file else 0,
            'include_media': options['include_media'],
            'encrypted': options['encrypt'],
        }
        
        metadata_file = os.path.join(backup_dir, f"backup_metadata_{timestamp}.json")
        
        with open(metadata_file, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        return metadata_file
    
    def _cleanup_old_backups(self, backup_dir, cleanup_days):
        """Remove backup files older than specified days."""
        cutoff_date = timezone.now() - timedelta(days=cleanup_days)
        
        for filename in os.listdir(backup_dir):
            file_path = os.path.join(backup_dir, filename)
            
            if os.path.isfile(file_path):
                file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
                file_mtime = timezone.make_aware(file_mtime)
                
                if file_mtime < cutoff_date:
                    os.remove(file_path)
                    self.stdout.write(
                        self.style.SUCCESS(f'Removed old backup: {filename}')
                    )
    
    def _get_django_version(self):
        """Get Django version."""
        import django
        return django.get_version()
    
    def _get_python_version(self):
        """Get Python version."""
        import sys
        return f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
