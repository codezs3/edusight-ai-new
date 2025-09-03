import { NextRequest, NextResponse } from 'next/server';

// Mock processing for guest documents
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { guestSessionId, step } = await request.json();
    const resolvedParams = await params;
    const documentId = resolvedParams.id;

    if (!guestSessionId) {
      return NextResponse.json({ error: 'Guest session ID required' }, { status: 400 });
    }

    if (step !== 'parse') {
      return NextResponse.json({ error: 'Invalid step' }, { status: 400 });
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful processing response
    const mockProcessingResult = {
      success: true,
      documentId,
      step,
      extractedData: {
        type: 'guest_processed',
        confidence: 0.92,
        structuredData: {
          dataQuality: 'high',
          extractionMethod: 'guest_mock_processing',
          validationPassed: true
        }
      },
      processing: {
        startTime: new Date().toISOString(),
        duration: '1.2s',
        status: 'completed'
      }
    };

    return NextResponse.json(mockProcessingResult);

  } catch (error) {
    console.error('Guest document processing error:', error);
    return NextResponse.json({
      error: 'Processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
