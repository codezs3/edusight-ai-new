'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
  ArrowRightIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  UserIcon,
  CogIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { 
  WorkflowState, 
  WorkflowStage, 
  StudentProfile, 
  AnalysisResult, 
  UnifiedWorkflowConfig,
  AssessmentDomain,
  AgeGroup
} from '@/types/assessment';
import { 
  getAgeGroup, 
  getFrameworksForAgeGroup, 
  getAssessmentTypesForAgeGroup,
  AGE_GROUP_CONFIGS 
} from '@/lib/age-appropriate-frameworks';
import { DataAcquisitionStage } from './stages/DataAcquisitionStage';
import { DataValidationStage } from './stages/DataValidationStage';
import { AnalysisStage } from './stages/AnalysisStage';
import { ReportGenerationStage } from './stages/ReportGenerationStage';
import { FrameworkSelectionStage } from './stages/FrameworkSelectionStage';
import { AssessmentConfigurationStage } from './stages/AssessmentConfigurationStage';

interface EnhancedUnifiedWorkflowProps {
  userRole: 'ADMIN' | 'PARENT' | 'SCHOOL_ADMIN' | 'TEACHER';
  studentId?: string;
  studentName?: string;
  studentAge?: number;
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
  showUpload?: boolean;
  initialFiles?: File[];
}

