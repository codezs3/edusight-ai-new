// Core types for Edusight 360 Score & Analysis Workflow

// Age Groups for Age-Appropriate Assessments
export type AgeGroup = 'EARLY_CHILDHOOD' | 'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'SENIOR_SECONDARY';

// Assessment Domains
export type AssessmentDomain = 'ACADEMIC' | 'PSYCHOMETRIC' | 'PHYSICAL';

// Framework Types
export type FrameworkType = 'CBSE' | 'ICSE' | 'STATE' | 'IGCSE' | 'IB' | 'CUSTOM';

// Assessment Types
export type AssessmentType = 'MARKS_BASED' | 'RUBRICS_BASED' | 'PORTFOLIO' | 'COMPETENCY_BASED' | 'BEHAVIORAL' | 'SKILL_BASED' | 'PSYCHOMETRIC_TEST' | 'PARENT_QUESTIONNAIRE' | 'PHYSICAL_ASSESSMENT';

export interface AgeGroupConfig {
  ageGroup: AgeGroup;
  minAge: number;
  maxAge: number;
  description: string;
  academicSubjects: string[];
  psychometricTraits: string[];
  physicalMetrics: string[];
  assessmentMethods: AssessmentType[];
}

export interface AcademicData {
  subject: string;
  score: number;
  maxScore: number;
  grade?: string;
  semester?: string;
  year?: number;
  board?: FrameworkType;
  assessmentType?: AssessmentType;
  ageGroup?: AgeGroup;
  framework?: string;
}

export interface PsychometricData {
  trait: string;
  score: number;
  maxScore: number;
  category: 'BIG_FIVE' | 'MBTI' | 'LEARNING_STYLE' | 'EMOTIONAL_INTELLIGENCE' | 'COGNITIVE_ABILITY' | 'SOCIAL_SKILLS' | 'BEHAVIORAL_TRAITS';
  ageGroup?: AgeGroup;
  assessmentMethod?: AssessmentType;
  framework?: string;
}

export interface PhysicalData {
  metric: string;
  value: number;
  unit: string;
  category: 'FITNESS' | 'HEALTH' | 'ENDURANCE' | 'STRENGTH' | 'FLEXIBILITY' | 'COORDINATION' | 'BALANCE' | 'MOTOR_SKILLS';
  ageGroup?: AgeGroup;
  assessmentMethod?: AssessmentType;
  framework?: string;
}

export interface SkillData {
  skill: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  category: 'TECHNICAL' | 'SOFT' | 'CREATIVE' | 'LEADERSHIP';
  evidence?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  school: string;
  board: string;
  academicData: AcademicData[];
  psychometricData: PsychometricData[];
  physicalData: PhysicalData[];
  skills: SkillData[];
  extracurriculars: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisResult {
  overallScore: number;
  academicScore: number;
  psychometricScore: number;
  physicalScore: number;
  skillScore: number;
  
  // Comparative Analysis
  schoolAverage: number;
  districtAverage: number;
  stateAverage: number;
  nationalAverage: number;
  
  // Performance Bands
  performanceBand: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
  percentile: number;
  
  // Predictions
  academicTrajectory: PredictionData[];
  skillDevelopment: PredictionData[];
  psychometricEvolution: PredictionData[];
  
  // Personality Profile
  personalityType: string;
  mbtiType?: string;
  bigFiveProfile: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  
  // Career Recommendations
  careerRecommendations: CareerRecommendation[];
  
  // Insights
  strengths: string[];
  areasForImprovement: string[];
  learningStyle: string;
  studyRecommendations: string[];
}

export interface PredictionData {
  period: string;
  predictedScore: number;
  confidence: number;
  factors: string[];
}

export interface CareerRecommendation {
  career: string;
  matchScore: number;
  requiredSkills: string[];
  skillGaps: string[];
  educationPath: string[];
  certifications: string[];
  industryOutlook: 'GROWING' | 'STABLE' | 'DECLINING';
  salaryRange: string;
  description: string;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR';
  data?: any;
  error?: string;
  domain?: AssessmentDomain;
  ageGroup?: AgeGroup;
  subStages?: WorkflowStage[];
}

export interface AssessmentFramework {
  id: string;
  name: string;
  type: FrameworkType;
  domain: AssessmentDomain;
  ageGroups: AgeGroup[];
  subjects?: string[];
  traits?: string[];
  metrics?: string[];
  assessmentTypes: AssessmentType[];
  description: string;
  isActive: boolean;
}

export interface UnifiedWorkflowConfig {
  studentAge: number;
  selectedFrameworks: {
    academic?: AssessmentFramework;
    psychometric?: AssessmentFramework;
    physical?: AssessmentFramework;
  };
  assessmentTypes: {
    academic: AssessmentType[];
    psychometric: AssessmentType[];
    physical: AssessmentType[];
  };
  customizations: {
    includeCareerMapping: boolean;
    includePredictions: boolean;
    includeComparativeAnalysis: boolean;
    reportType: 'BASIC' | 'COMPREHENSIVE' | 'ENTERPRISE';
  };
}

export interface WorkflowState {
  currentStage: number;
  stages: WorkflowStage[];
  studentProfile?: StudentProfile;
  analysisResult?: AnalysisResult;
  isComplete: boolean;
  error?: string;
}

// File upload types
export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  extractedData?: any;
  status: 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
}

// OCR and parsing results
export interface ParsedData {
  academicScores: AcademicData[];
  psychometricScores: PsychometricData[];
  physicalMetrics: PhysicalData[];
  confidence: number;
  rawText: string;
  errors: string[];
}

// Enhanced Data Collection Interfaces
export interface PsychometricTestResult {
  testType: 'BIG_FIVE' | 'MBTI' | 'LEARNING_STYLE' | 'ATTENTION_SPAN' | 'SOCIAL_SKILLS' | 'EMOTIONAL_REGULATION';
  score: number;
  maxScore: number;
  interpretation: string;
  traits: Record<string, number>;
  recommendations: string[];
}

export interface ParentQuestionnaireResponse {
  questionId: string;
  question: string;
  response: string | number;
  category: 'BEHAVIORAL' | 'SOCIAL' | 'EMOTIONAL' | 'COGNITIVE' | 'LEARNING';
  weight: number;
}

export interface PhysicalAssessmentData {
  category: 'FITNESS' | 'MOTOR_SKILLS' | 'HEALTH' | 'COORDINATION';
  questions: {
    questionId: string;
    question: string;
    response: string | number;
    unit?: string;
  }[];
  calculatedMetrics: PhysicalData[];
}

export interface DataCollectionStatus {
  academic: {
    hasData: boolean;
    dataSource: 'DOCUMENTS' | 'MANUAL_ENTRY' | 'NONE';
    completeness: number; // 0-100
  };
  psychometric: {
    hasData: boolean;
    dataSource: 'TEST' | 'QUESTIONNAIRE' | 'NONE';
    completeness: number; // 0-100
    testResults?: PsychometricTestResult[];
    questionnaireResponses?: ParentQuestionnaireResponse[];
  };
  physical: {
    hasData: boolean;
    dataSource: 'ASSESSMENT' | 'QUESTIONNAIRE' | 'NONE';
    completeness: number; // 0-100
    assessmentData?: PhysicalAssessmentData[];
  };
}
