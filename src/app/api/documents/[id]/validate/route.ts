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

    const { studentId } = await request.json();
    const documentId = params.id;

    // Get document with extracted data
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (!document.extractedData) {
      return NextResponse.json({ error: 'Document not processed yet' }, { status: 400 });
    }

    const extractedData = JSON.parse(document.extractedData);
    const validationResults = validateExtractedData(extractedData);

    // Update document with validation results
    await prisma.documentUpload.update({
      where: { id: documentId },
      data: {
        status: validationResults.isValid ? 'validated' : 'validation_failed',
        validationResults: JSON.stringify(validationResults)
      }
    });

    return NextResponse.json({
      success: true,
      validation: validationResults,
      message: validationResults.isValid ? 'Data validation passed' : 'Data validation completed with warnings'
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function validateExtractedData(extractedData: any): any {
  const validation = {
    isValid: true,
    score: 0,
    issues: [] as string[],
    warnings: [] as string[],
    recommendations: [] as string[],
    dataQuality: {
      completeness: 0,
      accuracy: 0,
      consistency: 0,
      relevance: 0
    }
  };

  // Check data completeness
  if (extractedData.structuredData) {
    const { subjects, grades, attendance, overallGrade } = extractedData.structuredData;
    
    let completenessScore = 0;
    let totalChecks = 4;

    // Check if subjects are present
    if (subjects && subjects.length > 0) {
      completenessScore += 25;
    } else {
      validation.issues.push('No subjects detected in the document');
    }

    // Check if grades are present
    if (grades && grades.length > 0) {
      completenessScore += 25;
    } else {
      validation.issues.push('No grades detected in the document');
    }

    // Check if attendance is present
    if (attendance) {
      completenessScore += 25;
    } else {
      validation.warnings.push('Attendance information not found');
    }

    // Check if overall grade is present
    if (overallGrade) {
      completenessScore += 25;
    } else {
      validation.warnings.push('Overall grade/GPA not found');
    }

    validation.dataQuality.completeness = completenessScore;
  } else {
    validation.issues.push('No structured data extracted from document');
    validation.dataQuality.completeness = 0;
  }

  // Check data accuracy (basic heuristics)
  let accuracyScore = 100;
  
  if (extractedData.structuredData?.grades) {
    const grades = extractedData.structuredData.grades;
    
    // Check for reasonable grade formats
    const validGradeFormats = grades.filter((g: any) => {
      const grade = g.grade;
      return /^[A-F][+-]?$/.test(grade) || 
             /^\d{1,3}(\.\d+)?%?$/.test(grade) || 
             /^\d{1,2}\/\d{1,2}$/.test(grade);
    });

    if (validGradeFormats.length < grades.length * 0.8) {
      accuracyScore -= 30;
      validation.warnings.push('Some grades may not be in standard format');
    }

    // Check for duplicate subjects
    const subjects = grades.map((g: any) => g.subject.toLowerCase());
    const uniqueSubjects = new Set(subjects);
    if (subjects.length !== uniqueSubjects.size) {
      accuracyScore -= 20;
      validation.warnings.push('Duplicate subjects detected');
    }
  }

  validation.dataQuality.accuracy = Math.max(0, accuracyScore);

  // Check data consistency
  let consistencyScore = 100;
  
  if (extractedData.structuredData?.grades?.length > 0) {
    const grades = extractedData.structuredData.grades;
    const gradeFormats = grades.map((g: any) => {
      if (/^[A-F][+-]?$/.test(g.grade)) return 'letter';
      if (/^\d{1,3}(\.\d+)?%?$/.test(g.grade)) return 'percentage';
      if (/^\d{1,2}\/\d{1,2}$/.test(g.grade)) return 'fraction';
      return 'other';
    });

    const formatCounts = gradeFormats.reduce((acc: any, format) => {
      acc[format] = (acc[format] || 0) + 1;
      return acc;
    }, {});

    const dominantFormat = Object.keys(formatCounts).reduce((a, b) => 
      formatCounts[a] > formatCounts[b] ? a : b
    );

    const consistencyRatio = formatCounts[dominantFormat] / grades.length;
    if (consistencyRatio < 0.8) {
      consistencyScore -= 40;
      validation.warnings.push('Inconsistent grade formats detected');
    }
  }

  validation.dataQuality.consistency = Math.max(0, consistencyScore);

  // Check data relevance
  let relevanceScore = 100;
  
  if (extractedData.type === 'pdf' && extractedData.fullText) {
    const text = extractedData.fullText.toLowerCase();
    const academicKeywords = [
      'grade', 'score', 'subject', 'exam', 'test', 'assessment',
      'student', 'class', 'semester', 'term', 'gpa', 'cgpa'
    ];
    
    const foundKeywords = academicKeywords.filter(keyword => 
      text.includes(keyword)
    );

    if (foundKeywords.length < academicKeywords.length * 0.3) {
      relevanceScore -= 50;
      validation.warnings.push('Document may not be an academic report');
    }
  }

  validation.dataQuality.relevance = Math.max(0, relevanceScore);

  // Calculate overall score
  const { completeness, accuracy, consistency, relevance } = validation.dataQuality;
  validation.score = Math.round((completeness + accuracy + consistency + relevance) / 4);

  // Determine if validation passes
  validation.isValid = validation.score >= 60 && validation.issues.length === 0;

  // Generate recommendations
  if (validation.dataQuality.completeness < 50) {
    validation.recommendations.push('Consider uploading additional documents with complete grade information');
  }
  
  if (validation.dataQuality.accuracy < 70) {
    validation.recommendations.push('Manual verification of extracted grades may be needed');
  }
  
  if (validation.dataQuality.consistency < 70) {
    validation.recommendations.push('Document contains mixed grade formats - normalization will be applied');
  }
  
  if (validation.dataQuality.relevance < 70) {
    validation.recommendations.push('Ensure uploaded document is an official academic report or transcript');
  }

  return validation;
}
