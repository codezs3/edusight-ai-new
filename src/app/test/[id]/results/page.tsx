'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BrainIcon,
  HeartIcon,
  BeakerIcon,
  SparklesIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  StarIcon,
  LightBulbIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  TrophyIcon as TrophySolidIcon
} from '@heroicons/react/24/solid';

interface TestResult {
  id: number;
  test_id: number;
  user_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  completion_time: number;
  submitted_at: string;
  detailed_results: {
    category_scores: { [key: string]: number };
    question_analysis: Array<{
      question_id: number;
      correct: boolean;
      user_answer: any;
      correct_answer: any;
      time_spent: number;
    }>;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  test_info: {
    title: string;
    assessment_type: string;
    difficulty: string;
    category: {
      name: string;
      color: string;
      icon: string;
    };
  };
}

export default function TestResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const testId = params.id as string;

  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // For now, generate mock results
        // In a real app, this would fetch from your API
        const mockResult: TestResult = {
          id: 1,
          test_id: parseInt(testId),
          user_id: session?.user?.id || 'guest',
          score: 85,
          total_questions: 20,
          correct_answers: 17,
          completion_time: 1456, // seconds
          submitted_at: new Date().toISOString(),
          detailed_results: {
            category_scores: {
              'Academic': 90,
              'Cognitive': 80,
              'Personality': 85,
              'Skills': 75
            },
            question_analysis: Array.from({ length: 20 }, (_, i) => ({
              question_id: i + 1,
              correct: Math.random() > 0.15,
              user_answer: 'Sample answer',
              correct_answer: 'Correct answer',
              time_spent: Math.floor(Math.random() * 60) + 30
            })),
            strengths: [
              'Strong analytical thinking',
              'Excellent problem-solving skills',
              'Good attention to detail',
              'Strong logical reasoning'
            ],
            weaknesses: [
              'Time management could be improved',
              'Some areas need more practice',
              'Consider reviewing basic concepts'
            ],
            recommendations: [
              'Focus on time management strategies',
              'Practice more sample questions',
              'Review fundamental concepts',
              'Consider taking advanced courses'
            ]
          },
          test_info: {
            title: 'Comprehensive Assessment Test',
            assessment_type: 'academic',
            difficulty: 'intermediate',
            category: {
              name: 'Academic Excellence',
              color: '#3B82F6',
              icon: 'academic-cap'
            }
          }
        };

        setResult(mockResult);
      } catch (error) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchResults();
    }
  }, [testId, session]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-blue-100 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      'academic': AcademicCapIcon,
      'psychological': BrainIcon,
      'personality': HeartIcon,
      'cognitive': BeakerIcon,
      'physical': ChartBarIcon,
      'career': SparklesIcon,
    };
    return icons[type] || AcademicCapIcon;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleRetakeTest = () => {
    router.push(`/test/${testId}`);
  };

  const handleViewTestVault = () => {
    router.push('/testvault');
  };

  const handleDownloadReport = () => {
    // Implement PDF generation and download
    console.log('Downloading report...');
  };

  const handleShareResults = () => {
    // Implement sharing functionality
    console.log('Sharing results...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-800">Loading Results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">Results not found</p>
          <button
            onClick={() => router.push('/testvault')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to TestVault
          </button>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(result.test_info.assessment_type);
  const percentage = Math.round((result.correct_answers / result.total_questions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/testvault')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to TestVault
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShareResults}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ShareIcon className="h-4 w-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleDownloadReport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
                <TrophySolidIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
            <p className="text-lg text-gray-600 mb-6">{result.test_info.title}</p>
            
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{result.correct_answers}/{result.total_questions}</div>
                <div className="text-sm text-gray-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{formatTime(result.completion_time)}</div>
                <div className="text-sm text-gray-500">Time Taken</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Breakdown */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
                Score Breakdown
              </h2>
              
              <div className="space-y-4">
                {Object.entries(result.detailed_results.category_scores).map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{category}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <StarSolidIcon className="h-5 w-5 mr-2 text-green-600" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {result.detailed_results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.detailed_results.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-purple-600" />
                Recommendations
              </h2>
              <ul className="space-y-3">
                {result.detailed_results.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Test Info */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TypeIcon className="h-5 w-5 mr-2 text-blue-600" />
                Test Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{result.test_info.assessment_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium capitalize">{result.test_info.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{result.test_info.category.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">{new Date(result.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>{percentage}%</div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{result.correct_answers}</div>
                    <div className="text-xs text-gray-600">Correct</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{result.total_questions - result.correct_answers}</div>
                    <div className="text-xs text-gray-600">Incorrect</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-3">
                <button
                  onClick={handleRetakeTest}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                  <span>Retake Test</span>
                </button>
                
                <button
                  onClick={handleViewTestVault}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <AcademicCapIcon className="h-4 w-4" />
                  <span>Browse More Tests</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
