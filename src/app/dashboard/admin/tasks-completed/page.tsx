'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  BeakerIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

interface TaskLog {
  id: string;
  uniqueTaskId: string;
  taskType: 'ASSESSMENT_UPLOAD' | 'DOCUMENT_ANALYSIS' | 'PDF_GENERATION' | 'ML_PROCESSING' | 'SCORE_CALCULATION' | 'REPORT_GENERATION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  userId?: string;
  studentId?: string;
  schoolId?: string;
  documentId?: string;
  processingTime: number; // in milliseconds
  startTime: Date;
  endTime?: Date;
  errorMessage?: string;
  metadata: {
    fileName?: string;
    fileSize?: number;
    assessmentType?: string;
    scores?: any;
    mlModelVersion?: string;
    processingSteps?: string[];
    userRole?: string;
    paymentBypass?: boolean;
  };
  systemInfo: {
    serverInstance: string;
    memoryUsage: number;
    cpuUsage: number;
    diskSpace: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default function TasksCompletedPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<TaskLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    taskType: 'all',
    dateRange: '24hours',
    user: 'all',
  });
  const [selectedTask, setSelectedTask] = useState<TaskLog | null>(null);

  // Mock data for demonstration
  const mockTasks: TaskLog[] = [
    {
      id: '1',
      uniqueTaskId: 'TASK-2024-001-789ABC',
      taskType: 'ASSESSMENT_UPLOAD',
      status: 'COMPLETED',
      userId: 'user123',
      studentId: 'student456',
      schoolId: 'school789',
      documentId: 'doc123',
      processingTime: 15000, // 15 seconds
      startTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      endTime: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
      metadata: {
        fileName: 'math_assessment_grade8.pdf',
        fileSize: 2048576, // 2MB
        assessmentType: 'Academic - Mathematics',
        scores: { academic: 85, physical: null, psychological: null },
        userRole: 'PARENT',
        paymentBypass: false,
      },
      systemInfo: {
        serverInstance: 'server-01',
        memoryUsage: 75.2,
        cpuUsage: 45.8,
        diskSpace: 78.9,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 29),
    },
    {
      id: '2',
      uniqueTaskId: 'TASK-2024-002-456DEF',
      taskType: 'ML_PROCESSING',
      status: 'PROCESSING',
      userId: 'admin001',
      studentId: 'student789',
      processingTime: 45000, // 45 seconds so far
      startTime: new Date(Date.now() - 1000 * 45), // 45 seconds ago
      metadata: {
        fileName: 'comprehensive_report_grade10.pdf',
        fileSize: 5242880, // 5MB
        assessmentType: '360° Comprehensive',
        mlModelVersion: 'v2.1.3',
        processingSteps: ['Document OCR', 'Data Extraction', 'Score Calculation', 'Prediction Analysis'],
        userRole: 'ADMIN',
        paymentBypass: true,
      },
      systemInfo: {
        serverInstance: 'server-02',
        memoryUsage: 82.1,
        cpuUsage: 78.4,
        diskSpace: 65.3,
      },
      createdAt: new Date(Date.now() - 1000 * 45),
      updatedAt: new Date(Date.now() - 1000 * 5),
    },
    {
      id: '3',
      uniqueTaskId: 'TASK-2024-003-123GHI',
      taskType: 'PDF_GENERATION',
      status: 'COMPLETED',
      userId: 'parent456',
      studentId: 'student123',
      documentId: 'report789',
      processingTime: 8000, // 8 seconds
      startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      endTime: new Date(Date.now() - 1000 * 60 * 59), // 59 minutes ago
      metadata: {
        fileName: 'branded_assessment_report.pdf',
        fileSize: 1048576, // 1MB
        assessmentType: 'Branded Assessment Report',
        userRole: 'PARENT',
        paymentBypass: false,
      },
      systemInfo: {
        serverInstance: 'server-01',
        memoryUsage: 68.5,
        cpuUsage: 32.1,
        diskSpace: 78.9,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      updatedAt: new Date(Date.now() - 1000 * 60 * 59),
    },
    {
      id: '4',
      uniqueTaskId: 'TASK-2024-004-789JKL',
      taskType: 'DOCUMENT_ANALYSIS',
      status: 'FAILED',
      userId: 'parent789',
      studentId: 'student456',
      processingTime: 120000, // 2 minutes
      startTime: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      endTime: new Date(Date.now() - 1000 * 60 * 118), // 1 hour 58 minutes ago
      errorMessage: 'Document format not supported: .docx files with embedded images require premium analysis',
      metadata: {
        fileName: 'physics_lab_report.docx',
        fileSize: 10485760, // 10MB
        assessmentType: 'Physical Science Lab',
        userRole: 'PARENT',
        paymentBypass: false,
      },
      systemInfo: {
        serverInstance: 'server-03',
        memoryUsage: 91.2,
        cpuUsage: 65.7,
        diskSpace: 45.2,
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 120),
      updatedAt: new Date(Date.now() - 1000 * 60 * 118),
    },
  ];

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        let filteredTasks = [...mockTasks];

        // Apply filters
        if (filters.status !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.status === filters.status);
        }
        if (filters.taskType !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.taskType === filters.taskType);
        }

        // Apply search
        if (searchTerm) {
          filteredTasks = filteredTasks.filter(task => 
            task.uniqueTaskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.metadata.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.metadata.assessmentType?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setTasks(filteredTasks);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load task logs');
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'PROCESSING':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>;
      case 'FAILED':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-600" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium";
    switch (status) {
      case 'COMPLETED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'PROCESSING':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'FAILED':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'CANCELLED':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'ASSESSMENT_UPLOAD':
        return <DocumentArrowDownIcon className="h-5 w-5 text-blue-600" />;
      case 'ML_PROCESSING':
        return <CpuChipIcon className="h-5 w-5 text-purple-600" />;
      case 'PDF_GENERATION':
        return <DocumentArrowDownIcon className="h-5 w-5 text-green-600" />;
      case 'DOCUMENT_ANALYSIS':
        return <BeakerIcon className="h-5 w-5 text-orange-600" />;
      case 'SCORE_CALCULATION':
        return <ChartBarIcon className="h-5 w-5 text-indigo-600" />;
      case 'REPORT_GENERATION':
        return <AcademicCapIcon className="h-5 w-5 text-pink-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const processing = tasks.filter(t => t.status === 'PROCESSING').length;
    const failed = tasks.filter(t => t.status === 'FAILED').length;
    const avgProcessingTime = tasks
      .filter(t => t.status === 'COMPLETED')
      .reduce((acc, t) => acc + t.processingTime, 0) / completed || 0;

    return { total, completed, processing, failed, avgProcessingTime };
  };

  const stats = getTaskStats();

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
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <ClockIcon className="h-8 w-8 mr-3" />
              Tasks Completed Log
            </h1>
            <p className="text-gray-300 mt-2">
              Internal system log with unique IDs and timestamps for all assessment processing tasks
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-300">Total Tasks</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <ExclamationCircleIcon className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-purple-600">{formatDuration(stats.avgProcessingTime)}</p>
              <p className="text-sm text-gray-600">Avg Time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-indigo-600">{((stats.completed / stats.total) * 100).toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Tasks</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Task ID, file name, or type..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
            <select
              value={filters.taskType}
              onChange={(e) => setFilters({...filters, taskType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="ASSESSMENT_UPLOAD">Assessment Upload</option>
              <option value="ML_PROCESSING">ML Processing</option>
              <option value="PDF_GENERATION">PDF Generation</option>
              <option value="DOCUMENT_ANALYSIS">Document Analysis</option>
              <option value="SCORE_CALCULATION">Score Calculation</option>
              <option value="REPORT_GENERATION">Report Generation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="1hour">Last Hour</option>
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTaskTypeIcon(task.taskType)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {task.uniqueTaskId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.taskType.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <span className={`ml-2 ${getStatusBadge(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    {task.errorMessage && (
                      <div className="text-xs text-red-600 mt-1 max-w-xs truncate">
                        {task.errorMessage}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {task.metadata.userRole}
                      </div>
                      {task.metadata.paymentBypass && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          Admin Override
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {task.metadata.fileName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {task.metadata.fileSize ? formatFileSize(task.metadata.fileSize) : 'Unknown size'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {task.metadata.assessmentType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDuration(task.processingTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Started: {task.startTime.toLocaleTimeString()}
                    </div>
                    {task.endTime && (
                      <div className="text-xs text-gray-500">
                        Ended: {task.endTime.toLocaleTimeString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{task.systemInfo.serverInstance}</div>
                    <div className="text-xs">
                      CPU: {task.systemInfo.cpuUsage.toFixed(1)}%
                    </div>
                    <div className="text-xs">
                      Mem: {task.systemInfo.memoryUsage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
            <p className="text-gray-500">No tasks match your current filters.</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Task Details</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Basic Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unique Task ID:</span>
                        <span className="font-mono text-blue-600">{selectedTask.uniqueTaskId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Task Type:</span>
                        <span>{selectedTask.taskType.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={getStatusBadge(selectedTask.status)}>
                          {selectedTask.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Time:</span>
                        <span>{formatDuration(selectedTask.processingTime)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">File Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Name:</span>
                        <span>{selectedTask.metadata.fileName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span>{selectedTask.metadata.fileSize ? formatFileSize(selectedTask.metadata.fileSize) : 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assessment Type:</span>
                        <span>{selectedTask.metadata.assessmentType || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">System Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Server Instance:</span>
                        <span>{selectedTask.systemInfo.serverInstance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CPU Usage:</span>
                        <span>{selectedTask.systemInfo.cpuUsage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Memory Usage:</span>
                        <span>{selectedTask.systemInfo.memoryUsage.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Disk Space:</span>
                        <span>{selectedTask.systemInfo.diskSpace.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Timestamps</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Started:</span>
                        <span>{selectedTask.startTime.toLocaleString()}</span>
                      </div>
                      {selectedTask.endTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ended:</span>
                          <span>{selectedTask.endTime.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span>{selectedTask.createdAt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span>{selectedTask.updatedAt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTask.metadata.processingSteps && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Processing Steps</h3>
                  <div className="space-y-2">
                    {selectedTask.metadata.processingSteps.map((step, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.errorMessage && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                  <p className="text-sm text-red-700">{selectedTask.errorMessage}</p>
                </div>
              )}

              {selectedTask.metadata.scores && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Assessment Scores</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(selectedTask.metadata.scores).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{value || 'N/A'}</div>
                        <div className="text-sm text-gray-600 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
