'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  HeartIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

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

  const counselorModules = [
    {
      title: 'Psychological Assessments',
      description: 'Conduct and manage psychological evaluations and mental health assessments',
      icon: HeartIcon,
      color: 'purple',
      href: '/dashboard/counselor/psychological-assessments',
      stats: 'Mental health tracking'
    },
    {
      title: 'Student Cases',
      description: 'Manage active student cases and counseling sessions',
      icon: UserGroupIcon,
      color: 'blue',
      href: '/dashboard/counselor/cases',
      stats: 'Active cases'
    },
    {
      title: 'Assessment Reports',
      description: 'Create and review detailed psychological assessment reports',
      icon: ClipboardDocumentListIcon,
      color: 'green',
      href: '/dashboard/counselor/reports',
      stats: 'Generate reports'
    },
    {
      title: 'Mental Health Analytics',
      description: 'Analyze psychological trends and mental health patterns',
      icon: ChartBarIcon,
      color: 'indigo',
      href: '/dashboard/counselor/analytics',
      stats: 'Trend analysis'
    },
    {
      title: 'Risk Alerts',
      description: 'Monitor students requiring immediate psychological intervention',
      icon: ExclamationTriangleIcon,
      color: 'red',
      href: '/dashboard/counselor/alerts',
      stats: 'Critical monitoring'
    },
    {
      title: 'E360 Psychological Scores',
      description: 'Monitor psychological components of EduSight 360° assessments',
      icon: AcademicCapIcon,
      color: 'orange',
      href: '/dashboard/counselor/e360-psychology',
      stats: 'Holistic assessment'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    }
    return colors[color as keyof typeof colors] || colors.purple
  }

  const getIconColorClasses = (color: string) => {
    const colors = {
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      indigo: 'text-indigo-600',
      red: 'text-red-600',
      orange: 'text-orange-600'
    }
    return colors[color as keyof typeof colors] || colors.purple
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Psychology & Counseling Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back, {session.user.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role: Licensed Psychologist</p>
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
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
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
                  <HeartIcon className="h-6 w-6 text-purple-600" />
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
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Risk Alerts</dt>
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
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Wellbeing</dt>
                    <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Counselor Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {counselorModules.map((module) => {
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
                      <span className="text-xs font-medium text-purple-600">
                        Coming Soon →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Risk Assessment Alert */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Risk Assessment Protocol</h3>
              <p className="text-sm text-red-700 mt-1">
                Students with E360 scores below 40 require immediate psychological evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Psychological Assessments</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Assessment tracking will be available soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Monitor student mental health assessments and psychological development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
