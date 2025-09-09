import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mock data for curriculum templates
    const templates = [
      {
        id: '1',
        name: 'IB Primary Years Programme Template',
        description: 'Comprehensive assessment template for IB PYP students',
        framework: {
          id: 'ib-pyp',
          name: 'IB Primary Years Programme',
          code: 'IB_PYP'
        },
        cycle: {
          id: 'annual',
          name: 'Annual Assessment',
          code: 'ANNUAL'
        },
        config: JSON.stringify({
          subjects: ['Language', 'Mathematics', 'Science', 'Social Studies', 'Arts', 'PSPE'],
          assessmentTypes: ['Formative', 'Summative', 'Portfolio'],
          gradeLevels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5']
        }),
        isDefault: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'system'
      },
      {
        id: '2',
        name: 'CBSE Grade 6-8 Template',
        description: 'Standard assessment template for CBSE middle school',
        framework: {
          id: 'cbse',
          name: 'Central Board of Secondary Education',
          code: 'CBSE'
        },
        cycle: {
          id: 'semester',
          name: 'Semester Assessment',
          code: 'SEMESTER'
        },
        config: JSON.stringify({
          subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science'],
          assessmentTypes: ['Periodic Test', 'Term Exam', 'Practical'],
          gradeLevels: ['Grade 6', 'Grade 7', 'Grade 8']
        }),
        isDefault: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'system'
      },
      {
        id: '3',
        name: 'IGCSE Year 9-10 Template',
        description: 'International assessment template for IGCSE students',
        framework: {
          id: 'igcse',
          name: 'International General Certificate of Secondary Education',
          code: 'IGCSE'
        },
        cycle: {
          id: 'annual',
          name: 'Annual Assessment',
          code: 'ANNUAL'
        },
        config: JSON.stringify({
          subjects: ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Studies'],
          assessmentTypes: ['Coursework', 'Written Exam', 'Practical'],
          gradeLevels: ['Year 9', 'Year 10']
        }),
        isDefault: true,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'system'
      }
    ];

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching curriculum templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Mock creation of new template
    const newTemplate = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      createdBy: session.user.id
    };

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating curriculum template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}