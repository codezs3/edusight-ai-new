# EduSight Maintenance Module Documentation

## 🛠️ Overview

The Maintenance Module provides comprehensive system backup, restoration, and maintenance functionality with Google Drive integration for the EduSight platform.

## ✨ Features

### 1. **Automated Backup System**
- **Database Backup**: SQLite database with full data preservation
- **File Backup**: Uploaded files, configuration files, and system logs
- **Compression**: ZIP archives with maximum compression
- **Scheduling**: Cron-based automated backups
- **Retention Policy**: Automatic cleanup of old backups

### 2. **Google Drive Integration**
- **OAuth2 Authentication**: Secure Google Drive access
- **Folder Management**: Create and select backup folders
- **Automatic Upload**: Direct backup upload to Google Drive
- **Storage Monitoring**: Drive quota and usage tracking

### 3. **Maintenance Logging**
- **Comprehensive Logs**: All maintenance activities tracked
- **Status Monitoring**: Real-time backup/restore status
- **Error Handling**: Detailed error messages and recovery
- **Performance Metrics**: Duration, file sizes, and timing data

### 4. **Admin Dashboard UI**
- **Visual Interface**: Intuitive backup configuration
- **Real-time Status**: Live monitoring of operations
- **History View**: Paginated maintenance logs
- **Quick Actions**: One-click backup creation

## 🚀 Setup Instructions

### 1. **Environment Configuration**

Add the following to your `.env.local` file:

```env
# Google Drive API Configuration
GOOGLE_DRIVE_CLIENT_ID="your-google-client-id"
GOOGLE_DRIVE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_DRIVE_REDIRECT_URI="http://localhost:3000/auth/google-drive/callback"
```

### 2. **Google Drive API Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google Drive API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google-drive/callback`
   - `https://yourdomain.com/auth/google-drive/callback`

### 3. **Database Schema**

The module automatically creates the following tables:
- `maintenance_logs`: Tracks all maintenance operations
- `backup_configurations`: Stores backup settings and schedules

## 📋 Usage Guide

### **Access the Maintenance Module**

1. Login as an **Admin** user
2. Navigate to **Dashboard → Admin → System Maintenance**
3. The maintenance interface will load with backup options

### **Google Drive Authentication**

1. Click "Connect Google Drive" in the maintenance dashboard
2. Complete OAuth2 flow in popup window
3. Select backup folder from dropdown
4. System will store refresh token for future use

### **Creating Backups**

1. **Configure Backup Options:**
   - ✅ Include Database (SQLite file)
   - ✅ Include Uploaded Files (user uploads)
   - ✅ Include Configuration (env, configs)
   - ⬜ Include System Logs (optional)
   - ⬜ Upload to Google Drive (if authenticated)

2. **Execute Backup:**
   - Click "Create Backup Now"
   - Monitor progress in real-time
   - View completion status in logs

### **Viewing Maintenance Logs**

- **All Operations**: View complete maintenance history
- **Filter by Type**: backup, restore, cleanup, update
- **Status Indicators**: pending, running, completed, failed
- **Detailed Information**: file sizes, duration, errors
- **Google Drive Links**: Direct access to uploaded backups

## 🔧 API Endpoints

### **Authentication**
```http
GET  /api/admin/maintenance/google-auth
POST /api/admin/maintenance/google-auth
```

### **Backup Operations**
```http
POST /api/admin/maintenance/backup
GET  /api/admin/maintenance/backup
```

### **Google Drive Management**
```http
GET  /api/admin/maintenance/google-drive/folders
POST /api/admin/maintenance/google-drive/folders
```

## 📁 File Structure

```
src/
├── app/
│   ├── api/admin/maintenance/
│   │   ├── backup/route.ts
│   │   ├── google-auth/route.ts
│   │   └── google-drive/folders/route.ts
│   ├── auth/google-drive/callback/page.tsx
│   └── dashboard/admin/maintenance/page.tsx
├── lib/services/
│   ├── backupService.ts
│   ├── googleDriveService.ts
│   └── backupScheduler.ts
└── prisma/schema.prisma (updated)
```

## 🗄️ Database Schema

