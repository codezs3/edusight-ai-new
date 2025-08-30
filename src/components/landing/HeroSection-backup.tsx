'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlayIcon,
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { label: 'Students Assessed', value: '50,000+', icon: AcademicCapIcon },
    { label: 'Schools Connected', value: '500+', icon: ChartBarIcon },
    { label: 'AI Accuracy', value: '98%', icon: SparklesIcon }
  ];

  const keyFeatures = [
    'Holistic Analytics: Academic + Physical + Psychological',
    'AI Career Matching with O*NET Integration',
    'Multi-Actor Platform: Students, Parents, Teachers, Admins',
    'Validated Assessments: WISC-V, BASC, SDQ, GAD-7, Big Five'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [stats.length]);

  return (
    <section className="relative bg-gradient-to-br from-white via-edu-primary-50/30 to-edu-secondary-50/30 py-20 lg:py-32">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-neural-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-edu-primary-100 text-edu-primary-700 text-sm font-medium mb-8">
              <SparklesIcon className="w-4 h-4 mr-2" />
              India's NEP 2020 Aligned • AI-Powered Analytics
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-edu-gray-900 mb-6 leading-tight">
              Unlock Every Indian Student's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600">
                Full Potential
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-edu-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Holistic K-12 analytics platform spanning academic performance, physical health, and psychological wellbeing. 
              Transform fragmented student data into actionable insights with AI-powered career guidance.
            </p>

            {/* Key Features */}
            <div className="space-y-3 mb-10">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-center lg:justify-start">
                  <CheckCircleIcon className="w-5 h-5 text-edu-success-500 mr-3 flex-shrink-0" />
                  <span className="text-edu-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/auth/signin"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 text-white font-semibold rounded-xl hover:from-edu-primary-700 hover:to-edu-secondary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Free Assessment
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/demo-users"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-edu-gray-300 text-edu-gray-700 font-semibold rounded-xl hover:border-edu-primary-500 hover:text-edu-primary-600 transition-all duration-300 bg-white"
              >
                <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-edu-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-edu-success-500 rounded-full mr-2"></div>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-edu-success-500 rounded-full mr-2"></div>
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-edu-success-500 rounded-full mr-2"></div>
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Visual */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Main Stats Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-edu-gray-100 p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-edu-gray-900 mb-2">
                    EduSight 360° Score
                  </h3>
                  <p className="text-edu-gray-600">
                    Comprehensive Assessment Range: 40-100
                  </p>
                </div>

                {/* Score Visualization */}
                <div className="relative mb-8">
                  <div className="w-32 h-32 mx-auto relative">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(85 * 314) / 100} 314`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-edu-gray-900">85</div>
                        <div className="text-xs text-edu-gray-500">Sample Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assessment Categories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-edu-gray-700">Academic (CBSE)</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-edu-gray-200 rounded-full mr-2">
                        <div className="w-14 h-2 bg-edu-primary-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-edu-gray-900">88</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-edu-gray-700">Psychological</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-edu-gray-200 rounded-full mr-2">
                        <div className="w-12 h-2 bg-edu-secondary-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-edu-gray-900">82</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-edu-gray-700">Physical</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-edu-gray-200 rounded-full mr-2">
                        <div className="w-15 h-2 bg-edu-accent-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold text-edu-gray-900">85</span>
                    </div>
                  </div>
                </div>

                {/* Warning Threshold */}
                <div className="mt-6 p-3 bg-edu-warning-50 border border-edu-warning-200 rounded-lg">
                  <div className="flex items-center text-xs text-edu-warning-700">
                    <div className="w-2 h-2 bg-edu-warning-500 rounded-full mr-2"></div>
                    <span>Scores below 40 indicate need for medical intervention</span>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg border border-edu-gray-100 p-4 animate-float">
                <div className="flex items-center space-x-3">
                  {React.createElement(stats[currentStat].icon, { 
                    className: "w-8 h-8 text-edu-primary-600" 
                  })}
                  <div>
                    <div className="text-lg font-bold text-edu-gray-900">
                      {stats[currentStat].value}
                    </div>
                    <div className="text-xs text-edu-gray-500">
                      {stats[currentStat].label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
