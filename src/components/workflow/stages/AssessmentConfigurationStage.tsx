'use client';

import React, { useState, useCallback } from 'react';
import { 
  CheckCircleIcon, 
  AcademicCapIcon,
  UserIcon,
  HeartIcon,
  CogIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  UnifiedWorkflowConfig, 
  AssessmentType, 
  AssessmentDomain 
} from '@/types/assessment';
import { 
  getAssessmentTypesForAgeGroup,
  getAgeGroup
} from '@/lib/age-appropriate-frameworks';
import { toast } from 'react-hot-toast';

interface AssessmentConfigurationStageProps {
  workflowConfig: UnifiedWorkflowConfig;
  onConfigUpdate: (config: UnifiedWorkflowConfig) => void;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function AssessmentConfigurationStage({ 
  workflowConfig, 
  onConfigUpdate, 
  onComplete, 
  onError 
}: AssessmentConfigurationStageProps) {
  const [assessmentTypes, setAssessmentTypes] = useState(workflowConfig.assessmentTypes);
  const [customizations, setCustomizations] = useState(workflowConfig.customizations);

  const availableAssessmentTypes = {
    academic: getAssessmentTypesForAgeGroup(workflowConfig.studentAge, 'ACADEMIC'),
    psychometric: getAssessmentTypesForAgeGroup(workflowConfig.studentAge, 'PSYCHOMETRIC'),
    physical: getAssessmentTypesForAgeGroup(workflowConfig.studentAge, 'PHYSICAL')
  };

  const handleAssessmentTypeToggle = useCallback((domain: AssessmentDomain, assessmentType: AssessmentType) => {
    setAssessmentTypes(prev => ({
      ...prev,
      [domain.toLowerCase()]: prev[domain.toLowerCase()].includes(assessmentType)
        ? prev[domain.toLowerCase()].filter(type => type !== assessmentType)
        : [...prev[domain.toLowerCase()], assessmentType]
    }));
  }, []);

  const handleCustomizationChange = useCallback((key: keyof typeof customizations, value: any) => {
    setCustomizations(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleContinue = useCallback(() => {
    // Validate that at least one assessment type is selected for each domain
    const hasAcademicTypes = assessmentTypes.academic.length > 0;
    const hasPsychometricTypes = assessmentTypes.psychometric.length > 0;
    const hasPhysicalTypes = assessmentTypes.physical.length > 0;

    if (!hasAcademicTypes) {
      toast.error('Please select at least one academic assessment type');
      return;
    }

    const updatedConfig: UnifiedWorkflowConfig = {
      ...workflowConfig,
      assessmentTypes,
      customizations
    };

    onConfigUpdate(updatedConfig);
    onComplete({ assessmentTypes, customizations });
  }, [assessmentTypes, customizations, workflowConfig, onConfigUpdate, onComplete]);

  const getDomainIcon = (domain: AssessmentDomain) => {
    switch (domain) {
      case 'ACADEMIC':
        return <AcademicCapIcon className="h-6 w-6 text-blue-600" />;
      case 'PSYCHOMETRIC':
        return <UserIcon className="h-6 w-6 text-purple-600" />;
      case 'PHYSICAL':
        return <HeartIcon className="h-6 w-6 text-green-600" />;
    }
  };

  const getDomainColor = (domain: AssessmentDomain) => {
    switch (domain) {
      case 'ACADEMIC':
        return 'border-blue-200 bg-blue-50';
      case 'PSYCHOMETRIC':
        return 'border-purple-200 bg-purple-50';
      case 'PHYSICAL':
        return 'border-green-200 bg-green-50';
    }
  };

  const getAssessmentTypeDescription = (type: AssessmentType) => {
    switch (type) {
      case 'MARKS_BASED':
        return 'Traditional numerical scoring system';
      case 'RUBRICS_BASED':
        return 'Criterion-based evaluation with detailed rubrics';
      case 'PORTFOLIO':
        return 'Collection and evaluation of student work samples';
      case 'COMPETENCY_BASED':
        return 'Assessment based on skill mastery and competencies';
      case 'BEHAVIORAL':
        return 'Observation and evaluation of behavioral patterns';
      case 'SKILL_BASED':
        return 'Direct assessment of specific skills and abilities';
      default:
        return 'Custom assessment methodology';
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start">
          <InformationCircleIcon className="h-6 w-6 text-purple-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Assessment Configuration
            </h3>
            <p className="text-purple-800">
              Configure the assessment types and methods for each domain. Select the assessment 
              approaches that best suit your needs and the student's age group.
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Types Selection */}
      <div className="space-y-8">
        {Object.entries(availableAssessmentTypes).map(([domain, types]) => {
          const domainKey = domain as keyof typeof availableAssessmentTypes;
          const domainEnum = domain.toUpperCase() as AssessmentDomain;
          const selectedTypes = assessmentTypes[domainKey];
          
          return (
            <div key={domain} className="space-y-4">
              <div className="flex items-center space-x-3">
                {getDomainIcon(domainEnum)}
                <h3 className="text-xl font-semibold text-gray-900 capitalize">
                  {domain} Assessment Types
                </h3>
                <span className="text-sm text-gray-500">
                  ({selectedTypes.length} selected)
                </span>
              </div>
              
              <div className={`p-6 border rounded-lg ${getDomainColor(domainEnum)}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {types.map((type) => {
                    const isSelected = selectedTypes.includes(type);
                    
                    return (
                      <div
                        key={type}
                        onClick={() => handleAssessmentTypeToggle(domainEnum, type)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-100' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {type.replace('_', ' ')}
                          </h4>
                          {isSelected && (
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {getAssessmentTypeDescription(type)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                {types.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No assessment types available for this age group in the {domain} domain.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Customizations */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CogIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Report Customizations</h3>
        </div>
        
        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Report Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['BASIC', 'COMPREHENSIVE', 'ENTERPRISE'].map((type) => (
                <div
                  key={type}
                  onClick={() => handleCustomizationChange('reportType', type)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    customizations.reportType === type
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{type}</h4>
                  <p className="text-sm text-gray-600">
                    {type === 'BASIC' && 'Essential insights and basic recommendations'}
                    {type === 'COMPREHENSIVE' && 'Detailed analysis with predictions and career mapping'}
                    {type === 'ENTERPRISE' && 'Full 360° analysis with advanced analytics and benchmarking'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional Features
            </label>
            <div className="space-y-3">
              {[
                { key: 'includeCareerMapping', label: 'Career Mapping & Recommendations', description: 'AI-powered career guidance based on assessment results' },
                { key: 'includePredictions', label: 'Predictive Analytics', description: 'Future performance predictions and trajectory analysis' },
                { key: 'includeComparativeAnalysis', label: 'Comparative Analysis', description: 'Benchmarking against peers and national averages' }
              ].map((feature) => (
                <div
                  key={feature.key}
                  onClick={() => handleCustomizationChange(feature.key as keyof typeof customizations, !customizations[feature.key as keyof typeof customizations])}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    customizations[feature.key as keyof typeof customizations]
                      ? 'border-green-500 bg-green-100'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.label}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    {customizations[feature.key as keyof typeof customizations] && (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 ml-3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Selected Assessment Types:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li><strong>Academic:</strong> {assessmentTypes.academic.join(', ') || 'None'}</li>
              <li><strong>Psychometric:</strong> {assessmentTypes.psychometric.join(', ') || 'None'}</li>
              <li><strong>Physical:</strong> {assessmentTypes.physical.join(', ') || 'None'}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Report Features:</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li><strong>Type:</strong> {customizations.reportType}</li>
              <li><strong>Career Mapping:</strong> {customizations.includeCareerMapping ? 'Yes' : 'No'}</li>
              <li><strong>Predictions:</strong> {customizations.includePredictions ? 'Yes' : 'No'}</li>
              <li><strong>Comparative Analysis:</strong> {customizations.includeComparativeAnalysis ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={assessmentTypes.academic.length === 0}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Data Acquisition
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
