'use client';

import React, { useState } from 'react';
import { 
  AcademicCapIcon,
  CpuChipIcon,
  ChartBarIcon,
  HeartIcon,
  LightBulbIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    id: 'academic',
    title: 'Academic Excellence',
    description: 'Comprehensive assessment tools that measure and enhance academic performance across all subjects.',
    icon: AcademicCapIcon,
    color: 'from-blue-500 to-cyan-500',
    benefits: [
      'Subject-specific assessments',
      'Grade tracking and analysis',
      'Performance trend monitoring',
      'Personalized learning paths'
    ]
  },
  {
    id: 'psychological',
    title: 'Psychological Insights',
    description: 'Deep understanding of student psychology, learning styles, and emotional wellbeing through advanced assessments.',
    icon: HeartIcon,
    color: 'from-purple-500 to-pink-500',
    benefits: [
      'Cognitive assessment tools',
      'Personality analysis',
      'Learning style identification',
      'Emotional wellbeing tracking'
    ]
  },
  {
    id: 'data-driven',
    title: 'Data-Driven Decisions',
    description: 'Workflow automation and streamlined processes for assessment, reporting, and intervention management.',
    icon: ChartBarIcon,
    color: 'from-green-500 to-emerald-500',
    benefits: [
      'Automated report generation',
      'Smart notifications',
      'Process optimization',
      'Predictive analytics'
    ]
  }
];

export function InteractiveFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState<string>('academic');

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assessment Solutions
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our integrated platform combines academic excellence, psychological insights, 
            and data-driven automation to provide holistic student assessment.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFeature === feature.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {feature.title}
            </button>
          ))}
        </div>

        {/* Active Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Content */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className={`p-4 bg-gradient-to-r ${features.find(f => f.id === activeFeature)?.color} rounded-2xl`}>
                {React.createElement(features.find(f => f.id === activeFeature)?.icon || AcademicCapIcon, {
                  className: "w-8 h-8 text-white"
                })}
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                {features.find(f => f.id === activeFeature)?.title}
              </h3>
            </div>
            
            <p className="text-lg text-gray-600">
              {features.find(f => f.id === activeFeature)?.description}
            </p>

            {/* Benefits List */}
            <ul className="space-y-3">
              {features.find(f => f.id === activeFeature)?.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span>Explore Features</span>
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              
              <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 border border-gray-200">
                <span>Learn More</span>
              </button>
            </div>
          </div>

          {/* Feature Visualization */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className={`inline-flex p-4 bg-gradient-to-r ${features.find(f => f.id === activeFeature)?.color} rounded-2xl mb-4`}>
                  {React.createElement(features.find(f => f.id === activeFeature)?.icon || AcademicCapIcon, {
                    className: "w-12 h-12 text-white"
                  })}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {features.find(f => f.id === activeFeature)?.title}
                </h4>
                <p className="text-gray-600">
                  Interactive assessment tools and analytics
                </p>
              </div>

              {/* Mock Data Visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
                  <span className="text-sm font-bold text-blue-600">85%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Accuracy Rate</span>
                  <span className="text-sm font-bold text-green-600">94%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Completion Time</span>
                  <span className="text-sm font-bold text-purple-600">12 min</span>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}