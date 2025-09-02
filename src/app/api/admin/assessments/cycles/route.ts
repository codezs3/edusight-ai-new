import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database/index';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessmentCycles = await prisma.assessmentCycle.findMany({
      where: { isActive: true },
      orderBy: { duration: 'asc' }
    });

    return NextResponse.json(assessmentCycles);
  } catch (error) {
    console.error('Error fetching assessment cycles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment cycles' },
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
    const { name, code, description, duration } = body;

    // Validate required fields
    if (!name || !code || !duration) {
      return NextResponse.json(
        { error: 'Name, code, and duration are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    const existingCycle = await prisma.assessmentCycle.findUnique({
      where: { code }
    });

    if (existingCycle) {
      return NextResponse.json(
        { error: 'Assessment cycle code already exists' },
        { status: 409 }
      );
    }

    const assessmentCycle = await prisma.assessmentCycle.create({
      data: {
        name,
        code: code.toLowerCase(),
        description,
        duration: parseInt(duration)
      }
    });

    return NextResponse.json(assessmentCycle, { status: 201 });
  } catch (error) {
    console.error('Error creating assessment cycle:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment cycle' },
      { status: 500 }
    );
  }
}
