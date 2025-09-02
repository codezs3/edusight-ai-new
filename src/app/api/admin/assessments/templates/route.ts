import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.assessmentTemplate.findMany({
      include: {
        framework: {
          select: {
            name: true,
            code: true
          }
        },
        cycle: {
          select: {
            name: true,
            code: true,
            duration: true
          }
        }
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching assessment templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment templates' },
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
    const { name, description, frameworkId, cycleId, config, isDefault = false } = body;

    // Validate required fields
    if (!name || !frameworkId || !cycleId) {
      return NextResponse.json(
        { error: 'Name, framework, and cycle are required' },
        { status: 400 }
      );
    }

    // Verify framework exists
    const framework = await prisma.assessmentFramework.findUnique({
      where: { id: frameworkId }
    });

    if (!framework) {
      return NextResponse.json(
        { error: 'Framework not found' },
        { status: 404 }
      );
    }

    // Verify cycle exists
    const cycle = await prisma.assessmentCycle.findUnique({
      where: { id: cycleId }
    });

    if (!cycle) {
      return NextResponse.json(
        { error: 'Assessment cycle not found' },
        { status: 404 }
      );
    }

    const template = await prisma.assessmentTemplate.create({
      data: {
        name,
        description,
        frameworkId,
        cycleId,
        config: config ? JSON.stringify(config) : '{}',
        isDefault,
        createdBy: session.user.id
      },
      include: {
        framework: {
          select: {
            name: true,
            code: true
          }
        },
        cycle: {
          select: {
            name: true,
            code: true,
            duration: true
          }
        }
      }
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment template:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment template' },
      { status: 500 }
    );
  }
}
