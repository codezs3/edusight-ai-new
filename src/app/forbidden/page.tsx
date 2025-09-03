'use client';

import { useRouter } from 'next/navigation';
import { NoSymbolIcon, ArrowLeftIcon, HomeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <NoSymbolIcon className="w-10 h-10 text-orange-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Forbidden</h1>
        <p className="text-orange-600 font-semibold mb-4">403 - Forbidden</p>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          You don't have the required permissions to access this resource. This action has been logged for security purposes.
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
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <ShieldCheckIcon className="w-5 h-5" />
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>Security Notice:</strong> This access attempt has been logged. If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
