/**
 * EduSight Comprehensive Data Model
 * India-focused K-12 analytics platform aligned with NEP 2020
 * Supports holistic student assessment across academic, physical, and psychological domains
 */

// ==================== STUDENT PROFILE ====================
export interface StudentProfile {
  id: string;
  name: string;
  dateOfBirth: Date;
  grade: string;
  schoolId: string;
  demographics: Demographics;
  enrollmentDate: Date;
  parentIds: string[];
  teacherIds: string[];
  counselorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Demographics {
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  motherTongue: string;
  socioeconomicStatus: 'low' | 'middle' | 'high';
  location: {
    state: string;
    district: string;
    pincode: string;
    urbanRural: 'urban' | 'rural' | 'semi_urban';
  };
  specialNeeds?: string[];
  medicalConditions?: string[];
}

// ==================== ACADEMIC DATA ====================
export interface AcademicData {
  studentId: string;
  academicYear: string;
  term: string;
  subjects: SubjectPerformance[];
  attendance: AttendanceRecord;
  rubrics: RubricAssessment[];
  overallGPA: number;
  classRank?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectPerformance {
  subjectCode: string;
  subjectName: string;
  assessments: {
    formative: AssessmentScore[];
    summative: AssessmentScore[];
    normative: AssessmentScore[];
    diagnostic: AssessmentScore[];
  };
  currentGrade: string;
  currentScore: number;
  trend: 'improving' | 'stable' | 'declining';
  teacherFeedback?: string;
  parentFeedback?: string;
}

export interface AssessmentScore {
  type: 'formative' | 'summative' | 'normative' | 'diagnostic';
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: Date;
  weightage: number;
  skills: string[];
  feedback?: string;
}

export interface AttendanceRecord {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateArrivals: number;
  attendancePercentage: number;
  monthlyBreakdown: MonthlyAttendance[];
}

export interface MonthlyAttendance {
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  percentage: number;
}

export interface RubricAssessment {
  rubricName: string;
  criteria: RubricCriteria[];
  overallScore: number;
  assessorId: string;
  assessmentDate: Date;
}

export interface RubricCriteria {
  criterion: string;
  score: number;
  maxScore: number;
  feedback: string;
}

// ==================== PHYSICAL DATA ====================
export interface PhysicalData {
  studentId: string;
  assessmentDate: Date;
  anthropometrics: Anthropometrics;
  fitnessTests: FitnessTest[];
  medicalNotes: MedicalNote[];
  physicalTestDates: Date[];
  overallFitnessScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Anthropometrics {
  height: number; // cm
  weight: number; // kg
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
}

export interface FitnessTest {
  testName: string;
  testType: 'cardiovascular' | 'strength' | 'flexibility' | 'agility' | 'coordination';
  score: number;
  unit: string;
  percentile: number;
  ageGroupNorm: number;
  testDate: Date;
  notes?: string;
}

export interface MedicalNote {
  date: Date;
  type: 'injury' | 'illness' | 'medication' | 'restriction' | 'clearance';
  description: string;
  severity: 'low' | 'medium' | 'high';
  authorId: string; // parent, teacher, or medical professional
  followUpRequired: boolean;
  resolved: boolean;
}

// ==================== PSYCHOLOGICAL DATA ====================
export interface PsychologicalData {
  studentId: string;
  assessmentDate: Date;
  cognitiveAssessments: CognitiveAssessment[];
  behavioralAssessments: BehavioralAssessment[];
  emotionalAssessments: EmotionalAssessment[];
  personalityAssessments: PersonalityAssessment[];
  overallPsychologicalScore: number;
  riskFlags: RiskFlag[];
  counselorNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CognitiveAssessment {
  testName: 'WISC-V' | 'RAVEN' | 'KABC' | 'other';
  testDate: Date;
  scores: {
    fullScaleIQ?: number;
    verbalComprehension?: number;
    visualSpatial?: number;
    fluidReasoning?: number;
    workingMemory?: number;
    processingSpeed?: number;
  };
  percentiles: {
    [key: string]: number;
  };
  interpretation: string;
  administeredBy: string;
}

export interface BehavioralAssessment {
  testName: 'BASC-3' | 'SDQ' | 'CBCL' | 'other';
  testDate: Date;
  raterType: 'self' | 'parent' | 'teacher';
  raterId: string;
  scores: {
    externalizing?: number;
    internalizing?: number;
    adaptiveSkills?: number;
    behavioralSymptoms?: number;
    [key: string]: number | undefined;
  };
  tScores: {
    [key: string]: number;
  };
  clinicalSignificance: 'normal' | 'at_risk' | 'clinically_significant';
  recommendations: string[];
}

export interface EmotionalAssessment {
  testName: 'GAD-7' | 'PHQ-9' | 'SCARED' | 'other';
  testDate: Date;
  totalScore: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  specificScores: {
    [domain: string]: number;
  };
  riskLevel: 'low' | 'moderate' | 'high';
  interventionRecommended: boolean;
}

export interface PersonalityAssessment {
  testName: 'Big Five' | 'MBTI' | '16PF' | 'other';
  testDate: Date;
  traits: {
    openness?: number;
    conscientiousness?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
    [key: string]: number | undefined;
  };
  percentiles: {
    [trait: string]: number;
  };
  interpretation: string;
  strengthsIdentified: string[];
  developmentAreas: string[];
}

export interface RiskFlag {
  type: 'academic' | 'behavioral' | 'emotional' | 'social' | 'physical';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  identifiedDate: Date;
  status: 'active' | 'monitoring' | 'resolved';
  interventions: Intervention[];
  followUpDate?: Date;
}

export interface Intervention {
  type: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  responsibleParty: string;
  outcome?: string;
  effectiveness: 'poor' | 'fair' | 'good' | 'excellent';
}

// ==================== CAREER INTERESTS ====================
export interface CareerInterests {
  studentId: string;
  assessmentDate: Date;
  riasecCodes: RIASECProfile;
  aptitudeScores: AptitudeScore[];
  dmitResults?: DMITResults;
  careerRecommendations: CareerRecommendation[];
  interestInventory: InterestInventory;
  createdAt: Date;
  updatedAt: Date;
}

export interface RIASECProfile {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
  primaryCode: string;
  secondaryCode: string;
  tertiaryCode: string;
}

export interface AptitudeScore {
  domain: string;
  score: number;
  percentile: number;
  interpretation: string;
}

export interface DMITResults {
  testDate: Date;
  fingerprints: FingerprintAnalysis[];
  multipleIntelligences: MultipleIntelligences;
  learningStyle: LearningStyle;
  personalityTraits: string[];
  recommendations: string[];
  careerSuggestions: string[];
}

export interface FingerprintAnalysis {
  finger: string;
  pattern: 'loop' | 'whorl' | 'arch';
  ridgeCount: number;
  interpretation: string;
}

export interface MultipleIntelligences {
  linguistic: number;
  logicalMathematical: number;
  spatial: number;
  bodilyKinesthetic: number;
  musical: number;
  interpersonal: number;
  intrapersonal: number;
  naturalistic: number;
  existential?: number;
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  readingWriting: number;
  primaryStyle: string;
}

export interface InterestInventory {
  subjects: { [subject: string]: number };
  activities: { [activity: string]: number };
  workEnvironments: { [environment: string]: number };
  values: { [value: string]: number };
}

export interface CareerRecommendation {
  onetCode: string;
  title: string;
  matchScore: number;
  matchReasons: string[];
  educationRequired: string;
  medianSalary: number;
  jobOutlook: string;
  workActivities: string[];
  skills: string[];
  knowledgeAreas: string[];
  workStyles: string[];
  workValues: string[];
  relatedCareers: string[];
}

// ==================== PARENT INPUTS ====================
export interface ParentInputs {
  parentId: string;
  studentId: string;
  inputDate: Date;
  homeLearningLogs: HomeLearningLog[];
  behavioralNotes: BehavioralNote[];
  feedbackMessages: FeedbackMessage[];
  concerns: ParentConcern[];
  goals: ParentGoal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeLearningLog {
  date: Date;
  subject: string;
  timeSpent: number; // minutes
  activities: string[];
  difficultyLevel: 'easy' | 'moderate' | 'challenging';
  engagementLevel: number; // 1-5 scale
  helpRequired: boolean;
  notes?: string;
}

export interface BehavioralNote {
  date: Date;
  behavior: string;
  context: string;
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant';
  severity: 'mild' | 'moderate' | 'severe';
  triggers?: string[];
  interventionsTried?: string[];
  outcome?: string;
}

export interface FeedbackMessage {
  date: Date;
  recipient: 'teacher' | 'counselor' | 'admin';
  recipientId: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  responseReceived: boolean;
  responseDate?: Date;
}

export interface ParentConcern {
  date: Date;
  category: 'academic' | 'behavioral' | 'social' | 'emotional' | 'physical';
  description: string;
  severity: 'low' | 'moderate' | 'high';
  actionRequested: boolean;
  status: 'open' | 'addressing' | 'resolved';
}

export interface ParentGoal {
  date: Date;
  category: 'academic' | 'behavioral' | 'social' | 'emotional' | 'physical';
  goal: string;
  timeline: string;
  success_criteria: string[];
  progress: 'not_started' | 'in_progress' | 'achieved' | 'modified';
}

// ==================== SCHOOL ANALYTICS ====================
export interface SchoolAnalytics {
  schoolId: string;
  analysisDate: Date;
  cohortTrends: CohortTrend[];
  attendanceGroupings: AttendanceGrouping[];
  behavioralRiskFlags: BehavioralRiskFlag[];
  academicPerformance: SchoolAcademicPerformance;
  interventionEffectiveness: InterventionEffectiveness[];
  benchmarkComparisons: BenchmarkComparison[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CohortTrend {
  cohortId: string;
  grade: string;
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'improving' | 'stable' | 'declining';
  significance: 'not_significant' | 'significant' | 'highly_significant';
  factors: string[];
}

export interface AttendanceGrouping {
  groupName: string;
  criteria: string;
  studentCount: number;
  averageAttendance: number;
  riskLevel: 'low' | 'moderate' | 'high';
  interventionsRecommended: string[];
}

export interface BehavioralRiskFlag {
  riskType: string;
  studentsAffected: number;
  severity: 'low' | 'moderate' | 'high';
  trend: 'increasing' | 'stable' | 'decreasing';
  interventionsInPlace: string[];
  effectiveness: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface SchoolAcademicPerformance {
  overallGPA: number;
  subjectPerformance: { [subject: string]: number };
  gradePerformance: { [grade: string]: number };
  comparisonToPrevious: number;
  nationalPercentile: number;
  statePercentile: number;
  districtPercentile: number;
}

export interface InterventionEffectiveness {
  interventionType: string;
  studentsServed: number;
  averageImprovement: number;
  successRate: number;
  costEffectiveness: number;
  recommendedContinuation: boolean;
}

export interface BenchmarkComparison {
  metric: string;
  schoolValue: number;
  districtAverage: number;
  stateAverage: number;
  nationalAverage: number;
  schoolPercentile: number;
}

// ==================== NOTIFICATIONS ====================
export interface NotificationSystem {
  id: string;
  recipientId: string;
  recipientType: 'student' | 'parent' | 'teacher' | 'admin' | 'counselor';
  type: 'performance_alert' | 'health_risk' | 'career_update' | 'intervention_needed' | 'achievement' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  channels: NotificationChannel[];
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'acted_upon';
  createdAt: Date;
  sentAt?: Date;
  readAt?: Date;
  actedAt?: Date;
}

export interface NotificationChannel {
  type: 'dashboard' | 'email' | 'sms' | 'push' | 'whatsapp';
  address: string;
  delivered: boolean;
  deliveredAt?: Date;
  error?: string;
}

// ==================== AI CAREER MATCHING ====================
export interface AICareerMatching {
  studentId: string;
  analysisDate: Date;
  studentProfile: StudentCareerProfile;
  careerMatches: CareerMatch[];
  similarityScores: SimilarityScore[];
  concerns: CareerConcern[];
  recommendations: CareerGuidanceRecommendation[];
  nextReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCareerProfile {
  academicStrengths: string[];
  academicWeaknesses: string[];
  interests: string[];
  values: string[];
  personalityTraits: string[];
  skills: string[];
  workStyles: string[];
  preferredEnvironments: string[];
  careerReadiness: number;
}

export interface CareerMatch {
  onetCode: string;
  title: string;
  overallMatch: number;
  matchBreakdown: {
    interests: number;
    abilities: number;
    workValues: number;
    workStyles: number;
    knowledge: number;
    skills: number;
  };
  confidence: number;
  reasoning: string[];
  educationPath: EducationPath;
  salaryRange: SalaryRange;
  jobOutlook: JobOutlook;
  relatedCareers: string[];
}

export interface SimilarityScore {
  comparisonType: 'peer' | 'successful_professional' | 'career_archetype';
  comparisonId: string;
  similarityScore: number;
  commonTraits: string[];
  differentiatingFactors: string[];
  implications: string[];
}

export interface CareerConcern {
  type: 'mismatch' | 'unrealistic_expectation' | 'skill_gap' | 'market_saturation' | 'education_barrier';
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recommendations: string[];
  timelineToAddress: string;
}

export interface CareerGuidanceRecommendation {
  category: 'skill_development' | 'education' | 'experience' | 'exploration' | 'networking';
  priority: 'low' | 'medium' | 'high';
  action: string;
  timeline: string;
  resources: string[];
  successMetrics: string[];
}

export interface EducationPath {
  minimumEducation: string;
  recommendedEducation: string;
  alternativePaths: string[];
  keySubjects: string[];
  certifications: string[];
  timeline: string;
}

export interface SalaryRange {
  entry: number;
  median: number;
  experienced: number;
  currency: string;
  region: string;
  lastUpdated: Date;
}

export interface JobOutlook {
  growthRate: number;
  outlook: 'declining' | 'stable' | 'growing' | 'rapidly_growing';
  factors: string[];
  timeframe: string;
  region: string;
}

// ==================== WORKFLOW STATES ====================
export interface WorkflowState {
  entityId: string;
  entityType: 'student' | 'assessment' | 'intervention' | 'notification';
  currentStage: string;
  stages: WorkflowStage[];
  assignedTo?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'escalated';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStage {
  stageName: string;
  description: string;
  requiredActions: string[];
  completedActions: string[];
  assignedTo?: string;
  startDate?: Date;
  completedDate?: Date;
  notes?: string;
  attachments?: string[];
}

// ==================== QUALITY CHECKS ====================
export interface QualityCheck {
  dataType: string;
  checkType: 'completeness' | 'accuracy' | 'consistency' | 'validity' | 'timeliness';
  status: 'passed' | 'failed' | 'warning';
  score: number;
  issues: QualityIssue[];
  checkedAt: Date;
  checkedBy: string;
}

export interface QualityIssue {
  field: string;
  issueType: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedFix: string;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export default {
  StudentProfile,
  AcademicData,
  PhysicalData,
  PsychologicalData,
  CareerInterests,
  ParentInputs,
  SchoolAnalytics,
  NotificationSystem,
  AICareerMatching,
  WorkflowState,
  QualityCheck
};
