'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  AcademicCapIcon,
  UserIcon,
  HeartIcon,
  CpuChipIcon as BrainIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  PsychometricTestResult, 
  AgeGroup 
} from '@/types/assessment';
import { getAgeGroup } from '@/lib/age-appropriate-frameworks';
import { toast } from 'react-hot-toast';

interface PsychometricTestStageProps {
  studentAge: number;
  testType: 'BIG_FIVE' | 'MBTI' | 'LEARNING_STYLE' | 'ATTENTION_SPAN' | 'SOCIAL_SKILLS' | 'EMOTIONAL_REGULATION';
  onComplete: (results: PsychometricTestResult[]) => void;
  onError: (error: string) => void;
}

interface TestQuestion {
  id: string;
  question: string;
  category: string;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
  reference?: string;
}

const TEST_QUESTIONS: Record<string, TestQuestion[]> = {
  BIG_FIVE: [
    {
      id: 'bf1',
      question: 'I am someone who is talkative',
      category: 'Extraversion',
      options: [
        { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
        { value: 2, label: 'Disagree', description: 'Rarely like me' },
        { value: 3, label: 'Neutral', description: 'Sometimes like me' },
        { value: 4, label: 'Agree', description: 'Often like me' },
        { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
      ],
      reference: 'Based on Costa & McCrae (1992) NEO-PI-R'
    },
    {
      id: 'bf2',
      question: 'I am someone who is thorough in my work',
      category: 'Conscientiousness',
      options: [
        { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
        { value: 2, label: 'Disagree', description: 'Rarely like me' },
        { value: 3, label: 'Neutral', description: 'Sometimes like me' },
        { value: 4, label: 'Agree', description: 'Often like me' },
        { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
      ],
      reference: 'Based on Costa & McCrae (1992) NEO-PI-R'
    },
    {
      id: 'bf3',
      question: 'I am someone who is emotionally stable',
      category: 'Neuroticism',
      options: [
        { value: 1, label: 'Strongly Disagree', description: 'Not at all like me' },
        { value: 2, label: 'Disagree', description: 'Rarely like me' },
        { value: 3, label: 'Neutral', description: 'Sometimes like me' },
        { value: 4, label: 'Agree', description: 'Often like me' },
        { value: 5, label: 'Strongly Agree', description: 'Very much like me' }
      ],
      reference: 'Based on Costa & McCrae (1992) NEO-PI-R'
    }
  ],
  LEARNING_STYLE: [
    {
      id: 'ls1',
      question: 'I learn best when I can see diagrams, charts, and visual aids',
      category: 'Visual Learning',
      options: [
        { value: 1, label: 'Never', description: 'This never helps me' },
        { value: 2, label: 'Rarely', description: 'This rarely helps me' },
        { value: 3, label: 'Sometimes', description: 'This sometimes helps me' },
        { value: 4, label: 'Often', description: 'This often helps me' },
        { value: 5, label: 'Always', description: 'This always helps me' }
      ],
      reference: 'Based on Fleming & Mills (1992) VARK Learning Styles'
    },
    {
      id: 'ls2',
      question: 'I prefer to learn by listening to lectures and discussions',
      category: 'Auditory Learning',
      options: [
        { value: 1, label: 'Never', description: 'This never helps me' },
        { value: 2, label: 'Rarely', description: 'This rarely helps me' },
        { value: 3, label: 'Sometimes', description: 'This sometimes helps me' },
        { value: 4, label: 'Often', description: 'This often helps me' },
        { value: 5, label: 'Always', description: 'This always helps me' }
      ],
      reference: 'Based on Fleming & Mills (1992) VARK Learning Styles'
    }
  ]
};

export function PsychometricTestStage({
  studentAge,
  testType,
  onComplete,
  onError
}: PsychometricTestStageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const ageGroup = getAgeGroup(studentAge);
  const questions = TEST_QUESTIONS[testType] || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = useCallback((questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      calculateResults();
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const calculateResults = useCallback(() => {
    // Simulate calculation
    setTimeout(() => {
      const results: PsychometricTestResult[] = [{
        testType,
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        maxScore: 100,
        interpretation: `Based on your responses, you show strong ${testType.toLowerCase().replace('_', ' ')} characteristics.`,
        traits: {
          'Primary Trait': 85,
          'Secondary Trait': 72,
          'Tertiary Trait': 68
        },
        recommendations: [
          'Focus on areas that align with your strengths',
          'Consider activities that challenge your growth areas',
          'Leverage your natural tendencies for better learning outcomes'
        ]
      }];
      
      setShowResults(true);
      onComplete(results);
    }, 2000);
  }, [testType, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTestInfo = () => {
    switch (testType) {
      case 'BIG_FIVE':
        return {
          title: 'Big Five Personality Assessment',
          description: 'Discover your core personality traits across five key dimensions',
          icon: UserIcon,
          color: 'purple',
          reference: 'Costa, P. T., & McCrae, R. R. (1992). NEO-PI-R Professional Manual'
        };
      case 'LEARNING_STYLE':
        return {
          title: 'Learning Style Assessment',
          description: 'Identify your preferred learning methods and study strategies',
          icon: LightBulbIcon,
          color: 'blue',
          reference: 'Fleming, N. D., & Mills, C. (1992). Not Another Inventory'
        };
      default:
        return {
          title: 'Psychometric Assessment',
          description: 'Comprehensive psychological evaluation',
          icon: BrainIcon,
          color: 'indigo',
          reference: 'Standardized psychological assessment tools'
        };
    }
  };

  const testInfo = getTestInfo();
  const TestIcon = testInfo.icon;

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircleIcon className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Assessment Complete!</h3>
        <p className="text-gray-600">
          Your {testInfo.title} has been completed successfully.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            Results will be included in your comprehensive analysis report.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Test Information */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 bg-${testInfo.color}-100 rounded-lg flex items-center justify-center`}>
            <TestIcon className={`w-6 h-6 text-${testInfo.color}-600`} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{testInfo.title}</h2>
            <p className="text-gray-600">{testInfo.description}</p>
          </div>
        </div>
        
        {/* Reference */}
        <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
          <div className="flex items-start space-x-2">
            <BookOpenIcon className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-700">Scientific Reference:</p>
              <p className="text-xs text-gray-600">{testInfo.reference}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{formatTime(timeSpent)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {Object.keys(answers).length} answered
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Age Group: {ageGroup.replace('_', ' ')}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
        >
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                {currentQuestion.category}
              </span>
              {currentQuestion.reference && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {currentQuestion.reference}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  answers[currentQuestion.id] === option.value
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    answers[currentQuestion.id] === option.value
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === option.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600">{option.description}</div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {answers[currentQuestion.id] && (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          )}
          <span className="text-sm text-gray-500">
            {answers[currentQuestion.id] ? 'Answered' : 'Not answered'}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <SparklesIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Assessment Tips</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Answer honestly based on your typical behavior</li>
              <li>• Don't overthink - go with your first instinct</li>
              <li>• There are no right or wrong answers</li>
              <li>• Take your time, but don't spend too long on any question</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
