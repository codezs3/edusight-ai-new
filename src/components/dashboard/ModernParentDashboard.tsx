'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  CpuChipIcon as BrainIcon,
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
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  BellIcon,
  ShareIcon,
  DownloadIcon,
  PrinterIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BeakerIcon,
  CogIcon,
  UserGroupIcon,
  HomeIcon,
  UserCircleIcon,
  CloudArrowUpIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  VideoCameraIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  ArchiveBoxIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  FolderIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface ModernCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  stats?: {
    value: string | number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  };
  onClick: () => void;
  badge?: string;
  isActive?: boolean;
}

const ModernCard: React.FC<ModernCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  gradient,
  stats,
  onClick,
  badge,
  isActive = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl border transition-all duration-500 ${
        isActive 
          ? 'border-blue-500/50 shadow-blue-200/50 scale-105' 
          : 'border-white/20 hover:border-white/40 hover:shadow-2xl'
      }`}
      whileHover={{ y: -12, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Animated Background */}
      <motion.div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        animate={{
          scale: isHovered ? 1.2 : 1,
          rotate: isHovered ? 5 : 0
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Floating Particles */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [-20, -40, -60]
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            className={`p-4 rounded-2xl ${color} shadow-2xl`}
            animate={{ 
              rotate: isHovered ? 10 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.4 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          
          <div className="flex items-center space-x-3">
            {badge && (
              <motion.span
                className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg"
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {badge}
              </motion.span>
            )}
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <motion.h3
          className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
          {description}
        </p>

        {/* Stats */}
        {stats && (
          <motion.div
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl"
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.value}</div>
              <div className="text-sm text-gray-600">Current</div>
            </div>
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
              stats.trend === 'up' ? 'bg-green-100 text-green-700' :
              stats.trend === 'down' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              <span>{stats.trend === 'up' ? '↗' : stats.trend === 'down' ? '↘' : '→'}</span>
              <span>{Math.abs(stats.change)}%</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{progress}%</div>
          {label && <div className="text-xs text-gray-600">{label}</div>}
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color
}) => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -4, scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
          trend === 'up' ? 'bg-green-100 text-green-700' :
          trend === 'down' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          <span>{trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}</span>
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </motion.div>
  );
};

export default function ModernParentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'analytics' | 'children'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const mainFeatures = [
    {
      title: 'Start Assessment',
      description: 'Begin comprehensive evaluation of your child\'s academic, psychological, and physical development',
      icon: PlayIcon,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      stats: { value: '3', change: 12, trend: 'up' as const },
      onClick: () => console.log('Start Assessment'),
      badge: 'New'
    },
    {
      title: 'Academic Excellence',
      description: 'Track academic performance across IB, IGCSE, CBSE, and ICSE curriculum frameworks',
      icon: AcademicCapIcon,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      stats: { value: '92%', change: 8, trend: 'up' as const },
      onClick: () => console.log('Academic Assessment'),
      isActive: true
    },
    {
      title: 'Mental Health & Psychology',
      description: 'Comprehensive psychological assessment including personality, cognitive abilities, and emotional intelligence',
      icon: BrainIcon,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      stats: { value: '84%', change: 15, trend: 'up' as const },
      onClick: () => console.log('Psychological Assessment')
    },
    {
      title: 'Physical Development',
      description: 'Monitor fitness levels, motor skills, and overall physical health and wellness',
      icon: HeartIcon,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      stats: { value: '79%', change: -2, trend: 'down' as const },
      onClick: () => console.log('Physical Assessment')
    },
    {
      title: 'Skills & Competencies',
      description: 'Evaluate essential life skills, critical thinking, creativity, and problem-solving abilities',
      icon: BeakerIcon,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      stats: { value: '88%', change: 5, trend: 'up' as const },
      onClick: () => console.log('Skills Assessment')
    },
    {
      title: 'Analytics & Reports',
      description: 'Access detailed analytics, performance insights, and comprehensive development reports',
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-teal-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500',
      stats: { value: '15', change: 25, trend: 'up' as const },
      onClick: () => console.log('Analytics')
    }
  ];

  const quickActions = [
    {
      title: 'Upload Documents',
      description: 'Upload report cards, transcripts, and assessment results',
      icon: CloudArrowUpIcon,
      color: 'bg-blue-500',
      onClick: () => console.log('Upload Documents')
    },
    {
      title: 'View Reports',
      description: 'Access comprehensive assessment reports',
      icon: DocumentTextIcon,
      color: 'bg-green-500',
      onClick: () => console.log('View Reports')
    },
    {
      title: 'Schedule Meeting',
      description: 'Book parent-teacher conferences',
      icon: VideoCameraIcon,
      color: 'bg-purple-500',
      onClick: () => console.log('Schedule Meeting')
    },
    {
      title: 'Export Data',
      description: 'Download assessment data and reports',
      icon: DownloadIcon,
      color: 'bg-orange-500',
      onClick: () => console.log('Export Data')
    }
  ];

  const stats = [
    {
      title: 'Total Assessments',
      value: '24',
      change: 12.5,
      trend: 'up' as const,
      icon: DocumentTextIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Average Score',
      value: '87.3%',
      change: 3.2,
      trend: 'up' as const,
      icon: TrophyIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Active Children',
      value: '2',
      change: 0,
      trend: 'neutral' as const,
      icon: UsersIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: -1.1,
      trend: 'down' as const,
      icon: CheckCircleIcon,
      color: 'bg-orange-500'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'assessments', label: 'Assessments', icon: DocumentTextIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'children', label: 'My Children', icon: UserGroupIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <motion.div
        className="relative bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Parent Dashboard
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-2 text-lg"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Track your children's development and academic progress
              </motion.p>
            </div>
            
            <motion.div
              className="flex items-center space-x-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-xl hover:bg-white/80">
                <BellIcon className="w-6 h-6" />
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors bg-white/50 rounded-xl hover:bg-white/80">
                <ShareIcon className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="relative bg-white/60 backdrop-blur-sm border-b border-white/20"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Stats Overview */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <StatsCard {...stat} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Main Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mainFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <ModernCard {...feature} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <ModernCard {...action} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'assessments' && (
            <motion.div
              key="assessments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mainFeatures.slice(0, 6).map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ModernCard {...feature} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Overall Progress</h3>
                  <div className="flex justify-center">
                    <ProgressRing progress={87} size={200} color="#3B82F6" label="Overall" />
                  </div>
                </motion.div>
                
                <motion.div
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Academic</span>
                      <ProgressRing progress={92} size={60} color="#10B981" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Psychological</span>
                      <ProgressRing progress={84} size={60} color="#8B5CF6" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Physical</span>
                      <ProgressRing progress={79} size={60} color="#F59E0B" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Skills</span>
                      <ProgressRing progress={88} size={60} color="#6366F1" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'children' && (
            <motion.div
              key="children"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-12">
                <UserGroupIcon className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Children Management</h3>
                <p className="text-gray-600 mb-6">Manage your children's profiles and assessment data</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  Add Child
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
