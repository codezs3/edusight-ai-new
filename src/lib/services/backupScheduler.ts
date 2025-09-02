import cron from 'node-cron';
import { prisma } from '@/lib/database/index';
import BackupService from './backupService';
import GoogleDriveService from './googleDriveService';

interface ScheduledBackup {
  id: string;
  name: string;
  schedulePattern: string;
  task?: cron.ScheduledTask;
}

class BackupScheduler {
  private scheduledBackups: Map<string, ScheduledBackup> = new Map();
  private backupService: BackupService;

  constructor() {
    this.backupService = new BackupService();
    this.initializeScheduledBackups();
  }

  // Initialize all active scheduled backups from database
  async initializeScheduledBackups(): Promise<void> {
    try {
      const activeConfigs = await prisma.backupConfiguration.findMany({
        where: {
          isActive: true,
          scheduleEnabled: true,
          schedulePattern: {
            not: null,
          },
        },
      });

      for (const config of activeConfigs) {
        if (config.schedulePattern) {
          this.scheduleBackup(config);
        }
      }

      console.log(`Initialized ${activeConfigs.length} scheduled backups`);
    } catch (error) {
      console.error('Error initializing scheduled backups:', error);
    }
  }

  // Schedule a backup based on configuration
  scheduleBackup(config: any): boolean {
    try {
      if (!cron.validate(config.schedulePattern)) {
        console.error(`Invalid cron pattern for backup ${config.name}: ${config.schedulePattern}`);
        return false;
      }

      // Stop existing task if it exists
      this.stopScheduledBackup(config.id);

      const task = cron.schedule(
        config.schedulePattern,
        async () => {
          await this.executeScheduledBackup(config);
        },
        {
          scheduled: true,
          timezone: 'UTC', // You might want to make this configurable
        }
      );

      const scheduledBackup: ScheduledBackup = {
        id: config.id,
        name: config.name,
        schedulePattern: config.schedulePattern,
        task,
      };

      this.scheduledBackups.set(config.id, scheduledBackup);

      console.log(`Scheduled backup '${config.name}' with pattern: ${config.schedulePattern}`);
      return true;
    } catch (error) {
      console.error(`Error scheduling backup ${config.name}:`, error);
      return false;
    }
  }

  // Execute a scheduled backup
  private async executeScheduledBackup(config: any): Promise<void> {
    console.log(`Executing scheduled backup: ${config.name}`);

    try {
      // Set up Google Drive service if needed
      let googleDriveService: GoogleDriveService | undefined;
      
      if (config.googleDriveFolder) {
        // In a real implementation, you'd need to securely store and retrieve the refresh token
        // For now, we'll skip Google Drive upload for scheduled backups
        console.log('Google Drive upload skipped for scheduled backup (refresh token needed)');
      }

      const backupService = new BackupService(googleDriveService);

      const result = await backupService.createBackup(
        'system', // System user for scheduled backups
        {
          includePrismaDb: config.includePrismaDb,
          includeUploads: config.includeUploads,
          includeConfig: config.includeConfig,
          includeLogs: false,
        },
        false, // Don't upload to Google Drive for scheduled backups without auth
        config.googleDriveFolder
      );

      if (result.success) {
        // Update last backup time
        await prisma.backupConfiguration.update({
          where: { id: config.id },
          data: { lastBackupAt: new Date() },
        });

        console.log(`Scheduled backup '${config.name}' completed successfully`);

        // Clean up old backups if retention policy is set
        if (config.retentionDays > 0) {
          const cleanupResult = await backupService.cleanupOldBackups(config.retentionDays);
          console.log(`Cleanup completed: ${cleanupResult.deletedCount} files deleted`);
        }
      } else {
        console.error(`Scheduled backup '${config.name}' failed:`, result.error);
      }
    } catch (error) {
      console.error(`Error executing scheduled backup ${config.name}:`, error);
    }
  }

  // Stop a scheduled backup
  stopScheduledBackup(configId: string): boolean {
    const scheduledBackup = this.scheduledBackups.get(configId);
    
    if (scheduledBackup && scheduledBackup.task) {
      scheduledBackup.task.stop();
      this.scheduledBackups.delete(configId);
      console.log(`Stopped scheduled backup: ${scheduledBackup.name}`);
      return true;
    }

    return false;
  }

  // Update a scheduled backup
  async updateScheduledBackup(configId: string): Promise<boolean> {
    try {
      const config = await prisma.backupConfiguration.findUnique({
        where: { id: configId },
      });

      if (!config) {
        console.error(`Backup configuration ${configId} not found`);
        return false;
      }

      // Stop existing schedule
      this.stopScheduledBackup(configId);

      // Start new schedule if enabled
      if (config.isActive && config.scheduleEnabled && config.schedulePattern) {
        return this.scheduleBackup(config);
      }

      return true;
    } catch (error) {
      console.error(`Error updating scheduled backup ${configId}:`, error);
      return false;
    }
  }

  // Get all scheduled backups
  getScheduledBackups(): ScheduledBackup[] {
    return Array.from(this.scheduledBackups.values()).map(backup => ({
      id: backup.id,
      name: backup.name,
      schedulePattern: backup.schedulePattern,
    }));
  }

  // Stop all scheduled backups
  stopAllScheduledBackups(): void {
    for (const [configId] of this.scheduledBackups) {
      this.stopScheduledBackup(configId);
    }
    console.log('All scheduled backups stopped');
  }

  // Validate cron pattern
  static validateCronPattern(pattern: string): boolean {
    return cron.validate(pattern);
  }

  // Get next execution times for a cron pattern
  static getNextExecutions(pattern: string, count = 5): Date[] {
    if (!cron.validate(pattern)) {
      return [];
    }

    const nextExecutions: Date[] = [];
    let currentDate = new Date();

    // This is a simplified implementation
    // In a real-world scenario, you'd use a proper cron parser
    for (let i = 0; i < count; i++) {
      // Add 1 hour as a placeholder - implement proper cron calculation
      currentDate = new Date(currentDate.getTime() + 60 * 60 * 1000);
      nextExecutions.push(new Date(currentDate));
    }

    return nextExecutions;
  }
}

// Create a singleton instance
const backupScheduler = new BackupScheduler();

export default backupScheduler;
export { BackupScheduler };
