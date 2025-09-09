'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  DocumentTextIcon,
  TrophyIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  CalendarIcon,
  BellIcon,
  ShareIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  BookOpenIcon,
  MapPinIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
  ArchiveBoxIcon,
  DevicePhoneMobileIcon,
  FolderIcon,
  CogIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  CloudArrowUpIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  DocumentArrowUpIcon,
  PencilIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';

interface AssessmentTypeCardProps {
  title: string;
  description: string;
  type: 'academic' | 'psychological' | 'physical' | 'combined';
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  progress: number;
  averageScore: number;
  completed: boolean;
  duration: string;
  questions: number;
  onStart: () => void;
  onViewReports: () => void;
  onResume?: () => void;
  isNew?: boolean;
  isRecommended?: boolean;
}

const AssessmentTypeCard: React.FC<AssessmentTypeCardProps> = ({
  title,
  description,
  type,
  icon: Icon,
  color,
  gradient,
  progress,
  averageScore,
  completed,
  duration,
  questions,
  onStart,
  onViewReports,
  onResume,
  isNew = false,
  isRecommended = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg border-2 transition-all duration-300 ${
        isHovered ? 'shadow-xl scale-105' : 'hover:shadow-lg'
      } ${isRecommended ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-100'}`}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 opacity-10 ${gradient}`}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.15 : 0.1
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Badges */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {isNew && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
            New
          </span>
        )}
        {isRecommended && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full">
            Recommended
          </span>
        )}
      </div>

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-4 rounded-xl bg-gradient-to-r ${color} shadow-lg`}
            animate={{ rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{averageScore}%</div>
            <div className="text-sm text-gray-500">Average Score</div>
          </div>
        </div>

        <motion.h3
          className="text-xl font-bold text-gray-900 mb-2"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Assessment Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500">Duration</div>
            <div className="font-semibold text-gray-900">{duration}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-500">Questions</div>
            <div className="font-semibold text-gray-900">{questions}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {progress > 0 && progress < 100 && onResume ? (
            <motion.button
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r ${color} text-white shadow-lg hover:shadow-xl`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResume}
            >
              Resume Assessment
            </motion.button>
          ) : (
            <motion.button
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r ${color} text-white shadow-lg hover:shadow-xl`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
            >
              {completed ? 'Retake Assessment' : 'Start Assessment'}
            </motion.button>
          )}
          
          <motion.button
            className="py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewReports}
          >
            <EyeIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

interface QuickStatsCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color
}) => {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
      whileHover={{ y: -2, shadow: 'lg' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${getChangeColor(changeType)}`}>
            {change > 0 ? '+' : ''}{change}%
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default function AssessmentDashboard() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'academic' | 'psychological' | 'physical' | 'combined'>('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session) {
    redirect('/dashboard');
  }

  // Mock assessment data
  const assessments = [
    {
      title: 'Academic Assessment',
      description: 'Comprehensive evaluation based on IB, IGCSE, CBSE, ICSE curricula with integrated skills assessment',
      type: 'academic' as const,
      icon: AcademicCapIcon,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      progress: 0,
      averageScore: 87,
      completed: false,
      duration: '45-60 min',
      questions: 50,
      isNew: true,
      isRecommended: true
    },
    {
      title: 'Psychological & Mental Health',
      description: 'Deep understanding of student psychology, learning styles, cognitive assessment, and emotional wellbeing',
      type: 'psychological' as const,
      icon: LightBulbIcon,
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      progress: 25,
      averageScore: 82,
      completed: false,
      duration: '30-45 min',
      questions: 35,
      isRecommended: true
    },
    {
      title: 'Physical Education Assessment',
      description: 'Comprehensive physical wellness, fitness evaluation, and health metrics assessment',
      type: 'physical' as const,
      icon: HeartIcon,
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      progress: 100,
      averageScore: 91,
      completed: true,
      duration: '20-30 min',
      questions: 25
    },
    {
      title: 'EduSight 360° Assessment',
      description: 'Complete 3-in-1 assessment combining academic, psychological, and physical evaluations for comprehensive insights',
      type: 'combined' as const,
      icon: TrophyIcon,
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      progress: 0,
      averageScore: 89,
      completed: false,
      duration: '90-120 min',
      questions: 110,
      isNew: true,
      isRecommended: true
    }
  ];

  const quickStats = [
    {
      title: 'Total Assessments',
      value: '12',
      change: 15,
      changeType: 'positive' as const,
      icon: DocumentTextIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Average Score',
      value: '87%',
      change: 5,
      changeType: 'positive' as const,
      icon: TrophyIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Completed',
      value: '8',
      change: 25,
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'In Progress',
      value: '2',
      change: -10,
      changeType: 'negative' as const,
      icon: ClockIcon,
      color: 'bg-orange-500'
    }
  ];

  const filteredAssessments = useMemo(() => {
    return assessments.filter(assessment => {
      const matchesFilter = selectedFilter === 'all' || assessment.type === selectedFilter;
      const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [assessments, selectedFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b border-gray-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                className="text-3xl font-bold text-gray-900"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Assessment Center
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Choose your assessment type: Individual or comprehensive 360° evaluation
              </motion.p>
            </div>
            
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ShareIcon className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <QuickStatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Types' },
                  { key: 'academic', label: 'Academic' },
                  { key: 'psychological', label: 'Psychological' },
                  { key: 'physical', label: 'Physical' },
                  { key: 'combined', label: '360° Combined' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedFilter(filter.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedFilter === filter.key
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* More Filters */}
          <AnimatePresence>
            {showMoreFilters && (
              <motion.div
                className="mt-4 pt-4 border-t border-gray-200"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Any Duration</option>
                      <option>Under 30 min</option>
                      <option>30-60 min</option>
                      <option>60-90 min</option>
                      <option>Over 90 min</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Status</option>
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Levels</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Assessment Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <AssessmentTypeCard
                  {...assessment}
                  onStart={() => console.log(`Start ${assessment.title}`)}
                  onViewReports={() => console.log(`View reports for ${assessment.title}`)}
                  onResume={assessment.progress > 0 && assessment.progress < 100 ? () => console.log(`Resume ${assessment.title}`) : undefined}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Ready to Start Your Assessment Journey?</h3>
              <p className="text-purple-100">Choose from individual assessments or take the comprehensive EduSight 360° evaluation for complete insights</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-sm">
                View All Reports
              </button>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors font-medium text-sm border border-purple-400">
                Analytics Dashboard
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium text-sm border border-indigo-400">
                Export Data
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}