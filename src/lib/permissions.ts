/**
 * EduSight Permission System
 * Defines role-based access control for the platform
 */

export type UserRole = 'ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  scope?: 'own' | 'school' | 'system';
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    // Admin has full system access
    { resource: '*', action: 'manage', scope: 'system' },
    // Specific admin permissions
    { resource: 'schools', action: 'manage', scope: 'system' },
    { resource: 'users', action: 'manage', scope: 'system' },
    { resource: 'students', action: 'manage', scope: 'system' },
    { resource: 'parents', action: 'manage', scope: 'system' },
    { resource: 'teachers', action: 'manage', scope: 'system' },
    { resource: 'analytics', action: 'read', scope: 'system' },
    { resource: 'reports', action: 'manage', scope: 'system' },
    { resource: 'settings', action: 'manage', scope: 'system' },
    { resource: 'billing', action: 'manage', scope: 'system' },
  ],

  SCHOOL_ADMIN: [
    // School admin can manage their school and its entities
    { resource: 'school', action: 'manage', scope: 'own' },
    { resource: 'students', action: 'manage', scope: 'school' },
    { resource: 'teachers', action: 'manage', scope: 'school' },
    { resource: 'parents', action: 'manage', scope: 'school' },
    { resource: 'classes', action: 'manage', scope: 'school' },
    { resource: 'subjects', action: 'manage', scope: 'school' },
    { resource: 'assessments', action: 'manage', scope: 'school' },
    { resource: 'reports', action: 'read', scope: 'school' },
    { resource: 'analytics', action: 'read', scope: 'school' },
    { resource: 'uploads', action: 'read', scope: 'school' },
  ],

  TEACHER: [
    // Teacher can manage their classes and students
    { resource: 'students', action: 'read', scope: 'school' },
    { resource: 'students', action: 'update', scope: 'own' }, // Only students in their classes
    { resource: 'assessments', action: 'manage', scope: 'own' },
    { resource: 'uploads', action: 'create', scope: 'own' },
    { resource: 'uploads', action: 'read', scope: 'own' },
    { resource: 'reports', action: 'read', scope: 'own' },
    { resource: 'analytics', action: 'read', scope: 'own' },
  ],

  PARENT: [
    // Parent can manage their children
    { resource: 'children', action: 'manage', scope: 'own' },
    { resource: 'students', action: 'read', scope: 'own' }, // Only their children
    { resource: 'students', action: 'update', scope: 'own' }, // Only their children
    { resource: 'uploads', action: 'create', scope: 'own' },
    { resource: 'uploads', action: 'read', scope: 'own' },
    { resource: 'reports', action: 'read', scope: 'own' },
    { resource: 'analytics', action: 'read', scope: 'own' },
    { resource: 'assessments', action: 'read', scope: 'own' },
  ],

  STUDENT: [
    // Student can view their own data
    { resource: 'profile', action: 'read', scope: 'own' },
    { resource: 'profile', action: 'update', scope: 'own' },
    { resource: 'assessments', action: 'read', scope: 'own' },
    { resource: 'reports', action: 'read', scope: 'own' },
    { resource: 'uploads', action: 'read', scope: 'own' },
  ],
};

/**
 * Check if a user has permission to perform an action on a resource
 */
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: Permission['action'],
  scope?: Permission['scope']
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];

  // Check for wildcard permission (admin)
  const wildcardPermission = permissions.find(p => 
    p.resource === '*' && p.action === 'manage'
  );
  if (wildcardPermission) return true;

  // Check for specific permission
  return permissions.some(permission => {
    const resourceMatch = permission.resource === resource || permission.resource === '*';
    const actionMatch = permission.action === action || permission.action === 'manage';
    const scopeMatch = !scope || permission.scope === scope || permission.scope === 'system';
    
    return resourceMatch && actionMatch && scopeMatch;
  });
}

/**
 * Get all permissions for a user role
 */
export function getUserPermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole];
}

/**
 * Check if user can access resource based on their role and context
 */
export function canAccess(
  userRole: UserRole,
  userId: string,
  resource: string,
  action: Permission['action'],
  context?: {
    schoolId?: string;
    parentId?: string;
    teacherId?: string;
    studentId?: string;
    ownerId?: string;
  }
): boolean {
  // Admin can access everything
  if (userRole === 'ADMIN') {
    return true;
  }

  // Check basic permission first
  if (!hasPermission(userRole, resource, action)) {
    return false;
  }

  // Additional context-based checks
  if (userRole === 'SCHOOL_ADMIN' && context?.schoolId) {
    // School admin can only access their school's resources
    return true; // This should be validated against user's schoolId in the API
  }

  if (userRole === 'PARENT' && context?.parentId) {
    // Parent can only access their children's resources
    return context.parentId === userId;
  }

  if (userRole === 'TEACHER' && context?.teacherId) {
    // Teacher can only access their classes/students
    return context.teacherId === userId;
  }

  if (userRole === 'STUDENT' && context?.studentId) {
    // Student can only access their own resources
    return context.studentId === userId;
  }

  // Default context check for 'own' scope
  if (context?.ownerId) {
    return context.ownerId === userId;
  }

  return true;
}

/**
 * Middleware helper for API routes to check permissions
 */
export function requirePermission(
  resource: string,
  action: Permission['action'],
  scope?: Permission['scope']
) {
  return (userRole: UserRole, context?: any) => {
    if (!hasPermission(userRole, resource, action, scope)) {
      throw new Error(`Insufficient permissions. Required: ${action} on ${resource} (scope: ${scope})`);
    }
  };
}

/**
 * Get user's accessible schools based on role
 */
export function getAccessibleSchools(userRole: UserRole, userSchoolId?: string): 'all' | string[] | null {
  switch (userRole) {
    case 'ADMIN':
      return 'all'; // Admin can access all schools
    case 'SCHOOL_ADMIN':
    case 'TEACHER':
    case 'PARENT':
    case 'STUDENT':
      return userSchoolId ? [userSchoolId] : null; // Only their own school
    default:
      return null;
  }
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(userRole: UserRole, targetRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    ADMIN: 5,
    SCHOOL_ADMIN: 4,
    TEACHER: 3,
    PARENT: 2,
    STUDENT: 1,
  };

  return hierarchy[userRole] > hierarchy[targetRole];
}
