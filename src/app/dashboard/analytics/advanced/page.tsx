'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  ChartBarIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { getUserTypeConfig, canAccessAdminFeatures } from '@/lib/user-types';

interface FilterOptions {
  grade: string[];
  subject: string[];
  school: string[];
  dateRange: {
    start: string;
    end: string;
  };
  performanceRange: {
    min: number;
    max: number;
  };
  framework: string[];
  userType: string[];
}

interface StudentData {
  id: string;
  name: string;
  grade: string;
  school: string;
  subject: string;
  score: number;
  framework: string;
  date: string;
  masked: boolean;
  userType: string;
  trend: 'up' | 'down' | 'stable';
  previousScore?: number;
}

interface AnalyticsSummary {
  totalStudents: number;
  averageScore: number;
  performanceDistribution: {
    excellent: number;
    good: number;
    average: number;
    below: number;
  };
  trendAnalysis: {
    improving: number;
    declining: number;
    stable: number;
  };
  topPerformers: StudentData[];
  needsAttention: StudentData[];
}

export default function AdvancedAnalyticsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentData[]>([]);
  const [filteredData, setFilteredData] = useState<StudentData[]>([]);
  const [showMaskedData, setShowMaskedData] = useState(false);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    grade: [],
    subject: [],
    school: [],
    dateRange: {
      start: '',
      end: ''
    },
    performanceRange: {
      min: 0,
      max: 100
    },
    framework: [],
    userType: []
  });

  const userRole = session?.user?.role || '';
  const userTypeConfig = getUserTypeConfig(userRole);
  const isAdmin = canAccessAdminFeatures(userRole);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data - in real implementation, fetch from API
      const mockData: StudentData[] = [
        {
          id: '1',
          name: isAdmin ? 'John Doe' : 'Student A',
          grade: 'Grade 10',
          school: isAdmin ? 'Modern Public School' : 'School A',
          subject: 'Mathematics',
          score: 85,
          framework: 'CBSE',
          date: '2024-01-15',
          masked: !isAdmin,
          userType: 'PARENT',
          trend: 'up',
          previousScore: 82
        },
        {
          id: '2',
          name: isAdmin ? 'Jane Smith' : 'Student B',
          grade: 'Grade 10',
          school: isAdmin ? 'Delhi Public School' : 'School B',
          subject: 'Science',
          score: 92,
          framework: 'ICSE',
          date: '2024-01-16',
          masked: !isAdmin,
          userType: 'SCHOOL_ADMIN',
          trend: 'up',
          previousScore: 89
        },
        {
          id: '3',
          name: isAdmin ? 'Alex Johnson' : 'Student C',
          grade: 'Grade 9',
          school: isAdmin ? 'International School' : 'School C',
          subject: 'English',
          score: 78,
          framework: 'IB',
          date: '2024-01-17',
          masked: !isAdmin,
          userType: 'PARENT',
          trend: 'down',
          previousScore: 81
        },
        {
          id: '4',
          name: isAdmin ? 'Sarah Wilson' : 'Student D',
          grade: 'Grade 11',
          school: isAdmin ? 'Cambridge School' : 'School D',
          subject: 'Mathematics',
          score: 88,
          framework: 'IGCSE',
          date: '2024-01-18',
          masked: !isAdmin,
          userType: 'SCHOOL_ADMIN',
          trend: 'stable',
          previousScore: 88
        },
        {
          id: '5',
          name: isAdmin ? 'Mike Brown' : 'Student E',
          grade: 'Grade 10',
          school: isAdmin ? 'Modern Public School' : 'School A',
          subject: 'Science',
          score: 76,
          framework: 'CBSE',
          date: '2024-01-19',
          masked: !isAdmin,
          userType: 'PARENT',
          trend: 'down',
          previousScore: 79
        },
        {
          id: '6',
          name: isAdmin ? 'Emily Davis' : 'Student F',
          grade: 'Grade 12',
          school: isAdmin ? 'Elite Academy' : 'School E',
          subject: 'Physics',
          score: 94,
          framework: 'CBSE',
          date: '2024-01-20',
          masked: !isAdmin,
          userType: 'SCHOOL_ADMIN',
          trend: 'up',
          previousScore: 91
        }
      ];

      setData(mockData);
      
      // Calculate analytics summary
      const summary = calculateAnalyticsSummary(mockData);
      setAnalyticsSummary(summary);
      
    } catch (error) {
      toast.error('Failed to fetch analytics data');
      console.error('Analytics data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalyticsSummary = (data: StudentData[]): AnalyticsSummary => {
    const totalStudents = data.length;
    const averageScore = Math.round(data.reduce((sum, item) => sum + item.score, 0) / totalStudents);
    
    const performanceDistribution = {
      excellent: data.filter(item => item.score >= 90).length,
      good: data.filter(item => item.score >= 80 && item.score < 90).length,
      average: data.filter(item => item.score >= 70 && item.score < 80).length,
      below: data.filter(item => item.score < 70).length
    };

    const trendAnalysis = {
      improving: data.filter(item => item.trend === 'up').length,
      declining: data.filter(item => item.trend === 'down').length,
      stable: data.filter(item => item.trend === 'stable').length
    };

    const topPerformers = data
      .filter(item => item.score >= 90)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const needsAttention = data
      .filter(item => item.score < 70 || item.trend === 'down')
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    return {
      totalStudents,
      averageScore,
      performanceDistribution,
      trendAnalysis,
      topPerformers,
      needsAttention
    };
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Apply grade filter
    if (filters.grade.length > 0) {
      filtered = filtered.filter(item => filters.grade.includes(item.grade));
    }

    // Apply subject filter
    if (filters.subject.length > 0) {
      filtered = filtered.filter(item => filters.subject.includes(item.subject));
    }

    // Apply school filter
    if (filters.school.length > 0) {
      filtered = filtered.filter(item => filters.school.includes(item.school));
    }

    // Apply framework filter
    if (filters.framework.length > 0) {
      filtered = filtered.filter(item => filters.framework.includes(item.framework));
    }

    // Apply user type filter
    if (filters.userType.length > 0) {
      filtered = filtered.filter(item => filters.userType.includes(item.userType));
    }

    // Apply performance range filter
    filtered = filtered.filter(item => 
      item.score >= filters.performanceRange.min && 
      item.score <= filters.performanceRange.max
    );

    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
  };

  const getUniqueValues = (key: keyof StudentData) => {
    return Array.from(new Set(data.map(item => item[key])));
  };

  const maskData = (value: string, shouldMask: boolean) => {
    if (!shouldMask || showMaskedData) return value;
    return '***' + value.slice(-2);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Student', 'Grade', 'School', 'Subject', 'Score', 'Framework', 'Date', 'Trend'],
      ...filteredData.map(item => [
        maskData(item.name, item.masked),
        item.grade,
        maskData(item.school, item.masked),
        item.subject,
        item.score,
        item.framework,
        item.date,
        item.trend
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">
            Comprehensive analysis with advanced filtering and data privacy controls
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowMaskedData(!showMaskedData)}
            className={`flex items-center px-4 py-2 rounded-lg border ${
              showMaskedData 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {showMaskedData ? (
              <EyeSlashIcon className="w-5 h-5 mr-2" />
            ) : (
              <EyeIcon className="w-5 h-5 mr-2" />
            )}
            {showMaskedData ? 'Hide Sensitive Data' : 'Show Sensitive Data'}
          </button>
          <button 
            onClick={exportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* User Type Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <ChartBarIcon className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              {userTypeConfig.name} Access Level
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              {isAdmin 
                ? 'Full access to all data and analytics features'
                : 'Access to filtered data with privacy protection for sensitive information'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      {analyticsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsSummary.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsSummary.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Improving</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsSummary.trendAnalysis.improving}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowTrendingDownIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsSummary.trendAnalysis.declining}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Distribution */}
      {analyticsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excellent (90+)</p>
                <p className="text-2xl font-bold text-green-600">{analyticsSummary.performanceDistribution.excellent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">A+</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Good (80-89)</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsSummary.performanceDistribution.good}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">A</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average (70-79)</p>
                <p className="text-2xl font-bold text-yellow-600">{analyticsSummary.performanceDistribution.average}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">B</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Below Average</p>
                <p className="text-2xl font-bold text-red-600">{analyticsSummary.performanceDistribution.below}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Advanced Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Grade Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
            <select
              multiple
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.grade}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFilters(prev => ({ ...prev, grade: values }));
              }}
            >
              {getUniqueValues('grade').map(grade => (
                <option key={String(grade)} value={String(grade)}>{String(grade)}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              multiple
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.subject}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFilters(prev => ({ ...prev, subject: values }));
              }}
            >
              {getUniqueValues('subject').map(subject => (
                <option key={String(subject)} value={String(subject)}>{String(subject)}</option>
              ))}
            </select>
          </div>

          {/* School Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
            <select
              multiple
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.school}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFilters(prev => ({ ...prev, school: values }));
              }}
            >
              {getUniqueValues('school').map(school => (
                <option key={String(school)} value={String(school)}>{String(school)}</option>
              ))}
            </select>
          </div>

          {/* Framework Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
            <select
              multiple
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.framework}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFilters(prev => ({ ...prev, framework: values }));
              }}
            >
              {getUniqueValues('framework').map(framework => (
                <option key={String(framework)} value={String(framework)}>{String(framework)}</option>
              ))}
            </select>
          </div>

          {/* User Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <select
              multiple
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filters.userType}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setFilters(prev => ({ ...prev, userType: values }));
              }}
            >
              <option value="PARENT">Parent</option>
              <option value="SCHOOL_ADMIN">School Admin</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          {/* Performance Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Score Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Min"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.performanceRange.min}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  performanceRange: { ...prev.performanceRange, min: parseInt(e.target.value) || 0 }
                }))}
              />
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Max"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.performanceRange.max}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  performanceRange: { ...prev.performanceRange, max: parseInt(e.target.value) || 100 }
                }))}
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
              />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFilters({
              grade: [],
              subject: [],
              school: [],
              dateRange: { start: '', end: '' },
              performanceRange: { min: 0, max: 100 },
              framework: [],
              userType: []
            })}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filtered Results</h2>
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {data.length} records
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Framework
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {maskData(item.name, item.masked)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {maskData(item.school, item.masked)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.score >= 90 ? 'bg-green-100 text-green-800' :
                      item.score >= 80 ? 'bg-blue-100 text-blue-800' :
                      item.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(item.trend)}
                      <span className="text-xs">
                        {item.previousScore && `(${item.previousScore}%)`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.framework}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}