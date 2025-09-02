'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CalendarDaysIcon, PlusIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

export default function AcademicCalendar() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/calendar')
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
    { title: 'Dashboard', href: '/dashboard/admin', icon: CalendarDaysIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: CalendarDaysIcon }
  ]

  return (
    <VerticalDashboardLayout 
      title="Academic Calendar" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/calendar"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
                <p className="text-gray-600">Manage academic year schedules and important dates</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              Add Event
            </button>
          </div>
        </div>

        {/* Calendar Overview */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-8 text-center">
          <CalendarDaysIcon className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Academic Calendar Management</h2>
          <p className="text-gray-600 mb-4">
            Comprehensive academic calendar system with assessment cycle integration.
          </p>
          <div className="text-sm text-purple-600">
            📅 Integrated with Assessment Cycles and Examination Scheduling
          </div>
        </div>

        {/* Calendar Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Term Schedule</h3>
            <p className="text-gray-600 text-sm mb-4">Academic terms and semester planning</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Assessment Dates</h3>
            <p className="text-gray-600 text-sm mb-4">Key assessment and examination dates</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">School Events</h3>
            <p className="text-gray-600 text-sm mb-4">Important school events and holidays</p>
            <div className="text-xs text-gray-500">Coming Soon</div>
          </div>
        </div>

        {/* Current Assessment Cycles */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AcademicCapIcon className="h-5 w-5 text-purple-600" />
            Assessment Cycles Integration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">Monthly</div>
              <div className="text-sm text-gray-600">1 Month Cycle</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">Quarterly</div>
              <div className="text-sm text-gray-600">3 Month Cycle</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">Six-Monthly</div>
              <div className="text-sm text-gray-600">6 Month Cycle</div>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">Yearly</div>
              <div className="text-sm text-gray-600">12 Month Cycle</div>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
