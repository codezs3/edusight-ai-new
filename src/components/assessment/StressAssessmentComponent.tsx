'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  BrainIcon,
  AcademicCapIcon,
  UserGroupIcon,
  HomeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  BeakerIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import {
  StressAssessmentData,
  StressPredictionResult,
  StressInterventionPlan,
  predictStressLevel,
  generateInterventionPlan,
  calculateCompositeScores
} from '@/lib/stress-analysis-engine';

interface StressAssessmentComponentProps {
  studentName: string;
  studentAge: number;
  onComplete: (result: StressPredictionResult, intervention: StressInterventionPlan) => void;
  onBack: () => void;
}

interface AssessmentStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  domain: 'psychological' | 'physiological' | 'environmental' | 'academic' | 'social';
  questions: {
    id: keyof StressAssessmentData;
    question: string;
    scale: { min: number; max: number; labels: string[] };
    reverse?: boolean;
  }[];
}

const ASSESSMENT_STEPS: AssessmentStep[] = [
  {
    id: 'psychological',
    title: 'Psychological Assessment',
    description: 'Understanding mental and emotional well-being',
    icon: <BrainIcon className="h-8 w-8" />,
    domain: 'psychological',
    questions: [
      {
        id: 'anxiety_level',
        question: 'How would you rate your current anxiety level?',
        scale: { min: 0, max: 21, labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'] }
      },
      {
        id: 'self_esteem',
        question: 'How would you describe your self-esteem?',
        scale: { min: 0, max: 30, labels: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'] },
        reverse: true
      },
      {
        id: 'mental_health_history',
        question: 'Have you ever experienced mental health challenges?',
        scale: { min: 0, max: 1, labels: ['No', 'Yes'] }
      },
      {
        id: 'depression',
        question: 'How would you rate your current mood and emotional state?',
        scale: { min: 0, max: 27, labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] }
      }
    ]
  },
  {
    id: 'physiological',
    title: 'Physical Health Assessment',
    description: 'Evaluating physical symptoms and health indicators',
    icon: <HeartIcon className="h-8 w-8" />,
    domain: 'physiological',
    questions: [
      {
        id: 'headache',
        question: 'How often do you experience headaches?',
        scale: { min: 0, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] }
      },
      {
        id: 'blood_pressure',
        question: 'How would you describe your blood pressure levels?',
        scale: { min: 0, max: 5, labels: ['Excellent', 'Good', 'Normal', 'Elevated', 'High'] }
      },
      {
        id: 'sleep_quality',
        question: 'How would you rate your sleep quality?',
        scale: { min: 0, max: 5, labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] },
        reverse: true
      },
      {
        id: 'breathing_problem',
        question: 'Do you experience breathing difficulties or shortness of breath?',
        scale: { min: 0, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] }
      }
    ]
  },
  {
    id: 'environmental',
    title: 'Environmental Assessment',
    description: 'Assessing living conditions and environmental factors',
    icon: <HomeIcon className="h-8 w-8" />,
    domain: 'environmental',
    questions: [
      {
        id: 'noise_level',
        question: 'How would you rate the noise level in your living environment?',
        scale: { min: 0, max: 5, labels: ['Very Quiet', 'Quiet', 'Moderate', 'Noisy', 'Very Noisy'] }
      },
      {
        id: 'living_conditions',
        question: 'How would you describe your living conditions?',
        scale: { min: 0, max: 5, labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] }
      },
      {
        id: 'safety',
        question: 'How safe do you feel in your current environment?',
        scale: { min: 0, max: 5, labels: ['Very Safe', 'Safe', 'Moderate', 'Unsafe', 'Very Unsafe'] }
      },
      {
        id: 'basic_needs',
        question: 'Are your basic needs (food, shelter, clothing) adequately met?',
        scale: { min: 0, max: 5, labels: ['Fully Met', 'Mostly Met', 'Partially Met', 'Barely Met', 'Not Met'] }
      }
    ]
  },
  {
    id: 'academic',
    title: 'Academic Assessment',
    description: 'Evaluating academic performance and educational stress',
    icon: <AcademicCapIcon className="h-8 w-8" />,
    domain: 'academic',
    questions: [
      {
        id: 'academic_performance',
        question: 'How would you rate your current academic performance?',
        scale: { min: 0, max: 5, labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] }
      },
      {
        id: 'study_load',
        question: 'How would you describe your current study workload?',
        scale: { min: 0, max: 5, labels: ['Very Light', 'Light', 'Moderate', 'Heavy', 'Very Heavy'] }
      },
      {
        id: 'teacher_student_relationship',
        question: 'How would you rate your relationship with teachers?',
        scale: { min: 0, max: 5, labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] }
      },
      {
        id: 'future_career_concerns',
        question: 'How concerned are you about your future career prospects?',
        scale: { min: 0, max: 5, labels: ['Not Concerned', 'Slightly Concerned', 'Moderately Concerned', 'Very Concerned', 'Extremely Concerned'] }
      }
    ]
  },
  {
    id: 'social',
    title: 'Social Assessment',
    description: 'Understanding social relationships and peer interactions',
    icon: <UserGroupIcon className="h-8 w-8" />,
    domain: 'social',
    questions: [
      {
        id: 'social_support',
        question: 'How would you rate your social support network?',
        scale: { min: 0, max: 5, labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'] },
        reverse: true
      },
      {
        id: 'peer_pressure',
        question: 'How much peer pressure do you experience?',
        scale: { min: 0, max: 5, labels: ['None', 'Very Little', 'Some', 'A Lot', 'Extreme'] }
      },
      {
        id: 'extracurricular_activities',
        question: 'How active are you in extracurricular activities?',
        scale: { min: 0, max: 5, labels: ['Very Active', 'Active', 'Moderately Active', 'Less Active', 'Not Active'] }
      },
      {
        id: 'bullying',
        question: 'Have you experienced bullying or harassment?',
        scale: { min: 0, max: 5, labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'] }
      }
    ]
  }
];

export default function StressAssessmentComponent({
  studentName,
  studentAge,
  onComplete,
  onBack
}: StressAssessmentComponentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Partial<StressAssessmentData>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [predictionResult, setPredictionResult] = useState<StressPredictionResult | null>(null);
  const [interventionPlan, setInterventionPlan] = useState<StressInterventionPlan | null>(null);

  const currentStepData = ASSESSMENT_STEPS[currentStep];
  const currentQuestionData = currentStepData?.questions[currentQuestion];
  const progress = ((currentStep * 4 + currentQuestion + 1) / (ASSESSMENT_STEPS.length * 4)) * 100;

  const handleAnswer = useCallback((value: number) => {
    if (!currentQuestionData) return;

    setAssessmentData(prev => ({
      ...prev,
      [currentQuestionData.id]: value
    }));

    // Move to next question or step
    if (currentQuestion < currentStepData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentStep < ASSESSMENT_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setCurrentQuestion(0);
    } else {
      // Assessment complete, start analysis
      handleCompleteAssessment();
    }
  }, [currentQuestion, currentStep, currentQuestionData, currentStepData]);

  const handleCompleteAssessment = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Ensure all required fields are present
      const completeData: StressAssessmentData = {
        anxiety_level: assessmentData.anxiety_level || 0,
        self_esteem: assessmentData.self_esteem || 0,
        mental_health_history: assessmentData.mental_health_history || 0,
        depression: assessmentData.depression || 0,
        headache: assessmentData.headache || 0,
        blood_pressure: assessmentData.blood_pressure || 0,
        sleep_quality: assessmentData.sleep_quality || 0,
        breathing_problem: assessmentData.breathing_problem || 0,
        noise_level: assessmentData.noise_level || 0,
        living_conditions: assessmentData.living_conditions || 0,
        safety: assessmentData.safety || 0,
        basic_needs: assessmentData.basic_needs || 0,
        academic_performance: assessmentData.academic_performance || 0,
        study_load: assessmentData.study_load || 0,
        teacher_student_relationship: assessmentData.teacher_student_relationship || 0,
        future_career_concerns: assessmentData.future_career_concerns || 0,
        social_support: assessmentData.social_support || 0,
        peer_pressure: assessmentData.peer_pressure || 0,
        extracurricular_activities: assessmentData.extracurricular_activities || 0,
        bullying: assessmentData.bullying || 0
      };

      // Predict stress level
      const prediction = predictStressLevel(completeData);
      setPredictionResult(prediction);

      // Generate intervention plan
      const intervention = generateInterventionPlan(prediction);
      setInterventionPlan(intervention);

      setShowResults(true);
      toast.success('Stress assessment completed successfully!');
      
    } catch (error) {
      console.error('Error completing stress assessment:', error);
      toast.error('Error analyzing stress assessment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [assessmentData]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCurrentQuestion(ASSESSMENT_STEPS[currentStep - 1].questions.length - 1);
    } else {
      onBack();
    }
  }, [currentQuestion, currentStep, onBack]);

  const handleFinish = useCallback(() => {
    if (predictionResult && interventionPlan) {
      onComplete(predictionResult, interventionPlan);
    }
  }, [predictionResult, interventionPlan, onComplete]);

  const getStressLevelLabel = (level: 0 | 1 | 2) => {
    switch (level) {
      case 0: return 'No Stress';
      case 1: return 'Eustress (Positive Stress)';
      case 2: return 'Distress (Negative Stress)';
      default: return 'Unknown';
    }
  };

  const getStressLevelColor = (level: 0 | 1 | 2) => {
    switch (level) {
      case 0: return 'text-green-600 bg-green-100';
      case 1: return 'text-yellow-600 bg-yellow-100';
      case 2: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Stress Assessment</h3>
        <p className="text-gray-600 text-center max-w-md">
          Our AI is processing {studentName}'s responses using advanced machine learning models 
          based on research from multiple stress detection studies.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>🔬 Using ensemble models (RandomForest, XGBoost, LightGBM)</p>
          <p>📊 Analyzing 5 domains: Psychological, Physiological, Environmental, Academic, Social</p>
        </div>
      </div>
    );
  }

  if (showResults && predictionResult && interventionPlan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Results Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Stress Assessment Results</h2>
          <p className="text-lg text-gray-600">
            Analysis for {studentName} (Age: {studentAge})
          </p>
        </div>

        {/* Stress Level Prediction */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">Stress Level Prediction</h3>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStressLevelColor(predictionResult.stress_level)}`}>
              {getStressLevelLabel(predictionResult.stress_level)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Confidence Score</h4>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${predictionResult.confidence * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(predictionResult.confidence * 100)}% confidence
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Urgency Level</h4>
              <div className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${getUrgencyColor(interventionPlan.urgency_level)}`}>
                {interventionPlan.urgency_level.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Composite Scores */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Domain Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(predictionResult.composite_scores).map(([domain, score]) => (
              <div key={domain} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 capitalize">
                  {domain.replace('_', ' ')}
                </h4>
                <p className="text-2xl font-bold text-blue-600">
                  {score.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">/ 5.0</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Predictors */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Key Stress Factors</h3>
          <div className="space-y-4">
            {predictionResult.top_predictors.slice(0, 5).map((predictor, index) => (
              <div key={predictor.feature} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{predictor.feature}</span>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                    predictor.impact === 'positive' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {predictor.impact === 'positive' ? 'Risk Factor' : 'Protective Factor'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {Math.round(predictor.importance * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk and Protective Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              Risk Factors
            </h3>
            <ul className="space-y-2">
              {predictionResult.risk_factors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-500 mr-2" />
              Protective Factors
            </h3>
            <ul className="space-y-2">
              {predictionResult.protective_factors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Intervention Plan */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <LightBulbIcon className="h-6 w-6 text-yellow-500 mr-2" />
            Personalized Intervention Plan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Immediate Actions</h4>
              <ul className="space-y-2">
                {interventionPlan.immediate_actions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <ClockIcon className="h-4 w-4 text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Short-term Goals</h4>
              <ul className="space-y-2">
                {interventionPlan.short_term_goals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Long-term Strategies</h4>
              <ul className="space-y-2">
                {interventionPlan.long_term_strategies.map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <SparklesIcon className="h-4 w-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Professional Referral */}
        {interventionPlan.professional_referral && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-red-800">Professional Support Recommended</h3>
            </div>
            <p className="text-red-700 mb-4">
              Based on the assessment results, we recommend seeking professional mental health support.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium text-red-800">Resources:</h4>
              {interventionPlan.resources.map((resource, index) => (
                <p key={index} className="text-sm text-red-600">• {resource}</p>
              ))}
            </div>
          </div>
        )}

        {/* Research Sources */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <BeakerIcon className="h-5 w-5 mr-2" />
            Research-Based Analysis
          </h3>
          <p className="text-blue-700 text-sm mb-3">
            This assessment is based on comprehensive research from multiple sources:
          </p>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Kaggle: Student Stress & Performance Insights (1,100 students, 20 features)</li>
            <li>• GitHub: Rubaikaa/Student-Stress-Detection (Predictive modeling & clustering)</li>
            <li>• Ensemble ML models achieving 89% accuracy in stress prediction</li>
            <li>• SHAP explainability for transparent feature importance</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Assessment
          </button>
          <button
            onClick={handleFinish}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            Complete Assessment
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </button>
        </div>
      </motion.div>
    );
  }

  if (!currentStepData || !currentQuestionData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-gray-600">Error loading assessment. Please try again.</p>
        <button onClick={onBack} className="mt-4 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Progress Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            {currentStepData.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">
          Step {currentStep + 1} of {ASSESSMENT_STEPS.length} • Question {currentQuestion + 1} of {currentStepData.questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQuestionData.question}
          </h3>
          <p className="text-gray-600">
            Please select the option that best describes {studentName}'s current situation.
          </p>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestionData.scale.labels.map((label, index) => {
            const value = currentQuestionData.scale.min + 
              (index * (currentQuestionData.scale.max - currentQuestionData.scale.min) / 
               (currentQuestionData.scale.labels.length - 1));
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(value)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{label}</span>
                  <span className="text-sm text-gray-500">({value})</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0 && currentQuestion === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Previous
        </button>
        
        <div className="text-sm text-gray-500">
          {Math.round(progress)}% Complete
        </div>
      </div>
    </motion.div>
  );
}
