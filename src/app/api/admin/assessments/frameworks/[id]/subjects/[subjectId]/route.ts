import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; subjectId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description, isActive } = body;

    const subject = await prisma.frameworkSubject.update({
      where: { id: params.subjectId },
      data: {
        ...(name && { name }),
        ...(code && { code: code.toUpperCase() }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        _count: {
          select: {
            assessmentTypes: true
          }
        }
      }
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; subjectId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if subject has assessment types
    const subject = await prisma.frameworkSubject.findUnique({
      where: { id: params.subjectId },
      include: {
        _count: {
          select: {
            assessmentTypes: true
          }
        }
      }
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    if (subject._count.assessmentTypes > 0) {
      return NextResponse.json(
        { error: 'Cannot delete subject with existing assessment types' },
        { status: 400 }
      );
    }

    await prisma.frameworkSubject.delete({
      where: { id: params.subjectId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    );
  }
}
