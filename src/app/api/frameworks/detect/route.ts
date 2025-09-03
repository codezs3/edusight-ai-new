import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-new';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { documentId, studentId } = await request.json();

    // Get document and extracted data
    const document = await prisma.documentUpload.findUnique({
      where: { id: documentId }
    });

    if (!document || !document.extractedData) {
      return NextResponse.json({ error: 'Document or extracted data not found' }, { status: 404 });
    }

    const extractedData = JSON.parse(document.extractedData);
    
    // Detect academic framework
    const frameworkDetection = detectAcademicFramework(extractedData);

    // Store framework detection results
    await prisma.frameworkDetection.create({
      data: {
        documentId,
        studentId,
        detectedFramework: frameworkDetection.framework,
        confidence: frameworkDetection.confidence,
        indicators: JSON.stringify(frameworkDetection.indicators),
        suggestedFrameworks: JSON.stringify(frameworkDetection.suggestedFrameworks),
        status: 'completed',
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      framework: frameworkDetection.framework,
      confidence: frameworkDetection.confidence,
      indicators: frameworkDetection.indicators,
      suggestedFrameworks: frameworkDetection.suggestedFrameworks,
      multipleFrameworks: frameworkDetection.multipleFrameworks,
      requiresSelection: frameworkDetection.multipleFrameworks.length > 1,
      message: frameworkDetection.framework ? 
        `Framework detected: ${frameworkDetection.framework}` : 
        frameworkDetection.multipleFrameworks.length > 1 ?
        'Multiple frameworks detected - please select one' :
        'No specific framework detected'
    });

  } catch (error) {
    console.error('Framework detection error:', error);
    return NextResponse.json({
      error: 'Framework detection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function detectAcademicFramework(extractedData: any): any {
  const detection = {
    framework: null as string | null,
    confidence: 0,
    indicators: [] as string[],
    suggestedFrameworks: [] as string[],
    reasoning: [] as string[],
    multipleFrameworks: [] as Array<{framework: string, confidence: number, indicators: string[]}>
  };

  const fullText = extractedData.fullText || extractedData.extractedText || '';
  const lowerText = fullText.toLowerCase();

  // Enhanced framework detection patterns for better recognition
  const frameworkPatterns = {
    'IB': {
      keywords: ['international baccalaureate', 'ib', 'diploma programme', 'myp', 'pyp', 'tok', 'extended essay', 'cas'],
      gradePattern: /[1-7]\/7|ib\s*score/i,
      subjects: ['tok', 'extended essay', 'creativity action service'],
      confidence: 0.9
    },
    'IGCSE': {
      keywords: ['igcse', 'cambridge', 'international general certificate', 'cambridge international'],
      gradePattern: /[A*-U]\*?|[9-1]\/9/i,
      subjects: ['first language', 'second language', 'foreign language'],
      confidence: 0.85
    },
    'CBSE': {
      keywords: ['cbse', 'central board', 'secondary education', 'class x', 'class xii'],
      gradePattern: /\d{1,3}\/100|\d{1,2}\.\d cgpa/i,
      subjects: ['hindi', 'english', 'mathematics', 'science', 'social science'],
      confidence: 0.85
    },
    'ICSE': {
      keywords: ['icse', 'isc', 'council for indian school certificate'],
      gradePattern: /\d{1,3}\/100|[a-e]\d/i,
      subjects: ['english language', 'english literature', 'hindi', 'history civics'],
      confidence: 0.85
    },
    'A_LEVELS': {
      keywords: ['a level', 'a-level', 'advanced level', 'cambridge advanced'],
      gradePattern: /[A*-E]\*?/i,
      subjects: ['further mathematics', 'extended project'],
      confidence: 0.8
    },
    'GCSE': {
      keywords: ['gcse', 'general certificate', 'secondary education'],
      gradePattern: /[9-1]|[A*-G]\*?/i,
      subjects: ['english language', 'english literature', 'mathematics'],
      confidence: 0.8
    }
  };

  let maxScore = 0;
  let detectedFramework = null;
  const frameworkScores: Array<{framework: string, score: number, confidence: number, indicators: string[]}> = [];

  // Analyze each framework
  Object.entries(frameworkPatterns).forEach(([framework, pattern]) => {
    let score = 0;
    const foundIndicators: string[] = [];

    // Check keywords
    pattern.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 20;
        foundIndicators.push(`Keyword found: ${keyword}`);
      }
    });

    // Check grade patterns
    if (pattern.gradePattern.test(fullText)) {
      score += 25;
      foundIndicators.push('Grade pattern matches');
    }

    // Check subjects
    pattern.subjects.forEach(subject => {
      if (lowerText.includes(subject.toLowerCase())) {
        score += 10;
        foundIndicators.push(`Subject found: ${subject}`);
      }
    });

    // Check document structure
    if (framework === 'IB' && (/extended essay|tok|cas/i.test(fullText))) {
      score += 15;
      foundIndicators.push('IB-specific components found');
    }

    if (framework === 'CBSE' && (/class\s*[x|xii]/i.test(fullText))) {
      score += 15;
      foundIndicators.push('CBSE class structure found');
    }

    if (framework === 'ICSE' && (/council.*indian.*school|icse.*examination/i.test(fullText))) {
      score += 15;
      foundIndicators.push('ICSE examination board found');
    }

    if (framework === 'IGCSE' && (/cambridge.*international|international.*general.*certificate/i.test(fullText))) {
      score += 15;
      foundIndicators.push('Cambridge International indicators found');
    }

    // Apply confidence multiplier
    score *= pattern.confidence;
    const normalizedConfidence = Math.min(0.95, score / 100);

    // Store all framework scores for comparison
    if (score > 20) {
      frameworkScores.push({
        framework,
        score,
        confidence: normalizedConfidence,
        indicators: foundIndicators
      });
    }

    if (score > maxScore) {
      maxScore = score;
      detectedFramework = framework;
      detection.indicators = foundIndicators;
    }

    // Add to suggested frameworks if score is reasonable
    if (score > 30) {
      detection.suggestedFrameworks.push(framework);
    }
  });

  // Sort frameworks by score and store top candidates
  frameworkScores.sort((a, b) => b.score - a.score);
  detection.multipleFrameworks = frameworkScores.slice(0, 4).map(fs => ({
    framework: fs.framework,
    confidence: fs.confidence,
    indicators: fs.indicators
  }));

  // Set detection results
  if (maxScore > 50) {
    detection.framework = detectedFramework;
    detection.confidence = Math.min(0.95, maxScore / 100);
    detection.reasoning.push(`Strong indicators found for ${detectedFramework}`);
  } else if (maxScore > 30) {
    detection.framework = detectedFramework;
    detection.confidence = Math.min(0.7, maxScore / 100);
    detection.reasoning.push(`Moderate indicators found for ${detectedFramework}`);
  } else {
    detection.framework = 'unknown';
    detection.confidence = 0;
    detection.reasoning.push('No clear framework indicators found');
    
    // Add generic suggestions based on content
    if (extractedData.structuredData?.grades) {
      const grades = extractedData.structuredData.grades;
      const gradeFormats = grades.map((g: any) => g.grade);
      
      if (gradeFormats.some((g: string) => /[A-F][+-]?/i.test(g))) {
        detection.suggestedFrameworks.push('IGCSE', 'A_LEVELS', 'GCSE');
      }
      if (gradeFormats.some((g: string) => /\d{1,3}%/.test(g))) {
        detection.suggestedFrameworks.push('CBSE', 'ICSE');
      }
      if (gradeFormats.some((g: string) => /[1-7]/.test(g))) {
        detection.suggestedFrameworks.push('IB');
      }
    }
  }

  // Additional heuristics based on geographical indicators
  if (lowerText.includes('india') || lowerText.includes('delhi') || lowerText.includes('mumbai')) {
    if (!detection.framework || detection.confidence < 0.6) {
      detection.suggestedFrameworks.unshift('CBSE', 'ICSE');
    }
  }

  if (lowerText.includes('cambridge') || lowerText.includes('uk') || lowerText.includes('britain')) {
    if (!detection.framework || detection.confidence < 0.6) {
      detection.suggestedFrameworks.unshift('IGCSE', 'A_LEVELS', 'GCSE');
    }
  }

  // Remove duplicates from suggested frameworks
  detection.suggestedFrameworks = [...new Set(detection.suggestedFrameworks)];

  return detection;
}
