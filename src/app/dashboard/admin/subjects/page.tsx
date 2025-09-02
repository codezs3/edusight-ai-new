'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BeakerIcon, PlusIcon } from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

export default function SubjectManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/subjects')
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
    { title: 'Dashboard', href: '/dashboard/admin', icon: BeakerIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: BeakerIcon }
  ]

  return (
    <VerticalDashboardLayout 
      title="Subject Management" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/subjects"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BeakerIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
                <p className="text-gray-600">Manage subjects across all academic frameworks</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              Add Subject
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 text-center">
          <BeakerIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Subject Management System</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive subject management across all academic frameworks will be available here.
          </p>
          <div className="text-sm text-blue-600">
            🔗 This feature integrates with the Assessment Systems already available at{' '}
            <span 
              className="underline cursor-pointer hover:text-blue-800"
              onClick={() => router.push('/dashboard/admin/assessments')}
            >
              Assessment Systems
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/admin/assessments/frameworks')}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Framework Subjects</h3>
            <p className="text-gray-600 text-sm">Manage subjects within specific academic frameworks</p>
          </div>
          <div 
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/admin/assessments')}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Assessment Systems</h3>
            <p className="text-gray-600 text-sm">Configure assessment types and cycles</p>
          </div>
          <div className="bg-white rounded-lg border p-6 opacity-50">
            <h3 className="font-semibold text-gray-900 mb-2">Subject Analytics</h3>
            <p className="text-gray-600 text-sm">View subject performance metrics (Coming Soon)</p>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
