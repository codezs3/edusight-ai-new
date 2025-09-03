'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
  CpuChipIcon as BrainIcon,
  ChartBarIcon,
  FolderIcon,
  PlusIcon,
  HeartIcon,
  EyeIcon,
  ChartPieIcon,
  SparklesIcon,
  LockClosedIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  icon: React.ComponentType<any>;
  estimatedTime?: string;
  progress?: number;
  error?: string;
  details?: string[];
  subSteps?: WorkflowStep[];
}

interface GuestUploadWorkflowProps {
  guestSessionId: string;
  documentId: string;
  studentName: string;
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
}

const initialSteps: WorkflowStep[] = [
  {
    id: 'data_acquisition',
    title: 'Reading & Extracting Data',
    description: 'Our AI is reading your documents and extracting academic information',
    status: 'pending',
    icon: DocumentMagnifyingGlassIcon,
    estimatedTime: '30-60 seconds',
    subSteps: [
      {
        id: 'file_parsing',
        title: 'Document Analysis',
        description: 'Analyzing document structure and content',
        status: 'pending',
        icon: DocumentMagnifyingGlassIcon
      },
      {
        id: 'data_extraction',
        title: 'Data Extraction',
        description: 'Extracting grades, subjects, and performance data',
        status: 'pending',
        icon: CheckCircleIcon
      }
    ]
  },
  {
    id: 'ai_analysis',
    title: 'AI-Powered Academic Analysis',
    description: 'Advanced machine learning models analyzing performance patterns',
    status: 'pending',
    icon: BrainIcon,
    estimatedTime: '1-2 minutes',
    subSteps: [
      {
        id: 'performance_analysis',
        title: 'Performance Analysis',
        description: 'Analyzing academic strengths and improvement areas',
        status: 'pending',
        icon: ChartBarIcon
      },
      {
        id: 'behavioral_insights',
        title: 'Learning Pattern Recognition',
        description: 'Identifying learning patterns and study behaviors',
        status: 'pending',
        icon: HeartIcon
      },
      {
        id: 'career_prediction',
        title: 'Career Path Recommendations',
        description: 'Generating personalized career suggestions',
        status: 'pending',
        icon: ChartPieIcon
      }
    ]
  },
  {
    id: 'framework_detection',
    title: 'Curriculum Framework Detection',
    description: 'Identifying academic framework and standardizing scores',
    status: 'pending',
    icon: ChartBarIcon,
    estimatedTime: '30 seconds'
  },
  {
    id: 'score_calculation',
    title: 'EduSight 360° Score Calculation',
    description: 'Computing comprehensive assessment across all domains',
    status: 'pending',
    icon: ChartPieIcon,
    estimatedTime: '45 seconds'
  },
  {
    id: 'report_generation',
    title: 'Generating Your Personalized Report',
    description: 'Creating detailed insights, charts, and recommendations',
    status: 'pending',
    icon: EyeIcon,
    estimatedTime: '60 seconds'
  }
];

