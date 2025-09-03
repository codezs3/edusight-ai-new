import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'guest');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed file types for guest uploads
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// In-memory storage for guest sessions (in production, use Redis or database)
const guestSessions = new Map<string, {
  id: string;
  studentName: string;
  studentGrade: string;
  documents: any[];
  createdAt: Date;
  expiresAt: Date;
}>();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadType = formData.get('uploadType') as string;
    const category = formData.get('category') as string;
    const studentName = formData.get('studentName') as string;
    const studentGrade = formData.get('studentGrade') as string;

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!studentName || !studentGrade) {
      return NextResponse.json({ error: 'Student name and grade are required' }, { status: 400 });
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
        error: 'File type not allowed. Please upload PDF, images, or document files.' 
      }, { status: 400 });
    }

    // Create upload directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique identifiers
    const guestSessionId = uuidv4();
    const documentId = uuidv4();
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const fileName = `guest_${timestamp}_${documentId}.${extension}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create document record
    const documentRecord = {
      id: documentId,
      fileName,
      originalName,
      fileSize: file.size,
      mimeType: file.type,
      filePath: fileName,
      uploadType: uploadType || 'report_cards',
      category: category || 'academic',
      status: 'pending',
      createdAt: new Date(),
      isGuest: true
    };

    // Create or update guest session
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours expiry

    const guestSession = {
      id: guestSessionId,
      studentName,
      studentGrade,
      documents: [documentRecord],
      createdAt: now,
      expiresAt
    };

    guestSessions.set(guestSessionId, guestSession);

    // Set cleanup timer for expired sessions (basic cleanup)
    setTimeout(() => {
      cleanupExpiredSessions();
    }, 60 * 60 * 1000); // Clean up every hour

    // Mock extracted data for demonstration
    const mockExtractedData = generateMockData(studentName, studentGrade, uploadType);

    return NextResponse.json({
      success: true,
      guestSessionId,
      document: {
        id: documentId,
        fileName: originalName,
        status: 'uploaded',
        extractedData: mockExtractedData
      },
      session: {
        id: guestSessionId,
        studentName,
        studentGrade,
        expiresAt: expiresAt.toISOString()
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Guest upload error:', error);
    return NextResponse.json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Cleanup function for expired guest sessions
function cleanupExpiredSessions() {
  const now = new Date();
  for (const [sessionId, session] of guestSessions.entries()) {
    if (session.expiresAt < now) {
      guestSessions.delete(sessionId);
    }
  }
}

// Generate mock data for demonstration purposes
function generateMockData(studentName: string, grade: string, uploadType: string) {
  const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'Computer Science'];
  const frameworks = ['CBSE', 'ICSE', 'IGCSE', 'IB'];
  
  // Generate realistic grades based on grade level
  const generateGrade = () => {
    const gradeLevel = parseInt(grade);
    if (gradeLevel <= 5) {
      // Elementary grades (A-E system)
      return ['A+', 'A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 5)];
    } else {
      // Higher grades (percentage system)
      return `${Math.floor(Math.random() * 30) + 70}%`; // 70-100%
    }
  };

  const mockGrades = subjects.map(subject => ({
    subject,
    grade: generateGrade(),
    raw: `${subject}: ${generateGrade()}`
  }));

  return {
    type: 'mock_data',
    studentInfo: {
      name: studentName,
      grade: grade,
      uploadType
    },
    structuredData: {
      subjects: subjects,
      grades: mockGrades,
      attendance: `${Math.floor(Math.random() * 10) + 90}%`, // 90-100%
      framework: frameworks[Math.floor(Math.random() * frameworks.length)],
      overallGrade: generateGrade(),
      teacherComments: [
        `${studentName} shows consistent performance across subjects.`,
        'Good participation in class activities.',
        'Demonstrates strong analytical thinking skills.'
      ]
    },
    metadata: {
      extractionMethod: 'mock_generation',
      confidence: 0.95,
      documentType: uploadType,
      processedAt: new Date().toISOString()
    }
  };
}

export async function GET(request: NextRequest) {
  // Endpoint to retrieve guest session info
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const session = guestSessions.get(sessionId);
  
  if (!session) {
    return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
  }

  // Check if session is expired
  if (session.expiresAt < new Date()) {
    guestSessions.delete(sessionId);
    return NextResponse.json({ error: 'Session expired' }, { status: 410 });
  }

  return NextResponse.json({
    success: true,
    session: {
      id: session.id,
      studentName: session.studentName,
      studentGrade: session.studentGrade,
      documentsCount: session.documents.length,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt
    }
  });
}
