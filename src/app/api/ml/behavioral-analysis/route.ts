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
          where: { assessmentType: 'behavioral' },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Initialize ML service if not already done
    await mlService.initialize();

    // Prepare behavioral analysis data
    const behavioralData = prepareBehavioralData(extractedData, student);
    
    // Run behavioral risk assessment
    const behavioralAnalysis = await mlService.riskAssessment.assessRisk(behavioralData);

    // Store analysis results
    const analysis = await prisma.behavioralAnalysis.create({
      data: {
        documentId,
        studentId,
        analysisType: 'behavioral_risk',
        inputData: JSON.stringify(behavioralData),
        results: JSON.stringify(behavioralAnalysis),
        riskLevel: behavioralAnalysis.riskLevel || 'low',
        confidence: behavioralAnalysis.confidence || 0.80,
        status: 'completed',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      analysis: behavioralAnalysis,
      analysisId: analysis.id,
      message: 'Behavioral analysis completed successfully'
    });

  } catch (error) {
    console.error('Behavioral analysis error:', error);
    return NextResponse.json({
      error: 'Behavioral analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function prepareBehavioralData(extractedData: any, student: any): any {
  const behavioralData: any = {
    studentId: student.id,
    grade: student.grade || '10',
    academicPerformance: {},
    attendancePatterns: {},
    teacherObservations: [],
    historicalBehavior: [],
    riskFactors: []
  };

  // Extract academic performance indicators
  if (extractedData.structuredData?.grades) {
    const scores = extractedData.structuredData.grades
      .map((g: any) => normalizeGradeToScore(g.grade))
      .filter((s: number) => !isNaN(s));
    
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      behavioralData.academicPerformance = {
        averageScore: avgScore,
        consistency: calculateConsistency(scores),
        trend: calculateTrend(scores),
        subjectVariability: calculateStandardDeviation(scores)
      };

      // Identify academic risk factors
      if (avgScore < 60) {
        behavioralData.riskFactors.push('low_academic_performance');
      }
      if (calculateStandardDeviation(scores) > 20) {
        behavioralData.riskFactors.push('inconsistent_performance');
      }
    }
  }

  // Extract attendance patterns
  if (extractedData.structuredData?.attendance) {
    const attendanceMatch = extractedData.structuredData.attendance.match(/(\d+(?:\.\d+)?)/);
    if (attendanceMatch) {
      const attendanceRate = parseFloat(attendanceMatch[1]);
      behavioralData.attendancePatterns = {
        rate: attendanceRate,
        category: categorizeAttendance(attendanceRate)
      };

      // Attendance risk factors
      if (attendanceRate < 80) {
        behavioralData.riskFactors.push('poor_attendance');
      }
      if (attendanceRate < 60) {
        behavioralData.riskFactors.push('chronic_absenteeism');
      }
    }
  }

  // Extract teacher comments and behavioral observations
  if (extractedData.structuredData?.teacherComments) {
    behavioralData.teacherObservations = extractedData.structuredData.teacherComments
      .map((comment: string) => analyzeBehavioralComment(comment))
      .filter((analysis: any) => analysis.relevance > 0.5);
  }

  // Add historical behavioral data
  if (student.assessments) {
    behavioralData.historicalBehavior = student.assessments.map((assessment: any) => ({
      date: assessment.createdAt,
      riskLevel: assessment.riskLevel || 'unknown',
      score: assessment.totalScore || 0,
      notes: assessment.notes
    }));
  }

  // Calculate behavioral indicators
  behavioralData.indicators = calculateBehavioralIndicators(behavioralData);

  return behavioralData;
}

function normalizeGradeToScore(grade: string): number {
  // Same function as in academic analysis
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

function calculateConsistency(scores: number[]): number {
  if (scores.length < 2) return 100;
  const std = calculateStandardDeviation(scores);
  return Math.max(0, 100 - (std * 2)); // Lower std = higher consistency
}

function calculateTrend(scores: number[]): string {
  if (scores.length < 3) return 'insufficient_data';
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const difference = secondAvg - firstAvg;
  
  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

function categorizeAttendance(rate: number): string {
  if (rate >= 95) return 'excellent';
  if (rate >= 90) return 'good';
  if (rate >= 80) return 'satisfactory';
  if (rate >= 70) return 'poor';
  return 'critical';
}

function analyzeBehavioralComment(comment: string): any {
  const analysis = {
    text: comment,
    sentiment: 'neutral',
    relevance: 0,
    keywords: [] as string[],
    indicators: [] as string[]
  };

  const lowerComment = comment.toLowerCase();

  // Positive indicators
  const positiveKeywords = [
    'excellent', 'outstanding', 'good', 'positive', 'cooperative', 
    'helpful', 'participative', 'engaged', 'motivated', 'responsible'
  ];

  // Negative indicators
  const negativeKeywords = [
    'poor', 'disruptive', 'problematic', 'aggressive', 'withdrawn',
    'uncooperative', 'distracted', 'unmotivated', 'concerning', 'difficult'
  ];

  // Behavioral concern keywords
  const concernKeywords = [
    'attention', 'focus', 'behavior', 'social', 'emotional', 'anxiety',
    'stress', 'depression', 'anger', 'impulsive', 'hyperactive'
  ];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveKeywords.forEach(keyword => {
    if (lowerComment.includes(keyword)) {
      analysis.keywords.push(keyword);
      analysis.indicators.push('positive_behavior');
      positiveCount++;
    }
  });

  negativeKeywords.forEach(keyword => {
    if (lowerComment.includes(keyword)) {
      analysis.keywords.push(keyword);
      analysis.indicators.push('behavioral_concern');
      negativeCount++;
    }
  });

  concernKeywords.forEach(keyword => {
    if (lowerComment.includes(keyword)) {
      analysis.keywords.push(keyword);
      analysis.indicators.push('requires_attention');
    }
  });

  // Determine sentiment
  if (positiveCount > negativeCount) {
    analysis.sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    analysis.sentiment = 'negative';
  }

  // Calculate relevance based on behavioral keywords found
  analysis.relevance = Math.min(1, (analysis.keywords.length * 0.2) + 0.1);

  return analysis;
}

function calculateBehavioralIndicators(data: any): any {
  const indicators = {
    academicEngagement: 'medium',
    socialBehavior: 'medium',
    emotionalStability: 'medium',
    riskLevel: 'low',
    strengths: [] as string[],
    concerns: [] as string[],
    recommendations: [] as string[]
  };

  // Academic engagement
  if (data.academicPerformance?.averageScore) {
    const score = data.academicPerformance.averageScore;
    if (score > 80) {
      indicators.academicEngagement = 'high';
      indicators.strengths.push('Strong academic performance');
    } else if (score < 60) {
      indicators.academicEngagement = 'low';
      indicators.concerns.push('Below average academic performance');
      indicators.recommendations.push('Additional academic support recommended');
    }
  }

  // Attendance impact on engagement
  if (data.attendancePatterns?.rate) {
    const rate = data.attendancePatterns.rate;
    if (rate < 80) {
      indicators.concerns.push('Poor attendance affecting engagement');
      indicators.recommendations.push('Investigate attendance barriers');
    }
  }

  // Risk level assessment
  const riskFactorCount = data.riskFactors?.length || 0;
  if (riskFactorCount === 0) {
    indicators.riskLevel = 'low';
  } else if (riskFactorCount <= 2) {
    indicators.riskLevel = 'medium';
  } else {
    indicators.riskLevel = 'high';
    indicators.recommendations.push('Comprehensive behavioral intervention needed');
  }

  return indicators;
}
