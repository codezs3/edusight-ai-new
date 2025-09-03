import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, action } = await request.json();
    const studentId = params.id;

    if (action !== 'store') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get document and its processed data
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId },
      include: {
        academicAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        behavioralAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        careerAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        frameworkDetections: { orderBy: { createdAt: 'desc' }, take: 1 },
        dataNormalizations: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (!document.extractedData) {
      return NextResponse.json({ error: 'Document not processed yet' }, { status: 400 });
    }

    // Verify access permissions
    if (document.studentId !== studentId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const extractedData = JSON.parse(document.extractedData);
    
    // Create repository entries for different data categories
    const repositoryEntries = [];

    // Academic data repository
    if (extractedData.structuredData?.grades) {
      const academicData = {
        grades: extractedData.structuredData.grades,
        overallGrade: extractedData.structuredData.overallGrade,
        framework: document.frameworkDetections[0]?.detectedFramework || 'unknown',
        normalizedData: document.dataNormalizations[0] ? 
          JSON.parse(document.dataNormalizations[0].normalizedData) : null,
        analysisResults: document.academicAnalyses[0] ? 
          JSON.parse(document.academicAnalyses[0].results) : null
      };

      const academicRepo = await prisma.studentRepository.create({
        data: {
          studentId,
          documentId,
          repositoryType: 'academic',
          dataCategory: 'grades_and_performance',
          structuredData: JSON.stringify(academicData),
          metadata: JSON.stringify({
            extractionDate: new Date().toISOString(),
            documentType: document.uploadType,
            confidence: document.academicAnalyses[0]?.confidence || 0,
            framework: document.frameworkDetections[0]?.detectedFramework
          })
        }
      });

      repositoryEntries.push(academicRepo);
    }

    // Attendance data repository
    if (extractedData.structuredData?.attendance) {
      const attendanceData = {
        attendance: extractedData.structuredData.attendance,
        period: 'term', // could be derived from document
        year: new Date().getFullYear().toString()
      };

      const attendanceRepo = await prisma.studentRepository.create({
        data: {
          studentId,
          documentId,
          repositoryType: 'academic',
          dataCategory: 'attendance',
          structuredData: JSON.stringify(attendanceData),
          metadata: JSON.stringify({
            extractionDate: new Date().toISOString(),
            documentType: document.uploadType
          })
        }
      });

      repositoryEntries.push(attendanceRepo);
    }

    // Behavioral data repository
    if (document.behavioralAnalyses.length > 0) {
      const behavioralData = {
        riskLevel: document.behavioralAnalyses[0].riskLevel,
        analysisResults: JSON.parse(document.behavioralAnalyses[0].results),
        teacherComments: extractedData.structuredData?.teacherComments || []
      };

      const behavioralRepo = await prisma.studentRepository.create({
        data: {
          studentId,
          documentId,
          repositoryType: 'behavioral',
          dataCategory: 'risk_assessment',
          structuredData: JSON.stringify(behavioralData),
          metadata: JSON.stringify({
            extractionDate: new Date().toISOString(),
            riskLevel: document.behavioralAnalyses[0].riskLevel,
            confidence: document.behavioralAnalyses[0].confidence
          })
        }
      });

      repositoryEntries.push(behavioralRepo);
    }

    // Career data repository
    if (document.careerAnalyses.length > 0) {
      const careerData = {
        recommendedCareers: JSON.parse(document.careerAnalyses[0].recommendedCareers),
        analysisResults: JSON.parse(document.careerAnalyses[0].results),
        subjectStrengths: extractedData.structuredData?.grades || []
      };

      const careerRepo = await prisma.studentRepository.create({
        data: {
          studentId,
          documentId,
          repositoryType: 'career',
          dataCategory: 'career_guidance',
          structuredData: JSON.stringify(careerData),
          metadata: JSON.stringify({
            extractionDate: new Date().toISOString(),
            confidence: document.careerAnalyses[0].confidence
          })
        }
      });

      repositoryEntries.push(careerRepo);
    }

    return NextResponse.json({
      success: true,
      repositoryEntries: repositoryEntries.length,
      entries: repositoryEntries.map(entry => ({
        id: entry.id,
        type: entry.repositoryType,
        category: entry.dataCategory
      })),
      message: `Successfully stored ${repositoryEntries.length} data entries in student repository`
    });

  } catch (error) {
    console.error('Repository storage error:', error);
    return NextResponse.json({
      error: 'Repository storage failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
