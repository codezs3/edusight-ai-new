'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  AcademicCapIcon,
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  BookOpenIcon,
  ServerIcon,
  ShieldCheckIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  PresentationChartLineIcon,
  EnvelopeIcon,
  PhoneIcon,
  CircleStackIcon,
  CloudIcon,
  LockClosedIcon,
  EyeIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  BugAntIcon,
  LifebuoyIcon,
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  NewspaperIcon,
  CalendarIcon,
  FolderIcon,
  ArchiveBoxIcon,
  KeyIcon,
  FingerPrintIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartPieIcon,
  TrophyIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  HomeIcon,
  BeakerIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin')
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  // Sidebar Menu Items
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: HomeIcon
    },
    {
      title: 'System Management',
      href: '/dashboard/admin/system',
      icon: ServerIcon,
      children: [
        { title: 'System Health', href: '/dashboard/admin/system-health', icon: ServerIcon, badge: 'Live' },
        { title: 'Security Center', href: '/dashboard/admin/security', icon: ShieldCheckIcon, badge: 'Secure' },
        { title: 'Database', href: '/dashboard/admin/database', icon: CircleStackIcon },
        { title: 'API Management', href: '/dashboard/admin/api', icon: GlobeAltIcon },
        { title: 'User Sessions', href: '/dashboard/admin/sessions', icon: EyeIcon },
        { title: 'Error Logs', href: '/dashboard/admin/logs', icon: BugAntIcon, badge: '3' }
      ]
    },
    {
      title: 'Academic Management',
      href: '/dashboard/admin/academic',
      icon: AcademicCapIcon,
      children: [
        { title: 'Assessment Systems', href: '/dashboard/admin/assessments', icon: ClipboardDocumentListIcon, badge: 'Enhanced' },
        { title: 'Curriculum Mapper', href: '/dashboard/admin/curriculum-mapper', icon: BookOpenIcon, badge: 'New' },
        { title: 'Curriculum Frameworks', href: '/dashboard/admin/assessments/frameworks', icon: BookOpenIcon },
        { title: 'Subject Management', href: '/dashboard/admin/subjects', icon: BeakerIcon },
        { title: 'Skills Management', href: '/dashboard/admin/skills', icon: BeakerIcon, badge: 'New' },
        { title: 'Grade Books', href: '/dashboard/admin/gradebooks', icon: DocumentChartBarIcon },
        { title: 'Academic Calendar', href: '/dashboard/admin/calendar', icon: CalendarDaysIcon },
        { title: 'Examinations', href: '/dashboard/admin/exams', icon: PencilSquareIcon },
        { title: 'Progress Reports', href: '/dashboard/admin/progress', icon: TrophyIcon },
        { title: 'Academic Templates', href: '/dashboard/admin/templates', icon: FolderIcon, badge: 'Enhanced' }
      ]
    },
    {
      title: 'Institution',
      href: '/dashboard/admin/institution',
      icon: BuildingOfficeIcon,
      children: [
        { title: 'School Management', href: '/dashboard/admin/school', icon: BuildingOfficeIcon },
        { title: 'User Management', href: '/dashboard/admin/users', icon: UsersIcon },
        { title: 'Financial', href: '/dashboard/admin/finance', icon: CurrencyDollarIcon },
        { title: 'Communications', href: '/dashboard/admin/communications', icon: MegaphoneIcon },
        { title: 'Content Management', href: '/dashboard/admin/content', icon: FolderIcon }
      ]
    },
    {
      title: 'Analytics',
      href: '/dashboard/admin/analytics',
      icon: ChartBarIcon,
      children: [
        { title: 'Performance', href: '/dashboard/admin/performance', icon: ChartPieIcon },
        { title: 'User Analytics', href: '/dashboard/admin/user-analytics', icon: UsersIcon },
        { title: 'Revenue Reports', href: '/dashboard/admin/revenue', icon: BanknotesIcon },
        { title: 'System Metrics', href: '/dashboard/admin/metrics', icon: PresentationChartLineIcon }
      ]
    },
    {
      title: 'Financial Management',
      href: '/dashboard/admin/accounting',
      icon: CurrencyDollarIcon,
      children: [
        { title: 'Accounting Dashboard', href: '/dashboard/admin/accounting', icon: CurrencyDollarIcon },
        { title: 'Income Management', href: '/dashboard/admin/accounting/income', icon: ArrowTrendingUpIcon },
        { title: 'Expense Management', href: '/dashboard/admin/accounting/expenses', icon: ArrowTrendingDownIcon },
        { title: 'Financial Reports', href: '/dashboard/admin/accounting/reports', icon: ChartBarIcon },
        { title: 'Invoicing', href: '/dashboard/admin/accounting/invoicing', icon: CurrencyDollarIcon }
      ]
    },
    {
      title: 'Operations',
      href: '/dashboard/admin/operations',
      icon: CogIcon,
      children: [
        { title: 'Support Tickets', href: '/dashboard/admin/support', icon: LifebuoyIcon, badge: '12' },
        { title: 'Backup & Recovery', href: '/dashboard/admin/backup', icon: CloudIcon },
        { title: 'Task Scheduler', href: '/dashboard/admin/scheduler', icon: CalendarIcon },
        { title: 'Audit & Compliance', href: '/dashboard/admin/audit', icon: ShieldCheckIcon },

        { title: 'Settings', href: '/dashboard/admin/settings', icon: CogIcon },
        { title: 'System Maintenance', href: '/dashboard/admin/maintenance', icon: WrenchScrewdriverIcon, badge: 'New' },
        { title: 'Payment Settings', href: '/dashboard/admin/settings/payment', icon: CreditCardIcon, badge: 'Config' }
      ]
    }
  ];

  const quickStats = [
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '0.1',
      changeType: 'positive' as const,
      icon: ServerIcon,
      color: 'green',
      description: 'Platform availability'
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '127',
      changeType: 'positive' as const,
      icon: UsersIcon,
      color: 'blue',
      description: 'Currently online'
    },
    {
      title: 'Revenue (MTD)',
      value: '$67,230',
      change: '12.5',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'emerald',
      description: 'Month to date'
    },
    {
      title: 'Security Score',
      value: '98/100',
      change: '2',
      changeType: 'positive' as const,
      icon: ShieldCheckIcon,
      color: 'purple',
      description: 'Security rating'
    }
  ];

  return (
    <VerticalDashboardLayout
      title="System Administration"
      subtitle={`Welcome back, ${session.user.name} - Managing EduSight Platform`}
      menuItems={menuItems}
      activeItem="/dashboard/admin"
    >
      <div className="space-y-6">
        {/* Quick Action Icons */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/assessments')}>
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Assessments</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/subjects')}>
              <BeakerIcon className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Subjects</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/calendar')}>
              <CalendarDaysIcon className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Calendar</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/exams')}>
              <PencilSquareIcon className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Exams</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/progress')}>
              <TrophyIcon className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Progress</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/users')}>
              <UsersIcon className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Users</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/school')}>
              <BuildingOfficeIcon className="h-8 w-8 text-pink-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Schools</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/curriculum-mapper')}>
              <BookOpenIcon className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Curriculum</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/skills')}>
              <BeakerIcon className="h-8 w-8 text-emerald-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Skills</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/templates')}>
              <FolderIcon className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Templates</span>
            </div>
            <div className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => router.push('/dashboard/admin/maintenance')}>
              <WrenchScrewdriverIcon className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-xs text-gray-700 text-center">Maintenance</span>
            </div>
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

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <DashboardCard title="System Health Overview" value="" subtitle="">
            <ModernChart
              title="Resource Usage"
              data={[
                { label: 'CPU Usage', value: 45 },
                { label: 'Memory', value: 67 },
                { label: 'Storage', value: 32 },
                { label: 'Network', value: 78 }
              ]}
              type="bar"
              height={250}
            />
          </DashboardCard>

          {/* User Activity Trends */}
          <DashboardCard title="User Activity Trends" value="" subtitle="">
            <ModernChart
              title="Monthly Active Users"
              data={[
                { label: 'Jan', value: 1200 },
                { label: 'Feb', value: 1350 },
                { label: 'Mar', value: 1100 },
                { label: 'Apr', value: 1800 },
                { label: 'May', value: 2100 },
                { label: 'Jun', value: 2450 }
              ]}
              type="line"
              height={250}
            />
          </DashboardCard>
        </div>

        {/* Revenue and School Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <DashboardCard title="Revenue Analytics" value="" subtitle="">
              <ModernChart
                title="Quarterly Revenue"
                data={[
                  { label: 'Q1', value: 45000 },
                  { label: 'Q2', value: 52000 },
                  { label: 'Q3', value: 48000 },
                  { label: 'Q4', value: 67000 }
                ]}
                type="bar"
                height={300}
              />
            </DashboardCard>
          </div>

          {/* School Distribution */}
          <DashboardCard title="School Distribution" value="" subtitle="">
            <ModernChart
              title="School Types"
              data={[
                { label: 'Primary', value: 45 },
                { label: 'Secondary', value: 30 },
                { label: 'Higher Secondary', value: 25 }
              ]}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Real-time System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Status */}
          <DashboardCard
            title="Live System Status"
            value=""
            subtitle=""
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Database</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">API Services</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Authentication</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">File Storage</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-yellow-600">85% Full</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Recent Activities */}
          <DashboardCard title="Recent Activities" value="" subtitle="" className="lg:col-span-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New school registered</p>
                  <p className="text-xs text-gray-500">Greenwood High School joined the platform</p>
                  <span className="text-xs text-gray-400">5 minutes ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System backup completed</p>
                  <p className="text-xs text-gray-500">Daily backup finished successfully</p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <BellIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Performance alert cleared</p>
                  <p className="text-xs text-gray-500">CPU usage returned to normal levels</p>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">System Administration Tools</h3>
              <p className="text-blue-100">Quick access to critical system management functions</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                System Health Check
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium text-sm border border-blue-400">
                User Management
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium text-sm border border-purple-400">
                Generate Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}