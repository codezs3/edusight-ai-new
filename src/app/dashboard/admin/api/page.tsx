'use client';

import React, { useState, useEffect } from 'react';
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
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CloudArrowUpIcon,
  UserCircleIcon,
  BookOpenIcon,
  MapPinIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  MegaphoneIcon,
  ArchiveBoxIcon,
  DevicePhoneMobileIcon,
  ShareIcon,
  HomeIcon,
  FolderIcon,
  CogIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  UsersIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface APICardProps {
  title: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  onClick: () => void;
  isActive?: boolean;
}

const APICard: React.FC<APICardProps> = ({
  title,
  description,
  endpoint,
  method,
  icon: Icon,
  color,
  gradient,
  onClick,
  isActive = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.button
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg border-2 transition-all duration-300 ${
        isActive ? 'border-blue-500 shadow-blue-100' : 'border-gray-100 hover:border-gray-200'
      }`}
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
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getMethodColor(method)}`}>
              {method}
            </span>
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

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <code className="text-sm text-gray-700 font-mono">{endpoint}</code>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Click to test</span>
          <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </motion.button>
  );
};

export default function AdminAPIDashboard() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'GET' | 'POST' | 'PUT' | 'DELETE'>('all');

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const apiEndpoints = [
    {
      title: 'Get Subjects',
      description: 'Retrieve all subjects with filtering options',
      endpoint: '/api/subjects/',
      method: 'GET' as const,
      icon: BookOpenIcon,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      onClick: () => console.log('Test GET /api/subjects/')
    },
    {
      title: 'Get Students',
      description: 'Retrieve students with school and grade filtering',
      endpoint: '/api/students/',
      method: 'GET' as const,
      icon: UsersIcon,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      onClick: () => console.log('Test GET /api/students/')
    },
    {
      title: 'Export Data',
      description: 'Export assessment data in various formats',
      endpoint: '/api/export/',
      method: 'GET' as const,
      icon: ArrowDownTrayIcon,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      onClick: () => console.log('Test GET /api/export/')
    },
    {
      title: 'Dashboard Analytics',
      description: 'Get comprehensive dashboard analytics data',
      endpoint: '/api/dashboard-analytics/',
      method: 'GET' as const,
      icon: ChartBarIcon,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      onClick: () => console.log('Test GET /api/dashboard-analytics/')
    },
    {
      title: 'Create Subject',
      description: 'Create a new subject with validation',
      endpoint: '/assessments/subjects/create/',
      method: 'POST' as const,
      icon: PlusIcon,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      onClick: () => console.log('Test POST /assessments/subjects/create/')
    },
    {
      title: 'Update Subject',
      description: 'Update existing subject information',
      endpoint: '/assessments/subjects/{id}/edit/',
      method: 'PUT' as const,
      icon: PencilIcon,
      color: 'bg-gradient-to-r from-teal-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500',
      onClick: () => console.log('Test PUT /assessments/subjects/{id}/edit/')
    },
    {
      title: 'Delete Subject',
      description: 'Delete a subject and related data',
      endpoint: '/assessments/subjects/{id}/delete/',
      method: 'DELETE' as const,
      icon: TrashIcon,
      color: 'bg-gradient-to-r from-red-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-red-500 to-pink-500',
      onClick: () => console.log('Test DELETE /assessments/subjects/{id}/delete/')
    },
    {
      title: 'Calendar Events',
      description: 'Manage calendar events and scheduling',
      endpoint: '/assessments/calendar/',
      method: 'GET' as const,
      icon: CalendarIcon,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
      onClick: () => console.log('Test GET /assessments/calendar/')
    }
  ];

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesMethod = selectedMethod === 'all' || endpoint.method === selectedMethod;
    const matchesSearch = endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         endpoint.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
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
                API Dashboard
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Test and manage API endpoints for the EduSight platform
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
                  placeholder="Search API endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Method Filter */}
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Methods' },
                  { key: 'GET', label: 'GET' },
                  { key: 'POST', label: 'POST' },
                  { key: 'PUT', label: 'PUT' },
                  { key: 'DELETE', label: 'DELETE' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setSelectedMethod(filter.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedMethod === filter.key
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
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FunnelIcon className="w-4 h-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Available API Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEndpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <APICard {...endpoint} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
