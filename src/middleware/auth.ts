import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';

// User roles enum
export enum UserRole {
  ADMIN = 'ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT'
}

// Permission types
export type Permission = 
  | 'CREATE_SCHOOL'
  | 'MANAGE_SCHOOLS'
  | 'MANAGE_ALL_USERS'
  | 'MANAGE_SCHOOL_USERS'
  | 'MANAGE_SCHOOL_STUDENTS'
  | 'MANAGE_OWN_CHILDREN'
  | 'VIEW_SCHOOL_ANALYTICS'
  | 'VIEW_CHILD_ANALYTICS'
  | 'UPLOAD_DOCUMENTS'
  | 'GENERATE_REPORTS'
  | 'ACCESS_ML_ANALYTICS'
  | 'SYSTEM_CONFIGURATION';

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'CREATE_SCHOOL',
    'MANAGE_SCHOOLS',
    'MANAGE_ALL_USERS',
    'VIEW_SCHOOL_ANALYTICS',
    'ACCESS_ML_ANALYTICS',
    'SYSTEM_CONFIGURATION',
    'GENERATE_REPORTS'
  ],
  [UserRole.SCHOOL_ADMIN]: [
    'MANAGE_SCHOOL_USERS',
    'MANAGE_SCHOOL_STUDENTS',
    'VIEW_SCHOOL_ANALYTICS',
    'GENERATE_REPORTS'
  ],
  [UserRole.TEACHER]: [
    'VIEW_SCHOOL_ANALYTICS',
    'GENERATE_REPORTS'
  ],
  [UserRole.PARENT]: [
    'MANAGE_OWN_CHILDREN',
    'VIEW_CHILD_ANALYTICS',
    'UPLOAD_DOCUMENTS',
    'GENERATE_REPORTS'
  ],
  [UserRole.STUDENT]: []
};

// Authentication middleware
export async function authenticateRequest(request: NextRequest) {
  const token = await getToken({ req: request });
  
  if (!token || !token.sub) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Fetch user details from database
  const user = await prisma.user.findUnique({
    where: { id: token.sub },
    include: {
      parent: true,
      school: true
    }
  });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 401 }
    );
  }

  return { user, token };
}

// Permission checking middleware
export function requirePermission(permission: Permission) {
  return async (request: NextRequest, context: { user: any }) => {
    const { user } = context;
    const userRole = user.role as UserRole;
    
    if (!ROLE_PERMISSIONS[userRole]?.includes(permission)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return null; // Permission granted
  };
}

// School-scoped access middleware
export async function requireSchoolAccess(request: NextRequest, context: { user: any }, targetSchoolId?: string) {
  const { user } = context;
  
  // Admin has access to all schools
  if (user.role === UserRole.ADMIN) {
    return null;
  }

  // For school-specific roles, ensure they belong to the target school
  if (user.role === UserRole.SCHOOL_ADMIN || user.role === UserRole.TEACHER) {
    if (!user.schoolId) {
      return NextResponse.json(
        { error: 'User not associated with any school' },
        { status: 403 }
      );
    }

    if (targetSchoolId && user.schoolId !== targetSchoolId) {
      return NextResponse.json(
        { error: 'Access denied: Not authorized for this school' },
        { status: 403 }
      );
    }
  }

  return null;
}

// Parent-child access middleware
export async function requireParentChildAccess(request: NextRequest, context: { user: any }, childId: string) {
  const { user } = context;
  
  // Admin has access to all children
  if (user.role === UserRole.ADMIN) {
    return null;
  }

  // School admin has access to children in their school
  if (user.role === UserRole.SCHOOL_ADMIN) {
    const child = await prisma.student.findUnique({
      where: { id: childId },
      select: { schoolId: true }
    });

    if (!child || child.schoolId !== user.schoolId) {
      return NextResponse.json(
        { error: 'Access denied: Child not in your school' },
        { status: 403 }
      );
    }
    return null;
  }

  // Parent can only access their own children
  if (user.role === UserRole.PARENT) {
    const child = await prisma.student.findUnique({
      where: { id: childId },
      select: { parentId: true }
    });

    if (!child || child.parentId !== user.parent?.id) {
      return NextResponse.json(
        { error: 'Access denied: Not your child' },
        { status: 403 }
      );
    }
    return null;
  }

  return NextResponse.json(
    { error: 'Access denied' },
    { status: 403 }
  );
}

// Resource ownership middleware
export async function requireResourceOwnership(
  request: NextRequest, 
  context: { user: any }, 
  resourceType: 'student' | 'parent' | 'document' | 'report',
  resourceId: string
) {
  const { user } = context;
  
  // Admin has access to all resources
  if (user.role === UserRole.ADMIN) {
    return null;
  }

  switch (resourceType) {
    case 'student':
      return await requireParentChildAccess(request, context, resourceId);
    
    case 'parent':
      if (user.role === UserRole.PARENT && user.parent?.id === resourceId) {
        return null;
      }
      break;
    
    case 'document':
    case 'report':
      // Check if document/report belongs to user's child or school
      const document = await prisma.documentUpload.findUnique({
        where: { id: resourceId },
        include: { 
          student: { 
            include: { 
              parent: true,
              school: true 
            } 
          } 
        }
      });

      if (!document) {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }

      // Parent can access their child's documents
      if (user.role === UserRole.PARENT && document.student.parentId === user.parent?.id) {
        return null;
      }

      // School admin can access documents from their school
      if (user.role === UserRole.SCHOOL_ADMIN && document.student.schoolId === user.schoolId) {
        return null;
      }
      break;
  }

  return NextResponse.json(
    { error: 'Access denied: Resource not owned by user' },
    { status: 403 }
  );
}

// Combined middleware wrapper
export function withAuth(
  handler: (request: NextRequest, context: { user: any; params?: any }) => Promise<NextResponse>,
  options?: {
    permissions?: Permission[];
    requireSchool?: boolean;
    resourceType?: 'student' | 'parent' | 'document' | 'report';
  }
) {
  return async (request: NextRequest, { params }: { params?: any }) => {
    // Authenticate user
    const authResult = await authenticateRequest(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const context = { user, params };

    // Check permissions
    if (options?.permissions) {
      for (const permission of options.permissions) {
        const permissionResult = await requirePermission(permission)(request, context);
        if (permissionResult instanceof NextResponse) {
          return permissionResult;
        }
      }
    }

    // Check school access
    if (options?.requireSchool) {
      const schoolResult = await requireSchoolAccess(request, context);
      if (schoolResult instanceof NextResponse) {
        return schoolResult;
      }
    }

    // Check resource ownership
    if (options?.resourceType && params?.id) {
      const ownershipResult = await requireResourceOwnership(
        request, 
        context, 
        options.resourceType, 
        params.id
      );
      if (ownershipResult instanceof NextResponse) {
        return ownershipResult;
      }
    }

    // All checks passed, execute handler
    return handler(request, context);
  };
}

// Helper function to check if user has permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

// Helper function to get user permissions
export function getUserPermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}
