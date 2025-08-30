/**
 * EduSight AI Prediction Engine
 * Core algorithms for educational assessment and student performance prediction
 */

export interface StudentData {
  id: string;
  age: number;
  grade: number;
  previousScores: number[];
  attendanceRate: number;
  studyHours: number;
  parentalSupport: number; // 1-5 scale
  socioeconomicStatus: number; // 1-5 scale
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  subjects: SubjectPerformance[];
  behavioralMetrics: BehavioralMetrics;
  cognitiveMetrics: CognitiveMetrics;
}

export interface SubjectPerformance {
  subject: string;
  currentScore: number;
  trend: number; // -1 to 1 (declining to improving)
  difficulty: number; // 1-5 scale
  engagement: number; // 1-5 scale
  timeSpent: number; // hours per week
}

export interface BehavioralMetrics {
  attention: number; // 1-5 scale
  motivation: number; // 1-5 scale
  collaboration: number; // 1-5 scale
  selfRegulation: number; // 1-5 scale
  resilience: number; // 1-5 scale
}

export interface CognitiveMetrics {
  processingSpeed: number; // 1-5 scale
  workingMemory: number; // 1-5 scale
  logicalReasoning: number; // 1-5 scale
  spatialAbility: number; // 1-5 scale
  verbalAbility: number; // 1-5 scale
}

export interface PredictionResult {
  predictedScore: number;
  confidence: number;
  factors: InfluencingFactor[];
  recommendations: Recommendation[];
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
}

export interface InfluencingFactor {
  factor: string;
  impact: number; // -1 to 1
  importance: number; // 0 to 1
  description: string;
}

export interface Recommendation {
  type: 'intervention' | 'enhancement' | 'maintenance';
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: number;
  timeframe: string;
  resources: string[];
}

export class PredictionEngine {
  private static instance: PredictionEngine;
  private models: Map<string, any> = new Map();

  private constructor() {
    this.initializeModels();
  }

  public static getInstance(): PredictionEngine {
    if (!PredictionEngine.instance) {
      PredictionEngine.instance = new PredictionEngine();
    }
    return PredictionEngine.instance;
  }

  private initializeModels(): void {
    // Initialize various prediction models
    this.models.set('performance', new PerformancePredictionModel());
    this.models.set('risk', new RiskAssessmentModel());
    this.models.set('learning_path', new LearningPathModel());
    this.models.set('career', new CareerGuidanceModel());
  }

  /**
   * Predict student performance using ensemble methods
   */
  public async predictPerformance(
    studentData: StudentData,
    subject: string,
    timeframe: string = '1_month'
  ): Promise<PredictionResult> {
    const performanceModel = this.models.get('performance');
    const riskModel = this.models.get('risk');

    // Feature engineering
    const features = this.extractFeatures(studentData, subject);
    
    // Multiple model predictions
    const performancePrediction = performanceModel.predict(features);
    const riskAssessment = riskModel.assess(features);
    
    // Ensemble prediction
    const ensemblePrediction = this.ensemblePredict([
      performancePrediction,
      this.baselinePredict(features),
      this.trendPredict(features)
    ]);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      studentData,
      ensemblePrediction,
      riskAssessment
    );

