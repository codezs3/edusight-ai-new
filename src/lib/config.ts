export interface AppConfig {
  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  
  // Security
  security: {
    enableRateLimit: boolean;
    enableSecurityHeaders: boolean;
    enableCORS: boolean;
    enableVirusScanning: boolean;
    enableSuspiciousActivityDetection: boolean;
    sessionSecret: string;
    jwtSecret: string;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  
  // Database
  database: {
    url: string;
    maxConnections: number;
    connectionTimeout: number;
  };
  
  // File Upload
  fileUpload: {
    maxFileSize: number; // in bytes
    allowedFileTypes: string[];
    maxFilesPerUpload: number;
    uploadDirectory: string;
  };
  
  // API
  api: {
    baseUrl: string;
    timeout: number;
    maxRetries: number;
  };
  
  // Monitoring
  monitoring: {
    enableAuditLogging: boolean;
    enableSecurityLogging: boolean;
    enablePerformanceMonitoring: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  security: {
    enableRateLimit: true,
    enableSecurityHeaders: true,
    enableCORS: true,
    enableVirusScanning: true,
    enableSuspiciousActivityDetection: true,
    sessionSecret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-here',
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
    maxConnections: 10,
    connectionTimeout: 30000,
  },
  
  fileUpload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ],
    maxFilesPerUpload: 5,
    uploadDirectory: './uploads',
  },
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    timeout: 30000,
    maxRetries: 3,
  },
  
  monitoring: {
    enableAuditLogging: true,
    enableSecurityLogging: true,
    enablePerformanceMonitoring: process.env.NODE_ENV === 'production',
    logLevel: (process.env.LOG_LEVEL as any) || 'info',
  },
};

// Production overrides
if (process.env.NODE_ENV === 'production') {
  defaultConfig.security.enableRateLimit = true;
  defaultConfig.security.enableSecurityHeaders = true;
  defaultConfig.security.enableCORS = true;
  defaultConfig.security.enableVirusScanning = true;
  defaultConfig.security.enableSuspiciousActivityDetection = true;
  defaultConfig.monitoring.enableAuditLogging = true;
  defaultConfig.monitoring.enableSecurityLogging = true;
  defaultConfig.monitoring.enablePerformanceMonitoring = true;
}

// Development overrides
if (process.env.NODE_ENV === 'development') {
  defaultConfig.security.enableRateLimit = true;
  defaultConfig.security.enableSecurityHeaders = true;
  defaultConfig.security.enableCORS = true;
  defaultConfig.security.enableVirusScanning = false; // Disable in development
  defaultConfig.security.enableSuspiciousActivityDetection = true;
  defaultConfig.monitoring.logLevel = 'debug';
}

export const config: AppConfig = defaultConfig;

// Helper functions
export function getSecurityConfig() {
  return config.security;
}

export function getFileUploadConfig() {
  return config.fileUpload;
}

export function getMonitoringConfig() {
  return config.monitoring;
}

export function isFeatureEnabled(feature: keyof AppConfig['security'] | keyof AppConfig['monitoring']): boolean {
  if (feature in config.security) {
    return config.security[feature as keyof AppConfig['security']] as boolean;
  }
  if (feature in config.monitoring) {
    return config.monitoring[feature as keyof AppConfig['monitoring']] as boolean;
  }
  return false;
}

// Validation
export function validateConfig(): string[] {
  const errors: string[] = [];
  
  if (!config.security.sessionSecret || config.security.sessionSecret === 'your-secret-key-here') {
    errors.push('NEXTAUTH_SECRET must be set in production');
  }
  
  if (!config.security.jwtSecret || config.security.jwtSecret === 'your-jwt-secret-here') {
    errors.push('JWT_SECRET must be set in production');
  }
  
  if (config.isProduction && config.database.url.includes('dev.db')) {
    errors.push('DATABASE_URL must be set to production database in production');
  }
  
  return errors;
}
