'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FingerPrintIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PrinterIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const workflowSteps = [
  {
    step: 1,
    title: 'Book Appointment',
    description: 'Schedule your DMIT session at our certified center',
    icon: CalendarIcon,
    details: [
      'Choose convenient time slot',
      'Fill pre-assessment form',
      'Receive confirmation SMS/Email',
      'Get location details and instructions'
    ],
    duration: '5 minutes',
    color: 'from-blue-500 to-blue-600'
  },
  {
    step: 2,
    title: 'Fingerprint Analysis',
    description: 'High-resolution scanning of all 10 fingerprints',
    icon: FingerPrintIcon,
    details: [
      'Professional fingerprint scanning',
      'Multiple angle captures',
      'Quality verification',
      'Secure data storage'
    ],
    duration: '15 minutes',
    color: 'from-green-500 to-green-600'
  },
  {
    step: 3,
    title: 'AI Algorithm Analysis',
    description: 'Advanced AI processes fingerprint patterns',
    icon: CpuChipIcon,
    details: [
      'Pattern recognition algorithms',
      'Multiple intelligence mapping',
      'Learning style analysis',
      'Career aptitude calculation'
    ],
    duration: '2-3 hours',
    color: 'from-purple-500 to-purple-600'
  },
  {
    step: 4,
    title: 'Report Generation',
    description: 'Comprehensive 25-page detailed report',
    icon: DocumentTextIcon,
    details: [
      'Multiple intelligence scores',
      'Learning style preferences',
      'Career recommendations',
      'Development suggestions'
    ],
    duration: '30 minutes',
    color: 'from-orange-500 to-orange-600'
  },
  {
    step: 5,
    title: 'Report Delivery',
    description: 'Professional report printing and delivery',
    icon: PrinterIcon,
    details: [
      'High-quality color printing',
      'Laminated cover page',
      'Digital copy via email',
      'Counseling session (optional)'
    ],
    duration: '24 hours',
    color: 'from-red-500 to-red-600'
  }
];

const intelligenceTypes = [
  {
    name: 'Linguistic Intelligence',
    description: 'Verbal and written communication abilities',
    icon: '📝',
    careers: ['Writer', 'Journalist', 'Teacher', 'Lawyer'],
    characteristics: ['Loves reading', 'Good at storytelling', 'Enjoys word games', 'Strong vocabulary']
  },
  {
    name: 'Logical-Mathematical Intelligence',
    description: 'Analytical and problem-solving abilities',
    icon: '🔢',
    careers: ['Engineer', 'Scientist', 'Mathematician', 'Programmer'],
    characteristics: ['Loves puzzles', 'Good at math', 'Logical thinking', 'Pattern recognition']
  },
  {
    name: 'Spatial Intelligence',
    description: 'Visual and spatial awareness abilities',
    icon: '🎨',
    careers: ['Architect', 'Artist', 'Designer', 'Pilot'],
    characteristics: ['Good at drawing', 'Loves maps', 'Visual memory', '3D thinking']
  },
  {
    name: 'Musical Intelligence',
    description: 'Rhythm, melody, and sound recognition',
    icon: '🎵',
    careers: ['Musician', 'Composer', 'Sound Engineer', 'Music Teacher'],
    characteristics: ['Loves music', 'Good rhythm', 'Recognizes sounds', 'Creative with music']
  },
  {
    name: 'Bodily-Kinesthetic Intelligence',
    description: 'Physical movement and coordination',
    icon: '🏃',
    careers: ['Athlete', 'Dancer', 'Actor', 'Surgeon'],
    characteristics: ['Good at sports', 'Loves movement', 'Hands-on learning', 'Physical coordination']
  },
  {
    name: 'Interpersonal Intelligence',
    description: 'Understanding and relating to others',
    icon: '👥',
    careers: ['Counselor', 'Salesperson', 'Politician', 'Social Worker'],
    characteristics: ['Good with people', 'Natural leader', 'Empathetic', 'Team player']
  },
  {
    name: 'Intrapersonal Intelligence',
    description: 'Self-awareness and introspection',
    icon: '🧘',
    careers: ['Psychologist', 'Philosopher', 'Writer', 'Life Coach'],
    characteristics: ['Self-reflective', 'Independent', 'Goal-oriented', 'Self-motivated']
  },
  {
    name: 'Naturalistic Intelligence',
    description: 'Understanding of natural world and environment',
    icon: '🌱',
    careers: ['Biologist', 'Environmentalist', 'Farmer', 'Veterinarian'],
    characteristics: ['Loves nature', 'Good with animals', 'Environmental awareness', 'Outdoor activities']
  }
];

