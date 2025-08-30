'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  AcademicCapIcon,
  HeartIcon,
  TrophyIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { AcademicPerformanceChart, PsychologicalWellbeingRadar } from '@/components/charts/PlotlyChart';

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'PARENT') {
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'PARENT') {
    return null;
  }

  const mockData = {
    children: [
      {
        name: 'Aarav Sharma',
        grade: '10th Grade',
        school: 'EduSight Demo School',
        overallScore: 85,
        recentAssessments: [
          { subject: 'Mathematics', score: 88, date: '2024-01-15' },
          { subject: 'Science', score: 92, date: '2024-01-12' },
          { subject: 'English', score: 78, date: '2024-01-10' }
        ],
        wellbeingData: {
          moodRating: 7,
          stressLevel: 4,
          selfConfidence: 4,
          socialInteraction: 4,
          motivationLevel: 4,
          sleepQuality: 3
        },
        alerts: [
          { type: 'warning', message: 'Slight decline in Mathematics performance', priority: 'medium' },
          { type: 'success', message: 'Excellent improvement in Science', priority: 'low' }
        ]
      }
    ],
    upcomingEvents: [
      { title: 'Parent-Teacher Meeting', date: '2024-02-05', type: 'meeting' },
      { title: 'Mathematics Test', date: '2024-02-08', type: 'assessment' },
      { title: 'Science Fair', date: '2024-02-15', type: 'event' },
      { title: 'Career Counseling Session', date: '2024-02-20', type: 'counseling' }
    ],
    recommendations: [
      {
        title: 'Mathematics Support',
        description: 'Consider additional practice in algebra and geometry',
        priority: 'high',
        action: 'Schedule tutoring session'
      },
      {
        title: 'Physical Activity',
        description: 'Encourage more outdoor activities for better physical health',
        priority: 'medium',
        action: 'Join sports club'
      },
      {
        title: 'Sleep Schedule',
        description: 'Improve sleep quality by establishing a consistent bedtime routine',
        priority: 'medium',
        action: 'Create bedtime schedule'
      }
    ]
  };

  const child = mockData.children[0]; // For demo, showing first child

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {session.user.name} - Monitoring {child.name}'s progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                <CalendarIcon className="h-5 w-5 inline mr-2" />
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Child Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-md p-3">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overall Score</p>
                <p className="text-2xl font-semibold text-gray-900">{child.overallScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-md p-3">
                <TrophyIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Class Rank</p>
                <p className="text-2xl font-semibold text-gray-900">5th</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-md p-3">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Wellbeing</p>
                <p className="text-2xl font-semibold text-gray-900">Good</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Improvement</p>
                <p className="text-2xl font-semibold text-gray-900">+8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {child.alerts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Important Alerts</h3>
            <div className="space-y-3">
              {child.alerts.map((alert, index) => (
                <div key={index} className={`flex items-start p-4 rounded-lg ${
                  alert.type === 'warning' ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  {alert.type === 'warning' ? (
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      alert.type === 'warning' ? 'text-yellow-800' : 'text-green-800'
                    }`}>
                      {alert.message}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.priority} priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Performance</h3>
            <div className="h-64">
              <AcademicPerformanceChart studentData={child.recentAssessments.map(a => ({
                subject: a.subject,
                score: a.score
              }))} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Psychological Wellbeing</h3>
            <div className="h-64">
              <PsychologicalWellbeingRadar wellbeingData={child.wellbeingData} />
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">{event.date} • {event.type}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{rec.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                      {rec.action}
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
