'use client';

import React, { useState, useCallback } from 'react';
import { 
  DocumentArrowDownIcon, 
  EyeIcon,
  PrinterIcon,
  ShareIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StudentProfile, AnalysisResult } from '@/types/assessment';
import { toast } from 'react-hot-toast';

interface ReportGenerationStageProps {
  studentProfile: StudentProfile | null;
  analysisResult: AnalysisResult | null;
  workflowConfig?: any;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function ReportGenerationStage({ 
  studentProfile, 
  analysisResult, 
  workflowConfig,
  onComplete, 
  onError 
}: ReportGenerationStageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const generateReport = useCallback(async () => {
    if (!studentProfile || !analysisResult) {
      onError('Missing student profile or analysis result');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep('Initializing report generation...');

    try {
      const steps = [
        'Creating report structure...',
        'Generating academic performance charts...',
        'Creating psychometric profile visualizations...',
        'Building comparative analysis graphs...',
        'Generating prediction models...',
        'Creating career recommendation sections...',
        'Applying branding and styling...',
        'Finalizing PDF document...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setGenerationProgress((i + 1) * 12.5);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Generate the actual PDF report
      const reportData = await createPDFReport(studentProfile, analysisResult);
      setReportUrl(reportData.url);
      
      onComplete({ reportUrl: reportData.url, reportData });
      toast.success('Report generated successfully!');
    } catch (error) {
      onError('Report generation failed: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }, [studentProfile, analysisResult, onComplete, onError]);

  const createPDFReport = async (profile: StudentProfile, result: AnalysisResult) => {
    // This would integrate with a PDF generation service
    // For now, we'll simulate the process
    
    const reportData = {
      studentName: profile.name,
      reportDate: new Date().toISOString(),
      overallScore: result.overallScore,
      academicScore: result.academicScore,
      psychometricScore: result.psychometricScore,
      skillScore: result.skillScore,
      performanceBand: result.performanceBand,
      careerRecommendations: result.careerRecommendations,
      strengths: result.strengths,
      areasForImprovement: result.areasForImprovement,
      personalityType: result.personalityType,
      mbtiType: result.mbtiType,
      bigFiveProfile: result.bigFiveProfile,
      academicTrajectory: result.academicTrajectory,
      skillDevelopment: result.skillDevelopment,
      studyRecommendations: result.studyRecommendations
    };

    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      url: `/api/reports/download/${profile.id}`,
      filename: `Edusight360_Report_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      data: reportData
    };
  };

  const handleDownload = useCallback(() => {
    if (reportUrl) {
      const link = document.createElement('a');
      link.href = reportUrl;
      link.download = `Edusight360_Report_${studentProfile?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report downloaded successfully!');
    }
  }, [reportUrl, studentProfile]);

  const handlePrint = useCallback(() => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
      toast.success('Report opened for printing!');
    }
  }, [reportUrl]);

  const handleShare = useCallback(() => {
    if (navigator.share && reportUrl) {
      navigator.share({
        title: 'Edusight 360° Assessment Report',
        text: `Check out my comprehensive 360° assessment report!`,
        url: reportUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(reportUrl || '');
      toast.success('Report link copied to clipboard!');
    }
  }, [reportUrl]);

  React.useEffect(() => {
    if (studentProfile && analysisResult && !reportUrl) {
      generateReport();
    }
  }, [studentProfile, analysisResult, reportUrl, generateReport]);

  if (!studentProfile || !analysisResult) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Missing Data</h3>
        <p className="text-gray-600">Please complete the analysis before generating the report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isGenerating ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-16 w-16 text-purple-600 animate-pulse" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Generating Your 360° Report
          </h3>
          
          <p className="text-lg text-gray-600 mb-6">
            {currentStep}
          </p>
          
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {Math.round(generationProgress)}% Complete
            </p>
          </div>
          
          <div className="mt-8 text-sm text-gray-600">
            <p>Creating a comprehensive 10-page report with:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 max-w-lg mx-auto">
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                Academic Performance Analysis
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                Psychometric Profiling
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                Career Recommendations
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                Prediction Models
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Message */}
          <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
            <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Report Generated Successfully!
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Your comprehensive Edusight 360° assessment report is ready.
            </p>
          </div>

          {/* Report Preview */}
          <div className="bg-white border rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Report Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Student Information</h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {studentProfile.name}</p>
                  <p><strong>Grade:</strong> {studentProfile.grade}</p>
                  <p><strong>School:</strong> {studentProfile.school}</p>
                  <p><strong>Board:</strong> {studentProfile.board}</p>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Key Metrics</h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Overall Score:</strong> {analysisResult.overallScore}%</p>
                  <p><strong>Academic Score:</strong> {analysisResult.academicScore}%</p>
                  <p><strong>Performance Band:</strong> {analysisResult.performanceBand}</p>
                  <p><strong>Personality Type:</strong> {analysisResult.personalityType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Download PDF
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print Report
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              Share Report
            </button>
          </div>

          {/* Report Features */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Report Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Academic Performance Summary
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Psychometric Profile Analysis
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Comparative Analytics
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Prediction Models
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Career Recommendations
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Personality Mapping
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Skill Development Plan
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Study Recommendations
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Professional Branding
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                  Data Privacy Compliance
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
