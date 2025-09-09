'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  AcademicCapIcon,
  UserIcon,
  HeartIcon,
  ArrowRightIcon,
  BrainIcon,
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  CpuChipIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  DownloadIcon,
  ShareIcon,
  PrinterIcon,
  StarIcon,
  TrendingUpIcon,
  MapIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { generatePDF } from '@/lib/pdf-generator';

interface ComprehensiveReportStageProps {
  studentName: string;
  studentAge: number;
  assessmentData: any;
  careerMatches: any[];
  aiInsights: any[];
  onComplete: (report: any) => void;
  onError: (error: string) => void;
}

export function ComprehensiveReportStage({
  studentName,
  studentAge,
  assessmentData,
  careerMatches,
  aiInsights,
  onComplete,
  onError
}: ComprehensiveReportStageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  const generateReport = useCallback(async () => {
    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const report = {
        id: `report_${Date.now()}`,
        studentName,
        studentAge,
        generatedAt: new Date().toISOString(),
        sections: {
          overview: {
            title: 'Executive Summary',
            content: generateOverviewContent()
          },
          academic: {
            title: 'Academic Performance Analysis',
            content: generateAcademicContent()
          },
          psychometric: {
            title: 'Psychological & Mental Health Assessment',
            content: generatePsychometricContent()
          },
          physical: {
            title: 'Physical Health & Development',
            content: generatePhysicalContent()
          },
          career: {
            title: 'Career Mapping & Recommendations',
            content: generateCareerContent()
          },
          insights: {
            title: 'AI-Powered Insights',
            content: generateInsightsContent()
          },
          recommendations: {
            title: 'Action Plan & Next Steps',
            content: generateRecommendationsContent()
          }
        },
        metadata: {
          totalSections: 7,
          dataPoints: Object.keys(assessmentData).length,
          confidence: calculateOverallConfidence(),
          references: getReferences()
        }
      };

      setReportData(report);
      toast.success('Comprehensive report generated successfully!');
      
    } catch (error) {
      toast.error('Report generation failed. Please try again.');
      onError('Report generation failed');
    } finally {
      setIsGenerating(false);
    }
  }, [studentName, studentAge, assessmentData, careerMatches, aiInsights, onError]);

  const generateOverviewContent = () => {
    return {
      summary: `This comprehensive assessment report provides a detailed analysis of ${studentName}'s academic performance, psychological profile, physical development, and career potential. The analysis is based on multiple data sources and AI-powered insights.`,
      keyFindings: [
        `Strong performance in ${getTopSubjects().join(' and ')}`,
        `Personality type: ${assessmentData.psychometric?.mbti?.type || 'Analyzing...'}`,
        `Top career matches: ${careerMatches.slice(0, 3).map(c => c.jobTitle).join(', ')}`,
        `Overall development score: ${calculateOverallScore()}%`
      ],
      recommendations: [
        'Focus on identified strengths to build confidence',
        'Address areas of improvement with targeted interventions',
        'Explore recommended career paths through internships or projects',
        'Continue monitoring progress with regular assessments'
      ]
    };
  };

  const generateAcademicContent = () => {
    return {
      performance: assessmentData.academic || {},
      strengths: getAcademicStrengths(),
      areasForImprovement: getAcademicWeaknesses(),
      recommendations: [
        'Maintain current performance in strong subjects',
        'Seek additional support in areas needing improvement',
        'Consider advanced coursework in areas of strength',
        'Develop study strategies tailored to learning style'
      ]
    };
  };

  const generatePsychometricContent = () => {
    return {
      bigFive: assessmentData.psychometric?.bigFive || {},
      mbti: assessmentData.psychometric?.mbti || {},
      learningStyle: assessmentData.psychometric?.learningStyle || {},
      strengths: getPsychometricStrengths(),
      insights: aiInsights.filter(insight => insight.domain === 'PSYCHOMETRIC'),
      recommendations: [
        'Leverage natural personality strengths in learning and career choices',
        'Develop skills that complement your personality type',
        'Consider environments that match your preferences',
        'Work on areas that need development through targeted activities'
      ]
    };
  };

  const generatePhysicalContent = () => {
    return {
      fitness: assessmentData.physical?.fitness || {},
      health: assessmentData.physical?.health || {},
      development: assessmentData.physical?.development || {},
      recommendations: [
        'Maintain regular physical activity',
        'Focus on areas needing improvement',
        'Consider sports or activities that match interests',
        'Monitor growth and development milestones'
      ]
    };
  };

  const generateCareerContent = () => {
    return {
      topMatches: careerMatches.slice(0, 5),
      allMatches: careerMatches,
      analysis: {
        bestFit: careerMatches[0],
        alternativePaths: careerMatches.slice(1, 4),
        longTermOptions: careerMatches.filter(c => c.priority === 'HIGH')
      },
      recommendations: [
        'Explore top career matches through research and shadowing',
        'Develop skills needed for preferred career paths',
        'Consider internships or volunteer work in relevant fields',
        'Build a portfolio showcasing relevant abilities'
      ]
    };
  };

  const generateInsightsContent = () => {
    return {
      insights: aiInsights,
      patterns: identifyPatterns(),
      predictions: generatePredictions(),
      recommendations: [
        'Monitor progress in identified growth areas',
        'Leverage AI insights for personalized learning',
        'Use predictions to guide future planning',
        'Regularly update assessment data for accuracy'
      ]
    };
  };

  const generateRecommendationsContent = () => {
    return {
      immediate: [
        'Review and understand all assessment results',
        'Discuss findings with parents/guardians',
        'Set specific goals based on recommendations',
        'Create a timeline for skill development'
      ],
      shortTerm: [
        'Begin working on identified skill gaps',
        'Explore career options through research',
        'Seek mentorship in areas of interest',
        'Join relevant clubs or activities'
      ],
      longTerm: [
        'Develop a comprehensive career plan',
        'Pursue relevant education and training',
        'Build professional networks',
        'Continuously monitor and adjust goals'
      ],
      timeline: generateTimeline()
    };
  };

  const getTopSubjects = () => {
    const academic = assessmentData.academic || {};
    return Object.entries(academic)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 2)
      .map(([subject]) => subject);
  };

  const getAcademicStrengths = () => {
    const academic = assessmentData.academic || {};
    return Object.entries(academic)
      .filter(([, score]) => (score as number) >= 80)
      .map(([subject]) => subject);
  };

  const getAcademicWeaknesses = () => {
    const academic = assessmentData.academic || {};
    return Object.entries(academic)
      .filter(([, score]) => (score as number) < 70)
      .map(([subject]) => subject);
  };

  const getPsychometricStrengths = () => {
    const bigFive = assessmentData.psychometric?.bigFive || {};
    return Object.entries(bigFive)
      .filter(([, score]) => (score as number) >= 0.7)
      .map(([trait]) => trait);
  };

  const calculateOverallScore = () => {
    const academic = assessmentData.academic || {};
    const scores = Object.values(academic) as number[];
    return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
  };

  const calculateOverallConfidence = () => {
    const insights = aiInsights || [];
    return insights.length > 0 
      ? Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length * 100)
      : 85;
  };

  const identifyPatterns = () => {
    return [
      'Consistent performance across multiple domains',
      'Strong analytical and problem-solving abilities',
      'Natural leadership tendencies',
      'Creative and innovative thinking patterns'
    ];
  };

  const generatePredictions = () => {
    return [
      'High potential for success in STEM fields',
      'Likely to excel in collaborative environments',
      'Strong aptitude for leadership roles',
      'Excellent prospects for continued academic growth'
    ];
  };

  const generateTimeline = () => {
    return {
      immediate: 'Next 3 months',
      shortTerm: '6-12 months',
      longTerm: '1-3 years',
      milestones: [
        'Complete skill development plan',
        'Explore career options',
        'Build relevant experience',
        'Make informed career decisions'
      ]
    };
  };

  const getReferences = () => {
    return [
      'Costa, P. T., & McCrae, R. R. (1992). NEO-PI-R Professional Manual',
      'Fleming, N. D., & Mills, C. (1992). VARK Learning Styles',
      'Kaggle Jobs and Skills Mapping Dataset',
      'Bureau of Labor Statistics Career Data',
      'WHO Physical Activity Guidelines'
    ];
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!reportData) return;

    setIsDownloading(true);
    try {
      await generatePDF(reportData, `${studentName}_Assessment_Report.pdf`);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  }, [reportData, studentName]);

  const handleComplete = useCallback(() => {
    onComplete(reportData);
  }, [reportData, onComplete]);

  const sections = [
    { id: 'overview', title: 'Overview', icon: EyeIcon },
    { id: 'academic', title: 'Academic', icon: AcademicCapIcon },
    { id: 'psychometric', title: 'Psychological', icon: BrainIcon },
    { id: 'physical', title: 'Physical', icon: HeartIcon },
    { id: 'career', title: 'Career', icon: MapIcon },
    { id: 'insights', title: 'AI Insights', icon: CpuChipIcon },
    { id: 'recommendations', title: 'Recommendations', icon: LightBulbIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <DocumentTextIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Comprehensive Assessment Report</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Detailed analysis and recommendations for {studentName}
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>Age: {studentAge}</span>
          <span>•</span>
          <span>Generated: {new Date().toLocaleDateString()}</span>
          <span>•</span>
          <span>AI-Enhanced Analysis</span>
        </div>
      </motion.div>

      {/* Report Generation */}
      {!reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg"
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
              <DocumentTextIcon className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Generate Comprehensive Report
              </h3>
              <p className="text-gray-600 mb-6">
                Create a detailed report combining all assessment data, career mappings, and AI insights.
              </p>
            </div>

            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Report Content */}
      {reportData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 shadow-lg"
        >
          {/* Report Header */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {studentName}'s Assessment Report
                </h2>
                <p className="text-gray-600">
                  Comprehensive analysis and personalized recommendations
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                </button>
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700"
                >
                  Complete Assessment
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeSection === section.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSectionContent(activeSection, reportData.sections[activeSection])}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function renderSectionContent(sectionId: string, content: any) {
  switch (sectionId) {
    case 'overview':
      return <OverviewSection content={content} />;
    case 'academic':
      return <AcademicSection content={content} />;
    case 'psychometric':
      return <PsychometricSection content={content} />;
    case 'physical':
      return <PhysicalSection content={content} />;
    case 'career':
      return <CareerSection content={content} />;
    case 'insights':
      return <InsightsSection content={content} />;
    case 'recommendations':
      return <RecommendationsSection content={content} />;
    default:
      return <div>Section not found</div>;
  }
}

// Section Components
const OverviewSection = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h3>
      <p className="text-gray-600 mb-6">{content.summary}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Key Findings</h4>
        <ul className="space-y-2">
          {content.keyFindings.map((finding: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircleIcon className="w-4 h-4 text-blue-600 mt-0.5" />
              <span className="text-blue-800">{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {content.recommendations.map((rec: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <LightBulbIcon className="w-4 h-4 text-green-600 mt-0.5" />
              <span className="text-green-800">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const AcademicSection = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">Academic Performance Analysis</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-3">Strengths</h4>
        <div className="space-y-2">
          {content.strengths.map((strength: string, index: number) => (
            <span key={index} className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {strength}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-6">
        <h4 className="font-semibold text-yellow-900 mb-3">Areas for Improvement</h4>
        <div className="space-y-2">
          {content.areasForImprovement.map((area: string, index: number) => (
            <span key={index} className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {area}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Recommendations</h4>
        <ul className="space-y-2">
          {content.recommendations.map((rec: string, index: number) => (
            <li key={index} className="text-blue-800 text-sm">• {rec}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const PsychometricSection = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">Psychological & Mental Health Assessment</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-purple-50 rounded-lg p-6">
        <h4 className="font-semibold text-purple-900 mb-3">Personality Profile</h4>
        <div className="space-y-3">
          {Object.entries(content.bigFive).map(([trait, score]) => (
            <div key={trait} className="flex items-center justify-between">
              <span className="text-purple-800 capitalize">{trait}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(score as number) * 100}%` }}
                  />
                </div>
                <span className="text-purple-800 text-sm">{Math.round((score as number) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-6">
        <h4 className="font-semibold text-indigo-900 mb-3">Strengths</h4>
        <div className="space-y-2">
          {content.strengths.map((strength: string, index: number) => (
            <span key={index} className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {strength}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PhysicalSection = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">Physical Health & Development</h3>
    
    <div className="bg-red-50 rounded-lg p-6">
      <h4 className="font-semibold text-red-900 mb-3">Recommendations</h4>
      <ul className="space-y-2">
        {content.recommendations.map((rec: string, index: number) => (
          <li key={index} className="flex items-start space-x-2">
            <HeartIcon className="w-4 h-4 text-red-600 mt-0.5" />
            <span className="text-red-800">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const CareerSection = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">Career Mapping & Recommendations</h3>
    
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-800">Top Career Matches</h4>
      {content.topMatches.map((match: any, index: number) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-semibold text-gray-900">{match.jobTitle}</h5>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {Math.round(match.matchScore * 100)}% match
            </span>
          </div>
          <p className="text-gray-600 text-sm">{match.reasoning}</p>
        </div>
      ))}
    </div>
  </div>
);

const InsightsSection = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">Identified Patterns</h4>
        <ul className="space-y-2">
          {content.patterns.map((pattern: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <ChartBarIcon className="w-4 h-4 text-blue-600 mt-0.5" />
              <span className="text-blue-800">{pattern}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-3">Future Predictions</h4>
        <ul className="space-y-2">
          {content.predictions.map((prediction: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <TrendingUpIcon className="w-4 h-4 text-green-600 mt-0.5" />
              <span className="text-green-800">{prediction}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const RecommendationsSection = ({ content }: { content: any }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">Action Plan & Next Steps</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-red-50 rounded-lg p-6">
        <h4 className="font-semibold text-red-900 mb-3">Immediate (Next 3 months)</h4>
        <ul className="space-y-2">
          {content.immediate.map((item: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <ClockIcon className="w-4 h-4 text-red-600 mt-0.5" />
              <span className="text-red-800 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-yellow-50 rounded-lg p-6">
        <h4 className="font-semibold text-yellow-900 mb-3">Short-term (6-12 months)</h4>
        <ul className="space-y-2">
          {content.shortTerm.map((item: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <CalendarIcon className="w-4 h-4 text-yellow-600 mt-0.5" />
              <span className="text-yellow-800 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-green-900 mb-3">Long-term (1-3 years)</h4>
        <ul className="space-y-2">
          {content.longTerm.map((item: string, index: number) => (
            <li key={index} className="flex items-start space-x-2">
              <RocketLaunchIcon className="w-4 h-4 text-green-600 mt-0.5" />
              <span className="text-green-800 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
