'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentArrowDownIcon,
  StarIcon,
  TrophyIcon,
  ChartBarIcon,
  AcademicCapIcon,
  HeartIcon,
  EyeIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  GlobeAltIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { Logo } from '@/components/ui/Logo';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  studentName: string;
  framework: string;
  academicData: any;
  skillsAssessment: any;
  psychologicalAssessment: any;
  physicalAssessment: any;
  eduSightScore: number;
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
  careerRecommendations: string[];
  generatedAt: string;
}

interface ComprehensiveReportProps {
  data: ReportData;
  canDownloadPDF?: boolean;
  isDemo?: boolean;
  onUpgrade?: () => void;
}

export default function ComprehensiveReport({ 
  data, 
  canDownloadPDF = false, 
  isDemo = false,
  onUpgrade 
}: ComprehensiveReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Create PDF with high quality
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Add multiple pages if content is long
      const pageHeight = imgHeight * ratio;
      let heightLeft = pageHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, pageHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, pageHeight);
        heightLeft -= pdfHeight;
      }

      // Save the PDF
      const fileName = `EduSight_Report_${data.studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Download Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comprehensive Assessment Report</h1>
            <p className="text-gray-600 mt-2">Generated on {new Date(data.generatedAt).toLocaleDateString()}</p>
          </div>
          
          <div className="flex space-x-4">
            {canDownloadPDF || isDemo ? (
              <motion.button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  isGeneratingPDF
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
                whileHover={{ scale: isGeneratingPDF ? 1 : 1.05 }}
                whileTap={{ scale: isGeneratingPDF ? 1 : 0.95 }}
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={onUpgrade}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrophyIcon className="w-5 h-5" />
                <span>Upgrade to Download</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section with Branding */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white p-3 rounded-xl">
                  <Logo size="lg" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">EduSight 360° Assessment Report</h1>
                  <p className="text-blue-100 mt-1">Comprehensive Educational Analysis & Insights</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-4xl font-bold">{data.eduSightScore}</div>
                  <div className="text-sm text-blue-100">Overall Score</div>
                  <div className="text-lg font-semibold">{getScoreGrade(data.eduSightScore)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <UserIcon className="w-6 h-6 mr-3 text-blue-600" />
              Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-600">Student Name</div>
                    <div className="font-semibold text-gray-900">{data.studentName}</div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm text-purple-600">Educational Framework</div>
                    <div className="font-semibold text-gray-900">{data.framework}</div>
                  </div>
                </div>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-cyan-600" />
                  <div>
                    <div className="text-sm text-cyan-600">Assessment Date</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(data.generatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EduSight 360° Score Breakdown */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <StarIcon className="w-6 h-6 mr-3 text-yellow-500" />
              EduSight 360° Score Breakdown
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <ScoreCard 
                title="Academic Performance"
                score={data.academicData?.averageScore || 0}
                icon={BookOpenIcon}
                color="blue"
              />
              <ScoreCard 
                title="Skills Assessment"
                score={data.skillsAssessment?.overallScore || 0}
                icon={LightBulbIcon}
                color="purple"
              />
              <ScoreCard 
                title="Physical Development"
                score={85} // Placeholder
                icon={HeartIcon}
                color="green"
              />
              <ScoreCard 
                title="Psychological Wellbeing"
                score={82} // Placeholder
                icon={EyeIcon}
                color="cyan"
              />
            </div>

            {/* Overall Score Visualization */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(data.eduSightScore * 314) / 100} 314`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(data.eduSightScore)}`}>
                        {data.eduSightScore}
                      </div>
                      <div className="text-sm text-gray-500">Overall Score</div>
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-2">
                  {getScoreGrade(data.eduSightScore)}
                </div>
                <p className="text-gray-600 text-sm max-w-md mx-auto">
                  This comprehensive score reflects your child's performance across academic, 
                  skill-based, physical, and psychological dimensions.
                </p>
              </div>
            </div>
          </div>

          {/* Academic Analysis */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-3 text-blue-600" />
              Academic Performance Analysis
            </h2>
            
            {data.academicData?.subjectScores && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(data.academicData.subjectScores).map(([subject, score]: [string, any]) => (
                  <div key={subject} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 capitalize">{subject}</span>
                      <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  Key Strengths
                </h3>
                <div className="space-y-3">
                  {data.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-green-50 rounded-lg p-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-900">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {data.areasForImprovement.map((area, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-blue-50 rounded-lg p-3">
                      <LightBulbIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-900">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <LightBulbIcon className="w-6 h-6 mr-3 text-yellow-500" />
              Personalized Recommendations
            </h2>
            <div className="space-y-4">
              {data.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-900">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Recommendations */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrophyIcon className="w-6 h-6 mr-3 text-purple-600" />
              Career Path Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.careerRecommendations.map((career, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrophyIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{career}</h4>
                  <p className="text-sm text-gray-600">Based on your skills and interests</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer with Branding */}
          <div className="bg-gray-900 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Logo size="md" />
                <div>
                  <h3 className="text-lg font-bold">EduSight</h3>
                  <p className="text-gray-400 text-sm">AI-Powered Educational Analytics</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Generated on {new Date(data.generatedAt).toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Visit us at www.edusight.com</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm">
                This report is confidential and intended solely for educational purposes. 
                For questions or support, contact us at support@edusight.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'purple' | 'green' | 'cyan';
}

function ScoreCard({ title, score, icon: Icon, color }: ScoreCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-600'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <h4 className="font-medium text-gray-900">{title}</h4>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${
            color === 'blue' ? 'bg-blue-500' :
            color === 'purple' ? 'bg-purple-500' :
            color === 'green' ? 'bg-green-500' :
            'bg-cyan-500'
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}
