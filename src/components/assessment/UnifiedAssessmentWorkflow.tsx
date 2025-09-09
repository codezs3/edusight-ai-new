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
  ArrowRightIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import PDFDownloadButton from './PDFDownloadButton';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progress: number;
  subSteps?: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
  }[];
}

interface UnifiedAssessmentWorkflowProps {
  userRole: 'ADMIN' | 'PARENT' | 'SCHOOL_ADMIN' | 'TEACHER';
  studentId?: string;
  studentName?: string;
  onComplete?: (results: any) => void;
  onError?: (error: string) => void;
}

export default function UnifiedAssessmentWorkflow({ 
  userRole, 
  studentId, 
  studentName = 'Student',
  onComplete, 
  onError 
}: UnifiedAssessmentWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'data_acquisition',
      title: 'Data Acquisition',
      description: 'Collecting and processing academic documents',
      status: 'pending',
      progress: 0,
      subSteps: [
        { id: 'doc_scan', title: 'Document Scanning', description: 'Extracting text and data from uploaded files', status: 'pending' },
        { id: 'data_validation', title: 'Data Validation', description: 'Verifying and cleaning extracted information', status: 'pending' },
        { id: 'framework_detection', title: 'Framework Detection', description: 'Identifying curriculum framework (CBSE, ICSE, IB, IGCSE)', status: 'pending' }
      ]
    },
    {
      id: 'ml_analysis',
      title: 'ML Analysis',
      description: 'AI-powered academic performance analysis',
      status: 'pending',
      progress: 0,
      subSteps: [
        { id: 'academic_analysis', title: 'Academic Analysis', description: 'Analyzing subject-wise performance patterns', status: 'pending' },
        { id: 'skill_assessment', title: 'Skill Assessment', description: 'Evaluating cognitive and learning skills', status: 'pending' },
        { id: 'pattern_recognition', title: 'Pattern Recognition', description: 'Identifying learning patterns and trends', status: 'pending' }
      ]
    },
    {
      id: 'data_normalization',
      title: 'Data Normalization',
      description: 'Standardizing data across different frameworks',
      status: 'pending',
      progress: 0,
      subSteps: [
        { id: 'framework_mapping', title: 'Framework Mapping', description: 'Converting scores to standardized format', status: 'pending' },
        { id: 'grade_alignment', title: 'Grade Alignment', description: 'Aligning with national/international standards', status: 'pending' }
      ]
    },
    {
      id: 'data_storage',
      title: 'Data Storage',
      description: 'Securely storing processed assessment data',
      status: 'pending',
      progress: 0,
      subSteps: [
        { id: 'database_storage', title: 'Database Storage', description: 'Storing structured assessment data', status: 'pending' },
        { id: 'backup_creation', title: 'Backup Creation', description: 'Creating secure data backups', status: 'pending' }
      ]
    },
    {
      id: 'score_aggregation',
      title: 'Score Aggregation',
      description: 'Calculating comprehensive performance scores',
      status: 'pending',
      progress: 0,
      subSteps: [
        { id: 'academic_scoring', title: 'Academic Scoring', description: 'Calculating subject-wise performance scores', status: 'pending' },
        { id: 'physical_scoring', title: 'Physical Scoring', description: 'Assessing physical health and development', status: 'pending' },
        { id: 'psychological_scoring', title: 'Psychological Scoring', description: 'Evaluating emotional and social development', status: 'pending' }
      ]
    },
    {
      id: 'edusight_360',
      title: 'EduSight 360° Score',
      description: 'Generating comprehensive 360-degree assessment',
      status: 'pending',
      progress: 0,
      subSteps: [
        { id: 'score_calculation', title: 'Score Calculation', description: 'Computing overall 360° performance score', status: 'pending' },
        { id: 'percentile_ranking', title: 'Percentile Ranking', description: 'Determining national percentile ranking', status: 'pending' },
        { id: 'insight_generation', title: 'Insight Generation', description: 'Generating personalized insights and recommendations', status: 'pending' }
      ]
    },
    {
      id: 'graph_generation',
      title: 'Graph Generation',
      description: 'Creating visual analytics and reports',
      status: 'pending',
      progress: 0,
      subSteps: [
        { id: 'chart_creation', title: 'Chart Creation', description: 'Generating performance charts and graphs', status: 'pending' },
        { id: 'report_compilation', title: 'Report Compilation', description: 'Compiling comprehensive assessment report', status: 'pending' }
      ]
    }
  ];

  const [steps, setSteps] = useState<WorkflowStep[]>(workflowSteps);

  const startWorkflow = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setSteps(workflowSteps.map(step => ({ ...step, status: 'pending', progress: 0 })));

    try {
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];
        
        // Update current step to in_progress
        setSteps(prev => prev.map((s, i) => 
          i === stepIndex ? { ...s, status: 'in_progress', progress: 0 } : s
        ));

        // Process sub-steps
        if (step.subSteps) {
          for (let subStepIndex = 0; subStepIndex < step.subSteps.length; subStepIndex++) {
            const subStep = step.subSteps[subStepIndex];
            
            // Update sub-step to in_progress
            setSteps(prev => prev.map((s, i) => 
              i === stepIndex ? {
                ...s,
                subSteps: s.subSteps?.map((sub, j) => 
                  j === subStepIndex ? { ...sub, status: 'in_progress' } : sub
                )
              } : s
            ));

            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

            // Update sub-step to completed
            setSteps(prev => prev.map((s, i) => 
              i === stepIndex ? {
                ...s,
                subSteps: s.subSteps?.map((sub, j) => 
                  j === subStepIndex ? { ...sub, status: 'completed' } : sub
                ),
                progress: ((subStepIndex + 1) / step.subSteps.length) * 100
              } : s
            ));
          }
        } else {
          // Simulate processing time for steps without sub-steps
          await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
          setSteps(prev => prev.map((s, i) => 
            i === stepIndex ? { ...s, progress: 100 } : s
          ));
        }

        // Mark step as completed
        setSteps(prev => prev.map((s, i) => 
          i === stepIndex ? { ...s, status: 'completed', progress: 100 } : s
        ));

        setCurrentStep(stepIndex + 1);
      }

      // Generate sample results
      const results = generateSampleResults();
      setAssessmentResults(results);
      setShowResults(true);
      
      if (onComplete) {
        onComplete(results);
      }

      toast.success('Assessment completed successfully!');

    } catch (error) {
      console.error('Workflow error:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Unknown error');
      }
      toast.error('Assessment failed');
    } finally {
      setIsRunning(false);
    }
  };

  const generateSampleResults = () => {
    return {
      student: {
        name: studentName,
        grade: 'Grade 10',
        school: userRole === 'SCHOOL_ADMIN' ? 'Your School' : 'Sample School',
        dateOfBirth: '2008-05-15',
        assessmentId: `ES-${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
      },
      scores: {
        academic: 82,
        physical: 75,
        psychological: 77,
        total: 78
      },
      breakdown: {
        academic: {
          mathematics: 88,
          science: 85,
          english: 75,
          socialStudies: 80
        },
        physical: {
          fitness: 78,
          health: 82,
          growth: 65
        },
        psychological: {
          emotional: 80,
          social: 85,
          behavioral: 70
        }
      },
      recommendations: [
        'Focus on creative writing and communication skills',
        'Continue developing mathematical and scientific reasoning',
        'Participate in team sports to improve physical endurance',
        'Consider leadership roles to enhance social skills'
      ],
      strengths: [
        'Strong analytical thinking and problem-solving abilities',
        'Excellent mathematical and scientific aptitude',
        'Well-developed social skills and emotional intelligence',
        'Natural leadership potential'
      ],
      areasForImprovement: [
        'Creative writing and expression',
        'Public speaking and communication',
        'Time management and organization',
        'Physical endurance and stamina'
      ]
    };
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'in_progress':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>;
      case 'error':
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-blue-200 bg-blue-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  if (showResults && assessmentResults) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Assessment Complete! 🎉</h2>
              <p className="text-green-100">
                Comprehensive analysis completed for {studentName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Report ID: {assessmentResults.student.assessmentId}</p>
              <p className="text-sm text-green-100">January 1, 2025</p>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">360° Assessment Score</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - assessmentResults.scores.total / 100)}`}
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{assessmentResults.scores.total}%</span>
                  <span className="text-sm text-gray-600">Excellent</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-700">
              <strong>{studentName}</strong> demonstrates <strong>excellent overall performance</strong> across all assessment domains.
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Academic</h4>
              <span className="text-2xl font-bold text-blue-600">{assessmentResults.scores.academic}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${assessmentResults.scores.academic}%` }}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Mathematics</span>
                <span className="font-semibold text-green-600">{assessmentResults.breakdown.academic.mathematics}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Science</span>
                <span className="font-semibold text-green-600">{assessmentResults.breakdown.academic.science}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">English</span>
                <span className="font-semibold text-yellow-600">{assessmentResults.breakdown.academic.english}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Physical</h4>
              <span className="text-2xl font-bold text-green-600">{assessmentResults.scores.physical}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-green-600 h-3 rounded-full" style={{ width: `${assessmentResults.scores.physical}%` }}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fitness</span>
                <span className="font-semibold text-green-600">{assessmentResults.breakdown.physical.fitness}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Health</span>
                <span className="font-semibold text-green-600">{assessmentResults.breakdown.physical.health}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Growth</span>
                <span className="font-semibold text-yellow-600">{assessmentResults.breakdown.physical.growth}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Psychological</h4>
              <span className="text-2xl font-bold text-purple-600">{assessmentResults.scores.psychological}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${assessmentResults.scores.psychological}%` }}></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Emotional</span>
                <span className="font-semibold text-green-600">{assessmentResults.breakdown.psychological.emotional}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Social</span>
                <span className="font-semibold text-green-600">{assessmentResults.breakdown.psychological.social}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Behavioral</span>
                <span className="font-semibold text-yellow-600">{assessmentResults.breakdown.psychological.behavioral}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Download */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Report</h3>
          <PDFDownloadButton
            assessmentData={assessmentResults}
            userRole={userRole}
            paymentStatus="PAID"
            isDemo={true}
          />
        </div>

        {/* Restart Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setShowResults(false);
              setAssessmentResults(null);
              setCurrentStep(0);
            }}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Run Another Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          EduSight 360° Assessment Workflow
        </h2>
        <p className="text-gray-600">
          Comprehensive analysis for {studentName}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          User Role: {userRole} • {userRole === 'ADMIN' ? 'Full Access' : 'Standard Access'}
        </p>
      </div>

      {/* Start Button */}
      {!isRunning && (
        <div className="text-center">
          <button
            onClick={startWorkflow}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <SparklesIcon className="w-6 h-6" />
            <span>Start Assessment Analysis</span>
          </button>
        </div>
      )}

      {/* Workflow Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-6 transition-all duration-300 ${getStepColor(step.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {getStepIcon(step.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {step.status === 'in_progress' ? 'Processing...' : 
                   step.status === 'completed' ? 'Completed' : 
                   step.status === 'error' ? 'Error' : 'Pending'}
                </div>
                {step.status === 'in_progress' && (
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${step.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-steps */}
            {step.subSteps && (
              <div className="ml-10 space-y-2">
                {step.subSteps.map((subStep, subIndex) => (
                  <div key={subStep.id} className="flex items-center space-x-3">
                    {getStepIcon(subStep.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{subStep.title}</p>
                      <p className="text-xs text-gray-600">{subStep.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
