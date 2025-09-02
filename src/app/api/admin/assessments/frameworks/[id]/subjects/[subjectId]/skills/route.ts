import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; subjectId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const skills = await prisma.subjectSkill.findMany({
      where: {
        subjectId: params.subjectId
      },
      include: {
        _count: {
          select: {
            skillAssessments: true
          }
        }
      },
      orderBy: [
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; subjectId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description, category, level } = body;

    if (!name || !category || !level) {
      return NextResponse.json(
        { error: 'Name, category, and level are required' },
        { status: 400 }
      );
    }

    // Check if skill with same name exists in this subject
    const existingSkill = await prisma.subjectSkill.findFirst({
      where: {
        subjectId: params.subjectId,
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
        subjectId: params.subjectId,
        name,
        code: code?.toUpperCase(),
        description,
        category,
        level
      },
      include: {
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
