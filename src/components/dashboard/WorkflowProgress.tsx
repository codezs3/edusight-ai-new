'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowUpIcon,
  CpuChipIcon,
  DocumentTextIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid
} from '@heroicons/react/24/solid';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'in_progress' | 'completed' | 'error' | 'paused';
  progress: number;
  estimatedTime?: string;
  completedAt?: string;
  errorMessage?: string;
  subSteps?: Array<{
    id: string;
    title: string;
    status: 'pending' | 'completed' | 'error';
  }>;
}

interface WorkflowProgressProps {
  studentId?: string;
  onStepClick?: (stepId: string) => void;
}

export function WorkflowProgress({ studentId, onStepClick }: WorkflowProgressProps) {
  const [mounted, setMounted] = useState(false);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'signup',
      title: 'Account Setup',
      description: 'Parent registration and subscription activation',
      icon: UserGroupIcon,
      status: 'completed',
      progress: 100,
      completedAt: '2024-01-15 09:30 AM',
      subSteps: [
        { id: 'registration', title: 'Account Registration', status: 'completed' },
        { id: 'payment', title: 'Payment Processing', status: 'completed' },
        { id: 'verification', title: 'Email Verification', status: 'completed' }
      ]
    },
    {
      id: 'dashboard_access',
      title: 'Dashboard Access',
      description: 'Personalized parent dashboard setup and configuration',
      icon: ChartBarIcon,
      status: 'completed',
      progress: 100,
      completedAt: '2024-01-15 09:35 AM',
      subSteps: [
        { id: 'profile_setup', title: 'Profile Setup', status: 'completed' },
        { id: 'student_profile', title: 'Student Profile Creation', status: 'completed' },
        { id: 'preferences', title: 'Notification Preferences', status: 'completed' }
      ]
    },
    {
      id: 'data_upload',
      title: 'Data Upload',
      description: 'Upload academic, physical, and psychological data',
      icon: DocumentArrowUpIcon,
      status: 'in_progress',
      progress: 65,
      estimatedTime: '5 minutes remaining',
      subSteps: [
        { id: 'academic_data', title: 'Academic Records (Excel)', status: 'completed' },
        { id: 'physical_data', title: 'Physical Assessment (PDF)', status: 'completed' },
        { id: 'psychological_data', title: 'Psychological Tests (CSV)', status: 'pending' }
      ]
    },
    {
      id: 'ai_processing',
      title: 'AI Processing',
      description: 'Machine learning analysis of uploaded data',
      icon: CpuChipIcon,
      status: 'pending',
      progress: 0,
      estimatedTime: '10-15 minutes',
      subSteps: [
        { id: 'data_validation', title: 'Data Validation & Cleaning', status: 'pending' },
        { id: 'ml_analysis', title: 'ML Algorithm Processing', status: 'pending' },
        { id: 'pattern_recognition', title: 'Pattern Recognition', status: 'pending' }
      ]
    },
    {
      id: 'e360_calculation',
      title: 'E360 Score Calculation',
      description: 'Comprehensive scoring across all three domains',
      icon: SparklesIcon,
      status: 'pending',
      progress: 0,
      estimatedTime: '5 minutes',
      subSteps: [
        { id: 'academic_scoring', title: 'Academic Domain Scoring', status: 'pending' },
        { id: 'physical_scoring', title: 'Physical Domain Scoring', status: 'pending' },
        { id: 'psychological_scoring', title: 'Psychological Domain Scoring', status: 'pending' },
        { id: 'overall_calculation', title: 'Overall E360 Score', status: 'pending' }
      ]
    },
    {
      id: 'report_generation',
      title: 'Report Generation',
      description: 'Creating comprehensive PDF report with insights',
      icon: DocumentTextIcon,
      status: 'pending',
      progress: 0,
      estimatedTime: '3-5 minutes',
      subSteps: [
        { id: 'data_compilation', title: 'Data Compilation', status: 'pending' },
        { id: 'chart_generation', title: 'Chart & Graph Generation', status: 'pending' },
        { id: 'pdf_creation', title: 'PDF Report Creation', status: 'pending' },
        { id: 'branding', title: 'Branding & Formatting', status: 'pending' }
      ]
    },
    {
      id: 'career_mapping',
      title: 'Career Mapping',
      description: 'AI-powered career recommendations and pathways',
      icon: TrophyIcon,
      status: 'pending',
      progress: 0,
      estimatedTime: '2-3 minutes',
      subSteps: [
        { id: 'career_analysis', title: 'Career Aptitude Analysis', status: 'pending' },
        { id: 'pathway_mapping', title: 'Career Pathway Mapping', status: 'pending' },
        { id: 'recommendations', title: 'Personalized Recommendations', status: 'pending' }
      ]
    }
  ]);

  const [isAutoProgress, setIsAutoProgress] = useState(true);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  // Simulate workflow progress
  useEffect(() => {
    setMounted(true);
  }, []);

  const getTimeString = () => {
    if (typeof window === 'undefined' || !mounted) {
      return 'Just now';
    }
    return 'January 1, 2025 12:00:00 PM';
  };

  useEffect(() => {
    if (!isAutoProgress) return;

    const timer = setInterval(() => {
      setWorkflowSteps(prev => {
        const updated = [...prev];
        const currentStepIndex = updated.findIndex(step => step.status === 'in_progress');
        
        if (currentStepIndex !== -1) {
          const currentStep = updated[currentStepIndex];
          if (currentStep.progress < 100) {
            currentStep.progress += 10; // Fixed increment instead of random
            if (currentStep.progress >= 100) {
              currentStep.progress = 100;
              currentStep.status = 'completed';
              currentStep.completedAt = getTimeString();
              
              // Start next step
              if (currentStepIndex + 1 < updated.length) {
                updated[currentStepIndex + 1].status = 'in_progress';
              }
            }
          }
        }
        
        return updated;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isAutoProgress]);

  const getStatusIcon = (status: WorkflowStep['status'], progress: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIconSolid className="w-6 h-6 text-green-500" />;
      case 'in_progress':
        return (
          <div className="relative">
            <ClockIconSolid className="w-6 h-6 text-blue-500" />
            <div className="absolute inset-0 animate-spin">
              <div className="w-6 h-6 border-2 border-transparent border-t-blue-500 rounded-full"></div>
            </div>
          </div>
        );
      case 'error':
        return <ExclamationTriangleIconSolid className="w-6 h-6 text-red-500" />;
      case 'paused':
        return <PauseIcon className="w-6 h-6 text-yellow-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-slate-400" />;
    }
  };

  const getStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'in_progress':
        return 'border-blue-500 bg-blue-50 shadow-lg';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'paused':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  const getProgressColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-300';
    }
  };

  const handleStepClick = (stepId: string) => {
    setSelectedStep(selectedStep === stepId ? null : stepId);
    onStepClick?.(stepId);
  };

  const toggleAutoProgress = () => {
    setIsAutoProgress(!isAutoProgress);
  };

  const restartWorkflow = () => {
    setWorkflowSteps(prev => prev.map((step, index) => ({
      ...step,
      status: index === 0 ? 'completed' : index === 1 ? 'completed' : index === 2 ? 'in_progress' : 'pending',
      progress: index === 0 ? 100 : index === 1 ? 100 : index === 2 ? 65 : 0,
      completedAt: index <= 1 ? 'Just now' : undefined,
      errorMessage: undefined
    })));
  };

  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const totalSteps = workflowSteps.length;
  const overallProgress = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Workflow Progress</h2>
          <p className="text-slate-600">Track your student's assessment journey in real-time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-slate-600">Complete</div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={toggleAutoProgress}
              className={`p-2 rounded-lg transition-colors ${
                isAutoProgress 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={isAutoProgress ? 'Pause Auto Progress' : 'Resume Auto Progress'}
            >
              {isAutoProgress ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </button>
            
            <button
              onClick={restartWorkflow}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              title="Restart Workflow"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className="text-sm text-slate-600">{completedSteps} of {totalSteps} steps completed</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => {
          const IconComponent = step.icon;
          const isExpanded = selectedStep === step.id;
          
          return (
            <div key={step.id} className="relative">
              {/* Connection Line */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-slate-200 z-0">
                  <div 
                    className={`w-full transition-all duration-1000 ${
                      step.status === 'completed' ? 'bg-green-500 h-full' : 'bg-slate-200 h-0'
                    }`}
                  />
                </div>
              )}
              
              {/* Step Card */}
              <div 
                className={`relative z-10 border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${getStatusColor(step.status)} ${
                  isExpanded ? 'ring-2 ring-blue-300' : ''
                }`}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(step.status, step.progress)}
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                        <div className="flex items-center space-x-2">
                          {step.status === 'in_progress' && (
                            <span className="text-sm font-medium text-blue-600">
                              {Math.round(step.progress)}%
                            </span>
                          )}
                          {step.completedAt && (
                            <span className="text-xs text-slate-500">{step.completedAt}</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-3">{step.description}</p>
                      
                      {/* Progress Bar */}
                      {(step.status === 'in_progress' || step.status === 'completed') && (
                        <div className="mb-3">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(step.status)}`}
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Status Messages */}
                      {step.estimatedTime && step.status !== 'completed' && (
                        <div className="flex items-center text-sm text-slate-600 mb-2">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {step.estimatedTime}
                        </div>
                      )}
                      
                      {step.errorMessage && (
                        <div className="flex items-center text-sm text-red-600 mb-2">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {step.errorMessage}
                        </div>
                      )}
                    </div>
                    
                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      <InformationCircleIcon 
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sub-steps (Expanded) */}
                {isExpanded && step.subSteps && (
                  <div className="mt-6 pl-10 border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Detailed Steps:</h4>
                    <div className="space-y-2">
                      {step.subSteps.map((subStep) => (
                        <div key={subStep.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-slate-100">
                          <div className="flex items-center space-x-3">
                            {subStep.status === 'completed' ? (
                              <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            ) : subStep.status === 'error' ? (
                              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                            ) : (
                              <ClockIcon className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="text-sm text-slate-700">{subStep.title}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            subStep.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : subStep.status === 'error'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {subStep.status === 'completed' ? 'Done' : subStep.status === 'error' ? 'Error' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
          View Detailed Report
        </button>
        <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
          Download Progress Summary
        </button>
      </div>
    </div>
  );
}
