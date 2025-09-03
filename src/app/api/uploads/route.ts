import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed file types
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain'
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('uploadType') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const studentId = formData.get('studentId') as string;
    const schoolId = formData.get('schoolId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'File type not allowed' 
      }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Determine uploader type based on user role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true, teacher: true, parent: true }
    });

    let uploaderType = 'admin';
    if (user?.student) uploaderType = 'student';
    else if (user?.teacher) uploaderType = 'teacher';
    else if (user?.parent) uploaderType = 'parent';
    else if (user?.role === 'ADMIN') uploaderType = 'admin';

    // Save document record to database
    const document = await prisma.documentUpload.create({
      data: {
        fileName,
        originalName,
        fileSize: file.size,
        mimeType: file.type,
        filePath: fileName, // Store relative path
        uploadType: uploadType || 'general',
        category: category || 'other',
        description,
        uploaderId: session.user.id,
        uploaderType,
        studentId: studentId || null,
        schoolId: schoolId || null,
        status: 'pending'
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
      document,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file' 
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
    const uploaderType = searchParams.get('uploaderType');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');
    const schoolId = searchParams.get('schoolId');
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
        // Parents can only see their children's documents
        const parentRecord = await prisma.parent.findUnique({
          where: { userId: session.user.id },
          include: { children: true }
        });
        const childrenIds = parentRecord?.children.map(child => child.id) || [];
        whereClause.studentId = { in: childrenIds };
      } else if (user?.teacher) {
        // Teachers can see documents from their school
        const teacher = await prisma.teacher.findUnique({
          where: { userId: session.user.id }
        });
        if (teacher?.schoolId) {
          whereClause.schoolId = teacher.schoolId;
        }
      } else if (user?.student) {
        // Students can only see their own documents
        whereClause.studentId = user.student.id;
      } else {
        whereClause.uploaderId = session.user.id;
      }
    }

    // Apply filters
    if (uploaderType) whereClause.uploaderType = uploaderType;
    if (category) whereClause.category = category;
    if (status) whereClause.status = status;
    if (studentId) whereClause.studentId = studentId;
    if (schoolId) whereClause.schoolId = schoolId;

    const [documents, total] = await Promise.all([
      prisma.documentUpload.findMany({
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
      prisma.documentUpload.count({ where: whereClause })
    ]);

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch documents' 
    }, { status: 500 });
  }
}
