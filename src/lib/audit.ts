export interface AuditLogData {
  userId?: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  timestamp?: Date;
}

export interface SecurityEventData {
  eventType: 'LOGIN_ATTEMPT' | 'PERMISSION_VIOLATION' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY' | 'FILE_UPLOAD' | 'DATA_ACCESS';
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp?: Date;
}

export class AuditLogger {
  private static formatLogEntry(data: AuditLogData | SecurityEventData, type: 'AUDIT' | 'SECURITY'): string {
    const timestamp = (data.timestamp || new Date()).toISOString();
    const details = data.details ? JSON.stringify(data.details, null, 2) : '{}';
    
    return `[${timestamp}] [${type}] ${JSON.stringify({
      ...data,
      details,
      timestamp
    }, null, 2)}`;
  }

  static async log(data: AuditLogData): Promise<void> {
    try {
      const logEntry = this.formatLogEntry(data, 'AUDIT');
      
      // Console logging
      console.log(logEntry);
      
      // In production, this would be sent to a logging service
      // For now, we'll just ensure it's logged
      
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Fallback to basic console logging
      console.log('AUDIT LOG:', data);
    }
  }

  static async logSecurityEvent(data: SecurityEventData): Promise<void> {
    try {
      const logEntry = this.formatLogEntry(data, 'SECURITY');
      
      // Console logging
      if (data.severity === 'HIGH' || data.severity === 'CRITICAL') {
        console.warn('SECURITY ALERT:', logEntry);
      } else {
        console.log(logEntry);
      }
      
      // In production, this would be sent to a security monitoring service
      
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Fallback to basic console logging
      console.log('SECURITY EVENT:', data);
    }
  }

  static async logLoginAttempt(
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      eventType: 'LOGIN_ATTEMPT',
      userEmail: email,
      ipAddress,
      userAgent,
      details: {
        success,
        ...details,
      },
      severity: success ? 'LOW' : 'MEDIUM',
    });
  }

  static async logPermissionViolation(
    userId: string,
    userEmail: string,
    attemptedAction: string,
    resource: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logSecurityEvent({
      eventType: 'PERMISSION_VIOLATION',
      userId,
      userEmail,
      ipAddress,
      userAgent,
      details: {
        attemptedAction,
        resource,
      },
      severity: 'HIGH',
    });
  }

  static async logRateLimitExceeded(
    ipAddress: string,
    endpoint: string,
    userAgent?: string
  ): Promise<void> {
    await this.logSecurityEvent({
      eventType: 'RATE_LIMIT_EXCEEDED',
      ipAddress,
      userAgent,
      details: {
        endpoint,
      },
      severity: 'MEDIUM',
    });
  }

  static async logSuspiciousActivity(
    userId: string,
    userEmail: string,
    activity: string,
    ipAddress?: string,
    userAgent?: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logSecurityEvent({
      eventType: 'SUSPICIOUS_ACTIVITY',
      userId,
      userEmail,
      ipAddress,
      userAgent,
      details: {
        activity,
        ...details,
      },
      severity: 'HIGH',
    });
  }

  static async logFileUpload(
    userId: string,
    userEmail: string,
    fileName: string,
    fileSize: number,
    fileType: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logSecurityEvent({
      eventType: 'FILE_UPLOAD',
      userId,
      userEmail,
      ipAddress,
      userAgent,
      details: {
        fileName,
        fileSize,
        fileType,
      },
      severity: 'LOW',
    });
  }

  static async logDataAccess(
    userId: string,
    userEmail: string,
    dataType: string,
    accessType: 'READ' | 'WRITE' | 'DELETE',
    resourceId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.logSecurityEvent({
      eventType: 'DATA_ACCESS',
      userId,
      userEmail,
      ipAddress,
      userAgent,
      details: {
        dataType,
        accessType,
        resourceId,
      },
      severity: accessType === 'DELETE' ? 'HIGH' : 'LOW',
    });
  }
}
