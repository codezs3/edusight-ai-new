'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LockClosedIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import ComprehensiveReport from '@/components/reports/ComprehensiveReport';
import { Logo } from '@/components/ui/Logo';

interface ReportPageProps {
  params: {
    id: string;
  };
}

export default function ReportPage({ params }: ReportPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reportData, setReportData] = useState<any>(null);
  const [accessInfo, setAccessInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchReportAndAccess();
  }, [session, status, params.id]);

  const fetchReportAndAccess = async () => {
    try {
      setLoading(true);
      
      // Check access permissions
      const accessResponse = await fetch(`/api/reports/access-check?feature=pdf_download`);
      const accessData = await accessResponse.json();
      
      if (!accessResponse.ok) {
        throw new Error(accessData.error || 'Failed to check access');
      }
      
      setAccessInfo(accessData);

      // Fetch report data (placeholder - replace with actual API)
      const reportResponse = await fetch(`/api/reports/${params.id}`);
      
      if (reportResponse.ok) {
        const data = await reportResponse.json();
        setReportData(data);
      } else {
        // For demo purposes, use mock data
        setReportData(getMockReportData());
      }
      
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // For demo purposes, still show mock data
      setReportData(getMockReportData());
      setAccessInfo({
        hasAccess: true,
        isDemo: true,
        reason: 'Demo access granted'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Redirect to upgrade/payment page
    router.push('/pricing?feature=pdf_download');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Loading your comprehensive report...</p>
        </div>
      </div>
    );
  }

  if (error && !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!accessInfo?.hasAccess && !accessInfo?.isDemo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <LockClosedIcon className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Feature
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              PDF downloads and detailed reports are available for premium users. 
              Upgrade your account to access this comprehensive assessment report and download it as a PDF.
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Features Include:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span>Detailed PDF Reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span>Advanced Analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span>Career Recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span>Progress Tracking</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleUpgrade}
                className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <CreditCardIcon className="w-5 h-5" />
                <span>Upgrade Now</span>
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Reason: {accessInfo?.reason || 'Access denied'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ComprehensiveReport 
      data={reportData}
      canDownloadPDF={accessInfo?.hasAccess || false}
      isDemo={accessInfo?.isDemo || false}
      onUpgrade={handleUpgrade}
    />
  );
}

// Mock data for demonstration
function getMockReportData() {
  return {
    studentName: "John Doe",
    framework: "CBSE",
    academicData: {
      averageScore: 87,
      subjectScores: {
        "Mathematics": 92,
        "Science": 89,
        "English": 85,
        "Social Studies": 83,
        "Hindi": 88
      },
      strengths: ["Mathematics", "Science"],
      weaknesses: ["Social Studies"]
    },
    skillsAssessment: {
      overallScore: 85,
      cognitiveSkills: 88,
      practicalSkills: 82,
      socialSkills: 85
    },
    psychologicalAssessment: {
      emotionalIntelligence: 85,
      socialAdjustment: 88,
      motivationLevel: 90,
      learningStyle: "Visual-Kinesthetic"
    },
    physicalAssessment: {
      fitness: 85,
      motorSkills: 88,
      healthIndicators: 90
    },
    eduSightScore: 87,
    recommendations: [
      "Continue focusing on STEM subjects where you show exceptional aptitude",
      "Develop stronger analytical writing skills for Social Studies improvement",
      "Join mathematics olympiad or science competitions to challenge yourself",
      "Practice public speaking to enhance communication skills",
      "Maintain regular physical activity to support overall development"
    ],
    strengths: [
      "Exceptional mathematical problem-solving abilities",
      "Strong scientific reasoning and analytical thinking",
      "High motivation and dedication to learning",
      "Good physical fitness and motor coordination",
      "Positive attitude towards challenges"
    ],
    areasForImprovement: [
      "Reading comprehension in Social Studies",
      "Time management during examinations",
      "Creative writing and expression",
      "Collaborative learning and group work",
      "Stress management techniques"
    ],
    careerRecommendations: [
      "Engineering",
      "Computer Science",
      "Medical Sciences",
      "Research & Development",
      "Data Analytics",
      "Architecture"
    ],
    generatedAt: new Date().toISOString()
  };
}
