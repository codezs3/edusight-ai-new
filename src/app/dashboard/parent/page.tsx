'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { toast } from 'react-hot-toast';
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout';
import AddChildModal from '@/components/dashboard/parent/AddChildModal';
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
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import StatCard from '@/components/dashboard/StatCard';
import DashboardCard from '@/components/dashboard/DashboardCard';
import CompactMetricCard from '@/components/dashboard/CompactMetricCard';
import MiniWidget from '@/components/dashboard/MiniWidget';
import ModernChart from '@/components/dashboard/ModernChart';

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddChildModal, setShowAddChildModal] = useState(false);

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session || session.user.role !== 'PARENT') {
    redirect('/dashboard');
  }

  // Fetch children data
  useEffect(() => {
    if (session?.user?.id) {
      fetchChildren();
    }
  }, [session]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parent/children');
      const data = await response.json();

      if (response.ok && data.success) {
        setChildren(data.children || []);
      } else {
        console.error('Failed to fetch children:', data);
        toast.error(data.error || 'Failed to fetch children');
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to fetch children. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChildAdded = (newChild: any) => {
    console.log('Child added to dashboard:', newChild);
    setChildren(prev => [newChild, ...prev]);
    setShowAddChildModal(false);
    toast.success('Child added successfully!');
    // Refresh the data to ensure consistency
    fetchChildren();
  };

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
      title: 'Upload Documents',
      href: '/dashboard/parent/upload',
      icon: CloudArrowUpIcon
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

  // Use real children data

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
      subtitle={`Welcome back, ${session.user.name} - Managing ${children.length} child${children.length !== 1 ? 'ren' : ''}`}
      menuItems={menuItems}
      activeItem="/dashboard/parent"
    >
      <div className="space-y-6">
        {/* Student Overview Cards */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Your Children</h3>
            <button
              onClick={() => setShowAddChildModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Child
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Children Added Yet</h4>
              <p className="text-gray-600 mb-4">Add your first child to start tracking their academic progress</p>
              <button
                onClick={() => setShowAddChildModal(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Your First Child
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {children.map((child) => (
                <DashboardCard
                  key={child.id}
                  title={child.user.name}
                  value={`Grade ${child.grade}`}
                  subtitle={child.school ? child.school.name : 'No school assigned'}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Added</span>
                      <span>{new Date(child.user.createdAt).toLocaleDateString()}</span>
                    </div>
                    {child.section && (
                      <div className="mt-1 text-xs text-gray-500">
                        Section: {child.section}
                      </div>
                    )}
                  </div>
                </DashboardCard>
              ))}
            </div>
          )}
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {quickStats.map((stat, index) => (
            <CompactMetricCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={{
                value: stat.change,
                direction: stat.changeType === 'positive' ? 'up' : 'down'
              }}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <MiniWidget
            title="Upload"
            value="New"
            icon={CloudArrowUpIcon}
            color="blue"
            subtitle="Documents"
          />
          <MiniWidget
            title="Messages"
            value="3"
            icon={ChatBubbleLeftRightIcon}
            color="green"
            subtitle="Unread"
          />
          <MiniWidget
            title="Events"
            value="5"
            icon={CalendarIcon}
            color="purple"
            subtitle="This week"
          />
          <MiniWidget
            title="Tasks"
            value="2"
            icon={CheckCircleIcon}
            color="orange"
            subtitle="Pending"
          />
          <MiniWidget
            title="Grades"
            value="A+"
            icon={TrophyIcon}
            color="yellow"
            subtitle="Latest"
          />
          <MiniWidget
            title="Profile"
            value="98%"
            icon={UserCircleIcon}
            color="indigo"
            subtitle="Complete"
          />
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

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onChildAdded={handleChildAdded}
        schoolId={(session?.user as any)?.schoolId || null}
      />
    </VerticalDashboardLayout>
  );
}