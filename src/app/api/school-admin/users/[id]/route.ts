import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  employeeId: z.string().optional(),
  isActive: z.boolean().optional(),
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
  bloodGroup: z.string().optional()
});

async function verifySchoolAdminAccess(userId: string, targetUserId?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { school: true }
  });

  if (!user || user.role !== 'SCHOOL_ADMIN' || !user.schoolId) {
    throw new Error('Access denied. School admin role required.');
  }

  // If checking access to specific user, verify they belong to same school
  if (targetUserId) {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!targetUser || targetUser.schoolId !== user.schoolId) {
      throw new Error('Access denied. User not in your school.');
    }
  }

  return user;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;
    await verifySchoolAdminAccess(session.user.id, userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            school: { select: { name: true } },
            parent: { 
              include: { 
                user: { select: { name: true, email: true, phone: true } } 
              } 
            },
            assessments: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        },
        teacher: {
          include: {
            school: { select: { name: true } },
            _count: {
              select: {
                students: { where: { isActive: true } }
              }
            }
          }
        },
        parent: {
          include: {
            school: { select: { name: true } },
            children: { 
              include: { 
                user: { select: { name: true, email: true } },
                school: { select: { name: true } }
              },
              where: { isActive: true }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({
      error: 'Failed to fetch user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;
    await verifySchoolAdminAccess(session.user.id, userId);

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Get the existing user
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true,
        parent: true
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        designation: validatedData.designation,
        department: validatedData.department,
        employeeId: validatedData.employeeId,
        isActive: validatedData.isActive
      }
    });

    // Update role-specific data
    if (existingUser.role === 'TEACHER' && existingUser.teacher) {
      await prisma.teacher.update({
        where: { userId: userId },
        data: {
          subject: validatedData.department,
          qualification: validatedData.education
        }
      });
    } else if (existingUser.role === 'PARENT' && existingUser.parent) {
      await prisma.parent.update({
        where: { userId: userId },
        data: {
          occupation: validatedData.occupation,
          income: validatedData.income,
          education: validatedData.education,
          relationship: validatedData.relationship,
          emergencyContact: validatedData.emergencyContact
        }
      });
    } else if (existingUser.role === 'STUDENT' && existingUser.student) {
      await prisma.student.update({
        where: { userId: userId },
        data: {
          grade: validatedData.grade,
          section: validatedData.section,
          rollNumber: validatedData.rollNumber,
          dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
          gender: validatedData.gender,
          bloodGroup: validatedData.bloodGroup
        }
      });
    }

    // Fetch updated user with relations
    const result = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        teacher: true,
        parent: true
      }
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to update user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;
    await verifySchoolAdminAccess(session.user.id, userId);

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            _count: {
              select: {
                assessments: true,
                uploads: true
              }
            }
          }
        },
        teacher: {
          include: {
            _count: {
              select: {
                students: { where: { isActive: true } }
              }
            }
          }
        },
        parent: {
          include: {
            children: { where: { isActive: true } }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user can be deleted
    if (user.role === 'PARENT' && user.parent?.children.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete parent with active children',
        details: `Parent has ${user.parent.children.length} active children`
      }, { status: 400 });
    }

    if (user.role === 'TEACHER' && user.teacher?._count.students > 0) {
      return NextResponse.json({
        error: 'Cannot delete teacher with assigned students',
        details: `Teacher has ${user.teacher._count.students} assigned students`
      }, { status: 400 });
    }

    // Soft delete the user
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });

    // Update related records
    if (user.role === 'STUDENT' && user.student) {
      await prisma.student.update({
        where: { userId: userId },
        data: { isActive: false }
      });
    } else if (user.role === 'TEACHER' && user.teacher) {
      await prisma.teacher.update({
        where: { userId: userId },
        data: { isActive: false }
      });
    } else if (user.role === 'PARENT' && user.parent) {
      await prisma.parent.update({
        where: { userId: userId },
        data: { isActive: false }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({
      error: 'Failed to delete user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
