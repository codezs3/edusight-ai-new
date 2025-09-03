import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, studentId, framework } = await request.json();

    // Get document and extracted data
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId }
    });

    if (!document || !document.extractedData) {
      return NextResponse.json({ error: 'Document or extracted data not found' }, { status: 404 });
    }

    const extractedData = JSON.parse(document.extractedData);
    
    // Normalize data according to framework
    const normalizationResult = normalizeDataToFramework(extractedData, framework);

    // Store normalization results
    await prisma.dataNormalization.create({
      data: {
        documentId,
        studentId,
        framework: framework || 'generic',
        originalData: JSON.stringify(extractedData.structuredData),
        normalizedData: JSON.stringify(normalizationResult.normalizedData),
        mappings: JSON.stringify(normalizationResult.mappings),
        warnings: JSON.stringify(normalizationResult.warnings),
        status: 'completed',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      framework: framework || 'generic',
      normalizedData: normalizationResult.normalizedData,
      mappings: normalizationResult.mappings,
      warnings: normalizationResult.warnings,
      message: 'Data normalization completed successfully'
    });

  } catch (error) {
    console.error('Data normalization error:', error);
    return NextResponse.json({
      error: 'Data normalization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function normalizeDataToFramework(extractedData: any, framework: string): any {
  const result = {
    normalizedData: {
      subjects: [] as any[],
      overallScore: null as number | null,
      gradeLevel: null as string | null,
      attendance: null as number | null,
      framework: framework || 'generic',
      standardizedScores: {} as any
    },
    mappings: [] as any[],
    warnings: [] as string[]
  };

  const structuredData = extractedData.structuredData || {};

  // Normalize subjects and grades based on framework
  if (structuredData.grades && Array.isArray(structuredData.grades)) {
    structuredData.grades.forEach((gradeEntry: any, index: number) => {
      const normalizedSubject = normalizeSubject(gradeEntry, framework, index);
      if (normalizedSubject) {
        result.normalizedData.subjects.push(normalizedSubject);
        result.mappings.push({
          original: gradeEntry,
          normalized: normalizedSubject,
          transformation: normalizedSubject.transformation
        });
      }
    });
  }

  // Calculate overall normalized score
  if (result.normalizedData.subjects.length > 0) {
    const scores = result.normalizedData.subjects
      .map(s => s.normalizedScore)
      .filter(s => !isNaN(s));
    
    if (scores.length > 0) {
      result.normalizedData.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }
  }

  // Normalize attendance
  if (structuredData.attendance) {
    const attendanceMatch = structuredData.attendance.match(/(\d+(?:\.\d+)?)/);
    if (attendanceMatch) {
      result.normalizedData.attendance = parseFloat(attendanceMatch[1]);
    }
  }

  // Generate standardized scores for different scales
  result.normalizedData.standardizedScores = generateStandardizedScores(
    result.normalizedData.subjects,
    framework
  );

  // Add framework-specific validations and warnings
  addFrameworkWarnings(result, framework, structuredData);

  return result;
}

function normalizeSubject(gradeEntry: any, framework: string, index: number): any | null {
  const subject = gradeEntry.subject;
  const grade = gradeEntry.grade;

  if (!subject || !grade) {
    return null;
  }

  const normalized = {
    originalSubject: subject,
    normalizedSubject: normalizeSubjectName(subject, framework),
    originalGrade: grade,
    normalizedScore: 0,
    letterGrade: null as string | null,
    gpaEquivalent: null as number | null,
    percentageEquivalent: null as number | null,
    framework: framework || 'generic',
    transformation: [] as string[]
  };

  // Normalize grade based on framework
  switch (framework) {
    case 'IB':
      normalized.normalizedScore = normalizeIBGrade(grade);
      break;
    case 'IGCSE':
      normalized.normalizedScore = normalizeIGCSEGrade(grade);
      break;
    case 'CBSE':
      normalized.normalizedScore = normalizeCBSEGrade(grade);
      break;
    case 'ICSE':
      normalized.normalizedScore = normalizeICSEGrade(grade);
      break;
    case 'A_LEVELS':
      normalized.normalizedScore = normalizeALevelGrade(grade);
      break;
    case 'GCSE':
      normalized.normalizedScore = normalizeGCSEGrade(grade);
      break;
    default:
      normalized.normalizedScore = normalizeGenericGrade(grade);
      normalized.transformation.push('Generic normalization applied');
  }

  // Generate equivalent scores
  normalized.letterGrade = scoreToLetterGrade(normalized.normalizedScore);
  normalized.gpaEquivalent = scoreToGPA(normalized.normalizedScore);
  normalized.percentageEquivalent = normalized.normalizedScore;

  return normalized;
}

function normalizeSubjectName(subject: string, framework: string): string {
  const subjectLower = subject.toLowerCase().trim();

  // Common subject mappings across frameworks
  const subjectMappings: { [key: string]: string } = {
    // Mathematics
    'math': 'Mathematics',
    'mathematics': 'Mathematics',
    'maths': 'Mathematics',
    'calculus': 'Mathematics (Calculus)',
    'algebra': 'Mathematics (Algebra)',
    'geometry': 'Mathematics (Geometry)',
    'statistics': 'Mathematics (Statistics)',

    // Sciences
    'physics': 'Physics',
    'chemistry': 'Chemistry', 
    'biology': 'Biology',
    'bio': 'Biology',
    'chem': 'Chemistry',
    'science': 'Science (General)',

    // Languages
    'english': 'English',
    'eng': 'English',
    'english language': 'English Language',
    'english literature': 'English Literature',
    'hindi': 'Hindi',
    'french': 'French',
    'spanish': 'Spanish',

    // Social Studies
    'history': 'History',
    'geography': 'Geography',
    'social studies': 'Social Studies',
    'civics': 'Civics',
    'politics': 'Political Science',
    'economics': 'Economics',

    // Arts
    'art': 'Art',
    'music': 'Music',
    'drama': 'Drama',
    'dance': 'Dance',

    // Technology
    'computer science': 'Computer Science',
    'computing': 'Computer Science',
    'information technology': 'Information Technology',
    'it': 'Information Technology',

    // Physical Education
    'physical education': 'Physical Education',
    'pe': 'Physical Education',
    'sports': 'Physical Education'
  };

  // Framework-specific mappings
  if (framework === 'IB') {
    const ibMappings: { [key: string]: string } = {
      'tok': 'Theory of Knowledge',
      'theory of knowledge': 'Theory of Knowledge',
      'extended essay': 'Extended Essay',
      'cas': 'Creativity, Activity, Service'
    };
    Object.assign(subjectMappings, ibMappings);
  }

  // Look for direct mapping
  if (subjectMappings[subjectLower]) {
    return subjectMappings[subjectLower];
  }

  // Try partial matches
  for (const [key, value] of Object.entries(subjectMappings)) {
    if (subjectLower.includes(key) || key.includes(subjectLower)) {
      return value;
    }
  }

  // Return original with proper capitalization
  return subject.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function normalizeIBGrade(grade: string): number {
  const gradeStr = grade.trim();
  
  // IB grades are 1-7, with 7 being the highest
  const ibMatch = gradeStr.match(/([1-7])/);
  if (ibMatch) {
    const ibScore = parseInt(ibMatch[1]);
    // Convert IB 1-7 scale to 0-100 percentage
    const conversion = [0, 45, 55, 65, 75, 85, 95, 100]; // Index 0 unused
    return conversion[ibScore] || 0;
  }

  return normalizeGenericGrade(grade);
}

function normalizeIGCSEGrade(grade: string): number {
  const gradeStr = grade.trim().toUpperCase();
  
  // IGCSE letter grades
  const igcseGrades: { [key: string]: number } = {
    'A*': 95, 'A': 85, 'B': 75, 'C': 65, 'D': 55, 'E': 45, 'F': 35, 'G': 25, 'U': 0
  };

  if (igcseGrades[gradeStr]) {
    return igcseGrades[gradeStr];
  }

      // IGCSE 9-1 grades
    const numberMatch = gradeStr.match(/([1-9])/);
  if (numberMatch) {
    const numGrade = parseInt(numberMatch[1]);
    const conversion = [0, 40, 50, 60, 65, 70, 75, 82, 88, 95]; // Index 0 for grade 1
    return conversion[numGrade] || 0;
  }

  return normalizeGenericGrade(grade);
}

function normalizeCBSEGrade(grade: string): number {
  const gradeStr = grade.trim();
  
  // CBSE percentage grades
  const percentMatch = gradeStr.match(/(\d{1,3})(?:%|\s*\/\s*100)?/);
  if (percentMatch) {
    return Math.min(100, parseInt(percentMatch[1]));
  }

  // CBSE CGPA
  const cgpaMatch = gradeStr.match(/(\d{1,2}\.\d+)\s*cgpa/i);
  if (cgpaMatch) {
    const cgpa = parseFloat(cgpaMatch[1]);
    return Math.min(100, cgpa * 9.5); // CBSE CGPA to percentage conversion
  }

  return normalizeGenericGrade(grade);
}

function normalizeICSEGrade(grade: string): number {
  const gradeStr = grade.trim();
  
  // ICSE percentage grades
  const percentMatch = gradeStr.match(/(\d{1,3})(?:%|\s*\/\s*100)?/);
  if (percentMatch) {
    return Math.min(100, parseInt(percentMatch[1]));
  }

  return normalizeGenericGrade(grade);
}

function normalizeALevelGrade(grade: string): number {
  const gradeStr = grade.trim().toUpperCase();
  
  const aLevelGrades: { [key: string]: number } = {
    'A*': 95, 'A': 85, 'B': 75, 'C': 65, 'D': 55, 'E': 45, 'U': 0
  };

  return aLevelGrades[gradeStr] || normalizeGenericGrade(grade);
}

function normalizeGCSEGrade(grade: string): number {
  const gradeStr = grade.trim().toUpperCase();
  
  // GCSE 9-1 grades
      const numberMatch = gradeStr.match(/([1-9])/);
  if (numberMatch) {
    const numGrade = parseInt(numberMatch[1]);
    const conversion = [0, 40, 50, 60, 65, 70, 75, 82, 88, 95];
    return conversion[numGrade] || 0;
  }

  // GCSE letter grades
  const gcseGrades: { [key: string]: number } = {
    'A*': 95, 'A': 85, 'B': 75, 'C': 65, 'D': 55, 'E': 45, 'F': 35, 'G': 25, 'U': 0
  };

  return gcseGrades[gradeStr] || normalizeGenericGrade(grade);
}

function normalizeGenericGrade(grade: string): number {
  const gradeStr = grade.trim();

  // Percentage
  const percentMatch = gradeStr.match(/(\d{1,3})(?:\.\d+)?%?/);
  if (percentMatch) {
    return Math.min(100, parseFloat(percentMatch[1]));
  }

  // Letter grades
  const letterGrades: { [key: string]: number } = {
    'A+': 97, 'A': 94, 'A-': 90,
    'B+': 87, 'B': 84, 'B-': 80,
    'C+': 77, 'C': 74, 'C-': 70,
    'D+': 67, 'D': 64, 'D-': 60,
    'F': 50
  };

  const upperGrade = gradeStr.toUpperCase();
  if (letterGrades[upperGrade]) {
    return letterGrades[upperGrade];
  }

  // Fraction
  const fractionMatch = gradeStr.match(/(\d+)\s*\/\s*(\d+)/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1]);
    const denominator = parseInt(fractionMatch[2]);
    return Math.round((numerator / denominator) * 100);
  }

  // GPA (assume 4.0 scale)
  const gpaMatch = gradeStr.match(/(\d\.\d+)/);
  if (gpaMatch) {
    const gpa = parseFloat(gpaMatch[1]);
    if (gpa <= 4.0) {
      return Math.round((gpa / 4.0) * 100);
    }
  }

  return 0; // Unable to parse
}

function scoreToLetterGrade(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

function scoreToGPA(score: number): number {
  // Convert percentage to 4.0 GPA scale
  if (score >= 97) return 4.0;
  if (score >= 93) return 3.9;
  if (score >= 90) return 3.7;
  if (score >= 87) return 3.3;
  if (score >= 83) return 3.0;
  if (score >= 80) return 2.7;
  if (score >= 77) return 2.3;
  if (score >= 73) return 2.0;
  if (score >= 70) return 1.7;
  if (score >= 67) return 1.3;
  if (score >= 65) return 1.0;
  return 0.0;
}

function generateStandardizedScores(subjects: any[], framework: string): any {
  if (subjects.length === 0) return {};

  const scores = subjects.map(s => s.normalizedScore).filter(s => !isNaN(s));
  if (scores.length === 0) return {};

  const average = scores.reduce((a, b) => a + b, 0) / scores.length;

  return {
    percentage: Math.round(average * 100) / 100,
    gpa: Math.round(scoreToGPA(average) * 100) / 100,
    letterGrade: scoreToLetterGrade(average),
    framework: framework,
    subjectCount: subjects.length,
    standardDeviation: calculateStandardDeviation(scores)
  };
}

function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(Math.sqrt(avgSquaredDiff) * 100) / 100;
}

function addFrameworkWarnings(result: any, framework: string, structuredData: any): void {
  if (!framework || framework === 'unknown') {
    result.warnings.push('No specific academic framework detected. Generic normalization applied.');
  }

  if (result.normalizedData.subjects.length === 0) {
    result.warnings.push('No subjects could be normalized from the extracted data.');
  }

  const invalidGrades = result.normalizedData.subjects.filter(s => s.normalizedScore === 0);
  if (invalidGrades.length > 0) {
    result.warnings.push(`${invalidGrades.length} grades could not be normalized and were set to 0.`);
  }

  if (!result.normalizedData.attendance) {
    result.warnings.push('Attendance information could not be extracted or normalized.');
  }

  // Framework-specific warnings
  switch (framework) {
    case 'IB':
      if (!structuredData.teacherComments?.some((c: string) => /tok|extended essay|cas/i.test(c))) {
        result.warnings.push('IB-specific components (TOK, Extended Essay, CAS) not clearly identified.');
      }
      break;
    case 'CBSE':
      if (!result.normalizedData.subjects.some((s: any) => /hindi|sanskrit/i.test(s.originalSubject))) {
        result.warnings.push('Expected CBSE language subjects not found.');
      }
      break;
  }
}
