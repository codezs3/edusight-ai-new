import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuditLogger } from '@/lib/audit';
import { config } from '@/lib/config';

export type PermissionType = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';
export type UserRole = 'ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
export type Resource = 'USER' | 'SCHOOL' | 'STUDENT' | 'DOCUMENT' | 'REPORT' | 'ANALYTICS' | 'SYSTEM';
export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
export type Scope = 'OWN' | 'SCHOOL' | 'ALL';

export interface Permission {
  resource: Resource;
  actions: Action[];
  scope: Scope;
}

export interface PermissionMap {
  [key in UserRole]: Permission[];
}

// Define permissions for each role
const PERMISSIONS: PermissionMap = {
  ADMIN: [
    { resource: 'USER', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'SCHOOL', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'STUDENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'REPORT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'ANALYTICS', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'SYSTEM', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
  ],
  SCHOOL_ADMIN: [
    { resource: 'USER', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'SCHOOL' },
    { resource: 'SCHOOL', actions: ['READ', 'UPDATE'], scope: 'OWN' },
    { resource: 'STUDENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'SCHOOL' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'SCHOOL' },
    { resource: 'REPORT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'SCHOOL' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'SCHOOL' },
    { resource: 'SYSTEM', actions: ['READ'], scope: 'SCHOOL' },
  ],
  TEACHER: [
    { resource: 'USER', actions: ['READ'], scope: 'SCHOOL' },
    { resource: 'SCHOOL', actions: ['READ'], scope: 'OWN' },
    { resource: 'STUDENT', actions: ['READ', 'UPDATE'], scope: 'SCHOOL' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE'], scope: 'SCHOOL' },
    { resource: 'REPORT', actions: ['CREATE', 'READ', 'UPDATE'], scope: 'SCHOOL' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'SCHOOL' },
    { resource: 'SYSTEM', actions: ['READ'], scope: 'SCHOOL' },
  ],
  PARENT: [
    { resource: 'USER', actions: ['READ', 'UPDATE'], scope: 'OWN' },
    { resource: 'SCHOOL', actions: ['READ'], scope: 'OWN' },
    { resource: 'STUDENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'OWN' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'OWN' },
    { resource: 'REPORT', actions: ['CREATE', 'READ'], scope: 'OWN' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'OWN' },
    { resource: 'SYSTEM', actions: ['READ'], scope: 'OWN' },
  ],
  STUDENT: [
    { resource: 'USER', actions: ['READ', 'UPDATE'], scope: 'OWN' },
    { resource: 'SCHOOL', actions: ['READ'], scope: 'OWN' },
    { resource: 'STUDENT', actions: ['READ'], scope: 'OWN' },
    { resource: 'DOCUMENT', actions: ['READ'], scope: 'OWN' },
    { resource: 'REPORT', actions: ['READ'], scope: 'OWN' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'OWN' },
    { resource: 'SYSTEM', actions: ['READ'], scope: 'OWN' },
  ],
};

export function hasPermission(
  userRole: UserRole,
  resource: Resource,
  action: Action,
  scope: Scope = 'OWN'
): boolean {
  const rolePermissions = PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const permission = rolePermissions.find(p => p.resource === resource);
  if (!permission) return false;

  return permission.actions.includes(action) && permission.scope === scope;
}

export function canAccess(
  userRole: UserRole,
  resource: Resource,
  action: Action,
  userSchoolId?: string,
  resourceSchoolId?: string,
  userId?: string,
  resourceUserId?: string
): boolean {
  const rolePermissions = PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const permission = rolePermissions.find(p => p.resource === resource);
  if (!permission) return false;

  if (!permission.actions.includes(action)) return false;

  switch (permission.scope) {
    case 'ALL':
      return true;
    case 'SCHOOL':
      return userSchoolId && resourceSchoolId && userSchoolId === resourceSchoolId;
    case 'OWN':
      return userId && resourceUserId && userId === resourceUserId;
    default:
      return false;
  }
}

export function withAuth(
  handler: Function,
  requiredPermissions?: {
    resource: Resource;
    action: Action;
    scope?: Scope;
  }
) {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      // Get session
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        // Log unauthorized access attempt
        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        
        await AuditLogger.logSecurityEvent({
          eventType: 'PERMISSION_VIOLATION',
          ipAddress,
          userAgent,
          details: {
            attemptedAction: 'AUTHENTICATION',
            resource: request.nextUrl.pathname,
            reason: 'No session found'
          },
          severity: 'MEDIUM'
        });

        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      const user = session.user as any;
      const userRole = user.role as UserRole;
      const userSchoolId = user.schoolId;
      const userId = user.id;

      // Check permissions if required
      if (requiredPermissions) {
        const hasRequiredPermission = hasPermission(
          userRole,
          requiredPermissions.resource,
          requiredPermissions.action,
          requiredPermissions.scope
        );

        if (!hasRequiredPermission) {
          // Log permission violation
          await AuditLogger.logPermissionViolation(
            userId,
            user.email,
            `${requiredPermissions.action}_${requiredPermissions.resource}`,
            request.nextUrl.pathname,
            request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            request.headers.get('user-agent') || 'unknown'
          );

          return NextResponse.redirect(new URL('/forbidden', request.url));
        }
      }

      // Log successful access
      await AuditLogger.log({
        userId,
        userEmail: user.email,
        userRole,
        action: 'API_ACCESS',
        resource: request.nextUrl.pathname,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'SUCCESS'
      });

      // Call the original handler
      return handler(request, ...args);
    } catch (error) {
      // Log authentication errors
      const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      await AuditLogger.logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        ipAddress,
        userAgent,
        details: {
          activity: 'AUTHENTICATION_ERROR',
          error: error instanceof Error ? error.message : 'Unknown error',
          path: request.nextUrl.pathname,
          method: request.method
        },
        severity: 'HIGH'
      });

      return NextResponse.redirect(new URL('/server-error', request.url));
    }
  };
}

// Helper function to check if user can access a specific resource
export function checkResourceAccess(
  userRole: UserRole,
  resource: Resource,
  action: Action,
  userSchoolId?: string,
  resourceSchoolId?: string,
  userId?: string,
  resourceUserId?: string
): { allowed: boolean; reason?: string } {
  if (!canAccess(userRole, resource, action, userSchoolId, resourceSchoolId, userId, resourceUserId)) {
    return {
      allowed: false,
      reason: `User role ${userRole} cannot ${action} ${resource}`
    };
  }

  return { allowed: true };
}
