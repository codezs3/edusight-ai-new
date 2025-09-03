import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updating parent profile
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
});

// GET /api/parent/profile - Get parent profile
async function getProfile(request: NextRequest, { user }: { user: any }) {
  try {
    // Get parent record with user and school information
    const parent = await prisma.parent.findUnique({
      where: { userId: user.id },
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

    if (!parent) {
      return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: parent
    });

  } catch (error) {
    console.error('Error fetching parent profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/parent/profile - Update parent profile
async function updateProfile(request: NextRequest, { user }: { user: any }) {
  try {
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Update user name
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name
      }
    });

    // Update parent profile
    const updatedParent = await prisma.parent.update({
      where: { userId: user.id },
      data: {
        phone: validatedData.phone,
        address: validatedData.address,
        occupation: validatedData.occupation,
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
      message: 'Profile updated successfully',
      profile: updatedParent
    });

  } catch (error) {
    console.error('Error updating parent profile:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// Export route handlers with middleware
export const GET = withAuth(getProfile, {
  resource: 'USER',
  action: 'READ',
  scope: 'OWN'
});

export const PUT = withAuth(updateProfile, {
  resource: 'USER',
  action: 'UPDATE',
  scope: 'OWN'
});
