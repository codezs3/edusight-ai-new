/**
 * AI Career Matching System
 * Integrates with O*NET database to provide personalized career recommendations
 * based on student's academic, psychological, and physical assessments
 */

import { 
  StudentProfile, 
  CareerInterests, 
  CareerRecommendation, 
  AICareerMatching,
  CareerMatch,
  SimilarityScore,
  CareerConcern,
  CareerGuidanceRecommendation
} from '@/lib/models/EduSightDataModel';

// O*NET Career Database Interface
export interface ONetCareer {
  code: string;
  title: string;
  description: string;
  tasks: string[];
  knowledge: ONetKnowledge[];
  skills: ONetSkill[];
  abilities: ONetAbility[];
  workActivities: ONetWorkActivity[];
  workContext: ONetWorkContext[];
  interests: ONetInterests;
  workValues: ONetWorkValues;
  workStyles: ONetWorkStyles;
  education: EducationRequirement;
  experience: ExperienceRequirement;
  jobTraining: JobTrainingRequirement;
  outlook: JobOutlook;
  wages: WageInformation;
  relatedCareers: string[];
}

export interface ONetKnowledge {
  element: string;
  description: string;
  level: number; // 1-7 scale
  importance: number; // 1-5 scale
}

export interface ONetSkill {
  element: string;
  description: string;
  level: number;
  importance: number;
}

export interface ONetAbility {
  element: string;
  description: string;
  level: number;
  importance: number;
}

export interface ONetWorkActivity {
  element: string;
  description: string;
  level: number;
  importance: number;
}

export interface ONetWorkContext {
  element: string;
  description: string;
  category: string;
  value: number;
}

export interface ONetInterests {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface ONetWorkValues {
  achievement: number;
  workingConditions: number;
  recognition: number;
  relationships: number;
  support: number;
  independence: number;
}

export interface ONetWorkStyles {
  adaptability: number;
  attention: number;
  cooperation: number;
  dependability: number;
  initiative: number;
  integrity: number;
  leadership: number;
  persistence: number;
  socialOrientation: number;
  stressManagement: number;
}

export interface EducationRequirement {
  level: string;
  description: string;
  examples: string[];
}

export interface ExperienceRequirement {
  level: string;
  description: string;
  examples: string[];
}

export interface JobTrainingRequirement {
  level: string;
  description: string;
  examples: string[];
}

export interface JobOutlook {
  growthRate: number;
  outlook: string;
  description: string;
  factors: string[];
}

export interface WageInformation {
  median: number;
  entry: number;
  experienced: number;
  currency: string;
  region: string;
  lastUpdated: Date;
}

// Student Assessment Profile for Career Matching
export interface StudentAssessmentProfile {
  studentId: string;
  academicProfile: AcademicProfile;
  psychologicalProfile: PsychologicalProfile;
  physicalProfile: PhysicalProfile;
  interestProfile: InterestProfile;
  valueProfile: ValueProfile;
  skillProfile: SkillProfile;
  personalityProfile: PersonalityProfile;
}

export interface AcademicProfile {
  overallGPA: number;
  subjectStrengths: string[];
  subjectWeaknesses: string[];
  learningStyle: string;
  academicMotivation: number;
  criticalThinking: number;
  problemSolving: number;
}

export interface PsychologicalProfile {
  cognitiveAbilities: {
    verbalReasoning: number;
    numericalReasoning: number;
    spatialReasoning: number;
    logicalReasoning: number;
    memoryCapacity: number;
    processingSpeed: number;
  };
  emotionalIntelligence: {
    selfAwareness: number;
    selfRegulation: number;
    empathy: number;
    socialSkills: number;
  };
  personalityTraits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

export interface PhysicalProfile {
  overallFitness: number;
  motorSkills: number;
  physicalStamina: number;
  handEyeCoordination: number;
  physicalLimitations: string[];
}

export interface InterestProfile {
  riasecScores: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  subjectInterests: { [subject: string]: number };
  activityInterests: { [activity: string]: number };
}

export interface ValueProfile {
  workValues: {
    achievement: number;
    independence: number;
    recognition: number;
    relationships: number;
    support: number;
    workingConditions: number;
  };
  lifeValues: {
    familyTime: number;
    workLifeBalance: number;
    financialSecurity: number;
    socialImpact: number;
    creativity: number;
    stability: number;
  };
}

export interface SkillProfile {
  currentSkills: { [skill: string]: number };
  skillPotential: { [skill: string]: number };
  learningAgility: number;
  adaptability: number;
}

export interface PersonalityProfile {
  workStyles: {
    teamwork: number;
    leadership: number;
    independence: number;
    attention: number;
    persistence: number;
    adaptability: number;
  };
  communicationStyle: string;
  decisionMakingStyle: string;
  stressManagement: number;
}

export class AICareerMatcher {
  private static instance: AICareerMatcher;
  private onetDatabase: Map<string, ONetCareer> = new Map();
  
