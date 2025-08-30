'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AssessmentForm } from '@/components/forms/AssessmentForm';
import { toast } from 'react-hot-toast';

export default function AssessmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const handleAssessmentSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send this to your API
      console.log('Assessment data:', data);
      
      toast.success('Assessment submitted successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to submit assessment');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Comprehensive Assessment</h1>
              <p className="mt-1 text-sm text-gray-500">
                Complete your academic, psychological, and physical evaluation
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Form */}
      <div className="py-8">
        <AssessmentForm 
          onSubmit={handleAssessmentSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
