# EduSight Stepwise Workflow - Technical Implementation Guide

## Implementation Summary

This document provides a comprehensive technical overview of the EduSight Stepwise Workflow system implementation for developers and system administrators.

## Development Environment Setup

### Prerequisites
- Node.js 18+ with npm
- Next.js 15.5.2
- Prisma ORM with SQLite (development) / PostgreSQL (production)
- TypeScript 5.9.2
- Python virtual environment (for ML components)

### Key Dependencies Added
```json
{
  "@tensorflow/tfjs": "^4.15.0",
  "tesseract.js": "^5.0.4",
  "pdfjs-dist": "^5.4.149",
  "framer-motion": "^12.23.12",
  "react-hot-toast": "^2.6.0"
}
```

## File Structure

```
src/
├── components/dashboard/parent/
│   └── UploadWorkflow.tsx           # Main workflow UI component
├── app/api/
│   ├── documents/[id]/
│   │   ├── process/route.ts         # Document processing endpoint
│   │   └── validate/route.ts        # Data validation endpoint
│   ├── ml/
│   │   ├── academic-analysis/route.ts    # Academic ML analysis
│   │   ├── behavioral-analysis/route.ts  # Behavioral ML analysis
│   │   └── career-prediction/route.ts    # Career prediction ML
│   ├── frameworks/
│   │   ├── detect/route.ts          # Framework detection
│   │   └── normalize/route.ts       # Data normalization
│   └── students/[id]/
│       ├── repository/route.ts      # Repository storage
│       ├── scores/aggregate/route.ts # Score aggregation
│       ├── edusight-score/route.ts  # EduSight 360° calculation
│       └── visualizations/route.ts  # Chart/graph generation
└── app/dashboard/parent/upload/page.tsx # Updated upload page
```

## Database Schema Changes

### New Tables Added
1. `academic_analyses` - Academic ML analysis results
2. `behavioral_analyses` - Behavioral assessment data
3. `career_analyses` - Career prediction results
4. `framework_detections` - Academic framework identification
5. `data_normalizations` - Normalized academic data
6. `student_repositories` - Permanent student data storage
7. `edusight_scores` - 360° assessment scores
8. `score_aggregations` - Historical score analysis

### Migration Commands
```bash
# Generate new migration
npx prisma migrate dev --name add_workflow_tables

# Push schema changes (development)
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## API Endpoint Implementation Details

### 1. Document Processing (`/api/documents/[id]/process`)

**Input**: 
```typescript
{
  studentId: string;
  step: 'parse';
}
```

**Processing Logic**:
- PDF: Uses `pdfjs-dist` for text extraction
- Images: Uses `tesseract.js` for OCR
- Documents: Buffer reading for text files
- Spreadsheets: Placeholder for xlsx processing

**Output**:
```typescript
{
  success: boolean;
  extractedData: {
    type: string;
    pages?: Array<{pageNumber: number, text: string}>;
    fullText: string;
    structuredData: {
      subjects: string[];
      grades: Array<{subject: string, grade: string, raw: string}>;
      attendance: string;
      teacherComments: string[];
      overallGrade: string;
    }
  };
}
```

### 2. ML Analysis Endpoints

#### Academic Analysis (`/api/ml/academic-analysis`)
**Features**:
- Grade normalization across frameworks
- Performance trend calculation
- Subject strength identification
- Academic risk assessment

**ML Integration**:
```typescript
import { mlService } from '@/lib/tensorflow';
const academicAnalysis = await mlService.academicPredictor.predict(academicData);
```

#### Behavioral Analysis (`/api/ml/behavioral-analysis`)
**Features**:
- Teacher comment sentiment analysis
- Risk level assessment (low/medium/high/critical)
- Behavioral indicator extraction
- Intervention recommendations

#### Career Prediction (`/api/ml/career-prediction`)
**Features**:
- Subject strength to career mapping
- Skills profile generation
- Interest inference from performance
- Career compatibility scoring

### 3. Framework Detection (`/api/frameworks/detect`)

**Detection Algorithm**:
```typescript
const frameworkPatterns = {
  'IB': {
    keywords: ['international baccalaureate', 'ib', 'diploma programme'],
    gradePattern: /[1-7]\/7|ib\s*score/i,
    confidence: 0.9
  },
  'CBSE': {
    keywords: ['cbse', 'central board', 'class x', 'class xii'],
    gradePattern: /\d{1,3}\/100|\d{1,2}\.\d cgpa/i,
    confidence: 0.85
  }
  // ... more frameworks
};
```

**Confidence Scoring**:
- Keyword matches: +20 points each
- Grade pattern match: +25 points
- Subject structure match: +10 points each
- Document metadata: +15 points

### 4. Data Normalization (`/api/frameworks/normalize`)

**Grade Conversion Logic**:
```typescript
function normalizeIBGrade(grade: string): number {
  const ibMatch = grade.match(/([1-7])/);
  if (ibMatch) {
    const ibScore = parseInt(ibMatch[1]);
    const conversion = [0, 45, 55, 65, 75, 85, 95, 100];
    return conversion[ibScore] || 0;
  }
  return normalizeGenericGrade(grade);
}
```

**Subject Name Standardization**:
```typescript
const subjectMappings = {
  'math': 'Mathematics',
  'eng': 'English',
  'sci': 'Science (General)',
  // ... comprehensive mapping
};
```

### 5. EduSight 360° Score Calculation (`/api/students/[id]/edusight-score`)

**Scoring Formula**:
```typescript
const weights = {
  academic: 0.40,      // 40% weight
  psychological: 0.35, // 35% weight
  physical: 0.25       // 25% weight
};

