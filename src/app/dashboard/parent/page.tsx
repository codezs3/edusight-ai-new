'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  ChartBarIcon,
  DocumentTextIcon,
  TrophyIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  CalendarIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CloudArrowUpIcon,
  UserCircleIcon,
  BookOpenIcon,
  MapPinIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
  ArchiveBoxIcon,
  DevicePhoneMobileIcon,
  ShareIcon,
  HomeIcon,
  FolderIcon,
  CogIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import ModernChart from '@/components/dashboard/ModernChart';

export default function ParentDashboard() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session || session.user.role !== 'PARENT') {
    redirect('/dashboard');
  }

  // Sidebar Menu Items for Parent
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/parent',
      icon: HomeIcon
    },
    {
      title: 'My Children',
      href: '/dashboard/parent/children',
      icon: UserCircleIcon,
      children: [
        { title: 'Profile Management', href: '/dashboard/parent/profile', icon: UserCircleIcon },
        { title: 'Academic Progress', href: '/dashboard/parent/academic', icon: AcademicCapIcon },
        { title: 'Health & Wellness', href: '/dashboard/parent/health', icon: HeartIcon },
        { title: 'Psychological Insights', href: '/dashboard/parent/psychology', icon: LightBulbIcon },
        { title: 'Career Guidance', href: '/dashboard/parent/career', icon: MapPinIcon }
      ]
    },
    {
      title: 'Assessments',
      href: '/dashboard/parent/assessments',
      icon: DocumentTextIcon,
      children: [
        { title: 'Upload Data', href: '/dashboard/parent/upload', icon: CloudArrowUpIcon, badge: 'Quick' },
        { title: 'Schedule Tests', href: '/dashboard/parent/schedule', icon: CalendarIcon },
        { title: 'View Reports', href: '/dashboard/parent/reports', icon: ChartBarIcon },
        { title: 'Download PDFs', href: '/dashboard/parent/downloads', icon: DocumentTextIcon }
      ]
    },
    {
      title: 'Communication',
      href: '/dashboard/parent/communication',
      icon: ChatBubbleLeftRightIcon,
      children: [
        { title: 'Messages', href: '/dashboard/parent/messages', icon: EnvelopeIcon, badge: '3' },
        { title: 'Parent-Teacher Meetings', href: '/dashboard/parent/meetings', icon: VideoCameraIcon },
        { title: 'School Notifications', href: '/dashboard/parent/notifications', icon: BellIcon },
        { title: 'Events & News', href: '/dashboard/parent/events', icon: MegaphoneIcon }
      ]
    },
    {
      title: 'Resources',
      href: '/dashboard/parent/resources',
      icon: BookOpenIcon,
      children: [
        { title: 'Learning Materials', href: '/dashboard/parent/learning', icon: FolderIcon },
        { title: 'Parent Guides', href: '/dashboard/parent/guides', icon: BookOpenIcon },
        { title: 'Support Center', href: '/dashboard/parent/support', icon: QuestionMarkCircleIcon },
        { title: 'Mobile App', href: '/dashboard/parent/mobile', icon: DevicePhoneMobileIcon }
      ]
    },
    {
      title: 'Billing',
      href: '/dashboard/parent/billing',
      icon: CurrencyDollarIcon,
      children: [
        { title: 'Payment History', href: '/dashboard/parent/payments', icon: CurrencyDollarIcon },
        { title: 'Invoices', href: '/dashboard/parent/invoices', icon: DocumentTextIcon },
        { title: 'Subscription', href: '/dashboard/parent/subscription', icon: CheckCircleIcon }
      ]
    }
  ];

  // Mock student data
  const students = [
    {
      id: 1,
      name: 'Alex Thompson',
      grade: 'Grade 8',
      section: 'A',
      overallScore: 87,
      lastAssessment: '2024-01-15',
      profileImage: null
    }
  ];

  const quickStats = [
    {
      title: 'Overall E360 Score',
      value: '87/100',
      change: '5',
      changeType: 'positive' as const,
      icon: TrophyIcon,
      color: 'purple',
      description: 'Combined assessment score'
    },
    {
      title: 'Academic Performance',
      value: '91%',
      change: '3',
      changeType: 'positive' as const,
      icon: AcademicCapIcon,
      color: 'blue',
      description: 'Current academic average'
    },
    {
      title: 'Health Status',
      value: 'Excellent',
      change: '0',
      changeType: 'neutral' as const,
      icon: HeartIcon,
      color: 'green',
      description: 'Physical wellness rating'
    },
    {
      title: 'Next Assessment',
      value: '5 days',
      change: '0',
      changeType: 'neutral' as const,
      icon: CalendarIcon,
      color: 'orange',
      description: 'Upcoming evaluation'
    }
  ];

  return (
    <VerticalDashboardLayout
      title="Parent Dashboard"
      subtitle={`Welcome back, ${session.user.name} - Managing ${students.length} student${students.length > 1 ? 's' : ''}`}
      menuItems={menuItems}
      activeItem="/dashboard/parent"
    >
      <div className="space-y-6">
        {/* Student Overview Cards */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Children</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <DashboardCard
                key={student.id}
                title={student.name}
                value={`E360: ${student.overallScore}/100`}
                subtitle={`${student.grade} - Section ${student.section}`}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last Assessment</span>
                    <span>{new Date(student.lastAssessment).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all" 
                      style={{ width: `${student.overallScore}%` }}
                    ></div>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Progress Chart */}
          <DashboardCard title="Academic Progress Trend" value="" subtitle="">
            <ModernChart
              title="Subject Performance"
              data={[
                { label: 'Math', value: 92 },
                { label: 'Science', value: 89 },
                { label: 'English', value: 94 },
                { label: 'History', value: 87 },
                { label: 'Art', value: 91 }
              ]}
              type="bar"
              height={250}
            />
          </DashboardCard>

          {/* E360 Score Breakdown */}
          <DashboardCard title="E360 Score Breakdown" value="" subtitle="">
            <ModernChart
              title="Assessment Categories"
              data={[
                { label: 'Academic', value: 91 },
                { label: 'Physical', value: 85 },
                { label: 'Psychological', value: 89 }
              ]}
              type="donut"
              height={250}
            />
          </DashboardCard>
        </div>

        {/* Progress Timeline and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Progress */}
          <div className="lg:col-span-2">
            <DashboardCard title="6-Month Progress Timeline" value="" subtitle="">
              <ModernChart
                title="E360 Score Trend"
                data={[
                  { label: 'Aug', value: 78 },
                  { label: 'Sep', value: 81 },
                  { label: 'Oct', value: 79 },
                  { label: 'Nov', value: 84 },
                  { label: 'Dec', value: 86 },
                  { label: 'Jan', value: 87 }
                ]}
                type="line"
                height={300}
              />
            </DashboardCard>
          </div>

          {/* Quick Actions */}
          <DashboardCard title="Quick Actions" value="" subtitle="" className="h-fit">
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <CloudArrowUpIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Upload Assessment Data</p>
                  <p className="text-xs text-blue-600">Add new academic records</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <CalendarIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Schedule Assessment</p>
                  <p className="text-xs text-green-600">Book evaluation appointment</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Download Report</p>
                  <p className="text-xs text-purple-600">Get detailed PDF report</p>
                </div>
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* Recent Activities and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <DashboardCard title="Recent Activities" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AcademicCapIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Math assessment completed</p>
                  <p className="text-xs text-gray-500">Score: 92/100 - Excellent performance</p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Physical health checkup</p>
                  <p className="text-xs text-gray-500">All metrics within healthy range</p>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <LightBulbIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Psychological evaluation</p>
                  <p className="text-xs text-gray-500">Positive development noted</p>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Notifications */}
          <DashboardCard title="Important Notifications" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Upcoming Assessment</p>
                  <p className="text-xs text-gray-500">Science assessment scheduled for January 25th</p>
                  <span className="text-xs text-gray-400">Reminder</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Teacher Message</p>
                  <p className="text-xs text-gray-500">Ms. Johnson shared feedback on recent project</p>
                  <span className="text-xs text-gray-400">New</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrophyIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Achievement Unlocked</p>
                  <p className="text-xs text-gray-500">Consistent academic improvement milestone</p>
                  <span className="text-xs text-gray-400">Achievement</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Call to Action Panel */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Track Your Child's Progress</h3>
              <p className="text-purple-100">Monitor academic, physical, and psychological development with EduSight's comprehensive assessment system</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-sm">
                Upload New Data
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors font-medium text-sm border border-purple-400">
                Schedule Assessment
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium text-sm border border-indigo-400">
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  );
}