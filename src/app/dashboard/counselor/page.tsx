'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  HeartIcon,
  LightBulbIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BellIcon,
  BookOpenIcon,
  StarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function CounselorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/counselor')
      return
    }

    if (session?.user?.role !== 'COUNSELOR') {
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

  if (!session || session.user.role !== 'COUNSELOR') {
    return null
  }

  // Sidebar Menu Items for Psychologist/Counselor
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/counselor',
      icon: HomeIcon
    },
    {
      title: 'Students',
      href: '/dashboard/counselor/students',
      icon: AcademicCapIcon,
      children: [
        { title: 'My Caseload', href: '/dashboard/counselor/caseload', icon: UserGroupIcon, badge: '48' },
        { title: 'Student Profiles', href: '/dashboard/counselor/profiles', icon: AcademicCapIcon },
        { title: 'Assessment History', href: '/dashboard/counselor/assessments', icon: DocumentTextIcon },
        { title: 'Progress Tracking', href: '/dashboard/counselor/progress', icon: ChartBarIcon }
      ]
    },
    {
      title: 'Psychological Assessment',
      href: '/dashboard/counselor/assessment',
      icon: LightBulbIcon,
      children: [
        { title: 'Mental Health Screening', href: '/dashboard/counselor/screening', icon: HeartIcon },
        { title: 'Behavioral Analysis', href: '/dashboard/counselor/behavior', icon: LightBulbIcon },
        { title: 'Cognitive Assessment', href: '/dashboard/counselor/cognitive', icon: StarIcon },
        { title: 'Risk Assessment', href: '/dashboard/counselor/risk', icon: ExclamationTriangleIcon, badge: '3' }
      ]
    },
    {
      title: 'Counseling Sessions',
      href: '/dashboard/counselor/sessions',
      icon: ChatBubbleLeftRightIcon,
      children: [
        { title: 'Schedule Sessions', href: '/dashboard/counselor/schedule', icon: CalendarIcon },
        { title: 'Session Notes', href: '/dashboard/counselor/notes', icon: DocumentTextIcon },
        { title: 'Group Therapy', href: '/dashboard/counselor/group', icon: UsersIcon },
        { title: 'Crisis Intervention', href: '/dashboard/counselor/crisis', icon: ExclamationTriangleIcon }
      ]
    },
    {
      title: 'Reports & Analytics',
      href: '/dashboard/counselor/reports',
      icon: ChartBarIcon,
      children: [
        { title: 'Psychological Reports', href: '/dashboard/counselor/psych-reports', icon: DocumentTextIcon },
        { title: 'Wellness Trends', href: '/dashboard/counselor/trends', icon: ArrowTrendingUpIcon },
        { title: 'Intervention Outcomes', href: '/dashboard/counselor/outcomes', icon: TrophyIcon },
        { title: 'Parent Communication', href: '/dashboard/counselor/communication', icon: BellIcon }
      ]
    },
    {
      title: 'Resources',
      href: '/dashboard/counselor/resources',
      icon: BookOpenIcon,
      children: [
        { title: 'Assessment Tools', href: '/dashboard/counselor/tools', icon: LightBulbIcon },
        { title: 'Intervention Strategies', href: '/dashboard/counselor/strategies', icon: BookOpenIcon },
        { title: 'Research Library', href: '/dashboard/counselor/library', icon: AcademicCapIcon }
      ]
    }
  ];

  const quickStats = [
    {
      title: 'Active Cases',
      value: '48',
      change: '3',
      changeType: 'positive' as const,
      icon: UserGroupIcon,
      color: 'blue',
      description: 'Students under care'
    },
    {
      title: 'Wellness Score',
      value: '87.2',
      change: '4.1',
      changeType: 'positive' as const,
      icon: HeartIcon,
      color: 'green',
      description: 'Average psychological wellbeing'
    },
    {
      title: 'Risk Cases',
      value: '3',
      change: '1',
      changeType: 'negative' as const,
      icon: ExclamationTriangleIcon,
      color: 'red',
      description: 'High-priority interventions'
    },
    {
      title: 'Sessions This Week',
      value: '24',
      change: '2',
      changeType: 'positive' as const,
      icon: ChatBubbleLeftRightIcon,
      color: 'purple',
      description: 'Counseling sessions completed'
    }
  ];

  return (
    <VerticalDashboardLayout
      title="Psychological Counseling"
      subtitle={`Welcome back, ${session.user.name} - Psychologist & Counselor`}
      menuItems={menuItems}
      activeItem="/dashboard/counselor"
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

        {/* Psychological Wellness Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mental Wellness Trends */}
          <DashboardCard title="Mental Wellness Trends" value="" subtitle="">
            <ModernChart
              title="Monthly Wellness Scores"
              data={[
                { label: 'Aug', value: 78 },
                { label: 'Sep', value: 81 },
                { label: 'Oct', value: 79 },
                { label: 'Nov', value: 84 },
                { label: 'Dec', value: 86 },
                { label: 'Jan', value: 87 }
              ]}
              type="line"
              height={250}
            />
          </DashboardCard>

          {/* Risk Categories */}
          <DashboardCard title="Risk Category Distribution" value="" subtitle="">
            <ModernChart
              title="Student Risk Levels"
              data={[
                { label: 'Low Risk', value: 78 },
                { label: 'Medium Risk', value: 15 },
                { label: 'High Risk', value: 5 },
                { label: 'Crisis', value: 2 }
              ]}
              type="donut"
              height={250}
            />
          </DashboardCard>
        </div>

        {/* Intervention Success and Counseling Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Intervention Success Rates */}
          <div className="lg:col-span-2">
            <DashboardCard title="Intervention Success Rates" value="" subtitle="">
              <ModernChart
                title="Treatment Outcomes by Category"
                data={[
                  { label: 'Anxiety', value: 89 },
                  { label: 'Depression', value: 82 },
                  { label: 'Behavioral Issues', value: 76 },
                  { label: 'Academic Stress', value: 91 },
                  { label: 'Social Skills', value: 85 },
                  { label: 'Family Issues', value: 78 }
                ]}
                type="bar"
                height={300}
              />
            </DashboardCard>
          </div>

          {/* Session Types */}
          <DashboardCard title="Session Distribution" value="" subtitle="">
            <ModernChart
              title="Counseling Types"
              data={[
                { label: 'Individual', value: 60 },
                { label: 'Group', value: 25 },
                { label: 'Family', value: 10 },
                { label: 'Crisis', value: 5 }
              ]}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Recent Activities and Priority Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Counseling Activities */}
          <DashboardCard title="Recent Activities" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Successful intervention</p>
                  <p className="text-xs text-gray-500">Student anxiety levels significantly reduced</p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Group therapy session</p>
                  <p className="text-xs text-gray-500">Social skills development for Grade 8 students</p>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Assessment completed</p>
                  <p className="text-xs text-gray-500">Psychological evaluation for new student</p>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Priority Cases */}
          <DashboardCard title="Priority Cases" value="" subtitle="">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Crisis intervention needed</p>
                  <p className="text-xs text-gray-500">Student showing signs of severe anxiety</p>
                  <span className="text-xs text-red-600">High Priority</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Follow-up required</p>
                  <p className="text-xs text-gray-500">Progress check for depression intervention</p>
                  <span className="text-xs text-yellow-600">Medium Priority</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Scheduled assessment</p>
                  <p className="text-xs text-gray-500">Behavioral evaluation next week</p>
                  <span className="text-xs text-blue-600">Scheduled</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Actions Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardCard title="Quick Actions" value="" subtitle="" className="h-fit">
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <LightBulbIcon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">New Assessment</p>
                  <p className="text-xs text-purple-600">Psychological evaluation</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Schedule Session</p>
                  <p className="text-xs text-blue-600">Counseling appointment</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Generate Report</p>
                  <p className="text-xs text-green-600">Progress summary</p>
                </div>
              </button>
            </div>
          </DashboardCard>

          {/* Wellness Insights */}
          <DashboardCard title="Wellness Insights" value="" subtitle="" className="lg:col-span-2 p-0">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HeartIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Improved Wellbeing</h3>
                  <p className="text-sm text-slate-600">87% of students show positive mental health progress</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrophyIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Success Rate</h3>
                  <p className="text-sm text-slate-600">89% intervention success rate this semester</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LightBulbIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Early Detection</h3>
                  <p className="text-sm text-slate-600">95% of issues identified in early stages</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Call to Action Panel */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Supporting Student Mental Health</h3>
              <p className="text-purple-100">Provide comprehensive psychological support and interventions to help students achieve optimal mental wellness</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-sm">
                New Assessment
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors font-medium text-sm border border-purple-400">
                Schedule Session
              </button>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors font-medium text-sm border border-pink-400">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}