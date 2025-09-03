import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a teacher
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { teacher: true }
    });

    if (!user?.teacher) {
      return NextResponse.json({ error: 'User is not a teacher' }, { status: 403 });
    }

    // Fetch teacher's school information
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
            website: true
          }
        }
      }
    });

    if (!teacher?.school) {
      return NextResponse.json({ 
        success: true,
        school: null,
        message: 'No school associated with teacher'
      });
    }

    return NextResponse.json({
      success: true,
      school: teacher.school
    });

  } catch (error) {
    console.error('Error fetching teacher school:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch school information' 
    }, { status: 500 });
  }
}
