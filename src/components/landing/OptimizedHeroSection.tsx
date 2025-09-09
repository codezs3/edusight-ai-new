'use client';

import React, { useState, useEffect } from 'react';
import { useClientOnly } from '@/hooks/useClientOnly';
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
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

export function OptimizedHeroSection() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; delay: number; duration: number }>>([]);
  const mounted = useClientOnly();

  const dynamicFeatures = [
    {
      icon: AcademicCapIcon,
      title: "Academic Excellence",
      description: "Comprehensive assessment across all subjects and frameworks",
      color: "from-blue-500 to-cyan-500",
      stats: "50K+ Students"
    },
    {
      icon: HeartIcon,
      title: "Mental Health Support",
      description: "Psychological insights and wellbeing tracking",
      color: "from-pink-500 to-rose-500",
      stats: "95% Accuracy"
    },
    {
      icon: RocketLaunchIcon,
      title: "Career Guidance",
      description: "AI-powered career recommendations and mapping",
      color: "from-green-500 to-emerald-500",
      stats: "500+ Careers"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % dynamicFeatures.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [dynamicFeatures.length]);

  useEffect(() => {
    if (!mounted) return;
    
    // Generate particles only on client side
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }));
    setParticles(newParticles);
  }, [mounted]);

  const currentFeatureData = dynamicFeatures[currentFeature];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" 
             style={{ 
               left: '10%', 
               top: '20%',
               animation: 'float 6s ease-in-out infinite'
             }} />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" 
             style={{ 
               right: '10%', 
               bottom: '20%', 
               animationDelay: '2s',
               animation: 'float 8s ease-in-out infinite'
             }} />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" 
             style={{ 
               left: '50%', 
               top: '50%', 
               transform: 'translate(-50%, -50%)', 
               animationDelay: '4s',
               animation: 'float 10s ease-in-out infinite'
             }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {mounted && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Hero Title with Staggered Animation */}
          <div className="space-y-6">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Transform Education with
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                  AI-Powered Assessment
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Comprehensive 360° assessment platform combining academic excellence, psychological insights, and career guidance for holistic student development.
              </p>
            </div>
          </div>

          {/* Dynamic Feature Showcase */}
          <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${currentFeatureData.color} rounded-2xl flex items-center justify-center mr-4 animate-pulse`}>
                  <currentFeatureData.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{currentFeatureData.title}</h3>
                  <p className="text-sm text-gray-300">{currentFeatureData.stats}</p>
                </div>
              </div>
              <p className="text-lg text-gray-300 mb-6">{currentFeatureData.description}</p>
              
              {/* Feature Indicators */}
              <div className="flex justify-center space-x-2">
                {dynamicFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentFeature ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons with Hover Effects */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
              className="group bg-white/10 backdrop-blur-lg text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center space-x-2 hover:scale-105"
            >
              <ChartBarIcon className="w-6 h-6" />
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className={`flex flex-wrap justify-center items-center gap-8 text-gray-400 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span>Free Assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
