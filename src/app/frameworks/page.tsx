'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const frameworks = [
  {
    name: 'CBSE',
    fullName: 'Central Board of Secondary Education',
    description: 'India\'s largest educational board with comprehensive curriculum',
    icon: '📚',
    students: '2.5M+',
    subjects: 15,
    assessments: 45,
    color: 'from-blue-500 to-blue-600',
    features: ['Comprehensive Syllabus', 'National Recognition', 'Competitive Exams', 'Holistic Development']
  },
  {
    name: 'ICSE',
    fullName: 'Indian Certificate of Secondary Education',
    description: 'Internationally recognized curriculum with emphasis on English',
    icon: '🌍',
    students: '1.2M+',
    subjects: 12,
    assessments: 38,
    color: 'from-green-500 to-green-600',
    features: ['International Recognition', 'English Focus', 'Practical Learning', 'Global Standards']
  },
  {
    name: 'IGCSE',
    fullName: 'International General Certificate of Secondary Education',
    description: 'Cambridge-based international curriculum for global students',
    icon: '🎓',
    students: '800K+',
    subjects: 20,
    assessments: 52,
    color: 'from-purple-500 to-purple-600',
    features: ['Cambridge Standards', 'Global Recognition', 'Flexible Subjects', 'University Preparation']
  },
  {
    name: 'IB',
    fullName: 'International Baccalaureate',
    description: 'World-renowned program for critical thinking and inquiry',
    icon: '🏆',
    students: '500K+',
    subjects: 25,
    assessments: 48,
    color: 'from-red-500 to-red-600',
    features: ['Critical Thinking', 'Research Skills', 'Global Citizenship', 'University Ready']
  }
];

const assessmentCategories = [
  {
    category: 'Academic Excellence',
    icon: '📊',
    count: 156,
    description: 'Subject-specific assessments aligned with your curriculum',
    tests: ['Mathematics Mastery', 'Science Explorer', 'Language Arts Pro', 'Social Studies Expert']
  },
  {
    category: 'Competitive Exams',
    icon: '🎯',
    count: 89,
    description: 'Preparation for entrance exams and competitive tests',
    tests: ['JEE Preparation', 'NEET Mastery', 'SAT/ACT Ready', 'Olympiad Champion']
  },
  {
    category: 'Skill Development',
    icon: '🚀',
    count: 134,
    description: 'Essential life skills and career readiness assessments',
    tests: ['Critical Thinking', 'Problem Solving', 'Communication Skills', 'Leadership Potential']
  },
  {
    category: 'Career Guidance',
    icon: '💼',
    count: 67,
    description: 'Discover your perfect career path with AI-powered insights',
    tests: ['Career Aptitude', 'Interest Profiler', 'Personality Match', 'Future Skills']
  }
];

export default function FrameworksPage() {
  const [selectedFramework, setSelectedFramework] = useState('CBSE');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Educational Framework
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized assessments tailored to your curriculum. Whether you're following CBSE, ICSE, IGCSE, or IB, 
              we have comprehensive tests designed specifically for your educational path.
            </p>
          </div>
        </div>
      </div>

      {/* Framework Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {frameworks.map((framework) => (
            <div
              key={framework.name}
              className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 ${
                selectedFramework === framework.name ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedFramework(framework.name)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{framework.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{framework.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{framework.fullName}</p>
                <p className="text-sm text-gray-500 mb-4">{framework.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-semibold text-blue-600">{framework.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subjects:</span>
                    <span className="font-semibold text-green-600">{framework.subjects}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Assessments:</span>
                    <span className="font-semibold text-purple-600">{framework.assessments}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {framework.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                      <CheckCircleIcon className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Framework Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedFramework} Assessment Suite
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive assessments designed specifically for {selectedFramework} curriculum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentCategories.map((category) => (
              <div key={category.category} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.category}</h3>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{category.count} Tests</div>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="space-y-1">
                    {category.tests.map((test, index) => (
                      <div key={index} className="text-xs text-gray-700 bg-white rounded px-2 py-1">
                        {test}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Excel in {selectedFramework}?
            </h2>
            <p className="text-xl mb-6">
              Join thousands of {selectedFramework} students who have improved their performance with our AI-powered assessments
            </p>
            
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm opacity-90">{selectedFramework} Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm opacity-90">Improvement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24hrs</div>
                <div className="text-sm opacity-90">Instant Results</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/testvault"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Start {selectedFramework} Assessment</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>View Sample Report</span>
                <ChartBarIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What {selectedFramework} Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "The {selectedFramework} assessments helped me identify my weak areas and improve my grades significantly. Highly recommended!"
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Rahul Sharma</p>
                <p className="text-sm text-gray-500">Class 12, {selectedFramework}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Perfect alignment with {selectedFramework} curriculum. The AI insights were spot-on and helped me choose the right career path."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Priya Patel</p>
                <p className="text-sm text-gray-500">Class 11, {selectedFramework}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "As a parent, I was amazed by the detailed reports. It gave us clear direction for our child's future in {selectedFramework}."
              </p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">Mrs. Kumar</p>
                <p className="text-sm text-gray-500">Parent, {selectedFramework}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}