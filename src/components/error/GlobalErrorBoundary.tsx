'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Global Error Boundary caught an error:', error, errorInfo);
    
    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement error logging service (e.g., Sentry, LogRocket)
      console.error('Error logged to monitoring service');
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-600" />
              </div>
            </div>

            {/* Main Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Application Error
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Something went wrong with the application. Please try refreshing the page.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-medium text-red-800 mb-2">Error Details (Development):</h3>
                <p className="text-sm text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="text-xs text-red-600 mt-2 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Refresh Page
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => window.location.href = '/'}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <HomeIcon className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-gray-900">Home</span>
                <span className="text-sm text-gray-500">Back to landing page</span>
              </button>

              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="font-medium text-gray-900">Dashboard</span>
                <span className="text-sm text-gray-500">Access your account</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                If this error persists, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
