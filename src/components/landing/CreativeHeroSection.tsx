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
  LightBulbIcon,
  HeartIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export function CreativeHeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const dynamicFeatures = [
    {
      icon: AcademicCapIcon,
      title: "Academic Excellence",
      description: "Comprehensive assessment across all subjects and frameworks",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: CpuChipIcon,
      title: "AI-Powered Insights",
      description: "Smart recommendations for personalized learning paths",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: RocketLaunchIcon,
      title: "Career Guidance",
      description: "Data-driven career recommendations with O*NET integration",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: HeartIcon,
      title: "Mental Health Support",
      description: "Comprehensive psychological assessment and wellbeing tracking",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % dynamicFeatures.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [dynamicFeatures.length]);

  const currentFeatureData = dynamicFeatures[currentFeature] || dynamicFeatures[0];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Simple Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ left: '20%', top: '20%' }} />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-green-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ right: '20%', bottom: '20%', animationDelay: '1s' }} />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Hero Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Transform Education with
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered Assessment
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive 360° assessment platform combining academic excellence, psychological insights, and career guidance for holistic student development.
            </p>
          </div>

          {/* Dynamic Feature Showcase */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${currentFeatureData.color} rounded-2xl flex items-center justify-center mr-4`}>
                  <currentFeatureData.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">{currentFeatureData.title}</h3>
              </div>
              <p className="text-lg text-gray-300 mb-6">{currentFeatureData.description}</p>
              
              {/* Feature Indicators */}
              <div className="flex justify-center space-x-2">
                {dynamicFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFeature ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/guest-assessment"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <PlayIcon className="w-6 h-6" />
              <span>Start Free Assessment</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/dashboard"
              className="group bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center space-x-2"
            >
              <ChartBarIcon className="w-6 h-6" />
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <AcademicCapIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Academic Excellence</h3>
              <p className="text-gray-300">Comprehensive assessment across all subjects and frameworks</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <HeartIcon className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Mental Health</h3>
              <p className="text-gray-300">Psychological insights and wellbeing tracking</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <RocketLaunchIcon className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Career Guidance</h3>
              <p className="text-gray-300">AI-powered career recommendations and mapping</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}