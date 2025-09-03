'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  BookOpenIcon,
  DocumentTextIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface Framework {
  framework: string;
  confidence: number;
  indicators: string[];
}

interface FrameworkSelectionModalProps {
  isOpen: boolean;
  frameworks: Framework[];
  onSelect: (framework: string) => void;
  onClose: () => void;
}

const frameworkInfo = {
  'CBSE': {
    name: 'CBSE (Central Board of Secondary Education)',
    description: 'Indian national education board following NCERT curriculum',
    icon: AcademicCapIcon,
    color: 'bg-blue-500',
    regions: ['India'],
    gradeSystem: 'Percentage (0-100%) or CGPA (10-point scale)',
    subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science']
  },
  'ICSE': {
    name: 'ICSE (Indian Certificate of Secondary Education)',
    description: 'Council for Indian School Certificate Examinations',
    icon: BookOpenIcon,
    color: 'bg-green-500',
    regions: ['India'],
    gradeSystem: 'Percentage (0-100%) or Letter grades',
    subjects: ['English Language', 'English Literature', 'Hindi', 'History & Civics']
  },
  'IB': {
    name: 'IB (International Baccalaureate)',
    description: 'Global education program with three levels: PYP, MYP, DP',
    icon: GlobeAltIcon,
    color: 'bg-purple-500',
    regions: ['International'],
    gradeSystem: 'Points (1-7 scale)',
    subjects: ['TOK', 'Extended Essay', 'CAS', 'Six subject groups']
  },
  'IGCSE': {
    name: 'IGCSE (International General Certificate)',
    description: 'Cambridge International secondary education qualification',
    icon: DocumentTextIcon,
    color: 'bg-orange-500',
    regions: ['International', 'UK-aligned'],
    gradeSystem: 'Letter grades (A*-U) or Numbers (9-1)',
    subjects: ['First Language', 'Second Language', 'Mathematics', 'Sciences']
  },
  'A_LEVELS': {
    name: 'A-Levels (Advanced Level)',
    description: 'Cambridge Advanced Level qualifications',
    icon: AcademicCapIcon,
    color: 'bg-red-500',
    regions: ['UK', 'International'],
    gradeSystem: 'Letter grades (A*-E)',
    subjects: ['3-4 subjects of choice', 'Extended Project Qualification']
  },
  'GCSE': {
    name: 'GCSE (General Certificate of Secondary Education)',
    description: 'UK secondary education qualification',
    icon: BuildingOfficeIcon,
    color: 'bg-indigo-500',
    regions: ['UK'],
    gradeSystem: 'Numbers (9-1) or Letters (A*-G)',
    subjects: ['English Language', 'English Literature', 'Mathematics']
  }
};

export default function FrameworkSelectionModal({ 
  isOpen, 
  frameworks, 
  onSelect, 
  onClose 
}: FrameworkSelectionModalProps) {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const handleSelect = () => {
    if (selectedFramework) {
      onSelect(selectedFramework);
    }
  };

  const getFrameworkDisplay = (framework: Framework) => {
    const info = frameworkInfo[framework.framework as keyof typeof frameworkInfo];
    if (!info) {
      return {
        name: framework.framework,
        description: 'Educational framework detected in your document',
        icon: AcademicCapIcon,
        color: 'bg-gray-500',
        regions: ['Unknown'],
        gradeSystem: 'Various',
        subjects: []
      };
    }
    return info;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Multiple Educational Frameworks Detected</h2>
                    <p className="text-gray-600 mt-1">
                      We found indicators for multiple frameworks in your document. Please select the primary framework for accurate analysis.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frameworks.map((framework) => {
                    const info = getFrameworkDisplay(framework);
                    const IconComponent = info.icon;
                    
                    return (
                      <motion.div
                        key={framework.framework}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedFramework === framework.framework
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedFramework(framework.framework)}
                      >
                        {/* Selection indicator */}
                        {selectedFramework === framework.framework && (
                          <div className="absolute top-2 right-2">
                            <CheckCircleIcon className="w-6 h-6 text-blue-500" />
                          </div>
                        )}

                        <div className="flex items-start space-x-4">
                          {/* Icon */}
                          <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{info.description}</p>

                            {/* Confidence */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Detection Confidence</span>
                                <span className="font-medium">{Math.round(framework.confidence * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${framework.confidence * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="font-medium text-gray-700">Regions: </span>
                                <span className="text-gray-600">{info.regions.join(', ')}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Grading: </span>
                                <span className="text-gray-600">{info.gradeSystem}</span>
                              </div>
                              {info.subjects.length > 0 && (
                                <div>
                                  <span className="font-medium text-gray-700">Key Subjects: </span>
                                  <span className="text-gray-600">{info.subjects.slice(0, 3).join(', ')}</span>
                                  {info.subjects.length > 3 && <span className="text-gray-500">...</span>}
                                </div>
                              )}
                            </div>

                            {/* Indicators found */}
                            {framework.indicators.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <span className="text-xs font-medium text-gray-700">Found in document:</span>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {framework.indicators.slice(0, 3).map((indicator, idx) => (
                                    <span 
                                      key={idx} 
                                      className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                    >
                                      {indicator.replace('Keyword found: ', '').replace('Subject found: ', '')}
                                    </span>
                                  ))}
                                  {framework.indicators.length > 3 && (
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                      +{framework.indicators.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Additional Information */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Why select the correct framework?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensures accurate grade interpretation and conversion</li>
                    <li>• Provides framework-specific skill assessments</li>
                    <li>• Enables proper benchmarking against curriculum standards</li>
                    <li>• Generates relevant career recommendations based on your education system</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => onSelect('generic')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Use Generic Analysis
                  </button>
                  <button
                    onClick={handleSelect}
                    disabled={!selectedFramework}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      selectedFramework
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue with Selected Framework
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
