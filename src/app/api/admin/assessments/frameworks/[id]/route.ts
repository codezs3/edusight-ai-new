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

    const framework = await prisma.assessmentFramework.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            subjects: true,
            templates: true
          }
        }
      }
    });

    if (!framework) {
      return NextResponse.json({ error: 'Framework not found' }, { status: 404 });
    }

    return NextResponse.json(framework);
  } catch (error) {
    console.error('Error fetching framework:', error);
    return NextResponse.json(
      { error: 'Failed to fetch framework' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description, isActive } = body;

    const framework = await prisma.assessmentFramework.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(code && { code: code.toUpperCase() }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        _count: {
          select: {
            subjects: true,
            templates: true
          }
        }
      }
    });

    return NextResponse.json(framework);
  } catch (error) {
    console.error('Error updating framework:', error);
    return NextResponse.json(
      { error: 'Failed to update framework' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if framework has subjects or templates
    const framework = await prisma.assessmentFramework.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            subjects: true,
            templates: true
          }
        }
      }
    });

    if (!framework) {
      return NextResponse.json({ error: 'Framework not found' }, { status: 404 });
    }

    if (framework._count.subjects > 0 || framework._count.templates > 0) {
      return NextResponse.json(
        { error: 'Cannot delete framework with existing subjects or templates' },
        { status: 400 }
      );
    }

    await prisma.assessmentFramework.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting framework:', error);
    return NextResponse.json(
      { error: 'Failed to delete framework' },
      { status: 500 }
    );
  }
}
