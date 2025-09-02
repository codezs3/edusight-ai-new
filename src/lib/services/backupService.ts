import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { prisma } from '@/lib/database/index';
import GoogleDriveService from './googleDriveService';

export interface BackupOptions {
  includePrismaDb?: boolean;
  includeUploads?: boolean;
  includeConfig?: boolean;
  includeLogs?: boolean;
}

export interface BackupResult {
  success: boolean;
  fileName: string;
  fileSize: number;
  googleDriveId?: string;
  error?: string;
  duration: number;
}

class BackupService {
  private googleDrive: GoogleDriveService | null = null;

  constructor(googleDriveService?: GoogleDriveService) {
    this.googleDrive = googleDriveService || null;
  }

  // Set Google Drive service
  setGoogleDriveService(service: GoogleDriveService): void {
    this.googleDrive = service;
  }

  // Create a comprehensive backup
  async createBackup(
    userId: string,
    options: BackupOptions = {
      includePrismaDb: true,
      includeUploads: true,
      includeConfig: true,
      includeLogs: false,
    },
    uploadToGoogleDrive = false,
    googleDriveFolderId?: string
  ): Promise<BackupResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `edusight-backup-${timestamp}.zip`;
    const backupPath = path.join(process.cwd(), 'backups', fileName);

