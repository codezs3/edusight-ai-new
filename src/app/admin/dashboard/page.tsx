'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  ExclamationTriangleIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAssessments: number;
  totalSchools: number;
  activeUsers: number;
  recentActivity: any[];
  systemAlerts: any[];
  performanceMetrics: any;
}

export default function EnhancedAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAssessments: 0,
    totalSchools: 0,
    activeUsers: 0,
    recentActivity: [],
    systemAlerts: [],
    performanceMetrics: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      // Simulate comprehensive dashboard data
      const mockStats: DashboardStats = {
        totalUsers: 99,
        totalStudents: 44,
        totalTeachers: 12,
        totalAssessments: 132,
        totalSchools: 4,
        activeUsers: 67,
        recentActivity: [
          {
            type: 'user_registration',
            user: 'student4@edusight.com',
            action: 'New student registered',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            status: 'success'
          },
          {
            type: 'assessment_completed',
            user: 'Alex Thompson',
            action: 'Completed Mathematics Assessment',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            status: 'success'
          },
          {
            type: 'teacher_login',
            user: 'Sarah Johnson',
            action: 'Teacher logged in',
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            status: 'info'
          },
          {
            type: 'system_backup',
            user: 'System',
            action: 'Daily backup completed',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            status: 'success'
          },
          {
            type: 'payment_received',
            user: 'EduSight Demo School',
            action: 'Monthly subscription payment received',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'success'
          }
        ],
        systemAlerts: [
          {
            type: 'info',
            title: 'Database Migration Complete',
            message: 'Successfully migrated 99 users from Django to Next.js platform',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            priority: 'low'
          },
          {
            type: 'warning',
            title: 'High Server Load',
            message: 'Server CPU usage at 78%. Consider scaling resources.',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            priority: 'medium'
          },
          {
            type: 'success',
            title: 'Security Scan Complete',
            message: 'Weekly security scan completed. No vulnerabilities found.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            priority: 'low'
          }
        ],
        performanceMetrics: {
          userGrowth: 12.5,
          assessmentCompletion: 89.3,
          systemUptime: 99.9,
          avgResponseTime: 245
        }
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+12.5%',
      changeType: 'positive' as const,
      description: 'All registered users'
    },
    {
      name: 'Active Students',
      value: stats.totalStudents,
      icon: AcademicCapIcon,
      color: 'bg-green-500',
      change: '+8.2%',
      changeType: 'positive' as const,
      description: 'Currently enrolled'
    },
    {
      name: 'Teachers',
      value: stats.totalTeachers,
      icon: UsersIcon,
      color: 'bg-purple-500',
      change: '+15.0%',
      changeType: 'positive' as const,
      description: 'Active educators'
    },
    {
      name: 'Assessments',
      value: stats.totalAssessments,
      icon: DocumentTextIcon,
      color: 'bg-orange-500',
      change: '+23.1%',
      changeType: 'positive' as const,
      description: 'Completed this month'
    },
    {
      name: 'Schools',
      value: stats.totalSchools,
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
      change: '+2.0%',
      changeType: 'positive' as const,
      description: 'Partner institutions'
    },
    {
      name: 'Active Now',
      value: stats.activeUsers,
      icon: BellIcon,
      color: 'bg-red-500',
      change: '+5.3%',
      changeType: 'positive' as const,
      description: 'Users online'
    }
  ];

  const quickActions = [
    { name: 'Add New User', href: '/admin/users/new', icon: PlusIcon, color: 'bg-blue-600' },
    { name: 'Manage Schools', href: '/admin/schools', icon: AcademicCapIcon, color: 'bg-green-600' },
    { name: 'View Reports', href: '/admin/reports', icon: DocumentTextIcon, color: 'bg-purple-600' },
    { name: 'System Settings', href: '/admin/settings', icon: CogIcon, color: 'bg-gray-600' },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, color: 'bg-orange-600' },
    { name: 'User Activity', href: '/admin/activity', icon: EyeIcon, color: 'bg-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {session.user.name} - System Overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              <Link
                href="/admin/settings"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                <CogIcon className="h-5 w-5 inline mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-sm flex items-center ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">{stat.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">User Growth</h3>
            <p className="text-3xl font-bold text-green-600">{stats.performanceMetrics.userGrowth}%</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment Rate</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.performanceMetrics.assessmentCompletion}%</p>
            <p className="text-sm text-gray-500">Completion rate</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Uptime</h3>
            <p className="text-3xl font-bold text-green-600">{stats.performanceMetrics.systemUptime}%</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Response Time</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.performanceMetrics.avgResponseTime}ms</p>
            <p className="text-sm text-gray-500">Average</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className={`${action.color} p-3 rounded-lg mb-3`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        {stats.systemAlerts.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-6">System Alerts</h3>
            <div className="space-y-4">
              {stats.systemAlerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  alert.type === 'success' ? 'bg-green-50 border-green-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className={`h-5 w-5 mt-0.5 mr-3 ${
                      alert.type === 'warning' ? 'text-yellow-400' :
                      alert.type === 'success' ? 'text-green-400' :
                      'text-blue-400'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium ${
                        alert.type === 'warning' ? 'text-yellow-800' :
                        alert.type === 'success' ? 'text-green-800' :
                        'text-blue-800'
                      }`}>
                        {alert.title}
                      </p>
                      <p className={`text-sm mt-1 ${
                        alert.type === 'warning' ? 'text-yellow-700' :
                        alert.type === 'success' ? 'text-green-700' :
                        'text-blue-700'
                      }`}>
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <Link
                href="/admin/activity"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' :
                    activity.status === 'error' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-600' :
                      activity.status === 'warning' ? 'bg-yellow-600' :
                      activity.status === 'error' ? 'bg-red-600' :
                      'bg-blue-600'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.user} • {activity.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === 'success' ? 'bg-green-100 text-green-800' :
                    activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.type.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
