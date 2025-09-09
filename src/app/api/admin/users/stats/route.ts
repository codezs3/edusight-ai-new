import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock user statistics
    const stats = {
      totalUsers: 5,
      activeUsers: 5,
      staffUsers: 2,
      newUsersThisMonth: 2,
      usersByRole: {
        ADMIN: 1,
        PARENT: 1,
        TEACHER: 1,
        STUDENT: 1,
        SCHOOL_ADMIN: 1
      },
      recentActivity: [
        {
          id: '1',
          type: 'user_login',
          user: 'Arjun Sharma',
          timestamp: '2024-01-07T08:30:00Z',
          details: 'Student logged in'
        },
        {
          id: '2',
          type: 'user_created',
          user: 'Principal Johnson',
          timestamp: '2024-01-05T00:00:00Z',
          details: 'New school admin created'
        },
        {
          id: '3',
          type: 'user_login',
          user: 'Jane Smith',
          timestamp: '2024-01-07T09:15:00Z',
          details: 'Teacher logged in'
        }
      ]
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
