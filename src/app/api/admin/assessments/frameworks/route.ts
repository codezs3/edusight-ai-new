import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeSubjects = searchParams.get('include') === 'subjects';

    const frameworks = await prisma.assessmentFramework.findMany({
      include: {
        _count: {
          select: {
            subjects: true,
            templates: true
          }
        },
        ...(includeSubjects && {
          subjects: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              code: true
            },
            orderBy: { name: 'asc' }
          }
        })
      },
      orderBy: [
        { isCustom: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(frameworks);
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch frameworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description, isCustom = true } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingFramework = await prisma.assessmentFramework.findUnique({
      where: { code }
    });

    if (existingFramework) {
      return NextResponse.json(
        { error: 'Framework code already exists' },
        { status: 409 }
      );
    }

    const framework = await prisma.assessmentFramework.create({
      data: {
        name,
        code: code.toUpperCase(),
        description,
        isCustom,
        createdBy: session.user.id
      },
      include: {
        _count: {
          select: {
            subjects: true,
            templates: true
          }
        }
      }
    });

    return NextResponse.json(framework, { status: 201 });
  } catch (error) {
    console.error('Error creating framework:', error);
    return NextResponse.json(
      { error: 'Failed to create framework' },
      { status: 500 }
    );
  }
}
