import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-new';

// GET /api/assessment-reports - Get assessment reports
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'ASSESSMENT_REPORT',
      action: 'READ',
      scope: 'OWN'
    });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const reportType = searchParams.get('reportType');
    const status = searchParams.get('status');

    const whereClause: any = {
      session: {
        OR: [
          { studentId: user.id },
          { parentId: user.id }
        ]
      }
    };

    if (sessionId) whereClause.sessionId = sessionId;
    if (reportType) whereClause.reportType = reportType;
    if (status) whereClause.status = status;

    const reports = await prisma.assessmentReport.findMany({
      where: whereClause,
      include: {
        session: {
          select: {
            id: true,
            studentName: true,
            studentAge: true,
            startedAt: true
          }
        }
      },
      orderBy: { generatedAt: 'desc' }
    });

    return NextResponse.json({ reports });

  } catch (error) {
    console.error('Error fetching assessment reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment reports' },
      { status: 500 }
    );
  }
}

// POST /api/assessment-reports - Create assessment report
export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'ASSESSMENT_REPORT',
      action: 'CREATE',
      scope: 'OWN'
    });

    const body = await request.json();
    const {
      sessionId,
      reportType = 'COMPREHENSIVE',
      content,
      summary,
      recommendations,
      insights,
      metadata
    } = body;

    // Validate required fields
    if (!sessionId || !content) {
      return NextResponse.json(
        { error: 'Session ID and content are required' },
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

    // Create assessment report
    const report = await prisma.assessmentReport.create({
      data: {
        sessionId,
        reportType,
        content,
        summary,
        recommendations,
        insights,
        metadata,
        status: 'COMPLETED',
        completedAt: new Date()
      },
      include: {
        session: {
          select: {
            id: true,
            studentName: true,
            studentAge: true,
            startedAt: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Error creating assessment report:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment report' },
      { status: 500 }
    );
  }
}
