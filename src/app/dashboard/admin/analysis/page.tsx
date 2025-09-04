'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  DocumentArrowUpIcon,
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface AnalysisData {
  totalAssessments: number;
  pendingAnalysis: number;
  completedToday: number;
  averageScore: number;
  recentUploads: any[];
  systemStats: {
    totalUsers: number;
    totalSchools: number;
    totalStudents: number;
    activeParents: number;
  };
}

export default function AdminAnalysisPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '7days',
    school: 'all',
    grade: 'all',
    status: 'all',
  });

  // Mock data for demonstration
  const mockAnalysisData: AnalysisData = {
    totalAssessments: 15847,
    pendingAnalysis: 23,
    completedToday: 156,
    averageScore: 82.4,
    recentUploads: [
      {
        id: 'ASS-2024-001',
        studentName: 'John Doe',
        grade: 'Grade 8',
        school: 'Springfield Elementary',
        uploadTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'completed',
        score: 85,
        type: 'Academic Assessment'
      },
      {
        id: 'ASS-2024-002',
        studentName: 'Jane Smith',
        grade: 'Grade 10',
        school: 'Riverside High School',
        uploadTime: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        status: 'processing',
        score: null,
        type: 'Comprehensive 360°'
      },
      {
        id: 'ASS-2024-003',
        studentName: 'Mike Johnson',
        grade: 'Grade 6',
        school: 'Greenwood School',
        uploadTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: 'completed',
        score: 78,
        type: 'Physical Health'
      },
    ],
    systemStats: {
      totalUsers: 2847,
      totalSchools: 45,
      totalStudents: 12500,
      activeParents: 8932,
    }
  };

  const weeklyData = [
    { day: 'Mon', assessments: 234, avgScore: 81 },
    { day: 'Tue', assessments: 287, avgScore: 83 },
    { day: 'Wed', assessments: 195, avgScore: 79 },
    { day: 'Thu', assessments: 312, avgScore: 85 },
    { day: 'Fri', assessments: 267, avgScore: 82 },
    { day: 'Sat', assessments: 156, avgScore: 80 },
    { day: 'Sun', assessments: 98, avgScore: 78 },
  ];

  const categoryData = [
    { name: 'Academic', value: 45, color: '#3B82F6' },
    { name: 'Physical', value: 30, color: '#10B981' },
    { name: 'Psychological', value: 25, color: '#8B5CF6' },
  ];

  const gradeDistribution = [
    { grade: 'Nursery-UKG', count: 1250 },
    { grade: 'Grade 1-5', count: 3800 },
    { grade: 'Grade 6-8', count: 3200 },
    { grade: 'Grade 9-10', count: 2850 },
    { grade: 'Grade 11-12', count: 1400 },
  ];

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAnalysisData(mockAnalysisData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
      toast.error('Failed to load analysis data');
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setAnalyzing(true);

    try {
      // Simulate file analysis (bypassing payment for admin)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('adminOverride', 'true');

      // Simulate API call
      setTimeout(() => {
        toast.success('Analysis completed successfully! (Admin override - no payment required)');
        setAnalyzing(false);
        setSelectedFile(null);
        // Refresh data
        fetchAnalysisData();
      }, 3000);

    } catch (error) {
      console.error('Error analyzing file:', error);
      toast.error('Failed to analyze file');
      setAnalyzing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>;
      case 'processing':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Processing</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Failed</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3" />
              Admin Analysis Dashboard
            </h1>
            <p className="text-blue-100 mt-2">
              Unrestricted access to all assessment analysis and system insights
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Admin Override Active</div>
            <div className="text-lg font-semibold">No Payment Required</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-3xl font-bold text-blue-600">{analysisData?.totalAssessments.toLocaleString()}</p>
            </div>
            <DocumentIcon className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Analysis</p>
              <p className="text-3xl font-bold text-yellow-600">{analysisData?.pendingAnalysis}</p>
            </div>
            <ClockIcon className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-green-600">{analysisData?.completedToday}</p>
            </div>
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-purple-600">{analysisData?.averageScore}%</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Admin Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <DocumentArrowUpIcon className="h-6 w-6 mr-2 text-blue-600" />
          Admin Analysis Upload (Payment Bypass)
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {analyzing ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-lg font-medium">Analyzing {selectedFile?.name}...</p>
              <p className="text-sm text-gray-500">Admin override active - no payment required</p>
            </div>
          ) : (
            <div className="space-y-4">
              <DocumentArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Upload Assessment Documents</h3>
                <p className="text-gray-500">Drag and drop files or click to browse</p>
                <p className="text-sm text-blue-600 font-medium">✓ Admin Access - No Payment Required</p>
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="admin-file-upload"
              />
              <label
                htmlFor="admin-file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Choose Files
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Assessment Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="assessments" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Assessment Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">System Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <UserGroupIcon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analysisData?.systemStats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <div className="text-center">
            <BuildingOfficeIcon className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analysisData?.systemStats.totalSchools}</p>
            <p className="text-sm text-gray-600">Schools</p>
          </div>
          <div className="text-center">
            <AcademicCapIcon className="h-12 w-12 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analysisData?.systemStats.totalStudents.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div className="text-center">
            <UserIcon className="h-12 w-12 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{analysisData?.systemStats.activeParents.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Active Parents</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Assessment Activity</h2>
          <div className="flex space-x-2">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="1hour">Last Hour</option>
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assessment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analysisData?.recentUploads.map((upload) => (
                <tr key={upload.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {upload.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{upload.studentName}</div>
                      <div className="text-sm text-gray-500">{upload.grade}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {upload.school}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {upload.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(upload.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {upload.score ? `${upload.score}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimeAgo(upload.uploadTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <DocumentIcon className="h-4 w-4" />
                    </button>
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
