import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { readFile } from 'fs/promises';
import { join } from 'path';
import * as pdf from 'pdfjs-dist';
import * as Tesseract from 'tesseract.js';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { studentId, step } = await request.json();
    const documentId = params.id;

    // Get document details
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId },
      include: {
        uploader: { select: { name: true, email: true } },
        student: { select: { id: true, user: { select: { name: true } } } }
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Verify access permissions
    if (document.uploaderId !== session.user.id && document.studentId !== studentId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (step === 'parse') {
      // Extract text content based on file type
      const filePath = join(UPLOAD_DIR, document.fileName);
      let extractedText = '';
      let extractedData: any = {};

      if (document.mimeType === 'application/pdf') {
        extractedData = await processPDF(filePath);
      } else if (document.mimeType?.startsWith('image/')) {
        extractedData = await processImage(filePath);
      } else if (document.mimeType?.includes('spreadsheet') || document.mimeType?.includes('excel')) {
        extractedData = await processSpreadsheet(filePath);
      } else {
        // Plain text or other formats
        const buffer = await readFile(filePath);
        extractedText = buffer.toString('utf-8');
        extractedData = { text: extractedText };
      }

      // Store extracted data
      await prisma.documentUpload.update({
        where: { id: documentId },
        data: {
          status: 'processed',
          extractedData: JSON.stringify(extractedData),
          processedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        extractedData,
        message: 'Document processed successfully'
      });
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 });

  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json({
      error: 'Processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function processPDF(filePath: string): Promise<any> {
  try {
    const buffer = await readFile(filePath);
    const pdf_doc = await pdf.getDocument({ data: buffer }).promise;
    
    let fullText = '';
    const pages: any[] = [];
    
    for (let i = 1; i <= pdf_doc.numPages; i++) {
      const page = await pdf_doc.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
      pages.push({
        pageNumber: i,
        text: pageText,
        metadata: {
          width: page.view[2],
          height: page.view[3]
        }
      });
    }

    // Extract structured data from text
    const structuredData = extractAcademicData(fullText);

    return {
      type: 'pdf',
      pages,
      fullText,
      structuredData,
      metadata: {
        pageCount: pdf_doc.numPages,
        processedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function processImage(filePath: string): Promise<any> {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: m => console.log(m)
    });

    const structuredData = extractAcademicData(text);

    return {
      type: 'image',
      extractedText: text,
      structuredData,
      metadata: {
        processedAt: new Date().toISOString(),
        ocrEngine: 'tesseract'
      }
    };
  } catch (error) {
    throw new Error(`Image OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function processSpreadsheet(filePath: string): Promise<any> {
  // For now, return a placeholder structure
  // In production, you'd use libraries like xlsx or csv-parser
  return {
    type: 'spreadsheet',
    data: [],
    structuredData: {},
    metadata: {
      processedAt: new Date().toISOString(),
      note: 'Spreadsheet processing not yet implemented'
    }
  };
}

function extractAcademicData(text: string): any {
  const structuredData: any = {
    subjects: [],
    grades: [],
    attendance: null,
    examDates: [],
    teacherComments: [],
    overallGrade: null
  };

  // Extract subject names and grades using regex patterns
  const subjectGradePattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[:;-]?\s*([A-F][+-]?|\d{1,3}(?:\.\d+)?%?|\d{1,2}\/\d{1,2})/gi;
  const matches = text.matchAll(subjectGradePattern);

  for (const match of matches) {
    const subject = match[1].trim();
    const grade = match[2].trim();
    
    structuredData.subjects.push(subject);
    structuredData.grades.push({
      subject,
      grade,
      raw: match[0]
    });
  }

  // Extract attendance percentage
  const attendancePattern = /attendance\s*[:;-]?\s*(\d{1,3}(?:\.\d+)?%?)/gi;
  const attendanceMatch = text.match(attendancePattern);
  if (attendanceMatch) {
    structuredData.attendance = attendanceMatch[0];
  }

  // Extract dates
  const datePattern = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/g;
  const dates = text.match(datePattern);
  if (dates) {
    structuredData.examDates = dates;
  }

  // Extract teacher comments (lines that don't contain grades)
  const lines = text.split('\n');
  const commentLines = lines.filter(line => 
    line.length > 20 && 
    !/[A-F][+-]?|\d{1,3}%/.test(line) &&
    !/^\s*\d+\s*$/.test(line)
  );
  
  structuredData.teacherComments = commentLines.slice(0, 5); // Limit to 5 comments

  // Try to extract overall grade/GPA
  const overallGradePattern = /(overall|total|gpa|cgpa)\s*[:;-]?\s*([A-F][+-]?|\d{1,2}\.\d{1,2}|\d{1,3}%)/gi;
  const overallMatch = text.match(overallGradePattern);
  if (overallMatch) {
    structuredData.overallGrade = overallMatch[0];
  }

  return structuredData;
}
