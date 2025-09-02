import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessmentTypes = await prisma.assessmentType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(assessmentTypes);
  } catch (error) {
    console.error('Error fetching assessment types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment types' },
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
    const { name, code, description, config } = body;

    // Validate required fields
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingType = await prisma.assessmentType.findUnique({
      where: { code }
    });

    if (existingType) {
      return NextResponse.json(
        { error: 'Assessment type code already exists' },
        { status: 409 }
      );
    }

    const assessmentType = await prisma.assessmentType.create({
      data: {
        name,
        code: code.toLowerCase(),
        description,
        config: config ? JSON.stringify(config) : null
      }
    });

    return NextResponse.json(assessmentType, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment type:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment type' },
      { status: 500 }
    );
  }
}
