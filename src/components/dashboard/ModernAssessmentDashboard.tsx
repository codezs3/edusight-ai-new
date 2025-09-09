'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  BrainIcon,
  HeartIcon,
  ChartBarIcon,
  PlayIcon,
  SparklesIcon,
  TrophyIcon,
  StarIcon,
  ArrowRightIcon,
  ClockIcon,
  UsersIcon,
  BookOpenIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  FireIcon,
  BoltIcon,
  EyeIcon,
  DocumentTextIcon,
  CogIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  BellIcon,
  ShareIcon,
  DownloadIcon,
  PrinterIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface AssessmentCardProps {
  title: string;
  description: string;
  type: 'academic' | 'psychological' | 'physical' | 'comprehensive';
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  stats: {
    completed: number;
    total: number;
    averageScore: number;
    lastUpdated: string;
  };
  onStart: () => void;
  onViewReports: () => void;
  isActive?: boolean;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  title,
  description,
  type,
  icon: Icon,
  color,
  gradient,
  stats,
  onStart,
  onViewReports,
  isActive = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-white shadow-lg border-2 transition-all duration-300 ${
        isActive ? 'border-blue-500 shadow-blue-100' : 'border-gray-100 hover:border-gray-200'
      }`}
      whileHover={{ y: -8, scale: 1.02 }}
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

      {/* Header */}
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-3 rounded-xl ${color} shadow-lg`}
            animate={{ rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          
          <motion.div
            className="flex items-center space-x-2"
            animate={{ opacity: isHovered ? 1 : 0.7 }}
          >
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${color.replace('bg-', 'bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {stats.completed}/{stats.total}
            </span>
          </motion.div>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="text-center p-3 bg-gray-50 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.averageScore}%</div>
            <div className="text-xs text-gray-600">Avg Score</div>
          </motion.div>
          
          <motion.div
            className="text-center p-3 bg-gray-50 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white ${color} shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
          >
            <PlayIcon className="w-4 h-4" />
            <span>Start Assessment</span>
          </motion.button>
          
          <motion.button
            className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewReports}
          >
            <ChartBarIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Floating Elements */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.1 }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.2 }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  onClick: () => void;
  badge?: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onClick,
  badge
}) => {
  return (
    <motion.button
      className="group relative p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 text-left w-full"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-900 group-hover:text-gray-700">
              {title}
            </h4>
            {badge && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 group-hover:text-gray-500">
            {description}
          </p>
        </div>
        
        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </motion.button>
  );
};

interface AnalyticsWidgetProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down' | 'neutral';
}

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend
}) => {
  return (
    <motion.div
      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center space-x-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {trend === 'up' && <ArrowRightIcon className="w-4 h-4 rotate-[-45deg]" />}
          {trend === 'down' && <ArrowRightIcon className="w-4 h-4 rotate-[45deg]" />}
          <span>{change > 0 ? '+' : ''}{change}%</span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </motion.div>
  );
};

export default function ModernAssessmentDashboard() {
  const [selectedType, setSelectedType] = useState<'all' | 'academic' | 'psychological' | 'physical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const assessments = [
    {
      title: 'Comprehensive 360° Assessment',
      description: 'Complete evaluation covering academic, psychological, and physical domains for holistic development insights.',
      type: 'comprehensive' as const,
      icon: SparklesIcon,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      stats: {
        completed: 45,
        total: 60,
        averageScore: 87,
        lastUpdated: '2 hours ago'
      }
    },
    {
      title: 'Academic Excellence (IB/IGCSE/CBSE/ICSE)',
      description: 'Subject-specific assessments aligned with international and national curriculum frameworks.',
      type: 'academic' as const,
      icon: AcademicCapIcon,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      stats: {
        completed: 32,
        total: 40,
        averageScore: 92,
        lastUpdated: '1 hour ago'
      }
    },
    {
      title: 'Psychological & Mental Health',
      description: 'Deep personality analysis, cognitive assessment, and emotional intelligence evaluation.',
      type: 'psychological' as const,
      icon: BrainIcon,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      stats: {
        completed: 28,
        total: 35,
        averageScore: 84,
        lastUpdated: '3 hours ago'
      }
    },
    {
      title: 'Physical Education Assessment',
      description: 'Fitness evaluation, motor skills assessment, and health metrics tracking.',
      type: 'physical' as const,
      icon: HeartIcon,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      stats: {
        completed: 18,
        total: 25,
        averageScore: 79,
        lastUpdated: '4 hours ago'
      }
    }
  ];

  const quickActions = [
    {
      title: 'Create New Assessment',
      description: 'Design custom assessments for specific needs',
      icon: PlusIcon,
      color: 'bg-blue-500',
      onClick: () => console.log('Create assessment')
    },
    {
      title: 'View All Reports',
      description: 'Access comprehensive assessment reports',
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      onClick: () => console.log('View reports')
    },
    {
      title: 'Analytics Dashboard',
      description: 'Deep insights and performance trends',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      onClick: () => console.log('Analytics')
    },
    {
      title: 'Export Data',
      description: 'Download assessment data and reports',
      icon: DownloadIcon,
      color: 'bg-orange-500',
      onClick: () => console.log('Export data')
    }
  ];

  const analyticsData = [
    {
      title: 'Total Assessments',
      value: '1,247',
      change: 12.5,
      icon: TrophyIcon,
      color: 'bg-blue-500',
      trend: 'up' as const
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: 3.1,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      trend: 'up' as const
    },
    {
      title: 'Average Score',
      value: '87.3%',
      change: -1.2,
      icon: StarIcon,
      color: 'bg-yellow-500',
      trend: 'down' as const
    },
    {
      title: 'Active Users',
      value: '2,341',
      change: 8.7,
      icon: UsersIcon,
      color: 'bg-purple-500',
      trend: 'up' as const
    }
  ];

  const filteredAssessments = assessments.filter(assessment => {
    const matchesType = selectedType === 'all' || assessment.type === selectedType;
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
                Assessment Dashboard
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Comprehensive educational assessment and analytics platform
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
        {/* Analytics Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {analyticsData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <AnalyticsWidget {...item} />
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

              {/* Type Filter */}
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Types' },
                  { key: 'academic', label: 'Academic' },
                  { key: 'psychological', label: 'Psychological' },
                  { key: 'physical', label: 'Physical' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedType(filter.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedType === filter.key
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
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <QuickAction {...action} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Assessment Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Assessments</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAssessments.map((assessment, index) => (
              <motion.div
                key={assessment.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
              >
                <AssessmentCard
                  {...assessment}
                  onStart={() => console.log(`Start ${assessment.title}`)}
                  onViewReports={() => console.log(`View reports for ${assessment.title}`)}
                  isActive={selectedType === 'all' || assessment.type === selectedType}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
