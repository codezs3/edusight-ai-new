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
    const frameworkId = searchParams.get('frameworkId');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const subjectId = searchParams.get('subjectId');

    const whereClause: any = {};

    if (frameworkId) {
      whereClause.subject = {
        frameworkId: frameworkId
      };
    }

    if (category) {
      whereClause.category = category;
    }

    if (level) {
      whereClause.level = level;
    }

    if (subjectId) {
      whereClause.subjectId = subjectId;
    }

    const skills = await prisma.subjectSkill.findMany({
      where: whereClause,
      include: {
        subject: {
          include: {
            framework: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        _count: {
          select: {
            skillAssessments: true
          }
        }
      },
      orderBy: [
        { subject: { framework: { name: 'asc' } } },
        { subject: { name: 'asc' } },
        { category: 'asc' },
        { level: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
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
    const { name, code, description, category, level, subjectId } = body;

    if (!name || !category || !level || !subjectId) {
      return NextResponse.json(
        { error: 'Name, category, level, and subject are required' },
        { status: 400 }
      );
    }

    // Validate category and level
    const validCategories = ['cognitive', 'psychomotor', 'affective'];
    const validLevels = ['beginner', 'intermediate', 'advanced'];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: cognitive, psychomotor, or affective' },
        { status: 400 }
      );
    }

    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: 'Invalid level. Must be: beginner, intermediate, or advanced' },
        { status: 400 }
      );
    }

    // Check if skill with same name exists in this subject
    const existingSkill = await prisma.subjectSkill.findFirst({
      where: {
        subjectId: subjectId,
        name: name
      }
    });

    if (existingSkill) {
      return NextResponse.json(
        { error: 'Skill with this name already exists in this subject' },
        { status: 400 }
      );
    }

    const skill = await prisma.subjectSkill.create({
      data: {
        name,
        code: code?.toUpperCase(),
        description,
        category,
        level,
        subjectId
      },
      include: {
        subject: {
          include: {
            framework: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        _count: {
          select: {
            skillAssessments: true
          }
        }
      }
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
