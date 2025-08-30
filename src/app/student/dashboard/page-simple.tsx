'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TrophyIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function SimpleStudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'STUDENT') {
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'STUDENT') {
    return null;
  }

  const mockData = {
    student: {
      name: session?.user.name,
      grade: '10th Grade',
      section: 'A',
      rollNumber: 'STU001'
    },
    recentAssessments: [
      { subject: 'Mathematics', score: 85, maxScore: 100, date: '2024-01-15' },
      { subject: 'Science', score: 92, maxScore: 100, date: '2024-01-12' },
      { subject: 'English', score: 78, maxScore: 100, date: '2024-01-10' },
      { subject: 'History', score: 88, maxScore: 100, date: '2024-01-08' }
    ],
    upcomingAssessments: [
      { title: 'Physics Test', date: '2024-02-01', type: 'Academic' },
      { title: 'Psychological Wellbeing Check', date: '2024-02-05', type: 'Wellbeing' },
      { title: 'Career Interest Survey', date: '2024-02-10', type: 'Career' }
    ]
  };

  const averageScore = mockData.recentAssessments.reduce((acc, assessment) => 
    acc + (assessment.score / assessment.maxScore) * 100, 0
  ) / mockData.recentAssessments.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {mockData.student.name} - {mockData.student.grade}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-md p-3">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">{averageScore.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-md p-3">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rank</p>
                <p className="text-2xl font-semibold text-gray-900">5th</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Assessments</p>
                <p className="text-2xl font-semibold text-gray-900">{mockData.recentAssessments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-md p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Improvement</p>
                <p className="text-2xl font-semibold text-gray-900">+12%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Assessments and Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Assessments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.recentAssessments.map((assessment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{assessment.subject}</p>
                      <p className="text-sm text-gray-500">{assessment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {assessment.score}/{assessment.maxScore}
                      </p>
                      <p className={`text-sm ${
                        (assessment.score / assessment.maxScore) >= 0.8 
                          ? 'text-green-600' 
                          : (assessment.score / assessment.maxScore) >= 0.6 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}>
                        {((assessment.score / assessment.maxScore) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Assessments</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.upcomingAssessments.map((assessment, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{assessment.title}</p>
                      <p className="text-sm text-gray-500">{assessment.type} • {assessment.date}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Prepare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
