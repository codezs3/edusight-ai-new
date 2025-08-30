/**
 * EduSight 360° Score System
 * Comprehensive assessment scoring system covering Academic, Psychological, and Physical domains
 * Score Range: 40-100 (Below 40 indicates need for medical intervention)
 */

export interface AssessmentDomain {
  academic: AcademicAssessment;
  psychological: PsychologicalAssessment;
  physical: PhysicalAssessment;
}

export interface AcademicAssessment {
  framework: 'IB' | 'IGCSE' | 'ICSE' | 'CBSE';
  subjects: SubjectScore[];
  overallGPA: number;
  attendanceRate: number;
  behavioralRating: number;
  teacherFeedback: number;
}

export interface SubjectScore {
  subject: string;
  currentScore: number;
  previousScores: number[];
  trend: 'improving' | 'stable' | 'declining';
  difficulty: number;
  engagement: number;
}

export interface PsychologicalAssessment {
  cognitiveAbilities: CognitiveProfile;
  emotionalIntelligence: EmotionalProfile;
  personalityTraits: PersonalityProfile;
  learningStyle: LearningStyleProfile;
  motivationLevel: number;
  stressLevel: number;
  socialSkills: number;
}

export interface CognitiveProfile {
  logicalReasoning: number;
  spatialAbility: number;
  verbalAbility: number;
  numericalAbility: number;
  memoryCapacity: number;
  processingSpeed: number;
  attention: number;
}

export interface EmotionalProfile {
  selfAwareness: number;
  selfRegulation: number;
  empathy: number;
  socialAwareness: number;
  relationshipSkills: number;
}

export interface PersonalityProfile {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface LearningStyleProfile {
  visual: number;
  auditory: number;
  kinesthetic: number;
  readingWriting: number;
}

export interface PhysicalAssessment {
  motorSkills: MotorSkillsProfile;
  fitnessLevel: FitnessProfile;
  healthIndicators: HealthProfile;
  sportsPerformance: SportsProfile;
}

export interface MotorSkillsProfile {
  fineMotorSkills: number;
  grossMotorSkills: number;
  coordination: number;
  balance: number;
  agility: number;
}

export interface FitnessProfile {
  cardiovascularEndurance: number;
  muscularStrength: number;
  muscularEndurance: number;
  flexibility: number;
  bodyComposition: number;
}

export interface HealthProfile {
  bmi: number;
  visionHealth: number;
  hearingHealth: number;
  posture: number;
  sleepQuality: number;
  nutritionHabits: number;
}

export interface SportsProfile {
  teamSports: number;
  individualSports: number;
  competitiveSpirit: number;
  sportsmanship: number;
}

export interface EduSight360Result {
  overallScore: number;
  domainScores: {
    academic: number;
    psychological: number;
    physical: number;
  };
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  interventionRequired: boolean;
  medicalReferralNeeded: boolean;
  recommendations: Recommendation[];
  strengths: string[];
  areasForImprovement: string[];
  developmentPlan: DevelopmentPlan;
}

export interface Recommendation {
  domain: 'academic' | 'psychological' | 'physical' | 'general';
  priority: 'high' | 'medium' | 'low';
  type: 'intervention' | 'enhancement' | 'maintenance';
  action: string;
  timeline: string;
  expectedOutcome: string;
  resources: string[];
}

export interface DevelopmentPlan {
  shortTerm: PlanItem[];
  mediumTerm: PlanItem[];
  longTerm: PlanItem[];
  milestones: Milestone[];
}

export interface PlanItem {
  goal: string;
  actions: string[];
  timeline: string;
  successMetrics: string[];
}

export interface Milestone {
  title: string;
  targetDate: string;
  description: string;
  successCriteria: string[];
}

export class EduSight360ScoreEngine {
  private static instance: EduSight360ScoreEngine;
  
  // Scoring weights for different domains
  private readonly DOMAIN_WEIGHTS = {
    academic: 0.5,      // 50% weight
    psychological: 0.3, // 30% weight
    physical: 0.2       // 20% weight
  };

  // Framework-specific scoring adjustments
  private readonly FRAMEWORK_ADJUSTMENTS = {
    IB: { difficulty: 1.2, breadth: 1.1 },
    IGCSE: { difficulty: 1.1, breadth: 1.0 },
    ICSE: { difficulty: 1.0, breadth: 0.9 },
    CBSE: { difficulty: 0.9, breadth: 0.8 }
  };

  private constructor() {}

