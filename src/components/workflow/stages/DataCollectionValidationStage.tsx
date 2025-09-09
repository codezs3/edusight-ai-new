'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  AcademicCapIcon,
  UserIcon,
  HeartIcon,
  ArrowRightIcon,
  DocumentIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  DataCollectionStatus, 
  PsychometricTestResult, 
  ParentQuestionnaireResponse, 
  PhysicalAssessmentData,
  AgeGroup
} from '@/types/assessment';
import { getAgeGroup } from '@/lib/age-appropriate-frameworks';
import { toast } from 'react-hot-toast';

interface DataCollectionValidationStageProps {
  studentAge: number;
  currentDataStatus: DataCollectionStatus;
  onDataStatusUpdate: (status: DataCollectionStatus) => void;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function DataCollectionValidationStage({
  studentAge,
  currentDataStatus,
  onDataStatusUpdate,
  onComplete,
  onError
}: DataCollectionValidationStageProps) {
  const [dataStatus, setDataStatus] = useState<DataCollectionStatus>(currentDataStatus);
  const [isValidating, setIsValidating] = useState(false);
  const [missingDomains, setMissingDomains] = useState<string[]>([]);

  const ageGroup = getAgeGroup(studentAge);

  // Check data completeness
  useEffect(() => {
    const missing: string[] = [];
    
    if (!dataStatus.academic.hasData || dataStatus.academic.completeness < 80) {
      missing.push('Academic');
    }
    
    if (!dataStatus.psychometric.hasData || dataStatus.psychometric.completeness < 70) {
      missing.push('Psychometric');
    }
    
    if (!dataStatus.physical.hasData || dataStatus.physical.completeness < 70) {
      missing.push('Physical');
    }
    
    setMissingDomains(missing);
  }, [dataStatus]);

  const handleStartPsychometricTest = useCallback(() => {
    // Navigate to psychometric test based on age group
    if (ageGroup === 'EARLY_CHILDHOOD' || ageGroup === 'PRIMARY') {
      // For younger children, show parent questionnaire
      toast.info('Starting parent questionnaire for psychological assessment...');
      // TODO: Navigate to parent questionnaire
    } else {
      // For older children, show direct psychometric test
      toast.info('Starting psychometric assessment...');
      // TODO: Navigate to psychometric test
    }
  }, [ageGroup]);

  const handleStartPhysicalAssessment = useCallback(() => {
    toast.info('Starting physical education assessment...');
    // TODO: Navigate to physical assessment
  }, []);

  const handleManualAcademicEntry = useCallback(() => {
    toast.info('Starting manual academic data entry...');
    // TODO: Navigate to manual entry
  }, []);

  const validateAndProceed = useCallback(() => {
    if (missingDomains.length > 0) {
      toast.error(`Please complete data collection for: ${missingDomains.join(', ')}`);
      return;
    }

    setIsValidating(true);
    
    // Simulate validation
    setTimeout(() => {
      setIsValidating(false);
      onComplete({
        dataStatus,
        message: 'All required data collected successfully!'
      });
    }, 2000);
  }, [missingDomains, dataStatus, onComplete]);

  const getDomainStatus = (domain: keyof DataCollectionStatus) => {
    const status = dataStatus[domain];
    const isComplete = status.hasData && status.completeness >= (domain === 'academic' ? 80 : 70);
    
    return {
      isComplete,
      icon: isComplete ? CheckCircleIcon : ExclamationTriangleIcon,
      color: isComplete ? 'text-green-500' : 'text-yellow-500',
      bgColor: isComplete ? 'bg-green-50' : 'bg-yellow-50',
      borderColor: isComplete ? 'border-green-200' : 'border-yellow-200'
    };
  };

  const academicStatus = getDomainStatus('academic');
  const psychometricStatus = getDomainStatus('psychometric');
  const physicalStatus = getDomainStatus('physical');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Data Collection Validation
        </h3>
        <p className="text-gray-600">
          We need comprehensive data across all three domains for accurate analysis
        </p>
      </div>

      {/* Data Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Academic Data */}
        <div className={`p-4 rounded-lg border-2 ${academicStatus.borderColor} ${academicStatus.bgColor}`}>
          <div className="flex items-center space-x-3 mb-3">
            <AcademicCapIcon className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Academic Data</h4>
            <academicStatus.icon className={`w-5 h-5 ${academicStatus.color}`} />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Source: {dataStatus.academic.dataSource}
            </div>
            <div className="text-sm text-gray-600">
              Completeness: {dataStatus.academic.completeness}%
            </div>
            {!academicStatus.isComplete && (
              <button
                onClick={handleManualAcademicEntry}
                className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Add Academic Data
              </button>
            )}
          </div>
        </div>

        {/* Psychometric Data */}
        <div className={`p-4 rounded-lg border-2 ${psychometricStatus.borderColor} ${psychometricStatus.bgColor}`}>
          <div className="flex items-center space-x-3 mb-3">
            <UserIcon className="w-6 h-6 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Psychometric Data</h4>
            <psychometricStatus.icon className={`w-5 h-5 ${psychometricStatus.color}`} />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Source: {dataStatus.psychometric.dataSource}
            </div>
            <div className="text-sm text-gray-600">
              Completeness: {dataStatus.psychometric.completeness}%
            </div>
            {!psychometricStatus.isComplete && (
              <button
                onClick={handleStartPsychometricTest}
                className="w-full mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                {ageGroup === 'EARLY_CHILDHOOD' || ageGroup === 'PRIMARY' 
                  ? 'Parent Questionnaire' 
                  : 'Take Assessment'
                }
              </button>
            )}
          </div>
        </div>

