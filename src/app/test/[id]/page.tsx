'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  FlagIcon,
  AcademicCapIcon,
  BrainIcon,
  HeartIcon,
  BeakerIcon,
  ChartBarIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import {
  ClockIcon as ClockSolidIcon,
  PlayIcon as PlaySolidIcon,
  PauseIcon as PauseSolidIcon
} from '@heroicons/react/24/solid';

interface Question {
  id: number;
  question: string;
  type: 'multiple_choice' | 'single_choice' | 'text' | 'rating' | 'boolean';
  options?: string[];
  required: boolean;
  category?: string;
}

interface TestData {
  id: number;
  title: string;
  description: string;
  duration: number; // in minutes
  total_questions: number;
  assessment_type: string;
  difficulty: string;
  questions: Question[];
  instructions: string[];
  category: {
    name: string;
    color: string;
    icon: string;
  };
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const testId = params.id as string;

  // State management
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Fetch test data
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await fetch(`/api/testvault/catalog/${testId}`);
        if (!response.ok) throw new Error('Test not found');
        
        const data = await response.json();
        
        // Generate sample questions based on test type
        const questions = generateSampleQuestions(data.assessment_type, data.total_questions || 20);
        
        setTestData({
          ...data,
          questions,
          total_questions: questions.length,
          duration: data.duration || 30
        });
        
