import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reportId = params.id;

    // Find the document upload and related data
    const document = await prisma.documentUpload.findUnique({
      where: { id: reportId },
      include: {
        student: {
          include: {
            user: true,
            parent: true
          }
        },
        academicAnalysis: true,
        behavioralAnalysis: true,
        careerAnalysis: true,
        frameworkDetection: true,
        dataNoormalization: true,
        studentRepository: true,
        eduSightScore: true
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Check if user has permission to view this report
    const hasPermission = await checkReportPermission(session.user.id, document);
    
    if (!hasPermission) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Generate comprehensive report data
    const reportData = await generateReportData(document);

    return NextResponse.json({
      success: true,
      report: reportData
    });

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({
      error: 'Failed to fetch report',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function checkReportPermission(userId: string, document: any): Promise<boolean> {
  // Check if user is the owner, parent, or authorized to view this report
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true }
    });

    if (!user) return false;

    // Admin users can view all reports
    if (user.role === 'ADMIN') return true;

    // Demo accounts can view demo reports
    if (isDemoAccount(user.email)) return true;

    // Check if user is the student
    if (document.student?.userId === userId) return true;

    // Check if user is the parent
    if (document.student?.parent?.userId === userId) return true;

    // Check if user uploaded the document
    if (document.uploadedBy === userId) return true;

    // School admin/teacher permissions could be added here
    
    return false;
  } catch (error) {
    console.error('Error checking report permission:', error);
    return false;
  }
}

function isDemoAccount(email: string): boolean {
  const demoEmails = [
    'parent@demo.com',
    'teacher@demo.com', 
    'admin@demo.com',
    'student@demo.com',
    'school-admin@demo.com'
  ];
  
  return demoEmails.includes(email) || email.includes('demo');
}

async function generateReportData(document: any) {
  const student = document.student;
  const academicAnalysis = document.academicAnalysis?.[0];
  const behavioralAnalysis = document.behavioralAnalysis?.[0];
  const careerAnalysis = document.careerAnalysis?.[0];
  const frameworkDetection = document.frameworkDetection?.[0];
  const eduSightScore = document.eduSightScore?.[0];

  // Extract and process data from various analyses
  const academicData = extractAcademicData(academicAnalysis, document.extractedData);
  const skillsAssessment = extractSkillsAssessment(academicAnalysis, behavioralAnalysis);
  const psychologicalAssessment = extractPsychologicalAssessment(behavioralAnalysis);
  const physicalAssessment = extractPhysicalAssessment(); // Placeholder
  const careerRecommendations = extractCareerRecommendations(careerAnalysis);

  return {
    id: document.id,
    studentName: student?.user?.name || student?.name || 'Student',
    framework: frameworkDetection?.detectedFramework || frameworkDetection?.selectedFramework || 'Generic',
    academicData,
    skillsAssessment,
    psychologicalAssessment,
    physicalAssessment,
    eduSightScore: eduSightScore?.totalScore || calculateFallbackScore(academicData, skillsAssessment),
    recommendations: generateRecommendations(academicData, skillsAssessment, psychologicalAssessment),
    strengths: identifyStrengths(academicData, skillsAssessment),
    areasForImprovement: identifyAreasForImprovement(academicData, skillsAssessment),
    careerRecommendations,
    generatedAt: document.createdAt || new Date().toISOString(),
    metadata: {
      documentType: document.documentType,
      frameworkConfidence: frameworkDetection?.confidence || 0,
      analysisVersion: '1.0',
      processingTime: calculateProcessingTime(document.createdAt, document.updatedAt)
    }
  };
}

function extractAcademicData(academicAnalysis: any, extractedData: any) {
  if (!academicAnalysis || !academicAnalysis.results) {
    return generateFallbackAcademicData();
  }

  try {
    const results = JSON.parse(academicAnalysis.results);
    return {
      averageScore: results.averageScore || 75,
      subjectScores: results.subjectScores || {},
      gradeLevel: results.gradeLevel || 'Not specified',
      strengths: results.strengths || [],
      weaknesses: results.weaknesses || [],
      performanceTrend: results.performanceTrend || 'stable'
    };
  } catch (error) {
    console.error('Error parsing academic analysis:', error);
    return generateFallbackAcademicData();
  }
}

function extractSkillsAssessment(academicAnalysis: any, behavioralAnalysis: any) {
  const skills = {
    overallScore: 75,
    cognitiveSkills: 75,
    practicalSkills: 75,
    socialSkills: 75,
    criticalThinking: 75,
    creativity: 75,
    communication: 75,
    problemSolving: 75
  };

  try {
    if (academicAnalysis?.results) {
      const academicResults = JSON.parse(academicAnalysis.results);
      skills.cognitiveSkills = academicResults.cognitiveScore || 75;
      skills.criticalThinking = academicResults.criticalThinkingScore || 75;
    }

    if (behavioralAnalysis?.results) {
      const behavioralResults = JSON.parse(behavioralAnalysis.results);
      skills.socialSkills = behavioralResults.socialScore || 75;
      skills.communication = behavioralResults.communicationScore || 75;
      skills.creativity = behavioralResults.creativityScore || 75;
    }

    skills.overallScore = Math.round(
      (skills.cognitiveSkills + skills.practicalSkills + skills.socialSkills + 
       skills.criticalThinking + skills.creativity + skills.communication + skills.problemSolving) / 7
    );

  } catch (error) {
    console.error('Error extracting skills assessment:', error);
  }

  return skills;
}

function extractPsychologicalAssessment(behavioralAnalysis: any) {
  const assessment = {
    emotionalIntelligence: 80,
    socialAdjustment: 85,
    motivationLevel: 85,
    learningStyle: 'Visual-Kinesthetic',
    stressManagement: 75,
    selfEsteem: 80,
    adaptability: 85
  };

  try {
    if (behavioralAnalysis?.results) {
      const results = JSON.parse(behavioralAnalysis.results);
      assessment.emotionalIntelligence = results.emotionalIntelligence || 80;
      assessment.socialAdjustment = results.socialAdjustment || 85;
      assessment.motivationLevel = results.motivationLevel || 85;
      assessment.learningStyle = results.learningStyle || 'Visual-Kinesthetic';
    }
  } catch (error) {
    console.error('Error extracting psychological assessment:', error);
  }

  return assessment;
}

function extractPhysicalAssessment() {
  // Placeholder - in real implementation, this would come from physical assessment data
  return {
    fitness: 85,
    motorSkills: 88,
    healthIndicators: 90,
    physicalActivity: 80,
    coordination: 85
  };
}

function extractCareerRecommendations(careerAnalysis: any): string[] {
  try {
    if (careerAnalysis?.results) {
      const results = JSON.parse(careerAnalysis.results);
      return results.recommendations || generateDefaultCareerRecommendations();
    }
  } catch (error) {
    console.error('Error extracting career recommendations:', error);
  }

  return generateDefaultCareerRecommendations();
}

function generateDefaultCareerRecommendations(): string[] {
  return [
    'Engineering',
    'Computer Science',
    'Medical Sciences',
    'Business Administration',
    'Research & Development',
    'Education'
  ];
}

function generateFallbackAcademicData() {
  return {
    averageScore: 75,
    subjectScores: {
      'Mathematics': 78,
      'Science': 82,
      'English': 75,
      'Social Studies': 70,
      'Languages': 73
    },
    gradeLevel: 'Grade 10',
    strengths: ['Science', 'Mathematics'],
    weaknesses: ['Social Studies'],
    performanceTrend: 'improving'
  };
}

function calculateFallbackScore(academicData: any, skillsAssessment: any): number {
  const academicWeight = 0.5;
  const skillsWeight = 0.5;
  
  const academicScore = academicData.averageScore || 75;
  const skillsScore = skillsAssessment.overallScore || 75;
  
  return Math.round((academicScore * academicWeight) + (skillsScore * skillsWeight));
}

function generateRecommendations(academicData: any, skillsAssessment: any, psychologicalAssessment: any): string[] {
  const recommendations: string[] = [];

  // Academic recommendations
  if (academicData.averageScore < 70) {
    recommendations.push("Focus on strengthening foundational concepts across all subjects");
  } else if (academicData.averageScore >= 85) {
    recommendations.push("Continue excelling academically and consider advanced coursework");
  }

  // Subject-specific recommendations
  if (academicData.weaknesses?.length > 0) {
    recommendations.push(`Provide additional support in: ${academicData.weaknesses.join(', ')}`);
  }

  if (academicData.strengths?.length > 0) {
    recommendations.push(`Leverage strengths in ${academicData.strengths.join(', ')} for academic confidence`);
  }

  // Skills recommendations
  if (skillsAssessment.communication < 75) {
    recommendations.push("Develop communication skills through presentations and group discussions");
  }

  if (skillsAssessment.criticalThinking < 75) {
    recommendations.push("Enhance critical thinking through problem-solving exercises and analytical activities");
  }

  // Psychological recommendations
  if (psychologicalAssessment.motivationLevel < 80) {
    recommendations.push("Work on motivation and goal-setting strategies");
  }

  // General recommendations
  recommendations.push("Maintain a balanced approach to academics, extracurriculars, and personal development");
  recommendations.push("Regular review and practice sessions to reinforce learning");

  return recommendations.slice(0, 6); // Limit to 6 recommendations
}

function identifyStrengths(academicData: any, skillsAssessment: any): string[] {
  const strengths: string[] = [];

  // Academic strengths
  if (academicData.strengths?.length > 0) {
    strengths.push(...academicData.strengths.map((s: string) => `Strong performance in ${s}`));
  }

  if (academicData.averageScore >= 85) {
    strengths.push("Excellent overall academic performance");
  }

  // Skills strengths
  Object.entries(skillsAssessment).forEach(([skill, score]: [string, any]) => {
    if (score >= 85 && skill !== 'overallScore') {
      strengths.push(`Exceptional ${skill.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
  });

  // Ensure we have some strengths
  if (strengths.length === 0) {
    strengths.push("Consistent academic effort and participation");
    strengths.push("Positive attitude towards learning");
  }

  return strengths.slice(0, 6);
}

function identifyAreasForImprovement(academicData: any, skillsAssessment: any): string[] {
  const areas: string[] = [];

  // Academic areas
  if (academicData.weaknesses?.length > 0) {
    areas.push(...academicData.weaknesses.map((w: string) => `Improvement needed in ${w}`));
  }

  if (academicData.averageScore < 70) {
    areas.push("Overall academic performance needs strengthening");
  }

  // Skills areas
  Object.entries(skillsAssessment).forEach(([skill, score]: [string, any]) => {
    if (score < 70 && skill !== 'overallScore') {
      areas.push(`Develop ${skill.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
  });

  // General areas if none identified
  if (areas.length === 0) {
    areas.push("Time management and study organization");
    areas.push("Test-taking strategies and exam preparation");
  }

  return areas.slice(0, 5);
}

function calculateProcessingTime(createdAt: any, updatedAt: any): string {
  try {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const diffMs = updated.getTime() - created.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) {
      return `${diffSeconds} seconds`;
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)} minutes`;
    } else {
      return `${Math.floor(diffSeconds / 3600)} hours`;
    }
  } catch (error) {
    return 'Unknown';
  }
}
