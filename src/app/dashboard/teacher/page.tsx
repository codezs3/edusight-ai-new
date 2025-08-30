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
  PlayIcon
} from '@heroicons/react/24/outline'

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

  const teacherModules = [
    {
      title: 'Physical Assessments',
      description: 'Conduct and manage physical fitness assessments for students',
      icon: HeartIcon,
      color: 'red',
      href: '/dashboard/teacher/physical-assessments',
      stats: 'Track fitness levels'
    },
    {
      title: 'Student Groups',
      description: 'Manage your assigned student groups and classes',
      icon: UserGroupIcon,
      color: 'blue',
      href: '/dashboard/teacher/students',
      stats: 'View class lists'
    },
    {
      title: 'Assessment Results',
      description: 'Review and analyze student assessment outcomes',
      icon: ClipboardDocumentCheckIcon,
      color: 'green',
      href: '/dashboard/teacher/results',
      stats: 'Review progress'
    },
    {
      title: 'Performance Analytics',
      description: 'View detailed performance analytics for your students',
      icon: ChartBarIcon,
      color: 'purple',
      href: '/dashboard/teacher/analytics',
      stats: 'Data insights'
    },
    {
      title: 'Sports Activities',
      description: 'Plan and manage sports activities and training sessions',
      icon: PlayIcon,
      color: 'orange',
      href: '/dashboard/teacher/activities',
      stats: 'Activity planning'
    },
    {
      title: 'E360 Score Overview',
      description: 'Monitor comprehensive EduSight 360° scores for your students',
      icon: AcademicCapIcon,
      color: 'indigo',
      href: '/dashboard/teacher/e360-scores',
      stats: 'Holistic view'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      red: 'bg-red-50 border-red-200 hover:bg-red-100',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getIconColorClasses = (color: string) => {
    const colors = {
      red: 'text-red-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      indigo: 'text-indigo-600'
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
                Physical Education Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back, {session.user.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role: Physical Education Expert</p>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">My Students</dt>
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
                  <HeartIcon className="h-6 w-6 text-red-600" />
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
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Fitness</dt>
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
                  <PlayIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Activities</dt>
                    <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherModules.map((module) => {
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
                      <span className="text-xs font-medium text-green-600">
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
            <h3 className="text-lg font-medium text-gray-900">Recent Physical Assessments</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Assessment tracking will be available soon</p>
              <p className="text-sm text-gray-400 mt-2">
                Monitor student fitness assessments and physical development
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
