'use client';

import React, { Suspense } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
);

export default function LazyLoad({ children, fallback = <DefaultFallback /> }: LazyLoadProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Memoized components for heavy operations
export const LazyAnalytics = React.lazy(() => import('../charts/advanced/TremorDashboard'));
export const LazyMLWorkflow = React.lazy(() => import('../dashboard/parent/UploadWorkflow'));
export const LazyCharts = React.lazy(() => import('../charts/advanced/NivoRadarChart'));
export const LazyReports = React.lazy(() => import('../reports/ComprehensiveReport'));
