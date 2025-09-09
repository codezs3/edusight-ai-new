import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-new';
import { calculateCareerMatches, JOB_SKILL_MAPPINGS } from '@/lib/career-mapping-data';

// GET /api/career-mapping - Get career mappings for a session
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'CAREER_MAPPING',
      action: 'READ',
      scope: 'OWN'
    });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get career mappings for the session
    const careerMappings = await prisma.careerMapping.findMany({
      where: {
        sessionId,
        session: {
          OR: [
            { studentId: user.id },
            { parentId: user.id }
          ]
        }
      },
      include: {
        careerField: true,
        careerPath: true
      },
      orderBy: [
        { matchScore: 'desc' },
        { confidence: 'desc' }
      ]
    });

    return NextResponse.json({ careerMappings });
  } catch (error) {
    console.error('Error fetching career mappings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career mappings' },
      { status: 500 }
    );
  }
}

// POST /api/career-mapping - Create new career mappings
export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'CAREER_MAPPING',
      action: 'CREATE',
      scope: 'OWN'
    });

    const body = await request.json();
    const { sessionId, assessmentData } = body;

    if (!sessionId || !assessmentData) {
      return NextResponse.json(
        { error: 'Session ID and assessment data are required' },
        { status: 400 }
      );
    }

    // Verify session ownership
    const session = await prisma.assessmentSession.findFirst({
      where: {
        id: sessionId,
        OR: [
          { studentId: user.id },
          { parentId: user.id }
        ]
      }
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    // Convert assessment data to personality profile
    const personalityProfile = {
      bigFive: {
        openness: assessmentData.psychometric?.bigFive?.openness || 0.5,
        conscientiousness: assessmentData.psychometric?.bigFive?.conscientiousness || 0.5,
        extraversion: assessmentData.psychometric?.bigFive?.extraversion || 0.5,
        agreeableness: assessmentData.psychometric?.bigFive?.agreeableness || 0.5,
        neuroticism: assessmentData.psychometric?.bigFive?.neuroticism || 0.5
      },
      mbti: assessmentData.psychometric?.mbti,
      skills: assessmentData.skills || {},
      interests: assessmentData.interests || [],
      values: assessmentData.values || [],
      academicPerformance: assessmentData.academic || {}
    };

    // Calculate career matches
    const careerMatches = calculateCareerMatches(personalityProfile, JOB_SKILL_MAPPINGS);

    // Get or create career fields
    const careerFields = await Promise.all(
      careerMatches.map(async (match) => {
        let careerField = await prisma.careerField.findFirst({
          where: { name: match.jobTitle }
        });

        if (!careerField) {
          // Create new career field based on job mapping
          const jobMapping = JOB_SKILL_MAPPINGS.find(job => job.jobId === match.jobId);
          if (jobMapping) {
            careerField = await prisma.careerField.create({
              data: {
                name: jobMapping.jobTitle,
                description: jobMapping.jobDescription,
                category: jobMapping.jobCategory,
                growthRate: jobMapping.growthRate,
                avgSalary: jobMapping.salaryRange.max,
                educationLevel: jobMapping.educationLevel,
                skills: jobMapping.requiredSkills,
                personalityTraits: jobMapping.personalityTraits,
                workEnvironment: jobMapping.workEnvironment
              }
            });
          }
        }

        return { match, careerField };
      })
    );

    // Create career mappings in database
    const createdMappings = await Promise.all(
      careerFields.map(async ({ match, careerField }) => {
        if (!careerField) return null;

        return await prisma.careerMapping.create({
          data: {
            sessionId,
            careerFieldId: careerField.id,
            matchScore: match.matchScore,
            confidence: match.confidence,
            reasoning: match.reasoning,
            strengths: match.strengths,
            gaps: match.gaps,
            recommendations: match.recommendations,
            timeline: match.timeline,
            priority: match.priority,
            isRecommended: match.priority === 'HIGH'
          },
          include: {
            careerField: true
          }
        });
      })
    );

    // Filter out null results
    const validMappings = createdMappings.filter(mapping => mapping !== null);

    return NextResponse.json({
      success: true,
      careerMappings: validMappings,
      totalMatches: validMappings.length
    });

  } catch (error) {
    console.error('Error creating career mappings:', error);
    return NextResponse.json(
      { error: 'Failed to create career mappings' },
      { status: 500 }
    );
  }
}
