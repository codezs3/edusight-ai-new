import { NextRequest, NextResponse } from 'next/server';
import { ParsedData, AcademicData, PsychometricData, PhysicalData } from '@/types/assessment';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Simulate OCR and data extraction
    const extractedData = await simulateDataExtraction(file, type);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}

async function simulateDataExtraction(file: File, type: string): Promise<ParsedData> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock extracted data based on file type
  const mockAcademicScores: AcademicData[] = [
    {
      subject: 'Mathematics',
      score: 85,
      maxScore: 100,
      grade: 'A',
      semester: 'Term 1',
      year: 2024,
      board: 'CBSE'
    },
    {
      subject: 'Science',
      score: 78,
      maxScore: 100,
      grade: 'B+',
      semester: 'Term 1',
      year: 2024,
      board: 'CBSE'
    },
    {
      subject: 'English',
      score: 92,
      maxScore: 100,
      grade: 'A+',
      semester: 'Term 1',
      year: 2024,
      board: 'CBSE'
    },
    {
      subject: 'Social Studies',
      score: 88,
      maxScore: 100,
      grade: 'A',
      semester: 'Term 1',
      year: 2024,
      board: 'CBSE'
    }
  ];

  const mockPsychometricScores: PsychometricData[] = [
    {
      trait: 'Openness',
      score: 7.5,
      maxScore: 10,
      category: 'BIG_FIVE'
    },
    {
      trait: 'Conscientiousness',
      score: 8.2,
      maxScore: 10,
      category: 'BIG_FIVE'
    },
    {
      trait: 'Extraversion',
      score: 6.1,
      maxScore: 10,
      category: 'BIG_FIVE'
    },
    {
      trait: 'Agreeableness',
      score: 7.8,
      maxScore: 10,
      category: 'BIG_FIVE'
    },
    {
      trait: 'Neuroticism',
      score: 3.2,
      maxScore: 10,
      category: 'BIG_FIVE'
    }
  ];

  const mockPhysicalData: PhysicalData[] = [
    {
      metric: 'BMI',
      value: 22.5,
      unit: 'kg/m²',
      category: 'HEALTH'
    },
    {
      metric: 'Running Endurance',
      value: 8.5,
      unit: 'minutes',
      category: 'ENDURANCE'
    },
    {
      metric: 'Push-ups',
      value: 25,
      unit: 'count',
      category: 'STRENGTH'
    }
  ];

  // Simulate different confidence levels based on file type
  let confidence = 0.85;
  if (file.type.startsWith('image/')) {
    confidence = 0.75; // Lower confidence for images
  } else if (file.type === 'application/pdf') {
    confidence = 0.90; // Higher confidence for PDFs
  }

  return {
    academicScores: mockAcademicScores,
    psychometricScores: mockPsychometricScores,
    physicalMetrics: mockPhysicalData,
    confidence,
    rawText: `Extracted text from ${file.name}: Sample academic and psychometric data for comprehensive analysis.`,
    errors: []
  };
}
