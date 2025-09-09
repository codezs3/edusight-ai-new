import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_BASE = process.env.DJANGO_API_BASE || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const djangoUrl = `${DJANGO_API_BASE}/assessments/api/test-categories/`;
    
    const response = await fetch(djangoUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Django API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Test categories API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch test categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
