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
  BuildingOfficeIcon,
  UsersIcon,
  GlobeAltIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  AtSymbolIcon,
  HomeIcon
} from '@heroicons/react/24/solid';

interface SchoolCardProps {
  school: {
    id: string;
    name: string;
    type: string;
    location: string;
    students: number;
    teachers: number;
    status: 'active' | 'inactive' | 'pending';
    lastActivity: string;
    performance: number;
  };
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  onView,
  onEdit,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
            animate={{ rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <BuildingOfficeIcon className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(school.status)}`}>
              {school.status.toUpperCase()}
            </span>
          </div>
        </div>

        <motion.h3
          className="text-xl font-bold text-gray-900 mb-2"
          animate={{ x: isHovered ? 5 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {school.name}
        </motion.h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-2" />
            {school.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <BookOpenIcon className="w-4 h-4 mr-2" />
            {school.type}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">{school.students}</div>
            <div className="text-xs text-gray-600">Students</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">{school.teachers}</div>
            <div className="text-xs text-gray-600">Teachers</div>
          </div>
        </div>

        {/* Performance */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Performance</span>
            <span className={`font-semibold ${getPerformanceColor(school.performance)}`}>
              {school.performance}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                school.performance >= 90 ? 'bg-green-500' :
                school.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${school.performance}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-gray-500 mb-4">
          Last activity: {school.lastActivity}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <motion.button
            className="flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onView}
          >
            View Details
          </motion.button>
          <motion.button
            className="py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onEdit}
          >
            <PencilIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            className="py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 bg-red-100 text-red-700 hover:bg-red-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDelete}
          >
            <TrashIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

interface QuickStatsCardProps {
  title: string;
  value: string | number;
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

export default function AdminSchoolDashboard() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Mock school data
  useEffect(() => {
    const mockSchools = [
      {
        id: '1',
        name: 'Greenwood International School',
        type: 'IB World School',
        location: 'Bangalore, India',
        students: 1250,
        teachers: 85,
        status: 'active' as const,
        lastActivity: '2 hours ago',
        performance: 92
      },
      {
        id: '2',
        name: 'Delhi Public School',
        type: 'CBSE',
        location: 'New Delhi, India',
        students: 2100,
        teachers: 120,
        status: 'active' as const,
        lastActivity: '1 day ago',
        performance: 88
      },
      {
        id: '3',
        name: 'Cambridge International School',
        type: 'IGCSE',
        location: 'Mumbai, India',
        students: 980,
        teachers: 65,
        status: 'pending' as const,
        lastActivity: '3 days ago',
        performance: 75
      },
      {
        id: '4',
        name: 'St. Mary\'s Convent School',
        type: 'ICSE',
        location: 'Chennai, India',
        students: 1450,
        teachers: 95,
        status: 'active' as const,
        lastActivity: '5 hours ago',
        performance: 85
      },
      {
        id: '5',
        name: 'Modern Public School',
        type: 'CBSE',
        location: 'Kolkata, India',
        students: 800,
        teachers: 45,
        status: 'inactive' as const,
        lastActivity: '1 week ago',
        performance: 68
      }
    ];

    setTimeout(() => {
      setSchools(mockSchools);
      setLoading(false);
    }, 1000);
  }, []);

  const quickStats = [
    {
      title: 'Total Schools',
      value: schools.length,
      change: 12,
      changeType: 'positive' as const,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Schools',
      value: schools.filter(s => s.status === 'active').length,
      change: 8,
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Students',
      value: schools.reduce((sum, school) => sum + school.students, 0).toLocaleString(),
      change: 15,
      changeType: 'positive' as const,
      icon: UsersIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Teachers',
      value: schools.reduce((sum, school) => sum + school.teachers, 0),
      change: 5,
      changeType: 'positive' as const,
      icon: AcademicCapIcon,
      color: 'bg-orange-500'
    }
  ];

  const filteredSchools = useMemo(() => {
    return schools.filter(school => {
      const matchesFilter = selectedFilter === 'all' || school.status === selectedFilter;
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           school.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           school.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [schools, selectedFilter, searchQuery]);

  const handleViewSchool = (schoolId: string) => {
    console.log('View school:', schoolId);
    // Navigate to school details page
  };

  const handleEditSchool = (schoolId: string) => {
    console.log('Edit school:', schoolId);
    // Open edit modal or navigate to edit page
  };

  const handleDeleteSchool = (schoolId: string) => {
    console.log('Delete school:', schoolId);
    // Show confirmation modal
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
                School Management
              </motion.h1>
              <motion.p
                className="text-gray-600 mt-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Manage schools, students, and educational institutions
              </motion.p>
            </div>
            
            <motion.div
              className="flex items-center space-x-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-4 h-4" />
                <span>Add School</span>
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
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Schools' },
                  { key: 'active', label: 'Active' },
                  { key: 'inactive', label: 'Inactive' },
                  { key: 'pending', label: 'Pending' }
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Type</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Types</option>
                      <option>CBSE</option>
                      <option>ICSE</option>
                      <option>IB</option>
                      <option>IGCSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Locations</option>
                      <option>Bangalore</option>
                      <option>Delhi</option>
                      <option>Mumbai</option>
                      <option>Chennai</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Performance</option>
                      <option>90%+ (Excellent)</option>
                      <option>80-89% (Good)</option>
                      <option>70-79% (Average)</option>
                      <option>Below 70% (Needs Improvement)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Schools Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Schools ({filteredSchools.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded flex-1"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
              <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Schools Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add New School
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school, index) => (
                <motion.div
                  key={school.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <SchoolCard
                    school={school}
                    onView={() => handleViewSchool(school.id)}
                    onEdit={() => handleEditSchool(school.id)}
                    onDelete={() => handleDeleteSchool(school.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Manage Your Educational Network</h3>
              <p className="text-blue-100">Add new schools, track performance, and ensure quality education delivery across all institutions</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                Add New School
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium text-sm border border-blue-400">
                Export Data
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-medium text-sm border border-indigo-400">
                View Analytics
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
