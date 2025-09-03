'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  LightBulbIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  CheckCircleIcon,
  StarIcon,
  BeakerIcon,
  BookOpenIcon,
  CpuChipIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface GuestReportData {
  studentInfo: {
    name: string;
    grade: string;
    uploadType: string;
  };
  academicAnalysis: {
    overallGrade: string;
    subjects: Array<{
      subject: string;
      grade: string;
      performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
    }>;
    strengths: string[];
    improvementAreas: string[];
    attendance: string;
  };
  careerRecommendations: Array<{
    field: string;
    match: number;
    reasoning: string;
    skills: string[];
  }>;
  eduSightScore: {
    overall: number;
    academic: number;
    behavioral: number;
    potential: number;
  };
  insights: {
    topInsight: string;
    recommendations: string[];
    nextSteps: string[];
  };
}

export default function GuestReportPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const welcome = searchParams.get('welcome');
  
  const [reportData, setReportData] = useState<GuestReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    if (sessionId) {
      generateMockReport();
    }
  }, [sessionId]);

  const generateMockReport = () => {
    // Generate a comprehensive mock report
    const mockReport: GuestReportData = {
      studentInfo: {
        name: searchParams.get('studentName') || 'Student',
        grade: '10',
        uploadType: 'report_cards'
      },
      academicAnalysis: {
        overallGrade: 'A-',
        subjects: [
          { subject: 'Mathematics', grade: '92%', performance: 'excellent' },
          { subject: 'English', grade: '87%', performance: 'good' },
          { subject: 'Science', grade: '94%', performance: 'excellent' },
          { subject: 'Social Studies', grade: '83%', performance: 'good' },
          { subject: 'Computer Science', grade: '96%', performance: 'excellent' }
        ],
        strengths: [
          'Strong analytical and problem-solving skills',
          'Excellent performance in STEM subjects',
          'Consistent academic improvement',
          'Good time management abilities'
        ],
        improvementAreas: [
          'Language arts writing skills',
          'Public speaking confidence',
          'Creative expression',
          'Collaborative teamwork'
        ],
        attendance: '96%'
      },
      careerRecommendations: [
        {
          field: 'Software Engineering',
          match: 94,
          reasoning: 'Strong mathematical foundation and excellent computer science performance',
          skills: ['Programming', 'Logic', 'Problem-solving', 'Analytical thinking']
        },
        {
          field: 'Data Science',
          match: 91,
          reasoning: 'Outstanding mathematics and science scores with analytical mindset',
          skills: ['Statistics', 'Mathematics', 'Research', 'Pattern recognition']
        },
        {
          field: 'Biomedical Engineering',
          match: 87,
          reasoning: 'Strong science foundation with good problem-solving abilities',
          skills: ['Biology', 'Engineering', 'Research', 'Innovation']
        }
      ],
      eduSightScore: {
        overall: 88,
        academic: 92,
        behavioral: 85,
        potential: 90
      },
      insights: {
        topInsight: "Exceptional STEM performance with strong potential for technology-related careers",
        recommendations: [
          'Consider advanced STEM courses or competitions',
          'Explore programming and coding activities',
          'Join science or robotics clubs',
          'Develop communication skills through presentations'
        ],
        nextSteps: [
          'Set specific academic goals for next semester',
          'Research universities with strong STEM programs',
          'Consider internships or shadow professionals',
          'Build a portfolio of projects and achievements'
        ]
      }
    };

    setReportData(mockReport);
    setLoading(false);

    if (welcome === 'true') {
      toast.success('Welcome! Your assessment report is ready.');
    }
  };

  const handleDownloadReport = () => {
    if (!session) {
      toast.error('Please sign in to download your report');
      return;
    }

    setDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setDownloading(false);
      setShowSubscriptionModal(true);
    }, 2000);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'needs_improvement': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Report not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Assessment Report</h1>
              <p className="text-blue-100 mt-2">
                Comprehensive analysis for {reportData.studentInfo.name}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{reportData.eduSightScore.overall}</div>
              <div className="text-sm opacity-90">EduSight Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Download Button */}
        <div className="mb-8 text-center">
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            {downloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Preparing Download...</span>
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Download Complete Report</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* EduSight Scores */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrophyIcon className="w-6 h-6 text-yellow-500 mr-2" />
                EduSight 360° Scores
              </h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(reportData.eduSightScore.overall)} mb-2`}>
                    {reportData.eduSightScore.overall}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Academic</span>
                    <span className={`font-semibold ${getScoreColor(reportData.eduSightScore.academic)}`}>
                      {reportData.eduSightScore.academic}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Behavioral</span>
                    <span className={`font-semibold ${getScoreColor(reportData.eduSightScore.behavioral)}`}>
                      {reportData.eduSightScore.behavioral}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Potential</span>
                    <span className={`font-semibold ${getScoreColor(reportData.eduSightScore.potential)}`}>
                      {reportData.eduSightScore.potential}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <AcademicCapIcon className="w-6 h-6 text-blue-500 mr-2" />
                Academic Performance
              </h2>
              
              <div className="space-y-4">
                {reportData.academicAnalysis.subjects.map((subject, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{subject.subject}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${getPerformanceColor(subject.performance)}`}>
                        {subject.performance.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{subject.grade}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Overall Grade</span>
                  <span className="text-xl font-bold text-blue-600">{reportData.academicAnalysis.overallGrade}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Attendance</span>
                  <span className="text-sm font-medium text-gray-900">{reportData.academicAnalysis.attendance}</span>
                </div>
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BeakerIcon className="w-6 h-6 text-purple-500 mr-2" />
                Career Recommendations
              </h2>
              
              <div className="space-y-4">
                {reportData.careerRecommendations.map((career, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900">{career.field}</h3>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{career.match}% match</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{career.reasoning}</p>
                    <div className="flex flex-wrap gap-2">
                      {career.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Key Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2" />
                Key Insight
              </h3>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">{reportData.insights.topInsight}</p>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                Strengths
              </h3>
              <div className="space-y-2">
                {reportData.academicAnalysis.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 text-blue-500 mr-2" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {reportData.insights.recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BookOpenIcon className="w-5 h-5 text-purple-500 mr-2" />
                Next Steps
              </h3>
              <div className="space-y-2">
                {reportData.insights.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-4 h-4 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Unlock Full Report</h2>
              <p className="text-gray-600 mb-6">
                Upgrade to Premium to download your complete assessment report with detailed analytics and recommendations.
              </p>
              
              <div className="space-y-3 mb-6">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700">
                  Upgrade to Premium - ₹299/month
                </button>
                <button 
                  onClick={() => setShowSubscriptionModal(false)}
                  className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200"
                >
                  Maybe Later
                </button>
              </div>
              
              <p className="text-xs text-gray-500">
                ✨ Premium includes unlimited reports, progress tracking, and personalized learning plans
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
