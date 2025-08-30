'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function DashboardRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      // Redirect to sign-in if not authenticated
      router.push('/auth/signin?callbackUrl=/dashboard')
      return
    }

    if (session?.user?.role) {
      // Redirect to role-specific dashboard
      switch (session.user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin')
          toast.success(`Welcome back, ${session.user.name}! (School Administrator)`)
          break
        case 'TEACHER':
          router.push('/dashboard/teacher')
          toast.success(`Welcome back, ${session.user.name}! (Physical Education Expert)`)
          break
        case 'PARENT':
          router.push('/dashboard/parent')
          toast.success(`Welcome back, ${session.user.name}! (Parent Dashboard)`)
          break
        case 'COUNSELOR':
          router.push('/dashboard/counselor')
          toast.success(`Welcome back, ${session.user.name}! (Psychologist Dashboard)`)
          break
        case 'STUDENT':
          router.push('/dashboard/student')
          toast.success(`Welcome back, ${session.user.name}! (Student Dashboard)`)
          break
        default:
          // Fallback for unknown roles
          router.push('/dashboard/general')
          toast.success(`Welcome back, ${session.user.name}!`)
      }
    } else {
      // No role assigned, redirect to profile setup
      router.push('/profile/setup')
      toast.error('Please complete your profile setup')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-900">Loading your dashboard...</h2>
          <p className="text-sm text-gray-600 mt-2">Please wait while we redirect you</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-900">Redirecting to your dashboard...</h2>
        <p className="text-sm text-gray-600 mt-2">
          {session?.user?.role ? `Loading ${session.user.role.toLowerCase()} dashboard` : 'Determining your access level'}
        </p>
      </div>
    </div>
  )
}