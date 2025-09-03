import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      sessionName,
      description,
      allowedTypes,
      maxFileSize,
      maxFiles,
      autoProcess,
      requireApproval,
      studentId,
      schoolId,
      expiresAt
    } = body;

    // Determine uploader type
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true, teacher: true, parent: true }
    });

    let uploaderType = 'admin';
    if (user?.student) uploaderType = 'student';
    else if (user?.teacher) uploaderType = 'teacher';
    else if (user?.parent) uploaderType = 'parent';
    else if (user?.role === 'ADMIN') uploaderType = 'admin';

    const uploadSession = await prisma.uploadSession.create({
      data: {
        sessionName,
        description,
        uploaderId: session.user.id,
        uploaderType,
        allowedTypes: allowedTypes ? JSON.stringify(allowedTypes) : null,
        maxFileSize: maxFileSize || 10485760, // 10MB default
        maxFiles: maxFiles || 10,
        autoProcess: autoProcess !== false,
        requireApproval: requireApproval === true,
        studentId,
        schoolId,
        expiresAt: expiresAt ? new Date(expiresAt) : null
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
      session: uploadSession,
      message: 'Upload session created successfully'
    });

  } catch (error) {
    console.error('Create upload session error:', error);
    return NextResponse.json({ 
      error: 'Failed to create upload session' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const uploaderType = searchParams.get('uploaderType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true, teacher: true, parent: true }
    });

    let whereClause: any = {};

    // Role-based filtering
    if (user?.role !== 'ADMIN') {
      if (user?.parent) {
        // Parents can see sessions for their children
        const parentRecord = await prisma.parent.findUnique({
          where: { userId: session.user.id },
          include: { children: true }
        });
        const childrenIds = parentRecord?.children.map(child => child.id) || [];
        whereClause.OR = [
          { uploaderId: session.user.id },
          { studentId: { in: childrenIds } }
        ];
      } else if (user?.teacher) {
        // Teachers can see sessions from their school
        const teacher = await prisma.teacher.findUnique({
          where: { userId: session.user.id }
        });
        whereClause.OR = [
          { uploaderId: session.user.id },
          { schoolId: teacher?.schoolId }
        ];
      } else {
        whereClause.uploaderId = session.user.id;
      }
    }

    // Apply filters
    if (status) whereClause.status = status;
    if (uploaderType) whereClause.uploaderType = uploaderType;

    const [sessions, total] = await Promise.all([
      prisma.uploadSession.findMany({
        where: whereClause,
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
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.uploadSession.count({ where: whereClause })
    ]);

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Fetch upload sessions error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch upload sessions' 
    }, { status: 500 });
  }
}
