import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-new';

// GET /api/questionnaire-responses - Get questionnaire responses
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'QUESTIONNAIRE_RESPONSE',
      action: 'READ',
      scope: 'OWN'
    });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const questionnaireId = searchParams.get('questionnaireId');
    const status = searchParams.get('status');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const whereClause: any = {
      sessionId,
      session: {
        OR: [
          { studentId: user.id },
          { parentId: user.id }
        ]
      }
    };

    if (questionnaireId) whereClause.questionnaireId = questionnaireId;
    if (status) whereClause.status = status;

    const responses = await prisma.questionnaireResponse.findMany({
      where: whereClause,
      include: {
        questionnaire: {
          select: { name: true, category: true, subcategory: true }
        },
        responses: {
          include: {
            question: {
              select: { questionText: true, category: true }
            },
            option: {
              select: { label: true, value: true }
            }
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json({ responses });

  } catch (error) {
    console.error('Error fetching questionnaire responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire responses' },
      { status: 500 }
    );
  }
}

// POST /api/questionnaire-responses - Create or update questionnaire response
export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'QUESTIONNAIRE_RESPONSE',
      action: 'CREATE',
      scope: 'OWN'
    });

    const body = await request.json();
    const {
      sessionId,
      questionnaireId,
      responses,
      timeSpent,
      status = 'COMPLETED'
    } = body;

    // Validate required fields
    if (!sessionId || !questionnaireId || !responses) {
      return NextResponse.json(
        { error: 'Session ID, questionnaire ID, and responses are required' },
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

    // Get questionnaire details
    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      include: {
        questions: {
          include: { options: true }
        }
      }
    });

    if (!questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      );
    }

    // Calculate score and interpretation
    const { score, interpretation } = calculateQuestionnaireScore(responses, questionnaire);

    // Create or update questionnaire response
    const questionnaireResponse = await prisma.questionnaireResponse.upsert({
      where: {
        sessionId_questionnaireId: {
          sessionId,
          questionnaireId
        }
      },
      update: {
        status,
        timeSpent,
        answeredQuestions: responses.length,
        score,
        interpretation,
        completedAt: status === 'COMPLETED' ? new Date() : null,
        responses: {
          deleteMany: {},
          create: responses.map((response: any) => ({
            questionId: response.questionId,
            optionId: response.optionId,
            value: response.value,
            textResponse: response.textResponse,
            timeSpent: response.timeSpent
          }))
        }
      },
      create: {
        sessionId,
        questionnaireId,
        status,
        timeSpent,
        totalQuestions: questionnaire.questions.length,
        answeredQuestions: responses.length,
        score,
        interpretation,
        completedAt: status === 'COMPLETED' ? new Date() : null,
        responses: {
          create: responses.map((response: any) => ({
            questionId: response.questionId,
            optionId: response.optionId,
            value: response.value,
            textResponse: response.textResponse,
            timeSpent: response.timeSpent
          }))
        }
      },
      include: {
        questionnaire: {
          select: { name: true, category: true }
        },
        responses: {
          include: {
            question: {
              select: { questionText: true }
            },
            option: {
              select: { label: true, value: true }
            }
          }
        }
      }
    });

    // Update session progress
    await updateSessionProgress(sessionId);

    return NextResponse.json({
      success: true,
      questionnaireResponse
    });

  } catch (error) {
    console.error('Error saving questionnaire response:', error);
    return NextResponse.json(
      { error: 'Failed to save questionnaire response' },
      { status: 500 }
    );
  }
}

// Helper function to calculate questionnaire score
function calculateQuestionnaireScore(responses: any[], questionnaire: any) {
  let totalScore = 0;
  let maxScore = 0;
  let answeredQuestions = 0;

  responses.forEach((response) => {
    if (response.value !== null && response.value !== undefined) {
      totalScore += response.value;
      answeredQuestions++;
    }
  });

  // Calculate max possible score
  questionnaire.questions.forEach((question: any) => {
    const maxOptionValue = Math.max(...question.options.map((opt: any) => opt.value));
    maxScore += maxOptionValue;
  });

  const score = answeredQuestions > 0 ? (totalScore / maxScore) * 100 : 0;

  // Generate interpretation based on score
  let interpretation = '';
  if (score >= 80) {
    interpretation = 'Excellent performance with strong alignment to assessment criteria';
  } else if (score >= 60) {
    interpretation = 'Good performance with moderate alignment to assessment criteria';
  } else if (score >= 40) {
    interpretation = 'Average performance with some areas for improvement';
  } else {
    interpretation = 'Below average performance with significant areas for development';
  }

  return { score, interpretation };
}

// Helper function to update session progress
async function updateSessionProgress(sessionId: string) {
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      questionnaires: true,
      assessments: true
    }
  });

  if (!session) return;

  // Calculate progress based on completed components
  const totalComponents = 4; // academic, psychometric, physical, parent insights
  let completedComponents = 0;

  if (session.academicDataCollected) completedComponents++;
  if (session.psychometricDataCollected) completedComponents++;
  if (session.physicalDataCollected) completedComponents++;
  if (session.parentInsightsCollected) completedComponents++;

  const progress = completedComponents / totalComponents;

  // Update session
  await prisma.assessmentSession.update({
    where: { id: sessionId },
    data: {
      progress,
      lastActivityAt: new Date(),
      status: progress === 1 ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: progress === 1 ? new Date() : null
    }
  });
}
