import * as tf from '@tensorflow/tfjs';

// Initialize TensorFlow.js
export const initializeTensorFlow = async () => {
  // Set backend to webgl for better performance in browser
  await tf.setBackend('webgl');
  await tf.ready();
  console.log('TensorFlow.js initialized with backend:', tf.getBackend());
};

// Academic Performance Prediction Model
export class AcademicPerformancePredictor {
  private model: tf.LayersModel | null = null;
  private scaler: { mean: number[]; std: number[] } | null = null;

  async loadModel() {
    try {
      // Load pre-trained model (in production, this would be from your server)
      this.model = await tf.loadLayersModel('/models/academic-performance/model.json');
      
      // Load scaler parameters
      const scalerResponse = await fetch('/models/academic-performance/scaler.json');
      this.scaler = await scalerResponse.json();
      
      console.log('Academic performance model loaded successfully');
    } catch (error) {
      console.error('Failed to load academic performance model:', error);
      // Create a simple model for demo purposes
      this.createDemoModel();
    }
  }

  private createDemoModel() {
    // Create a simple neural network for demonstration
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    this.model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    // Demo scaler
    this.scaler = {
      mean: [3.5, 5, 2, 3, 4, 7, 3, 2, 4, 6],
      std: [1.2, 2, 1, 1.5, 1, 2, 1, 1, 1.5, 2]
    };
  }

  normalizeFeatures(features: number[]): number[] {
    if (!this.scaler) return features;
    
    return features.map((feature, index) => 
      (feature - this.scaler!.mean[index]) / this.scaler!.std[index]
    );
  }

  async predict(assessmentData: any): Promise<{
    academicScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
    confidence: number;
  }> {
    if (!this.model) {
      await this.loadModel();
    }

    // Extract features from assessment data
    const features = this.extractFeatures(assessmentData);
    const normalizedFeatures = this.normalizeFeatures(features);

    // Make prediction
    const prediction = this.model!.predict(tf.tensor2d([normalizedFeatures])) as tf.Tensor;
    const score = await prediction.data();
    const academicScore = score[0] * 100; // Convert to percentage

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high';
    if (academicScore >= 75) riskLevel = 'low';
    else if (academicScore >= 50) riskLevel = 'medium';
    else riskLevel = 'high';

    // Generate recommendations
    const recommendations = this.generateRecommendations(assessmentData, academicScore);

    // Calculate confidence (simplified)
    const confidence = Math.min(0.95, Math.max(0.6, academicScore / 100));

    // Clean up tensors
    prediction.dispose();

    return {
      academicScore: Math.round(academicScore),
      riskLevel,
      recommendations,
      confidence
    };
  }

  private extractFeatures(assessmentData: any): number[] {
    const academic = assessmentData.academicPerformance || {};
    const psychological = assessmentData.psychologicalWellbeing || {};
    const physical = assessmentData.physicalHealth || {};

    return [
      this.gradeToNumber(academic.overallGrade) || 3,
      academic.studyHoursPerDay || 2,
      academic.homeworkCompletion || 80,
      academic.classParticipation || 3,
      5 - (academic.testAnxiety || 3), // Invert anxiety (lower is better)
      psychological.moodRating || 7,
      10 - (psychological.stressLevel || 5), // Invert stress
      psychological.selfConfidence || 3,
      psychological.motivationLevel || 3,
      physical.exerciseFrequency || 3
    ];
  }

  private gradeToNumber(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'A+': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0
    };
    return gradeMap[grade] || 3;
  }

  private generateRecommendations(assessmentData: any, score: number): string[] {
    const recommendations: string[] = [];
    const academic = assessmentData.academicPerformance || {};
    const psychological = assessmentData.psychologicalWellbeing || {};
    const physical = assessmentData.physicalHealth || {};

    if (score < 60) {
      recommendations.push('Consider additional tutoring or academic support');
      recommendations.push('Develop a structured study schedule');
    }

    if (academic.testAnxiety > 3) {
      recommendations.push('Practice relaxation techniques before exams');
      recommendations.push('Consider test-taking strategies training');
    }

    if (psychological.stressLevel > 7) {
      recommendations.push('Implement stress management techniques');
      recommendations.push('Consider counseling support if stress persists');
    }

    if (physical.exerciseFrequency < 3) {
      recommendations.push('Increase physical activity to improve cognitive function');
      recommendations.push('Join sports or physical activities for better health');
    }

    if (academic.studyHoursPerDay < 2) {
      recommendations.push('Increase daily study time gradually');
      recommendations.push('Create a dedicated study environment');
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }
}

