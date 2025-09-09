'use client';

import React from 'react';
import { ArrowPathIcon, HomeIcon, BugAntIcon } from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; errorInfo?: React.ErrorInfo; errorId?: string; resetError: () => void }>;
}

export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate a unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error Boundary caught an error:', error, errorInfo);
    }

    // In production, this would send to error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    
    // Log to our audit system
    this.logError(error, errorInfo);
  }

  private logError = async (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      // Import dynamically to avoid circular dependencies
      const { AuditLogger } = await import('@/lib/audit');
      
      await AuditLogger.logSecurityEvent({
        eventType: 'SUSPICIOUS_ACTIVITY',
        details: {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorId: this.state.errorId,
          type: 'REACT_ERROR_BOUNDARY'
        },
        severity: 'HIGH'
      });
    } catch (logError) {
      console.error('Failed to log error to audit system:', logError);
    }
  };

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            errorInfo={this.state.errorInfo}
            errorId={this.state.errorId}
            resetError={this.resetError}
          />
        );
      }

      // Default fallback UI
      return <DefaultErrorFallback {...this.state} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
  resetError: () => void;
}

function DefaultErrorFallback({ error, errorInfo, errorId, resetError }: DefaultErrorFallbackProps) {
  const handleReportError = () => {
    // In production, this would open a support ticket or error reporting form
    const errorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.log('Error Report:', errorReport);
    
    // You could send this to your backend or error reporting service
    // Example: fetch('/api/errors/report', { method: 'POST', body: JSON.stringify(errorReport) });
    
    alert('Error has been reported to our team. Thank you for helping us improve!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <BugAntIcon className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-red-600 font-semibold">Application Error</p>
        </div>

        {/* Error Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Error Details</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Error ID:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{errorId}</code></p>
            <p><strong>Message:</strong> {error.message}</p>
            {errorInfo?.componentStack && (
              <div>
                <strong>Component Stack:</strong>
                <pre className="bg-gray-200 p-2 rounded mt-2 text-xs overflow-x-auto">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={resetError}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Report Error */}
        <div className="text-center">
          <button
            onClick={handleReportError}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <ExclamationTriangleIcon className="w-4 h-4" />
            Report This Error
          </button>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <details className="text-sm text-gray-600">
              <summary className="cursor-pointer font-medium">Development Information</summary>
              <div className="mt-2 bg-gray-100 p-3 rounded text-xs">
                <p><strong>Error Stack:</strong></p>
                <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
