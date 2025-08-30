import { Metadata } from 'next';
import Link from 'next/link';
import { DemoUsersPanel } from '@/components/demo/DemoUsersPanel';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Demo Users - EduSight',
  description: 'Complete directory of demo users for testing and development',
};

export default function DemoUsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demo Users Directory</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete list of demo users for testing and development
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Demo Users Panel */}
          <div className="lg:col-span-2">
            <DemoUsersPanel showCopyButton={true} />
          </div>

          {/* Quick Access & Info */}
          <div className="space-y-6">
            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Access</h3>
              <div className="space-y-3">
                <Link
                  href="/auth/signin"
                  className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Go to Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            </div>

            {/* Usage Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 How to Use</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                  <p>Click the <strong>user icon</strong> to auto-fill credentials on sign-in page</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                  <p>Click the <strong>copy icon</strong> to copy credentials to clipboard</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                  <p>All users have the same password: <code className="bg-gray-100 px-1 rounded">password123</code></p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Demo Users</span>
                  <span className="text-sm font-medium text-gray-900">22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Admin Users</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Business Users</span>
                  <span className="text-sm font-medium text-gray-900">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Education Users</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="text-sm font-medium text-gray-900">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Parents</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Support Staff</span>
                  <span className="text-sm font-medium text-gray-900">4</span>
                </div>
              </div>
            </div>

            {/* Role Descriptions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎭 Role Descriptions</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 mr-2">ADMIN</span>
                  <span className="text-gray-600">Full system access, user management</span>
                </div>
                <div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mr-2">TEACHER</span>
                  <span className="text-gray-600">Student management, assessments</span>
                </div>
                <div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mr-2">STUDENT</span>
                  <span className="text-gray-600">Personal progress, assessments</span>
                </div>
                <div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 mr-2">PARENT</span>
                  <span className="text-gray-600">Child monitoring, reports</span>
                </div>
                <div>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 mr-2">COUNSELOR</span>
                  <span className="text-gray-600">Student support, wellbeing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
