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
    
    // Extract framework-specific data
    const frameworkData = extractFrameworkSpecificData(extractedData, framework);
    
    // Perform framework-specific calculations
    const assessmentResults = await performFrameworkAssessment(frameworkData, framework);

    // Store the results
    await prisma.frameworkDetection.upsert({
      where: { 
        documentId_studentId: {
          documentId,
          studentId
        }
      },
      update: {
        selectedFramework: framework,
        extractedData: JSON.stringify(frameworkData),
        assessmentResults: JSON.stringify(assessmentResults),
        status: 'completed',
        updatedAt: new Date()
      },
      create: {
        documentId,
        studentId,
        detectedFramework: framework,
        selectedFramework: framework,
        confidence: 1.0,
        indicators: JSON.stringify(['user_selected']),
        extractedData: JSON.stringify(frameworkData),
        assessmentResults: JSON.stringify(assessmentResults),
        status: 'completed',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      framework,
      extractedData: frameworkData,
      assessmentResults,
      message: `Data extracted and processed for ${framework} framework`
    });

  } catch (error) {
    console.error('Framework extraction error:', error);
    return NextResponse.json({
      error: 'Framework extraction failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function extractFrameworkSpecificData(extractedData: any, framework: string) {
  const baseData = {
    framework,
    extractedAt: new Date().toISOString(),
    academicData: {},
    skillsData: {},
    physicalData: {},
    psychologicalData: {}
  };

  const fullText = extractedData.fullText || extractedData.extractedText || '';
  const structuredData = extractedData.structuredData || {};

  switch (framework) {
    case 'CBSE':
      return extractCBSEData(baseData, fullText, structuredData);
    case 'ICSE':
      return extractICSEData(baseData, fullText, structuredData);
    case 'IB':
      return extractIBData(baseData, fullText, structuredData);
    case 'IGCSE':
      return extractIGCSEData(baseData, fullText, structuredData);
    default:
      return extractGenericData(baseData, fullText, structuredData);
  }
}

function extractCBSEData(baseData: any, fullText: string, structuredData: any) {
  // CBSE-specific extraction
  baseData.academicData = {
    board: 'CBSE',
    gradingSystem: 'percentage',
    class: extractCBSEClass(fullText),
    subjects: extractCBSESubjects(fullText, structuredData),
    grades: extractCBSEGrades(fullText, structuredData),
    cgpa: extractCBSECGPA(fullText),
    activities: extractCBSEActivities(fullText)
  };

  baseData.skillsData = {
    academicSkills: analyzeCBSEAcademicSkills(baseData.academicData),
    cognitiveSkills: extractCognitiveIndicators(fullText),
    practicalSkills: extractPracticalSkills(fullText)
  };

  return baseData;
}

function extractICSEData(baseData: any, fullText: string, structuredData: any) {
  // ICSE-specific extraction
  baseData.academicData = {
    board: 'ICSE',
    gradingSystem: 'percentage',
    class: extractICSEClass(fullText),
    subjects: extractICSESubjects(fullText, structuredData),
    grades: extractICSEGrades(fullText, structuredData),
    activities: extractICSEActivities(fullText)
  };

  baseData.skillsData = {
    academicSkills: analyzeICSEAcademicSkills(baseData.academicData),
    languageSkills: extractLanguageSkills(fullText),
    analyticalSkills: extractAnalyticalSkills(fullText)
  };

  return baseData;
}

function extractIBData(baseData: any, fullText: string, structuredData: any) {
  // IB-specific extraction
  baseData.academicData = {
    board: 'IB',
    gradingSystem: 'points',
    programme: extractIBProgramme(fullText), // PYP, MYP, DP
    subjects: extractIBSubjects(fullText, structuredData),
    grades: extractIBGrades(fullText, structuredData),
    ibScore: extractIBScore(fullText),
    tok: extractTOKGrade(fullText),
    extendedEssay: extractEEGrade(fullText),
    cas: extractCASActivities(fullText)
  };

  baseData.skillsData = {
    ibAttributes: extractIBLearnerProfile(fullText),
    criticalThinking: extractCriticalThinkingSkills(fullText),
    creativity: extractCreativityIndicators(fullText),
    globalMindedness: extractGlobalMindednessIndicators(fullText)
  };

  return baseData;
}

function extractIGCSEData(baseData: any, fullText: string, structuredData: any) {
  // IGCSE-specific extraction
  baseData.academicData = {
    board: 'IGCSE',
    gradingSystem: 'grades',
    subjects: extractIGCSESubjects(fullText, structuredData),
    grades: extractIGCSEGrades(fullText, structuredData),
    activities: extractIGCSEActivities(fullText)
  };

  baseData.skillsData = {
    academicSkills: analyzeIGCSEAcademicSkills(baseData.academicData),
    internationalPerspective: extractInternationalPerspective(fullText),
    crossCurricularSkills: extractCrossCurricularSkills(fullText)
  };

  return baseData;
}

function extractGenericData(baseData: any, fullText: string, structuredData: any) {
  // Generic extraction for unknown frameworks
  baseData.academicData = {
    board: 'Generic',
    gradingSystem: 'various',
    subjects: extractGenericSubjects(fullText, structuredData),
    grades: extractGenericGrades(fullText, structuredData),
    activities: extractGenericActivities(fullText)
  };

  baseData.skillsData = {
    academicSkills: analyzeGenericAcademicSkills(baseData.academicData),
    generalSkills: extractGeneralSkills(fullText)
  };

  return baseData;
}

// Helper functions for CBSE
function extractCBSEClass(fullText: string): string | null {
  const classMatch = fullText.match(/class\s*(x{1,2}|10|11|12)/i);
  return classMatch ? classMatch[1].toUpperCase() : null;
}

function extractCBSESubjects(fullText: string, structuredData: any): string[] {
  const cbseSubjects = ['english', 'hindi', 'mathematics', 'science', 'social science', 'physics', 'chemistry', 'biology', 'computer science', 'economics', 'business studies', 'accountancy', 'political science', 'geography', 'history'];
  const foundSubjects: string[] = [];
  
  cbseSubjects.forEach(subject => {
    if (fullText.toLowerCase().includes(subject)) {
      foundSubjects.push(subject);
    }
  });
  
  return foundSubjects;
}

function extractCBSEGrades(fullText: string, structuredData: any): any[] {
  const grades: any[] = [];
  
  // Extract percentage-based grades
  const percentageMatches = fullText.matchAll(/(\w+(?:\s+\w+)*)\s*[:\-]?\s*(\d{1,3})%/gi);
  for (const match of percentageMatches) {
    grades.push({
      subject: match[1].trim(),
      grade: `${match[2]}%`,
      score: parseInt(match[2])
    });
  }
  
  return grades;
}

function extractCBSECGPA(fullText: string): number | null {
  const cgpaMatch = fullText.match(/cgpa\s*[:\-]?\s*(\d+\.?\d*)/i);
  return cgpaMatch ? parseFloat(cgpaMatch[1]) : null;
}

function extractCBSEActivities(fullText: string): string[] {
  const activities: string[] = [];
  const activityIndicators = ['sports', 'music', 'dance', 'art', 'debate', 'quiz', 'science fair', 'cultural', 'social service'];
  
  activityIndicators.forEach(activity => {
    if (fullText.toLowerCase().includes(activity)) {
      activities.push(activity);
    }
  });
  
  return activities;
}

function analyzeCBSEAcademicSkills(academicData: any): any {
  const skills = {
    mathematical: 0,
    scientific: 0,
    linguistic: 0,
    analytical: 0,
    overall: 0
  };

  if (academicData.grades) {
    academicData.grades.forEach((grade: any) => {
      const score = grade.score || 0;
      const subject = grade.subject.toLowerCase();
      
      if (subject.includes('math')) skills.mathematical = Math.max(skills.mathematical, score);
      if (subject.includes('science') || subject.includes('physics') || subject.includes('chemistry') || subject.includes('biology')) {
        skills.scientific = Math.max(skills.scientific, score);
      }
      if (subject.includes('english') || subject.includes('hindi')) {
        skills.linguistic = Math.max(skills.linguistic, score);
      }
      if (subject.includes('social') || subject.includes('economics') || subject.includes('political')) {
        skills.analytical = Math.max(skills.analytical, score);
      }
    });
  }

  skills.overall = Object.values(skills).filter(v => v > 0).reduce((a: number, b: number) => a + b, 0) / Object.values(skills).filter(v => v > 0).length || 0;
  
  return skills;
}

// Placeholder implementations for other frameworks
function extractICSEClass(fullText: string): string | null {
  return extractCBSEClass(fullText); // Similar pattern
}

function extractICSESubjects(fullText: string, structuredData: any): string[] {
  const icseSubjects = ['english language', 'english literature', 'hindi', 'mathematics', 'physics', 'chemistry', 'biology', 'history & civics', 'geography', 'commercial studies'];
  return icseSubjects.filter(subject => fullText.toLowerCase().includes(subject));
}

function extractICSEGrades(fullText: string, structuredData: any): any[] {
  return extractCBSEGrades(fullText, structuredData); // Similar pattern
}

function extractICSEActivities(fullText: string): string[] {
  return extractCBSEActivities(fullText); // Similar pattern
}

function analyzeICSEAcademicSkills(academicData: any): any {
  return analyzeCBSEAcademicSkills(academicData); // Similar analysis
}

function extractIBProgramme(fullText: string): string | null {
  if (fullText.toLowerCase().includes('diploma programme') || fullText.toLowerCase().includes('dp')) return 'DP';
  if (fullText.toLowerCase().includes('middle years programme') || fullText.toLowerCase().includes('myp')) return 'MYP';
  if (fullText.toLowerCase().includes('primary years programme') || fullText.toLowerCase().includes('pyp')) return 'PYP';
  return null;
}

function extractIBSubjects(fullText: string, structuredData: any): string[] {
  const ibSubjects = ['english a', 'mathematics', 'physics', 'chemistry', 'biology', 'history', 'economics', 'psychology', 'visual arts', 'music'];
  return ibSubjects.filter(subject => fullText.toLowerCase().includes(subject));
}

function extractIBGrades(fullText: string, structuredData: any): any[] {
  const grades: any[] = [];
  const ibGradeMatches = fullText.matchAll(/(\w+(?:\s+\w+)*)\s*[:\-]?\s*([1-7])\/7/gi);
  for (const match of ibGradeMatches) {
    grades.push({
      subject: match[1].trim(),
      grade: `${match[2]}/7`,
      score: parseInt(match[2])
    });
  }
  return grades;
}

function extractIBScore(fullText: string): number | null {
  const scoreMatch = fullText.match(/ib\s*score\s*[:\-]?\s*(\d{1,2})/i);
  return scoreMatch ? parseInt(scoreMatch[1]) : null;
}

function extractTOKGrade(fullText: string): string | null {
  const tokMatch = fullText.match(/tok\s*[:\-]?\s*([a-e])/i);
  return tokMatch ? tokMatch[1].toUpperCase() : null;
}

function extractEEGrade(fullText: string): string | null {
  const eeMatch = fullText.match(/extended\s*essay\s*[:\-]?\s*([a-e])/i);
  return eeMatch ? eeMatch[1].toUpperCase() : null;
}

function extractCASActivities(fullText: string): string[] {
  const casActivities: string[] = [];
  if (fullText.toLowerCase().includes('creativity')) casActivities.push('Creativity');
  if (fullText.toLowerCase().includes('activity') || fullText.toLowerCase().includes('sports')) casActivities.push('Activity');
  if (fullText.toLowerCase().includes('service')) casActivities.push('Service');
  return casActivities;
}

// Additional skill extraction functions
function extractCognitiveIndicators(fullText: string): any {
  return { reasoning: 0, memory: 0, processing: 0 };
}

function extractPracticalSkills(fullText: string): any {
  return { handson: 0, laboratory: 0, technical: 0 };
}

function extractLanguageSkills(fullText: string): any {
  return { reading: 0, writing: 0, speaking: 0, listening: 0 };
}

function extractAnalyticalSkills(fullText: string): any {
  return { criticalThinking: 0, problemSolving: 0, research: 0 };
}

function extractIBLearnerProfile(fullText: string): any {
  return { inquirer: 0, knowledgeable: 0, thinker: 0, communicator: 0, principled: 0, openminded: 0, caring: 0, risktaker: 0, balanced: 0, reflective: 0 };
}

function extractCriticalThinkingSkills(fullText: string): any {
  return { analysis: 0, evaluation: 0, synthesis: 0 };
}

function extractCreativityIndicators(fullText: string): any {
  return { artistic: 0, innovative: 0, originalThinking: 0 };
}

function extractGlobalMindednessIndicators(fullText: string): any {
  return { culturalAwareness: 0, internationalPerspective: 0, socialResponsibility: 0 };
}

function extractIGCSESubjects(fullText: string, structuredData: any): string[] {
  const igcseSubjects = ['english as first language', 'english as second language', 'mathematics', 'physics', 'chemistry', 'biology', 'history', 'geography', 'economics', 'business studies'];
  return igcseSubjects.filter(subject => fullText.toLowerCase().includes(subject));
}

function extractIGCSEGrades(fullText: string, structuredData: any): any[] {
  const grades: any[] = [];
  const gradeMatches = fullText.matchAll(/(\w+(?:\s+\w+)*)\s*[:\-]?\s*([A*-U]|\d)/gi);
  for (const match of gradeMatches) {
    grades.push({
      subject: match[1].trim(),
      grade: match[2],
      score: convertIGCSEGradeToScore(match[2])
    });
  }
  return grades;
}

function extractIGCSEActivities(fullText: string): string[] {
  return extractCBSEActivities(fullText); // Similar pattern
}

function analyzeIGCSEAcademicSkills(academicData: any): any {
  return analyzeCBSEAcademicSkills(academicData); // Similar analysis
}

function extractInternationalPerspective(fullText: string): any {
  return { globalAwareness: 0, multiculturalUnderstanding: 0 };
}

function extractCrossCurricularSkills(fullText: string): any {
  return { communication: 0, numeracy: 0, ict: 0, problemSolving: 0 };
}

function extractGenericSubjects(fullText: string, structuredData: any): string[] {
  // Generic subject extraction
  const commonSubjects = ['english', 'mathematics', 'science', 'history', 'geography', 'physics', 'chemistry', 'biology', 'computer', 'economics'];
  return commonSubjects.filter(subject => fullText.toLowerCase().includes(subject));
}

function extractGenericGrades(fullText: string, structuredData: any): any[] {
  // Generic grade extraction - try multiple patterns
  const grades: any[] = [];
  
  // Try percentage pattern
  const percentageMatches = fullText.matchAll(/(\w+(?:\s+\w+)*)\s*[:\-]?\s*(\d{1,3})%/gi);
  for (const match of percentageMatches) {
    grades.push({
      subject: match[1].trim(),
      grade: `${match[2]}%`,
      score: parseInt(match[2])
    });
  }
  
  // Try letter grade pattern
  const letterMatches = fullText.matchAll(/(\w+(?:\s+\w+)*)\s*[:\-]?\s*([A-F][+\-]?)/gi);
  for (const match of letterMatches) {
    grades.push({
      subject: match[1].trim(),
      grade: match[2],
      score: convertLetterGradeToScore(match[2])
    });
  }
  
  return grades;
}

function extractGenericActivities(fullText: string): string[] {
  return extractCBSEActivities(fullText); // Use common activity patterns
}

function analyzeGenericAcademicSkills(academicData: any): any {
  return analyzeCBSEAcademicSkills(academicData); // Use common analysis
}

function extractGeneralSkills(fullText: string): any {
  return { communication: 0, teamwork: 0, leadership: 0, creativity: 0 };
}

// Utility functions
function convertIGCSEGradeToScore(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    'A*': 95, 'A': 85, 'B': 75, 'C': 65, 'D': 55, 'E': 45, 'F': 35, 'G': 25, 'U': 0,
    '9': 95, '8': 85, '7': 75, '6': 65, '5': 55, '4': 45, '3': 35, '2': 25, '1': 15
  };
  return gradeMap[grade] || 0;
}

function convertLetterGradeToScore(grade: string): number {
  const gradeMap: { [key: string]: number } = {
    'A+': 97, 'A': 93, 'A-': 90, 'B+': 87, 'B': 83, 'B-': 80,
    'C+': 77, 'C': 73, 'C-': 70, 'D+': 67, 'D': 63, 'D-': 60, 'F': 0
  };
  return gradeMap[grade] || 0;
}

async function performFrameworkAssessment(frameworkData: any, framework: string) {
  // Perform comprehensive assessment based on framework
  const assessment = {
    academicAssessment: assessAcademicPerformance(frameworkData.academicData, framework),
    skillsAssessment: assessSkills(frameworkData.skillsData, framework),
    physicalAssessment: assessPhysicalData(frameworkData.physicalData, framework),
    psychologicalAssessment: assessPsychologicalData(frameworkData.psychologicalData, framework),
    overallScore: 0,
    recommendations: [],
    nextSteps: []
  };

  // Calculate overall score
  assessment.overallScore = calculateOverallScore(assessment);
  
  // Generate recommendations
  assessment.recommendations = generateRecommendations(assessment, framework);
  assessment.nextSteps = generateNextSteps(assessment, framework);

  return assessment;
}

function assessAcademicPerformance(academicData: any, framework: string): any {
  const subjects = academicData.subjects || [];
  const grades = academicData.grades || [];
  
  let totalScore = 0;
  let subjectCount = 0;
  const subjectScores: { [key: string]: number } = {};

  grades.forEach((grade: any) => {
    if (grade.score !== undefined) {
      totalScore += grade.score;
      subjectCount++;
      subjectScores[grade.subject] = grade.score;
    }
  });

  const averageScore = subjectCount > 0 ? totalScore / subjectCount : 0;
  
  return {
    averageScore,
    subjectCount,
    subjectScores,
    strengths: identifyAcademicStrengths(subjectScores),
    weaknesses: identifyAcademicWeaknesses(subjectScores),
    grade: getGradeCategory(averageScore, framework)
  };
}

function assessSkills(skillsData: any, framework: string): any {
  // Comprehensive skills assessment
  return {
    cognitiveSkills: skillsData.cognitiveSkills || {},
    practicalSkills: skillsData.practicalSkills || {},
    socialSkills: skillsData.socialSkills || {},
    overallSkillLevel: 'Intermediate' // Placeholder
  };
}

function assessPhysicalData(physicalData: any, framework: string): any {
  // Physical assessment placeholder
  return {
    fitness: 'Good',
    motorSkills: 'Developing',
    healthIndicators: 'Normal'
  };
}

function assessPsychologicalData(psychologicalData: any, framework: string): any {
  // Psychological assessment placeholder
  return {
    emotionalIntelligence: 'Good',
    socialAdjustment: 'Well-adapted',
    motivationLevel: 'High',
    learningStyle: 'Visual-Kinesthetic'
  };
}

function calculateOverallScore(assessment: any): number {
  // Weighted calculation of overall score
  const academicWeight = 0.4;
  const skillsWeight = 0.3;
  const physicalWeight = 0.15;
  const psychologicalWeight = 0.15;

  const academicScore = assessment.academicAssessment.averageScore || 0;
  const skillsScore = 75; // Placeholder
  const physicalScore = 80; // Placeholder  
  const psychologicalScore = 85; // Placeholder

  return (academicScore * academicWeight) + 
         (skillsScore * skillsWeight) + 
         (physicalScore * physicalWeight) + 
         (psychologicalScore * psychologicalWeight);
}

function generateRecommendations(assessment: any, framework: string): string[] {
  const recommendations: string[] = [];
  
  if (assessment.academicAssessment.averageScore < 70) {
    recommendations.push('Focus on strengthening foundational concepts in core subjects');
  }
  
  if (assessment.academicAssessment.weaknesses.length > 0) {
    recommendations.push(`Provide additional support in: ${assessment.academicAssessment.weaknesses.join(', ')}`);
  }
  
  recommendations.push('Maintain consistent study schedule and practice');
  recommendations.push('Engage in extracurricular activities to develop well-rounded skills');
  
  return recommendations;
}

function generateNextSteps(assessment: any, framework: string): string[] {
  const nextSteps: string[] = [];
  
  nextSteps.push('Complete physical and psychological assessment forms');
  nextSteps.push('Schedule parent-teacher consultation');
  nextSteps.push('Create personalized learning plan');
  nextSteps.push('Set academic and personal development goals');
  
  return nextSteps;
}

function identifyAcademicStrengths(subjectScores: { [key: string]: number }): string[] {
  const strengths: string[] = [];
  Object.entries(subjectScores).forEach(([subject, score]) => {
    if (score >= 80) {
      strengths.push(subject);
    }
  });
  return strengths;
}

function identifyAcademicWeaknesses(subjectScores: { [key: string]: number }): string[] {
  const weaknesses: string[] = [];
  Object.entries(subjectScores).forEach(([subject, score]) => {
    if (score < 60) {
      weaknesses.push(subject);
    }
  });
  return weaknesses;
}

function getGradeCategory(averageScore: number, framework: string): string {
  if (framework === 'IB') {
    if (averageScore >= 6) return 'Excellent';
    if (averageScore >= 5) return 'Good';
    if (averageScore >= 4) return 'Satisfactory';
    return 'Needs Improvement';
  } else {
    if (averageScore >= 90) return 'Excellent';
    if (averageScore >= 80) return 'Very Good';
    if (averageScore >= 70) return 'Good';
    if (averageScore >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }
}
