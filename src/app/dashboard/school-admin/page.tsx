'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  PlusIcon,
  CogIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import MiniChart from '@/components/charts/MiniChart';
import CompactMetricCard from '@/components/dashboard/CompactMetricCard';
import MiniWidget from '@/components/dashboard/MiniWidget';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  activeUsers: number;
  recentUploads: number;
  pendingApprovals: number;
}

interface School {
  id: string;
  name: string;
  type: string;
  board: string;
  city: string;
  state: string;
  subscriptionType: string;
  maxStudents: number;
  maxTeachers: number;
}

interface RecentActivity {
  id: string;
  type: 'user_created' | 'document_uploaded' | 'assessment_completed';
  description: string;
  user: string;
  timestamp: string;
}

export default function SchoolAdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    activeUsers: 0,
    recentUploads: 0,
    pendingApprovals: 0
  });
  const [school, setSchool] = useState<School | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users statistics
      const usersResponse = await fetch('/api/school-admin/users?limit=1');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.success) {
          const { stats: userStats } = usersData.data;
          setStats(prev => ({
            ...prev,
            totalStudents: userStats.roles?.STUDENT || 0,
            totalTeachers: userStats.roles?.TEACHER || 0,
            totalParents: userStats.roles?.PARENT || 0,
            activeUsers: userStats.active || 0
          }));
        }
      }

      // For now, we'll set mock data for other stats
      // In a real implementation, you'd fetch these from appropriate APIs
      setStats(prev => ({
        ...prev,
        recentUploads: 12,
        pendingApprovals: 3
      }));

      // Mock school data - in real implementation, fetch from user's school
      setSchool({
        id: 'school-1',
        name: 'Modern Public School',
        type: 'Private',
        board: 'CBSE',
        city: 'Mumbai',
        state: 'Maharashtra',
        subscriptionType: 'Premium',
        maxStudents: 500,
        maxTeachers: 50
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'user_created',
          description: 'New parent John Doe registered',
          user: 'John Doe',
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          type: 'document_uploaded',
          description: 'Report card uploaded for Student A',
          user: 'Parent A',
          timestamp: '4 hours ago'
        },
        {
          id: '3',
          type: 'assessment_completed',
          description: 'Math assessment completed by Class 10A',
          user: 'Teacher B',
          timestamp: '1 day ago'
        }
      ]);

    } catch (error) {
      toast.error('Error fetching dashboard data');
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <UsersIcon className="w-4 h-4 text-green-600" />;
      case 'document_uploaded':
        return <DocumentIcon className="w-4 h-4 text-blue-600" />;
      case 'assessment_completed':
        return <AcademicCapIcon className="w-4 h-4 text-purple-600" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {session?.user?.name || 'School Admin'}
          </p>
          {school && (
            <p className="text-sm text-gray-500">
              {school.name} • {school.city}, {school.state}
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/school-admin/users/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add User</span>
          </Link>
          <Link
            href="/dashboard/school-admin/settings"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
          >
            <CogIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* School Info Card */}
      {school && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BuildingOfficeIcon className="w-12 h-12" />
              <div>
                <h2 className="text-xl font-bold">{school.name}</h2>
                <p className="opacity-90">{school.type} School • {school.board} Board</p>
                <p className="opacity-75">{school.city}, {school.state}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {school.subscriptionType} Plan
              </div>
              <p className="text-sm opacity-75 mt-2">
                Capacity: {stats.totalStudents}/{school.maxStudents} Students
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <CompactMetricCard
          title="Students"
          value={stats.totalStudents.toString()}
          icon={AcademicCapIcon}
          color="blue"
          trend={{
            value: "8.5%",
            direction: "up"
          }}
        />

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
              <p className="text-sm text-green-600">Fully staffed</p>
            </div>
            <div className="w-16 h-12">
              <MiniChart
                type="line"
                data={{
                  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
                  datasets: [{
                    data: [38, 40, 41, 42, 42, stats.totalTeachers],
                    tension: 0.4
                  }]
                }}
                color="#10B981"
                height={48}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Parents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalParents}</p>
              <p className="text-sm text-purple-600">Active engagement</p>
            </div>
            <div className="w-16 h-12">
              <MiniChart
                type="doughnut"
                data={{
                  labels: ['Engaged', 'Moderate', 'Low'],
                  datasets: [{
                    data: [Math.floor(stats.totalParents * 0.7), Math.floor(stats.totalParents * 0.2), Math.floor(stats.totalParents * 0.1)]
                  }]
                }}
                color="#8B5CF6"
                height={48}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performance</p>
              <p className="text-2xl font-bold text-gray-900">87.3%</p>
              <p className="text-sm text-orange-600">Above target</p>
            </div>
            <div className="w-16 h-12">
              <MiniChart
                type="line"
                data={{
                  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
                  datasets: [{
                    data: [82.1, 83.5, 84.8, 85.9, 86.7, 87.3],
                    tension: 0.4
                  }]
                }}
                color="#F59E0B"
                height={48}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Link */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">School Analytics Dashboard</h3>
            <p className="text-green-100 mb-4">
              Comprehensive insights into student performance, attendance trends, and academic progress
            </p>
            <Link
              href="/dashboard/school-admin/analytics"
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors inline-flex items-center space-x-2"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>View Detailed Analytics</span>
            </Link>
          </div>
          <div className="w-32 h-20 opacity-80">
            <MiniChart
              type="bar"
              data={{
                labels: ['Math', 'Eng', 'Sci', 'Soc', 'CS'],
                datasets: [{
                  data: [87, 82, 89, 79, 91],
                  backgroundColor: ['#ffffff60', '#ffffff80', '#ffffff60', '#ffffff40', '#ffffffa0']
                }]
              }}
              height={80}
              showTooltip={false}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/school-admin/users" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">Add, edit, and manage school users</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/school-admin/reports" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View Reports</h3>
              <p className="text-sm text-gray-600">Academic and performance reports</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/school-admin/uploads" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DocumentIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Document Uploads</h3>
              <p className="text-sm text-gray-600">Manage document uploads and reviews</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity and Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/dashboard/school-admin/activity"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Recent Uploads</span>
                <span className="text-sm font-medium text-gray-900">{stats.recentUploads}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Approvals</span>
                <span className="text-sm font-medium text-orange-600">{stats.pendingApprovals}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active This Week</span>
                <span className="text-sm font-medium text-green-600">{Math.floor(stats.activeUsers * 0.7)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capacity Utilization</span>
                <span className="text-sm font-medium text-blue-600">
                  {school ? Math.round((stats.totalStudents / school.maxStudents) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CalendarIcon className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Upcoming Tasks
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Review 3 pending document uploads</li>
                <li>Monthly progress reports due in 5 days</li>
                <li>Parent-teacher meeting scheduled for next week</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}