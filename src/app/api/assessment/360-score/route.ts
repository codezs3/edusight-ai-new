import { NextRequest, NextResponse } from 'next/server';
import EduSight360ScoreEngine, { AssessmentDomain } from '@/lib/ai/assessment/EduSight360Score';

export async function POST(request: NextRequest) {
  try {
    const assessmentData: AssessmentDomain = await request.json();
    
    // Validate required fields
    if (!assessmentData.academic || !assessmentData.psychological || !assessmentData.physical) {
      return NextResponse.json(
        { error: 'Missing required assessment domains' },
        { status: 400 }
      );
    }

    // Calculate EduSight 360° Score
    const scoreEngine = EduSight360ScoreEngine.getInstance();
    const result = scoreEngine.calculateEduSight360Score(assessmentData);

    // Log assessment for analytics (in production, use proper logging)
    console.log(`EduSight 360° Assessment completed - Score: ${result.overallScore}, Risk: ${result.riskLevel}`);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calculating EduSight 360° Score:', error);
    return NextResponse.json(
      { error: 'Internal server error during assessment calculation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json(
      { error: 'Student ID is required' },
      { status: 400 }
    );
  }

  try {
    // In a real application, fetch from database
    // For now, return sample data structure
    const sampleResult = {
      studentId,
      overallScore: 85,
      domainScores: {
        academic: 88,
        psychological: 82,
        physical: 85
      },
      riskLevel: 'low',
      interventionRequired: false,
      medicalReferralNeeded: false,
      lastAssessmentDate: new Date().toISOString(),
      recommendations: [
        {
          domain: 'academic',
          priority: 'medium',
          type: 'enhancement',
          action: 'Continue current academic progress with advanced challenges',
          timeline: '4-6 weeks',
          expectedOutcome: 'Maintain high performance and explore advanced topics',
          resources: ['Advanced coursework', 'Enrichment programs', 'Peer tutoring opportunities']
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: sampleResult
    });

  } catch (error) {
    console.error('Error fetching EduSight 360° Score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
