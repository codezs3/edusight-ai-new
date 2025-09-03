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

    const { documentId } = await request.json();
    const studentId = params.id;

    // Get student with all repository data and existing scores
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        repositories: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        },
        eduSightScores: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Last 5 scores for trend analysis
        },
        assessments: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Recent assessments
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get the current document data
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId },
      include: {
        dataNormalizations: { orderBy: { createdAt: 'desc' }, take: 1 },
        academicAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 },
        behavioralAnalyses: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Aggregate academic scores
    const academicAggregation = aggregateAcademicScores(student, document);

    // Aggregate behavioral data
    const behavioralAggregation = aggregateBehavioralData(student, document);

    // Calculate trends and improvements
    const trendAnalysis = calculateTrends(student.eduSightScores, academicAggregation);

    // Store aggregated results
    const aggregation = await prisma.scoreAggregation.create({
      data: {
        studentId,
        documentId,
        aggregationType: 'comprehensive',
        academicAggregation: JSON.stringify(academicAggregation),
        behavioralAggregation: JSON.stringify(behavioralAggregation),
        trendAnalysis: JSON.stringify(trendAnalysis),
        dataPoints: academicAggregation.dataPoints + behavioralAggregation.dataPoints,
        confidence: calculateOverallConfidence(academicAggregation, behavioralAggregation),
        status: 'completed',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      aggregation: {
        id: aggregation.id,
        academic: academicAggregation,
        behavioral: behavioralAggregation,
        trends: trendAnalysis,
        dataPoints: aggregation.dataPoints,
        confidence: aggregation.confidence
      },
      message: 'Score aggregation completed successfully'
    });

  } catch (error) {
    console.error('Score aggregation error:', error);
    return NextResponse.json({
      error: 'Score aggregation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function aggregateAcademicScores(student: any, document: any): any {
  const aggregation = {
    currentScores: [] as any[],
    historicalScores: [] as any[],
    subjectPerformance: {} as any,
    overallTrend: 'stable' as string,
    improvements: [] as string[],
    concerns: [] as string[],
    dataPoints: 0,
    confidence: 0
  };

  // Process current document data
  if (document.dataNormalizations.length > 0) {
    const normalizedData = JSON.parse(document.dataNormalizations[0].normalizedData);
    aggregation.currentScores = normalizedData.subjects || [];
    aggregation.dataPoints += aggregation.currentScores.length;
  }

  // Process historical repository data
  const academicRepositories = student.repositories.filter(
    (repo: any) => repo.repositoryType === 'academic' && repo.dataCategory === 'grades_and_performance'
  );

  academicRepositories.forEach((repo: any) => {
    try {
      const repoData = JSON.parse(repo.structuredData);
      if (repoData.grades) {
        aggregation.historicalScores.push({
          date: repo.createdAt,
          grades: repoData.grades,
          framework: repoData.framework,
          documentId: repo.documentId
        });
        aggregation.dataPoints += repoData.grades.length;
      }
    } catch (error) {
      console.error('Error parsing repository data:', error);
    }
  });

  // Aggregate by subject
  const allScores = [...aggregation.currentScores, ...aggregation.historicalScores.flatMap(h => h.grades || [])];
  
  allScores.forEach((scoreData: any) => {
    const subject = scoreData.normalizedSubject || scoreData.subject;
    const score = scoreData.normalizedScore || scoreData.score;
    
    if (subject && !isNaN(score)) {
      if (!aggregation.subjectPerformance[subject]) {
        aggregation.subjectPerformance[subject] = {
          scores: [],
          average: 0,
          trend: 'stable',
          improvement: 0
        };
      }
      
      aggregation.subjectPerformance[subject].scores.push({
        score,
        date: scoreData.date || new Date(),
        framework: scoreData.framework
      });
    }
  });

  // Calculate subject statistics
  Object.keys(aggregation.subjectPerformance).forEach(subject => {
    const subjectData = aggregation.subjectPerformance[subject];
    const scores = subjectData.scores.map((s: any) => s.score);
    
    if (scores.length > 0) {
      subjectData.average = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
      
      // Calculate trend
      if (scores.length > 1) {
        const recent = scores.slice(-Math.min(3, scores.length));
        const earlier = scores.slice(0, Math.max(1, scores.length - 3));
        const recentAvg = recent.reduce((a: number, b: number) => a + b, 0) / recent.length;
        const earlierAvg = earlier.reduce((a: number, b: number) => a + b, 0) / earlier.length;
        
        const improvement = recentAvg - earlierAvg;
        subjectData.improvement = improvement;
        
        if (improvement > 5) {
          subjectData.trend = 'improving';
          aggregation.improvements.push(`${subject}: +${improvement.toFixed(1)} points`);
        } else if (improvement < -5) {
          subjectData.trend = 'declining';
          aggregation.concerns.push(`${subject}: ${improvement.toFixed(1)} points`);
        } else {
          subjectData.trend = 'stable';
        }
      }
    }
  });

  // Overall trend analysis
  const improvements = Object.values(aggregation.subjectPerformance)
    .map((s: any) => s.improvement)
    .filter((imp: number) => !isNaN(imp));
    
  if (improvements.length > 0) {
    const avgImprovement = improvements.reduce((a: number, b: number) => a + b, 0) / improvements.length;
    if (avgImprovement > 2) {
      aggregation.overallTrend = 'improving';
    } else if (avgImprovement < -2) {
      aggregation.overallTrend = 'declining';
    }
  }

  // Calculate confidence based on data quality and quantity
  aggregation.confidence = Math.min(0.95, 0.3 + (aggregation.dataPoints * 0.05));

  return aggregation;
}

function aggregateBehavioralData(student: any, document: any): any {
  const aggregation = {
    currentRiskLevel: 'low' as string,
    riskHistory: [] as any[],
    behavioralIndicators: [] as string[],
    socialEmotionalProfile: {} as any,
    interventions: [] as string[],
    dataPoints: 0,
    confidence: 0
  };

  // Process current document behavioral analysis
  if (document.behavioralAnalyses.length > 0) {
    const analysis = document.behavioralAnalyses[0];
    aggregation.currentRiskLevel = analysis.riskLevel;
    
    try {
      const analysisResults = JSON.parse(analysis.results);
      aggregation.behavioralIndicators = analysisResults.indicators || [];
      aggregation.dataPoints += 1;
    } catch (error) {
      console.error('Error parsing behavioral analysis:', error);
    }
  }

  // Process historical behavioral data
  const behavioralRepositories = student.repositories.filter(
    (repo: any) => repo.repositoryType === 'behavioral'
  );

  behavioralRepositories.forEach((repo: any) => {
    try {
      const repoData = JSON.parse(repo.structuredData);
      aggregation.riskHistory.push({
        date: repo.createdAt,
        riskLevel: repoData.riskLevel,
        indicators: repoData.analysisResults?.indicators || [],
        documentId: repo.documentId
      });
      aggregation.dataPoints += 1;
    } catch (error) {
      console.error('Error parsing behavioral repository data:', error);
    }
  });

  // Analyze risk progression
  if (aggregation.riskHistory.length > 0) {
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const currentRiskIndex = riskLevels.indexOf(aggregation.currentRiskLevel);
    const previousRiskIndex = riskLevels.indexOf(aggregation.riskHistory[0]?.riskLevel || 'low');
    
    if (currentRiskIndex > previousRiskIndex) {
      aggregation.interventions.push('Risk level has increased - immediate attention recommended');
    } else if (currentRiskIndex < previousRiskIndex) {
      aggregation.interventions.push('Risk level has improved - continue current support strategies');
    }
  }

  // Generate social-emotional profile
  const allIndicators = [
    ...aggregation.behavioralIndicators,
    ...aggregation.riskHistory.flatMap(h => h.indicators || [])
  ];

  const indicatorCounts = allIndicators.reduce((acc: any, indicator: string) => {
    acc[indicator] = (acc[indicator] || 0) + 1;
    return acc;
  }, {});

  aggregation.socialEmotionalProfile = {
    primaryConcerns: Object.entries(indicatorCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([indicator]) => indicator),
    stabilityIndex: calculateStabilityIndex(aggregation.riskHistory),
    supportNeeds: generateSupportRecommendations(aggregation.currentRiskLevel, allIndicators)
  };

  // Calculate confidence
  aggregation.confidence = Math.min(0.9, 0.4 + (aggregation.dataPoints * 0.1));

  return aggregation;
}

function calculateTrends(historicalScores: any[], currentAggregation: any): any {
  const trends = {
    academicTrend: 'stable' as string,
    behavioralTrend: 'stable' as string,
    overallProgress: 0,
    milestones: [] as string[],
    predictions: {} as any
  };

  if (historicalScores.length > 1) {
    const recentScores = historicalScores.slice(0, 3);
    const academicScores = recentScores.map(score => score.academicScore).filter(s => !isNaN(s));
    
    if (academicScores.length > 1) {
      const firstScore = academicScores[academicScores.length - 1];
      const lastScore = academicScores[0];
      const improvement = lastScore - firstScore;
      
      trends.overallProgress = improvement;
      
      if (improvement > 5) {
        trends.academicTrend = 'improving';
        trends.milestones.push(`Academic performance improved by ${improvement.toFixed(1)} points`);
      } else if (improvement < -5) {
        trends.academicTrend = 'declining';
        trends.milestones.push(`Academic performance declined by ${Math.abs(improvement).toFixed(1)} points`);
      }
    }
  }

  // Predict next academic performance
  if (currentAggregation.dataPoints > 3) {
    const subjectAverages = Object.values(currentAggregation.subjectPerformance)
      .map((subject: any) => subject.average)
      .filter((avg: number) => !isNaN(avg));
      
    if (subjectAverages.length > 0) {
      const currentAvg = subjectAverages.reduce((a: number, b: number) => a + b, 0) / subjectAverages.length;
      trends.predictions.nextTermExpected = Math.round(currentAvg + (trends.overallProgress * 0.3));
      trends.predictions.confidence = Math.min(0.8, currentAggregation.confidence);
    }
  }

  return trends;
}

function calculateStabilityIndex(riskHistory: any[]): number {
  if (riskHistory.length < 2) return 1.0;
  
  const riskLevels = ['low', 'medium', 'high', 'critical'];
  const changes = riskHistory.slice(1).map((current, index) => {
    const prev = riskHistory[index];
    const currentIndex = riskLevels.indexOf(current.riskLevel);
    const prevIndex = riskLevels.indexOf(prev.riskLevel);
    return Math.abs(currentIndex - prevIndex);
  });
  
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  return Math.max(0, 1 - (avgChange / 3)); // Normalize to 0-1 scale
}

function generateSupportRecommendations(riskLevel: string, indicators: string[]): string[] {
  const recommendations: string[] = [];
  
  switch (riskLevel) {
    case 'high':
    case 'critical':
      recommendations.push('Immediate intervention required');
      recommendations.push('Counselor consultation recommended');
      break;
    case 'medium':
      recommendations.push('Regular monitoring advised');
      recommendations.push('Additional support strategies');
      break;
    default:
      recommendations.push('Continue current support level');
  }
  
  // Add indicator-specific recommendations
  if (indicators.includes('academic_concern')) {
    recommendations.push('Academic tutoring support');
  }
  if (indicators.includes('social_difficulty')) {
    recommendations.push('Social skills development programs');
  }
  if (indicators.includes('emotional_instability')) {
    recommendations.push('Emotional regulation support');
  }
  
  return recommendations.slice(0, 4); // Limit to 4 recommendations
}

function calculateOverallConfidence(academic: any, behavioral: any): number {
  const weights = {
    academic: 0.6,
    behavioral: 0.4
  };
  
  return Math.round(
    (academic.confidence * weights.academic + behavioral.confidence * weights.behavioral) * 100
  ) / 100;
}