        {/* Physical Data */}
        <div className={`p-4 rounded-lg border-2 ${physicalStatus.borderColor} ${physicalStatus.bgColor}`}>
          <div className="flex items-center space-x-3 mb-3">
            <HeartIcon className="w-6 h-6 text-red-600" />
            <h4 className="font-semibold text-gray-900">Physical Data</h4>
            <physicalStatus.icon className={`w-5 h-5 ${physicalStatus.color}`} />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Source: {dataStatus.physical.dataSource}
            </div>
            <div className="text-sm text-gray-600">
              Completeness: {dataStatus.physical.completeness}%
            </div>
            {!physicalStatus.isComplete && (
              <button
                onClick={handleStartPhysicalAssessment}
                className="w-full mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Physical Assessment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Missing Data Alert */}
      {missingDomains.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Incomplete Data Collection</h4>
              <p className="text-sm text-yellow-700 mt-1">
                We need additional data for: <strong>{missingDomains.join(', ')}</strong>
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                Complete data collection ensures accurate analysis and comprehensive insights.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Age-Appropriate Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Age-Appropriate Assessment</h4>
            <p className="text-sm text-blue-700 mt-1">
              For {ageGroup.replace('_', ' ').toLowerCase()} students (age {studentAge}):
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              {ageGroup === 'EARLY_CHILDHOOD' || ageGroup === 'PRIMARY' ? (
                <>
                  <li>• Psychological assessment via parent questionnaire</li>
                  <li>• Physical assessment through parent-reported activities</li>
                  <li>• Academic data from school reports and observations</li>
                </>
              ) : (
                <>
                  <li>• Direct psychometric testing for personality and learning style</li>
                  <li>• Physical fitness assessment with measurements</li>
                  <li>• Comprehensive academic performance analysis</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <div className="text-sm text-gray-500">
          {missingDomains.length === 0 ? (
            <span className="text-green-600 font-medium">✓ All data collected</span>
          ) : (
            <span className="text-yellow-600 font-medium">
              {missingDomains.length} domain(s) need attention
            </span>
          )}
        </div>
        
        <button
          onClick={validateAndProceed}
          disabled={missingDomains.length > 0 || isValidating}
          className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating...
            </>
          ) : (
            <>
              Proceed to Analysis
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
