import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subjects = await prisma.frameworkSubject.findMany({
      where: { 
        frameworkId: params.id,
        isActive: true 
      },
      include: {
        _count: {
          select: {
            assessmentTypes: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    // Check if subject already exists in this framework
    const existingSubject = await prisma.frameworkSubject.findFirst({
      where: { 
        frameworkId: params.id,
        name
      }
    });

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Subject already exists in this framework' },
        { status: 409 }
      );
    }

    const subject = await prisma.frameworkSubject.create({
      data: {
        frameworkId: params.id,
        name,
        code: code.toUpperCase(),
        description
      },
      include: {
        _count: {
          select: {
            assessmentTypes: true
          }
        }
      }
    });

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}