    return {
      predictedScore: ensemblePrediction.score,
      confidence: ensemblePrediction.confidence,
      factors: this.identifyInfluencingFactors(features, ensemblePrediction),
      recommendations,
      riskLevel: riskAssessment.level,
      timeframe
    };
  }

  /**
   * Analyze learning patterns and suggest optimal learning paths
   */
  public analyzeLearningPatterns(studentData: StudentData): {
    learningStyle: string;
    strengths: string[];
    weaknesses: string[];
    optimalSchedule: any;
    recommendedResources: string[];
  } {
    const learningPathModel = this.models.get('learning_path');
    
    // Analyze cognitive patterns
    const cognitiveProfile = this.analyzeCognitiveProfile(studentData.cognitiveMetrics);
    
    // Analyze behavioral patterns
    const behavioralProfile = this.analyzeBehavioralProfile(studentData.behavioralMetrics);
    
    // Determine optimal learning style
    const optimalLearningStyle = this.determineOptimalLearningStyle(
      cognitiveProfile,
      behavioralProfile,
      studentData.subjects
    );

    return {
      learningStyle: optimalLearningStyle,
      strengths: this.identifyStrengths(studentData),
      weaknesses: this.identifyWeaknesses(studentData),
      optimalSchedule: this.generateOptimalSchedule(studentData),
      recommendedResources: this.recommendResources(studentData, optimalLearningStyle)
    };
  }

  /**
   * Career guidance based on student performance and interests
   */
  public async generateCareerGuidance(studentData: StudentData): Promise<{
    suggestedCareers: CareerSuggestion[];
    requiredSkills: string[];
    developmentPlan: DevelopmentPlan;
    educationalPath: string[];
  }> {
    const careerModel = this.models.get('career');
    
    // Analyze aptitude patterns
    const aptitudeProfile = this.analyzeAptitude(studentData);
    
    // Match with career database
    const careerMatches = await careerModel.matchCareers(aptitudeProfile);
    
    return {
      suggestedCareers: careerMatches,
      requiredSkills: this.identifyRequiredSkills(careerMatches),
      developmentPlan: this.createDevelopmentPlan(studentData, careerMatches),
      educationalPath: this.suggestEducationalPath(careerMatches)
    };
  }

  private extractFeatures(studentData: StudentData, subject: string): number[] {
    const subjectData = studentData.subjects.find(s => s.subject === subject);
    
    return [
      // Academic features
      studentData.age / 18, // Normalized age
      studentData.grade / 12, // Normalized grade
      this.calculateAverageScore(studentData.previousScores),
      subjectData?.currentScore || 0,
      subjectData?.trend || 0,
      
      // Behavioral features
      studentData.attendanceRate,
      studentData.studyHours / 40, // Normalized study hours
      studentData.parentalSupport / 5,
      studentData.socioeconomicStatus / 5,
      
      // Cognitive features
      studentData.cognitiveMetrics.processingSpeed / 5,
      studentData.cognitiveMetrics.workingMemory / 5,
      studentData.cognitiveMetrics.logicalReasoning / 5,
      studentData.cognitiveMetrics.spatialAbility / 5,
      studentData.cognitiveMetrics.verbalAbility / 5,
      
      // Behavioral metrics
      studentData.behavioralMetrics.attention / 5,
      studentData.behavioralMetrics.motivation / 5,
      studentData.behavioralMetrics.collaboration / 5,
      studentData.behavioralMetrics.selfRegulation / 5,
      studentData.behavioralMetrics.resilience / 5,
      
      // Subject-specific features
      subjectData?.difficulty || 3,
      subjectData?.engagement || 3,
      subjectData?.timeSpent || 0,
    ];
  }

  private ensemblePredict(predictions: any[]): { score: number; confidence: number } {
    // Weighted ensemble of predictions
    const weights = [0.4, 0.3, 0.3]; // Adjust based on model performance
    
    let weightedSum = 0;
    let totalWeight = 0;
    let confidenceSum = 0;
    
    predictions.forEach((pred, index) => {
      const weight = weights[index] || 1 / predictions.length;
      weightedSum += pred.score * weight;
      totalWeight += weight;
      confidenceSum += pred.confidence * weight;
    });
    
    return {
      score: weightedSum / totalWeight,
      confidence: confidenceSum / totalWeight
    };
  }

  private baselinePredict(features: number[]): { score: number; confidence: number } {
    // Simple baseline prediction based on historical average
    const historicalAverage = features[2]; // Previous scores average
    const trend = features[4]; // Current trend
    
    return {
      score: Math.max(0, Math.min(100, historicalAverage + (trend * 10))),
      confidence: 0.6
    };
  }

  private trendPredict(features: number[]): { score: number; confidence: number } {
    // Trend-based prediction
    const currentScore = features[3];
    const trend = features[4];
    const studyHours = features[6];
    const motivation = features[15];
    
    const trendMultiplier = 1 + (trend * 0.1);
    const effortMultiplier = 1 + ((studyHours + motivation) * 0.05);
    
    return {
      score: Math.max(0, Math.min(100, currentScore * trendMultiplier * effortMultiplier)),
      confidence: 0.7
    };
  }

  private identifyInfluencingFactors(features: number[], prediction: any): InfluencingFactor[] {
    const factorNames = [
      'Age', 'Grade Level', 'Historical Performance', 'Current Score', 'Performance Trend',
      'Attendance Rate', 'Study Hours', 'Parental Support', 'Socioeconomic Status',
      'Processing Speed', 'Working Memory', 'Logical Reasoning', 'Spatial Ability', 'Verbal Ability',
      'Attention', 'Motivation', 'Collaboration', 'Self-Regulation', 'Resilience',
      'Subject Difficulty', 'Engagement Level', 'Time Investment'
    ];

    return features.map((value, index) => ({
      factor: factorNames[index] || `Feature ${index}`,
      impact: this.calculateImpact(value, index),
      importance: this.calculateImportance(value, index),
      description: this.getFactorDescription(factorNames[index], value)
    })).sort((a, b) => b.importance - a.importance).slice(0, 8);
  }

  private calculateImpact(value: number, index: number): number {
    // Simplified impact calculation - in production, use feature importance from trained models
    const impactWeights = [
      0.1, 0.2, 0.8, 0.9, 0.7, // Academic factors
      0.6, 0.7, 0.4, 0.3, // Environmental factors
      0.5, 0.6, 0.7, 0.4, 0.5, // Cognitive factors
      0.8, 0.9, 0.3, 0.6, 0.5, // Behavioral factors
      0.4, 0.8, 0.6 // Subject-specific factors
    ];
    
    const weight = impactWeights[index] || 0.5;
    return (value - 0.5) * weight * 2; // Normalize to -1 to 1
  }

  private calculateImportance(value: number, index: number): number {
    // Feature importance based on variance and correlation with outcomes
    const importanceWeights = [
      0.3, 0.4, 0.9, 0.95, 0.8, // Academic factors
      0.7, 0.8, 0.5, 0.4, // Environmental factors
      0.6, 0.7, 0.8, 0.5, 0.6, // Cognitive factors
      0.85, 0.9, 0.4, 0.7, 0.6, // Behavioral factors
      0.5, 0.85, 0.7 // Subject-specific factors
    ];
    
    return importanceWeights[index] || 0.5;
  }

  private getFactorDescription(factor: string, value: number): string {
    const descriptions: { [key: string]: (val: number) => string } = {
      'Motivation': (val) => val > 0.7 ? 'High motivation level supports learning' : 
                             val > 0.4 ? 'Moderate motivation, room for improvement' : 
                             'Low motivation may hinder progress',
      'Study Hours': (val) => val > 0.7 ? 'Excellent study commitment' : 
                              val > 0.4 ? 'Adequate study time' : 
                              'Insufficient study time',
      'Attendance Rate': (val) => val > 0.9 ? 'Excellent attendance' : 
                                  val > 0.8 ? 'Good attendance' : 
                                  'Poor attendance affecting learning',
      // Add more descriptions as needed
    };

    return descriptions[factor]?.(value) || `${factor}: ${(value * 100).toFixed(0)}%`;
  }

  private async generateRecommendations(
    studentData: StudentData,
    prediction: any,
    riskAssessment: any
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Performance-based recommendations
    if (prediction.score < 60) {
      recommendations.push({
        type: 'intervention',
        priority: 'high',
        action: 'Implement intensive tutoring program',
        expectedImpact: 0.3,
        timeframe: '2-4 weeks',
        resources: ['One-on-one tutoring', 'Practice worksheets', 'Video tutorials']
      });
    }

    // Motivation-based recommendations
    if (studentData.behavioralMetrics.motivation < 3) {
      recommendations.push({
        type: 'enhancement',
        priority: 'high',
        action: 'Implement gamification and reward system',
        expectedImpact: 0.25,
        timeframe: '1-2 weeks',
        resources: ['Educational games', 'Achievement badges', 'Progress tracking']
      });
    }

    // Study habits recommendations
    if (studentData.studyHours < 10) {
      recommendations.push({
        type: 'enhancement',
        priority: 'medium',
        action: 'Develop structured study schedule',
        expectedImpact: 0.2,
        timeframe: '1-3 weeks',
        resources: ['Study planner', 'Time management tools', 'Study techniques guide']
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private calculateAverageScore(scores: number[]): number {
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length / 100 : 0;
  }

  private analyzeCognitiveProfile(metrics: CognitiveMetrics): any {
    return {
      dominant: this.findDominantCognitive(metrics),
      balanced: this.isCognitiveBalanced(metrics),
      strengths: this.getCognitiveStrengths(metrics),
      areas_for_development: this.getCognitiveDevelopmentAreas(metrics)
    };
  }

  private analyzeBehavioralProfile(metrics: BehavioralMetrics): any {
    return {
      engagement_level: (metrics.attention + metrics.motivation) / 2,
      social_skills: (metrics.collaboration + metrics.selfRegulation) / 2,
      resilience_factor: metrics.resilience,
      overall_behavior: Object.values(metrics).reduce((a, b) => a + b, 0) / 5
    };
  }

  private determineOptimalLearningStyle(
    cognitive: any,
    behavioral: any,
    subjects: SubjectPerformance[]
  ): string {
    // Analyze performance patterns across different learning modalities
    const visualSubjects = ['mathematics', 'geometry', 'art', 'science'];
    const auditorySubjects = ['language', 'music', 'history', 'literature'];
    const kinestheticSubjects = ['physical_education', 'chemistry_lab', 'biology_lab'];

    const visualPerformance = this.calculateModalityPerformance(subjects, visualSubjects);
    const auditoryPerformance = this.calculateModalityPerformance(subjects, auditorySubjects);
    const kinestheticPerformance = this.calculateModalityPerformance(subjects, kinestheticSubjects);

    if (visualPerformance > auditoryPerformance && visualPerformance > kinestheticPerformance) {
      return 'visual';
    } else if (auditoryPerformance > kinestheticPerformance) {
      return 'auditory';
    } else {
      return 'kinesthetic';
    }
  }

  private calculateModalityPerformance(subjects: SubjectPerformance[], modalitySubjects: string[]): number {
    const relevantSubjects = subjects.filter(s => 
      modalitySubjects.some(ms => s.subject.toLowerCase().includes(ms))
    );
    
    if (relevantSubjects.length === 0) return 0;
    
    return relevantSubjects.reduce((sum, subject) => sum + subject.currentScore, 0) / relevantSubjects.length;
  }

  private identifyStrengths(studentData: StudentData): string[] {
    const strengths: string[] = [];
    
    // Cognitive strengths
    const cognitive = studentData.cognitiveMetrics;
    if (cognitive.logicalReasoning >= 4) strengths.push('Logical Reasoning');
    if (cognitive.spatialAbility >= 4) strengths.push('Spatial Intelligence');
    if (cognitive.verbalAbility >= 4) strengths.push('Verbal Communication');
    if (cognitive.processingSpeed >= 4) strengths.push('Quick Processing');
    if (cognitive.workingMemory >= 4) strengths.push('Memory Retention');
    
    // Behavioral strengths
    const behavioral = studentData.behavioralMetrics;
    if (behavioral.motivation >= 4) strengths.push('High Motivation');
    if (behavioral.attention >= 4) strengths.push('Strong Focus');
    if (behavioral.collaboration >= 4) strengths.push('Team Collaboration');
    if (behavioral.selfRegulation >= 4) strengths.push('Self-Management');
    if (behavioral.resilience >= 4) strengths.push('Resilience');
    
    // Academic strengths
    const topSubjects = studentData.subjects
      .filter(s => s.currentScore >= 80)
      .sort((a, b) => b.currentScore - a.currentScore)
      .slice(0, 3)
      .map(s => s.subject);
    
    strengths.push(...topSubjects.map(subject => `Excellence in ${subject}`));
    
    return strengths;
  }

  private identifyWeaknesses(studentData: StudentData): string[] {
    const weaknesses: string[] = [];
    
    // Cognitive weaknesses
    const cognitive = studentData.cognitiveMetrics;
    if (cognitive.logicalReasoning <= 2) weaknesses.push('Logical Reasoning');
    if (cognitive.spatialAbility <= 2) weaknesses.push('Spatial Processing');
    if (cognitive.verbalAbility <= 2) weaknesses.push('Verbal Skills');
    if (cognitive.processingSpeed <= 2) weaknesses.push('Processing Speed');
    if (cognitive.workingMemory <= 2) weaknesses.push('Memory Retention');
    
    // Behavioral weaknesses
    const behavioral = studentData.behavioralMetrics;
    if (behavioral.motivation <= 2) weaknesses.push('Motivation');
    if (behavioral.attention <= 2) weaknesses.push('Attention Span');
    if (behavioral.collaboration <= 2) weaknesses.push('Collaboration Skills');
    if (behavioral.selfRegulation <= 2) weaknesses.push('Self-Regulation');
    if (behavioral.resilience <= 2) weaknesses.push('Resilience');
    
    // Academic weaknesses
    const strugglingSubjects = studentData.subjects
      .filter(s => s.currentScore < 60)
      .sort((a, b) => a.currentScore - b.currentScore)
      .slice(0, 3)
      .map(s => s.subject);
    
    weaknesses.push(...strugglingSubjects.map(subject => `Challenges in ${subject}`));
    
    return weaknesses;
  }

  private generateOptimalSchedule(studentData: StudentData): any {
    // Generate personalized study schedule based on learning patterns
    const totalStudyHours = Math.max(studentData.studyHours, 15); // Minimum 15 hours per week
    const subjects = studentData.subjects.sort((a, b) => a.currentScore - b.currentScore); // Prioritize struggling subjects
    
    return {
      weeklyHours: totalStudyHours,
      dailySchedule: this.createDailySchedule(subjects, totalStudyHours),
      prioritySubjects: subjects.slice(0, 3).map(s => s.subject),
      breakIntervals: this.calculateOptimalBreaks(studentData.behavioralMetrics.attention),
      bestStudyTimes: this.identifyBestStudyTimes(studentData)
    };
  }

  private createDailySchedule(subjects: SubjectPerformance[], totalHours: number): any {
    const daysPerWeek = 6; // Monday to Saturday
    const hoursPerDay = totalHours / daysPerWeek;
    
    return {
      monday: this.allocateSubjects(subjects, hoursPerDay, ['mathematics', 'science']),
      tuesday: this.allocateSubjects(subjects, hoursPerDay, ['language', 'literature']),
      wednesday: this.allocateSubjects(subjects, hoursPerDay, ['social_studies', 'history']),
      thursday: this.allocateSubjects(subjects, hoursPerDay, ['mathematics', 'science']),
      friday: this.allocateSubjects(subjects, hoursPerDay, ['language', 'arts']),
      saturday: this.allocateSubjects(subjects, hoursPerDay, ['review', 'practice'])
    };
  }

  private allocateSubjects(subjects: SubjectPerformance[], hours: number, focus: string[]): any {
    return {
      morning: `${focus[0] || 'primary_subject'} (${(hours * 0.6).toFixed(1)} hours)`,
      afternoon: `${focus[1] || 'secondary_subject'} (${(hours * 0.4).toFixed(1)} hours)`,
      totalHours: hours
    };
  }

  private calculateOptimalBreaks(attentionLevel: number): string {
    if (attentionLevel >= 4) return 'Every 45-60 minutes';
    if (attentionLevel >= 3) return 'Every 30-45 minutes';
    return 'Every 20-30 minutes';
  }

  private identifyBestStudyTimes(studentData: StudentData): string[] {
    // Based on age and behavioral patterns
    const times = [];
    
    if (studentData.age < 12) {
      times.push('Morning (9-11 AM)', 'Early afternoon (2-4 PM)');
    } else if (studentData.age < 16) {
      times.push('Morning (8-10 AM)', 'Evening (6-8 PM)');
    } else {
      times.push('Early morning (6-8 AM)', 'Evening (7-9 PM)');
    }
    
    return times;
  }

  private recommendResources(studentData: StudentData, learningStyle: string): string[] {
    const resources: string[] = [];
    
    if (learningStyle === 'visual') {
      resources.push(
        'Interactive diagrams and charts',
        'Video tutorials and animations',
        'Mind mapping tools',
        'Infographics and visual aids'
      );
    } else if (learningStyle === 'auditory') {
      resources.push(
        'Audio lectures and podcasts',
        'Discussion groups and debates',
        'Music-based learning tools',
        'Verbal explanations and storytelling'
      );
    } else if (learningStyle === 'kinesthetic') {
      resources.push(
        'Hands-on experiments and activities',
        'Physical models and manipulatives',
        'Role-playing and simulations',
        'Movement-based learning games'
      );
    }
    
    // Add subject-specific resources
    studentData.subjects.forEach(subject => {
      if (subject.currentScore < 70) {
        resources.push(`${subject.subject} practice worksheets`);
        resources.push(`${subject.subject} tutorial videos`);
      }
    });
    
    return resources;
  }

  private analyzeAptitude(studentData: StudentData): any {
    return {
      analytical: (studentData.cognitiveMetrics.logicalReasoning + studentData.cognitiveMetrics.processingSpeed) / 2,
      creative: (studentData.cognitiveMetrics.spatialAbility + this.getCreativityScore(studentData)) / 2,
      social: (studentData.behavioralMetrics.collaboration + studentData.behavioralMetrics.selfRegulation) / 2,
      technical: this.getTechnicalAptitude(studentData),
      leadership: (studentData.behavioralMetrics.motivation + studentData.behavioralMetrics.resilience) / 2
    };
  }

  private getCreativityScore(studentData: StudentData): number {
    // Estimate creativity based on arts, language, and spatial performance
    const creativeSubjects = studentData.subjects.filter(s => 
      ['art', 'music', 'creative_writing', 'design'].some(cs => 
        s.subject.toLowerCase().includes(cs)
      )
    );
    
    return creativeSubjects.length > 0 
      ? creativeSubjects.reduce((sum, s) => sum + s.currentScore, 0) / creativeSubjects.length / 20
      : 3; // Default average
  }

  private getTechnicalAptitude(studentData: StudentData): number {
    // Estimate technical aptitude based on STEM subjects
    const technicalSubjects = studentData.subjects.filter(s => 
      ['mathematics', 'science', 'physics', 'chemistry', 'computer', 'engineering'].some(ts => 
        s.subject.toLowerCase().includes(ts)
      )
    );
    
    return technicalSubjects.length > 0 
      ? technicalSubjects.reduce((sum, s) => sum + s.currentScore, 0) / technicalSubjects.length / 20
      : 3; // Default average
  }

  // Helper methods for cognitive analysis
  private findDominantCognitive(metrics: CognitiveMetrics): string {
    const scores = {
      processing: metrics.processingSpeed,
      memory: metrics.workingMemory,
      logical: metrics.logicalReasoning,
      spatial: metrics.spatialAbility,
      verbal: metrics.verbalAbility
    };
    
    return Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
  }

  private isCognitiveBalanced(metrics: CognitiveMetrics): boolean {
    const values = Object.values(metrics);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    return variance < 1; // Threshold for "balanced"
  }

  private getCognitiveStrengths(metrics: CognitiveMetrics): string[] {
    return Object.entries(metrics)
      .filter(([_, value]) => value >= 4)
      .map(([key, _]) => key);
  }

  private getCognitiveDevelopmentAreas(metrics: CognitiveMetrics): string[] {
    return Object.entries(metrics)
      .filter(([_, value]) => value <= 2)
      .map(([key, _]) => key);
  }
}

// Supporting model classes
class PerformancePredictionModel {
  predict(features: number[]): { score: number; confidence: number } {
    // Simplified linear regression model
    const weights = [
      0.1, 0.15, 0.3, 0.25, 0.2, // Academic factors
      0.1, 0.15, 0.05, 0.03, // Environmental factors
      0.08, 0.1, 0.12, 0.06, 0.08, // Cognitive factors
      0.15, 0.2, 0.04, 0.1, 0.08, // Behavioral factors
      0.05, 0.15, 0.1 // Subject-specific factors
    ];
    
    const score = features.reduce((sum, feature, index) => 
      sum + (feature * (weights[index] || 0)), 0
    ) * 100;
    
    return {
      score: Math.max(0, Math.min(100, score)),
      confidence: 0.75
    };
  }
}

class RiskAssessmentModel {
  assess(features: number[]): { level: 'low' | 'medium' | 'high'; factors: string[] } {
    const riskScore = this.calculateRiskScore(features);
    
    return {
      level: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      factors: this.identifyRiskFactors(features)
    };
  }
  
  private calculateRiskScore(features: number[]): number {
    // Risk indicators: low attendance, poor motivation, declining trend
    const attendanceRisk = 1 - features[5]; // Low attendance = high risk
    const motivationRisk = 1 - features[15]; // Low motivation = high risk
    const trendRisk = features[4] < 0 ? Math.abs(features[4]) : 0; // Negative trend = risk
    
    return (attendanceRisk + motivationRisk + trendRisk) / 3;
  }
  
  private identifyRiskFactors(features: number[]): string[] {
    const factors = [];
    
    if (features[5] < 0.8) factors.push('Poor attendance');
    if (features[15] < 0.4) factors.push('Low motivation');
    if (features[4] < -0.2) factors.push('Declining performance trend');
    if (features[6] < 0.3) factors.push('Insufficient study time');
    
    return factors;
  }
}

class LearningPathModel {
  generatePath(studentData: any): any {
    // Implementation for learning path generation
    return {};
  }
}

class CareerGuidanceModel {
  async matchCareers(aptitudeProfile: any): Promise<CareerSuggestion[]> {
    // Career matching algorithm
    const careers: CareerSuggestion[] = [];
    
    // STEM careers for high analytical/technical aptitude
    if (aptitudeProfile.analytical > 3.5 && aptitudeProfile.technical > 3.5) {
      careers.push({
        title: 'Software Engineer',
        match: 0.9,
        description: 'Design and develop software applications',
        requiredSkills: ['Programming', 'Problem Solving', 'Mathematics'],
        educationPath: ['Computer Science Degree', 'Coding Bootcamp'],
        averageSalary: '₹8-25 LPA'
      });
    }
    
    // Creative careers for high creativity
    if (aptitudeProfile.creative > 3.5) {
      careers.push({
        title: 'Graphic Designer',
        match: 0.85,
        description: 'Create visual content for digital and print media',
        requiredSkills: ['Design Software', 'Creativity', 'Visual Communication'],
        educationPath: ['Design Degree', 'Portfolio Development'],
        averageSalary: '₹3-12 LPA'
      });
    }
    
    // Leadership careers for high social/leadership aptitude
    if (aptitudeProfile.social > 3.5 && aptitudeProfile.leadership > 3.5) {
      careers.push({
        title: 'Project Manager',
        match: 0.8,
        description: 'Lead teams and manage project execution',
        requiredSkills: ['Leadership', 'Communication', 'Planning'],
        educationPath: ['Business Degree', 'Project Management Certification'],
        averageSalary: '₹6-20 LPA'
      });
    }
    
    return careers.sort((a, b) => b.match - a.match);
  }
}

// Supporting interfaces
interface CareerSuggestion {
  title: string;
  match: number;
  description: string;
  requiredSkills: string[];
  educationPath: string[];
  averageSalary: string;
}

interface DevelopmentPlan {
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
  milestones: Milestone[];
}

interface Milestone {
  title: string;
  deadline: string;
  description: string;
  success_criteria: string[];
}

export default PredictionEngine;
