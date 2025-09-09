'use client';

import React, { useState, useCallback } from 'react';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { WorkflowState, WorkflowStage, StudentProfile, AnalysisResult } from '@/types/assessment';
import { DataAcquisitionStage } from './stages/DataAcquisitionStage';
import { DataValidationStage } from './stages/DataValidationStage';
import { AnalysisStage } from './stages/AnalysisStage';
import { ReportGenerationStage } from './stages/ReportGenerationStage';
import { toast } from 'react-hot-toast';

const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'data-acquisition',
    name: 'Data Acquisition',
    description: 'Upload and extract data from documents',
    status: 'PENDING'
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    description: 'Review and validate extracted data',
    status: 'PENDING'
  },
  {
    id: 'analysis',
    name: 'ML Analysis',
    description: 'Generate insights and predictions',
    status: 'PENDING'
  },
  {
    id: 'report-generation',
    name: 'Report Generation',
    description: 'Create branded PDF report',
    status: 'PENDING'
  }
];

export function Edusight360Workflow() {
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStage: 0,
    stages: WORKFLOW_STAGES,
    isComplete: false
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

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
      toast.success('Edusight 360 Analysis Complete!');
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
      case 'data-acquisition':
        return <DocumentArrowUpIcon className="h-5 w-5" />;
      case 'data-validation':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'analysis':
        return <SparklesIcon className="h-5 w-5" />;
      case 'report-generation':
        return <ChartBarIcon className="h-5 w-5" />;
      default:
        return <AcademicCapIcon className="h-5 w-5" />;
    }
  };

  const renderCurrentStage = () => {
    const currentStage = workflowState.stages[workflowState.currentStage];
    
    switch (currentStage.id) {
      case 'data-acquisition':
        return (
          <DataAcquisitionStage
            onComplete={(data) => handleStageComplete(0, data)}
            onError={(error) => handleStageError(0, error)}
          />
        );
      case 'data-validation':
        return (
          <DataValidationStage
            data={workflowState.stages[0].data}
            onComplete={(data) => handleStageComplete(1, data)}
            onError={(error) => handleStageError(1, error)}
          />
        );
      case 'analysis':
        return (
          <AnalysisStage
            studentProfile={studentProfile}
            onComplete={(result) => {
              setAnalysisResult(result);
              handleStageComplete(2, result);
            }}
            onError={(error) => handleStageError(2, error)}
          />
        );
      case 'report-generation':
        return (
          <ReportGenerationStage
            studentProfile={studentProfile}
            analysisResult={analysisResult}
            onComplete={(data) => handleStageComplete(3, data)}
            onError={(error) => handleStageError(3, error)}
          />
        );
      default:
        return <div>Unknown stage</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edusight 360° Assessment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive analysis combining academic performance, psychometric profiling, 
            and career guidance for holistic student development
          </p>
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

          {renderCurrentStage()}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={moveToPreviousStage}
              disabled={workflowState.currentStage === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </button>
            
            <div className="text-sm text-gray-500">
              Step {workflowState.currentStage + 1} of {workflowState.stages.length}
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {workflowState.isComplete && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Analysis Complete!
                </h3>
                <p className="text-green-700">
                  Your Edusight 360° report has been generated and is ready for download.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
