import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-new';

// GET /api/ai-insights - Get AI insights for a session
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'AI_INSIGHT',
      action: 'READ',
      scope: 'OWN'
    });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const domain = searchParams.get('domain');
    const priority = searchParams.get('priority');

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

    if (domain) whereClause.domain = domain;
    if (priority) whereClause.priority = priority;

    const insights = await prisma.aIInsight.findMany({
      where: whereClause,
      orderBy: [
        { priority: 'desc' },
        { confidence: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({ insights });

  } catch (error) {
    console.error('Error fetching AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI insights' },
      { status: 500 }
    );
  }
}

// POST /api/ai-insights - Create AI insights
export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'AI_INSIGHT',
      action: 'CREATE',
      scope: 'OWN'
    });

    const body = await request.json();
    const {
      sessionId,
      insights
    } = body;

    // Validate required fields
    if (!sessionId || !insights || !Array.isArray(insights)) {
      return NextResponse.json(
        { error: 'Session ID and insights array are required' },
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

    // Create AI insights
    const createdInsights = await Promise.all(
      insights.map(async (insight: any) => {
        return await prisma.aIInsight.create({
          data: {
            sessionId,
            domain: insight.domain,
            insight: insight.insight,
            confidence: insight.confidence,
            recommendations: insight.recommendations,
            priority: insight.priority,
            source: insight.source,
            prompt: insight.prompt,
            response: insight.response
          }
        });
      })
    );

    return NextResponse.json({
      success: true,
      insights: createdInsights
    });

  } catch (error) {
    console.error('Error creating AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to create AI insights' },
      { status: 500 }
    );
  }
}