export default function EnhancedUnifiedWorkflow({ 
  userRole, 
  studentId, 
  studentName = 'Student',
  studentAge = 15,
  onComplete, 
  onError,
  showUpload = true,
  initialFiles = []
}: EnhancedUnifiedWorkflowProps) {
  const { data: session } = useSession();
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStage: 0,
    stages: [],
    isComplete: false
  });
  const [workflowConfig, setWorkflowConfig] = useState<UnifiedWorkflowConfig>({
    studentAge,
    selectedFrameworks: {},
    assessmentTypes: {
      academic: [],
      psychometric: [],
      physical: []
    },
    customizations: {
      includeCareerMapping: true,
      includePredictions: true,
      includeComparativeAnalysis: true,
      reportType: 'COMPREHENSIVE'
    }
  });
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Initialize workflow stages based on configuration
  useEffect(() => {
    const ageGroup = getAgeGroup(studentAge);
    const config = AGE_GROUP_CONFIGS[ageGroup];
    
    const stages: WorkflowStage[] = [
      {
        id: 'framework-selection',
        name: 'Framework Selection',
        description: 'Select age-appropriate assessment frameworks',
        status: 'PENDING',
        domain: 'ACADEMIC'
      },
      {
        id: 'assessment-configuration',
        name: 'Assessment Configuration',
        description: 'Configure assessment types and methods',
        status: 'PENDING',
        domain: 'ACADEMIC'
      },
      {
        id: 'data-acquisition',
        name: 'Data Acquisition',
        description: 'Upload and extract data from documents',
        status: 'PENDING',
        domain: 'ACADEMIC',
        subStages: [
          {
            id: 'academic-upload',
            name: 'Academic Data Upload',
            description: 'Upload academic documents and assessments',
            status: 'PENDING',
            domain: 'ACADEMIC'
          },
          {
            id: 'psychometric-upload',
            name: 'Psychometric Data Upload',
            description: 'Upload psychometric assessments and surveys',
            status: 'PENDING',
            domain: 'PSYCHOMETRIC'
          },
          {
            id: 'physical-upload',
            name: 'Physical Assessment Upload',
            description: 'Upload physical education and fitness data',
            status: 'PENDING',
            domain: 'PHYSICAL'
          }
        ]
      },
      {
        id: 'data-validation',
        name: 'Data Validation',
        description: 'Review and validate extracted data',
        status: 'PENDING',
        domain: 'ACADEMIC',
        subStages: [
          {
            id: 'academic-validation',
            name: 'Academic Data Validation',
            description: 'Review academic scores and grades',
            status: 'PENDING',
            domain: 'ACADEMIC'
          },
          {
            id: 'psychometric-validation',
            name: 'Psychometric Data Validation',
            description: 'Review personality and behavioral assessments',
            status: 'PENDING',
            domain: 'PSYCHOMETRIC'
          },
          {
            id: 'physical-validation',
            name: 'Physical Data Validation',
            description: 'Review fitness and health metrics',
            status: 'PENDING',
            domain: 'PHYSICAL'
          }
        ]
      },
      {
        id: 'analysis',
        name: 'AI Analysis',
        description: 'Generate comprehensive insights and predictions',
        status: 'PENDING',
        domain: 'ACADEMIC',
        subStages: [
          {
            id: 'academic-analysis',
            name: 'Academic Performance Analysis',
            description: 'Analyze academic performance patterns',
            status: 'PENDING',
            domain: 'ACADEMIC'
          },
          {
            id: 'psychometric-analysis',
            name: 'Psychometric Profiling',
            description: 'Generate personality and behavioral insights',
            status: 'PENDING',
            domain: 'PSYCHOMETRIC'
          },
          {
            id: 'physical-analysis',
            name: 'Physical Assessment Analysis',
            description: 'Analyze fitness and health metrics',
            status: 'PENDING',
            domain: 'PHYSICAL'
          },
          {
            id: 'integrated-analysis',
            name: 'Integrated 360° Analysis',
            description: 'Combine all domains for holistic insights',
            status: 'PENDING',
            domain: 'ACADEMIC'
          }
        ]
      },
      {
        id: 'report-generation',
        name: 'Report Generation',
        description: 'Create comprehensive branded PDF report',
        status: 'PENDING',
        domain: 'ACADEMIC'
      }
    ];

    setWorkflowState(prev => ({
      ...prev,
      stages
    }));
  }, [studentAge]);

  const updateStageStatus = useCallback((stageIndex: number, status: WorkflowStage['status'], data?: any, error?: string) => {
    setWorkflowState(prev => ({
      ...prev,
      stages: prev.stages.map((stage, index) => 
        index === stageIndex 
          ? { ...stage, status, data, error }
          : stage
      )
    }));
  }, []);

  const moveToNextStage = useCallback(() => {
    setWorkflowState(prev => ({
      ...prev,
      currentStage: Math.min(prev.currentStage + 1, prev.stages.length - 1)
    }));
  }, []);

  const moveToPreviousStage = useCallback(() => {
    setWorkflowState(prev => ({
      ...prev,
      currentStage: Math.max(prev.currentStage - 1, 0)
    }));
  }, []);

  const handleStageComplete = useCallback((stageIndex: number, data: any) => {
    updateStageStatus(stageIndex, 'COMPLETED', data);
    
    if (stageIndex < workflowState.stages.length - 1) {
      moveToNextStage();
    } else {
      setWorkflowState(prev => ({ ...prev, isComplete: true }));
      toast.success('Enhanced 360° Assessment Complete!');
    }
  }, [updateStageStatus, moveToNextStage, workflowState.stages.length]);

  const handleStageError = useCallback((stageIndex: number, error: string) => {
    updateStageStatus(stageIndex, 'ERROR', null, error);
    toast.error(`Stage ${stageIndex + 1} failed: ${error}`);
  }, [updateStageStatus]);

  const getStageIcon = (stage: WorkflowStage) => {
    switch (stage.status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'IN_PROGRESS':
        return <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'ERROR':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <div className="h-6 w-6 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStageIconForId = (stageId: string) => {
    switch (stageId) {
      case 'framework-selection':
        return <CogIcon className="h-5 w-5" />;
      case 'assessment-configuration':
        return <BeakerIcon className="h-5 w-5" />;
      case 'data-acquisition':
        return <CloudArrowUpIcon className="h-5 w-5" />;
      case 'data-validation':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'analysis':
        return <SparklesIcon className="h-5 w-5" />;
      case 'report-generation':
        return <DocumentArrowDownIcon className="h-5 w-5" />;
      default:
        return <AcademicCapIcon className="h-5 w-5" />;
    }
  };

  const getDomainColor = (domain?: AssessmentDomain) => {
    switch (domain) {
      case 'ACADEMIC':
        return 'text-blue-600 bg-blue-100';
      case 'PSYCHOMETRIC':
        return 'text-purple-600 bg-purple-100';
      case 'PHYSICAL':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const renderCurrentStage = () => {
    const currentStage = workflowState.stages[workflowState.currentStage];
    
    switch (currentStage.id) {
      case 'framework-selection':
        return (
          <FrameworkSelectionStage
            studentAge={studentAge}
            workflowConfig={workflowConfig}
            onConfigUpdate={setWorkflowConfig}
            onComplete={(data) => handleStageComplete(0, data)}
            onError={(error) => handleStageError(0, error)}
          />
        );
      case 'assessment-configuration':
        return (
          <AssessmentConfigurationStage
            workflowConfig={workflowConfig}
            onConfigUpdate={setWorkflowConfig}
            onComplete={(data) => handleStageComplete(1, data)}
            onError={(error) => handleStageError(1, error)}
          />
        );
      case 'data-acquisition':
        return (
          <DataAcquisitionStage
            workflowConfig={workflowConfig}
            onComplete={(data) => handleStageComplete(2, data)}
            onError={(error) => handleStageError(2, error)}
          />
        );
      case 'data-validation':
        return (
          <DataValidationStage
            data={workflowState.stages[2].data}
            workflowConfig={workflowConfig}
            onComplete={(data) => handleStageComplete(3, data)}
            onError={(error) => handleStageError(3, error)}
          />
        );
      case 'analysis':
        return (
          <AnalysisStage
            studentProfile={studentProfile}
            workflowConfig={workflowConfig}
            onComplete={(result) => {
              setAnalysisResult(result);
              handleStageComplete(4, result);
            }}
            onError={(error) => handleStageError(4, error)}
          />
        );
      case 'report-generation':
        return (
          <ReportGenerationStage
            studentProfile={studentProfile}
            analysisResult={analysisResult}
            workflowConfig={workflowConfig}
            onComplete={(data) => handleStageComplete(5, data)}
            onError={(error) => handleStageError(5, error)}
          />
        );
      default:
        return <div>Unknown stage</div>;
    }
  };

  const ageGroup = getAgeGroup(studentAge);
  const ageConfig = AGE_GROUP_CONFIGS[ageGroup];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enhanced Edusight 360° Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
            Comprehensive age-appropriate analysis combining academic performance, 
            psychometric profiling, and physical assessment for holistic student development
          </p>
          
          {/* Student Info */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-2" />
              <span><strong>Student:</strong> {studentName}</span>
            </div>
            <div className="flex items-center">
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              <span><strong>Age Group:</strong> {ageConfig.description}</span>
            </div>
            <div className="flex items-center">
              <CogIcon className="h-4 w-4 mr-2" />
              <span><strong>Age:</strong> {studentAge} years</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {workflowState.stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    index <= workflowState.currentStage 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {getStageIcon(stage)}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${
                      index <= workflowState.currentStage ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {stage.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stage.description}
                    </p>
                    {stage.domain && (
                      <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getDomainColor(stage.domain)}`}>
                        {stage.domain}
                      </span>
                    )}
                  </div>
                </div>
                {index < workflowState.stages.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < workflowState.currentStage ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stage Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {workflowState.stages.length > 0 && workflowState.stages[workflowState.currentStage] ? (
            <>
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                  {getStageIconForId(workflowState.stages[workflowState.currentStage].id)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {workflowState.stages[workflowState.currentStage].name}
                  </h2>
                  <p className="text-gray-600">
                    {workflowState.stages[workflowState.currentStage].description}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Initializing workflow...</span>
            </div>
          )}

          {workflowState.stages.length > 0 && workflowState.stages[workflowState.currentStage] && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={workflowState.currentStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentStage()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={moveToPreviousStage}
                  disabled={workflowState.currentStage === 0}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowRightIcon className="h-5 w-5 mr-2 rotate-180" />
                  Previous
                </button>
                
                <div className="text-sm text-gray-500">
                  Step {workflowState.currentStage + 1} of {workflowState.stages.length}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Completion Message */}
        {workflowState.isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Enhanced 360° Assessment Complete!
                </h3>
                <p className="text-green-700">
                  Your comprehensive age-appropriate assessment report has been generated and is ready for download.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
