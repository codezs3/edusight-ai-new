import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';
import { mlService } from '@/lib/tensorflow';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, studentId } = await request.json();

    // Get document and extracted data
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId }
    });

    if (!document || !document.extractedData) {
      return NextResponse.json({ error: 'Document or extracted data not found' }, { status: 404 });
    }

    const extractedData = JSON.parse(document.extractedData);
    
    // Get student information for context
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Initialize ML service if not already done
    await mlService.initialize();

    // Prepare academic analysis data
    const academicData = prepareAcademicData(extractedData, student);
    
    // Run academic performance prediction
    const academicAnalysis = await mlService.academicPredictor.predict(academicData);

    // Store analysis results
    const analysis = await prisma.academicAnalysis.create({
      data: {
        documentId,
        studentId,
        analysisType: 'academic_performance',
        inputData: JSON.stringify(academicData),
        results: JSON.stringify(academicAnalysis),
        confidence: academicAnalysis.confidence || 0.85,
        status: 'completed',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      analysis: academicAnalysis,
      analysisId: analysis.id,
      message: 'Academic analysis completed successfully'
    });

  } catch (error) {
    console.error('Academic analysis error:', error);
    return NextResponse.json({
      error: 'Academic analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function prepareAcademicData(extractedData: any, student: any): any {
  const academicData: any = {
    studentId: student.id,
    grade: student.grade || '10',
    subjects: [],
    overallPerformance: {},
    historicalData: []
  };

  // Process extracted grades
  if (extractedData.structuredData?.grades) {
    academicData.subjects = extractedData.structuredData.grades.map((gradeData: any) => {
      const normalizedScore = normalizeGradeToScore(gradeData.grade);
      return {
        name: gradeData.subject,
        score: normalizedScore,
        grade: gradeData.grade,
        rawData: gradeData.raw
      };
    });
  }

  // Calculate overall performance metrics
  if (academicData.subjects.length > 0) {
    const scores = academicData.subjects.map((s: any) => s.score).filter((s: number) => !isNaN(s));
    if (scores.length > 0) {
      academicData.overallPerformance = {
        averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        maxScore: Math.max(...scores),
        minScore: Math.min(...scores),
        subjectCount: scores.length,
        standardDeviation: calculateStandardDeviation(scores)
      };
    }
  }

  // Add historical context from previous assessments
  if (student.assessments) {
    academicData.historicalData = student.assessments.map((assessment: any) => ({
      date: assessment.createdAt,
      type: assessment.assessmentType,
      score: assessment.totalScore || 0,
      framework: assessment.framework
    }));
  }

  // Add attendance if available
  if (extractedData.structuredData?.attendance) {
    const attendanceMatch = extractedData.structuredData.attendance.match(/(\d+(?:\.\d+)?)/);
    if (attendanceMatch) {
      academicData.attendance = parseFloat(attendanceMatch[1]);
    }
  }

  return academicData;
}

function normalizeGradeToScore(grade: string): number {
  // Remove whitespace
  grade = grade.trim();

  // Letter grades (A-F)
  if (/^[A-F][+-]?$/i.test(grade)) {
    const letterGrades: { [key: string]: number } = {
      'A+': 97, 'A': 94, 'A-': 90,
      'B+': 87, 'B': 84, 'B-': 80,
      'C+': 77, 'C': 74, 'C-': 70,
      'D+': 67, 'D': 64, 'D-': 60,
      'F': 50
    };
    return letterGrades[grade.toUpperCase()] || 0;
  }

  // Percentage grades
  if (/^\d{1,3}(\.\d+)?%?$/.test(grade)) {
    const numMatch = grade.match(/(\d{1,3}(?:\.\d+)?)/);
    if (numMatch) {
      return Math.min(100, parseFloat(numMatch[1]));
    }
  }

  // Fraction grades (e.g., 85/100)
  if (/^\d{1,2}\/\d{1,2}$/.test(grade)) {
    const parts = grade.split('/');
    const numerator = parseInt(parts[0]);
    const denominator = parseInt(parts[1]);
    return Math.round((numerator / denominator) * 100);
  }

  // GPA scale (0-4)
  if (/^\d(\.\d+)?$/.test(grade)) {
    const gpa = parseFloat(grade);
    if (gpa <= 4) {
      return Math.round((gpa / 4) * 100);
    }
  }

  // Default fallback
  return 0;
}

function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}