  public static getInstance(): EduSight360ScoreEngine {
    if (!EduSight360ScoreEngine.instance) {
      EduSight360ScoreEngine.instance = new EduSight360ScoreEngine();
    }
    return EduSight360ScoreEngine.instance;
  }

  /**
   * Calculate comprehensive EduSight 360° Score
   */
  public calculateEduSight360Score(assessment: AssessmentDomain): EduSight360Result {
    // Calculate domain scores
    const academicScore = this.calculateAcademicScore(assessment.academic);
    const psychologicalScore = this.calculatePsychologicalScore(assessment.psychological);
    const physicalScore = this.calculatePhysicalScore(assessment.physical);

    // Calculate weighted overall score
    const overallScore = this.calculateOverallScore(academicScore, psychologicalScore, physicalScore);

    // Determine risk level and intervention needs
    const riskAssessment = this.assessRisk(overallScore, academicScore, psychologicalScore, physicalScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(assessment, {
      academic: academicScore,
      psychological: psychologicalScore,
      physical: physicalScore
    });

    // Identify strengths and areas for improvement
    const strengths = this.identifyStrengths(assessment);
    const areasForImprovement = this.identifyAreasForImprovement(assessment);

    // Create development plan
    const developmentPlan = this.createDevelopmentPlan(assessment, recommendations);

    return {
      overallScore,
      domainScores: {
        academic: academicScore,
        psychological: psychologicalScore,
        physical: physicalScore
      },
      riskLevel: riskAssessment.level,
      interventionRequired: riskAssessment.interventionRequired,
      medicalReferralNeeded: riskAssessment.medicalReferralNeeded,
      recommendations,
      strengths,
      areasForImprovement,
      developmentPlan
    };
  }

  /**
   * Calculate Academic Domain Score (0-100)
   */
  private calculateAcademicScore(academic: AcademicAssessment): number {
    const framework = this.FRAMEWORK_ADJUSTMENTS[academic.framework];
    
    // Subject performance (40% weight)
    const subjectAverage = academic.subjects.reduce((sum, subject) => sum + subject.currentScore, 0) / academic.subjects.length;
    const subjectScore = Math.min(100, subjectAverage * framework.difficulty);

    // GPA score (25% weight)
    const gpaScore = Math.min(100, (academic.overallGPA / 4.0) * 100);

    // Attendance (15% weight)
    const attendanceScore = academic.attendanceRate * 100;

    // Behavioral rating (10% weight)
    const behavioralScore = academic.behavioralRating * 20; // Convert 1-5 scale to 0-100

    // Teacher feedback (10% weight)
    const feedbackScore = academic.teacherFeedback * 20; // Convert 1-5 scale to 0-100

    const rawScore = (
      subjectScore * 0.4 +
      gpaScore * 0.25 +
      attendanceScore * 0.15 +
      behavioralScore * 0.1 +
      feedbackScore * 0.1
    );

    // Apply framework breadth adjustment
    return Math.min(100, Math.max(40, rawScore * framework.breadth));
  }

  /**
   * Calculate Psychological Domain Score (0-100)
   */
  private calculatePsychologicalScore(psychological: PsychologicalAssessment): number {
    // Cognitive abilities (35% weight)
    const cognitiveAverage = Object.values(psychological.cognitiveAbilities).reduce((sum, val) => sum + val, 0) / 7;
    const cognitiveScore = cognitiveAverage * 20; // Convert 1-5 scale to 0-100

    // Emotional intelligence (25% weight)
    const emotionalAverage = Object.values(psychological.emotionalIntelligence).reduce((sum, val) => sum + val, 0) / 5;
    const emotionalScore = emotionalAverage * 20;

    // Personality traits (15% weight) - normalized to positive scoring
    const personalityScore = this.calculatePersonalityScore(psychological.personalityTraits);

    // Learning style adaptability (10% weight)
    const learningStyleScore = this.calculateLearningStyleScore(psychological.learningStyle);

    // Motivation and stress (15% weight)
    const motivationScore = psychological.motivationLevel * 20;
    const stressScore = (5 - psychological.stressLevel) * 20; // Invert stress (lower is better)
    const motivationStressScore = (motivationScore + stressScore) / 2;

    const rawScore = (
      cognitiveScore * 0.35 +
      emotionalScore * 0.25 +
      personalityScore * 0.15 +
      learningStyleScore * 0.1 +
      motivationStressScore * 0.15
    );

    return Math.min(100, Math.max(40, rawScore));
  }

  /**
   * Calculate Physical Domain Score (0-100)
   */
  private calculatePhysicalScore(physical: PhysicalAssessment): number {
    // Motor skills (30% weight)
    const motorAverage = Object.values(physical.motorSkills).reduce((sum, val) => sum + val, 0) / 5;
    const motorScore = motorAverage * 20;

    // Fitness level (35% weight)
    const fitnessAverage = Object.values(physical.fitnessLevel).reduce((sum, val) => sum + val, 0) / 5;
    const fitnessScore = fitnessAverage * 20;

    // Health indicators (25% weight)
    const healthScore = this.calculateHealthScore(physical.healthIndicators);

    // Sports performance (10% weight)
    const sportsAverage = Object.values(physical.sportsPerformance).reduce((sum, val) => sum + val, 0) / 4;
    const sportsScore = sportsAverage * 20;

    const rawScore = (
      motorScore * 0.3 +
      fitnessScore * 0.35 +
      healthScore * 0.25 +
      sportsScore * 0.1
    );

    return Math.min(100, Math.max(40, rawScore));
  }

  /**
   * Calculate weighted overall score
   */
  private calculateOverallScore(academic: number, psychological: number, physical: number): number {
    const weightedScore = (
      academic * this.DOMAIN_WEIGHTS.academic +
      psychological * this.DOMAIN_WEIGHTS.psychological +
      physical * this.DOMAIN_WEIGHTS.physical
    );

    return Math.round(Math.min(100, Math.max(40, weightedScore)));
  }

  /**
   * Assess risk level and intervention needs
   */
  private assessRisk(overall: number, academic: number, psychological: number, physical: number): {
    level: 'low' | 'moderate' | 'high' | 'critical';
    interventionRequired: boolean;
    medicalReferralNeeded: boolean;
  } {
    // Critical threshold - medical intervention required
    if (overall < 40 || academic < 40 || psychological < 40 || physical < 40) {
      return {
        level: 'critical',
        interventionRequired: true,
        medicalReferralNeeded: true
      };
    }

    // High risk - immediate intervention needed
    if (overall < 55 || Math.min(academic, psychological, physical) < 50) {
      return {
        level: 'high',
        interventionRequired: true,
        medicalReferralNeeded: false
      };
    }

    // Moderate risk - monitoring and support needed
    if (overall < 70 || Math.min(academic, psychological, physical) < 60) {
      return {
        level: 'moderate',
        interventionRequired: true,
        medicalReferralNeeded: false
      };
    }

    // Low risk - regular monitoring
    return {
      level: 'low',
      interventionRequired: false,
      medicalReferralNeeded: false
    };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(assessment: AssessmentDomain, scores: any): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Academic recommendations
    if (scores.academic < 60) {
      recommendations.push({
        domain: 'academic',
        priority: 'high',
        type: 'intervention',
        action: 'Implement personalized tutoring program',
        timeline: '2-4 weeks',
        expectedOutcome: 'Improve academic performance by 15-20 points',
        resources: ['One-on-one tutoring', 'Adaptive learning software', 'Study skills workshop']
      });
    }

    // Psychological recommendations
    if (scores.psychological < 60) {
      recommendations.push({
        domain: 'psychological',
        priority: 'high',
        type: 'intervention',
        action: 'Counseling and emotional support program',
        timeline: '4-8 weeks',
        expectedOutcome: 'Enhanced emotional regulation and coping skills',
        resources: ['School counselor sessions', 'Mindfulness training', 'Peer support groups']
      });
    }

    // Physical recommendations
    if (scores.physical < 60) {
      recommendations.push({
        domain: 'physical',
        priority: 'medium',
        type: 'enhancement',
        action: 'Structured physical activity program',
        timeline: '6-12 weeks',
        expectedOutcome: 'Improved physical fitness and motor skills',
        resources: ['PE specialist', 'Fitness tracking', 'Nutrition guidance']
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Helper method to calculate personality score
   */
  private calculatePersonalityScore(personality: PersonalityProfile): number {
    // Normalize personality traits to positive scoring
    const openness = personality.openness * 20;
    const conscientiousness = personality.conscientiousness * 20;
    const extraversion = Math.abs(personality.extraversion - 3) * 20; // Balanced extraversion is optimal
    const agreeableness = personality.agreeableness * 20;
    const neuroticism = (5 - personality.neuroticism) * 20; // Lower neuroticism is better

    return (openness + conscientiousness + extraversion + agreeableness + neuroticism) / 5;
  }

  /**
   * Helper method to calculate learning style score
   */
  private calculateLearningStyleScore(learningStyle: LearningStyleProfile): number {
    // Balanced learning style is optimal
    const styles = Object.values(learningStyle);
    const average = styles.reduce((sum, val) => sum + val, 0) / styles.length;
    const variance = styles.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / styles.length;
    
    // Lower variance indicates more balanced learning style
    return Math.max(40, 100 - (variance * 20));
  }

  /**
   * Helper method to calculate health score
   */
  private calculateHealthScore(health: HealthProfile): number {
    // BMI scoring (optimal range 18.5-24.9)
    let bmiScore = 100;
    if (health.bmi < 18.5 || health.bmi > 24.9) {
      bmiScore = Math.max(40, 100 - Math.abs(health.bmi - 21.7) * 10);
    }

    // Other health indicators
    const visionScore = health.visionHealth * 20;
    const hearingScore = health.hearingHealth * 20;
    const postureScore = health.posture * 20;
    const sleepScore = health.sleepQuality * 20;
    const nutritionScore = health.nutritionHabits * 20;

    return (bmiScore + visionScore + hearingScore + postureScore + sleepScore + nutritionScore) / 6;
  }

  /**
   * Identify student strengths
   */
  private identifyStrengths(assessment: AssessmentDomain): string[] {
    const strengths: string[] = [];

    // Academic strengths
    const topSubjects = assessment.academic.subjects
      .filter(s => s.currentScore >= 80)
      .sort((a, b) => b.currentScore - a.currentScore)
      .slice(0, 3);
    
    topSubjects.forEach(subject => {
      strengths.push(`Excellence in ${subject.subject}`);
    });

    // Psychological strengths
    const cognitive = assessment.psychological.cognitiveAbilities;
    if (cognitive.logicalReasoning >= 4) strengths.push('Strong logical reasoning');
    if (cognitive.spatialAbility >= 4) strengths.push('Excellent spatial intelligence');
    if (cognitive.verbalAbility >= 4) strengths.push('Superior verbal skills');

    // Physical strengths
    const fitness = assessment.physical.fitnessLevel;
    if (fitness.cardiovascularEndurance >= 4) strengths.push('Excellent cardiovascular fitness');
    if (fitness.muscularStrength >= 4) strengths.push('Strong muscular development');

    return strengths;
  }

  /**
   * Identify areas for improvement
   */
  private identifyAreasForImprovement(assessment: AssessmentDomain): string[] {
    const improvements: string[] = [];

    // Academic improvements
    const weakSubjects = assessment.academic.subjects
      .filter(s => s.currentScore < 60)
      .sort((a, b) => a.currentScore - b.currentScore)
      .slice(0, 3);
    
    weakSubjects.forEach(subject => {
      improvements.push(`Needs support in ${subject.subject}`);
    });

    // Psychological improvements
    const cognitive = assessment.psychological.cognitiveAbilities;
    if (cognitive.attention < 3) improvements.push('Attention and focus skills');
    if (assessment.psychological.stressLevel > 3) improvements.push('Stress management');

    // Physical improvements
    const health = assessment.physical.healthIndicators;
    if (health.sleepQuality < 3) improvements.push('Sleep quality and habits');
    if (health.nutritionHabits < 3) improvements.push('Nutrition and dietary habits');

    return improvements;
  }

  /**
   * Create comprehensive development plan
   */
  private createDevelopmentPlan(assessment: AssessmentDomain, recommendations: Recommendation[]): DevelopmentPlan {
    return {
      shortTerm: [
        {
          goal: 'Immediate intervention for critical areas',
          actions: recommendations.filter(r => r.priority === 'high').map(r => r.action),
          timeline: '1-4 weeks',
          successMetrics: ['Score improvement of 10+ points', 'Reduced risk level']
        }
      ],
      mediumTerm: [
        {
          goal: 'Comprehensive skill development',
          actions: ['Implement structured learning program', 'Regular progress monitoring'],
          timeline: '2-6 months',
          successMetrics: ['Sustained score improvement', 'Enhanced learning outcomes']
        }
      ],
      longTerm: [
        {
          goal: 'Holistic development and excellence',
          actions: ['Advanced skill development', 'Leadership opportunities'],
          timeline: '6-12 months',
          successMetrics: ['Score above 80', 'Well-rounded development']
        }
      ],
      milestones: [
        {
          title: 'First Assessment Review',
          targetDate: '4 weeks',
          description: 'Evaluate initial intervention effectiveness',
          successCriteria: ['Score improvement', 'Positive feedback', 'Reduced concerns']
        }
      ]
    };
  }
}

export default EduSight360ScoreEngine;
