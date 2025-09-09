'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  DocumentArrowDownIcon,
  LockClosedIcon,
  CreditCardIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { generateBrandedAssessmentPDF, downloadPDF } from '@/lib/pdf-generator';
import { getUserTypeConfig, canBypassPayment, getPaymentStatus } from '@/lib/user-types';

interface PDFDownloadButtonProps {
  assessmentData: {
    student: {
      name: string;
      grade: string;
      school?: string;
      dateOfBirth?: string;
    };
    scores: {
      academic: number;
      physical: number;
      psychological: number;
      total: number;
    };
    breakdown: {
      academic: {
        mathematics: number;
        science: number;
        english: number;
        socialStudies: number;
      };
      physical: {
        fitness: number;
        health: number;
        growth: number;
      };
      psychological: {
        emotional: number;
        social: number;
        behavioral: number;
      };
    };
    recommendations: string[];
    strengths: string[];
    areasForImprovement: string[];
    assessmentId: string;
  };
  userRole: 'ADMIN' | 'PARENT' | 'SCHOOL_ADMIN' | 'TEACHER';
  paymentStatus: 'PAID' | 'UNPAID' | 'DEMO';
  isDemo?: boolean;
}

export default function PDFDownloadButton({ 
  assessmentData, 
  userRole, 
  paymentStatus,
  isDemo = false 
}: PDFDownloadButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    // Check user type and payment requirements
    const userTypeConfig = getUserTypeConfig(userRole);
    const canBypass = canBypassPayment(userRole);
    const currentPaymentStatus = getPaymentStatus(userRole, paymentStatus === 'PAID', isDemo);
    
    // DEVELOPMENT MODE: Allow all users to download without payment
    console.log('🔓 DEV MODE: Allowing download without payment for testing');
    console.log(`User Type: ${userTypeConfig.name}, Payment Status: ${currentPaymentStatus}`);
    
    // ORIGINAL PAYMENT CHECK (DISABLED FOR DEV)
    // if (!canBypass && currentPaymentStatus === 'UNPAID' && !isDemo) {
    //   toast.error('Payment required to download assessment report');
    //   // Redirect to payment page based on user type
    //   const paymentUrl = userTypeConfig.pricing.hasPaymentGateway 
    //     ? '/payment?type=assessment-report' 
    //     : '/upgrade?type=assessment-report';
    //   window.location.href = paymentUrl;
    //   return;
    // }

    try {
      setGenerating(true);
      toast.loading('Generating your branded assessment report...', { id: 'pdf-generation' });

      // Add generation metadata
      const reportData = {
        ...assessmentData,
        generatedDate: new Date(),
      };

      // Generate PDF
      const pdfBlob = await generateBrandedAssessmentPDF(reportData);
      
      // Create filename
      const filename = `EduSight_Assessment_${assessmentData.student.name.replace(/\s+/g, '_')}_${assessmentData.assessmentId}.pdf`;
      
      // Download PDF
      downloadPDF(pdfBlob, filename);
      
      toast.success('Assessment report downloaded successfully!', { id: 'pdf-generation' });

      // Log download activity (for analytics)
      await logDownloadActivity({
        assessmentId: assessmentData.assessmentId,
        userRole,
        paymentStatus,
        fileName: filename,
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate assessment report', { id: 'pdf-generation' });
    } finally {
      setGenerating(false);
    }
  };

  const logDownloadActivity = async (data: any) => {
    try {
      await fetch('/api/analytics/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to log download activity:', error);
    }
  };

  const getButtonContent = () => {
    if (generating) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Generating Report...
        </>
      );
    }

    // Check user type for button text
    const userTypeConfig = getUserTypeConfig(userRole);
    const canBypass = canBypassPayment(userRole);
    
    if (canBypass) {
      return (
        <>
          <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
          Download Report ({userTypeConfig.name})
        </>
      );
    }

    // DEV MODE: Show download for all users
    return (
      <>
        <CheckCircleIcon className="h-5 w-5 mr-2" />
        Download Branded Report (Dev Mode)
      </>
    );

    // ORIGINAL LOGIC (DISABLED FOR DEV)
    // if (paymentStatus === 'PAID' || isDemo) {
    //   return (
    //     <>
    //       <CheckCircleIcon className="h-5 w-5 mr-2" />
    //       Download Branded Report
    //     </>
    //   );
    // }

    // return (
    //   <>
    //     <LockClosedIcon className="h-5 w-5 mr-2" />
    //     Upgrade to Download
    //   </>
    // );
  };

  const getButtonStyle = () => {
    const userTypeConfig = getUserTypeConfig(userRole);
    const canBypass = canBypassPayment(userRole);
    
    if (canBypass) {
      return 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600';
    }
    
    // DEV MODE: All users get green download button
    return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
    
    // ORIGINAL LOGIC (DISABLED FOR DEV)
    // if (paymentStatus === 'PAID' || isDemo) {
    //   return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
    // }
    // 
    // return 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600';
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleDownload}
        disabled={generating}
        className={`w-full flex items-center justify-center px-6 py-3 border rounded-lg font-medium transition-colors ${getButtonStyle()} ${
          generating ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-md'
        }`}
      >
        {getButtonContent()}
      </button>

      {/* Admin Access Notice */}
      {canBypassPayment(userRole) && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-purple-800">🔓 {getUserTypeConfig(userRole).name} Access - No Payment Required</h3>
              <p className="text-sm text-purple-700 mt-1">
                As a {getUserTypeConfig(userRole).name.toLowerCase()}, you have unrestricted access to download all assessment reports without payment restrictions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Development Mode Notice - All Users */}
      {!canBypassPayment(userRole) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">🔓 Development Mode - Free Downloads</h3>
              <p className="text-sm text-blue-700 mt-1">
                For development testing, all users can download assessment reports without payment. This will be restricted in production.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Required Notice - DISABLED FOR DEV */}
      {/* {userRole !== 'ADMIN' && paymentStatus === 'UNPAID' && !isDemo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <CreditCardIcon className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Payment Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Upgrade to download your comprehensive branded assessment report with detailed insights and recommendations.
              </p>
              <button
                onClick={() => window.location.href = '/payment?type=assessment-report'}
                className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                Upgrade Now →
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Demo Access Notice */}
      {isDemo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Demo Access Enabled</h3>
              <p className="text-sm text-blue-700 mt-1">
                You can download this report as part of your demo experience. Full platform access requires subscription.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Override Notice */}
      {userRole === 'ADMIN' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-purple-800">Admin Override Active</h3>
              <p className="text-sm text-purple-700 mt-1">
                You have unrestricted access to all features including PDF downloads without payment requirements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Included */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2">📄 Branded Report Includes:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Professional EduSight branding and design</li>
          <li>• Complete 360° assessment breakdown</li>
          <li>• Detailed academic, physical, and psychological analysis</li>
          <li>• Personalized recommendations and growth areas</li>
          <li>• Visual charts and performance indicators</li>
          <li>• Secure PDF with watermarks and authenticity markers</li>
        </ul>
      </div>
    </div>
  );
}
