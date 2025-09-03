import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { z } from 'zod';

// Validation schema for user creation
const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  role: z.enum(['TEACHER', 'PARENT', 'STUDENT']),
  designation: z.string().optional(),
  department: z.string().optional(),
  employeeId: z.string().optional(),
  // Parent-specific fields
  occupation: z.string().optional(),
  income: z.string().optional(),
  education: z.string().optional(),
  relationship: z.string().optional(),
  emergencyContact: z.boolean().optional(),
  // Student-specific fields
  grade: z.string().optional(),
  section: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  parentEmail: z.string().email().optional()
});

async function verifySchoolAdminAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { school: true }
  });

  if (!user || user.role !== 'SCHOOL_ADMIN' || !user.schoolId) {
    throw new Error('Access denied. School admin role required.');
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schoolAdmin = await verifySchoolAdminAccess(session.user.id);
    const schoolId = schoolAdmin.schoolId!;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role'); // TEACHER, PARENT, STUDENT
    const status = searchParams.get('status'); // active, inactive, all

    const skip = (page - 1) * limit;

    // Build where clause for users belonging to this school
    const where: any = {
      schoolId: schoolId,
      role: { not: 'ADMIN' } // Exclude system admins
    };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'ALL') {
      where.role = role;
    }

    if (status === 'active') where.isActive = true;
    if (status === 'inactive') where.isActive = false;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          student: {
            include: {
              parent: { include: { user: { select: { name: true, email: true } } } }
            }
          },
          teacher: {
            include: {
              school: { select: { name: true } }
            }
          },
          parent: {
            include: {
              children: { 
                include: { user: { select: { name: true } } },
                where: { isActive: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    // Get role counts for this school
    const roleCounts = await prisma.user.groupBy({
      by: ['role'],
      where: { schoolId: schoolId, isActive: true },
      _count: { role: true }
    });

    const roleStats = roleCounts.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        stats: {
          total,
          active: users.filter(u => u.isActive).length,
          inactive: users.filter(u => !u.isActive).length,
          roles: roleStats
        }
      }
    });

  } catch (error) {
    console.error('Get school users error:', error);
    return NextResponse.json({
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schoolAdmin = await verifySchoolAdminAccess(session.user.id);
    const schoolId = schoolAdmin.schoolId!;

    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json({
        error: 'Email already exists'
      }, { status: 400 });
    }

    // Check school capacity limits
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        _count: {
          select: {
            students: { where: { isActive: true } },
            teachers: { where: { isActive: true } }
          }
        }
      }
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Check capacity limits
    if (validatedData.role === 'STUDENT' && school._count.students >= (school.maxStudents || 100)) {
      return NextResponse.json({
        error: `Student limit reached. Maximum allowed: ${school.maxStudents}`
      }, { status: 400 });
    }

    if (validatedData.role === 'TEACHER' && school._count.teachers >= (school.maxTeachers || 20)) {
      return NextResponse.json({
        error: `Teacher limit reached. Maximum allowed: ${school.maxTeachers}`
      }, { status: 400 });
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        role: validatedData.role,
        schoolId: schoolId,
        accountType: 'B2B',
        designation: validatedData.designation,
        department: validatedData.department,
        employeeId: validatedData.employeeId,
        dateOfJoining: new Date(),
        isActive: true
      }
    });

    // Create role-specific records
    if (validatedData.role === 'TEACHER') {
      await prisma.teacher.create({
        data: {
          userId: user.id,
          schoolId: schoolId,
          subject: validatedData.department,
          qualification: validatedData.education,
          isActive: true
        }
      });
    } else if (validatedData.role === 'PARENT') {
      await prisma.parent.create({
        data: {
          userId: user.id,
          schoolId: schoolId,
          occupation: validatedData.occupation,
          income: validatedData.income,
          education: validatedData.education,
          relationship: validatedData.relationship,
          emergencyContact: validatedData.emergencyContact || false,
          isActive: true
        }
      });
    } else if (validatedData.role === 'STUDENT') {
      // Find parent if parentEmail provided
      let parentId = null;
      if (validatedData.parentEmail) {
        const parentUser = await prisma.user.findUnique({
          where: { email: validatedData.parentEmail },
          include: { parent: true }
        });

        if (parentUser?.parent) {
          parentId = parentUser.parent.id;
        }
      }

      await prisma.student.create({
        data: {
          userId: user.id,
          schoolId: schoolId,
          grade: validatedData.grade,
          section: validatedData.section,
          rollNumber: validatedData.rollNumber,
          dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : null,
          gender: validatedData.gender,
          bloodGroup: validatedData.bloodGroup,
          parentId: parentId,
          isActive: true
        }
      });
    }

    // Fetch the created user with relations
    const createdUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        student: true,
        teacher: true,
        parent: true
      }
    });

    return NextResponse.json({
      success: true,
      data: createdUser,
      message: `${validatedData.role.toLowerCase()} created successfully`
    });

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