const overallScore = 
  (academicScore * weights.academic) +
  (psychologicalScore * weights.psychological) +
  (physicalScore * weights.physical);
```

**Academic Score Breakdown**:
```typescript
const academicWeights = {
  gradePerformance: 0.4,    // 40% of academic score
  consistency: 0.2,         // 20% of academic score
  improvement: 0.2,         // 20% of academic score
  attendance: 0.15,         // 15% of academic score
  frameworkAlignment: 0.05  // 5% of academic score
};
```

## React Component Implementation

### UploadWorkflow Component

**State Management**:
```typescript
const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
const [currentStep, setCurrentStep] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [showFrameworkAlert, setShowFrameworkAlert] = useState(false);
```

**Step Processing Logic**:
```typescript
const processStep = async (stepIndex: number) => {
  const step = steps[stepIndex];
  updateStepStatus(step.id, 'in_progress', 0);
  
  try {
    switch (step.id) {
      case 'data_acquisition':
        await processDataAcquisition(step);
        break;
      case 'ml_analysis':
        await processMLAnalysis(step);
        break;
      // ... other steps
    }
    
    updateStepStatus(step.id, 'completed', 100);
    // Move to next step
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
      setTimeout(() => processStep(stepIndex + 1), 500);
    }
  } catch (error) {
    updateStepStatus(step.id, 'error', undefined, error.message);
  }
};
```

**Animation Integration**:
```typescript
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: index * 0.1 }}
  className={`step-container ${getStatusClass(step.status)}`}
>
  {/* Step content */}
</motion.div>
```

## Error Handling Strategies

### API Error Handling
```typescript
try {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Operation failed');
  }
  
  return await response.json();
} catch (error) {
  console.error('API Error:', error);
  updateStepStatus(stepId, 'error', undefined, error.message);
  throw error;
}
```

### Graceful Degradation
```typescript
// Framework detection fallback
if (!detectedFramework || detectedFramework === 'unknown') {
  setShowFrameworkAlert(true);
  setMissingFrameworks(['Generic framework will be used']);
  // Continue processing with generic normalization
}

