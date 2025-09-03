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
          where: { assessmentType: 'career' },
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Initialize ML service if not already done
    await mlService.initialize();

    // Prepare career prediction data
    const careerData = prepareCareerData(extractedData, student);
    
    // Run career path prediction
    const careerPrediction = await mlService.careerPredictor.predictCareerPath(careerData);

    // Store analysis results
    const analysis = await prisma.careerAnalysis.create({
      data: {
        documentId,
        studentId,
        analysisType: 'career_prediction',
        inputData: JSON.stringify(careerData),
        results: JSON.stringify(careerPrediction),
        confidence: careerPrediction.confidence || 0.75,
        recommendedCareers: JSON.stringify(careerPrediction.recommendations?.slice(0, 5) || []),
        status: 'completed',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      analysis: careerPrediction,
      analysisId: analysis.id,
      message: 'Career prediction completed successfully'
    });

  } catch (error) {
    console.error('Career prediction error:', error);
    return NextResponse.json({
      error: 'Career prediction failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function prepareCareerData(extractedData: any, student: any): any {
  const careerData: any = {
    studentId: student.id,
    grade: student.grade || '10',
    subjectStrengths: [],
    academicProfile: {},
    interests: [],
    skillsProfile: {},
    personalityTraits: [],
    historicalPreferences: []
  };

  // Analyze subject performance to identify strengths
  if (extractedData.structuredData?.grades) {
    const subjectGrades = extractedData.structuredData.grades.map((g: any) => ({
      subject: g.subject,
      score: normalizeGradeToScore(g.grade),
      grade: g.grade
    }));

    // Sort by score to identify strengths
    const sortedSubjects = subjectGrades
      .filter((s: any) => !isNaN(s.score))
      .sort((a: any, b: any) => b.score - a.score);

    // Top performing subjects
    careerData.subjectStrengths = sortedSubjects.slice(0, 5).map((s: any) => ({
      subject: s.subject,
      score: s.score,
      category: categorizeSubject(s.subject),
      careerRelevance: getCareerRelevance(s.subject)
    }));

    // Create academic profile
    const scores = sortedSubjects.map((s: any) => s.score);
    if (scores.length > 0) {
      careerData.academicProfile = {
        overallAverage: scores.reduce((a, b) => a + b, 0) / scores.length,
        topSubjectScore: Math.max(...scores),
        consistency: calculateConsistency(scores),
        stem_score: calculateSTEMScore(sortedSubjects),
        humanities_score: calculateHumanitiesScore(sortedSubjects),
        arts_score: calculateArtsScore(sortedSubjects)
      };
    }
  }

  // Infer interests from subject performance and teacher comments
  careerData.interests = inferInterests(careerData.subjectStrengths, extractedData.structuredData?.teacherComments);

  // Build skills profile based on academic performance
  careerData.skillsProfile = buildSkillsProfile(careerData.subjectStrengths, careerData.academicProfile);

  // Infer personality traits from comments and performance patterns
  careerData.personalityTraits = inferPersonalityTraits(extractedData.structuredData?.teacherComments, careerData.academicProfile);

  // Add historical career preferences if available
  if (student.assessments) {
    careerData.historicalPreferences = student.assessments
      .filter((a: any) => a.results)
      .map((assessment: any) => {
        try {
          const results = JSON.parse(assessment.results);
          return {
            date: assessment.createdAt,
            preferences: results.careerPreferences || [],
            interests: results.interests || []
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  return careerData;
}

function normalizeGradeToScore(grade: string): number {
  grade = grade.trim();

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

  if (/^\d{1,3}(\.\d+)?%?$/.test(grade)) {
    const numMatch = grade.match(/(\d{1,3}(?:\.\d+)?)/);
    if (numMatch) {
      return Math.min(100, parseFloat(numMatch[1]));
    }
  }

  if (/^\d{1,2}\/\d{1,2}$/.test(grade)) {
    const parts = grade.split('/');
    const numerator = parseInt(parts[0]);
    const denominator = parseInt(parts[1]);
    return Math.round((numerator / denominator) * 100);
  }

  return 0;
}

function categorizeSubject(subject: string): string {
  const subjectLower = subject.toLowerCase();

  if (/math|calculus|algebra|geometry|statistics|trigonometry/.test(subjectLower)) {
    return 'mathematics';
  }
  if (/physics|chemistry|biology|science/.test(subjectLower)) {
    return 'science';
  }
  if (/english|literature|language|writing/.test(subjectLower)) {
    return 'language';
  }
  if (/history|geography|social|civics|politics/.test(subjectLower)) {
    return 'social_studies';
  }
  if (/art|music|drama|creative|design/.test(subjectLower)) {
    return 'arts';
  }
  if (/computer|programming|technology|coding/.test(subjectLower)) {
    return 'technology';
  }
  if (/physical|sports|gym|fitness/.test(subjectLower)) {
    return 'physical_education';
  }

  return 'other';
}

function getCareerRelevance(subject: string): string[] {
  const subjectLower = subject.toLowerCase();
  const careers: string[] = [];

  if (/math|calculus|algebra|geometry|statistics/.test(subjectLower)) {
    careers.push('engineering', 'finance', 'data_science', 'architecture', 'economics');
  }
  if (/physics/.test(subjectLower)) {
    careers.push('engineering', 'research', 'aerospace', 'technology', 'medicine');
  }
  if (/chemistry/.test(subjectLower)) {
    careers.push('medicine', 'pharmacy', 'research', 'manufacturing', 'environmental_science');
  }
  if (/biology/.test(subjectLower)) {
    careers.push('medicine', 'biotechnology', 'research', 'environmental_science', 'agriculture');
  }
  if (/english|literature|language/.test(subjectLower)) {
    careers.push('journalism', 'education', 'law', 'publishing', 'communications');
  }
  if (/history|social/.test(subjectLower)) {
    careers.push('law', 'education', 'public_service', 'research', 'journalism');
  }
  if (/art|music|drama/.test(subjectLower)) {
    careers.push('arts', 'design', 'entertainment', 'advertising', 'media');
  }
  if (/computer|programming|technology/.test(subjectLower)) {
    careers.push('software_development', 'data_science', 'cybersecurity', 'game_development', 'artificial_intelligence');
  }

  return careers.slice(0, 3); // Limit to top 3 most relevant careers
}

function calculateConsistency(scores: number[]): number {
  if (scores.length < 2) return 100;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
  const std = Math.sqrt(variance);
  return Math.max(0, 100 - (std * 2));
}

function calculateSTEMScore(subjects: any[]): number {
  const stemSubjects = subjects.filter(s => 
    ['mathematics', 'science', 'technology'].includes(s.category)
  );
  
  if (stemSubjects.length === 0) return 0;
  
  return stemSubjects.reduce((acc, s) => acc + s.score, 0) / stemSubjects.length;
}

function calculateHumanitiesScore(subjects: any[]): number {
  const humanitiesSubjects = subjects.filter(s => 
    ['language', 'social_studies'].includes(s.category)
  );
  
  if (humanitiesSubjects.length === 0) return 0;
  
  return humanitiesSubjects.reduce((acc, s) => acc + s.score, 0) / humanitiesSubjects.length;
}

function calculateArtsScore(subjects: any[]): number {
  const artsSubjects = subjects.filter(s => 
    ['arts'].includes(s.category)
  );
  
  if (artsSubjects.length === 0) return 0;
  
  return artsSubjects.reduce((acc, s) => acc + s.score, 0) / artsSubjects.length;
}

function inferInterests(subjectStrengths: any[], comments: string[]): string[] {
  const interests: string[] = [];
  
  // Infer from top performing subjects
  subjectStrengths.slice(0, 3).forEach(subject => {
    switch (subject.category) {
      case 'mathematics':
        interests.push('problem_solving', 'logical_thinking', 'analytical_work');
        break;
      case 'science':
        interests.push('research', 'experimentation', 'discovery');
        break;
      case 'language':
        interests.push('communication', 'writing', 'literature');
        break;
      case 'arts':
        interests.push('creativity', 'expression', 'design');
        break;
      case 'technology':
        interests.push('innovation', 'programming', 'digital_creation');
        break;
      case 'social_studies':
        interests.push('understanding_society', 'helping_others', 'leadership');
        break;
    }
  });

  // Infer from teacher comments
  if (comments) {
    comments.forEach(comment => {
      const lowerComment = comment.toLowerCase();
      if (/creative|artistic|imaginative/.test(lowerComment)) {
        interests.push('creativity', 'artistic_expression');
      }
      if (/leader|leadership|team/.test(lowerComment)) {
        interests.push('leadership', 'teamwork');
      }
      if (/helpful|caring|empathetic/.test(lowerComment)) {
        interests.push('helping_others', 'social_work');
      }
      if (/curious|inquisitive|research/.test(lowerComment)) {
        interests.push('research', 'discovery');
      }
    });
  }

  // Remove duplicates and return top interests
  return [...new Set(interests)].slice(0, 8);
}

function buildSkillsProfile(subjectStrengths: any[], academicProfile: any): any {
  const skills = {
    technical: 0,
    analytical: 0,
    creative: 0,
    communication: 0,
    leadership: 0,
    problem_solving: 0
  };

  // Calculate skills based on subject performance
  subjectStrengths.forEach(subject => {
    const weight = subject.score / 100; // Weight by performance
    
    switch (subject.category) {
      case 'mathematics':
        skills.analytical += weight * 0.8;
        skills.problem_solving += weight * 0.9;
        break;
      case 'science':
        skills.analytical += weight * 0.7;
        skills.technical += weight * 0.6;
        skills.problem_solving += weight * 0.7;
        break;
      case 'technology':
        skills.technical += weight * 0.9;
        skills.problem_solving += weight * 0.6;
        break;
      case 'language':
        skills.communication += weight * 0.9;
        skills.creative += weight * 0.4;
        break;
      case 'arts':
        skills.creative += weight * 0.9;
        skills.communication += weight * 0.3;
        break;
      case 'social_studies':
        skills.communication += weight * 0.6;
        skills.leadership += weight * 0.5;
        break;
    }
  });

  // Normalize skills (0-100 scale)
  Object.keys(skills).forEach(skill => {
    skills[skill as keyof typeof skills] = Math.min(100, skills[skill as keyof typeof skills] * 50);
  });

  return skills;
}

function inferPersonalityTraits(comments: string[], academicProfile: any): string[] {
  const traits: string[] = [];

  // Infer from academic consistency
  if (academicProfile.consistency > 80) {
    traits.push('reliable', 'consistent', 'disciplined');
  } else if (academicProfile.consistency < 50) {
    traits.push('variable', 'adaptable');
  }

  // Infer from teacher comments
  if (comments) {
    comments.forEach(comment => {
      const lowerComment = comment.toLowerCase();
      
      if (/quiet|reserved|introverted/.test(lowerComment)) {
        traits.push('introverted', 'reflective');
      }
      if (/outgoing|social|extroverted/.test(lowerComment)) {
        traits.push('extroverted', 'social');
      }
      if (/creative|imaginative|innovative/.test(lowerComment)) {
        traits.push('creative', 'innovative');
      }
      if (/organized|structured|methodical/.test(lowerComment)) {
        traits.push('organized', 'methodical');
      }
      if (/flexible|adaptable|open/.test(lowerComment)) {
        traits.push('adaptable', 'open_minded');
      }
      if (/determined|persistent|hardworking/.test(lowerComment)) {
        traits.push('determined', 'hardworking');
      }
    });
  }

  // Remove duplicates and return
  return [...new Set(traits)].slice(0, 6);
}
