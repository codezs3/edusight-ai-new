'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlayIcon,
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  TrophyIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export function HeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dynamicFeatures = [
    {
      icon: AcademicCapIcon,
      title: "Academic Excellence",
      description: "Comprehensive assessment across all subjects and frameworks",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: LightBulbIcon,
      title: "AI-Powered Insights",
      description: "Smart recommendations for personalized learning paths",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrophyIcon,
      title: "Career Guidance",
      description: "Data-driven career recommendations with O*NET integration",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: ChartBarIcon,
      title: "Holistic Analytics",
      description: "360° view of academic, physical, and psychological development",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { label: 'Students Empowered', value: '50K+', icon: AcademicCapIcon },
    { label: 'Schools Connected', value: '500+', icon: ChartBarIcon },
    { label: 'AI Accuracy Rate', value: '98%', icon: SparklesIcon },
    { label: 'Success Stories', value: '1000+', icon: StarIcon }
  ];

  const keyBenefits = [
    'EduSight 360° Comprehensive Assessment System',
    'Multi-Framework Support (IB, IGCSE, ICSE, CBSE)',
    'Real-time Performance Analytics & Insights',
    'AI-Powered Career Matching & Guidance'
  ];

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % dynamicFeatures.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dynamicFeatures.length]);

  const currentFeatureData = dynamicFeatures[mounted ? currentFeature : 0];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg rotate-45 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-lg rotate-12 animate-float animation-delay-3000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Content */}
          <div className={`lg:col-span-7 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Dynamic Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20 text-slate-700 text-sm font-medium mb-8 hover:shadow-xl transition-all duration-300">
              <SparklesIcon className="w-4 h-4 mr-2 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                Next-Generation Educational Analytics
              </span>
            </div>

            {/* Main Headline with Gradient Text */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Unlock Every Student's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 animate-gradient-x">
                True Potential
              </span>
            </h1>

            {/* Dynamic Subtitle */}
            <p className="text-xl lg:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform educational assessment with our comprehensive 
              <span className="font-semibold text-slate-800"> AI-powered platform</span> that provides 
              <span className="font-semibold text-slate-800"> holistic insights</span> across academic, 
              physical, and psychological domains.
            </p>

            {/* Key Benefits with Animated Checkmarks */}
            <div className="space-y-4 mb-10">
              {keyBenefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-center lg:justify-start transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons with Hover Effects */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                href="/auth/signin"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Start Free Assessment</span>
                <ArrowRightIcon className="relative z-10 w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                href="/demo-users"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Trust Indicators with Icons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">99.9% Uptime</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse animation-delay-500"></div>
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse animation-delay-1000"></div>
                <span className="font-medium">ISO 27001 Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Dashboard Preview */}
          <div className={`lg:col-span-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                {/* Dynamic Feature Header */}
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${currentFeatureData.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}>
                    <currentFeatureData.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{currentFeatureData.title}</h3>
                    <p className="text-slate-600 text-sm">{currentFeatureData.description}</p>
                  </div>
                </div>

                {/* EduSight 360° Score Visualization */}
                <div className="text-center mb-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">EduSight 360° Score</h4>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(87 * 314) / 100} 314`}
                        className="transition-all duration-2000 ease-out"
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">87</div>
                        <div className="text-xs text-slate-500 font-medium">Excellent</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assessment Categories with Progress Bars */}
                <div className="space-y-4 mb-6">
                  {[
                    { name: 'Academic Performance', score: 89, color: 'from-blue-500 to-cyan-500' },
                    { name: 'Psychological Wellbeing', score: 85, color: 'from-purple-500 to-pink-500' },
                    { name: 'Physical Development', score: 87, color: 'from-green-500 to-emerald-500' }
                  ].map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700">{category.name}</span>
                        <span className="text-sm font-bold text-slate-900">{category.score}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${category.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="text-center p-3 bg-slate-50 rounded-xl">
                      <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse shadow-lg"></div>
              
              {/* Achievement Badge */}
              <div className="absolute -top-6 left-6 bg-white rounded-full p-2 shadow-lg border-4 border-green-100">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className={`mt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group cursor-pointer"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 mb-4 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
