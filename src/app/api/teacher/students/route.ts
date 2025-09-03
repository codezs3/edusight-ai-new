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

    // Fetch students from teacher's school
    const teacher = await prisma.teacher.findUnique({
      where: { userId: session.user.id },
      include: {
        school: {
          include: {
            students: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!teacher?.school) {
      return NextResponse.json({ 
        success: true,
        students: [],
        message: 'No school associated with teacher'
      });
    }

    return NextResponse.json({
      success: true,
      students: teacher.school.students
    });

  } catch (error) {
    console.error('Error fetching teacher students:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch students' 
    }, { status: 500 });
  }
}
