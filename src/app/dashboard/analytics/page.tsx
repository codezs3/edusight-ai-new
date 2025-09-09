'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import ComprehensiveAnalyticsDashboard from '@/components/dashboard/ComprehensiveAnalyticsDashboard';

export default function AnalyticsDashboard() {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session) {
    redirect('/dashboard');
  }

  return (
    <ComprehensiveAnalyticsDashboard
      userRole={session.user.role}
      userId={session.user.id}
    />
  );
}
