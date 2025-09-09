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
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StarIcon,
  ClockIcon,
  TrendingUpIcon,
  MapIcon,
  RocketLaunchIcon,
  BookOpenIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { 
  CareerMatch,
  PersonalityProfile,
  calculateCareerMatches,
  JOB_SKILL_MAPPINGS,
  SKILL_DEFINITIONS
} from '@/lib/career-mapping-data';

interface CareerMappingStageProps {
  studentAge: number;
  studentName: string;
  assessmentData: any;
  onComplete: (results: CareerMatch[]) => void;
  onError: (error: string) => void;
}

export function CareerMappingStage({
  studentAge,
  studentName,
  assessmentData,
  onComplete,
  onError
}: CareerMappingStageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerMatch | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Convert assessment data to personality profile
  const convertToPersonalityProfile = useCallback((data: any): PersonalityProfile => {
    return {
      bigFive: {
        openness: data.psychometric?.bigFive?.openness || 0.5,
        conscientiousness: data.psychometric?.bigFive?.conscientiousness || 0.5,
        extraversion: data.psychometric?.bigFive?.extraversion || 0.5,
        agreeableness: data.psychometric?.bigFive?.agreeableness || 0.5,
        neuroticism: data.psychometric?.bigFive?.neuroticism || 0.5
      },
      mbti: data.psychometric?.mbti,
      skills: data.skills || {},
      interests: data.interests || [],
      values: data.values || [],
      academicPerformance: data.academic || {}
    };
  }, []);

  const performCareerAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Convert assessment data to personality profile
      const profile = convertToPersonalityProfile(assessmentData);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Calculate career matches
      const matches = calculateCareerMatches(profile, JOB_SKILL_MAPPINGS);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setCareerMatches(matches);
      toast.success('Career analysis completed successfully!');
      
    } catch (error) {
      toast.error('Career analysis failed. Please try again.');
      onError('Career analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [assessmentData, convertToPersonalityProfile, onError]);

  const handleCareerSelect = useCallback((career: CareerMatch) => {
    setSelectedCareer(career);
    setShowDetails(true);
  }, []);

  const handleComplete = useCallback(() => {
    onComplete(careerMatches);
  }, [careerMatches, onComplete]);

  const getMatchColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchIcon = (score: number) => {
    if (score >= 0.8) return StarIcon;
    if (score >= 0.6) return TrendingUpIcon;
    return ExclamationTriangleIcon;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100 border-red-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <MapIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Career Mapping</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover personalized career paths for {studentName} based on comprehensive assessment data
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>Age: {studentAge}</span>
          <span>•</span>
          <span>AI-Enhanced Analysis</span>
          <span>•</span>
          <span>Data-Driven Recommendations</span>
        </div>
      </motion.div>

      {/* Analysis Section */}
      {!isAnalyzing && careerMatches.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg"
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <RocketLaunchIcon className="w-10 h-10 text-purple-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready for Career Analysis
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI will analyze {studentName}'s profile against thousands of career paths to find the best matches.
              </p>
            </div>

            {/* Analysis Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <BrainIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-900">AI Analysis</h4>
                <p className="text-sm text-blue-700">Advanced algorithms match personality and skills</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <ChartBarIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-green-900">Data-Driven</h4>
                <p className="text-sm text-green-700">Based on real job market data and trends</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <LightBulbIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-purple-900">Personalized</h4>
                <p className="text-sm text-purple-700">Tailored recommendations for your unique profile</p>
              </div>
            </div>

            <button
              onClick={performCareerAnalysis}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>Start Career Analysis</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg"
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <CpuChipIcon className="w-10 h-10 text-purple-600 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing Career Matches
              </h3>
              <p className="text-gray-600 mb-4">
                Our AI is processing {studentName}'s profile against career databases...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Analysis Progress</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Analysis Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Profile Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Skill Matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="text-gray-600">Career Ranking</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Career Results */}
      {careerMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Results Header */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Career Matches Found
                </h3>
                <p className="text-gray-600">
                  {careerMatches.length} career paths matched for {studentName}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {careerMatches.length}
                </div>
                <div className="text-sm text-gray-500">Matches</div>
              </div>
            </div>
          </div>

          {/* Career Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerMatches.slice(0, 6).map((career, index) => {
              const MatchIcon = getMatchIcon(career.matchScore);
              return (
                <motion.div
                  key={career.jobId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCareerSelect(career)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {career.jobTitle}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {career.reasoning}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(career.matchScore)}`}>
                      {Math.round(career.matchScore * 100)}% match
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Match Score */}
                    <div className="flex items-center space-x-2">
                      <MatchIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Match Score</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${career.matchScore * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(career.priority)}`}>
                        {career.priority}
                      </span>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{career.timeline}</span>
                    </div>

                    {/* Key Strengths */}
                    {career.strengths.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Strengths:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {career.strengths.slice(0, 2).map((strength, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {Math.round(career.confidence * 100)}% confidence
                      </span>
                      <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowDetails(true)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              View All Details
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700"
            >
              Complete Analysis
            </button>
          </div>
        </motion.div>
      )}

      {/* Career Details Modal */}
      <AnimatePresence>
        {showDetails && selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCareer.jobTitle} - Detailed Analysis
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Match Score */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Match Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Match Score:</span>
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(selectedCareer.matchScore * 100)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(selectedCareer.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why This Career Matches</h4>
                  <p className="text-gray-600">{selectedCareer.reasoning}</p>
                </div>

                {/* Strengths */}
                {selectedCareer.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Your Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.strengths.map((strength, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gaps */}
                {selectedCareer.gaps.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Areas to Develop</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.gaps.map((gap, i) => (
                        <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {selectedCareer.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mt-0.5" />
                        <span className="text-gray-600">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Development Timeline</h4>
                  <p className="text-blue-800">{selectedCareer.timeline}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
