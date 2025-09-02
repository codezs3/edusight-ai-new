'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { TrophyIcon, DocumentChartBarIcon, ChartBarIcon, EyeIcon } from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

export default function ProgressReports() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/progress')
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

  const menuItems = [
    { title: 'Dashboard', href: '/dashboard/admin', icon: TrophyIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: TrophyIcon }
  ]

  return (
    <VerticalDashboardLayout 
      title="Progress Reports" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/progress"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Progress Reports</h1>
                <p className="text-gray-600">Comprehensive student progress tracking and reporting</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              <DocumentChartBarIcon className="h-5 w-5" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Progress Reports Overview */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-8 text-center">
          <TrophyIcon className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Progress Reports</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive progress tracking integrated with assessment systems and grade books.
          </p>
          <div className="text-sm text-yellow-600">
            🏆 Real-time progress analytics and parent communication tools
          </div>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <DocumentChartBarIcon className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Academic Progress</h3>
            <p className="text-gray-600 text-sm mb-4">Subject-wise performance and growth tracking</p>
            <button className="flex items-center gap-2 text-blue-600 text-sm">
              <EyeIcon className="h-4 w-4" />
              View Reports
            </button>
          </div>
          <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <ChartBarIcon className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Assessment Analysis</h3>
            <p className="text-gray-600 text-sm mb-4">Detailed assessment performance breakdowns</p>
            <button className="flex items-center gap-2 text-green-600 text-sm">
              <EyeIcon className="h-4 w-4" />
              View Reports
            </button>
          </div>
          <div className="bg-white rounded-lg border p-6 opacity-50">
            <TrophyIcon className="h-8 w-8 text-yellow-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Achievement Reports</h3>
            <p className="text-gray-600 text-sm mb-4">Milestone achievements and recognition</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>
        </div>

        {/* Report Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Generation</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Individual Student Reports</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Class Performance Reports</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Parent-Friendly Reports</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Automated Report Cards</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Integration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Framework-based Analysis</span>
                <span className="text-xs text-green-600">Available</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Multi-type Assessment</span>
                <span className="text-xs text-green-600">Available</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Cycle-based Progress</span>
                <span className="text-xs text-green-600">Available</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Template-driven Reports</span>
                <span className="text-xs text-green-600">Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment System Link */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Systems Integration</h3>
          <p className="text-gray-600 mb-4">
            Progress reports are powered by your assessment systems configuration. Manage frameworks, subjects, and templates to enhance reporting.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/dashboard/admin/assessments')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Assessment Systems
            </button>
            <button 
              onClick={() => router.push('/dashboard/admin/assessments/templates')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Report Templates
            </button>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
