import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.assessmentTemplate.findMany({
      include: {
        framework: {
          include: {
            subjects: {
              include: {
                skills: true,
                assessmentTypes: {
                  include: {
                    assessmentType: true
                  }
                }
              }
            }
          }
        },
        cycle: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching curriculum templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
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
    const { 
      name, 
      description, 
      frameworkId, 
      cycleId, 
      subjectIds, 
      assessmentTypeIds,
      skillMappings 
    } = body;

    if (!name || !frameworkId || !cycleId || !subjectIds?.length || !assessmentTypeIds?.length) {
      return NextResponse.json(
        { error: 'Name, framework, cycle, subjects, and assessment types are required' },
        { status: 400 }
      );
    }

    // Create template configuration
    const config = {
      subjects: subjectIds,
      assessmentTypes: assessmentTypeIds,
      skillMappings: skillMappings || {},
      createdBy: session.user.id,
      version: '1.0',
      metadata: {
        totalSubjects: subjectIds.length,
        totalAssessmentTypes: assessmentTypeIds.length,
        totalSkills: Object.keys(skillMappings || {}).length
      }
    };

    const template = await prisma.assessmentTemplate.create({
      data: {
        name,
        description,
        frameworkId,
        cycleId,
        config: JSON.stringify(config),
        createdBy: session.user.id,
        isDefault: false,
        isActive: true
      },
      include: {
        framework: true,
        cycle: true
      }
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating curriculum template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
