'use client';

import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  SparklesIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export function ReportShowcase() {
  const [reportProgress, setReportProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const reportSections = [
    {
      title: 'Executive Summary',
      description: 'Overall E360 Score and key insights',
      icon: SparklesIcon,
      color: 'from-blue-500 to-cyan-500',
      content: 'Comprehensive overview of student performance across all domains'
    },
    {
      title: 'Academic Analysis',
      description: 'Subject-wise performance and trends',
      icon: AcademicCapIcon,
      color: 'from-green-500 to-emerald-500',
      content: 'Detailed breakdown of academic achievements and areas for improvement'
    },
    {
      title: 'Physical Assessment',
      description: 'Health, fitness, and motor skills evaluation',
      icon: HeartIcon,
      color: 'from-red-500 to-pink-500',
      content: 'Complete physical development analysis with health recommendations'
    },
    {
      title: 'Psychological Profile',
      description: 'Cognitive abilities and personality insights',
      icon: LightBulbIcon,
      color: 'from-purple-500 to-indigo-500',
      content: 'In-depth psychological assessment including DMIT analysis'
    },
    {
      title: 'Career Recommendations',
      description: 'AI-powered career guidance and pathways',
      icon: TrophyIcon,
      color: 'from-orange-500 to-yellow-500',
      content: 'Personalized career suggestions based on comprehensive assessment'
    },
    {
      title: 'Action Plan',
      description: 'Specific recommendations and next steps',
      icon: CheckCircleIcon,
      color: 'from-teal-500 to-green-500',
      content: 'Actionable recommendations for parents, teachers, and students'
    }
  ];

  const sampleReportData = {
    studentName: 'Alex Johnson',
    grade: '10th Grade',
    school: 'Global International School',
    assessmentDate: '2024-01-15',
    e360Score: 83,
    academicScore: 85,
    physicalScore: 78,
    psychologicalScore: 86,
    riskLevel: 'Low',
    recommendations: 5,
    careerMatches: 12
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % reportSections.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [mounted, reportSections.length]);

  const generateReport = () => {
    setIsGenerating(true);
    setReportProgress(0);
    
    const progressTimer = setInterval(() => {
      setReportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setIsGenerating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-green-700 text-sm font-medium mb-6">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Comprehensive Report Generation
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Detailed PDF Reports with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Professional Branding
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Generate comprehensive, downloadable PDF reports with detailed analysis, 
            recommendations, and legal disclaimers for complete transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Report Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Report Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                      <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">EduSight Assessment Report</h3>
                      <p className="text-sm opacity-90">Comprehensive Student Analysis</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{sampleReportData.e360Score}</div>
                    <div className="text-sm opacity-90">E360 Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="opacity-90">Student:</div>
                    <div className="font-semibold">{sampleReportData.studentName}</div>
                  </div>
                  <div>
                    <div className="opacity-90">Grade:</div>
                    <div className="font-semibold">{sampleReportData.grade}</div>
                  </div>
                  <div>
                    <div className="opacity-90">School:</div>
                    <div className="font-semibold">{sampleReportData.school}</div>
                  </div>
                  <div>
                    <div className="opacity-90">Date:</div>
                    <div className="font-semibold">{sampleReportData.assessmentDate}</div>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6">
                {/* Score Breakdown */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Domain Scores</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AcademicCapIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">Academic Performance</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                            style={{ width: `${sampleReportData.academicScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900 w-8">{sampleReportData.academicScore}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HeartIcon className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-sm font-medium">Physical Development</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-1000"
                            style={{ width: `${sampleReportData.physicalScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900 w-8">{sampleReportData.physicalScore}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LightBulbIcon className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium">Psychological Wellbeing</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000"
                            style={{ width: `${sampleReportData.psychologicalScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-900 w-8">{sampleReportData.psychologicalScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Section Highlight */}
                <div className="mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      {React.createElement(reportSections[mounted ? currentSection : 0].icon, {
                        className: "w-5 h-5 text-blue-600 mr-2"
                      })}
                      <h5 className="font-bold text-slate-900">{reportSections[mounted ? currentSection : 0].title}</h5>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{reportSections[mounted ? currentSection : 0].description}</p>
                    <p className="text-xs text-slate-500">{reportSections[mounted ? currentSection : 0].content}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{sampleReportData.recommendations}</div>
                    <div className="text-xs text-slate-600">Recommendations</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{sampleReportData.careerMatches}</div>
                    <div className="text-xs text-slate-600">Career Matches</div>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-lg">
                    <div className="text-lg font-bold text-slate-600">{sampleReportData.riskLevel}</div>
                    <div className="text-xs text-slate-600">Risk Level</div>
                  </div>
                </div>

                {/* Legal Disclaimer Preview */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h6 className="text-xs font-semibold text-slate-900 mb-1">Legal Disclaimer</h6>
                      <p className="text-xs text-slate-500 leading-tight">
                        This assessment is for educational guidance purposes only. Results should be interpreted 
                        by qualified professionals. EduSight does not guarantee specific outcomes and recommends 
                        consulting with educational and medical professionals for comprehensive evaluation...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Actions */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
              
              <button className="inline-flex items-center px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                <PrinterIcon className="w-5 h-5 mr-2" />
                Print
              </button>
              
              <button className="inline-flex items-center px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                <ShareIcon className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Generating comprehensive report...</span>
                  <span>{reportProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${reportProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Report Sections */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Report Sections</h3>
            
            {reportSections.map((section, index) => {
              const IconComponent = section.icon;
              const isActive = currentSection === index;
              
              return (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                  onClick={() => setCurrentSection(index)}
                >
                  <div className="flex items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-r ${section.color} ${
                      isActive ? 'shadow-lg' : ''
                    }`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-lg font-bold mb-2 ${
                        isActive ? 'text-blue-900' : 'text-slate-900'
                      }`}>
                        {section.title}
                      </h4>
                      <p className={`text-sm mb-3 ${
                        isActive ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                        {section.description}
                      </p>
                      <p className={`text-xs ${
                        isActive ? 'text-blue-600' : 'text-slate-500'
                      }`}>
                        {section.content}
                      </p>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Professional Branding</h4>
            <p className="text-slate-600 text-sm">
              Custom branded reports with school logos, colors, and professional formatting.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Interactive Charts</h4>
            <p className="text-slate-600 text-sm">
              Dynamic visualizations and graphs that clearly communicate student progress.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Legal Compliance</h4>
            <p className="text-slate-600 text-sm">
              Comprehensive disclaimers and legal notices to ensure transparency and compliance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
