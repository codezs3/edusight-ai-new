import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { unlink } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const document = await prisma.documentUpload.findUnique({
      where: { id: params.id },
      include: {
        uploader: {
          select: { name: true, email: true }
        },
        student: {
          select: { id: true, user: { select: { name: true } } }
        },
        school: {
          select: { id: true, name: true }
        }
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check permissions
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true, teacher: true, parent: true }
    });

    let hasAccess = false;

    if (user?.role === 'ADMIN') {
      hasAccess = true;
    } else if (document.uploaderId === session.user.id) {
      hasAccess = true;
    } else if (user?.parent) {
      const parentRecord = await prisma.parent.findUnique({
        where: { userId: session.user.id },
        include: { children: true }
      });
      const childrenIds = parentRecord?.children.map(child => child.id) || [];
      hasAccess = childrenIds.includes(document.studentId || '');
    } else if (user?.teacher && user.teacher.schoolId === document.schoolId) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ document });

  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json({ 
      error: 'Failed to get document' 
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

    const body = await request.json();
    const { 
      status, 
      category, 
      description, 
      tags, 
      processingNotes, 
      confidentiality,
      isValidated,
      validationNotes
    } = body;

    const document = await prisma.documentUpload.findUnique({
      where: { id: params.id }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check permissions (only admin, uploader, or school staff can update)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { teacher: true }
    });

    let canUpdate = false;
    if (user?.role === 'ADMIN') {
      canUpdate = true;
    } else if (document.uploaderId === session.user.id) {
      canUpdate = true;
    } else if (user?.teacher && user.teacher.schoolId === document.schoolId) {
      canUpdate = true;
    }

    if (!canUpdate) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const updatedDocument = await prisma.documentUpload.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(category && { category }),
        ...(description && { description }),
        ...(tags && { tags }),
        ...(processingNotes && { 
          processingNotes,
          processedAt: new Date(),
          processedBy: session.user.id
        }),
        ...(confidentiality && { confidentiality }),
        ...(typeof isValidated === 'boolean' && { isValidated }),
        ...(validationNotes && { validationNotes }),
        ...(status === 'completed' && { processedAt: new Date(), processedBy: session.user.id })
      },
      include: {
        uploader: {
          select: { name: true, email: true }
        },
        student: {
          select: { id: true, user: { select: { name: true } } }
        },
        school: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      message: 'Document updated successfully'
    });

  } catch (error) {
    console.error('Update document error:', error);
    return NextResponse.json({ 
      error: 'Failed to update document' 
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

    const document = await prisma.documentUpload.findUnique({
      where: { id: params.id }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check permissions (only admin or uploader can delete)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (user?.role !== 'ADMIN' && document.uploaderId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete file from disk
    try {
      const filePath = join(UPLOAD_DIR, document.filePath);
      await unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await prisma.documentUpload.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete document' 
    }, { status: 500 });
  }
}
