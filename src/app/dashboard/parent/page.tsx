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
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import AddChildModal from '@/components/dashboard/parent/AddChildModal';

interface AssessmentCardProps {
  title: string;
  description: string;
  type: 'academic' | 'psychological' | 'physical' | 'skills';
  progress: number;
  averageScore: number;
  completed: boolean;
  onStart: () => void;
  onViewReports: () => void;
  isNew?: boolean;
  isUrgent?: boolean;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({
  title,
  description,
  type,
  progress,
  averageScore,
  completed,
  onStart,
  onViewReports,
  isNew = false,
  isUrgent = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'academic':
        return {
          icon: AcademicCapIcon,
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        };
      case 'psychological':
        return {
          icon: LightBulbIcon,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          borderColor: 'border-purple-200'
        };
      case 'physical':
        return {
          icon: HeartIcon,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          borderColor: 'border-green-200'
        };
      case 'skills':
        return {
          icon: TrophyIcon,
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          icon: DocumentTextIcon,
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getTypeConfig(type);
  const Icon = config.icon;

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg border-2 ${config.borderColor} transition-all duration-300 ${
        isHovered ? 'shadow-xl scale-105' : 'hover:shadow-lg'
      }`}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 opacity-5 bg-gradient-to-br ${config.color}`}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.1 : 0.05
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
        {isUrgent && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
            Urgent
          </span>
        )}
      </div>

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-r ${config.color} shadow-lg`}
            animate={{ rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-6 h-6 text-white" />
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

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${config.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`${config.bgColor} rounded-lg p-3`}>
            <div className="text-lg font-bold text-gray-900">{averageScore}%</div>
            <div className="text-xs text-gray-600">Average Score</div>
          </div>
          <div className={`${config.bgColor} rounded-lg p-3`}>
            <div className="text-lg font-bold text-gray-900">{completed ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-gradient-to-r ${config.color} text-white shadow-lg hover:shadow-xl`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
          >
            {completed ? 'Retake Assessment' : 'Start Assessment'}
          </motion.button>
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

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  onClick: () => void;
  badge?: string;
  badgeColor?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  gradient,
  onClick,
  badge,
  badgeColor = 'bg-blue-500'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border-2 border-gray-100 hover:border-gray-200 transition-all duration-300"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
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

      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`p-3 rounded-xl ${color} shadow-lg`}
            animate={{ rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          
          {badge && (
            <span className={`px-2 py-1 text-xs font-bold text-white ${badgeColor} rounded-full`}>
              {badge}
            </span>
          )}
        </div>

        <motion.h3
          className="text-lg font-bold text-gray-900 mb-2"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">Click to access</span>
          <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </motion.button>
  );
};

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'academic' | 'psychological' | 'physical' | 'skills'>('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session || session.user.role !== 'PARENT') {
    redirect('/dashboard');
  }

  // Fetch children data
  useEffect(() => {
    if (session?.user?.id) {
      fetchChildren();
    }
  }, [session]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parent/children');
      const data = await response.json();

      if (response.ok && data.success) {
        setChildren(data.children || []);
      } else {
        console.error('Failed to fetch children:', data);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChildAdded = (newChild: any) => {
    setChildren(prev => [newChild, ...prev]);
    setShowAddChildModal(false);
  };

  // Mock assessment data
  const assessments = [
    {
      title: 'Academic Assessment',
      description: 'Comprehensive evaluation based on IB, IGCSE, CBSE, ICSE curricula with skills integration',
      type: 'academic' as const,
      progress: 75,
      averageScore: 87,
      completed: false,
      isNew: true
    },
    {
      title: 'Psychological & Mental Health',
      description: 'Deep understanding of student psychology, learning styles, and emotional wellbeing',
      type: 'psychological' as const,
      progress: 45,
      averageScore: 82,
      completed: false,
      isUrgent: true
    },
    {
      title: 'Physical Education Assessment',
      description: 'Comprehensive physical wellness and fitness evaluation',
      type: 'physical' as const,
      progress: 90,
      averageScore: 91,
      completed: true
    },
    {
      title: 'Skills Assessment',
      description: 'Evaluation of critical thinking, creativity, and problem-solving abilities',
      type: 'skills' as const,
      progress: 60,
      averageScore: 78,
      completed: false
    }
  ];

  const quickActions = [
    {
      title: 'View All Reports',
      description: 'Access comprehensive assessment reports and analytics',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      onClick: () => console.log('View reports'),
      badge: 'New'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Deep insights into your child\'s development trends',
      icon: ArrowTrendingUpIcon,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      onClick: () => console.log('Analytics dashboard')
    },
    {
      title: 'Export Data',
      description: 'Download assessment data in various formats',
      icon: ArrowDownTrayIcon,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      onClick: () => console.log('Export data')
    },
    {
      title: 'Schedule Assessment',
      description: 'Book evaluation appointments and assessments',
      icon: CalendarIcon,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      onClick: () => console.log('Schedule assessment'),
      badge: '2',
      badgeColor: 'bg-red-500'
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
                Track and manage your children's assessments and development
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
        {/* Filters and Search */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
                  { key: 'all', label: 'All' },
                  { key: 'academic', label: 'Academic' },
                  { key: 'psychological', label: 'Psychological' },
                  { key: 'physical', label: 'Physical' },
                  { key: 'skills', label: 'Skills' }
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Last 6 months</option>
                      <option>Last year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Completion %</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All</option>
                      <option>0-25%</option>
                      <option>25-50%</option>
                      <option>50-75%</option>
                      <option>75-100%</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Scores</option>
                      <option>90-100%</option>
                      <option>80-89%</option>
                      <option>70-79%</option>
                      <option>Below 70%</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <QuickActionCard {...action} />
              </motion.div>
            ))}
          </div>
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
                <AssessmentCard
                  {...assessment}
                  onStart={() => console.log(`Start ${assessment.title}`)}
                  onViewReports={() => console.log(`View reports for ${assessment.title}`)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              {
                icon: AcademicCapIcon,
                title: 'Child X completed Psychological Assessment',
                description: 'Score: 89/100 - Excellent performance in cognitive analysis',
                time: 'yesterday',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: CheckCircleIcon,
                title: 'Physical Assessment Results Available',
                description: 'All health metrics within optimal range',
                time: '2 days ago',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: LightBulbIcon,
                title: 'Skills Assessment In Progress',
                description: '60% completed - Strong performance in critical thinking',
                time: '3 days ago',
                color: 'bg-purple-100 text-purple-600'
              }
            ].map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onChildAdded={handleChildAdded}
        schoolId={(session?.user as any)?.schoolId || null}
      />
    </div>
  );
}