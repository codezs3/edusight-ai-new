'use client';

import { useRouter } from 'next/navigation';
import { ArrowPathIcon, HomeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

export default function ServerErrorPage() {
  const router = useRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Server Error</h1>
        <p className="text-red-600 font-semibold mb-4">500 - Internal Server Error</p>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again in a few moments.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <WrenchScrewdriverIcon className="w-5 h-5" />
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

        {/* Status Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Status:</strong> Our team is actively monitoring this issue. If the problem persists, please contact support.
            </p>
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Need immediate help? Contact us at{' '}
            <a href="mailto:support@edusight.com" className="text-blue-600 hover:underline">
              support@edusight.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
