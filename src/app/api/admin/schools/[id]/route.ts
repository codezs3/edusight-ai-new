import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const updateSchoolSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  type: z.enum(['public', 'private', 'international']).optional(),
  board: z.enum(['CBSE', 'ICSE', 'IGCSE', 'IB', 'MULTIPLE', 'OTHER']).optional(),
  logo: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  capacity: z.number().min(1).optional(),
  principalName: z.string().optional(),
  principalEmail: z.string().email().optional().or(z.literal('')),
  principalPhone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  subscriptionType: z.enum(['trial', 'basic', 'premium', 'enterprise']).optional(),
  maxStudents: z.number().min(1).optional(),
  maxTeachers: z.number().min(1).optional(),
  isActive: z.boolean().optional(),
  schoolAdminEmail: z.string().email().optional().or(z.literal(''))
});

async function verifyAdminAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Access denied. Admin role required.');
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

    await verifyAdminAccess(session.user.id);

    const schoolId = params.id;

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        schoolAdmin: {
          select: { 
            id: true, 
            name: true, 
            email: true, 
            phone: true, 
            isActive: true,
            dateOfJoining: true,
            designation: true
          }
        },
        students: {
          where: { isActive: true },
          include: {
            user: { select: { name: true, email: true } }
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        teachers: {
          where: { isActive: true },
          include: {
            user: { select: { name: true, email: true, phone: true } }
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        parents: {
          where: { isActive: true },
          include: {
            user: { select: { name: true, email: true, phone: true } }
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            students: { where: { isActive: true } },
            teachers: { where: { isActive: true } },
            parents: { where: { isActive: true } },
            uploads: true
          }
        }
      }
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: school
    });

  } catch (error) {
    console.error('Get school error:', error);
    return NextResponse.json({
      error: 'Failed to fetch school',
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

    await verifyAdminAccess(session.user.id);

    const schoolId = params.id;
    const body = await request.json();
    const validatedData = updateSchoolSchema.parse(body);

    // Check if school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id: schoolId },
      include: { schoolAdmin: true }
    });

    if (!existingSchool) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Check for duplicate name (if name is being updated)
    if (validatedData.name && validatedData.name !== existingSchool.name) {
      const duplicateName = await prisma.school.findFirst({
        where: { 
          name: validatedData.name,
          id: { not: schoolId },
          isActive: true 
        }
      });

      if (duplicateName) {
        return NextResponse.json({
          error: 'School name already exists'
        }, { status: 400 });
      }
    }

    // Check for duplicate email (if email is being updated)
    if (validatedData.email && validatedData.email !== existingSchool.email) {
      const duplicateEmail = await prisma.school.findFirst({
        where: { 
          email: validatedData.email,
          id: { not: schoolId },
          isActive: true 
        }
      });

      if (duplicateEmail) {
        return NextResponse.json({
          error: 'School email already exists'
        }, { status: 400 });
      }
    }

    let schoolAdminId = existingSchool.schoolAdminId;

    // Handle school admin changes
    if (validatedData.schoolAdminEmail !== undefined) {
      if (validatedData.schoolAdminEmail === '') {
        // Remove school admin
        if (existingSchool.schoolAdmin) {
          await prisma.user.update({
            where: { id: existingSchool.schoolAdmin.id },
            data: { schoolId: null }
          });
        }
        schoolAdminId = null;
      } else {
        // Update or create school admin
        let adminUser = await prisma.user.findUnique({
          where: { email: validatedData.schoolAdminEmail }
        });

        if (adminUser) {
          // Update existing user
          if (adminUser.role !== 'SCHOOL_ADMIN') {
            adminUser = await prisma.user.update({
              where: { id: adminUser.id },
              data: { 
                role: 'SCHOOL_ADMIN',
                accountType: 'B2B',
                schoolId: schoolId
              }
            });
          } else {
            adminUser = await prisma.user.update({
              where: { id: adminUser.id },
              data: { schoolId: schoolId }
            });
          }
          schoolAdminId = adminUser.id;
        } else {
          // Create new admin user
          adminUser = await prisma.user.create({
            data: {
              email: validatedData.schoolAdminEmail,
              name: validatedData.principalName || 'School Admin',
              role: 'SCHOOL_ADMIN',
              accountType: 'B2B',
              phone: validatedData.principalPhone,
              schoolId: schoolId,
              isActive: true
            }
          });
          schoolAdminId = adminUser.id;
        }

        // Remove previous admin's association if different
        if (existingSchool.schoolAdmin && existingSchool.schoolAdmin.id !== adminUser.id) {
          await prisma.user.update({
            where: { id: existingSchool.schoolAdmin.id },
            data: { schoolId: null }
          });
        }
      }
    }

    // Update the school
    const { schoolAdminEmail, ...updateData } = validatedData;
    
    const updatedSchool = await prisma.school.update({
      where: { id: schoolId },
      data: {
        ...updateData,
        schoolAdminId
      },
      include: {
        schoolAdmin: {
          select: { id: true, name: true, email: true, phone: true }
        },
        _count: {
          select: {
            students: { where: { isActive: true } },
            teachers: { where: { isActive: true } },
            parents: { where: { isActive: true } }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedSchool,
      message: 'School updated successfully'
    });

  } catch (error) {
    console.error('Update school error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Failed to update school',
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

    await verifyAdminAccess(session.user.id);

    const schoolId = params.id;

    // Check if school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        _count: {
          select: {
            students: { where: { isActive: true } },
            teachers: { where: { isActive: true } },
            parents: { where: { isActive: true } }
          }
        }
      }
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Check if school has active members
    const totalActiveMembers = school._count.students + school._count.teachers + school._count.parents;
    
    if (totalActiveMembers > 0) {
      return NextResponse.json({
        error: 'Cannot delete school with active members',
        details: `School has ${school._count.students} students, ${school._count.teachers} teachers, and ${school._count.parents} parents`
      }, { status: 400 });
    }

    // Soft delete the school
    await prisma.school.update({
      where: { id: schoolId },
      data: { isActive: false }
    });

    // Remove school admin association
    if (school.schoolAdminId) {
      await prisma.user.update({
        where: { id: school.schoolAdminId },
        data: { schoolId: null }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'School deleted successfully'
    });

  } catch (error) {
    console.error('Delete school error:', error);
    return NextResponse.json({
      error: 'Failed to delete school',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
