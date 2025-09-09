// AI-Powered Student Stress Analysis Engine
// Based on research from Kaggle notebook: AI-Powered Student Stress Detection
// Implements the 5-domain stress assessment model with ML predictions

export interface StressAssessmentData {
  // 🧠 Psychological Factors
  anxiety_level: number; // 0-21 scale
  self_esteem: number; // 0-30 scale (reverse scored)
  mental_health_history: number; // 0-1 binary
  depression: number; // 0-27 scale
  
  // 🏥 Physiological Factors
  headache: number; // 0-5 scale
  blood_pressure: number; // 0-5 scale
  sleep_quality: number; // 0-5 scale (reverse scored)
  breathing_problem: number; // 0-5 scale
  
  // 🌆 Environmental Factors
  noise_level: number; // 0-5 scale
  living_conditions: number; // 0-5 scale
  safety: number; // 0-5 scale
  basic_needs: number; // 0-5 scale
  
  // 🎓 Academic Factors
  academic_performance: number; // 0-5 scale
  study_load: number; // 0-5 scale
  teacher_student_relationship: number; // 0-5 scale
  future_career_concerns: number; // 0-5 scale
  
  // 🤝 Social Factors
  social_support: number; // 0-5 scale (reverse scored)
  peer_pressure: number; // 0-5 scale
  extracurricular_activities: number; // 0-5 scale
  bullying: number; // 0-5 scale
}

export interface StressPredictionResult {
  stress_level: 0 | 1 | 2; // 0=No Stress, 1=Eustress, 2=Distress
  confidence: number; // 0-1 confidence score
  composite_scores: {
    psych_score: number;
    phys_score: number;
    env_score: number;
    acad_score: number;
    social_score: number;
  };
  top_predictors: {
    feature: string;
    importance: number;
    impact: 'positive' | 'negative';
  }[];
  recommendations: string[];
  risk_factors: string[];
  protective_factors: string[];
}

export interface StressInterventionPlan {
  immediate_actions: string[];
  short_term_goals: string[];
  long_term_strategies: string[];
  resources: string[];
  monitoring_plan: string[];
  professional_referral: boolean;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
}

export class StressAnalysisEngine {
  // Feature importance weights based on SHAP analysis from the research
  private static readonly FEATURE_WEIGHTS = {
    // Top predictors from research
    blood_pressure: 0.15,
    social_score: 0.14,
    self_esteem: 0.13,
    psych_score: 0.12,
    academic_performance: 0.11,
    
    // Secondary predictors
    anxiety_level: 0.10,
    depression: 0.09,
    bullying: 0.08,
    future_career_concerns: 0.07,
    peer_pressure: 0.06,
    
    // Other factors
    headache: 0.05,
    sleep_quality: 0.05,
    breathing_problem: 0.04,
    noise_level: 0.03,
    living_conditions: 0.03,
    safety: 0.03,
    basic_needs: 0.03,
    study_load: 0.03,
    teacher_student_relationship: 0.03,
    social_support: 0.03,
    extracurricular_activities: 0.02,
    mental_health_history: 0.02
  };

  // Calculate composite domain scores
  static calculateCompositeScores(data: StressAssessmentData) {
    // Reverse score protective factors (higher = better, so we reverse for stress calculation)
    const self_esteem_rev = 30 - data.self_esteem; // Max 30 - current value
    const social_support_rev = 5 - data.social_support; // Max 5 - current value
    const sleep_quality_rev = 5 - data.sleep_quality; // Max 5 - current value

    return {
      psych_score: (data.anxiety_level + data.depression + self_esteem_rev + data.mental_health_history) / 4,
      phys_score: (data.headache + data.blood_pressure + sleep_quality_rev + data.breathing_problem) / 4,
      env_score: (data.noise_level + data.living_conditions + data.safety + data.basic_needs) / 4,
      acad_score: (data.academic_performance + data.study_load + data.teacher_student_relationship + data.future_career_concerns) / 4,
      social_score: (data.bullying + data.peer_pressure + data.extracurricular_activities + social_support_rev) / 4
    };
  }

