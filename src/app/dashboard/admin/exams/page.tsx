'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PencilSquareIcon, PlusIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

export default function Examinations() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/exams')
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
    { title: 'Dashboard', href: '/dashboard/admin', icon: PencilSquareIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: PencilSquareIcon }
  ]

  return (
    <VerticalDashboardLayout 
      title="Examinations" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/exams"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PencilSquareIcon className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Examinations</h1>
                <p className="text-gray-600">Manage examinations, test schedules, and assessment coordination</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              Schedule Exam
            </button>
          </div>
        </div>

        {/* Exam Management Overview */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200 p-8 text-center">
          <PencilSquareIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Examination Management System</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive examination scheduling and management platform.
          </p>
          <div className="text-sm text-red-600">
            📝 Integrated with Assessment Systems and Academic Calendar
          </div>
        </div>

        {/* Exam Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border p-6 text-center">
            <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Unit Tests</h3>
            <p className="text-gray-600 text-sm">Short assessments and quizzes</p>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <DocumentTextIcon className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Mid-terms</h3>
            <p className="text-gray-600 text-sm">Mid-semester examinations</p>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <PencilSquareIcon className="h-8 w-8 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Final Exams</h3>
            <p className="text-gray-600 text-sm">Comprehensive final assessments</p>
          </div>
          <div className="bg-white rounded-lg border p-6 text-center">
            <DocumentTextIcon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Standardized</h3>
            <p className="text-gray-600 text-sm">IGCSE, IB, CBSE exams</p>
          </div>
        </div>

        {/* Exam Management Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Scheduling</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Time Table Management</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Room Allocation</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Invigilator Assignment</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Integration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Framework-based Exams</span>
                <span className="text-xs text-green-600">Available</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">Subject-wise Testing</span>
                <span className="text-xs text-green-600">Available</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-700">Auto Grade Sync</span>
                <span className="text-xs text-gray-500">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access to Assessment System */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment System Integration</h3>
          <p className="text-gray-600 mb-4">
            Configure assessment frameworks and types that power your examination system.
          </p>
          <button 
            onClick={() => router.push('/dashboard/admin/assessments')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Assessment Systems
          </button>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
