import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-new';

// GET /api/assessment-sessions - Get assessment sessions for user
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'ASSESSMENT_SESSION',
      action: 'READ',
      scope: 'OWN'
    });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause: any = {
      OR: [
        { studentId: user.id },
        { parentId: user.id }
      ]
    };

    if (status) {
      whereClause.status = status;
    }

    const sessions = await prisma.assessmentSession.findMany({
      where: whereClause,
      include: {
        student: {
          select: { id: true, name: true, email: true }
        },
        parent: {
          select: { id: true, name: true, email: true }
        },
        questionnaires: {
          include: {
            questionnaire: {
              select: { name: true, category: true }
            }
          }
        },
        assessments: {
          select: { id: true, type: true, status: true, score: true }
        },
        aiInsights: {
          select: { id: true, domain: true, priority: true }
        },
        finalReport: {
          select: { id: true, status: true, reportType: true }
        },
        _count: {
          select: {
            questionnaires: true,
            assessments: true,
            aiInsights: true
          }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: limit,
      skip: offset
    });

    const totalCount = await prisma.assessmentSession.count({
      where: whereClause
    });

    return NextResponse.json({
      sessions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching assessment sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment sessions' },
      { status: 500 }
    );
  }
}

// POST /api/assessment-sessions - Create new assessment session
export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'ASSESSMENT_SESSION',
      action: 'CREATE',
      scope: 'OWN'
    });

    const body = await request.json();
    const {
      sessionType = 'REGISTERED',
      studentName,
      studentAge,
      studentGrade,
      ageGroup,
      studentId
    } = body;

    // Validate required fields
    if (!studentName || !studentAge) {
      return NextResponse.json(
        { error: 'Student name and age are required' },
        { status: 400 }
      );
    }

    // Create assessment session
    const session = await prisma.assessmentSession.create({
      data: {
        studentId: studentId || null,
        parentId: user.role === 'PARENT' ? user.id : null,
        sessionType,
        studentName,
        studentAge: parseInt(studentAge),
        studentGrade,
        ageGroup,
        status: 'IN_PROGRESS',
        currentStep: 'DATA_COLLECTION',
        progress: 0.0
      },
      include: {
        student: {
          select: { id: true, name: true, email: true }
        },
        parent: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Error creating assessment session:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment session' },
      { status: 500 }
    );
  }
}
