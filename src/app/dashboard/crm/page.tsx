'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  TrophyIcon,
  BanknotesIcon,
  FunnelIcon,
  MegaphoneIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShareIcon,
  CloudIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function CRMDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/crm')
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

  // Sidebar Menu Items for CRM
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/crm',
      icon: HomeIcon
    },
    {
      title: 'Leads & Contacts',
      href: '/dashboard/crm/leads',
      icon: UserGroupIcon,
      children: [
        { title: 'Lead Management', href: '/dashboard/crm/leads', icon: FunnelIcon, badge: '127' },
        { title: 'Contact Database', href: '/dashboard/crm/contacts', icon: UserGroupIcon },
        { title: 'Lead Scoring', href: '/dashboard/crm/scoring', icon: StarIcon, badge: '67' },
        { title: 'Lead Sources', href: '/dashboard/crm/sources', icon: ShareIcon }
      ]
    },
    {
      title: 'Sales Pipeline',
      href: '/dashboard/crm/pipeline',
      icon: PresentationChartLineIcon,
      children: [
        { title: 'Sales Pipeline', href: '/dashboard/crm/pipeline', icon: PresentationChartLineIcon },
        { title: 'Deal Management', href: '/dashboard/crm/deals', icon: CurrencyDollarIcon, badge: '23' },
        { title: 'Proposals', href: '/dashboard/crm/proposals', icon: DocumentTextIcon },
        { title: 'Forecasting', href: '/dashboard/crm/forecasting', icon: ArrowTrendingUpIcon }
      ]
    },
    {
      title: 'Marketing',
      href: '/dashboard/crm/marketing',
      icon: MegaphoneIcon,
      children: [
        { title: 'Email Campaigns', href: '/dashboard/crm/email', icon: EnvelopeIcon, badge: '5' },
        { title: 'Marketing Automation', href: '/dashboard/crm/automation', icon: BeakerIcon },
        { title: 'Social Media', href: '/dashboard/crm/social', icon: ShareIcon },
        { title: 'Events', href: '/dashboard/crm/events', icon: CalendarIcon }
      ]
    },
    {
      title: 'Analytics & Reports',
      href: '/dashboard/crm/analytics',
      icon: ChartBarIcon,
      children: [
        { title: 'Sales Analytics', href: '/dashboard/crm/sales-analytics', icon: ChartBarIcon },
        { title: 'Revenue Reports', href: '/dashboard/crm/revenue', icon: BanknotesIcon },
        { title: 'Performance Reports', href: '/dashboard/crm/performance', icon: TrophyIcon },
        { title: 'ROI Analysis', href: '/dashboard/crm/roi', icon: PresentationChartLineIcon }
      ]
    },
    {
      title: 'Customer Support',
      href: '/dashboard/crm/support',
      icon: HeartIcon,
      children: [
        { title: 'Support Tickets', href: '/dashboard/crm/tickets', icon: HeartIcon, badge: '12' },
        { title: 'Customer Feedback', href: '/dashboard/crm/feedback', icon: InformationCircleIcon },
        { title: 'Customer Retention', href: '/dashboard/crm/retention', icon: TrophyIcon }
      ]
    }
  ];

  const quickStats = [
    {
      title: 'Total Leads',
      value: '1,247',
      change: '12',
      changeType: 'positive' as const,
      icon: UserGroupIcon,
      color: 'blue',
      description: 'Active potential customers'
    },
    {
      title: 'Conversion Rate',
      value: '23.4%',
      change: '2.1',
      changeType: 'positive' as const,
      icon: ArrowTrendingUpIcon,
      color: 'green',
      description: 'Lead to customer conversion'
    },
    {
      title: 'Monthly Revenue',
      value: '$45.2k',
      change: '8.7',
      changeType: 'positive' as const,
      icon: CurrencyDollarIcon,
      color: 'emerald',
      description: 'Total revenue this month'
    },
    {
      title: 'Active Deals',
      value: '89',
      change: '5',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'orange',
      description: 'Deals in progress'
    }
  ];

  return (
    <VerticalDashboardLayout
      title="CRM Management"
      subtitle={`Welcome back, ${session.user.name} - Customer Relationship Management`}
      menuItems={menuItems}
      activeItem="/dashboard/crm"
    >
      <div className="space-y-6">
        {/* CRM Performance Metrics */}
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

        {/* Sales Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Trend Chart */}
          <div className="lg:col-span-2">
            <DashboardCard title="Monthly Sales Revenue" value="" subtitle="">
              <ModernChart
                title="Revenue Trend"
                data={[
                  { label: 'Jan', value: 32000 },
                  { label: 'Feb', value: 38000 },
                  { label: 'Mar', value: 35000 },
                  { label: 'Apr', value: 42000 },
                  { label: 'May', value: 39000 },
                  { label: 'Jun', value: 45200 }
                ]}
                type="line"
                height={300}
              />
            </DashboardCard>
          </div>
          
          {/* Lead Sources */}
          <DashboardCard title="Lead Sources" value="" subtitle="">
            <ModernChart
              title="Lead Origins"
              data={[
                { label: 'Website', value: 45 },
                { label: 'Social Media', value: 28 },
                { label: 'Email Campaign', value: 18 },
                { label: 'Referrals', value: 15 },
                { label: 'Cold Calls', value: 8 }
              ]}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Pipeline and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Pipeline Status */}
          <DashboardCard title="Sales Pipeline Status" value="" subtitle="">
            <ModernChart
              title="Pipeline Stages"
              data={[
                { label: 'Prospecting', value: 45 },
                { label: 'Qualification', value: 32 },
                { label: 'Proposal', value: 18 },
                { label: 'Negotiation', value: 12 },
                { label: 'Closing', value: 8 }
              ]}
              type="bar"
              height={250}
            />
          </DashboardCard>

          {/* Customer Acquisition */}
          <DashboardCard title="Customer Acquisition Trend" value="" subtitle="">
            <ModernChart
              title="New Customers"
              data={[
                { label: 'Jan', value: 12 },
                { label: 'Feb', value: 15 },
                { label: 'Mar', value: 18 },
                { label: 'Apr', value: 22 },
                { label: 'May', value: 19 },
                { label: 'Jun', value: 26 }
              ]}
              type="line"
              height={250}
            />
          </DashboardCard>
        </div>

        {/* CRM Activities and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <DashboardCard title="Recent CRM Activities" value="" subtitle="" className="lg:col-span-2">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserGroupIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New lead assigned</p>
                  <p className="text-xs text-gray-500">Springfield Elementary School - High priority</p>
                  <span className="text-xs text-gray-400">15 minutes ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Deal closed successfully</p>
                  <p className="text-xs text-gray-500">Riverside Academy - $12,500 annual contract</p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Email campaign completed</p>
                  <p className="text-xs text-gray-500">Q4 Education Insights - 89% open rate</p>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Demo scheduled</p>
                  <p className="text-xs text-gray-500">Northfield High School - Tomorrow 2:00 PM</p>
                  <span className="text-xs text-gray-400">6 hours ago</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Quick Actions */}
          <DashboardCard title="Quick CRM Actions" value="" subtitle="" className="h-fit">
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <UserGroupIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Add New Lead</p>
                  <p className="text-xs text-blue-600">Create new prospect</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <EnvelopeIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Send Campaign</p>
                  <p className="text-xs text-green-600">Email marketing</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">View Reports</p>
                  <p className="text-xs text-purple-600">Sales analytics</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <CalendarIcon className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Schedule Demo</p>
                  <p className="text-xs text-orange-600">Book presentation</p>
                </div>
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* CRM Insights */}
        <DashboardCard title="CRM Performance Insights" value="" subtitle="" className="p-0">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Top Performer</h3>
                <p className="text-sm text-slate-600">Sarah Johnson leads with 23 closed deals this month</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Revenue Growth</h3>
                <p className="text-sm text-slate-600">23% increase in monthly recurring revenue</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Customer Satisfaction</h3>
                <p className="text-sm text-slate-600">4.8/5 average rating from customer surveys</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Call to Action Panel */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Boost Your Sales Performance</h3>
              <p className="text-blue-100">Leverage CRM insights to convert more leads and grow revenue with EduSight's educational solutions</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                Add New Lead
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium text-sm border border-blue-400">
                Import Contacts
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors font-medium text-sm border border-cyan-400">
                View Pipeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}