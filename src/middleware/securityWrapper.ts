import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from './rateLimit';
import { securityHeaders, corsHeaders, virusScanningMiddleware, suspiciousActivityDetection } from './security';
import { AuditLogger } from '@/lib/audit';

export interface SecurityConfig {
  enableRateLimit?: boolean;
  enableSecurityHeaders?: boolean;
  enableCORS?: boolean;
  enableVirusScanning?: boolean;
  enableSuspiciousActivityDetection?: boolean;
  rateLimitConfig?: {
    windowMs: number;
    max: number;
  };
}

export function createSecurityWrapper(config: SecurityConfig = {}) {
  const {
    enableRateLimit = true,
    enableSecurityHeaders = true,
    enableCORS = true,
    enableVirusScanning = true,
    enableSuspiciousActivityDetection = true,
    rateLimitConfig = { windowMs: 15 * 60 * 1000, max: 100 } // 15 minutes, 100 requests
  } = config;

  return function securityWrapper(request: NextRequest) {
    try {
      // 1. Suspicious Activity Detection (First - before any processing)
      if (enableSuspiciousActivityDetection) {
        const suspiciousResult = suspiciousActivityDetection(request);
        if (suspiciousResult instanceof NextResponse) {
          return suspiciousResult;
        }
      }

      // 2. Rate Limiting
      if (enableRateLimit) {
        const rateLimitMiddleware = rateLimit(rateLimitConfig);
        const rateLimitResult = rateLimitMiddleware(request);
        if (rateLimitResult instanceof NextResponse) {
          // Log rate limit exceeded
          const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
          const userAgent = request.headers.get('user-agent') || 'unknown';
          
          AuditLogger.logRateLimitExceeded(
            ipAddress,
            request.nextUrl.pathname,
            userAgent
          );
          
          return rateLimitResult;
        }
      }

      // 3. Virus Scanning for File Uploads
      if (enableVirusScanning) {
        const virusScanResult = virusScanningMiddleware(request);
        if (virusScanResult instanceof NextResponse) {
          return virusScanResult;
        }
      }

      // 4. Security Headers
      if (enableSecurityHeaders) {
        const securityResult = securityHeaders(request);
        if (securityResult instanceof NextResponse) {
          return securityResult;
        }
      }

      // 5. CORS Headers
      if (enableCORS) {
        const corsResult = corsHeaders(request);
        if (corsResult instanceof NextResponse) {
          return corsResult;
        }
      }

      // 6. Log successful security checks
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      AuditLogger.log({
        action: 'SECURITY_CHECK_PASSED',
        resource: request.nextUrl.pathname,
        ipAddress,
        userAgent,
        status: 'SUCCESS',
        details: {
          method: request.method,
          url: request.nextUrl.toString(),
          securityFeatures: {
            rateLimit: enableRateLimit,
            securityHeaders: enableSecurityHeaders,
            cors: enableCORS,
            virusScanning: enableVirusScanning,
            suspiciousActivityDetection: enableSuspiciousActivityDetection
          }
        }
      });

      return NextResponse.next();
    } catch (error) {
      // Log security wrapper errors
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      AuditLogger.logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        ipAddress,
        userAgent,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          path: request.nextUrl.pathname,
          method: request.method,
          component: 'SECURITY_WRAPPER'
        },
        severity: 'HIGH'
      });

      // Return error response
      return NextResponse.json(
        { error: 'Security check failed' },
        { status: 500 }
      );
    }
  };
}

// Default security wrapper with recommended settings
export const defaultSecurityWrapper = createSecurityWrapper();

// High security wrapper for sensitive endpoints
export const highSecurityWrapper = createSecurityWrapper({
  enableRateLimit: true,
  enableSecurityHeaders: true,
  enableCORS: true,
  enableVirusScanning: true,
  enableSuspiciousActivityDetection: true,
  rateLimitConfig: { windowMs: 5 * 60 * 1000, max: 50 } // 5 minutes, 50 requests
});

// Minimal security wrapper for public endpoints
export const minimalSecurityWrapper = createSecurityWrapper({
  enableRateLimit: true,
  enableSecurityHeaders: true,
  enableCORS: true,
  enableVirusScanning: false,
  enableSuspiciousActivityDetection: false,
  rateLimitConfig: { windowMs: 15 * 60 * 1000, max: 200 } // 15 minutes, 200 requests
});
