'use client'

import { useSession } from 'next-auth/react'

export default function DebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm ${status === 'authenticated' ? 'bg-green-100 text-green-800' : status === 'loading' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{status}</span></p>
            <p><strong>Session:</strong> {session ? 'Present' : 'Not present'}</p>
          </div>
        </div>

        {session && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {session.user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {session.user?.email || 'N/A'}</p>
              <p><strong>Role:</strong> <span className={`px-2 py-1 rounded text-sm ${session.user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{session.user?.role || 'N/A'}</span></p>
              <p><strong>ID:</strong> {session.user?.id || 'N/A'}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Access Links</h2>
          <div className="space-y-3">
            <div>
              <a 
                href="/auth/signin" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-3"
              >
                Sign In
              </a>
              <a 
                href="/dashboard" 
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mr-3"
              >
                Dashboard
              </a>
              <a 
                href="/dashboard/admin" 
                className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Admin Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Dashboard Access Requirements</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${status === 'authenticated' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>User must be authenticated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${session?.user?.role === 'ADMIN' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>User role must be ADMIN</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${session?.user?.email === 'admin@edusight.com' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
              <span>Recommended: Use admin@edusight.com</span>
            </div>
          </div>
        </div>

        {session?.user?.role !== 'ADMIN' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <h3 className="text-red-800 font-semibold">Access Denied</h3>
            <p className="text-red-700 mt-1">
              You need ADMIN role to access the admin dashboard. 
              {session ? ` Your current role is: ${session.user?.role}` : ' Please sign in with an admin account.'}
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-blue-800 font-semibold">Demo Admin Credentials</h3>
          <div className="text-blue-700 mt-2 space-y-1">
            <p><strong>Email:</strong> admin@edusight.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
