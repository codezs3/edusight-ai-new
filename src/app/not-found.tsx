'use client';

import React from 'react';
import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon, MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-6xl font-bold text-red-600">404</div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Search Suggestion */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Looking for something specific?</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Try searching for what you need or check our most popular pages below.
          </p>
          <div className="flex justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <HomeIcon className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Home</span>
            <span className="text-sm text-gray-500">Back to landing page</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-medium text-gray-900">Dashboard</span>
            <span className="text-sm text-gray-500">Access your account</span>
          </Link>

          <Link
            href="/guest-assessment"
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <QuestionMarkCircleIcon className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-900">Free Assessment</span>
            <span className="text-sm text-gray-500">Try our platform</span>
          </Link>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 underline">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
