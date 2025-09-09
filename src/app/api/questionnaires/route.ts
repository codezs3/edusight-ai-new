import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth-new';
import { getQuestionsForTest, getMixedQuestions } from '@/lib/question-banks';

// GET /api/questionnaires - Get available questionnaires
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'QUESTIONNAIRE',
      action: 'READ',
      scope: 'PUBLIC'
    });

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const ageGroup = searchParams.get('ageGroup');
    const domain = searchParams.get('domain');

    const whereClause: any = {
      isActive: true
    };

    if (category) whereClause.category = category;
    if (ageGroup) whereClause.ageGroup = ageGroup;
    if (domain) whereClause.domain = domain;

    const questionnaires = await prisma.questionnaire.findMany({
      where: whereClause,
      include: {
        questions: {
          where: { isActive: true },
          include: {
            options: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ questionnaires });

  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaires' },
      { status: 500 }
    );
  }
}

// POST /api/questionnaires - Create new questionnaire
export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth(request, {
      resource: 'QUESTIONNAIRE',
      action: 'CREATE',
      scope: 'ADMIN'
    });

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      subcategory,
      ageGroup,
      difficulty,
      domain,
      reference,
      questions
    } = body;

    // Validate required fields
    if (!name || !category || !ageGroup || !domain || !questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create questionnaire with questions and options
    const questionnaire = await prisma.questionnaire.create({
      data: {
        name,
        description,
        category,
        subcategory,
        ageGroup,
        difficulty,
        domain,
        reference,
        questions: {
          create: questions.map((question: any, index: number) => ({
            questionText: question.questionText,
            category: question.category,
            subcategory: question.subcategory,
            reference: question.reference,
            order: index + 1,
            options: {
              create: question.options.map((option: any, optIndex: number) => ({
                value: option.value,
                label: option.label,
                description: option.description,
                order: optIndex + 1
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      questionnaire
    });

  } catch (error) {
    console.error('Error creating questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to create questionnaire' },
      { status: 500 }
    );
  }
}