        setTimeLeft((data.duration || 30) * 60); // Convert to seconds
      } catch (error) {
        toast.error('Failed to load test');
        router.push('/testvault');
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestData();
    }
  }, [testId, router]);

  // Timer logic
  useEffect(() => {
    if (isStarted && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStarted, isPaused, timeLeft]);

  const generateSampleQuestions = (type: string, count: number): Question[] => {
    const questions: Question[] = [];
    
    for (let i = 1; i <= count; i++) {
      let question: Question;
      
      switch (type) {
        case 'academic':
          question = {
            id: i,
            question: `Academic Question ${i}: What is the primary focus of this subject area?`,
            type: 'single_choice',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            required: true,
            category: 'Academic'
          };
          break;
        case 'psychological':
        case 'personality':
          question = {
            id: i,
            question: `Personality Question ${i}: How would you describe your typical behavior in social situations?`,
            type: 'rating',
            options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
            required: true,
            category: 'Personality'
          };
          break;
        case 'cognitive':
          question = {
            id: i,
            question: `Cognitive Question ${i}: Which pattern best completes the sequence?`,
            type: 'single_choice',
            options: ['Pattern A', 'Pattern B', 'Pattern C', 'Pattern D'],
            required: true,
            category: 'Cognitive'
          };
          break;
        case 'physical':
          question = {
            id: i,
            question: `Physical Assessment Question ${i}: How would you rate your current fitness level?`,
            type: 'rating',
            options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
            required: true,
            category: 'Physical'
          };
          break;
        case 'career':
          question = {
            id: i,
            question: `Career Question ${i}: What type of work environment do you prefer?`,
            type: 'multiple_choice',
            options: ['Office', 'Remote', 'Field Work', 'Laboratory', 'Creative Studio'],
            required: true,
            category: 'Career'
          };
          break;
        default:
          question = {
            id: i,
            question: `General Question ${i}: Please provide your response.`,
            type: 'text',
            required: true,
            category: 'General'
          };
      }
      
      questions.push(question);
    }
    
    return questions;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      'academic': AcademicCapIcon,
      'psychological': BrainIcon,
      'personality': HeartIcon,
      'cognitive': BeakerIcon,
      'physical': ChartBarIcon,
      'career': SparklesIcon,
    };
    return icons[type] || AcademicCapIcon;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'beginner': 'bg-green-100 text-green-800 border-green-200',
      'intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'advanced': 'bg-orange-100 text-orange-800 border-orange-200',
      'expert': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleStartTest = () => {
    setIsStarted(true);
    startTimeRef.current = new Date();
    toast.success('Test started! Good luck!');
  };

  const handlePauseTest = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? 'Test resumed' : 'Test paused');
  };

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleFlagQuestion = (questionId: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (testData?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    
    try {
      // Calculate completion time
      const completionTime = startTimeRef.current 
        ? Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000)
        : 0;

      // Submit answers to API
      const response = await fetch('/api/testvault/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test_id: testId,
          answers,
          completion_time: completionTime,
          flagged_questions: Array.from(flaggedQuestions),
          user_id: session?.user?.id
        }),
      });

      if (!response.ok) throw new Error('Failed to submit test');

      setIsCompleted(true);
      toast.success('Test submitted successfully!');
      
      // Redirect to results page after a delay
      setTimeout(() => {
        router.push(`/test/${testId}/results`);
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers[question.id];

    switch (question.type) {
      case 'single_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                  onChange={(e) => {
                    const current = Array.isArray(currentAnswer) ? currentAnswer : [];
                    if (e.target.checked) {
                      handleAnswerChange(question.id, [...current, option]);
                    } else {
                      handleAnswerChange(question.id, current.filter((item: string) => item !== option));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            <div className="flex space-x-4">
              {question.options?.map((option, index) => (
                <label key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={currentAnswer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="mt-2 text-xs text-center text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={currentAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        );

      case 'boolean':
        return (
          <div className="flex space-x-4">
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="true"
                checked={currentAnswer === 'true'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-gray-900">True</span>
            </label>
            <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="false"
                checked={currentAnswer === 'false'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-3 text-gray-900">False</span>
            </label>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-800">Loading Test...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">Test not found</p>
          <button
            onClick={() => router.push('/testvault')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to TestVault
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-xl max-w-md mx-auto">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Completed!</h2>
          <p className="text-gray-600 mb-6">Your answers have been submitted successfully.</p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">Redirecting to results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    const TypeIcon = getTypeIcon(testData.assessment_type);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => router.push('/testvault')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to TestVault
              </button>
              <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getDifficultyColor(testData.difficulty)}`}>
                {testData.difficulty}
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <TypeIcon className="h-12 w-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{testData.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{testData.description}</p>
              
              <div className="flex justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{testData.total_questions}</div>
                  <div className="text-sm text-gray-500">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{testData.duration}</div>
                  <div className="text-sm text-gray-500">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{testData.assessment_type}</div>
                  <div className="text-sm text-gray-500">Type</div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <AcademicCapIcon className="h-6 w-6 mr-2 text-blue-600" />
              Test Instructions
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Read each question carefully before answering</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">You have {testData.duration} minutes to complete the test</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">You can flag questions to review later</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">You can pause and resume the test if needed</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Make sure to submit before time runs out</span>
              </li>
            </ul>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={handleStartTest}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              <PlaySolidIcon className="h-6 w-6 mr-3" />
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = testData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;
  const isLastQuestion = currentQuestion === testData.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push('/testvault')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Exit Test
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <ClockSolidIcon className="h-5 w-5 text-blue-600" />
                  <span className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                
                <button
                  onClick={handlePauseTest}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {isPaused ? (
                    <PlaySolidIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <PauseSolidIcon className="h-4 w-4 text-gray-600" />
                  )}
                  <span className="text-sm font-medium">
                    {isPaused ? 'Resume' : 'Pause'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {answeredQuestions} / {testData.questions.length} answered
              </div>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
                {testData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`relative p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      index === currentQuestion
                        ? 'bg-blue-600 text-white shadow-lg transform scale-110'
                        : answers[index + 1]
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : flaggedQuestions.has(index + 1)
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                    {flaggedQuestions.has(index + 1) && (
                      <FlagIcon className="absolute -top-1 -right-1 h-3 w-3 text-yellow-600" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
                  <span className="text-gray-600">Flagged</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                  <span className="text-gray-600">Current</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {testData.questions.length}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{currentQ.category}</span>
                </div>
                
                <button
                  onClick={() => handleFlagQuestion(currentQ.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQ.id)
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FlagIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {flaggedQuestions.has(currentQ.id) ? 'Flagged' : 'Flag'}
                  </span>
                </button>
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {currentQ.question}
              </h2>

              {/* Answer Options */}
              <div className="mb-8">
                {renderQuestion(currentQ)}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-4">
                  {isLastQuestion ? (
                    <button
                      onClick={handleSubmitTest}
                      disabled={submitting}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      <span>{submitting ? 'Submitting...' : 'Submit Test'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