export default function GuestUploadWorkflow({ 
  guestSessionId, 
  documentId, 
  studentName, 
  onComplete, 
  onError 
}: GuestUploadWorkflowProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(240); // 4 minutes
  const [showFrameworkAlert, setShowFrameworkAlert] = useState(false);

  useEffect(() => {
    // Auto-start the workflow
    startWorkflow();
  }, []);

  useEffect(() => {
    // Update overall progress
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const inProgressSteps = steps.filter(step => step.status === 'in_progress').length;
    const progress = (completedSteps / steps.length) * 100 + (inProgressSteps / steps.length) * 20;
    setOverallProgress(Math.min(progress, 95));

    // Update estimated time
    const remainingSteps = steps.filter(step => step.status === 'pending').length;
    setEstimatedTimeRemaining(remainingSteps * 45); // 45 seconds per step average
  }, [steps]);

  const updateStepStatus = (stepId: string, status: WorkflowStep['status'], progress?: number, error?: string, details?: string[]) => {
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { ...step, status, progress, error, details };
      }
      // Also update substeps if they exist
      if (step.subSteps) {
        const updatedSubSteps = step.subSteps.map(subStep => 
          subStep.id === stepId ? { ...subStep, status, progress, error } : subStep
        );
        return { ...step, subSteps: updatedSubSteps };
      }
      return step;
    }));
  };

  const updateSubStepStatus = (parentId: string, subStepId: string, status: WorkflowStep['status'], progress?: number) => {
    setSteps(prev => prev.map(step => {
      if (step.id === parentId && step.subSteps) {
        const updatedSubSteps = step.subSteps.map(subStep => 
          subStep.id === subStepId ? { ...subStep, status, progress } : subStep
        );
        return { ...step, subSteps: updatedSubSteps };
      }
      return step;
    }));
  };

  const processStep = async (stepIndex: number) => {
    const step = steps[stepIndex];
    updateStepStatus(step.id, 'in_progress', 0);

    try {
      switch (step.id) {
        case 'data_acquisition':
          await processDataAcquisition(step);
          break;
        case 'ai_analysis':
          await processAIAnalysis(step);
          break;
        case 'framework_detection':
          await processFrameworkDetection(step);
          break;
        case 'score_calculation':
          await processScoreCalculation(step);
          break;
        case 'report_generation':
          await processReportGeneration(step);
          break;
      }
      
      updateStepStatus(step.id, 'completed', 100);
      
      // Move to next step
      if (stepIndex < steps.length - 1) {
        setCurrentStep(stepIndex + 1);
        setTimeout(() => processStep(stepIndex + 1), 800);
      } else {
        // Workflow completed - show signup prompt
        setOverallProgress(100);
        setTimeout(() => {
          setShowSignupPrompt(true);
        }, 1500);
      }
    } catch (error) {
      updateStepStatus(step.id, 'error', undefined, error instanceof Error ? error.message : 'Processing failed');
      setIsRunning(false);
      onError?.(error instanceof Error ? error.message : 'Processing failed');
    }
  };

  const processDataAcquisition = async (step: WorkflowStep) => {
    // Process file parsing
    updateSubStepStatus(step.id, 'file_parsing', 'in_progress');
    
    const response = await fetch(`/api/guest/documents/${documentId}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestSessionId, step: 'parse' })
    });
    
    if (!response.ok) throw new Error('Failed to parse document');
    
    updateSubStepStatus(step.id, 'file_parsing', 'completed');
    updateStepStatus(step.id, 'in_progress', 50);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Process data extraction
    updateSubStepStatus(step.id, 'data_extraction', 'in_progress');
    
    // Simulate more processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateSubStepStatus(step.id, 'data_extraction', 'completed');
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const processAIAnalysis = async (step: WorkflowStep) => {
    // Performance analysis
    updateSubStepStatus(step.id, 'performance_analysis', 'in_progress');
    updateStepStatus(step.id, 'in_progress', 10);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    updateSubStepStatus(step.id, 'performance_analysis', 'completed');
    updateStepStatus(step.id, 'in_progress', 40);
    
    // Behavioral insights
    updateSubStepStatus(step.id, 'behavioral_insights', 'in_progress');
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    updateSubStepStatus(step.id, 'behavioral_insights', 'completed');
    updateStepStatus(step.id, 'in_progress', 70);
    
    // Career prediction
    updateSubStepStatus(step.id, 'career_prediction', 'in_progress');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateSubStepStatus(step.id, 'career_prediction', 'completed');
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const processFrameworkDetection = async (step: WorkflowStep) => {
    updateStepStatus(step.id, 'in_progress', 30);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate framework detection with possible alert
    const frameworks = ['CBSE', 'ICSE', 'IGCSE', 'IB', 'unknown'];
    const detectedFramework = frameworks[Math.floor(Math.random() * frameworks.length)];
    
    if (detectedFramework === 'unknown') {
      setShowFrameworkAlert(true);
    }
    
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const processScoreCalculation = async (step: WorkflowStep) => {
    updateStepStatus(step.id, 'in_progress', 20);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateStepStatus(step.id, 'in_progress', 80);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const processReportGeneration = async (step: WorkflowStep) => {
    updateStepStatus(step.id, 'in_progress', 15);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateStepStatus(step.id, 'in_progress', 50);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    updateStepStatus(step.id, 'in_progress', 85);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const startWorkflow = () => {
    setIsRunning(true);
    setCurrentStep(0);
    processStep(0);
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleSignupRedirect = () => {
    // Redirect to signup with guest session data
    window.location.href = `/auth/signup?guestSession=${guestSessionId}&studentName=${encodeURIComponent(studentName)}`;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Analyzing {studentName}'s Academic Data</h3>
            <p className="opacity-90 text-sm">
              {overallProgress < 100 
                ? `Estimated time remaining: ${formatTime(estimatedTimeRemaining)}`
                : 'Analysis Complete!'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <div className="text-sm opacity-90">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-2">
          <motion.div
            className="bg-white h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-xs opacity-75">
          <span>Processing...</span>
          <span>{overallProgress < 100 ? 'In Progress' : 'Ready for Review'}</span>
        </div>
      </div>

      {/* Framework Alert */}
      <AnimatePresence>
        {showFrameworkAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Academic Framework Detection</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  We're using our generic analysis framework to ensure comprehensive assessment. 
                  Results will be adjusted for optimal accuracy.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              step.status === 'completed' 
                ? 'border-green-200 bg-green-50'
                : step.status === 'in_progress'
                ? 'border-blue-200 bg-blue-50 shadow-lg'
                : step.status === 'error'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-full ${
                  step.status === 'completed' 
                    ? 'bg-green-100'
                    : step.status === 'in_progress'
                    ? 'bg-blue-100'
                    : step.status === 'error'
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                }`}>
                  <step.icon className={`w-6 h-6 ${
                    step.status === 'completed' 
                      ? 'text-green-600'
                      : step.status === 'in_progress'
                      ? 'text-blue-600'
                      : step.status === 'error'
                      ? 'text-red-600'
                      : 'text-gray-400'
                  }`} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  {getStepIcon(step.status)}
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                
                {step.estimatedTime && step.status === 'pending' && (
                  <p className="text-xs text-gray-500 mt-2">⏱️ {step.estimatedTime}</p>
                )}
                
                {step.status === 'in_progress' && step.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{step.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${step.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
                
                {step.error && (
                  <div className="mt-2 p-3 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                    ❌ {step.error}
                  </div>
                )}
                
                {/* Sub-steps */}
                {step.subSteps && step.subSteps.length > 0 && step.status !== 'pending' && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                    {step.subSteps.map((subStep) => (
                      <div key={subStep.id} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getStepIcon(subStep.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{subStep.title}</p>
                          <p className="text-xs text-gray-600">{subStep.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Signup Prompt */}
      <AnimatePresence>
        {showSignupPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl text-center"
          >
            <div className="mb-6">
              <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-200" />
              <h2 className="text-2xl font-bold mb-2">Analysis Complete! 🎉</h2>
              <p className="text-green-100 mb-4">
                We've successfully analyzed {studentName}'s academic data and generated a comprehensive report with:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <SparklesIcon className="w-6 h-6 mx-auto mb-2" />
                  <p>Performance Analysis</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <ChartPieIcon className="w-6 h-6 mx-auto mb-2" />
                  <p>Career Recommendations</p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <EyeIcon className="w-6 h-6 mx-auto mb-2" />
                  <p>Visual Reports & Charts</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 p-6 rounded-lg mb-6">
              <LockClosedIcon className="w-8 h-8 mx-auto mb-3 text-yellow-200" />
              <h3 className="text-lg font-semibold mb-2">Sign up to access your report</h3>
              <p className="text-sm text-blue-100 mb-4">
                Create your free account to download the complete analysis and get personalized recommendations for {studentName}.
              </p>
              
              <button
                onClick={handleSignupRedirect}
                className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>Sign Up & Access Report</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-blue-100">
              ✨ Free account • No credit card required • Instant access
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