  private constructor() {
    this.initializeONetDatabase();
  }

  public static getInstance(): AICareerMatcher {
    if (!AICareerMatcher.instance) {
      AICareerMatcher.instance = new AICareerMatcher();
    }
    return AICareerMatcher.instance;
  }

  /**
   * Main career matching function
   */
  public async generateCareerRecommendations(
    studentProfile: StudentAssessmentProfile
  ): Promise<AICareerMatching> {
    try {
      // Step 1: Calculate compatibility scores for all careers
      const careerScores = await this.calculateCareerCompatibility(studentProfile);
      
      // Step 2: Rank and filter top matches
      const topMatches = this.selectTopMatches(careerScores, 20);
      
      // Step 3: Generate detailed career matches
      const careerMatches = await this.generateDetailedMatches(topMatches, studentProfile);
      
      // Step 4: Calculate similarity scores with successful professionals
      const similarityScores = await this.calculateSimilarityScores(studentProfile);
      
      // Step 5: Identify potential concerns
      const concerns = await this.identifyCareerConcerns(careerMatches, studentProfile);
      
      // Step 6: Generate guidance recommendations
      const recommendations = await this.generateGuidanceRecommendations(careerMatches, concerns, studentProfile);
      
      return {
        studentId: studentProfile.studentId,
        analysisDate: new Date(),
        studentProfile: this.createStudentCareerProfile(studentProfile),
        careerMatches,
        similarityScores,
        concerns,
        recommendations,
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Career matching error:', error);
      throw new Error('Failed to generate career recommendations');
    }
  }

  /**
   * Calculate compatibility scores between student and all careers
   */
  private async calculateCareerCompatibility(
    studentProfile: StudentAssessmentProfile
  ): Promise<Array<{ careerCode: string; score: number; breakdown: any }>> {
    const compatibilityScores: Array<{ careerCode: string; score: number; breakdown: any }> = [];

    for (const [careerCode, career] of this.onetDatabase) {
      const breakdown = {
        interests: this.calculateInterestMatch(studentProfile.interestProfile, career.interests),
        abilities: this.calculateAbilityMatch(studentProfile.psychologicalProfile, career.abilities),
        workValues: this.calculateWorkValueMatch(studentProfile.valueProfile, career.workValues),
        workStyles: this.calculateWorkStyleMatch(studentProfile.personalityProfile, career.workStyles),
        knowledge: this.calculateKnowledgeMatch(studentProfile.academicProfile, career.knowledge),
        skills: this.calculateSkillMatch(studentProfile.skillProfile, career.skills)
      };

      // Weighted overall score
      const overallScore = (
        breakdown.interests * 0.25 +
        breakdown.abilities * 0.20 +
        breakdown.workValues * 0.15 +
        breakdown.workStyles * 0.15 +
        breakdown.knowledge * 0.15 +
        breakdown.skills * 0.10
      );

      compatibilityScores.push({
        careerCode,
        score: overallScore,
        breakdown
      });
    }

    return compatibilityScores.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate interest compatibility using RIASEC model
   */
  private calculateInterestMatch(studentInterests: InterestProfile, careerInterests: ONetInterests): number {
    const riasecKeys = ['realistic', 'investigative', 'artistic', 'social', 'enterprising', 'conventional'];
    let totalDifference = 0;

    for (const key of riasecKeys) {
      const studentScore = studentInterests.riasecScores[key as keyof typeof studentInterests.riasecScores];
      const careerScore = careerInterests[key as keyof ONetInterests];
      totalDifference += Math.abs(studentScore - careerScore);
    }

    // Convert difference to similarity score (0-100)
    const maxPossibleDifference = riasecKeys.length * 100;
    return Math.max(0, 100 - (totalDifference / maxPossibleDifference) * 100);
  }

  /**
   * Calculate ability match based on cognitive assessments
   */
  private calculateAbilityMatch(psychProfile: PsychologicalProfile, careerAbilities: ONetAbility[]): number {
    const abilityMappings = {
      'Oral Comprehension': psychProfile.cognitiveAbilities.verbalReasoning,
      'Written Comprehension': psychProfile.cognitiveAbilities.verbalReasoning,
      'Mathematical Reasoning': psychProfile.cognitiveAbilities.numericalReasoning,
      'Number Facility': psychProfile.cognitiveAbilities.numericalReasoning,
      'Spatial Orientation': psychProfile.cognitiveAbilities.spatialReasoning,
      'Visualization': psychProfile.cognitiveAbilities.spatialReasoning,
      'Deductive Reasoning': psychProfile.cognitiveAbilities.logicalReasoning,
      'Inductive Reasoning': psychProfile.cognitiveAbilities.logicalReasoning,
      'Memory': psychProfile.cognitiveAbilities.memoryCapacity,
      'Perceptual Speed': psychProfile.cognitiveAbilities.processingSpeed
    };

    let totalMatch = 0;
    let matchCount = 0;

    for (const ability of careerAbilities) {
      if (abilityMappings[ability.element]) {
        const studentLevel = abilityMappings[ability.element];
        const requiredLevel = ability.level * 20; // Convert 1-7 scale to 0-140, then normalize
        const importance = ability.importance;
        
        // Calculate match considering both level and importance
        const levelMatch = Math.max(0, 100 - Math.abs(studentLevel - requiredLevel));
        const weightedMatch = levelMatch * (importance / 5); // Weight by importance
        
        totalMatch += weightedMatch;
        matchCount += importance / 5;
      }
    }

    return matchCount > 0 ? totalMatch / matchCount : 50; // Default to neutral if no matches
  }

  /**
   * Calculate work value compatibility
   */
  private calculateWorkValueMatch(valueProfile: ValueProfile, careerWorkValues: ONetWorkValues): number {
    const valueMappings = {
      achievement: valueProfile.workValues.achievement,
      workingConditions: valueProfile.workValues.workingConditions,
      recognition: valueProfile.workValues.recognition,
      relationships: valueProfile.workValues.relationships,
      support: valueProfile.workValues.support,
      independence: valueProfile.workValues.independence
    };

    let totalMatch = 0;
    let count = 0;

    for (const [key, careerValue] of Object.entries(careerWorkValues)) {
      if (valueMappings[key as keyof typeof valueMappings]) {
        const studentValue = valueMappings[key as keyof typeof valueMappings];
        const match = Math.max(0, 100 - Math.abs(studentValue - careerValue));
        totalMatch += match;
        count++;
      }
    }

    return count > 0 ? totalMatch / count : 50;
  }

  /**
   * Calculate work style compatibility
   */
  private calculateWorkStyleMatch(personalityProfile: PersonalityProfile, careerWorkStyles: ONetWorkStyles): number {
    const styleMappings = {
      adaptability: personalityProfile.workStyles.adaptability,
      attention: personalityProfile.workStyles.attention,
      cooperation: personalityProfile.workStyles.teamwork,
      dependability: personalityProfile.personalityProfile?.conscientiousness || 50,
      initiative: personalityProfile.workStyles.leadership,
      leadership: personalityProfile.workStyles.leadership,
      persistence: personalityProfile.workStyles.persistence,
      socialOrientation: personalityProfile.personalityProfile?.extraversion || 50,
      stressManagement: personalityProfile.stressManagement
    };

    let totalMatch = 0;
    let count = 0;

    for (const [key, careerStyle] of Object.entries(careerWorkStyles)) {
      if (styleMappings[key as keyof typeof styleMappings]) {
        const studentStyle = styleMappings[key as keyof typeof styleMappings];
        const match = Math.max(0, 100 - Math.abs(studentStyle - careerStyle));
        totalMatch += match;
        count++;
      }
    }

    return count > 0 ? totalMatch / count : 50;
  }

  /**
   * Calculate knowledge area match
   */
  private calculateKnowledgeMatch(academicProfile: AcademicProfile, careerKnowledge: ONetKnowledge[]): number {
    const knowledgeMappings = {
      'Mathematics': academicProfile.subjectStrengths.includes('Mathematics') ? 80 : 40,
      'English Language': academicProfile.subjectStrengths.includes('English') ? 80 : 40,
      'Physics': academicProfile.subjectStrengths.includes('Physics') ? 80 : 40,
      'Chemistry': academicProfile.subjectStrengths.includes('Chemistry') ? 80 : 40,
      'Biology': academicProfile.subjectStrengths.includes('Biology') ? 80 : 40,
      'History and Archeology': academicProfile.subjectStrengths.includes('History') ? 80 : 40,
      'Geography': academicProfile.subjectStrengths.includes('Geography') ? 80 : 40
    };

    let totalMatch = 0;
    let totalImportance = 0;

    for (const knowledge of careerKnowledge) {
      const studentLevel = knowledgeMappings[knowledge.element] || academicProfile.overallGPA * 20;
      const requiredLevel = knowledge.level * 20; // Convert to 0-140 scale
      const importance = knowledge.importance;
      
      const levelMatch = Math.max(0, 100 - Math.abs(studentLevel - requiredLevel));
      totalMatch += levelMatch * importance;
      totalImportance += importance;
    }

    return totalImportance > 0 ? totalMatch / totalImportance : 50;
  }

  /**
   * Calculate skill match
   */
  private calculateSkillMatch(skillProfile: SkillProfile, careerSkills: ONetSkill[]): number {
    let totalMatch = 0;
    let totalImportance = 0;

    for (const skill of careerSkills) {
      const studentLevel = skillProfile.currentSkills[skill.element] || skillProfile.skillPotential[skill.element] || 50;
      const requiredLevel = skill.level * 20; // Convert to 0-140 scale
      const importance = skill.importance;
      
      const levelMatch = Math.max(0, 100 - Math.abs(studentLevel - requiredLevel));
      totalMatch += levelMatch * importance;
      totalImportance += importance;
    }

    return totalImportance > 0 ? totalMatch / totalImportance : 50;
  }

  /**
   * Select top career matches
   */
  private selectTopMatches(
    careerScores: Array<{ careerCode: string; score: number; breakdown: any }>,
    limit: number
  ): Array<{ careerCode: string; score: number; breakdown: any }> {
    return careerScores
      .filter(career => career.score >= 60) // Minimum threshold
      .slice(0, limit);
  }

  /**
   * Generate detailed career match information
   */
  private async generateDetailedMatches(
    topMatches: Array<{ careerCode: string; score: number; breakdown: any }>,
    studentProfile: StudentAssessmentProfile
  ): Promise<CareerMatch[]> {
    const detailedMatches: CareerMatch[] = [];

    for (const match of topMatches) {
      const career = this.onetDatabase.get(match.careerCode);
      if (!career) continue;

      const careerMatch: CareerMatch = {
        onetCode: career.code,
        title: career.title,
        overallMatch: Math.round(match.score),
        matchBreakdown: {
          interests: Math.round(match.breakdown.interests),
          abilities: Math.round(match.breakdown.abilities),
          workValues: Math.round(match.breakdown.workValues),
          workStyles: Math.round(match.breakdown.workStyles),
          knowledge: Math.round(match.breakdown.knowledge),
          skills: Math.round(match.breakdown.skills)
        },
        confidence: this.calculateConfidence(match.score, match.breakdown),
        reasoning: this.generateMatchReasoning(match.breakdown, career),
        educationPath: {
          minimumEducation: career.education.level,
          recommendedEducation: career.education.description,
          alternativePaths: career.education.examples,
          keySubjects: this.identifyKeySubjects(career),
          certifications: this.identifyCertifications(career),
          timeline: this.estimateEducationTimeline(career.education.level)
        },
        salaryRange: {
          entry: career.wages.entry,
          median: career.wages.median,
          experienced: career.wages.experienced,
          currency: career.wages.currency,
          region: career.wages.region,
          lastUpdated: career.wages.lastUpdated
        },
        jobOutlook: {
          growthRate: career.outlook.growthRate,
          outlook: career.outlook.outlook,
          factors: career.outlook.factors,
          timeframe: '2023-2033',
          region: 'India'
        },
        relatedCareers: career.relatedCareers
      };

      detailedMatches.push(careerMatch);
    }

    return detailedMatches;
  }

  /**
   * Calculate similarity scores with successful professionals
   */
  private async calculateSimilarityScores(studentProfile: StudentAssessmentProfile): Promise<SimilarityScore[]> {
    // This would integrate with a database of successful professional profiles
    // For now, return sample similarity scores
    return [
      {
        comparisonType: 'successful_professional',
        comparisonId: 'engineer_profile_001',
        similarityScore: 85,
        commonTraits: ['High logical reasoning', 'Strong mathematical skills', 'Detail-oriented'],
        differentiatingFactors: ['Lower social orientation', 'Higher technical focus'],
        implications: ['Strong potential for engineering careers', 'May need to develop communication skills']
      }
    ];
  }

  /**
   * Identify potential career concerns
   */
  private async identifyCareerConcerns(
    careerMatches: CareerMatch[],
    studentProfile: StudentAssessmentProfile
  ): Promise<CareerConcern[]> {
    const concerns: CareerConcern[] = [];

    // Check for unrealistic expectations
    const highSalaryExpectations = careerMatches.filter(career => career.salaryRange.median > 1000000); // 10 lakhs
    if (highSalaryExpectations.length > 0 && studentProfile.academicProfile.overallGPA < 3.5) {
      concerns.push({
        type: 'unrealistic_expectation',
        severity: 'moderate',
        description: 'High salary expectations may not align with current academic performance',
        recommendations: ['Focus on improving academic performance', 'Consider skill development programs'],
        timelineToAddress: '6-12 months'
      });
    }

    // Check for skill gaps
    for (const career of careerMatches.slice(0, 5)) { // Check top 5 matches
      const skillGaps = this.identifySkillGaps(career, studentProfile);
      if (skillGaps.length > 0) {
        concerns.push({
          type: 'skill_gap',
          severity: 'moderate',
          description: `Skill gaps identified for ${career.title}: ${skillGaps.join(', ')}`,
          recommendations: [`Develop skills in ${skillGaps.join(', ')}`, 'Consider relevant courses or certifications'],
          timelineToAddress: '3-6 months'
        });
      }
    }

    return concerns;
  }

  /**
   * Generate career guidance recommendations
   */
  private async generateGuidanceRecommendations(
    careerMatches: CareerMatch[],
    concerns: CareerConcern[],
    studentProfile: StudentAssessmentProfile
  ): Promise<CareerGuidanceRecommendation[]> {
    const recommendations: CareerGuidanceRecommendation[] = [];

    // Academic recommendations
    if (studentProfile.academicProfile.overallGPA < 3.5) {
      recommendations.push({
        category: 'education',
        priority: 'high',
        action: 'Improve academic performance to increase career options',
        timeline: '6-12 months',
        resources: ['Tutoring services', 'Study skills workshops', 'Academic counseling'],
        successMetrics: ['GPA improvement to 3.5+', 'Consistent grade improvement']
      });
    }

    // Skill development recommendations
    const topCareer = careerMatches[0];
    if (topCareer) {
      const skillGaps = this.identifySkillGaps(topCareer, studentProfile);
      if (skillGaps.length > 0) {
        recommendations.push({
          category: 'skill_development',
          priority: 'high',
          action: `Develop key skills for ${topCareer.title}`,
          timeline: '3-6 months',
          resources: ['Online courses', 'Certification programs', 'Practical projects'],
          successMetrics: [`Proficiency in ${skillGaps.join(', ')}`, 'Portfolio development']
        });
      }
    }

    // Experience recommendations
    recommendations.push({
      category: 'experience',
      priority: 'medium',
      action: 'Gain relevant experience through internships or projects',
      timeline: '6-12 months',
      resources: ['Internship programs', 'Volunteer opportunities', 'Project-based learning'],
      successMetrics: ['Completed internship', 'Relevant project portfolio']
    });

    return recommendations;
  }

  // ==================== HELPER METHODS ====================

  private createStudentCareerProfile(studentProfile: StudentAssessmentProfile): any {
    return {
      academicStrengths: studentProfile.academicProfile.subjectStrengths,
      academicWeaknesses: studentProfile.academicProfile.subjectWeaknesses,
      interests: Object.keys(studentProfile.interestProfile.riasecScores),
      values: Object.keys(studentProfile.valueProfile.workValues),
      personalityTraits: Object.keys(studentProfile.psychologicalProfile.personalityTraits),
      skills: Object.keys(studentProfile.skillProfile.currentSkills),
      workStyles: Object.keys(studentProfile.personalityProfile.workStyles),
      preferredEnvironments: ['collaborative', 'structured'], // This would be derived from assessments
      careerReadiness: this.calculateCareerReadiness(studentProfile)
    };
  }

  private calculateConfidence(score: number, breakdown: any): number {
    // Calculate confidence based on score consistency across dimensions
    const scores = Object.values(breakdown) as number[];
    const variance = this.calculateVariance(scores);
    const baseConfidence = Math.min(100, score);
    const consistencyBonus = Math.max(0, 20 - variance / 5);
    return Math.round(Math.min(100, baseConfidence + consistencyBonus));
  }

  private calculateVariance(scores: number[]): number {
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
  }

  private generateMatchReasoning(breakdown: any, career: ONetCareer): string[] {
    const reasoning: string[] = [];
    
    if (breakdown.interests > 80) {
      reasoning.push(`Strong interest alignment with ${career.title} requirements`);
    }
    if (breakdown.abilities > 80) {
      reasoning.push('Cognitive abilities well-suited for this career path');
    }
    if (breakdown.workValues > 80) {
      reasoning.push('Work values align with career environment and culture');
    }
    if (breakdown.skills > 70) {
      reasoning.push('Current skills provide good foundation for career development');
    }

    return reasoning;
  }

  private identifyKeySubjects(career: ONetCareer): string[] {
    const keySubjects: string[] = [];
    
    for (const knowledge of career.knowledge) {
      if (knowledge.importance >= 4) { // High importance
        switch (knowledge.element) {
          case 'Mathematics':
            keySubjects.push('Mathematics', 'Statistics');
            break;
          case 'Physics':
            keySubjects.push('Physics', 'Applied Physics');
            break;
          case 'Chemistry':
            keySubjects.push('Chemistry', 'Biochemistry');
            break;
          case 'Biology':
            keySubjects.push('Biology', 'Life Sciences');
            break;
          case 'English Language':
            keySubjects.push('English', 'Communication');
            break;
        }
      }
    }
    
    return [...new Set(keySubjects)]; // Remove duplicates
  }

  private identifyCertifications(career: ONetCareer): string[] {
    // This would be populated from a database of relevant certifications
    const certifications: string[] = [];
    
    if (career.title.toLowerCase().includes('engineer')) {
      certifications.push('Professional Engineer (PE)', 'Engineering Fundamentals (FE)');
    }
    if (career.title.toLowerCase().includes('data')) {
      certifications.push('Data Science Certification', 'Machine Learning Certification');
    }
    if (career.title.toLowerCase().includes('software')) {
      certifications.push('Software Development Certification', 'Cloud Computing Certification');
    }
    
    return certifications;
  }

  private estimateEducationTimeline(educationLevel: string): string {
    const timelines = {
      'High school diploma': '12 years',
      'Associate degree': '14 years',
      'Bachelor\'s degree': '16 years',
      'Master\'s degree': '18 years',
      'Doctoral degree': '22+ years',
      'Professional degree': '19-22 years'
    };
    
    return timelines[educationLevel] || '16 years';
  }

  private identifySkillGaps(career: CareerMatch, studentProfile: StudentAssessmentProfile): string[] {
    const skillGaps: string[] = [];
    const career_data = this.onetDatabase.get(career.onetCode);
    
    if (career_data) {
      for (const skill of career_data.skills) {
        const requiredLevel = skill.level * 20; // Convert to 0-140 scale
        const studentLevel = studentProfile.skillProfile.currentSkills[skill.element] || 0;
        
        if (skill.importance >= 4 && studentLevel < requiredLevel - 20) { // 20 point gap threshold
          skillGaps.push(skill.element);
        }
      }
    }
    
    return skillGaps;
  }

  private calculateCareerReadiness(studentProfile: StudentAssessmentProfile): number {
    const factors = [
      studentProfile.academicProfile.overallGPA * 20, // 0-80 scale
      studentProfile.academicProfile.academicMotivation,
      studentProfile.psychologicalProfile.emotionalIntelligence.selfAwareness,
      studentProfile.skillProfile.learningAgility,
      studentProfile.skillProfile.adaptability
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  /**
   * Initialize O*NET database with sample career data
   * In production, this would load from actual O*NET database
   */
  private initializeONetDatabase(): void {
    // Sample careers for demonstration
    const sampleCareers: ONetCareer[] = [
      {
        code: '15-1132.00',
        title: 'Software Developer',
        description: 'Develop and maintain software applications',
        tasks: ['Design software systems', 'Write code', 'Test applications'],
        knowledge: [
          { element: 'Mathematics', description: 'Mathematical concepts', level: 5, importance: 4 },
          { element: 'English Language', description: 'Communication skills', level: 4, importance: 3 }
        ],
        skills: [
          { element: 'Programming', description: 'Software programming', level: 6, importance: 5 },
          { element: 'Critical Thinking', description: 'Problem solving', level: 5, importance: 4 }
        ],
        abilities: [
          { element: 'Deductive Reasoning', description: 'Logical reasoning', level: 5, importance: 4 },
          { element: 'Mathematical Reasoning', description: 'Math problem solving', level: 4, importance: 3 }
        ],
        workActivities: [
          { element: 'Working with Computers', description: 'Computer interaction', level: 6, importance: 5 }
        ],
        workContext: [
          { element: 'Electronic Mail', description: 'Email usage', category: 'Communication', value: 5 }
        ],
        interests: { realistic: 30, investigative: 80, artistic: 40, social: 20, enterprising: 30, conventional: 50 },
        workValues: { achievement: 80, workingConditions: 70, recognition: 60, relationships: 40, support: 50, independence: 80 },
        workStyles: { adaptability: 70, attention: 80, cooperation: 60, dependability: 80, initiative: 70, integrity: 80, leadership: 50, persistence: 80, socialOrientation: 40, stressManagement: 60 },
        education: { level: 'Bachelor\'s degree', description: 'Computer Science or related field', examples: ['Computer Science', 'Software Engineering'] },
        experience: { level: 'None', description: 'No prior experience required', examples: [] },
        jobTraining: { level: 'Moderate-term', description: '1-12 months training', examples: ['On-the-job training'] },
        outlook: { growthRate: 22, outlook: 'Much faster than average', description: 'High demand for software developers', factors: ['Digital transformation', 'Mobile applications'] },
        wages: { median: 800000, entry: 400000, experienced: 1500000, currency: 'INR', region: 'India', lastUpdated: new Date() },
        relatedCareers: ['15-1133.00', '15-1134.00']
      }
      // Add more sample careers here
    ];

    for (const career of sampleCareers) {
      this.onetDatabase.set(career.code, career);
    }
  }
}

export default AICareerMatcher;
