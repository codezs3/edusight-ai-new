'use client';

import React, { useState, useCallback } from 'react';
import { 
  CheckCircleIcon, 
  AcademicCapIcon,
  UserIcon,
  HeartIcon,
  InformationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { 
  UnifiedWorkflowConfig, 
  AssessmentFramework, 
  AssessmentDomain 
} from '@/types/assessment';
import { 
  getFrameworksForAgeGroup, 
  getAgeGroup,
  ACADEMIC_FRAMEWORKS,
  PSYCHOMETRIC_FRAMEWORKS,
  PHYSICAL_FRAMEWORKS
} from '@/lib/age-appropriate-frameworks';
import { toast } from 'react-hot-toast';

interface FrameworkSelectionStageProps {
  studentAge: number;
  workflowConfig: UnifiedWorkflowConfig;
  onConfigUpdate: (config: UnifiedWorkflowConfig) => void;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function FrameworkSelectionStage({ 
  studentAge, 
  workflowConfig, 
  onConfigUpdate, 
  onComplete, 
  onError 
}: FrameworkSelectionStageProps) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<{
    academic?: AssessmentFramework;
    psychometric?: AssessmentFramework;
    physical?: AssessmentFramework;
  }>(workflowConfig.selectedFrameworks);

  const availableFrameworks = {
    academic: getFrameworksForAgeGroup(studentAge, 'ACADEMIC'),
    psychometric: getFrameworksForAgeGroup(studentAge, 'PSYCHOMETRIC'),
    physical: getFrameworksForAgeGroup(studentAge, 'PHYSICAL')
  };

  const handleFrameworkSelect = useCallback((domain: AssessmentDomain, framework: AssessmentFramework) => {
    setSelectedFrameworks(prev => ({
      ...prev,
      [domain.toLowerCase()]: framework
    }));
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedFrameworks.academic) {
      toast.error('Please select an academic framework');
      return;
    }

    const updatedConfig: UnifiedWorkflowConfig = {
      ...workflowConfig,
      selectedFrameworks
    };

    onConfigUpdate(updatedConfig);
    onComplete({ selectedFrameworks });
  }, [selectedFrameworks, workflowConfig, onConfigUpdate, onComplete]);

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

  const getSelectedColor = (domain: AssessmentDomain) => {
    switch (domain) {
      case 'ACADEMIC':
        return 'border-blue-500 bg-blue-100';
      case 'PSYCHOMETRIC':
        return 'border-purple-500 bg-purple-100';
      case 'PHYSICAL':
        return 'border-green-500 bg-green-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Age-Appropriate Framework Selection
            </h3>
            <p className="text-blue-800">
              Based on the student's age ({studentAge} years), we've filtered the available assessment frameworks 
              to ensure age-appropriate content and methodologies. Select the frameworks you'd like to use for 
              each assessment domain.
            </p>
          </div>
        </div>
      </div>

      {/* Framework Selection */}
      <div className="space-y-8">
        {Object.entries(availableFrameworks).map(([domain, frameworks]) => {
          const domainKey = domain as keyof typeof availableFrameworks;
          const domainEnum = domain.toUpperCase() as AssessmentDomain;
          const isSelected = selectedFrameworks[domainKey as keyof typeof selectedFrameworks];
          
          return (
            <div key={domain} className="space-y-4">
              <div className="flex items-center space-x-3">
                {getDomainIcon(domainEnum)}
                <h3 className="text-xl font-semibold text-gray-900 capitalize">
                  {domain} Assessment Frameworks
                </h3>
                {isSelected && (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frameworks.map((framework) => {
                  const isFrameworkSelected = isSelected?.id === framework.id;
                  
                  return (
                    <div
                      key={framework.id}
                      onClick={() => handleFrameworkSelect(domainEnum, framework)}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        isFrameworkSelected 
                          ? getSelectedColor(domainEnum)
                          : getDomainColor(domainEnum)
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {framework.name}
                        </h4>
                        {isFrameworkSelected && (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {framework.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium mr-2">Assessment Types:</span>
                          <span>{framework.assessmentTypes.join(', ')}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium mr-2">Age Groups:</span>
                          <span>{framework.ageGroups.join(', ')}</span>
                        </div>
                        
                        {framework.subjects && (
                          <div className="flex items-start text-sm text-gray-500">
                            <span className="font-medium mr-2">Subjects:</span>
                            <span className="flex-1">
                              {framework.subjects.slice(0, 3).join(', ')}
                              {framework.subjects.length > 3 && ` +${framework.subjects.length - 3} more`}
                            </span>
                          </div>
                        )}
                        
                        {framework.traits && (
                          <div className="flex items-start text-sm text-gray-500">
                            <span className="font-medium mr-2">Traits:</span>
                            <span className="flex-1">
                              {framework.traits.slice(0, 3).join(', ')}
                              {framework.traits.length > 3 && ` +${framework.traits.length - 3} more`}
                            </span>
                          </div>
                        )}
                        
                        {framework.metrics && (
                          <div className="flex items-start text-sm text-gray-500">
                            <span className="font-medium mr-2">Metrics:</span>
                            <span className="flex-1">
                              {framework.metrics.slice(0, 3).join(', ')}
                              {framework.metrics.length > 3 && ` +${framework.metrics.length - 3} more`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {frameworks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No frameworks available for this age group in the {domain} domain.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Frameworks</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(selectedFrameworks).map(([domain, framework]) => (
            <div key={domain} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
              {getDomainIcon(domain.toUpperCase() as AssessmentDomain)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 capitalize">{domain}</p>
                <p className="text-sm text-gray-600">
                  {framework ? framework.name : 'Not selected'}
                </p>
              </div>
              {framework && (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedFrameworks.academic}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Assessment Configuration
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
