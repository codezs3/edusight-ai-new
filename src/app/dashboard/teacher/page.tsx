'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  AcademicCapIcon,
  HeartIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlayIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  ClockIcon,
  PresentationChartLineIcon,
  StarIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function TeacherDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/teacher')
      return
    }

    if (session?.user?.role !== 'TEACHER') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'TEACHER') {
    return null
  }

  // Sidebar Menu Items for Physical Education Teacher
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/teacher',
      icon: HomeIcon
    },
    {
      title: 'Students',
      href: '/dashboard/teacher/students',
      icon: AcademicCapIcon,
      children: [
        { title: 'My Classes', href: '/dashboard/teacher/classes', icon: UserGroupIcon, badge: '156' },
        { title: 'Student Profiles', href: '/dashboard/teacher/profiles', icon: AcademicCapIcon },
        { title: 'Fitness Assessments', href: '/dashboard/teacher/assessments', icon: HeartIcon },
        { title: 'Performance Tracking', href: '/dashboard/teacher/performance', icon: ChartBarIcon }
      ]
    },
    {
      title: 'Upload Documents',
      href: '/dashboard/teacher/upload',
      icon: CloudArrowUpIcon
    },
    {
      title: 'Physical Education',
      href: '/dashboard/teacher/physical-ed',
      icon: HeartIcon,
      children: [
        { title: 'Fitness Programs', href: '/dashboard/teacher/programs', icon: PlayIcon },
        { title: 'Health Monitoring', href: '/dashboard/teacher/health', icon: HeartIcon },
        { title: 'Sports Activities', href: '/dashboard/teacher/sports', icon: TrophyIcon },
        { title: 'Equipment Management', href: '/dashboard/teacher/equipment', icon: ClipboardDocumentCheckIcon }
      ]
    },
    {
      title: 'Assessments',
      href: '/dashboard/teacher/assessments',
      icon: DocumentTextIcon,
      children: [
        { title: 'Create Assessment', href: '/dashboard/teacher/create', icon: DocumentTextIcon },
        { title: 'Grade Book', href: '/dashboard/teacher/grades', icon: BookOpenIcon },
        { title: 'Progress Reports', href: '/dashboard/teacher/reports', icon: ChartBarIcon },
        { title: 'Parent Communication', href: '/dashboard/teacher/communication', icon: BellIcon }
      ]
    },
    {
      title: 'Schedule',
      href: '/dashboard/teacher/schedule',
      icon: CalendarIcon,
      children: [
        { title: 'Class Schedule', href: '/dashboard/teacher/timetable', icon: CalendarIcon },
        { title: 'Activities Calendar', href: '/dashboard/teacher/activities', icon: CalendarIcon },
        { title: 'Meeting Schedule', href: '/dashboard/teacher/meetings', icon: UsersIcon }
      ]
    }
  ];

  const quickStats = [
    {
      title: 'Total Students',
      value: '156',
      change: '8',
      changeType: 'positive' as const,
      icon: AcademicCapIcon,
      color: 'blue',
      description: 'Students under supervision'
    },
    {
      title: 'Fitness Programs',
      value: '12',
      change: '2',
      changeType: 'positive' as const,
      icon: PlayIcon,
      color: 'green',
      description: 'Active fitness programs'
    },
    {
      title: 'Avg. Fitness Score',
      value: '87.5',
      change: '3.2',
      changeType: 'positive' as const,
      icon: HeartIcon,
      color: 'red',
      description: 'Overall student fitness'
    },
    {
      title: 'Assessments This Week',
      value: '24',
      change: '4',
      changeType: 'positive' as const,
      icon: ClipboardDocumentCheckIcon,
      color: 'purple',
      description: 'Completed assessments'
    }
  ];

  return (
    <VerticalDashboardLayout
      title="Physical Education Dashboard"
      subtitle={`Welcome back, ${session.user.name} - Physical Education Expert`}
      menuItems={menuItems}
      activeItem="/dashboard/teacher"
    >
      <div className="space-y-6">
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

        {/* Physical Education Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Fitness Progress */}
          <DashboardCard title="Student Fitness Progress" value="" subtitle="">
            <ModernChart
              title="Monthly Fitness Improvement"
              data={[
                { label: 'Aug', value: 78 },
                { label: 'Sep', value: 82 },
                { label: 'Oct', value: 79 },
                { label: 'Nov', value: 85 },
                { label: 'Dec', value: 87 },
                { label: 'Jan', value: 88 }
              ]}
              type="line"
              height={250}
            />
          </DashboardCard>

          {/* Activity Distribution */}
          <DashboardCard title="Activity Participation" value="" subtitle="">
            <ModernChart
              title="Sports Activities"
              data={[
                { label: 'Running', value: 35 },
                { label: 'Swimming', value: 25 },
                { label: 'Basketball', value: 20 },
                { label: 'Football', value: 15 },
                { label: 'Gymnastics', value: 5 }
              ]}
              type="donut"
              height={250}
            />
          </DashboardCard>
        </div>

        {/* Class Performance and Fitness Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Performance */}
          <div className="lg:col-span-2">
            <DashboardCard title="Class Performance Overview" value="" subtitle="">
              <ModernChart
                title="Grade-wise Fitness Scores"
                data={[
                  { label: 'Grade 6', value: 85 },
                  { label: 'Grade 7', value: 88 },
                  { label: 'Grade 8', value: 82 },
                  { label: 'Grade 9', value: 89 },
                  { label: 'Grade 10', value: 87 },
                  { label: 'Grade 11', value: 91 },
                  { label: 'Grade 12', value: 94 }
                ]}
                type="bar"
                height={300}
              />
            </DashboardCard>
          </div>

          {/* Fitness Distribution */}
          <DashboardCard title="Fitness Categories" value="" subtitle="">
            <ModernChart
              title="Student Fitness Levels"
              data={[
                { label: 'Excellent', value: 45 },
                { label: 'Good', value: 35 },
                { label: 'Average', value: 15 },
                { label: 'Needs Improvement', value: 5 }
              ]}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Recent Activities and Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <DashboardCard title="Recent Activities" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrophyIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Swimming championship</p>
                  <p className="text-xs text-gray-500">Grade 9 students won inter-school competition</p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HeartIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Fitness assessment completed</p>
                  <p className="text-xs text-gray-500">Grade 8 fitness evaluation finished</p>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <PlayIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New fitness program launched</p>
                  <p className="text-xs text-gray-500">Advanced strength training for Grade 11-12</p>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Upcoming Events */}
          <DashboardCard title="Upcoming Events" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Annual Sports Day</p>
                  <p className="text-xs text-gray-500">School-wide athletic competition</p>
                  <span className="text-xs text-yellow-600">Next Friday</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Parent-Teacher Meeting</p>
                  <p className="text-xs text-gray-500">Discuss student fitness progress</p>
                  <span className="text-xs text-blue-600">Next Monday</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HeartIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Health & Wellness Workshop</p>
                  <p className="text-xs text-gray-500">Nutrition and fitness education</p>
                  <span className="text-xs text-green-600">Next Wednesday</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Call to Action Panel */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Promote Physical Wellness</h3>
              <p className="text-green-100">Help students achieve their fitness goals with comprehensive physical education programs and assessments</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm">
                Create Assessment
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium text-sm border border-green-400">
                View Progress
              </button>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors font-medium text-sm border border-teal-400">
                Plan Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}