'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlayIcon,
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    students: 0,
    assessments: 0,
    schools: 0,
    accuracy: 0
  });

  const stats = [
    { label: 'Students Empowered', value: 50000, suffix: '+', icon: UserGroupIcon },
    { label: 'Assessments Completed', value: 250000, suffix: '+', icon: ChartBarIcon },
    { label: 'Schools Partnered', value: 500, suffix: '+', icon: AcademicCapIcon },
    { label: 'AI Accuracy', value: 98, suffix: '%', icon: SparklesIcon }
  ];

  const features = [
    'AI-Powered Intelligence Assessment',
    'Comprehensive Career Guidance',
    'Real-time Performance Analytics',
    'Personalized Learning Paths'
  ];

  const testimonialQuotes = [
    "EduSight transformed how we understand our students' potential",
    "The AI insights helped my child discover their true strengths",
    "Revolutionary approach to educational assessment",
    "Finally, data-driven decisions for student success"
  ];

  // Animate numbers on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      students: 50000,
      assessments: 250000,
      schools: 500,
      accuracy: 98
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedNumbers({
        students: Math.floor(targets.students * easeOut),
        assessments: Math.floor(targets.assessments * easeOut),
        schools: Math.floor(targets.schools * easeOut),
        accuracy: Math.floor(targets.accuracy * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  // Cycle through testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % testimonialQuotes.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [testimonialQuotes.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-edu-primary-50 via-white to-edu-secondary-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-edu-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-edu-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-edu-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-20 animate-float">
          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
            <AcademicCapIcon className="w-8 h-8 text-edu-primary-600" />
          </div>
        </div>
        <div className="absolute top-32 right-32 animate-float animation-delay-1000">
          <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-edu-secondary-600" />
          </div>
        </div>
        <div className="absolute bottom-32 left-32 animate-float animation-delay-2000">
          <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center">
            <SparklesIcon className="w-7 h-7 text-edu-accent-600" />
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-edu-primary-100 rounded-full text-edu-primary-800 text-sm font-medium mb-6 animate-fade-in">
              <SparklesIcon className="w-4 h-4 mr-2" />
              India's #1 AI-Powered Educational Assessment Platform
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Unlock Every Student's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 animate-gradient">
                True Potential
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Revolutionary AI-powered platform that transforms educational assessment through 
              advanced analytics, personalized insights, and comprehensive student development tracking.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center text-gray-700 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircleIcon className="w-5 h-5 text-edu-success-500 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/auth/signin"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 text-white font-semibold rounded-xl hover:from-edu-primary-700 hover:to-edu-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 border-2 border-edu-gray-300 text-edu-gray-700 font-semibold rounded-xl hover:border-edu-primary-500 hover:text-edu-primary-600 transition-all duration-300">
                <PlayIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </div>

            {/* Rotating Testimonial */}
            <div className="text-center lg:text-left">
              <div className="h-12 flex items-center">
                <p className="text-gray-600 italic animate-fade-in-out" key={currentStat}>
                  "{testimonialQuotes[currentStat]}"
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Stats & Visual */}
          <div className="relative">
            {/* Main Visual Container */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl opacity-10"></div>
              
              {/* Animated Stats Grid */}
              <div className="relative grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  const animatedValue = Object.values(animatedNumbers)[index];
                  
                  return (
                    <div 
                      key={index}
                      className="text-center p-4 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors duration-300 transform hover:scale-105"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3">
                        <IconComponent className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {animatedValue.toLocaleString()}{stat.suffix}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Achievement Badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                ✨ AI Powered
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                🏆 Award Winning
              </div>
            </div>

            {/* Floating Elements Around Main Visual */}
            <div className="absolute -top-8 left-8 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce animation-delay-500">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="absolute -bottom-8 right-8 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center animate-bounce animation-delay-1000">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="absolute top-1/2 -right-8 w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center animate-spin-slow">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm mb-6">Trusted by leading educational institutions across India</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for partner logos */}
            <div className="h-12 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Partner Logo</span>
            </div>
            <div className="h-12 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Partner Logo</span>
            </div>
            <div className="h-12 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Partner Logo</span>
            </div>
            <div className="h-12 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">Partner Logo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}