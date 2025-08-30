'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  HeartIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function CounselorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'COUNSELOR') {
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

  if (!session || session.user.role !== 'COUNSELOR') {
    return null;
  }

  const mockData = {
    totalStudents: 125,
    activeCases: 18,
    urgentCases: 3,
    completedSessions: 45,
    urgentStudents: [
      {
        name: 'Arjun Kumar',
        grade: '10A',
        issue: 'High stress levels, academic pressure',
        lastSession: '2024-01-20',
        priority: 'high',
        riskScore: 85
      },
      {
        name: 'Priya Reddy',
        grade: '9B',
        issue: 'Social anxiety, peer relationships',
        lastSession: '2024-01-18',
        priority: 'high',
        riskScore: 78
      },
      {
        name: 'Rohan Gupta',
        grade: '11C',
        issue: 'Career confusion, low motivation',
        lastSession: '2024-01-15',
        priority: 'medium',
        riskScore: 65
      }
    ],
    upcomingSessions: [
      { student: 'Ananya Singh', time: '10:00 AM', date: '2024-02-01', type: 'Individual' },
      { student: 'Karan Joshi', time: '11:30 AM', date: '2024-02-01', type: 'Group' },
      { student: 'Ishita Agarwal', time: '2:00 PM', date: '2024-02-01', type: 'Family' },
      { student: 'Aditya Mehta', time: '3:30 PM', date: '2024-02-01', type: 'Individual' }
    ],
    recentReports: [
      {
        title: 'Monthly Wellbeing Report',
        students: 125,
        date: '2024-01-31',
        status: 'completed'
      },
      {
        title: 'At-Risk Students Analysis',
        students: 18,
        date: '2024-01-28',
        status: 'in_progress'
      },
      {
        title: 'Career Guidance Summary',
        students: 67,
        date: '2024-01-25',
        status: 'completed'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Counselor Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {session.user.name} - Supporting student wellbeing
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                <CalendarIcon className="h-5 w-5 inline mr-2" />
                Schedule Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{mockData.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-orange-500 rounded-md p-3">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Cases</p>
                <p className="text-2xl font-semibold text-gray-900">{mockData.activeCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-md p-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Urgent Cases</p>
                <p className="text-2xl font-semibold text-gray-900">{mockData.urgentCases}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sessions This Month</p>
                <p className="text-2xl font-semibold text-gray-900">{mockData.completedSessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Cases Alert */}
        {mockData.urgentCases > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">
                  {mockData.urgentCases} Urgent Cases Require Immediate Attention
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Students with high risk scores need priority intervention
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Priority Students */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Priority Students</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.urgentStudents.map((student, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{student.name}</h4>
                          <span className="text-sm text-gray-500">Grade {student.grade}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            student.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {student.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{student.issue}</p>
                        <p className="text-xs text-gray-500 mt-2">Last session: {student.lastSession}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-lg font-semibold ${
                          student.riskScore >= 80 ? 'text-red-600' : 
                          student.riskScore >= 60 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {student.riskScore}
                        </div>
                        <div className="text-xs text-gray-500">Risk Score</div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-200">
                        Schedule Session
                      </button>
                      <button className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200">
                        View History
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ClockIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{session.student}</p>
                      <p className="text-sm text-gray-500">{session.time} • {session.type} Session</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">Join</button>
                      <button className="text-sm text-gray-600 hover:text-gray-800">Reschedule</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reports and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockData.recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.title}</p>
                        <p className="text-sm text-gray-500">{report.students} students • {report.date}</p>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <CalendarIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Schedule Session</p>
                </button>
                <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <DocumentTextIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Create Report</p>
                </button>
                <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UsersIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">View All Students</p>
                </button>
                <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChartBarIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">Analytics</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
