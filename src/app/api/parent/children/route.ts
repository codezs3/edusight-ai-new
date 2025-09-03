import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { GRADE_OPTIONS } from '@/constants/grades';

// Validation schema for creating/updating children
const createChildSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  grade: z.enum(GRADE_OPTIONS.map(g => g.value) as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid grade' })
  }),
  section: z.string().optional(),
  rollNumber: z.string().optional(),
  dateOfBirth: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  schoolId: z.string().optional(),
});

// GET /api/parent/children - Get all children for the logged-in parent
async function getChildren(request: NextRequest, { user }: { user: any }) {
  try {
    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
      include: {
        children: {
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
            // Add analytics with limit to prevent large data load
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
              take: 3 // Only latest 3 assessments
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      children: parent.children,
      total: parent.children.length
    });

  } catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json(
      { error: 'Failed to fetch children' },
      { status: 500 }
    );
  }
}

// POST /api/parent/children - Add a new child
async function createChild(request: NextRequest, { user }: { user: any }) {
  try {
    const body = await request.json();
    const validatedData = createChildSchema.parse(body);

    // Get parent record
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id }
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 });
    }

    // Generate child email
    let childEmail = `${validatedData.name.toLowerCase().replace(/\s+/g, '.')}@child.edusight.com`;
    
    // Check for email uniqueness and append number if needed
    let emailCounter = 1;
    while (await prisma.user.findUnique({ where: { email: childEmail } })) {
      childEmail = `${validatedData.name.toLowerCase().replace(/\s+/g, '.')}.${emailCounter}@child.edusight.com`;
      emailCounter++;
    }

    // Create user account for the child
    const childUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: childEmail,
        role: 'STUDENT',
      }
    });

    // Create student record
    const student = await prisma.student.create({
      data: {
        userId: childUser.id,
        parentId: parent.id,
        schoolId: validatedData.schoolId,
        grade: validatedData.grade,
        section: validatedData.section,
        rollNumber: validatedData.rollNumber,
        dateOfBirth: validatedData.dateOfBirth,
        gender: validatedData.gender,
        bloodGroup: validatedData.bloodGroup,
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
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Child added successfully',
      child: student
    });

  } catch (error) {
    console.error('Error adding child:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to add child' },
      { status: 500 }
    );
  }
}

// Export route handlers with middleware
export const GET = withAuth(getChildren, {
  resource: 'STUDENT',
  action: 'READ',
  scope: 'OWN'
});

export const POST = withAuth(createChild, {
  resource: 'STUDENT',
  action: 'CREATE',
  scope: 'OWN'
});