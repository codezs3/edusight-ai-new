'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
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
  ChartPieIcon
} from '@heroicons/react/24/outline';
import FrameworkSelectionModal from './FrameworkSelectionModal';

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

interface UploadWorkflowProps {
  documentId: string;
  studentId: string;
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
}

const initialSteps: WorkflowStep[] = [
  {
    id: 'data_acquisition',
    title: 'Acquiring Data from Uploaded File',
    description: 'Extracting and processing content from your uploaded documents',
    status: 'pending',
    icon: DocumentMagnifyingGlassIcon,
    estimatedTime: '30-60 seconds',
    subSteps: [
      {
        id: 'file_parsing',
        title: 'Parsing File Content',
        description: 'Reading and extracting text from documents',
        status: 'pending',
        icon: DocumentMagnifyingGlassIcon
      },
      {
        id: 'data_validation',
        title: 'Validating Data Quality',
        description: 'Ensuring data integrity and completeness',
        status: 'pending',
        icon: CheckCircleIcon
      }
    ]
  },
  {
    id: 'ml_analysis',
    title: 'AI/ML Model Analysis',
    description: 'Analyzing data using our advanced machine learning models',
    status: 'pending',
    icon: BrainIcon,
    estimatedTime: '1-2 minutes',
    subSteps: [
      {
        id: 'academic_analysis',
        title: 'Academic Performance Analysis',
        description: 'Evaluating academic strengths and areas for improvement',
        status: 'pending',
        icon: ChartBarIcon
      },
      {
        id: 'behavioral_analysis',
        title: 'Behavioral Pattern Recognition',
        description: 'Identifying learning patterns and behavioral insights',
        status: 'pending',
        icon: HeartIcon
      },
      {
        id: 'career_prediction',
        title: 'Career Path Prediction',
        description: 'Generating career recommendations based on interests and abilities',
        status: 'pending',
        icon: ChartPieIcon
      }
    ]
  },
  {
    id: 'framework_detection',
    title: 'Academic Framework Detection & Normalization',
    description: 'Detecting curriculum framework and normalizing data accordingly',
    status: 'pending',
    icon: ChartBarIcon,
    estimatedTime: '30 seconds',
    subSteps: [
      {
        id: 'framework_identification',
        title: 'Framework Identification',
        description: 'Detecting curriculum standard (IB, IGCSE, CBSE, ICSE, etc.)',
        status: 'pending',
        icon: DocumentMagnifyingGlassIcon
      },
      {
        id: 'data_normalization',
        title: 'Data Normalization',
        description: 'Converting scores to standardized format',
        status: 'pending',
        icon: ChartBarIcon
      }
    ]
  },
  {
    id: 'repository_storage',
    title: 'Creating Permanent Student Repository',
    description: 'Securely storing processed data in student\'s permanent record',
    status: 'pending',
    icon: FolderIcon,
    estimatedTime: '15 seconds'
  },
  {
    id: 'score_aggregation',
    title: 'Score Aggregation with Historical Data',
    description: 'Combining new data with existing records for comprehensive analysis',
    status: 'pending',
    icon: PlusIcon,
    estimatedTime: '20 seconds'
  },
  {
    id: 'additional_data_collection',
    title: 'Physical & Psychological Data Collection',
    description: 'Requesting additional information for complete 360° assessment',
    status: 'pending',
    icon: HeartIcon,
    estimatedTime: 'User input required'
  },
  {
    id: 'edusight_calculation',
    title: 'EduSight 360° Score Calculation',
    description: 'Computing comprehensive assessment score across all domains',
    status: 'pending',
    icon: ChartPieIcon,
    estimatedTime: '30 seconds'
  },
  {
    id: 'visualization',
    title: 'Generating Reports & Visualizations',
    description: 'Creating comprehensive charts, graphs, and detailed reports',
    status: 'pending',
    icon: EyeIcon,
    estimatedTime: '45 seconds'
  }
];