// ML analysis fallback
try {
  const mlResults = await runMLAnalysis(data);
} catch (mlError) {
  console.warn('ML analysis failed, using rule-based fallback');
  const ruleBasedResults = runRuleBasedAnalysis(data);
  // Reduce confidence score for fallback results
}
```

## Performance Optimizations

### Database Query Optimization
```typescript
// Batch queries with includes
const student = await prisma.student.findUnique({
  where: { id: studentId },
  include: {
    repositories: {
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    },
    eduSightScores: {
      orderBy: { createdAt: 'desc' },
      take: 5
    }
    // ... other related data
  }
});
```

### Parallel Processing
```typescript
// Run ML analyses in parallel
const [academicAnalysis, behavioralAnalysis, careerAnalysis] = await Promise.all([
  processAcademicAnalysis(data),
  processBehavioralAnalysis(data),
  processCareerAnalysis(data)
]);
```

### Client-Side Optimization
```typescript
// Debounced updates to prevent excessive re-renders
const debouncedUpdateProgress = useCallback(
  debounce((stepId: string, progress: number) => {
    updateStepStatus(stepId, 'in_progress', progress);
  }, 100),
  []
);
```

## Testing Strategies

### Unit Tests
```typescript
// Example test for grade normalization
describe('Grade Normalization', () => {
  test('should convert IB grades correctly', () => {
    expect(normalizeIBGrade('7')).toBe(100);
    expect(normalizeIBGrade('4')).toBe(75);
    expect(normalizeIBGrade('1')).toBe(45);
  });
  
  test('should handle CBSE percentages', () => {
    expect(normalizeCBSEGrade('95%')).toBe(95);
    expect(normalizeCBSEGrade('8.5 CGPA')).toBe(80.75);
  });
});
```

### Integration Tests
```typescript
// Example API endpoint test
describe('/api/documents/[id]/process', () => {
  test('should process PDF documents correctly', async () => {
    const mockFile = createMockPDFFile();
    const response = await POST(mockRequest, { params: { id: 'test-doc' } });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.extractedData.structuredData).toBeDefined();
  });
});
```

### End-to-End Tests
```typescript
// Example workflow test
describe('Complete Workflow', () => {
  test('should complete all steps successfully', async () => {
    // Upload document
    const uploadResponse = await uploadTestDocument();
    
    // Start workflow
    const workflowResponse = await startWorkflow(uploadResponse.documentId);
    
    // Wait for completion
    await waitForWorkflowCompletion(workflowResponse.workflowId);
    
    // Verify results
    const finalResults = await getWorkflowResults(workflowResponse.workflowId);
    expect(finalResults.status).toBe('completed');
    expect(finalResults.eduSightScore).toBeDefined();
  });
});
```

## Deployment Considerations

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/edusight"

# ML Models
ML_MODEL_BASE_URL="https://models.edusight.com"
TENSORFLOW_BACKEND="webgl"

# File Processing
MAX_FILE_SIZE=50MB
OCR_LANGUAGE="eng"
PDF_WORKER_PATH="/pdf.worker.min.js"

# Security
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### Production Optimizations
```typescript
// Enable compression for large JSON responses
export async function POST(request: NextRequest) {
  const response = await processRequest(request);
  
  // Add compression headers for large responses
  if (response.body && response.body.length > 1024) {
    response.headers.set('Content-Encoding', 'gzip');
  }
  
  return response;
}
```

### Monitoring Setup
```typescript
// Add performance monitoring
const startTime = Date.now();

try {
  await processWorkflowStep();
} finally {
  const duration = Date.now() - startTime;
  console.log(`Step completed in ${duration}ms`);
  
  // Send metrics to monitoring service
  if (duration > 5000) {
    console.warn(`Slow step detected: ${duration}ms`);
  }
}
```

## Security Implementation

### Input Validation
```typescript
const documentProcessSchema = z.object({
  studentId: z.string().cuid(),
  step: z.literal('parse')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = documentProcessSchema.parse(body);
    // ... process with validated data
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid input data' },
      { status: 400 }
    );
  }
}
```

### Access Control
```typescript
// Verify user can access student data
const hasAccess = await verifyStudentAccess(session.user.id, studentId);
if (!hasAccess) {
  return NextResponse.json(
    { error: 'Access denied' },
    { status: 403 }
  );
}
```

### File Security
```typescript
// Validate file types and sizes
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword'
];

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('File type not allowed');
}

if (file.size > MAX_FILE_SIZE) {
  throw new Error('File size exceeds limit');
}
```

## Maintenance and Updates

### Database Maintenance
```sql
-- Clean up old temporary data
DELETE FROM academic_analyses 
WHERE status = 'failed' 
AND created_at < NOW() - INTERVAL '30 days';

-- Archive old repository data
UPDATE student_repositories 
SET is_active = false 
WHERE created_at < NOW() - INTERVAL '2 years';
```

### Performance Monitoring
```typescript
// Log slow queries
if (queryTime > 1000) {
  console.warn(`Slow query detected: ${query} took ${queryTime}ms`);
}

// Monitor memory usage
const memUsage = process.memoryUsage();
if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
  console.warn('High memory usage detected');
}
```

### Update Procedures
1. **Database Migrations**: Always test on staging environment first
2. **ML Model Updates**: Version control for model files, gradual rollout
3. **API Changes**: Maintain backward compatibility for at least one version
4. **UI Updates**: Progressive enhancement, feature flags for new functionality

## Troubleshooting Guide

### Common Issues

1. **PDF Processing Failures**:
   - Check PDF version compatibility
   - Verify PDF.js worker path
   - Test with simplified PDF files

2. **OCR Accuracy Issues**:
   - Improve image quality
   - Adjust Tesseract.js configuration
   - Consider manual review for critical documents

3. **Framework Detection Errors**:
   - Add more keyword patterns
   - Improve confidence scoring algorithm
   - Provide manual override options

4. **ML Analysis Timeouts**:
   - Optimize data preprocessing
   - Implement progressive analysis
   - Add fallback to rule-based methods

### Debug Mode
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('Processing step:', stepName);
  console.log('Input data:', JSON.stringify(inputData, null, 2));
  console.log('Analysis results:', analysisResults);
}
```

This technical implementation guide provides developers with the detailed information needed to understand, maintain, and extend the EduSight Stepwise Workflow system.

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Target Audience**: Developers, System Administrators  
**Complexity Level**: Advanced
