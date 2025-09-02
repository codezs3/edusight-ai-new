import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get dashboard statistics
    const [totalUsers, totalStudents, totalAssessments, totalSchools] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.assessment.count(),
      prisma.school.count(),
    ]);

    // Get recent activity (mock data for now)
    const recentActivity = [
      {
        type: 'user_registered',
        description: 'New user registered',
        user: 'student@edusight.com',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      },
      {
        type: 'assessment_completed',
        description: 'Assessment completed',
        user: 'Alice Student',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        type: 'report_generated',
        description: 'Monthly report generated',
        user: 'System',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
    ];

    return NextResponse.json({
      totalUsers,
      totalStudents,
      totalAssessments,
      totalSchools,
      recentActivity,
    });
  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