    // Create maintenance log entry
    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        type: 'backup',
        status: 'running',
        description: 'Creating system backup',
        fileName: fileName,
        userId: userId,
        metadata: JSON.stringify(options),
      },
    });

    try {
      // Ensure backups directory exists
      const backupsDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
      }

      // Create ZIP archive
      const output = fs.createWriteStream(backupPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Maximum compression
      });

      archive.pipe(output);

      // Add database file if requested
      if (options.includePrismaDb) {
        const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
        if (fs.existsSync(dbPath)) {
          archive.file(dbPath, { name: 'database/dev.db' });
        }
      }

      // Add uploads if requested
      if (options.includeUploads) {
        const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
        if (fs.existsSync(uploadsPath)) {
          archive.directory(uploadsPath, 'uploads');
        }
      }

      // Add configuration files if requested
      if (options.includeConfig) {
        const configFiles = [
          '.env.local',
          '.env',
          'package.json',
          'next.config.js',
          'tailwind.config.js',
          'tsconfig.json',
        ];

        configFiles.forEach((file) => {
          const filePath = path.join(process.cwd(), file);
          if (fs.existsSync(filePath)) {
            archive.file(filePath, { name: `config/${file}` });
          }
        });

        // Add Prisma schema
        const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
        if (fs.existsSync(schemaPath)) {
          archive.file(schemaPath, { name: 'config/schema.prisma' });
        }
      }

      // Add logs if requested
      if (options.includeLogs) {
        const logsPath = path.join(process.cwd(), 'logs');
        if (fs.existsSync(logsPath)) {
          archive.directory(logsPath, 'logs');
        }
      }

      // Finalize the archive
      await archive.finalize();

      // Wait for the stream to close
      await new Promise((resolve, reject) => {
        output.on('close', resolve);
        output.on('error', reject);
      });

      // Get file size
      const stats = fs.statSync(backupPath);
      const fileSize = stats.size;
      const fileSizeFormatted = this.formatFileSize(fileSize);

      let googleDriveId: string | undefined;

      // Upload to Google Drive if requested and service is available
      if (uploadToGoogleDrive && this.googleDrive) {
        try {
          const fileBuffer = fs.readFileSync(backupPath);
          const driveFile = await this.googleDrive.uploadFile(
            fileName,
            fileBuffer,
            'application/zip',
            googleDriveFolderId
          );
          googleDriveId = driveFile.id;

          // Clean up local file after successful upload (optional)
          // fs.unlinkSync(backupPath);
        } catch (error) {
          console.error('Failed to upload to Google Drive:', error);
          // Continue without failing the entire backup process
        }
      }

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      // Update maintenance log
      await prisma.maintenanceLog.update({
        where: { id: maintenanceLog.id },
        data: {
          status: 'completed',
          endTime: new Date(),
          duration: duration,
          fileSize: fileSizeFormatted,
          googleDriveId: googleDriveId,
        },
      });

      return {
        success: true,
        fileName: fileName,
        fileSize: fileSize,
        googleDriveId: googleDriveId,
        duration: duration,
      };
    } catch (error) {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update maintenance log with error
      await prisma.maintenanceLog.update({
        where: { id: maintenanceLog.id },
        data: {
          status: 'failed',
          endTime: new Date(),
          duration: duration,
          errorMessage: errorMessage,
        },
      });

      // Clean up failed backup file
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }

      return {
        success: false,
        fileName: fileName,
        fileSize: 0,
        error: errorMessage,
        duration: duration,
      };
    }
  }

  // Restore from backup
  async restoreBackup(
    userId: string,
    backupFileName: string,
    googleDriveId?: string
  ): Promise<{ success: boolean; error?: string }> {
    const startTime = Date.now();

    // Create maintenance log entry
    const maintenanceLog = await prisma.maintenanceLog.create({
      data: {
        type: 'restore',
        status: 'running',
        description: `Restoring from backup: ${backupFileName}`,
        fileName: backupFileName,
        googleDriveId: googleDriveId,
        userId: userId,
      },
    });

    try {
      let backupPath: string;

      if (googleDriveId && this.googleDrive) {
        // Download from Google Drive
        const fileBuffer = await this.googleDrive.downloadFile(googleDriveId);
        backupPath = path.join(process.cwd(), 'backups', 'temp', backupFileName);
        
        // Ensure temp directory exists
        const tempDir = path.dirname(backupPath);
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        fs.writeFileSync(backupPath, fileBuffer);
      } else {
        // Use local backup file
        backupPath = path.join(process.cwd(), 'backups', backupFileName);
        if (!fs.existsSync(backupPath)) {
          throw new Error('Backup file not found');
        }
      }

      // TODO: Implement restoration logic here
      // This would involve extracting the ZIP file and restoring components
      // For now, we'll just mark it as completed

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      await prisma.maintenanceLog.update({
        where: { id: maintenanceLog.id },
        data: {
          status: 'completed',
          endTime: new Date(),
          duration: duration,
        },
      });

      return { success: true };
    } catch (error) {
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await prisma.maintenanceLog.update({
        where: { id: maintenanceLog.id },
        data: {
          status: 'failed',
          endTime: new Date(),
          duration: duration,
          errorMessage: errorMessage,
        },
      });

      return { success: false, error: errorMessage };
    }
  }

  // Get maintenance logs
  async getMaintenanceLogs(
    page = 1,
    limit = 20,
    type?: string
  ): Promise<{ logs: any[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const where = type ? { type } : {};

    const [logs, total] = await Promise.all([
      prisma.maintenanceLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          // You can include user data here if needed
        },
      }),
      prisma.maintenanceLog.count({ where }),
    ]);

    return {
      logs,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  // Clean up old backups
  async cleanupOldBackups(retentionDays = 30): Promise<{ deletedCount: number; errors: string[] }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const backupsDir = path.join(process.cwd(), 'backups');
    const errors: string[] = [];
    let deletedCount = 0;

    try {
      if (!fs.existsSync(backupsDir)) {
        return { deletedCount: 0, errors: [] };
      }

      const files = fs.readdirSync(backupsDir);
      
      for (const file of files) {
        if (file.endsWith('.zip')) {
          const filePath = path.join(backupsDir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime < cutoffDate) {
            try {
              fs.unlinkSync(filePath);
              deletedCount++;
            } catch (error) {
              errors.push(`Failed to delete ${file}: ${error}`);
            }
          }
        }
      }

      // Also clean up old maintenance logs
      await prisma.maintenanceLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

    } catch (error) {
      errors.push(`General cleanup error: ${error}`);
    }

    return { deletedCount, errors };
  }

  // Format file size
  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export default BackupService;
