'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ChartBarIcon,
  DocumentArrowUpIcon,
  CpuChipIcon,
  DocumentTextIcon,
  TrophyIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function AnalyticsShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Sample data for animations
  const [subjectScores, setSubjectScores] = useState({
    mathematics: 0,
    science: 0,
    english: 0,
    social: 0
  });

  const [e360Score, setE360Score] = useState({
    academic: 0,
    physical: 0,
    psychological: 0,
    overall: 0
  });

  const workflowSteps = [
    {
      id: 1,
      title: 'Parent Signup & Payment',
      description: 'Secure registration and subscription to EduSight platform',
      icon: UserGroupIcon,
      color: 'from-blue-500 to-cyan-500',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Dashboard Access',
      description: 'Personalized parent dashboard with comprehensive analytics',
      icon: ChartBarIcon,
      color: 'from-green-500 to-emerald-500',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Data Upload',
      description: 'Upload academic, physical, psychological data (Excel, CSV, PDF)',
      icon: DocumentArrowUpIcon,
      color: 'from-purple-500 to-pink-500',
      status: 'active'
    },
    {
      id: 4,
      title: 'AI Processing',
      description: 'Machine learning algorithms analyze and process student data',
      icon: CpuChipIcon,
      color: 'from-orange-500 to-red-500',
      status: 'pending'
    },
    {
      id: 5,
      title: 'E360 Score Calculation',
      description: 'Comprehensive scoring across all three domains',
      icon: SparklesIcon,
      color: 'from-indigo-500 to-purple-500',
      status: 'pending'
    },
    {
      id: 6,
      title: 'Report Generation',
      description: 'Detailed PDF report with branding and legal disclaimers',
      icon: DocumentTextIcon,
      color: 'from-teal-500 to-blue-500',
      status: 'pending'
    },
    {
      id: 7,
      title: 'Career Mapping',
      description: 'Dynamic career recommendations based on assessments',
      icon: TrophyIcon,
      color: 'from-pink-500 to-rose-500',
      status: 'pending'
    }
  ];

  const analyticsTypes = [
    {
      title: 'Subject-wise Progress',
      description: 'Track performance across all subjects with trend analysis',
      icon: AcademicCapIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Year-wise Growth',
      description: 'Monitor academic progression from current grade to Grade 12',
      icon: ClockIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Area-wise Analysis',
      description: 'Comprehensive breakdown of academic, physical, psychological domains',
      icon: ChartBarIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'E360 Score Tracking',
      description: 'Holistic 40-100 scale assessment with medical intervention alerts',
      icon: SparklesIcon,
      color: 'bg-orange-500'
    },
    {
      title: 'Comparative Analysis',
      description: 'Benchmark against peer groups and national averages',
      icon: UserGroupIcon,
      color: 'bg-teal-500'
    },
    {
      title: 'Predictive Insights',
      description: 'AI-powered predictions for future academic performance',
      icon: LightBulbIcon,
      color: 'bg-pink-500'
    }
  ];

  // Animation effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animate workflow steps
  useEffect(() => {
    if (isVisible && mounted) {
      const timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % workflowSteps.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isVisible, mounted, workflowSteps.length]);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate scores
  useEffect(() => {
    if (isVisible && mounted) {
      const timer = setInterval(() => {
        setAnimationProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress <= 100) {
            // Animate subject scores
            setSubjectScores({
              mathematics: Math.min(85, (newProgress * 85) / 100),
              science: Math.min(78, (newProgress * 78) / 100),
              english: Math.min(92, (newProgress * 92) / 100),
              social: Math.min(81, (newProgress * 81) / 100)
            });

            // Animate E360 scores
            setE360Score({
              academic: Math.min(84, (newProgress * 84) / 100),
              physical: Math.min(76, (newProgress * 76) / 100),
              psychological: Math.min(88, (newProgress * 88) / 100),
              overall: Math.min(83, (newProgress * 83) / 100)
            });
          }
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [isVisible, mounted]);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Interactive Analytics Platform
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            What EduSight
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Stands For
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Comprehensive 360° Assessment of students across Academic, Physical, and Psychological domains 
            with AI-powered insights and predictive analytics.
          </p>
          
          {/* E360 Score Explanation */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">EduSight 360° Score (E360)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <AcademicCapIcon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-2">Academic</h4>
                <p className="text-sm text-slate-600">Subject performance, GPA, attendance, behavioral ratings</p>
                <div className="mt-3 text-2xl font-bold text-blue-600">{Math.round(e360Score.academic)}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <HeartIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-2">Physical</h4>
                <p className="text-sm text-slate-600">BMI, fitness levels, motor skills, health indicators</p>
                <div className="mt-3 text-2xl font-bold text-green-600">{Math.round(e360Score.physical)}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <LightBulbIcon className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 mb-2">Psychological</h4>
                <p className="text-sm text-slate-600">WISC-V, BASC, Big Five, DMIT analysis</p>
                <div className="mt-3 text-2xl font-bold text-purple-600">{Math.round(e360Score.psychological)}</div>
              </div>
            </div>
            
            {/* Overall E360 Score */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
              <h4 className="text-lg font-bold mb-2">Overall E360 Score</h4>
              <div className="text-4xl font-bold mb-2">{Math.round(e360Score.overall)}</div>
              <p className="text-sm opacity-90">Scale: 40-100 (Below 40 requires medical intervention)</p>
            </div>
          </div>
        </div>

        {/* Workflow Visualization */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Complete Workflow Process</h3>
          
          <div className="relative">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-12">
              {workflowSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = activeStep === index;
                const isCompleted = index < activeStep;
                
                return (
                  <div key={step.id} className="relative">
                    {/* Connection Line */}
                    {index < workflowSteps.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-slate-200 z-0">
                        <div 
                          className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ${
                            isCompleted || isActive ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    )}
                    
                    {/* Step */}
                    <div className={`relative z-10 text-center transition-all duration-500 ${
                      isActive ? 'scale-110' : ''
                    }`}>
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isActive 
                          ? `bg-gradient-to-r ${step.color} shadow-lg` 
                          : isCompleted 
                            ? 'bg-green-500' 
                            : 'bg-slate-200'
                      }`}>
                        {isCompleted ? (
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                        ) : (
                          <IconComponent className={`w-6 h-6 ${
                            isActive ? 'text-white' : 'text-slate-500'
                          }`} />
                        )}
                      </div>
                      <h4 className={`text-sm font-bold mb-2 ${
                        isActive ? 'text-blue-600' : 'text-slate-900'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-tight">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Subject-wise Progress Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Subject-wise Progress</h4>
            <div className="space-y-4">
              {Object.entries(subjectScores).map(([subject, score]) => (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 capitalize">{subject}</span>
                    <span className="text-sm font-bold text-slate-900">{Math.round(score)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                        subject === 'mathematics' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        subject === 'science' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        subject === 'english' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Growth Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Predictive Growth to Grade 12</h4>
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="30" height="15" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Growth curve */}
                <path
                  d={`M 20 120 Q 80 ${120 - (animationProgress * 0.4)} 150 ${100 - (animationProgress * 0.3)} T 280 ${80 - (animationProgress * 0.2)}`}
                  fill="none"
                  stroke="url(#growthGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="growthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                
                {/* Data points */}
                {[20, 80, 150, 220, 280].map((x, index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={120 - (index * 10) - (animationProgress * 0.1 * index)}
                    r="4"
                    fill="#3b82f6"
                    className="animate-pulse"
                  />
                ))}
                
                {/* Labels */}
                <text x="20" y="140" textAnchor="middle" className="text-xs fill-slate-600">Grade 8</text>
                <text x="80" y="140" textAnchor="middle" className="text-xs fill-slate-600">Grade 9</text>
                <text x="150" y="140" textAnchor="middle" className="text-xs fill-slate-600">Grade 10</text>
                <text x="220" y="140" textAnchor="middle" className="text-xs fill-slate-600">Grade 11</text>
                <text x="280" y="140" textAnchor="middle" className="text-xs fill-slate-600">Grade 12</text>
              </svg>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              AI-powered predictions based on current performance trends and learning patterns.
            </p>
          </div>
        </div>

        {/* Analytics Types Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">Comprehensive Analytics Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyticsTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{type.title}</h4>
                  <p className="text-slate-600 text-sm mb-4">{type.description}</p>
                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>View Analytics</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DMIT Integration */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center mb-20">
          <h3 className="text-3xl font-bold mb-4">DMIT Integration</h3>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Dermatoglyphics Multiple Intelligence Test enhances psychological assessment accuracy, 
            providing deeper insights into learning styles and cognitive abilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <div className="text-2xl font-bold mb-2">Fingerprint Analysis</div>
              <div className="text-sm opacity-90">Unique pattern recognition</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <div className="text-2xl font-bold mb-2">Intelligence Mapping</div>
              <div className="text-sm opacity-90">Multiple intelligence types</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <div className="text-2xl font-bold mb-2">Learning Styles</div>
              <div className="text-sm opacity-90">Personalized approaches</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-4">
              <div className="text-2xl font-bold mb-2">Career Guidance</div>
              <div className="text-sm opacity-90">Future-ready insights</div>
            </div>
          </div>
          <Link
            href="/dmit"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Learn More About DMIT
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-6">
            Experience the Power of EduSight Analytics
          </h3>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Transform your child's educational journey with comprehensive 360° assessment and AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/demo-users"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 bg-white shadow-lg hover:shadow-xl"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Watch Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
