import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { readFile } from 'fs/promises';
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
      where: { id: params.id }
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
    } else if (user?.student && user.student.id === document.studentId) {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    try {
      const filePath = join(UPLOAD_DIR, document.filePath);
      const fileBuffer = await readFile(filePath);

      const response = new NextResponse(fileBuffer);
      response.headers.set('Content-Type', document.mimeType);
      response.headers.set('Content-Disposition', `attachment; filename="${document.originalName}"`);
      response.headers.set('Content-Length', document.fileSize.toString());

      return response;

    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json({ 
        error: 'File not found on server' 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Failed to download file' 
    }, { status: 500 });
  }
}
