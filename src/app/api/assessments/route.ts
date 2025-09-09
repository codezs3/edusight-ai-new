import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-new';

// GET /api/assessments - Get assessments for a session
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'ASSESSMENT',
      action: 'READ',
      scope: 'OWN'
    });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const type = searchParams.get('type');
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

    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    const assessments = await prisma.assessment.findMany({
      where: whereClause,
      orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json({ assessments });

  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

// POST /api/assessments - Create or update assessment
export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'ASSESSMENT',
      action: 'CREATE',
      scope: 'OWN'
    });

    const body = await request.json();
    const {
      sessionId,
      type,
      subtype,
      data,
      results,
      score,
      interpretation,
      recommendations,
      status = 'COMPLETED'
    } = body;

    // Validate required fields
    if (!sessionId || !type) {
      return NextResponse.json(
        { error: 'Session ID and type are required' },
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

    // Create or update assessment
    const assessment = await prisma.assessment.upsert({
      where: {
        sessionId_type: {
          sessionId,
          type
        }
      },
      update: {
        subtype,
        data,
        results,
        score,
        interpretation,
        recommendations,
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null
      },
      create: {
        sessionId,
        type,
        subtype,
        data,
        results,
        score,
        interpretation,
        recommendations,
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null
      }
    });

    // Update session data collection status
    await updateDataCollectionStatus(sessionId, type, status === 'COMPLETED');

    return NextResponse.json({
      success: true,
      assessment
    });

  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}

// Helper function to update data collection status
async function updateDataCollectionStatus(sessionId: string, type: string, isCompleted: boolean) {
  const updateData: any = {};

  switch (type) {
    case 'ACADEMIC':
      updateData.academicDataCollected = isCompleted;
      break;
    case 'PSYCHOMETRIC':
      updateData.psychometricDataCollected = isCompleted;
      break;
    case 'PHYSICAL':
      updateData.physicalDataCollected = isCompleted;
      break;
    case 'PARENT_INSIGHTS':
      updateData.parentInsightsCollected = isCompleted;
      break;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.assessmentSession.update({
      where: { id: sessionId },
      data: updateData
    });
  }
}
