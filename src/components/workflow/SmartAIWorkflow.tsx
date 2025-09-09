'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  AcademicCapIcon,
  UserIcon,
  HeartIcon,
  ArrowRightIcon,
  BrainIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  LightBulbIcon,
  CpuChipIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { 
  DataCollectionStatus, 
  PsychometricTestResult, 
  ParentQuestionnaireResponse, 
  PhysicalAssessmentData,
  AgeGroup,
  StudentProfile,
  AnalysisResult
} from '@/types/assessment';
import { getAgeGroup } from '@/lib/age-appropriate-frameworks';

interface SmartAIWorkflowProps {
  studentAge: number;
  studentName: string;
  userRole: 'ADMIN' | 'PARENT' | 'SCHOOL_ADMIN' | 'TEACHER';
  onComplete: (results: any) => void;
  onError: (error: string) => void;
}

interface AIInsight {
  domain: 'ACADEMIC' | 'PSYCHOMETRIC' | 'PHYSICAL' | 'OVERALL';
  insight: string;
  confidence: number;
  recommendations: string[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  domain: 'ACADEMIC' | 'PSYCHOMETRIC' | 'PHYSICAL' | 'AI_ANALYSIS' | 'REPORT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  icon: React.ComponentType<any>;
  color: string;
  aiPrompt?: string;
  required: boolean;
}

export default function SmartAIWorkflow({
  studentAge,
  studentName,
  userRole,
  onComplete,
  onError
}: SmartAIWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [dataStatus, setDataStatus] = useState<DataCollectionStatus>({
    academic: { hasData: false, dataSource: 'NONE', completeness: 0 },
    psychometric: { hasData: false, dataSource: 'NONE', completeness: 0 },
    physical: { hasData: false, dataSource: 'NONE', completeness: 0 }
  });
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parentDescription, setParentDescription] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  const ageGroup = getAgeGroup(studentAge);

  // Initialize smart workflow steps
  useEffect(() => {
    const steps: WorkflowStep[] = [
      {
        id: 'academic-data',
        title: 'Academic Performance Analysis',
        description: 'Collect and analyze academic records, grades, and performance data',
        domain: 'ACADEMIC',
        status: 'PENDING',
        icon: AcademicCapIcon,
        color: 'blue',
        aiPrompt: `Analyze the academic performance of ${studentName}, age ${studentAge}, grade ${ageGroup}. Focus on strengths, weaknesses, learning patterns, and academic trajectory.`,
        required: true
      },
      {
        id: 'psychometric-assessment',
        title: 'Psychological & Mental Health Assessment',
        description: ageGroup === 'EARLY_CHILDHOOD' || ageGroup === 'PRIMARY' 
          ? 'Parent questionnaire for psychological insights'
          : 'Direct psychometric testing and mental health evaluation',
        domain: 'PSYCHOMETRIC',
        status: 'PENDING',
        icon: BrainIcon,
        color: 'purple',
        aiPrompt: `Assess the psychological and mental health aspects of ${studentName}, age ${studentAge}. Consider personality traits, learning style, emotional regulation, social skills, and mental well-being.`,
        required: true
      },
      {
        id: 'physical-health',
        title: 'Physical Health & Development',
        description: 'Evaluate physical fitness, health metrics, and developmental milestones',
        domain: 'PHYSICAL',
        status: 'PENDING',
        icon: HeartIcon,
        color: 'red',
        aiPrompt: `Evaluate the physical health and development of ${studentName}, age ${studentAge}. Consider fitness levels, motor skills, health indicators, and physical development milestones.`,
        required: true
      },
      {
        id: 'parent-insights',
        title: 'Parent Observations & Insights',
        description: 'AI-powered analysis of parent descriptions and observations',
        domain: 'PSYCHOMETRIC',
        status: 'PENDING',
        icon: ChatBubbleLeftRightIcon,
        color: 'green',
        aiPrompt: `Based on parent observations about ${studentName}, age ${studentAge}, provide insights about the child's behavior, development, strengths, challenges, and recommendations for support.`,
        required: false
      },
      {
        id: 'ai-synthesis',
        title: 'AI-Powered Comprehensive Analysis',
        description: 'Synthesize all data using advanced AI for holistic insights',
        domain: 'AI_ANALYSIS',
        status: 'PENDING',
        icon: CpuChipIcon,
        color: 'indigo',
        aiPrompt: `Provide a comprehensive analysis of ${studentName}, age ${studentAge}, integrating academic, psychological, and physical data. Include career recommendations, learning strategies, and development plans.`,
        required: true
      },
      {
        id: 'final-report',
        title: 'Comprehensive Assessment Report',
        description: 'Generate detailed professional report with insights and recommendations',
        domain: 'REPORT',
        status: 'PENDING',
        icon: DocumentTextIcon,
        color: 'gray',
        required: true
      }
    ];

    setWorkflowSteps(steps);
  }, [studentAge, studentName, ageGroup]);