// Career Path Recommendation Model
export class CareerPathPredictor {
  private model: tf.LayersModel | null = null;
  private careerLabels: string[] = [
    'Technology', 'Healthcare', 'Education', 'Business', 'Arts',
    'Engineering', 'Science', 'Sports', 'Media', 'Law'
  ];

  async loadModel() {
    try {
      this.model = await tf.loadLayersModel('/models/career-prediction/model.json');
      console.log('Career prediction model loaded successfully');
    } catch (error) {
      console.error('Failed to load career prediction model:', error);
      this.createDemoModel();
    }
  }

  private createDemoModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [15], units: 128, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: this.careerLabels.length, activation: 'softmax' })
      ]
    });

    this.model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async predictCareerPath(assessmentData: any): Promise<{
    topCareers: Array<{ career: string; probability: number; match: string }>;
    reasoning: string[];
  }> {
    if (!this.model) {
      await this.loadModel();
    }

    const features = this.extractCareerFeatures(assessmentData);
    const prediction = this.model!.predict(tf.tensor2d([features])) as tf.Tensor;
    const probabilities = await prediction.data();

    // Get top 3 career predictions
    const careerScores = Array.from(probabilities).map((prob, index) => ({
      career: this.careerLabels[index],
      probability: prob,
      match: this.getMatchLevel(prob)
    }));

    careerScores.sort((a, b) => b.probability - a.probability);
    const topCareers = careerScores.slice(0, 3);

    // Generate reasoning
    const reasoning = this.generateCareerReasoning(assessmentData, topCareers);

    prediction.dispose();

    return { topCareers, reasoning };
  }

  private extractCareerFeatures(assessmentData: any): number[] {
    const academic = assessmentData.academicPerformance || {};
    const psychological = assessmentData.psychologicalWellbeing || {};
    const career = assessmentData.careerInterests || {};

    // Create feature vector based on interests and performance
    const features = new Array(15).fill(0);
    
    // Academic performance features
    features[0] = this.gradeToNumber(academic.overallGrade) / 5;
    features[1] = (academic.studyHoursPerDay || 2) / 10;
    features[2] = (academic.classParticipation || 3) / 5;
    
    // Psychological features
    features[3] = (psychological.selfConfidence || 3) / 5;
    features[4] = (psychological.motivationLevel || 3) / 5;
    features[5] = (psychological.socialInteraction || 3) / 5;
    
    // Interest-based features (simplified mapping)
    const interests = career.interestedFields || [];
    interests.forEach((interest: string) => {
      const index = this.careerLabels.indexOf(interest);
      if (index !== -1 && index + 6 < features.length) {
        features[index + 6] = 1;
      }
    });

    return features;
  }

  private gradeToNumber(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'A+': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0
    };
    return gradeMap[grade] || 3;
  }

  private getMatchLevel(probability: number): string {
    if (probability > 0.7) return 'Excellent Match';
    if (probability > 0.5) return 'Good Match';
    if (probability > 0.3) return 'Moderate Match';
    return 'Low Match';
  }

  private generateCareerReasoning(assessmentData: any, topCareers: any[]): string[] {
    const reasoning: string[] = [];
    const academic = assessmentData.academicPerformance || {};
    const career = assessmentData.careerInterests || {};

    reasoning.push(`Based on your academic performance (${academic.overallGrade || 'B'}) and interests`);
    
    if (career.interestedFields?.length > 0) {
      reasoning.push(`Your expressed interests in ${career.interestedFields.join(', ')} align with these career paths`);
    }

    reasoning.push(`Your top career match is ${topCareers[0]?.career} with ${Math.round(topCareers[0]?.probability * 100)}% compatibility`);

    return reasoning;
  }
}

// Behavioral Risk Assessment Model
export class BehavioralRiskAssessment {
  private model: tf.LayersModel | null = null;

  async loadModel() {
    try {
      this.model = await tf.loadLayersModel('/models/behavioral-risk/model.json');
      console.log('Behavioral risk model loaded successfully');
    } catch (error) {
      console.error('Failed to load behavioral risk model:', error);
      this.createDemoModel();
    }
  }

