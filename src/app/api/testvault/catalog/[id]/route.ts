import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const testId = params.id;

    if (!testId) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      );
    }

    // Fetch from Django backend
    const djangoResponse = await fetch(`${process.env.DJANGO_BACKEND_URL || 'http://localhost:8000'}/assessments/api/test-catalog/${testId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!djangoResponse.ok) {
      // If Django backend is not available, return mock data
      const mockTest = {
        id: parseInt(testId),
        title: `Sample Test ${testId}`,
        description: `This is a comprehensive assessment test designed to evaluate various skills and competencies.`,
        assessment_type: 'academic',
        difficulty: 'intermediate',
        duration: 30,
        total_questions: 20,
        price: 99,
        rating: 4.5,
        is_active: true,
        is_published: true,
        category: {
          id: 1,
          name: 'Academic Excellence',
          color: '#3B82F6',
          icon: 'academic-cap'
        },
        ai_insights: {
          target_audience: 'Students aged 14-18',
          best_for: 'Academic assessment and skill evaluation',
          difficulty_level: 'Intermediate',
          estimated_time: '30 minutes',
          skills_measured: ['Analytical thinking', 'Problem solving', 'Critical reasoning']
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json(mockTest);
    }

    const testData = await djangoResponse.json();
    return NextResponse.json(testData);

  } catch (error) {
    console.error('Error fetching test details:', error);
    
    // Return mock data as fallback
    const mockTest = {
      id: parseInt(params.id),
      title: `Sample Test ${params.id}`,
      description: `This is a comprehensive assessment test designed to evaluate various skills and competencies.`,
      assessment_type: 'academic',
      difficulty: 'intermediate',
      duration: 30,
      total_questions: 20,
      price: 99,
      rating: 4.5,
      is_active: true,
      is_published: true,
      category: {
        id: 1,
        name: 'Academic Excellence',
        color: '#3B82F6',
        icon: 'academic-cap'
      },
      ai_insights: {
        target_audience: 'Students aged 14-18',
        best_for: 'Academic assessment and skill evaluation',
        difficulty_level: 'Intermediate',
        estimated_time: '30 minutes',
        skills_measured: ['Analytical thinking', 'Problem solving', 'Critical reasoning']
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(mockTest);
  }
}
