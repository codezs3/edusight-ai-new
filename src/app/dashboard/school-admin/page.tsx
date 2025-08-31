'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  BuildingOfficeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  BellIcon,
  MegaphoneIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CogIcon,
  ArchiveBoxIcon,
  WifiIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function SchoolAdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/school-admin')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  // Sidebar Menu Items for School Admin
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/school-admin',
      icon: HomeIcon
    },
    {
      title: 'Academic Management',
      href: '/dashboard/school-admin/academic',
      icon: AcademicCapIcon,
      children: [
        { title: 'Student Information', href: '/dashboard/school-admin/students', icon: AcademicCapIcon, badge: '892' },
        { title: 'Teacher Management', href: '/dashboard/school-admin/teachers', icon: UserGroupIcon },
        { title: 'Class Management', href: '/dashboard/school-admin/classes', icon: BuildingLibraryIcon },
        { title: 'Curriculum Planning', href: '/dashboard/school-admin/curriculum', icon: BookOpenIcon },
        { title: 'Exam Management', href: '/dashboard/school-admin/exams', icon: DocumentTextIcon },
        { title: 'Academic Calendar', href: '/dashboard/school-admin/calendar', icon: CalendarIcon }
      ]
    },
    {
      title: 'Operations',
      href: '/dashboard/school-admin/operations',
      icon: CogIcon,
      children: [
        { title: 'Attendance', href: '/dashboard/school-admin/attendance', icon: CheckCircleIcon },
        { title: 'Fee Management', href: '/dashboard/school-admin/fees', icon: CurrencyDollarIcon },
        { title: 'Transport', href: '/dashboard/school-admin/transport', icon: MapPinIcon },
        { title: 'Facilities', href: '/dashboard/school-admin/facilities', icon: BuildingOfficeIcon },
        { title: 'Library', href: '/dashboard/school-admin/library', icon: BookOpenIcon },
        { title: 'Security', href: '/dashboard/school-admin/security', icon: ShieldCheckIcon }
      ]
    },
    {
      title: 'Communication',
      href: '/dashboard/school-admin/communication',
      icon: ChatBubbleLeftRightIcon,
      children: [
        { title: 'Parent Communication', href: '/dashboard/school-admin/parent-comm', icon: ChatBubbleLeftRightIcon },
        { title: 'Notice Board', href: '/dashboard/school-admin/notices', icon: MegaphoneIcon, badge: '8' },
        { title: 'Event Management', href: '/dashboard/school-admin/events', icon: CalendarIcon },
        { title: 'Newsletter', href: '/dashboard/school-admin/newsletter', icon: NewspaperIcon },
        { title: 'Alumni Network', href: '/dashboard/school-admin/alumni', icon: UsersIcon },
        { title: 'Emergency Alerts', href: '/dashboard/school-admin/emergency', icon: ExclamationTriangleIcon }
      ]
    },
    {
      title: 'Analytics & Reports',
      href: '/dashboard/school-admin/analytics',
      icon: ChartBarIcon,
      children: [
        { title: 'Performance Analytics', href: '/dashboard/school-admin/performance', icon: ChartBarIcon },
        { title: 'Enrollment Reports', href: '/dashboard/school-admin/enrollment', icon: UsersIcon },
        { title: 'Financial Reports', href: '/dashboard/school-admin/financial', icon: CurrencyDollarIcon },
        { title: 'Academic Reports', href: '/dashboard/school-admin/academic-reports', icon: TrophyIcon }
      ]
    }
  ];

  const quickStats = [
    {
      title: 'Total Students',
      value: '892',
      change: '45',
      changeType: 'positive' as const,
      icon: AcademicCapIcon,
      color: 'blue',
      description: 'Currently enrolled students'
    },
    {
      title: 'Teaching Staff',
      value: '67',
      change: '3',
      changeType: 'positive' as const,
      icon: UserGroupIcon,
      color: 'green',
      description: 'Active faculty members'
    },
    {
      title: 'Academic Performance',
      value: '91.2%',
      change: '2.3',
      changeType: 'positive' as const,
      icon: TrophyIcon,
      color: 'purple',
      description: 'Average student grade'
    },
    {
      title: 'Fee Collection',
      value: '89.5%',
      change: '5.2',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'emerald',
      description: 'Current term collection'
    }
  ];

  return (
    <VerticalDashboardLayout
      title="School Administration"
      subtitle={`Welcome back, ${session.user.name} - Educational Institution Management`}
      menuItems={menuItems}
      activeItem="/dashboard/school-admin"
    >
      <div className="space-y-6">
        {/* School Performance Metrics */}
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

        {/* School Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Performance Chart */}
          <DashboardCard title="Grade-wise Performance" value="" subtitle="">
            <ModernChart
              title="Academic Performance by Grade"
              data={[
                { label: 'Grade 1', value: 95 },
                { label: 'Grade 2', value: 92 },
                { label: 'Grade 3', value: 89 },
                { label: 'Grade 4', value: 91 },
                { label: 'Grade 5', value: 88 },
                { label: 'Grade 6', value: 93 }
              ]}
              type="bar"
              height={300}
            />
          </DashboardCard>
          
          {/* Enrollment Trends */}
          <DashboardCard title="Enrollment Trends" value="" subtitle="">
            <ModernChart
              title="Student Enrollment Over Years"
              data={[
                { label: '2019', value: 650 },
                { label: '2020', value: 720 },
                { label: '2021', value: 780 },
                { label: '2022', value: 845 },
                { label: '2023', value: 892 },
                { label: '2024', value: 950 }
              ]}
              type="line"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Department Performance and Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Performance */}
          <div className="lg:col-span-2">
            <DashboardCard title="Department Performance Overview" value="" subtitle="">
              <ModernChart
                title="Subject-wise Performance"
                data={[
                  { label: 'Mathematics', value: 94 },
                  { label: 'Science', value: 91 },
                  { label: 'English', value: 89 },
                  { label: 'Social Studies', value: 87 },
                  { label: 'Arts', value: 93 },
                  { label: 'Physical Education', value: 96 }
                ]}
                type="bar"
                height={300}
              />
            </DashboardCard>
          </div>

          {/* Attendance Overview */}
          <DashboardCard title="Attendance Overview" value="" subtitle="">
            <ModernChart
              title="Monthly Attendance Rate"
              data={[
                { label: 'Students', value: 94 },
                { label: 'Teachers', value: 97 },
                { label: 'Staff', value: 92 }
              ]}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* School Activities and Important Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent School Activities */}
          <DashboardCard title="Recent School Activities" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AcademicCapIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New student admission</p>
                  <p className="text-xs text-gray-500">5 new students enrolled in Grade 8</p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrophyIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Academic achievement</p>
                  <p className="text-xs text-gray-500">Grade 10 students won science fair</p>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Parent-teacher meeting</p>
                  <p className="text-xs text-gray-500">Scheduled for this weekend</p>
                  <span className="text-xs text-gray-400">2 days ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Facility maintenance</p>
                  <p className="text-xs text-gray-500">Library renovation completed</p>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Important Notifications */}
          <DashboardCard title="Important Notifications" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Fee payment reminder</p>
                  <p className="text-xs text-gray-500">Term fee due date approaching</p>
                  <span className="text-xs text-red-400">Urgent</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Upcoming exam schedule</p>
                  <p className="text-xs text-gray-500">Mid-term exams start next week</p>
                  <span className="text-xs text-yellow-400">Important</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BellIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System maintenance</p>
                  <p className="text-xs text-gray-500">Server maintenance scheduled for weekend</p>
                  <span className="text-xs text-blue-400">Notice</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <InformationCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New policy update</p>
                  <p className="text-xs text-gray-500">Updated attendance policy effective immediately</p>
                  <span className="text-xs text-green-400">Update</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard title="Quick Actions" value="" subtitle="" className="h-fit">
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Add Student</p>
                  <p className="text-xs text-blue-600">New enrollment</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <UserGroupIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Manage Teachers</p>
                  <p className="text-xs text-green-600">Faculty administration</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Generate Report</p>
                  <p className="text-xs text-purple-600">Academic reports</p>
                </div>
              </button>
            </div>
          </DashboardCard>

          {/* School Performance Insights */}
          <DashboardCard title="Performance Insights" value="" subtitle="" className="lg:col-span-2 p-0">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Academic Excellence</h3>
                  <p className="text-sm text-slate-600">91.2% average student performance across all grades</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Growth Trend</h3>
                  <p className="text-sm text-slate-600">6.5% increase in student enrollment this year</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Parent Satisfaction</h3>
                  <p className="text-sm text-slate-600">4.7/5 rating from parent feedback surveys</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Call to Action Panel */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Excellence in Education Management</h3>
              <p className="text-purple-100">Streamline school operations and enhance educational outcomes with comprehensive management tools</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-sm">
                Add Student
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors font-medium text-sm border border-purple-400">
                Generate Report
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium text-sm border border-blue-400">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}