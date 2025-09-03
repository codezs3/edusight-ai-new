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

    const { documentId, framework, missingFrameworks } = await request.json();
    const studentId = params.id;

    // Get comprehensive student data
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        repositories: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        },
        scoreAggregations: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        academicAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        behavioralAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        careerAnalyses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get current document for additional context
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId },
      include: {
        dataNormalizations: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    // Calculate EduSight 360° Score
    const scoreCalculation = calculateEduSight360Score(student, document, framework, missingFrameworks);

    // Store the calculated score
    const eduSightScore = await prisma.eduSightScore.create({
      data: {
        studentId,
        documentId,
        academicScore: scoreCalculation.academic.score,
        psychologicalScore: scoreCalculation.psychological.score,
        physicalScore: scoreCalculation.physical.score,
        overallScore: scoreCalculation.overall.score,
        framework: framework || 'generic',
        missingFrameworks: JSON.stringify(missingFrameworks || []),
        calculations: JSON.stringify(scoreCalculation.details),
        recommendations: JSON.stringify(scoreCalculation.recommendations),
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      eduSightScore: {
        id: eduSightScore.id,
        academic: scoreCalculation.academic,
        psychological: scoreCalculation.psychological,
        physical: scoreCalculation.physical,
        overall: scoreCalculation.overall,
        framework: framework || 'generic',
        missingFrameworks: missingFrameworks || [],
        recommendations: scoreCalculation.recommendations,
        details: scoreCalculation.details
      },
      message: 'EduSight 360° score calculated successfully'
    });

  } catch (error) {
    console.error('EduSight score calculation error:', error);
    return NextResponse.json({
      error: 'EduSight score calculation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function calculateEduSight360Score(student: any, document: any, framework: string, missingFrameworks: string[]): any {
  const calculation = {
    academic: { score: 0, breakdown: {}, confidence: 0 },
    psychological: { score: 0, breakdown: {}, confidence: 0 },
    physical: { score: 50, breakdown: {}, confidence: 0.3 }, // Default baseline
    overall: { score: 0, confidence: 0 },
    details: {} as any,
    recommendations: [] as string[]
  };

  // Calculate Academic Score (40% of overall)
  calculation.academic = calculateAcademicScore(student, document, framework);

  // Calculate Psychological Score (35% of overall)
  calculation.psychological = calculatePsychologicalScore(student, document);

  // Calculate Physical Score (25% of overall)
  calculation.physical = calculatePhysicalScore(student);

  // Calculate Overall Score
  const weights = {
    academic: 0.40,
    psychological: 0.35,
    physical: 0.25
  };

  const weightedScore = 
    (calculation.academic.score * weights.academic) +
    (calculation.psychological.score * weights.psychological) +
    (calculation.physical.score * weights.physical);

  calculation.overall = {
    score: Math.round(weightedScore * 10) / 10,
    confidence: Math.min(
      calculation.academic.confidence,
      calculation.psychological.confidence,
      calculation.physical.confidence
    )
  };

  // Generate recommendations based on scores
  calculation.recommendations = generateRecommendations(calculation, missingFrameworks);

  // Store detailed calculations
  calculation.details = {
    methodology: 'EduSight 360° Holistic Assessment',
    weights: weights,
    frameworkUsed: framework || 'generic',
    missingFrameworks: missingFrameworks || [],
    dataQuality: {
      academic: calculation.academic.confidence,
      psychological: calculation.psychological.confidence,
      physical: calculation.physical.confidence
    },
    timestamp: new Date().toISOString(),
    scoreBreakdown: {
      academic: {
        weighted: calculation.academic.score * weights.academic,
        raw: calculation.academic.score
      },
      psychological: {
        weighted: calculation.psychological.score * weights.psychological,
        raw: calculation.psychological.score
      },
      physical: {
        weighted: calculation.physical.score * weights.physical,
        raw: calculation.physical.score
      }
    }
  };

  return calculation;
}

function calculateAcademicScore(student: any, document: any, framework: string): any {
  const academic = {
    score: 0,
    breakdown: {
      gradePerformance: 0,
      consistency: 0,
      improvement: 0,
      attendance: 0,
      frameworkAlignment: 0
    },
    confidence: 0
  };

  let totalDataPoints = 0;
  let confidenceFactors = 0;

  // Get normalized grades from current document
  if (document?.dataNormalizations?.length > 0) {
    try {
      const normalizedData = JSON.parse(document.dataNormalizations[0].normalizedData);
      
      if (normalizedData.subjects && normalizedData.subjects.length > 0) {
        const scores = normalizedData.subjects.map((s: any) => s.normalizedScore).filter((s: number) => !isNaN(s));
        
        if (scores.length > 0) {
          academic.breakdown.gradePerformance = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
          totalDataPoints += scores.length;
          confidenceFactors += 0.3;
          
          // Calculate consistency (lower standard deviation = higher consistency)
          const mean = academic.breakdown.gradePerformance;
          const variance = scores.reduce((acc: number, score: number) => acc + Math.pow(score - mean, 2), 0) / scores.length;
          const stdDev = Math.sqrt(variance);
          academic.breakdown.consistency = Math.max(0, 100 - (stdDev * 2));
          confidenceFactors += 0.2;
        }
      }

      // Extract attendance if available
      if (normalizedData.attendance) {
        academic.breakdown.attendance = normalizedData.attendance;
        confidenceFactors += 0.2;
      }
    } catch (error) {
      console.error('Error processing normalized data:', error);
    }
  }

  // Analyze historical performance for improvement trends
  const academicRepositories = student.repositories.filter(
    (repo: any) => repo.repositoryType === 'academic' && repo.dataCategory === 'grades_and_performance'
  );

  if (academicRepositories.length > 1) {
    const historicalScores = academicRepositories.map((repo: any) => {
      try {
        const repoData = JSON.parse(repo.structuredData);
        if (repoData.grades && repoData.grades.length > 0) {
          const scores = repoData.grades.map((g: any) => normalizeGradeToScore(g.grade)).filter((s: number) => !isNaN(s));
          return {
            date: repo.createdAt,
            average: scores.reduce((a: number, b: number) => a + b, 0) / scores.length
          };
        }
      } catch (error) {
        return null;
      }
    }).filter(Boolean).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (historicalScores.length > 1) {
      const firstScore = historicalScores[0].average;
      const lastScore = historicalScores[historicalScores.length - 1].average;
      const improvement = lastScore - firstScore;
      
      // Convert improvement to 0-100 scale (0 = declined significantly, 50 = no change, 100 = improved significantly)
      academic.breakdown.improvement = Math.max(0, Math.min(100, 50 + improvement));
      confidenceFactors += 0.2;
    }
  }

  // Framework alignment bonus/penalty
  if (framework && framework !== 'unknown') {
    academic.breakdown.frameworkAlignment = 90; // High confidence with known framework
    confidenceFactors += 0.1;
  } else {
    academic.breakdown.frameworkAlignment = 60; // Lower confidence with unknown framework
  }

  // Calculate overall academic score
  const weights = {
    gradePerformance: 0.4,
    consistency: 0.2,
    improvement: 0.2,
    attendance: 0.15,
    frameworkAlignment: 0.05
  };

  academic.score = 
    (academic.breakdown.gradePerformance * weights.gradePerformance) +
    (academic.breakdown.consistency * weights.consistency) +
    (academic.breakdown.improvement * weights.improvement) +
    (academic.breakdown.attendance * weights.attendance) +
    (academic.breakdown.frameworkAlignment * weights.frameworkAlignment);

  academic.confidence = Math.min(0.95, confidenceFactors);

  return academic;
}

function calculatePsychologicalScore(student: any, document: any): any {
  const psychological = {
    score: 50, // Baseline score
    breakdown: {
      behavioralRisk: 75, // Default to good behavioral health
      emotionalStability: 70,
      socialSkills: 70,
      learningStyle: 60,
      cognitiveAbilities: 60
    },
    confidence: 0.3 // Lower confidence without direct psychological assessments
  };

  // Analyze behavioral assessments
  if (student.behavioralAnalyses.length > 0) {
    const latestBehavioral = student.behavioralAnalyses[0];
    
    // Convert risk level to score (inverted - lower risk = higher score)
    const riskScores = {
      'low': 85,
      'medium': 65,
      'high': 45,
      'critical': 25
    };
    
    psychological.breakdown.behavioralRisk = riskScores[latestBehavioral.riskLevel as keyof typeof riskScores] || 50;
    psychological.confidence += 0.3;

    try {
      const behavioralResults = JSON.parse(latestBehavioral.results);
      
      // Analyze behavioral indicators for emotional stability
      if (behavioralResults.indicators) {
        const positiveIndicators = behavioralResults.indicators.filter((i: string) => 
          i.includes('positive') || i.includes('cooperative') || i.includes('engaged')
        ).length;
        
        const negativeIndicators = behavioralResults.indicators.filter((i: string) => 
          i.includes('concern') || i.includes('difficulty') || i.includes('problematic')
        ).length;
        
        const indicatorRatio = positiveIndicators / Math.max(1, positiveIndicators + negativeIndicators);
        psychological.breakdown.emotionalStability = Math.round(indicatorRatio * 100);
        psychological.confidence += 0.2;
      }
    } catch (error) {
      console.error('Error processing behavioral analysis:', error);
    }
  }

  // Analyze academic patterns for cognitive abilities
  if (student.academicAnalyses.length > 0) {
    try {
      const academicResults = JSON.parse(student.academicAnalyses[0].results);
      
      if (academicResults.overallPerformance) {
        const performance = academicResults.overallPerformance;
        
        // Use academic performance as proxy for cognitive abilities
        psychological.breakdown.cognitiveAbilities = Math.min(95, performance.averageScore || 60);
        
        // Use consistency as indicator of learning style adaptation
        if (performance.standardDeviation !== undefined) {
          psychological.breakdown.learningStyle = Math.max(40, 100 - (performance.standardDeviation * 3));
        }
        
        psychological.confidence += 0.3;
      }
    } catch (error) {
      console.error('Error processing academic analysis:', error);
    }
  }

  // Analyze career aptitude for social skills
  if (student.careerAnalyses.length > 0) {
    try {
      const careerResults = JSON.parse(student.careerAnalyses[0].results);
      
      if (careerResults.personalityTraits) {
        const socialTraits = careerResults.personalityTraits.filter((trait: string) => 
          trait.includes('social') || trait.includes('extroverted') || trait.includes('leadership')
        ).length;
        
        psychological.breakdown.socialSkills = Math.min(90, 50 + (socialTraits * 15));
        psychological.confidence += 0.2;
      }
    } catch (error) {
      console.error('Error processing career analysis:', error);
    }
  }

  // Calculate overall psychological score
  const weights = {
    behavioralRisk: 0.3,
    emotionalStability: 0.25,
    socialSkills: 0.2,
    cognitiveAbilities: 0.15,
    learningStyle: 0.1
  };

  psychological.score = 
    (psychological.breakdown.behavioralRisk * weights.behavioralRisk) +
    (psychological.breakdown.emotionalStability * weights.emotionalStability) +
    (psychological.breakdown.socialSkills * weights.socialSkills) +
    (psychological.breakdown.cognitiveAbilities * weights.cognitiveAbilities) +
    (psychological.breakdown.learningStyle * weights.learningStyle);

  return psychological;
}

function calculatePhysicalScore(student: any): any {
  const physical = {
    score: 50, // Default baseline - no physical assessment data available
    breakdown: {
      motorSkills: 50,
      fitnessLevel: 50,
      healthIndicators: 50,
      physicalDevelopment: 50
    },
    confidence: 0.1 // Very low confidence without physical assessment data
  };

  // Check for any medical/physical data in repositories
  const physicalRepositories = student.repositories.filter(
    (repo: any) => repo.repositoryType === 'medical' || repo.repositoryType === 'physical'
  );

  if (physicalRepositories.length > 0) {
    // If physical data exists, increase confidence and adjust scores
    physical.confidence = 0.6;
    physical.score = 65; // Assume baseline good health if records are being maintained
    physical.breakdown = {
      motorSkills: 65,
      fitnessLevel: 65,
      healthIndicators: 65,
      physicalDevelopment: 65
    };
  }

  return physical;
}

function generateRecommendations(calculation: any, missingFrameworks: string[]): string[] {
  const recommendations: string[] = [];

  // Academic recommendations
  if (calculation.academic.score < 60) {
    recommendations.push('Academic intervention recommended - consider additional tutoring or support');
  } else if (calculation.academic.score > 85) {
    recommendations.push('Excellent academic performance - consider advanced placement or enrichment programs');
  }

  if (calculation.academic.breakdown.consistency < 50) {
    recommendations.push('Focus on consistent study habits and time management skills');
  }

  if (calculation.academic.breakdown.attendance < 80) {
    recommendations.push('Address attendance issues to improve academic outcomes');
  }

  // Psychological recommendations
  if (calculation.psychological.score < 50) {
    recommendations.push('Psychological support recommended - consider counseling or behavioral intervention');
  }

  if (calculation.psychological.breakdown.behavioralRisk < 60) {
    recommendations.push('Behavioral risk identified - implement support strategies and monitoring');
  }

  if (calculation.psychological.breakdown.socialSkills < 60) {
    recommendations.push('Social skills development programs recommended');
  }

  // Physical recommendations
  if (calculation.physical.score < 60) {
    recommendations.push('Physical assessment recommended to establish baseline health metrics');
  }

  if (calculation.physical.confidence < 0.4) {
    recommendations.push('Complete physical and motor skills assessment for comprehensive evaluation');
  }

  // Overall recommendations
  if (calculation.overall.score < 40) {
    recommendations.push('URGENT: Comprehensive intervention required across multiple domains');
  } else if (calculation.overall.score < 60) {
    recommendations.push('Moderate support needed - develop targeted improvement plan');
  } else if (calculation.overall.score > 80) {
    recommendations.push('Strong overall development - maintain current trajectory with occasional monitoring');
  }

  // Framework-specific recommendations
  if (missingFrameworks && missingFrameworks.length > 0) {
    recommendations.push(`Note: Analysis conducted without specific framework (${missingFrameworks.join(', ')}). Results may be less precise.`);
  }

  return recommendations.slice(0, 8); // Limit to top 8 recommendations
}

function normalizeGradeToScore(grade: string): number {
  // Same normalization function used in other endpoints
  const gradeStr = grade.trim();

  if (/^[A-F][+-]?$/i.test(gradeStr)) {
    const letterGrades: { [key: string]: number } = {
      'A+': 97, 'A': 94, 'A-': 90,
      'B+': 87, 'B': 84, 'B-': 80,
      'C+': 77, 'C': 74, 'C-': 70,
      'D+': 67, 'D': 64, 'D-': 60,
      'F': 50
    };
    return letterGrades[gradeStr.toUpperCase()] || 0;
  }

  if (/^\d{1,3}(\.\d+)?%?$/.test(gradeStr)) {
    const numMatch = gradeStr.match(/(\d{1,3}(?:\.\d+)?)/);
    if (numMatch) {
      return Math.min(100, parseFloat(numMatch[1]));
    }
  }

  if (/^\d{1,2}\/\d{1,2}$/.test(gradeStr)) {
    const parts = gradeStr.split('/');
    const numerator = parseInt(parts[0]);
    const denominator = parseInt(parts[1]);
    return Math.round((numerator / denominator) * 100);
  }

  return 0;
}