const UploadWorkflow = memo(function UploadWorkflow({ documentId, studentId, onComplete, onError }: UploadWorkflowProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showFrameworkAlert, setShowFrameworkAlert] = useState(false);
  const [showFrameworkSelection, setShowFrameworkSelection] = useState(false);
  const [detectedFramework, setDetectedFramework] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [multipleFrameworks, setMultipleFrameworks] = useState<any[]>([]);
  const [missingFrameworks, setMissingFrameworks] = useState<string[]>([]);

  const updateStepStatus = useCallback((stepId: string, status: WorkflowStep['status'], progress?: number, error?: string, details?: string[]) => {
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
  }, []);

  const updateSubStepStatus = useCallback((parentId: string, subStepId: string, status: WorkflowStep['status'], progress?: number) => {
    setSteps(prev => prev.map(step => {
      if (step.id === parentId && step.subSteps) {
        const updatedSubSteps = step.subSteps.map(subStep => 
          subStep.id === subStepId ? { ...subStep, status, progress } : subStep
        );
        return { ...step, subSteps: updatedSubSteps };
      }
      return step;
    }));
  }, []);

  const processStep = async (stepIndex: number) => {
    const step = steps[stepIndex];
    updateStepStatus(step.id, 'in_progress', 0);

    try {
      switch (step.id) {
        case 'data_acquisition':
          await processDataAcquisition(step);
          break;
        case 'ml_analysis':
          await processMLAnalysis(step);
          break;
        case 'framework_detection':
          await processFrameworkDetection(step);
          break;
        case 'repository_storage':
          await processRepositoryStorage(step);
          break;
        case 'score_aggregation':
          await processScoreAggregation(step);
          break;
        case 'additional_data_collection':
          await processAdditionalDataCollection(step);
          break;
        case 'edusight_calculation':
          await processEduSightCalculation(step);
          break;
        case 'visualization':
          await processVisualization(step);
          break;
      }
      
      updateStepStatus(step.id, 'completed', 100);
      
      // Move to next step
      if (stepIndex < steps.length - 1) {
        setCurrentStep(stepIndex + 1);
        setTimeout(() => processStep(stepIndex + 1), 500);
      } else {
        setIsRunning(false);
        onComplete?.({
          studentId,
          documentId,
          framework: detectedFramework,
          missingFrameworks,
          completed: true,
          reportUrl: `/reports/${documentId}`
        });
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
    
    const response = await fetch(`/api/documents/${documentId}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, step: 'parse' })
    });
    
    if (!response.ok) throw new Error('Failed to parse file');
    
    updateSubStepStatus(step.id, 'file_parsing', 'completed');
    
    // Process data validation
    updateSubStepStatus(step.id, 'data_validation', 'in_progress');
    
    const validationResponse = await fetch(`/api/documents/${documentId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId })
    });
    
    if (!validationResponse.ok) throw new Error('Data validation failed');
    
    updateSubStepStatus(step.id, 'data_validation', 'completed');
  };

  const processMLAnalysis = async (step: WorkflowStep) => {
    // Academic analysis
    updateSubStepStatus(step.id, 'academic_analysis', 'in_progress');
    
    const academicResponse = await fetch(`/api/ml/academic-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, studentId })
    });
    
    if (!academicResponse.ok) throw new Error('Academic analysis failed');
    
    updateSubStepStatus(step.id, 'academic_analysis', 'completed');
    
    // Behavioral analysis
    updateSubStepStatus(step.id, 'behavioral_analysis', 'in_progress');
    
    const behavioralResponse = await fetch(`/api/ml/behavioral-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, studentId })
    });
    
    if (!behavioralResponse.ok) throw new Error('Behavioral analysis failed');
    
    updateSubStepStatus(step.id, 'behavioral_analysis', 'completed');
    
    // Career prediction
    updateSubStepStatus(step.id, 'career_prediction', 'in_progress');
    
    const careerResponse = await fetch(`/api/ml/career-prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, studentId })
    });
    
    if (!careerResponse.ok) throw new Error('Career prediction failed');
    
    updateSubStepStatus(step.id, 'career_prediction', 'completed');
  };

  const processFrameworkDetection = async (step: WorkflowStep) => {
    // Framework identification
    updateSubStepStatus(step.id, 'framework_identification', 'in_progress');
    
    const frameworkResponse = await fetch(`/api/frameworks/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, studentId })
    });
    
    if (!frameworkResponse.ok) throw new Error('Framework detection failed');
    
    const frameworkData = await frameworkResponse.json();
    setDetectedFramework(frameworkData.framework);
    setMultipleFrameworks(frameworkData.multipleFrameworks || []);
    
    // Check if multiple frameworks are detected and require selection
    if (frameworkData.requiresSelection && frameworkData.multipleFrameworks.length > 1) {
      setShowFrameworkSelection(true);
      updateStepStatus(step.id, 'in_progress', 50, undefined, [
        'Multiple frameworks detected',
        'Please select the primary framework for accurate analysis',
        'Waiting for user selection...'
      ]);
      
      // Pause here - workflow will continue after framework selection
      return;
    }
    
    if (!frameworkData.framework || frameworkData.framework === 'unknown') {
      setShowFrameworkAlert(true);
      setMissingFrameworks(frameworkData.suggestedFrameworks || []);
    }
    
    updateSubStepStatus(step.id, 'framework_identification', 'completed');
    
    // Proceed with normalization
    await continueWithNormalization(step, frameworkData.framework || 'generic');
  };

  const continueWithNormalization = async (step: WorkflowStep, framework: string) => {
    // Data normalization
    updateSubStepStatus(step.id, 'data_normalization', 'in_progress');
    
    const normalizationResponse = await fetch(`/api/frameworks/normalize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        documentId, 
        studentId, 
        framework 
      })
    });
    
    if (!normalizationResponse.ok) throw new Error('Data normalization failed');
    
    updateSubStepStatus(step.id, 'data_normalization', 'completed');
  };

  const handleFrameworkSelection = async (framework: string) => {
    setSelectedFramework(framework);
    setShowFrameworkSelection(false);
    
    // Update the current step to show selection made
    const currentStepData = steps[currentStep];
    if (currentStepData?.id === 'framework_detection') {
      updateStepStatus(currentStepData.id, 'in_progress', 75, undefined, [
        `Framework selected: ${framework}`,
        'Proceeding with data normalization...'
      ]);
      
      // Continue with normalization
      await continueWithNormalization(currentStepData, framework);
      
      // Mark step as completed and continue workflow
      updateStepStatus(currentStepData.id, 'completed', 100);
      
      // Move to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeout(() => processStep(currentStep + 1), 500);
      } else {
        setIsRunning(false);
        onComplete?.({
          studentId,
          documentId,
          framework: framework,
          selectedFramework: framework,
          multipleFrameworks,
          missingFrameworks,
          completed: true,
          reportUrl: `/reports/${documentId}`
        });
      }
    }
  };

  const processRepositoryStorage = async (step: WorkflowStep) => {
    const response = await fetch(`/api/students/${studentId}/repository`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, action: 'store' })
    });
    
    if (!response.ok) throw new Error('Failed to store in repository');
    
    updateStepStatus(step.id, 'in_progress', 50);
    
    // Simulate progress
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const processScoreAggregation = async (step: WorkflowStep) => {
    const response = await fetch(`/api/students/${studentId}/scores/aggregate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId })
    });
    
    if (!response.ok) throw new Error('Score aggregation failed');
    
    updateStepStatus(step.id, 'in_progress', 50);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const processAdditionalDataCollection = async (step: WorkflowStep) => {
    // This step requires user interaction - we'll trigger a modal/form
    updateStepStatus(step.id, 'in_progress', 0, undefined, [
      'Physical assessment data needed',
      'Psychological evaluation required',
      'Please complete the additional forms'
    ]);
    
    // For now, simulate completion after a short delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateStepStatus(step.id, 'completed', 100);
  };

  const processEduSightCalculation = async (step: WorkflowStep) => {
    const response = await fetch(`/api/students/${studentId}/edusight-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        documentId,
        framework: detectedFramework,
        missingFrameworks 
      })
    });
    
    if (!response.ok) throw new Error('EduSight 360° calculation failed');
    
    updateStepStatus(step.id, 'in_progress', 50);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateStepStatus(step.id, 'in_progress', 100);
  };

  const processVisualization = async (step: WorkflowStep) => {
    const response = await fetch(`/api/students/${studentId}/visualizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId })
    });
    
    if (!response.ok) throw new Error('Visualization generation failed');
    
    updateStepStatus(step.id, 'in_progress', 30);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateStepStatus(step.id, 'in_progress', 70);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-cyan-50/30 pointer-events-none" />
      
      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-4 right-4 w-3 h-3 bg-blue-400/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-8 left-8 w-2 h-2 bg-purple-400/40 rounded-full"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-6 right-12 w-4 h-4 bg-cyan-400/25 rounded-full"
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.5, 1],
            opacity: [0.25, 0.6, 0.25]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Processing Workflow
            </h2>
            {isRunning && (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-2 bg-purple-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-cyan-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            )}
          </div>
          <p className="text-gray-600">Your documents are being processed through our comprehensive AI-powered analysis system</p>
          
          {/* Overall Progress Bar */}
          {isRunning && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 h-3 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-white/30 to-transparent rounded-full"
                    animate={{ x: [-100, 300] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
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
                <h3 className="text-sm font-medium text-yellow-800">Academic Framework Not Detected</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  We couldn't automatically detect the academic framework. The analysis will continue using our generic framework, 
                  but results may be less precise. A note will be included in the final report.
                </p>
                {missingFrameworks.length > 0 && (
                  <p className="text-sm text-yellow-700 mt-1">
                    Suggested frameworks: {missingFrameworks.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              x: 0, 
              scale: step.status === 'in_progress' ? 1.02 : 1,
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              scale: { duration: 0.3 }
            }}
            className={`relative p-4 rounded-xl border-2 transition-all duration-500 overflow-hidden ${
              step.status === 'completed' 
                ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-100'
                : step.status === 'in_progress'
                ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-100'
                : step.status === 'error'
                ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg shadow-red-100'
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'
            }`}
          >
            {/* Animated Background for Active Step */}
            {step.status === 'in_progress' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-cyan-400/10"
                animate={{
                  x: [-300, 300],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Success Glow Effect */}
            {step.status === 'completed' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <motion.div 
                  className={`relative p-2 rounded-full ${
                    step.status === 'completed' 
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                      : step.status === 'in_progress'
                      ? 'bg-gradient-to-br from-blue-100 to-indigo-100'
                      : step.status === 'error'
                      ? 'bg-gradient-to-br from-red-100 to-pink-100'
                      : 'bg-gray-100'
                  }`}
                  animate={step.status === 'in_progress' ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: step.status === 'in_progress' ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  {/* Pulsing Ring for Active Step */}
                  {step.status === 'in_progress' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{
                        scale: [1, 1.5],
                        opacity: [0.5, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                  )}
                  
                  {/* Success Checkmark Animation */}
                  {step.status === 'completed' && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-green-500/20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )}
                  
                  <motion.div
                    animate={step.status === 'in_progress' ? {
                      rotate: 360
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: step.status === 'in_progress' ? Infinity : 0,
                      ease: "linear"
                    }}
                  >
                    <step.icon className={`w-6 h-6 ${
                      step.status === 'completed' 
                        ? 'text-green-600'
                        : step.status === 'in_progress'
                        ? 'text-blue-600'
                        : step.status === 'error'
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`} />
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  {getStepIcon(step.status)}
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                
                {step.estimatedTime && step.status === 'pending' && (
                  <p className="text-xs text-gray-500 mt-1">Estimated time: {step.estimatedTime}</p>
                )}
                
                {step.status === 'in_progress' && step.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
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
                  <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-700">
                    {step.error}
                  </div>
                )}
                
                {step.details && step.details.length > 0 && (
                  <div className="mt-2">
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Sub-steps */}
                {step.subSteps && step.subSteps.length > 0 && step.status !== 'pending' && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-2">
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

      {/* Action Button */}
      <div className="mt-6 flex justify-center">
        {!isRunning && currentStep === 0 && (
          <button
            onClick={startWorkflow}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Processing
          </button>
        )}
        
        {isRunning && (
          <div className="flex items-center space-x-2 text-blue-600">
            <ClockIcon className="w-5 h-5 animate-spin" />
            <span className="font-medium">Processing...</span>
          </div>
        )}
        
        {!isRunning && currentStep >= steps.length && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium">Processing Complete!</span>
          </div>
        )}
      </div>

      {/* Framework Selection Modal */}
      <FrameworkSelectionModal
        isOpen={showFrameworkSelection}
        frameworks={multipleFrameworks}
        onSelect={handleFrameworkSelection}
        onClose={() => setShowFrameworkSelection(false)}
      />
      </div>
    </div>
  );
});

export default UploadWorkflow;
