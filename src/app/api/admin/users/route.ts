import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for users
    const users = [
      {
        id: '1',
        email: 'admin@edusight.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
        isStaff: true,
        lastLogin: '2024-01-07T10:30:00Z',
        createdAt: '2024-01-01T00:00:00Z',
        school: {
          id: '1',
          name: 'EduSight Platform'
        }
      },
      {
        id: '2',
        email: 'parent@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'PARENT',
        isActive: true,
        isStaff: false,
        lastLogin: '2024-01-06T15:45:00Z',
        createdAt: '2024-01-02T00:00:00Z',
        parentProfile: {
          children: 2
        }
      },
      {
        id: '3',
        email: 'teacher@school.edu',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'TEACHER',
        isActive: true,
        isStaff: false,
        lastLogin: '2024-01-07T09:15:00Z',
        createdAt: '2024-01-03T00:00:00Z',
        school: {
          id: '2',
          name: 'Greenwood International School'
        },
        teacherProfile: {
          subjects: ['Mathematics', 'Physics']
        }
      },
      {
        id: '4',
        email: 'student@school.edu',
        firstName: 'Arjun',
        lastName: 'Sharma',
        role: 'STUDENT',
        isActive: true,
        isStaff: false,
        lastLogin: '2024-01-07T08:30:00Z',
        createdAt: '2024-01-04T00:00:00Z',
        school: {
          id: '2',
          name: 'Greenwood International School'
        },
        studentProfile: {
          grade: '10',
          section: 'A'
        }
      },
      {
        id: '5',
        email: 'schooladmin@school.edu',
        firstName: 'Principal',
        lastName: 'Johnson',
        role: 'SCHOOL_ADMIN',
        isActive: true,
        isStaff: true,
        lastLogin: '2024-01-07T07:00:00Z',
        createdAt: '2024-01-05T00:00:00Z',
        school: {
          id: '2',
          name: 'Greenwood International School'
        }
      }
    ];

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
