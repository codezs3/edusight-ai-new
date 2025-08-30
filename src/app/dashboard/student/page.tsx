'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { 
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  BookOpenIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline'

export default function StudentDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/student')
      return
    }

    if (session?.user?.role !== 'STUDENT') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'STUDENT') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Welcome back, {session.user.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Role: Student</p>
              <p className="text-sm text-gray-500">EduSight AI Analytics Platform</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <AcademicCapIcon className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Student Dashboard Coming Soon
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Your personalized learning dashboard is currently under development.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">What's Coming:</h3>
            <ul className="text-left text-indigo-800 space-y-2">
              <li>• View your EduSight 360° scores</li>
              <li>• Track academic progress</li>
              <li>• Monitor physical fitness assessments</li>
              <li>• Access psychological wellbeing insights</li>
              <li>• Receive personalized recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