### **MaintenanceLog**
```sql
- id: String (Primary Key)
- type: String (backup, restore, cleanup, update)
- status: String (pending, running, completed, failed)
- description: String (optional)
- startTime: DateTime
- endTime: DateTime (optional)
- duration: Int (seconds)
- fileSize: String (formatted size)
- fileName: String (backup filename)
- googleDriveId: String (Drive file ID)
- errorMessage: String (if failed)
- userId: String (admin who initiated)
- metadata: String (JSON configuration)
```

### **BackupConfiguration**
```sql
- id: String (Primary Key)
- name: String (configuration name)
- description: String (optional)
- scheduleEnabled: Boolean
- schedulePattern: String (cron pattern)
- retentionDays: Int (cleanup policy)
- includePrismaDb: Boolean
- includeUploads: Boolean
- includeConfig: Boolean
- googleDriveFolder: String (folder ID)
- isActive: Boolean
- lastBackupAt: DateTime
- createdBy: String (admin user)
```

## 🔒 Security Features

### **Access Control**
- **Admin-Only Access**: Role-based authentication required
- **Session Validation**: Server-side session verification
- **API Protection**: All endpoints require admin privileges

### **Data Protection**
- **Secure Storage**: Encrypted file handling
- **OAuth2 Security**: Google Drive authentication via OAuth2
- **Token Management**: Secure refresh token storage
- **Audit Trail**: Complete activity logging

## 🚨 Error Handling

### **Common Issues**

1. **Google Drive Authentication Failed**
   - Check API credentials
   - Verify redirect URI configuration
   - Ensure Drive API is enabled

2. **Backup Creation Failed**
   - Check file permissions
   - Verify disk space availability
   - Review error logs

3. **Upload Failed**
   - Validate Google Drive authentication
   - Check network connectivity
   - Verify folder permissions

### **Troubleshooting Steps**

1. **Check Logs**: Review maintenance logs for error details
2. **Verify Permissions**: Ensure admin role assignment
3. **Test Authentication**: Re-authenticate Google Drive
4. **Check Storage**: Verify local and Drive storage space
5. **Review Configuration**: Validate environment variables

## 📊 Backup File Contents

### **Backup ZIP Structure**
```
edusight-backup-YYYY-MM-DD-HHMMSS.zip
├── database/
│   └── dev.db (SQLite database)
├── uploads/ (user uploaded files)
├── config/
│   ├── .env.local
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── schema.prisma
└── logs/ (optional system logs)
```

## 🔄 Automated Scheduling

### **Cron Pattern Examples**
- `0 2 * * *` - Daily at 2:00 AM
- `0 2 * * 0` - Weekly on Sunday at 2:00 AM
- `0 2 1 * *` - Monthly on 1st at 2:00 AM
- `0 */6 * * *` - Every 6 hours

### **Scheduled Backup Features**
- **Automatic Execution**: Cron-based scheduling
- **Retention Management**: Automatic cleanup
- **Error Notification**: Failed backup alerts
- **Status Tracking**: Execution history

## 📈 Performance Considerations

### **Optimization Features**
- **Compression**: Maximum ZIP compression
- **Selective Backup**: Choose specific components
- **Async Processing**: Non-blocking operations
- **Progress Tracking**: Real-time status updates

### **Storage Management**
- **Local Cleanup**: Automatic old file removal
- **Drive Upload**: Optional cloud storage
- **Size Monitoring**: File size tracking
- **Quota Management**: Storage limit awareness

## 🔮 Future Enhancements

### **Planned Features**
- **Automated Restore**: One-click system restoration
- **Backup Encryption**: AES-256 file encryption
- **Multi-Cloud Support**: AWS S3, Azure Blob integration
- **Email Notifications**: Backup status alerts
- **Backup Verification**: Integrity checking
- **Incremental Backups**: Delta-based backups

### **Advanced Features**
- **Database Replication**: Real-time data sync
- **Disaster Recovery**: Complete system recovery
- **Performance Monitoring**: Backup performance metrics
- **Custom Scheduling**: Advanced cron configurations

## 📞 Support

For technical support or questions:
- Review maintenance logs for error details
- Check environment configuration
- Verify Google Drive API setup
- Ensure proper admin permissions

---

**Built with ❤️ for EduSight Platform**
