'use client';

import { useRouter } from 'next/navigation';
import { ShieldExclamationIcon, ArrowLeftIcon, HomeIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldExclamationIcon className="w-10 h-10 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-red-600 font-semibold mb-4">401 - Unauthorized</p>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource. Please sign in with appropriate credentials or contact your administrator.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </button>

          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <KeyIcon className="w-5 h-5" />
            Sign In
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact support at{' '}
            <a href="mailto:support@edusight.com" className="text-blue-600 hover:underline">
              support@edusight.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
