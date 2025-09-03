import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';

export type UserRole = 'ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';
export type Resource = 'USER' | 'SCHOOL' | 'STUDENT' | 'DOCUMENT' | 'REPORT' | 'ANALYTICS' | 'SYSTEM';
export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';
export type Scope = 'OWN' | 'SCHOOL' | 'ALL';

export interface Permission {
  resource: Resource;
  actions: Action[];
  scope: Scope;
}

export type PermissionMap = {
  [key in UserRole]: Permission[];
}

const PERMISSIONS: PermissionMap = {
  ADMIN: [
    { resource: 'USER', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'SCHOOL', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'STUDENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'REPORT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'ANALYTICS', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' },
    { resource: 'SYSTEM', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'ALL' }
  ],
  SCHOOL_ADMIN: [
    { resource: 'USER', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'SCHOOL' },
    { resource: 'STUDENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE'], scope: 'SCHOOL' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'SCHOOL' },
    { resource: 'REPORT', actions: ['CREATE', 'READ', 'UPDATE'], scope: 'SCHOOL' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'SCHOOL' }
  ],
  TEACHER: [
    { resource: 'STUDENT', actions: ['READ', 'UPDATE'], scope: 'SCHOOL' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE'], scope: 'SCHOOL' },
    { resource: 'REPORT', actions: ['CREATE', 'READ', 'UPDATE'], scope: 'SCHOOL' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'SCHOOL' }
  ],
  PARENT: [
    { resource: 'STUDENT', actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'], scope: 'OWN' },
    { resource: 'DOCUMENT', actions: ['CREATE', 'READ', 'UPDATE'], scope: 'OWN' },
    { resource: 'REPORT', actions: ['READ'], scope: 'OWN' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'OWN' }
  ],
  STUDENT: [
    { resource: 'DOCUMENT', actions: ['READ'], scope: 'OWN' },
    { resource: 'REPORT', actions: ['READ'], scope: 'OWN' },
    { resource: 'ANALYTICS', actions: ['READ'], scope: 'OWN' }
  ]
};

export function hasPermission(
  userRole: UserRole,
  resource: Resource,
  action: Action,
  scope: Scope = 'OWN'
): boolean {
  const userPermissions = PERMISSIONS[userRole];
  if (!userPermissions) return false;
  
  return userPermissions.some((permission: Permission) => 
    permission.resource === resource &&
    permission.actions.includes(action) &&
    (permission.scope === 'ALL' || permission.scope === scope)
  );
}

export function withAuth(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  requiredPermissions?: { resource: Resource; action: Action; scope?: Scope }
) {
  return async (req: NextRequest, context: any) => {
    try {
      // Get session
      const session = await auth();
      
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const userRole = session.user.role as UserRole;
      
      if (!userRole) {
        return NextResponse.json({ error: 'Invalid user role' }, { status: 403 });
      }

      // Check permissions if required
      if (requiredPermissions) {
        const hasAccess = hasPermission(
          userRole,
          requiredPermissions.resource,
          requiredPermissions.action,
          requiredPermissions.scope
        );
        
        if (!hasAccess) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }
      }

      return handler(req, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
