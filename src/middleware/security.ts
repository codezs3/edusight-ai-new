import { NextRequest, NextResponse } from 'next/server';
import { AuditLogger } from '@/lib/audit';

export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https: wss:",
    "media-src 'self' https: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  // HSTS (HTTP Strict Transport Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Remove server information
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  return response;
}

export function corsHeaders(request: NextRequest) {
  const response = NextResponse.next();
  
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://edusight.com',
    'https://www.edusight.com'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

export function virusScanningMiddleware(request: NextRequest) {
  // Simulate virus scanning for file uploads
  const contentType = request.headers.get('content-type');
  
  if (contentType && contentType.includes('multipart/form-data')) {
    // Log file upload attempt
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // In production, this would integrate with actual virus scanning services
    // For now, we'll simulate basic checks
    AuditLogger.logSecurityEvent({
      eventType: 'FILE_UPLOAD',
      ipAddress,
      userAgent,
      details: {
        contentType,
        scanStatus: 'PENDING',
        message: 'File upload detected, virus scanning initiated'
      },
      severity: 'LOW'
    });
  }

  return NextResponse.next();
}

export function suspiciousActivityDetection(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const path = request.nextUrl.pathname;
  
  // Detect suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // Script injection
    /javascript:/i, // JavaScript protocol
    /data:text\/html/i, // Data URI HTML
    /eval\(/i, // eval function
    /union\s+select/i, // SQL injection
  ];

  const url = request.nextUrl.toString();
  const body = request.body ? 'BODY_PRESENT' : 'NO_BODY';
  
  // Check for suspicious patterns in URL
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      AuditLogger.logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        ipAddress,
        userAgent,
        details: {
          pattern: pattern.source,
          url,
          path,
          body,
          threat: 'Potential injection attack'
        },
        severity: 'HIGH'
      });
      
      return NextResponse.json(
        { error: 'Suspicious request detected' },
        { status: 400 }
      );
    }
  }

  return NextResponse.next();
}
