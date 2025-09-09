'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowRightIcon,
  EyeIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { getUserTypeConfig, canAccessAdminFeatures } from '@/lib/user-types';
import Link from 'next/link';

export default function SimplifiedDashboardPage() {
  const { data: session } = useSession();
  
  const userRole = session?.user?.role || '';
  const userTypeConfig = getUserTypeConfig(userRole);
  const isAdmin = canAccessAdminFeatures(userRole);

  const getQuickActions = () => {
    switch (userRole) {
      case 'PARENT':
        return [
          {
            title: 'Upload Documents',
            description: 'Upload your child\'s academic documents for analysis',
            href: '/dashboard/assessment',
            icon: CloudArrowUpIcon,
            color: 'blue'
          },
          {
            title: 'View Reports',
            description: 'Access comprehensive assessment reports',
            href: '/dashboard/analytics',
            icon: EyeIcon,
            color: 'green'
          },
          {
            title: 'Manage Children',
            description: 'Add and manage your children\'s profiles',
            href: '/dashboard/parent/children',
            icon: UserGroupIcon,
            color: 'purple'
          }
        ];
      
      case 'SCHOOL_ADMIN':
        return [
          {
            title: 'Student Management',
            description: 'Manage student records and profiles',
            href: '/dashboard/school-admin/students',
            icon: UserGroupIcon,
            color: 'blue'
          },
          {
            title: 'Assessment Analysis',
            description: 'Upload and analyze academic documents',
            href: '/dashboard/assessment',
            icon: DocumentTextIcon,
            color: 'green'
          },
          {
            title: 'School Analytics',
            description: 'View school-wide performance insights',
            href: '/dashboard/school-admin/analytics',
            icon: ChartBarIcon,
            color: 'purple'
          }
        ];
      
      case 'ADMIN':
        return [
          {
            title: 'School Management',
            description: 'Manage schools and institutions',
            href: '/dashboard/admin/schools',
            icon: UserGroupIcon,
            color: 'blue'
          },
          {
            title: 'Platform Analytics',
            description: 'View platform-wide analytics and insights',
            href: '/dashboard/analytics/advanced',
            icon: ChartBarIcon,
            color: 'green'
          },
          {
            title: 'System Settings',
            description: 'Configure system settings and preferences',
            href: '/dashboard/admin/settings',
            icon: AcademicCapIcon,
            color: 'purple'
          }
        ];
      
      case 'TEACHER':
        return [
          {
            title: 'My Students',
            description: 'Manage assigned students',
            href: '/dashboard/teacher/students',
            icon: UserGroupIcon,
            color: 'blue'
          },
          {
            title: 'Assessment Upload',
            description: 'Upload and analyze academic documents',
            href: '/dashboard/assessment',
            icon: DocumentTextIcon,
            color: 'green'
          },
          {
            title: 'Class Analytics',
            description: 'View class performance insights',
            href: '/dashboard/teacher/analytics',
            icon: ChartBarIcon,
            color: 'purple'
          }
        ];
      
      default:
        return [];
    }
  };

  const getStats = () => {
    switch (userRole) {
      case 'PARENT':
        return [
          { label: 'Children', value: '2', icon: UserGroupIcon, color: 'blue' },
          { label: 'Assessments', value: '5', icon: DocumentTextIcon, color: 'green' },
          { label: 'Reports', value: '3', icon: EyeIcon, color: 'purple' }
        ];
      
      case 'SCHOOL_ADMIN':
        return [
          { label: 'Students', value: '150', icon: UserGroupIcon, color: 'blue' },
          { label: 'Teachers', value: '25', icon: AcademicCapIcon, color: 'green' },
          { label: 'Assessments', value: '45', icon: DocumentTextIcon, color: 'purple' }
        ];
      
      case 'ADMIN':
        return [
          { label: 'Schools', value: '12', icon: UserGroupIcon, color: 'blue' },
          { label: 'Users', value: '1,250', icon: UserGroupIcon, color: 'green' },
          { label: 'Assessments', value: '2,340', icon: DocumentTextIcon, color: 'purple' }
        ];
      
      case 'TEACHER':
        return [
          { label: 'Students', value: '30', icon: UserGroupIcon, color: 'blue' },
          { label: 'Classes', value: '3', icon: AcademicCapIcon, color: 'green' },
          { label: 'Assessments', value: '12', icon: DocumentTextIcon, color: 'purple' }
        ];
      
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();
  const stats = getStats();

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name || 'User'}!
            </h1>
            <p className="text-blue-100 text-lg">
              {userTypeConfig.name} Dashboard
            </p>
            <p className="text-blue-200 mt-2">
              {isAdmin ? 'Full administrative access to all features' : 'Manage your educational assessments and insights'}
            </p>
          </div>
          <div className="hidden md:block">
            <SparklesIcon className="w-24 h-24 text-blue-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(action.color)}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{action.description}</p>
                  <div className="flex items-center mt-3 text-blue-600 group-hover:text-blue-700">
                    <span className="text-sm font-medium">Get Started</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New assessment uploaded</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Completed
            </span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Analytics report generated</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Ready
            </span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {userRole === 'PARENT' ? 'Child profile updated' : 'Student record updated'}
              </p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              Updated
            </span>
          </div>
        </div>
      </div>

      {/* User Type Specific Information */}
      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <SparklesIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {userTypeConfig.name} Features
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You have access to core assessment and analytics features. 
                  {userTypeConfig.features.paymentRequired && ' Upgrade to unlock advanced features and unlimited assessments.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