const benefits = [
  {
    title: 'Early Talent Discovery',
    description: 'Identify natural abilities from age 3+',
    icon: '🎯'
  },
  {
    title: 'Personalized Learning',
    description: 'Tailored educational approach based on intelligence profile',
    icon: '📚'
  },
  {
    title: 'Career Guidance',
    description: 'Science-based career recommendations',
    icon: '💼'
  },
  {
    title: 'Parental Understanding',
    description: 'Better understanding of your child\'s unique strengths',
    icon: '👨‍👩‍👧‍👦'
  }
];

export default function DMITPage() {
  const [selectedStep, setSelectedStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-6 py-3 mb-6">
              <FingerPrintIcon className="h-6 w-6 text-purple-600" />
              <span className="text-lg font-semibold text-purple-800">DMIT - Dermatoglyphics Multiple Intelligence Test</span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Discover Your True Potential Through{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Fingerprint Science
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              DMIT is a scientific method that analyzes fingerprint patterns to reveal your multiple intelligence profile, 
              learning style, and career aptitudes. Based on dermatoglyphics research and neuroscience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#book-appointment"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Book DMIT Test Now</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>View Sample Report</span>
                <DocumentTextIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* What is DMIT Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What is DMIT?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dermatoglyphics Multiple Intelligence Test (DMIT) is a scientific assessment method that analyzes 
              fingerprint patterns to understand brain development and multiple intelligence distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FingerPrintIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scientific Basis</h3>
              <p className="text-gray-600">
                Based on dermatoglyphics research and neuroscience. Fingerprint patterns are formed during 
                fetal development and remain unchanged throughout life.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CpuChipIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced AI algorithms analyze fingerprint patterns to map multiple intelligence distribution 
                and learning preferences with 95% accuracy.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Report</h3>
              <p className="text-gray-600">
                Detailed 25-page report covering multiple intelligence scores, learning styles, 
                career recommendations, and development suggestions.
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">DMIT Process Workflow</h2>
          
          <div className="space-y-8">
            {workflowSteps.map((step, index) => (
              <div
                key={step.step}
                className={`bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 ${
                  selectedStep === index ? 'ring-4 ring-purple-500' : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedStep(index)}
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4" />
                        <span>{step.duration}</span>
                      </div>
                    </div>
                    
                    <p className="text-lg text-gray-600 mb-4">{step.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multiple Intelligence Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">8 Types of Multiple Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {intelligenceTypes.map((intelligence) => (
              <div key={intelligence.name} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">{intelligence.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{intelligence.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{intelligence.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Career Options:</h4>
                    <div className="flex flex-wrap gap-1">
                      {intelligence.careers.map((career, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose DMIT?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing and CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Discover Your True Potential?
            </h2>
            <p className="text-xl mb-6">
              Book your DMIT test today and unlock the secrets hidden in your fingerprints
            </p>
            
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">₹2,999</div>
                <div className="text-sm opacity-90">Complete DMIT Test</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">25 Pages</div>
                <div className="text-sm opacity-90">Detailed Report</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24hrs</div>
                <div className="text-sm opacity-90">Report Delivery</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#book-appointment"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              >
                <span>Book DMIT Test</span>
                <CalendarIcon className="h-5 w-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 inline-flex items-center space-x-2">
                <span>Call: +91-9876543210</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