  private createDemoModel() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 3, activation: 'softmax' }) // low, medium, high risk
      ]
    });

    this.model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async assessRisk(assessmentData: any): Promise<{
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    riskFactors: string[];
    interventions: string[];
  }> {
    if (!this.model) {
      await this.loadModel();
    }

    const features = this.extractRiskFeatures(assessmentData);
    const prediction = this.model!.predict(tf.tensor2d([features])) as tf.Tensor;
    const riskProbs = await prediction.data();

    const riskLevels = ['low', 'medium', 'high'] as const;
    const maxIndex = riskProbs.indexOf(Math.max(...Array.from(riskProbs)));
    const riskLevel = riskLevels[maxIndex];
    const riskScore = Math.round(riskProbs[maxIndex] * 100);

    const riskFactors = this.identifyRiskFactors(assessmentData);
    const interventions = this.recommendInterventions(riskLevel, riskFactors);

    prediction.dispose();

    return { riskLevel, riskScore, riskFactors, interventions };
  }

  private extractRiskFeatures(assessmentData: any): number[] {
    const psychological = assessmentData.psychologicalWellbeing || {};
    const academic = assessmentData.academicPerformance || {};
    const physical = assessmentData.physicalHealth || {};

    return [
      (psychological.stressLevel || 5) / 10,
      (10 - (psychological.moodRating || 7)) / 10, // Invert mood
      (5 - (psychological.selfConfidence || 3)) / 5, // Invert confidence
      (academic.testAnxiety || 3) / 5,
      (psychological.behavioralConcerns?.length || 0) / 5,
      (physical.screenTime || 4) / 12,
      (5 - (psychological.sleepQuality || 3)) / 5, // Invert sleep quality
      (5 - (psychological.socialInteraction || 3)) / 5 // Invert social interaction
    ];
  }

  private identifyRiskFactors(assessmentData: any): string[] {
    const factors: string[] = [];
    const psychological = assessmentData.psychologicalWellbeing || {};
    const physical = assessmentData.physicalHealth || {};

    if (psychological.stressLevel > 7) factors.push('High stress levels');
    if (psychological.moodRating < 5) factors.push('Low mood rating');
    if (psychological.selfConfidence < 3) factors.push('Low self-confidence');
    if (psychological.sleepQuality < 3) factors.push('Poor sleep quality');
    if (physical.screenTime > 8) factors.push('Excessive screen time');
    if (psychological.behavioralConcerns?.length > 2) factors.push('Multiple behavioral concerns');

    return factors;
  }

  private recommendInterventions(riskLevel: string, riskFactors: string[]): string[] {
    const interventions: string[] = [];

    if (riskLevel === 'high') {
      interventions.push('Consider professional counseling or therapy');
      interventions.push('Implement immediate stress reduction strategies');
    }

    if (riskFactors.includes('High stress levels')) {
      interventions.push('Practice mindfulness and relaxation techniques');
      interventions.push('Establish a regular exercise routine');
    }

    if (riskFactors.includes('Poor sleep quality')) {
      interventions.push('Establish a consistent sleep schedule');
      interventions.push('Create a calming bedtime routine');
    }

    if (riskFactors.includes('Excessive screen time')) {
      interventions.push('Implement screen time limits');
      interventions.push('Encourage outdoor activities and hobbies');
    }

    return interventions.slice(0, 4); // Limit to top 4 interventions
  }
}

// Main ML Service
export class MLService {
  private academicPredictor: AcademicPerformancePredictor;
  private careerPredictor: CareerPathPredictor;
  private riskAssessment: BehavioralRiskAssessment;

  constructor() {
    this.academicPredictor = new AcademicPerformancePredictor();
    this.careerPredictor = new CareerPathPredictor();
    this.riskAssessment = new BehavioralRiskAssessment();
  }

  async initialize() {
    await initializeTensorFlow();
    await Promise.all([
      this.academicPredictor.loadModel(),
      this.careerPredictor.loadModel(),
      this.riskAssessment.loadModel()
    ]);
  }

  async generateComprehensiveAnalysis(assessmentData: any) {
    const [academicPrediction, careerPrediction, riskAssessment] = await Promise.all([
      this.academicPredictor.predict(assessmentData),
      this.careerPredictor.predictCareerPath(assessmentData),
      this.riskAssessment.assessRisk(assessmentData)
    ]);

    return {
      academic: academicPrediction,
      career: careerPrediction,
      behavioral: riskAssessment,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const mlService = new MLService();
