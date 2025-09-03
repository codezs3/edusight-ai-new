import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { GRADE_OPTIONS } from '@/constants/grades';

// Validation schema for updating children
const updateChildSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email().optional(),
  grade: z.enum(GRADE_OPTIONS.map(g => g.value) as [string, ...string[]]).optional(),
  section: z.string().optional(),
  dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  emergencyContact: z.string().optional(),
  medicalInfo: z.string().optional(),
  specialNeeds: z.string().optional(),
  learningStyle: z.string().optional(),
  interests: z.string().optional(),
});

// GET /api/parent/children/[id] - Get specific child details
async function getChild(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    const childId = params.id;

    // Get parent record to verify ownership
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Parent profile not found' },
        { status: 404 }
      );
    }

    // Get the specific child
    const child = await prisma.student.findFirst({
      where: {
        id: childId,
        parentId: parent.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          }
        },
        school: {
          select: {
            id: true,
            name: true,
            board: true,
          }
        },
        assessments: {
          select: {
            id: true,
            createdAt: true,
            score: true,
            subject: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!child) {
      return NextResponse.json(
        { success: false, error: 'Child not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      child,
    });

  } catch (error) {
    console.error('Error fetching child:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch child details' },
      { status: 500 }
    );
  }
}

// PUT /api/parent/children/[id] - Update child information
async function updateChild(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    const childId = params.id;
    const body = await request.json();

    // Validate the request body
    const validatedData = updateChildSchema.parse(body);

    // Get parent record to verify ownership
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Parent profile not found' },
        { status: 404 }
      );
    }

    // Verify child belongs to this parent
    const existingChild = await prisma.student.findFirst({
      where: {
        id: childId,
        parentId: parent.id,
      },
      include: {
        user: true
      }
    });

    if (!existingChild) {
      return NextResponse.json(
        { success: false, error: 'Child not found or access denied' },
        { status: 404 }
      );
    }

    // Update child and user information in a transaction
    const updatedChild = await prisma.$transaction(async (tx) => {
      // Update user information if provided
      const userUpdateData: any = {};
      if (validatedData.name) userUpdateData.name = validatedData.name;
      if (validatedData.email) userUpdateData.email = validatedData.email;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: existingChild.userId },
          data: userUpdateData,
        });
      }

      // Update student information
      const studentUpdateData: any = {};
      if (validatedData.grade) studentUpdateData.grade = validatedData.grade;
      if (validatedData.section !== undefined) studentUpdateData.section = validatedData.section;
      if (validatedData.dateOfBirth !== undefined) studentUpdateData.dateOfBirth = validatedData.dateOfBirth;
      if (validatedData.gender !== undefined) studentUpdateData.gender = validatedData.gender;
      if (validatedData.bloodGroup !== undefined) studentUpdateData.bloodGroup = validatedData.bloodGroup;

      const updatedStudent = await tx.student.update({
        where: { id: childId },
        data: studentUpdateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
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

      return updatedStudent;
    });

    return NextResponse.json({
      success: true,
      message: 'Child information updated successfully',
      child: updatedChild,
    });

  } catch (error) {
    console.error('Error updating child:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update child information' },
      { status: 500 }
    );
  }
}

// DELETE /api/parent/children/[id] - Remove child (soft delete)
async function deleteChild(request: NextRequest, { user, params }: { user: any; params: { id: string } }) {
  try {
    const childId = params.id;

    // Get parent record to verify ownership
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
    });

    if (!parent) {
      return NextResponse.json(
        { success: false, error: 'Parent profile not found' },
        { status: 404 }
      );
    }

    // Verify child belongs to this parent
    const existingChild = await prisma.student.findFirst({
      where: {
        id: childId,
        parentId: parent.id,
      },
      include: {
        user: true
      }
    });

    if (!existingChild) {
      return NextResponse.json(
        { success: false, error: 'Child not found or access denied' },
        { status: 404 }
      );
    }

    // Soft delete (deactivate) the child and user in a transaction
    await prisma.$transaction(async (tx) => {
      // Deactivate the student record
      await tx.student.update({
        where: { id: childId },
        data: { isActive: false },
      });

      // Deactivate the user record
      await tx.user.update({
        where: { id: existingChild.userId },
        data: { isActive: false },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Child removed successfully',
    });

  } catch (error) {
    console.error('Error deleting child:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove child' },
      { status: 500 }
    );
  }
}

// Apply authentication middleware and export handlers
export const GET = withAuth(getChild, {
  resource: 'STUDENT',
  action: 'READ',
  scope: 'OWN'
});

export const PUT = withAuth(updateChild, {
  resource: 'STUDENT',
  action: 'UPDATE',
  scope: 'OWN'
});

export const DELETE = withAuth(deleteChild, {
  resource: 'STUDENT',
  action: 'DELETE',
  scope: 'OWN'
});