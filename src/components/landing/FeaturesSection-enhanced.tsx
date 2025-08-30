'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  UserGroupIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  TrophyIcon,
  HeartIcon,
  BeakerIcon,
  DocumentTextIcon,
  CogIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

export default function FeaturesSection() {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      name: 'EduSight 360° Assessment',
      description: 'Comprehensive evaluation covering academic performance, psychological wellbeing, and physical development with AI-powered insights.',
      icon: SparklesIcon,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      stats: '40-100 Scale',
      highlight: 'Core Feature'
    },
    {
      name: 'Multi-Framework Support',
      description: 'Seamlessly integrate with IB, IGCSE, ICSE, CBSE, and other educational frameworks with specialized assessment methods.',
      icon: GlobeAltIcon,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      stats: '15+ Frameworks',
      highlight: 'Global'
    },
    {
      name: 'AI-Powered Career Matching',
      description: 'Advanced algorithms analyze student profiles to provide personalized career recommendations with O*NET database integration.',
      icon: TrophyIcon,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      stats: '1000+ Careers',
      highlight: 'AI-Powered'
    },
    {
      name: 'Real-Time Analytics',
      description: 'Dynamic dashboards and reports provide instant insights into student progress, performance trends, and intervention needs.',
      icon: ChartBarIcon,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      stats: 'Live Updates',
      highlight: 'Real-Time'
    },
    {
      name: 'Validated Assessments',
      description: 'Scientifically validated psychological tests including WISC-V, BASC, SDQ, GAD-7, and Big Five personality assessments.',
      icon: BeakerIcon,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      stats: '10+ Tests',
      highlight: 'Validated'
    },
    {
      name: 'Collaborative Platform',
      description: 'Seamless communication between students, parents, teachers, and counselors with role-based access and notifications.',
      icon: UserGroupIcon,
      color: 'from-teal-500 to-green-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      stats: '5 User Types',
      highlight: 'Collaborative'
    },
    {
      name: 'Physical Health Tracking',
      description: 'Monitor BMI, fitness levels, motor skills, and physical development with comprehensive health analytics.',
      icon: HeartIcon,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      stats: 'Health Metrics',
      highlight: 'Holistic'
    },
    {
      name: 'Secure & Compliant',
      description: 'Enterprise-grade security with GDPR compliance, ISO 27001 certification, and 99.9% uptime guarantee.',
      icon: ShieldCheckIcon,
      color: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600',
      stats: '99.9% Uptime',
      highlight: 'Secure'
    }
  ];

  const coreCapabilities = [
    {
      title: 'Academic Excellence',
      description: 'Comprehensive assessment tools that measure and enhance academic performance across all subjects.',
      icon: AcademicCapIcon,
      metrics: ['Subject Analysis', 'Grade Tracking', 'Performance Trends']
    },
    {
      title: 'Psychological Insights',
      description: 'Deep understanding of student psychology, learning styles, and emotional wellbeing.',
      icon: LightBulbIcon,
      metrics: ['Cognitive Assessment', 'Personality Analysis', 'Learning Styles']
    },
    {
      title: 'Data-Driven Decisions',
      description: 'Advanced analytics and machine learning provide actionable insights for all stakeholders.',
      icon: ChartBarIcon,
      metrics: ['Predictive Analytics', 'Performance Insights', 'Trend Analysis']
    },
    {
      title: 'Workflow Automation',
      description: 'Streamlined processes for assessment, reporting, and intervention management.',
      icon: CogIcon,
      metrics: ['Automated Reports', 'Smart Notifications', 'Process Optimization']
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleFeatures(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureElements = document.querySelectorAll('[data-index]');
    featureElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [features.length]);

  return (
    <div id="features" className="py-24 sm:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" ref={sectionRef}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Comprehensive Platform Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
              Everything You Need for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Educational Excellence
              </span>
            </h2>
            <p className="text-lg leading-8 text-slate-600 max-w-3xl mx-auto">
              EduSight provides a holistic approach to student development, combining advanced analytics, 
              personalized assessments, and intuitive workflows to empower educators and students alike.
            </p>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isVisible = visibleFeatures.includes(index);
              const isActive = activeFeature === index;
              
              return (
                <div
                  key={feature.name}
                  data-index={index}
                  className={`group relative flex flex-col p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-xl transition-all duration-500 cursor-pointer ${
                    isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
                  } ${isActive ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Feature Badge */}
                  <div className="absolute -top-3 -right-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      feature.highlight === 'Core Feature' ? 'bg-blue-100 text-blue-700' :
                      feature.highlight === 'AI-Powered' ? 'bg-purple-100 text-purple-700' :
                      feature.highlight === 'Real-Time' ? 'bg-green-100 text-green-700' :
                      feature.highlight === 'Global' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {feature.highlight}
                    </span>
                  </div>

                  {/* Icon */}
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-bold">{feature.name}</div>
                      <div className="text-sm text-slate-500 font-medium">{feature.stats}</div>
                    </div>
                  </dt>

                  {/* Description */}
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto mb-4">{feature.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                      <div 
                        className={`bg-gradient-to-r ${feature.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: isVisible ? '85%' : '0%' }}
                      ></div>
                    </div>

                    {/* Learn More Link */}
                    <p className="mt-auto">
                      <Link 
                        href="#" 
                        className={`text-sm font-semibold leading-6 ${feature.textColor} hover:opacity-80 transition-opacity inline-flex items-center`}
                      >
                        Learn more 
                        <span aria-hidden="true" className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    </p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Core Capabilities Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Core Capabilities</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Built on a foundation of educational expertise and cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreCapabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <div 
                  key={index}
                  className="group text-center p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{capability.title}</h4>
                  <p className="text-slate-600 text-sm mb-4">{capability.description}</p>
                  <div className="space-y-1">
                    {capability.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="text-xs text-slate-500 bg-slate-50 rounded-full px-3 py-1 inline-block mr-1">
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Education?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of educators who are already using EduSight to unlock student potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo-users"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <PlayIcon className="w-5 h-5 mr-2" />
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
