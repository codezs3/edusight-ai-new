import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { GRADE_OPTIONS } from '@/constants/grades';

// Validation schema for updating children
const updateChildSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  grade: z.enum(GRADE_OPTIONS.map(g => g.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid grade' })
  }).optional(),
  section: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  schoolId: z.string().optional(),
});

// GET /api/parent/children/[id] - Get specific child details
async function getChild(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id }
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 });
    }

    // Get child details (ensure it belongs to this parent)
    const child = await prisma.student.findFirst({
      where: {
        id: params.id,
        parentId: parent.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          }
        },
        school: {
          select: {
            id: true,
            name: true,
            board: true,
            type: true,
          }
        },
        uploads: {
          select: {
            id: true,
            originalName: true,
            uploadType: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      child
    });

  } catch (error) {
    console.error('Error fetching child details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch child details' },
      { status: 500 }
    );
  }
}

// PUT /api/parent/children/[id] - Update child information
async function updateChild(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = updateChildSchema.parse(body);

    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id }
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 });
    }

    // Check if child belongs to this parent
    const existingChild = await prisma.student.findFirst({
      where: {
        id: params.id,
        parentId: parent.id
      },
      include: {
        user: true
      }
    });

    if (!existingChild) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Prepare update data for both User and Student models
    const userUpdateData: any = {};
    const studentUpdateData: any = {};

    if (validatedData.name) {
      userUpdateData.name = validatedData.name;
    }

    if (validatedData.schoolId) {
      userUpdateData.schoolId = validatedData.schoolId;
      studentUpdateData.schoolId = validatedData.schoolId;
    }

    if (validatedData.grade) studentUpdateData.grade = validatedData.grade;
    if (validatedData.section) studentUpdateData.section = validatedData.section;
    if (validatedData.rollNumber) studentUpdateData.rollNumber = validatedData.rollNumber;
    if (validatedData.dateOfBirth) studentUpdateData.dateOfBirth = validatedData.dateOfBirth;
    if (validatedData.gender) studentUpdateData.gender = validatedData.gender;
    if (validatedData.bloodGroup) studentUpdateData.bloodGroup = validatedData.bloodGroup;

    // Use transaction to update both User and Student
    const updatedChild = await prisma.$transaction(async (tx) => {
      // Update user record if needed
      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingChild.userId },
          data: userUpdateData
        });
      }

      // Update student record
      const student = await tx.student.update({
        where: { id: params.id },
        data: studentUpdateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              updatedAt: true,
            }
          },
          school: {
            select: {
              id: true,
              name: true,
              board: true,
            }
          }
        }
      });

      return student;
    });

    return NextResponse.json({
      success: true,
      message: 'Child updated successfully',
      child: updatedChild
    });

  } catch (error) {
    console.error('Error updating child:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update child' },
      { status: 500 }
    );
  }
}

// DELETE /api/parent/children/[id] - Remove child (soft delete)
async function deleteChild(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id }
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 });
    }

    // Check if child belongs to this parent
    const existingChild = await prisma.student.findFirst({
      where: {
        id: params.id,
        parentId: parent.id
      },
      include: {
        user: true
      }
    });

    if (!existingChild) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false for both User and Student
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: existingChild.userId },
        data: { isActive: false }
      });

      await tx.student.update({
        where: { id: params.id },
        data: { isActive: false }
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Child removed successfully'
    });

  } catch (error) {
    console.error('Error removing child:', error);
    return NextResponse.json(
      { error: 'Failed to remove child' },
      { status: 500 }
    );
  }
}

// Export route handlers with middleware
export const GET = withAuth(getChild, {
  permissions: ['MANAGE_OWN_CHILDREN'],
  resourceType: 'student'
});

export const PUT = withAuth(updateChild, {
  permissions: ['MANAGE_OWN_CHILDREN'],
  resourceType: 'student'
});

export const DELETE = withAuth(deleteChild, {
  permissions: ['MANAGE_OWN_CHILDREN'],
  resourceType: 'student'
});