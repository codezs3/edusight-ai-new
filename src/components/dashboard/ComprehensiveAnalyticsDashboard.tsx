'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  DocumentArrowUpIcon,
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
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  description?: string;
  trend?: Array<{ label: string; value: number }>;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  gradient,
  description,
  trend
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive': return ArrowTrendingUpIcon;
      case 'negative': return ArrowTrendingDownIcon;
      default: return ArrowTrendingUpIcon;
    }
  };

  const ChangeIcon = getChangeIcon(changeType);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className={`absolute inset-0 opacity-5 ${gradient}`}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.1 : 0.05
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
          
          <div className="flex items-center space-x-1">
            <ChangeIcon className={`w-4 h-4 ${getChangeColor(changeType)}`} />
            <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        </div>

        <motion.h3
          className="text-2xl font-bold text-gray-900 mb-1"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {value}
        </motion.h3>
        
        <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
        
        {description && (
          <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
        )}

        {/* Mini Trend Chart */}
        {trend && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>6-month trend</span>
              <span>Latest: {trend[trend.length - 1]?.value}%</span>
            </div>
            <div className="flex items-end space-x-1 h-8">
              {trend.map((point, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm flex-1"
                  initial={{ height: 0 }}
                  animate={{ height: `${(point.value / 100) * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, children, actions }) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {description && (
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
};

interface AnalyticsDashboardProps {
  userRole?: string;
  userId?: string;
}

const ComprehensiveAnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userRole = 'PARENT',
  userId
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'overall' | 'academic' | 'psychological' | 'physical'>('overall');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data - in real app, this would come from API
  const metrics = [
    {
      title: 'Overall E360 Score',
      value: '87/100',
      change: 5.2,
      changeType: 'positive' as const,
      icon: TrophyIcon,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      description: 'Combined assessment performance',
      trend: [
        { label: 'Aug', value: 78 },
        { label: 'Sep', value: 81 },
        { label: 'Oct', value: 79 },
        { label: 'Nov', value: 84 },
        { label: 'Dec', value: 86 },
        { label: 'Jan', value: 87 }
      ]
    },
    {
      title: 'Academic Performance',
      value: '91%',
      change: 3.1,
      changeType: 'positive' as const,
      icon: AcademicCapIcon,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      description: 'Current academic average',
      trend: [
        { label: 'Aug', value: 85 },
        { label: 'Sep', value: 87 },
        { label: 'Oct', value: 86 },
        { label: 'Nov', value: 89 },
        { label: 'Dec', value: 90 },
        { label: 'Jan', value: 91 }
      ]
    },
    {
      title: 'Psychological Health',
      value: '89%',
      change: 2.3,
      changeType: 'positive' as const,
      icon: LightBulbIcon,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      description: 'Mental wellness score',
      trend: [
        { label: 'Aug', value: 82 },
        { label: 'Sep', value: 84 },
        { label: 'Oct', value: 83 },
        { label: 'Nov', value: 86 },
        { label: 'Dec', value: 88 },
        { label: 'Jan', value: 89 }
      ]
    },
    {
      title: 'Physical Wellness',
      value: '85%',
      change: -1.2,
      changeType: 'negative' as const,
      icon: HeartIcon,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      description: 'Physical health rating',
      trend: [
        { label: 'Aug', value: 88 },
        { label: 'Sep', value: 87 },
        { label: 'Oct', value: 86 },
        { label: 'Nov', value: 85 },
        { label: 'Dec', value: 84 },
        { label: 'Jan', value: 85 }
      ]
    }
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', score: 92, trend: 'up', change: 4 },
    { subject: 'Science', score: 89, trend: 'up', change: 2 },
    { subject: 'English', score: 94, trend: 'up', change: 6 },
    { subject: 'History', score: 87, trend: 'down', change: -1 },
    { subject: 'Art', score: 91, trend: 'up', change: 3 },
    { subject: 'Physical Education', score: 88, trend: 'stable', change: 0 }
  ];

  const competencyRadar = [
    { skill: 'Critical Thinking', value: 89 },
    { skill: 'Creativity', value: 85 },
    { skill: 'Communication', value: 92 },
    { skill: 'Collaboration', value: 87 },
    { skill: 'Problem Solving', value: 90 },
    { skill: 'Leadership', value: 83 }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    // In real app, trigger download
  };

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
                Analytics Dashboard
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Comprehensive insights into academic performance and development trends
              </motion.p>
            </div>
            
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ShareIcon className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <ChartCard
            title="Performance Trend"
            description="6-month overview of key metrics"
            actions={
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              </div>
            }
          >
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-600">Performance trend chart would be rendered here</p>
                <p className="text-sm text-gray-500">Integration with charting library needed</p>
              </div>
            </div>
          </ChartCard>

          {/* Subject Performance */}
          <ChartCard
            title="Subject Performance"
            description="Current scores across all subjects"
          >
            <div className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{subject.subject}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-900">{subject.score}%</span>
                    <div className={`flex items-center space-x-1 ${
                      subject.trend === 'up' ? 'text-green-600' : 
                      subject.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {subject.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4" />}
                      {subject.trend === 'down' && <ArrowTrendingDownIcon className="w-4 h-4" />}
                      <span className="text-sm">{subject.change > 0 ? '+' : ''}{subject.change}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Competency Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ChartCard
              title="Competency Radar"
              description="Skills assessment across key competencies"
            >
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <div className="text-center">
                  <BeakerIcon className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                  <p className="text-gray-600">Radar chart would be rendered here</p>
                  <p className="text-sm text-gray-500">Skills: {competencyRadar.map(s => s.skill).join(', ')}</p>
                </div>
              </div>
            </ChartCard>
          </div>

          <ChartCard
            title="Top Competencies"
            description="Highest performing skills"
          >
            <div className="space-y-4">
              {competencyRadar
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((skill, index) => (
                  <motion.div
                    key={skill.skill}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{skill.value}%</span>
                  </motion.div>
                ))}
            </div>
          </ChartCard>
        </div>

        {/* Insights and Recommendations */}
        <ChartCard
          title="AI-Powered Insights"
          description="Personalized recommendations based on assessment data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <LightBulbIcon className="w-5 h-5 text-yellow-500 mr-2" />
                Strengths
              </h4>
              <div className="space-y-3">
                {[
                  'Excellent performance in Mathematics and Science',
                  'Strong communication and collaboration skills',
                  'Consistent improvement in critical thinking',
                  'High engagement in creative activities'
                ].map((strength, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mr-2" />
                Areas for Improvement
              </h4>
              <div className="space-y-3">
                {[
                  'Physical activity levels could be increased',
                  'History performance needs attention',
                  'Leadership skills development opportunities',
                  'Time management in assessments'
                ].map((area, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  >
                    <ArrowTrendingUpIcon className="w-5 h-5 text-orange-600 mt-0.5" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default ComprehensiveAnalyticsDashboard;