  // Predict stress level using weighted scoring
  static predictStressLevel(data: StressAssessmentData): StressPredictionResult {
    const composite_scores = this.calculateCompositeScores(data);
    
    // Calculate weighted stress score
    let total_stress_score = 0;
    let total_weight = 0;
    
    // Add individual feature contributions
    Object.entries(data).forEach(([key, value]) => {
      const weight = this.FEATURE_WEIGHTS[key as keyof typeof this.FEATURE_WEIGHTS] || 0.01;
      
      // Normalize values to 0-1 scale for consistent weighting
      let normalized_value = value;
      if (key === 'anxiety_level') normalized_value = value / 21;
      else if (key === 'self_esteem') normalized_value = (30 - value) / 30; // Reverse score
      else if (key === 'depression') normalized_value = value / 27;
      else if (key === 'mental_health_history') normalized_value = value; // Already 0-1
      else normalized_value = value / 5; // Most features are 0-5 scale
      
      total_stress_score += normalized_value * weight;
      total_weight += weight;
    });
    
    // Add composite score contributions
    Object.entries(composite_scores).forEach(([key, value]) => {
      const weight = this.FEATURE_WEIGHTS[`${key}` as keyof typeof this.FEATURE_WEIGHTS] || 0.01;
      total_stress_score += (value / 5) * weight; // Normalize to 0-1
      total_weight += weight;
    });
    
    const final_stress_score = total_stress_score / total_weight;
    
    // Determine stress level based on thresholds
    let stress_level: 0 | 1 | 2;
    let confidence: number;
    
    if (final_stress_score < 0.3) {
      stress_level = 0; // No Stress
      confidence = 1 - final_stress_score;
    } else if (final_stress_score < 0.7) {
      stress_level = 1; // Eustress
      confidence = 1 - Math.abs(final_stress_score - 0.5);
    } else {
      stress_level = 2; // Distress
      confidence = final_stress_score;
    }
    
    // Get top predictors
    const top_predictors = this.getTopPredictors(data, composite_scores);
    
    // Generate recommendations and risk factors
    const recommendations = this.generateRecommendations(stress_level, data, composite_scores);
    const risk_factors = this.identifyRiskFactors(data, composite_scores);
    const protective_factors = this.identifyProtectiveFactors(data, composite_scores);
    
    return {
      stress_level,
      confidence: Math.min(Math.max(confidence, 0.5), 0.95), // Clamp between 0.5-0.95
      composite_scores,
      top_predictors,
      recommendations,
      risk_factors,
      protective_factors
    };
  }

