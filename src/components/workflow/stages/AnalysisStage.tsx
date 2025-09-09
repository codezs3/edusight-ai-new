'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  SparklesIcon, 
  ChartBarIcon,
  UserIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { StudentProfile, AnalysisResult, PredictionData, CareerRecommendation } from '@/types/assessment';
import { toast } from 'react-hot-toast';

interface AnalysisStageProps {
  studentProfile: StudentProfile | null;
  workflowConfig?: any;
  onComplete: (result: AnalysisResult) => void;
  onError: (error: string) => void;
}

export function AnalysisStage({ studentProfile, workflowConfig, onComplete, onError }: AnalysisStageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const analyzeStudent = useCallback(async () => {
    if (!studentProfile) {
      onError('No student profile provided');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentStep('Initializing analysis...');

    try {
      // Simulate analysis steps
      const steps = [
        'Calculating academic performance metrics...',
        'Analyzing psychometric profile...',
        'Processing skill assessments...',
        'Generating comparative analysis...',
        'Creating predictive models...',
        'Mapping personality traits...',
        'Generating career recommendations...',
        'Finalizing insights...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i]);
        setAnalysisProgress((i + 1) * 12.5);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Generate analysis result
      const result = await generateAnalysisResult(studentProfile);
      onComplete(result);
    } catch (error) {
      onError('Analysis failed: ' + (error as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [studentProfile, onComplete, onError]);

  const generateAnalysisResult = async (profile: StudentProfile): Promise<AnalysisResult> => {
    // Calculate academic score
    const academicScore = profile.academicData.length > 0 
      ? profile.academicData.reduce((sum, item) => sum + (item.score / item.maxScore) * 100, 0) / profile.academicData.length
      : 0;

    // Calculate psychometric score
    const psychometricScore = profile.psychometricData.length > 0
      ? profile.psychometricData.reduce((sum, item) => sum + (item.score / item.maxScore) * 100, 0) / profile.psychometricData.length
      : 0;

    // Calculate skill score
    const skillScore = profile.skills.length > 0
      ? profile.skills.reduce((sum, skill) => {
          const levelScores = { BEGINNER: 25, INTERMEDIATE: 50, ADVANCED: 75, EXPERT: 100 };
          return sum + levelScores[skill.level];
        }, 0) / profile.skills.length
      : 0;

    // Calculate overall score
    const overallScore = (academicScore * 0.4 + psychometricScore * 0.3 + skillScore * 0.3);

    // Generate predictions
    const academicTrajectory: PredictionData[] = [
      { period: 'Next 6 months', predictedScore: Math.min(100, academicScore + 5), confidence: 0.85, factors: ['Consistent study habits', 'Regular assessments'] },
      { period: 'Next year', predictedScore: Math.min(100, academicScore + 10), confidence: 0.75, factors: ['Skill development', 'Experience growth'] },
      { period: 'Next 2 years', predictedScore: Math.min(100, academicScore + 15), confidence: 0.65, factors: ['Advanced learning', 'Specialization'] }
    ];

    const skillDevelopment: PredictionData[] = [
      { period: 'Next 6 months', predictedScore: Math.min(100, skillScore + 8), confidence: 0.80, factors: ['Practice', 'Feedback'] },
      { period: 'Next year', predictedScore: Math.min(100, skillScore + 15), confidence: 0.70, factors: ['Projects', 'Mentorship'] },
      { period: 'Next 2 years', predictedScore: Math.min(100, skillScore + 25), confidence: 0.60, factors: ['Advanced training', 'Real-world experience'] }
    ];

    // Generate career recommendations
    const careerRecommendations: CareerRecommendation[] = generateCareerRecommendations(profile, overallScore);

    // Determine performance band
    let performanceBand: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
    if (overallScore >= 85) performanceBand = 'EXCELLENT';
    else if (overallScore >= 70) performanceBand = 'GOOD';
    else if (overallScore >= 55) performanceBand = 'AVERAGE';
    else performanceBand = 'NEEDS_IMPROVEMENT';

    // Generate strengths and areas for improvement
    const strengths = generateStrengths(profile, academicScore, psychometricScore, skillScore);
    const areasForImprovement = generateAreasForImprovement(profile, academicScore, psychometricScore, skillScore);

    return {
      overallScore: Math.round(overallScore),
      academicScore: Math.round(academicScore),
      psychometricScore: Math.round(psychometricScore),
      physicalScore: 75, // Default for now
      skillScore: Math.round(skillScore),
      
      schoolAverage: Math.round(academicScore + 5),
      districtAverage: Math.round(academicScore + 8),
      stateAverage: Math.round(academicScore + 12),
      nationalAverage: Math.round(academicScore + 15),
      
      performanceBand,
      percentile: Math.round(overallScore),
      
      academicTrajectory,
      skillDevelopment,
      psychometricEvolution: academicTrajectory, // Reuse for now
      
      personalityType: 'Analytical Thinker',
      mbtiType: 'INTJ',
      bigFiveProfile: {
        openness: 75,
        conscientiousness: 80,
        extraversion: 45,
        agreeableness: 70,
        neuroticism: 30
      },
      
      careerRecommendations,
      
      strengths,
      areasForImprovement,
      learningStyle: 'Visual and Kinesthetic',
      studyRecommendations: [
        'Use visual aids and diagrams for complex concepts',
        'Practice with hands-on activities and experiments',
        'Create mind maps for better retention',
        'Join study groups for collaborative learning'
      ]
    };
  };

  const generateCareerRecommendations = (profile: StudentProfile, overallScore: number): CareerRecommendation[] => {
    const baseCareers = [
      {
        career: 'Software Engineer',
        matchScore: 85,
        requiredSkills: ['Programming', 'Problem Solving', 'Mathematics'],
        skillGaps: ['Communication', 'Teamwork'],
        educationPath: ['Computer Science Degree', 'Coding Bootcamp'],
        certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
        industryOutlook: 'GROWING' as const,
        salaryRange: '$70,000 - $150,000',
        description: 'Design and develop software applications and systems.'
      },
      {
        career: 'Data Scientist',
        matchScore: 80,
        requiredSkills: ['Data Analysis', 'Mathematics', 'Statistics'],
        skillGaps: ['Business Acumen', 'Communication'],
        educationPath: ['Data Science Degree', 'Statistics Background'],
        certifications: ['Certified Analytics Professional', 'Microsoft Azure Data Scientist'],
        industryOutlook: 'GROWING' as const,
        salaryRange: '$80,000 - $160,000',
        description: 'Extract insights from data to drive business decisions.'
      },
      {
        career: 'Research Scientist',
        matchScore: 75,
        requiredSkills: ['Critical Thinking', 'Research', 'Writing'],
        skillGaps: ['Project Management', 'Presentation Skills'],
        educationPath: ['PhD in relevant field', 'Research Experience'],
        certifications: ['Research Methodology', 'Academic Writing'],
        industryOutlook: 'STABLE' as const,
        salaryRange: '$60,000 - $120,000',
        description: 'Conduct research in academic or industry settings.'
      }
    ];

    return baseCareers.map(career => ({
      ...career,
      matchScore: Math.min(100, career.matchScore + (overallScore - 70) / 2)
    }));
  };

  const generateStrengths = (profile: StudentProfile, academic: number, psychometric: number, skill: number): string[] => {
    const strengths = [];
    
    if (academic >= 80) strengths.push('Strong academic performance');
    if (psychometric >= 75) strengths.push('Good emotional intelligence');
    if (skill >= 70) strengths.push('Well-developed skills');
    if (profile.skills.some(s => s.category === 'TECHNICAL')) strengths.push('Technical aptitude');
    if (profile.skills.some(s => s.category === 'LEADERSHIP')) strengths.push('Leadership potential');
    if (profile.extracurriculars.length > 0) strengths.push('Active in extracurricular activities');
    
    return strengths.length > 0 ? strengths : ['Consistent effort and dedication'];
  };

  const generateAreasForImprovement = (profile: StudentProfile, academic: number, psychometric: number, skill: number): string[] => {
    const areas = [];
    
    if (academic < 70) areas.push('Academic performance');
    if (psychometric < 65) areas.push('Emotional intelligence');
    if (skill < 60) areas.push('Skill development');
    if (profile.skills.filter(s => s.category === 'SOFT').length === 0) areas.push('Soft skills');
    if (profile.extracurriculars.length === 0) areas.push('Extracurricular participation');
    
    return areas.length > 0 ? areas : ['Continue current development trajectory'];
  };

  useEffect(() => {
    if (studentProfile) {
      analyzeStudent();
    }
  }, [studentProfile, analyzeStudent]);

  if (!studentProfile) {
    return (
      <div className="text-center py-8">
        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Profile</h3>
        <p className="text-gray-600">Please complete the previous steps to continue with analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAnalyzing ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-6">
            <SparklesIcon className="h-16 w-16 text-blue-600 animate-pulse" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Analyzing Student Profile
          </h3>
          
          <p className="text-lg text-gray-600 mb-6">
            {currentStep}
          </p>
          
          <div className="w-full max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {Math.round(analysisProgress)}% Complete
            </p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Academic Analysis</p>
            </div>
            <div className="text-center">
              <UserIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Personality Profiling</p>
            </div>
            <div className="text-center">
              <LightBulbIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Career Mapping</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Analysis Complete!
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Your comprehensive 360° analysis is ready.
          </p>
          <button
            onClick={() => {
              // This will be handled by the parent component
              toast.success('Analysis completed successfully!');
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue to Report Generation
          </button>
        </div>
      )}
    </div>
  );
}