  const handleStepComplete = useCallback((stepId: string, data: any) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status: 'COMPLETED' } : step
    ));

    // Update data status based on completed step
    if (stepId === 'academic-data') {
      setDataStatus(prev => ({
        ...prev,
        academic: { hasData: true, dataSource: 'DOCUMENTS', completeness: 100 }
      }));
    } else if (stepId === 'psychometric-assessment') {
      setDataStatus(prev => ({
        ...prev,
        psychometric: { hasData: true, dataSource: 'TEST', completeness: 100 }
      }));
    } else if (stepId === 'physical-health') {
      setDataStatus(prev => ({
        ...prev,
        physical: { hasData: true, dataSource: 'ASSESSMENT', completeness: 100 }
      }));
    }

    // Move to next step
    const currentIndex = workflowSteps.findIndex(step => step.id === stepId);
    if (currentIndex < workflowSteps.length - 1) {
      setCurrentStep(currentIndex + 1);
    } else {
      // All steps completed
      handleWorkflowComplete();
    }
  }, [workflowSteps]);

  const handleAIAnalysis = useCallback(async (prompt: string, domain: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate AI API call (replace with actual ChatGPT API)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockInsight: AIInsight = {
        domain: domain as any,
        insight: `AI analysis for ${domain.toLowerCase()} domain reveals significant patterns and opportunities for growth.`,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        recommendations: [
          'Focus on identified strengths to build confidence',
          'Address areas of improvement with targeted interventions',
          'Leverage learning style preferences for better outcomes'
        ],
        priority: 'HIGH'
      };

      setAiInsights(prev => [...prev, mockInsight]);
      toast.success('AI analysis completed successfully!');
    } catch (error) {
      toast.error('AI analysis failed. Please try again.');
      onError('AI analysis failed');
    } finally {
      setIsProcessing(false);
    }
  }, [onError]);

  const handleWorkflowComplete = useCallback(() => {
    const results = {
      studentName,
      studentAge,
      ageGroup,
      dataStatus,
      aiInsights,
      parentDescription,
      completedAt: new Date(),
      reportGenerated: true
    };
    
    onComplete(results);
  }, [studentName, studentAge, ageGroup, dataStatus, aiInsights, parentDescription, onComplete]);

  const getStepIcon = (step: WorkflowStep) => {
    const Icon = step.icon;
    return <Icon className="w-6 h-6" />;
  };

  const getStepColor = (step: WorkflowStep) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200',
      gray: 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[step.color as keyof typeof colors] || colors.gray;
  };

  const currentStepData = workflowSteps[currentStep];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BrainIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Smart Assessment</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive evaluation of {studentName}'s academic, psychological, and physical development
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>Age: {studentAge}</span>
          <span>•</span>
          <span>Grade: {ageGroup.replace('_', ' ')}</span>
          <span>•</span>
          <span>AI-Enhanced Analysis</span>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Assessment Progress</h3>
          <div className="flex items-center space-x-2">
            <CpuChipIcon className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">AI-Powered</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowSteps.slice(0, 3).map((step, index) => (
            <div key={step.id} className="flex items-center space-x-3 p-3 rounded-lg border">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStepColor(step)}`}>
                {getStepIcon(step)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-500">{step.status}</div>
              </div>
              {step.status === 'COMPLETED' && (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Current Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg"
        >
          {currentStepData && (
            <>
              {/* Step Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStepColor(currentStepData)}`}>
                  {getStepIcon(currentStepData)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentStepData.title}</h2>
                  <p className="text-gray-600">{currentStepData.description}</p>
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                {currentStepData.id === 'academic-data' && (
                  <AcademicDataCollection 
                    onComplete={(data) => handleStepComplete('academic-data', data)}
                  />
                )}
                
                {currentStepData.id === 'psychometric-assessment' && (
                  <PsychometricAssessment 
                    ageGroup={ageGroup}
                    onComplete={(data) => handleStepComplete('psychometric-assessment', data)}
                  />
                )}
                
                {currentStepData.id === 'physical-health' && (
                  <PhysicalHealthAssessment 
                    onComplete={(data) => handleStepComplete('physical-health', data)}
                  />
                )}
                
                {currentStepData.id === 'parent-insights' && (
                  <ParentInsightsCollection 
                    parentDescription={parentDescription}
                    setParentDescription={setParentDescription}
                    onComplete={(data) => handleStepComplete('parent-insights', data)}
                  />
                )}
                
                {currentStepData.id === 'ai-synthesis' && (
                  <AISynthesis 
                    isProcessing={isProcessing}
                    onAnalyze={() => handleAIAnalysis(currentStepData.aiPrompt!, currentStepData.domain)}
                    insights={aiInsights}
                  />
                )}
                
                {currentStepData.id === 'final-report' && (
                  <FinalReportGeneration 
                    studentName={studentName}
                    dataStatus={dataStatus}
                    aiInsights={aiInsights}
                    onComplete={handleWorkflowComplete}
                  />
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* AI Insights Panel */}
      {aiInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CpuChipIcon className="w-6 h-6 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{insight.domain}</span>
                  <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{insight.insight}</p>
                <div className="space-y-1">
                  {insight.recommendations.slice(0, 2).map((rec, i) => (
                    <div key={i} className="text-xs text-gray-500">• {rec}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Placeholder components for each step
const AcademicDataCollection = ({ onComplete }: { onComplete: (data: any) => void }) => (
  <div className="text-center space-y-4">
    <AcademicCapIcon className="w-16 h-16 text-blue-500 mx-auto" />
    <h3 className="text-lg font-semibold">Academic Data Collection</h3>
    <p className="text-gray-600">Upload academic documents or enter data manually</p>
    <button 
      onClick={() => onComplete({ type: 'academic', data: 'mock' })}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Continue
    </button>
  </div>
);

const PsychometricAssessment = ({ ageGroup, onComplete }: { ageGroup: AgeGroup, onComplete: (data: any) => void }) => (
  <div className="text-center space-y-4">
    <BrainIcon className="w-16 h-16 text-purple-500 mx-auto" />
    <h3 className="text-lg font-semibold">Psychological Assessment</h3>
    <p className="text-gray-600">
      {ageGroup === 'EARLY_CHILDHOOD' || ageGroup === 'PRIMARY' 
        ? 'Parent questionnaire for younger children'
        : 'Direct psychometric testing'
      }
    </p>
    <button 
      onClick={() => onComplete({ type: 'psychometric', data: 'mock' })}
      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      Start Assessment
    </button>
  </div>
);

const PhysicalHealthAssessment = ({ onComplete }: { onComplete: (data: any) => void }) => (
  <div className="text-center space-y-4">
    <HeartIcon className="w-16 h-16 text-red-500 mx-auto" />
    <h3 className="text-lg font-semibold">Physical Health Assessment</h3>
    <p className="text-gray-600">Evaluate physical fitness and health metrics</p>
    <button 
      onClick={() => onComplete({ type: 'physical', data: 'mock' })}
      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Start Assessment
    </button>
  </div>
);

const ParentInsightsCollection = ({ 
  parentDescription, 
  setParentDescription, 
  onComplete 
}: { 
  parentDescription: string, 
  setParentDescription: (desc: string) => void, 
  onComplete: (data: any) => void 
}) => (
  <div className="space-y-4">
    <div className="text-center">
      <ChatBubbleLeftRightIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold">Parent Observations</h3>
      <p className="text-gray-600">Share your insights about your child's behavior and development</p>
    </div>
    
    <textarea
      value={parentDescription}
      onChange={(e) => setParentDescription(e.target.value)}
      placeholder="Describe your child's behavior, interests, challenges, strengths, and any observations you'd like to share..."
      className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />
    
    <button 
      onClick={() => onComplete({ type: 'parent_insights', data: parentDescription })}
      disabled={!parentDescription.trim()}
      className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      Submit Observations
    </button>
  </div>
);

const AISynthesis = ({ 
  isProcessing, 
  onAnalyze, 
  insights 
}: { 
  isProcessing: boolean, 
  onAnalyze: () => void, 
  insights: AIInsight[] 
}) => (
  <div className="text-center space-y-6">
    <CpuChipIcon className="w-16 h-16 text-indigo-500 mx-auto" />
    <h3 className="text-lg font-semibold">AI-Powered Analysis</h3>
    <p className="text-gray-600">Synthesizing all data for comprehensive insights</p>
    
    {!isProcessing && insights.length === 0 && (
      <button 
        onClick={onAnalyze}
        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
      >
        <SparklesIcon className="w-5 h-5 inline mr-2" />
        Start AI Analysis
      </button>
    )}
    
    {isProcessing && (
      <div className="space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-600">AI is analyzing all collected data...</p>
      </div>
    )}
  </div>
);

const FinalReportGeneration = ({ 
  studentName, 
  dataStatus, 
  aiInsights, 
  onComplete 
}: { 
  studentName: string, 
  dataStatus: DataCollectionStatus, 
  aiInsights: AIInsight[], 
  onComplete: () => void 
}) => (
  <div className="text-center space-y-6">
    <DocumentTextIcon className="w-16 h-16 text-gray-500 mx-auto" />
    <h3 className="text-lg font-semibold">Generate Final Report</h3>
    <p className="text-gray-600">Creating comprehensive assessment report for {studentName}</p>
    
    <div className="bg-gray-50 rounded-lg p-4 text-left">
      <h4 className="font-medium mb-2">Report Contents:</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Academic performance analysis</li>
        <li>• Psychological and mental health insights</li>
        <li>• Physical health and development assessment</li>
        <li>• AI-powered recommendations</li>
        <li>• Career guidance and future planning</li>
        <li>• Personalized learning strategies</li>
      </ul>
    </div>
    
    <button 
      onClick={onComplete}
      className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
    >
      Generate Report
    </button>
  </div>
);