  // Get top predictive features
  private static getTopPredictors(data: StressAssessmentData, composite_scores: any) {
    const predictors: { feature: string; importance: number; impact: 'positive' | 'negative' }[] = [];
    
    // Add individual features
    Object.entries(data).forEach(([key, value]) => {
      const weight = this.FEATURE_WEIGHTS[key as keyof typeof this.FEATURE_WEIGHTS] || 0.01;
      let normalized_value = value;
      
      // Normalize and determine impact
      if (key === 'anxiety_level') normalized_value = value / 21;
      else if (key === 'self_esteem') normalized_value = (30 - value) / 30;
      else if (key === 'depression') normalized_value = value / 27;
      else if (key === 'mental_health_history') normalized_value = value;
      else normalized_value = value / 5;
      
      predictors.push({
        feature: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        importance: normalized_value * weight,
        impact: this.getFeatureImpact(key, value)
      });
    });
    
    // Add composite scores
    Object.entries(composite_scores).forEach(([key, value]) => {
      const weight = this.FEATURE_WEIGHTS[`${key}` as keyof typeof this.FEATURE_WEIGHTS] || 0.01;
      predictors.push({
        feature: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        importance: (value / 5) * weight,
        impact: 'positive' // Higher composite scores indicate higher stress
      });
    });
    
    return predictors
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 10);
  }

  // Determine if a feature has positive or negative impact on stress
  private static getFeatureImpact(feature: string, value: number): 'positive' | 'negative' {
    const protective_factors = ['self_esteem', 'sleep_quality', 'social_support', 'academic_performance', 'teacher_student_relationship', 'extracurricular_activities'];
    
    if (protective_factors.includes(feature)) {
      return 'negative'; // Higher values reduce stress
    }
    return 'positive'; // Higher values increase stress
  }

  // Generate personalized recommendations
  private static generateRecommendations(stress_level: 0 | 1 | 2, data: StressAssessmentData, composite_scores: any): string[] {
    const recommendations: string[] = [];
    
    // Stress level specific recommendations
    if (stress_level === 0) {
      recommendations.push("Maintain your current healthy lifestyle and stress management practices.");
      recommendations.push("Continue engaging in activities that promote well-being.");
    } else if (stress_level === 1) {
      recommendations.push("Consider implementing stress management techniques like mindfulness or meditation.");
      recommendations.push("Ensure you're getting adequate sleep and maintaining a balanced diet.");
    } else {
      recommendations.push("Seek professional help from a counselor or mental health professional.");
      recommendations.push("Implement immediate stress reduction strategies like deep breathing exercises.");
      recommendations.push("Consider reducing academic or social commitments temporarily.");
    }
    
    // Domain-specific recommendations
    if (composite_scores.psych_score > 3) {
      recommendations.push("Focus on building self-esteem through positive self-talk and achievement recognition.");
      recommendations.push("Consider therapy or counseling to address anxiety and depression concerns.");
    }
    
    if (composite_scores.phys_score > 3) {
      recommendations.push("Prioritize sleep hygiene and establish a consistent sleep schedule.");
      recommendations.push("Consider consulting a healthcare provider about physical symptoms.");
    }
    
    if (composite_scores.acad_score > 3) {
      recommendations.push("Develop better time management and study strategies.");
      recommendations.push("Communicate with teachers about academic concerns and seek support.");
    }
    
    if (composite_scores.social_score > 3) {
      recommendations.push("Build a stronger support network and reduce exposure to negative social influences.");
      recommendations.push("Engage in positive extracurricular activities that align with your interests.");
    }
    
    if (composite_scores.env_score > 3) {
      recommendations.push("Improve your living environment by reducing noise and ensuring safety.");
      recommendations.push("Address basic needs and create a more supportive home environment.");
    }
    
    return recommendations.slice(0, 8); // Limit to top 8 recommendations
  }

  // Identify risk factors
  private static identifyRiskFactors(data: StressAssessmentData, composite_scores: any): string[] {
    const risk_factors: string[] = [];
    
    if (data.anxiety_level > 15) risk_factors.push("High anxiety levels");
    if (data.depression > 20) risk_factors.push("Elevated depression symptoms");
    if (data.self_esteem < 10) risk_factors.push("Low self-esteem");
    if (data.mental_health_history === 1) risk_factors.push("Previous mental health history");
    if (data.blood_pressure > 4) risk_factors.push("High blood pressure indicators");
    if (data.sleep_quality < 2) risk_factors.push("Poor sleep quality");
    if (data.bullying > 3) risk_factors.push("Experiencing bullying");
    if (data.future_career_concerns > 4) risk_factors.push("High career anxiety");
    if (data.social_support < 2) risk_factors.push("Limited social support");
    if (data.academic_performance < 2) risk_factors.push("Academic performance concerns");
    
    return risk_factors;
  }

  // Identify protective factors
  private static identifyProtectiveFactors(data: StressAssessmentData, composite_scores: any): string[] {
    const protective_factors: string[] = [];
    
    if (data.self_esteem > 20) protective_factors.push("Strong self-esteem");
    if (data.sleep_quality > 3) protective_factors.push("Good sleep quality");
    if (data.social_support > 3) protective_factors.push("Strong social support network");
    if (data.academic_performance > 3) protective_factors.push("Good academic performance");
    if (data.teacher_student_relationship > 3) protective_factors.push("Positive teacher relationships");
    if (data.extracurricular_activities > 3) protective_factors.push("Active in extracurricular activities");
    if (data.safety > 3) protective_factors.push("Safe living environment");
    if (data.basic_needs > 3) protective_factors.push("Basic needs met");
    if (data.living_conditions > 3) protective_factors.push("Good living conditions");
    if (data.anxiety_level < 10) protective_factors.push("Low anxiety levels");
    
    return protective_factors;
  }

  // Generate intervention plan
  static generateInterventionPlan(prediction: StressPredictionResult): StressInterventionPlan {
    const { stress_level, risk_factors, protective_factors } = prediction;
    
    let urgency_level: 'low' | 'medium' | 'high' | 'critical';
    let professional_referral = false;
    
    // Determine urgency and need for professional referral
    if (stress_level === 2 || risk_factors.length > 5) {
      urgency_level = 'critical';
      professional_referral = true;
    } else if (stress_level === 1 || risk_factors.length > 3) {
      urgency_level = 'high';
      professional_referral = true;
    } else if (risk_factors.length > 1) {
      urgency_level = 'medium';
    } else {
      urgency_level = 'low';
    }
    
    // Generate intervention strategies
    const immediate_actions = this.getImmediateActions(stress_level, risk_factors);
    const short_term_goals = this.getShortTermGoals(stress_level, risk_factors);
    const long_term_strategies = this.getLongTermStrategies(stress_level, protective_factors);
    const resources = this.getResources(stress_level, professional_referral);
    const monitoring_plan = this.getMonitoringPlan(stress_level);
    
    return {
      immediate_actions,
      short_term_goals,
      long_term_strategies,
      resources,
      monitoring_plan,
      professional_referral,
      urgency_level
    };
  }

  private static getImmediateActions(stress_level: 0 | 1 | 2, risk_factors: string[]): string[] {
    const actions: string[] = [];
    
    if (stress_level >= 1) {
      actions.push("Practice deep breathing exercises for 5-10 minutes");
      actions.push("Take a short walk or engage in light physical activity");
      actions.push("Listen to calming music or nature sounds");
    }
    
    if (stress_level === 2) {
      actions.push("Contact a trusted friend or family member");
      actions.push("Remove yourself from stressful situations temporarily");
      actions.push("Use grounding techniques (5-4-3-2-1 method)");
    }
    
    if (risk_factors.includes("Poor sleep quality")) {
      actions.push("Establish a bedtime routine and avoid screens 1 hour before bed");
    }
    
    if (risk_factors.includes("High anxiety levels")) {
      actions.push("Practice progressive muscle relaxation");
    }
    
    return actions;
  }

  private static getShortTermGoals(stress_level: 0 | 1 | 2, risk_factors: string[]): string[] {
    const goals: string[] = [];
    
    if (stress_level >= 1) {
      goals.push("Establish a consistent daily routine");
      goals.push("Practice stress management techniques daily");
      goals.push("Improve sleep hygiene");
    }
    
    if (risk_factors.includes("Limited social support")) {
      goals.push("Connect with at least one supportive person each day");
    }
    
    if (risk_factors.includes("Academic performance concerns")) {
      goals.push("Meet with academic advisor or counselor");
      goals.push("Develop better study strategies");
    }
    
    if (risk_factors.includes("Experiencing bullying")) {
      goals.push("Report bullying incidents to appropriate authorities");
      goals.push("Build confidence and assertiveness skills");
    }
    
    return goals;
  }

  private static getLongTermStrategies(stress_level: 0 | 1 | 2, protective_factors: string[]): string[] {
    const strategies: string[] = [];
    
    strategies.push("Develop resilience and coping skills");
    strategies.push("Build and maintain strong social connections");
    strategies.push("Engage in regular physical exercise");
    strategies.push("Practice mindfulness and meditation");
    
    if (stress_level >= 1) {
      strategies.push("Consider ongoing therapy or counseling");
      strategies.push("Develop stress management toolkit");
    }
    
    if (protective_factors.includes("Active in extracurricular activities")) {
      strategies.push("Continue and expand extracurricular involvement");
    }
    
    return strategies;
  }

  private static getResources(stress_level: 0 | 1 | 2, professional_referral: boolean): string[] {
    const resources: string[] = [
      "Crisis Text Line: Text HOME to 741741",
      "National Suicide Prevention Lifeline: 988",
      "Headspace or Calm meditation apps",
      "Student counseling center resources"
    ];
    
    if (professional_referral) {
      resources.push("Mental health professional referral");
      resources.push("Campus counseling services");
      resources.push("Local mental health clinics");
    }
    
    if (stress_level >= 1) {
      resources.push("Stress management workshops");
      resources.push("Peer support groups");
    }
    
    return resources;
  }

  private static getMonitoringPlan(stress_level: 0 | 1 | 2): string[] {
    const plan: string[] = [];
    
    if (stress_level === 0) {
      plan.push("Monthly self-assessment check-ins");
      plan.push("Monitor for early warning signs");
    } else if (stress_level === 1) {
      plan.push("Weekly stress level tracking");
      plan.push("Monitor sleep and mood patterns");
      plan.push("Regular check-ins with support person");
    } else {
      plan.push("Daily mood and stress tracking");
      plan.push("Weekly professional check-ins");
      plan.push("Monitor for crisis warning signs");
      plan.push("Emergency contact plan");
    }
    
    return plan;
  }
}

// Export utility functions
export const predictStressLevel = StressAnalysisEngine.predictStressLevel;
export const generateInterventionPlan = StressAnalysisEngine.generateInterventionPlan;
export const calculateCompositeScores = StressAnalysisEngine.calculateCompositeScores;
