'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { DocumentChartBarIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

export default function GradeBooks() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/gradebooks')
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
    { title: 'Dashboard', href: '/dashboard/admin', icon: DocumentChartBarIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: DocumentChartBarIcon }
  ]

  return (
    <VerticalDashboardLayout 
      title="Grade Books" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/gradebooks"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentChartBarIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Grade Books</h1>
                <p className="text-gray-600">Digital grade book management and tracking</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              Create Grade Book
            </button>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-8 text-center">
          <DocumentChartBarIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Digital Grade Books</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive grade tracking and management system coming soon.
          </p>
          <div className="text-sm text-green-600">
            📊 Integration with Assessment Systems and Progress Reports
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-semibold text-gray-900 mb-2">Class Grade Books</h3>
            <p className="text-gray-600 text-sm mb-4">View and manage grades by class</p>
            <button className="flex items-center gap-2 text-blue-600 text-sm">
              <EyeIcon className="h-4 w-4" />
              View Details
            </button>
          </div>
          <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="font-semibold text-gray-900 mb-2">Subject Grades</h3>
            <p className="text-gray-600 text-sm mb-4">Track grades by subject area</p>
            <button className="flex items-center gap-2 text-blue-600 text-sm">
              <EyeIcon className="h-4 w-4" />
              View Details
            </button>
          </div>
          <div className="bg-white rounded-lg border p-6 opacity-50">
            <h3 className="font-semibold text-gray-900 mb-2">Grade Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">Performance analytics and insights</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
