'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  AcademicCapIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline'

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

  const adminModules = [
    {
      title: 'School Management',
      description: 'Manage school settings, grades, and academic structure',
      icon: BuildingOfficeIcon,
      color: 'blue',
      href: '/dashboard/admin/school',
      stats: 'Configure academic framework'
    },
    {
      title: 'User Management',
      description: 'Manage teachers, students, parents, and staff accounts',
      icon: UsersIcon,
      color: 'green',
      href: '/dashboard/admin/users',
      stats: 'Add & manage users'
    },
    {
      title: 'Assessment Overview',
      description: 'Monitor all assessments and EduSight 360° scores',
      icon: AcademicCapIcon,
      color: 'purple',
      href: '/dashboard/admin/assessments',
      stats: 'Track student progress'
    },
    {
      title: 'Analytics & Reports',
      description: 'School-wide performance analytics and detailed reports',
      icon: DocumentChartBarIcon,
      color: 'orange',
      href: '/dashboard/admin/analytics',
      stats: 'Generate insights'
    },
    {
      title: 'Performance Dashboard',
      description: 'Real-time school performance metrics and KPIs',
      icon: ChartBarIcon,
      color: 'red',
      href: '/dashboard/admin/performance',
      stats: 'Monitor KPIs'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences and administrative settings',
      icon: CogIcon,
      color: 'gray',
      href: '/dashboard/admin/settings',
      stats: 'System configuration'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100',
      gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getIconColorClasses = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      gray: 'text-gray-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                School Administration Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back, {session.user.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role: School Administrator</p>
              <p className="text-sm text-gray-500">EduSight AI Analytics Platform</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AcademicCapIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Students</dt>
                    <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Assessments</dt>
                    <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg E360 Score</dt>
                    <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => {
            const IconComponent = module.icon
            return (
              <div
                key={module.title}
                className={`p-6 border-2 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-lg ${getColorClasses(module.color)}`}
                onClick={() => router.push(module.href)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <IconComponent className={`h-8 w-8 ${getIconColorClasses(module.color)}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{module.stats}</span>
                      <span className="text-xs font-medium text-blue-600">
                        Coming Soon →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Activity tracking will be available soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Monitor user registrations, assessments, and system events
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
