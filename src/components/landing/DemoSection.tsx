'use client';

import { useState } from 'react';
import { 
  PlayIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CogIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export function DemoSection() {
  const [activeDemo, setActiveDemo] = useState('dashboard');

  const demoOptions = [
    {
      id: 'dashboard',
      title: 'Student Dashboard',
      description: 'Comprehensive view of student progress and achievements',
      icon: ChartBarIcon,
      color: 'blue',
      features: ['Real-time Analytics', 'Progress Tracking', 'Achievement Badges', 'Performance Insights']
    },
    {
      id: 'assessment',
      title: 'AI Assessment',
      description: 'Intelligent testing with personalized recommendations',
      icon: AcademicCapIcon,
      color: 'green',
      features: ['Adaptive Testing', 'AI Scoring', 'Instant Feedback', 'Learning Paths']
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Deep insights into learning patterns and potential',
      icon: SparklesIcon,
      color: 'purple',
      features: ['Predictive Analytics', 'Learning Style Analysis', 'Career Guidance', 'Risk Assessment']
    },
    {
      id: 'collaboration',
      title: 'Teacher Tools',
      description: 'Powerful tools for educators and administrators',
      icon: UserGroupIcon,
      color: 'orange',
      features: ['Class Management', 'Parent Communication', 'Report Generation', 'Workflow Automation']
    }
  ];

  const mockData = {
    dashboard: {
      title: 'Student Performance Dashboard',
      metrics: [
        { label: 'Overall Score', value: '85%', trend: '+5%' },
        { label: 'Assessments Completed', value: '23', trend: '+3' },
        { label: 'Class Rank', value: '#3', trend: '↑2' },
        { label: 'Learning Streak', value: '7 days', trend: 'Active' }
      ],
      chart: 'Performance trending upward across all subjects'
    },
    assessment: {
      title: 'AI-Powered Assessment Engine',
      metrics: [
        { label: 'Questions Adapted', value: '45', trend: 'Real-time' },
        { label: 'Accuracy Rate', value: '92%', trend: '+8%' },
        { label: 'Time Saved', value: '40%', trend: 'Efficient' },
        { label: 'Insights Generated', value: '12', trend: 'Actionable' }
      ],
      chart: 'Adaptive difficulty based on student responses'
    },
    analytics: {
      title: 'Advanced Learning Analytics',
      metrics: [
        { label: 'Learning Style', value: 'Visual', trend: 'Identified' },
        { label: 'Career Match', value: '94%', trend: 'STEM' },
        { label: 'Risk Factors', value: 'Low', trend: 'Monitored' },
        { label: 'Recommendations', value: '8', trend: 'Personalized' }
      ],
      chart: 'Multi-dimensional intelligence analysis'
    },
    collaboration: {
      title: 'Teacher Collaboration Hub',
      metrics: [
        { label: 'Students Managed', value: '89', trend: '3 Classes' },
        { label: 'Reports Generated', value: '15', trend: 'This month' },
        { label: 'Parent Meetings', value: '12', trend: 'Scheduled' },
        { label: 'Workflow Efficiency', value: '78%', trend: '+15%' }
      ],
      chart: 'Streamlined educational workflows'
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white'
    };
    return colors[color as keyof typeof colors];
  };

  const currentDemo = mockData[activeDemo as keyof typeof mockData];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            See EduSight in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our interactive demo to discover how EduSight transforms educational assessment and student development
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Demo Navigation */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Experience</h3>
            
            {demoOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive = activeDemo === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => setActiveDemo(option.id)}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    isActive 
                      ? 'border-primary-500 bg-primary-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isActive ? getColorClasses(option.color) : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isActive ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-2 ${
                        isActive ? 'text-primary-900' : 'text-gray-900'
                      }`}>
                        {option.title}
                      </h4>
                      <p className={`text-sm mb-3 ${
                        isActive ? 'text-primary-700' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {option.features.map((feature, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs rounded-full ${
                              isActive 
                                ? 'bg-primary-100 text-primary-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {isActive && (
                      <ArrowRightIcon className="w-5 h-5 text-primary-600 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Demo Display */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Mock Browser Header */}
              <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded px-3 py-1 text-sm text-gray-600">
                    edusight.com/{activeDemo}
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentDemo.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">Live Demo</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentDemo.metrics.map((metric, index) => (
                    <div 
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {metric.label}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {metric.trend}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Placeholder */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 text-center">
                  <div className="w-full h-32 bg-white bg-opacity-50 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-gray-500">
                      📊 Interactive Chart
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{currentDemo.chart}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Try Interactive Demo
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <PlayIcon className="w-4 h-4 inline mr-2" />
                    Watch Video
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              ✨
            </div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center animate-pulse">
              🚀
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Educational Experience?</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of educators and students who are already benefiting from EduSight's AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Start Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
