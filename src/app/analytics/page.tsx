'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ChartBarIcon,
  PresentationChartLineIcon,
  DocumentChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowPathIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalAssessments: number;
    completionRate: number;
    averageScore: number;
    trends: {
      students: number;
      assessments: number;
      completion: number;
      score: number;
    };
  };
  performanceData: any[];
  engagementData: any[];
  subjectPerformance: any[];
  timeSeriesData: any[];
  demographicData: any[];
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('performance');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Only allow certain roles to access analytics
    if (!['ADMIN', 'TEACHER', 'COUNSELOR'].includes(session.user.role)) {
      router.push('/dashboard');
      return;
    }

    fetchAnalyticsData();
  }, [session, status, router, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Mock comprehensive analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalStudents: 44,
          totalAssessments: 132,
          completionRate: 87.5,
          averageScore: 78.3,
          trends: {
            students: 12.5,
            assessments: 23.1,
            completion: -2.3,
            score: 5.7
          }
        },
        performanceData: [
          { subject: 'Mathematics', average: 82.5, students: 25, assessments: 45 },
          { subject: 'Science', average: 79.2, students: 22, assessments: 38 },
          { subject: 'English', average: 85.1, students: 28, assessments: 42 },
          { subject: 'History', average: 76.8, students: 20, assessments: 35 },
          { subject: 'Psychology', average: 88.3, students: 15, assessments: 28 }
        ],
        engagementData: [
          { day: 'Monday', logins: 35, assessments: 12, avgTime: 45 },
          { day: 'Tuesday', logins: 42, assessments: 18, avgTime: 52 },
          { day: 'Wednesday', logins: 38, assessments: 15, avgTime: 48 },
          { day: 'Thursday', logins: 45, assessments: 22, avgTime: 55 },
          { day: 'Friday', logins: 40, assessments: 16, avgTime: 43 },
          { day: 'Saturday', logins: 25, assessments: 8, avgTime: 38 },
          { day: 'Sunday', logins: 20, assessments: 5, avgTime: 35 }
        ],
        subjectPerformance: [
          { grade: 'Grade 9', math: 75, science: 78, english: 82, history: 74 },
          { grade: 'Grade 10', math: 79, science: 81, english: 85, history: 77 },
          { grade: 'Grade 11', math: 83, science: 85, english: 88, history: 80 },
          { grade: 'Grade 12', math: 87, science: 89, english: 91, history: 84 }
        ],
        timeSeriesData: [
          { date: '2024-01-01', completions: 15, avgScore: 76.2 },
          { date: '2024-01-08', completions: 22, avgScore: 78.1 },
          { date: '2024-01-15', completions: 28, avgScore: 79.5 },
          { date: '2024-01-22', completions: 35, avgScore: 77.8 },
          { date: '2024-01-29', completions: 42, avgScore: 80.2 }
        ],
        demographicData: [
          { category: 'Grade 9', value: 12, percentage: 27.3 },
          { category: 'Grade 10', value: 15, percentage: 34.1 },
          { category: 'Grade 11', value: 10, percentage: 22.7 },
          { category: 'Grade 12', value: 7, percentage: 15.9 }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session || !['ADMIN', 'TEACHER', 'COUNSELOR'].includes(session.user.role)) {
    return null;
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { overview, performanceData, engagementData, subjectPerformance, timeSeriesData, demographicData } = analyticsData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive insights into student performance and engagement
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="form-input"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={fetchAnalyticsData}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5 inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{overview.totalStudents}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 flex items-center">
              {overview.trends.students >= 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${overview.trends.students >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(overview.trends.students)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Assessments</p>
                <p className="text-3xl font-bold text-gray-900">{overview.totalAssessments}</p>
              </div>
              <DocumentChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center">
              {overview.trends.assessments >= 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${overview.trends.assessments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(overview.trends.assessments)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{overview.completionRate}%</p>
              </div>
              <PresentationChartLineIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4 flex items-center">
              {overview.trends.completion >= 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${overview.trends.completion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(overview.trends.completion)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{overview.averageScore}%</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4 flex items-center">
              {overview.trends.score >= 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${overview.trends.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(overview.trends.score)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance by Subject */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Performance by Subject</h3>
            <Plot
              data={[
                {
                  x: performanceData.map(d => d.subject),
                  y: performanceData.map(d => d.average),
                  type: 'bar',
                  marker: {
                    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
                  }
                }
              ]}
              layout={{
                height: 300,
                margin: { l: 40, r: 40, t: 20, b: 40 },
                xaxis: { title: 'Subject' },
                yaxis: { title: 'Average Score (%)' },
                showlegend: false
              }}
              config={{ displayModeBar: false }}
              className="w-full"
            />
          </div>

          {/* Weekly Engagement */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Weekly Engagement</h3>
            <Plot
              data={[
                {
                  x: engagementData.map(d => d.day),
                  y: engagementData.map(d => d.logins),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Logins',
                  line: { color: '#3B82F6' }
                },
                {
                  x: engagementData.map(d => d.day),
                  y: engagementData.map(d => d.assessments),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Assessments',
                  line: { color: '#10B981' }
                }
              ]}
              layout={{
                height: 300,
                margin: { l: 40, r: 40, t: 20, b: 40 },
                xaxis: { title: 'Day of Week' },
                yaxis: { title: 'Count' },
                legend: { x: 0, y: 1 }
              }}
              config={{ displayModeBar: false }}
              className="w-full"
            />
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Grade Performance Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Performance by Grade Level</h3>
            <Plot
              data={[
                {
                  x: subjectPerformance.map(d => d.grade),
                  y: subjectPerformance.map(d => d.math),
                  type: 'bar',
                  name: 'Mathematics',
                  marker: { color: '#3B82F6' }
                },
                {
                  x: subjectPerformance.map(d => d.grade),
                  y: subjectPerformance.map(d => d.science),
                  type: 'bar',
                  name: 'Science',
                  marker: { color: '#10B981' }
                },
                {
                  x: subjectPerformance.map(d => d.grade),
                  y: subjectPerformance.map(d => d.english),
                  type: 'bar',
                  name: 'English',
                  marker: { color: '#F59E0B' }
                },
                {
                  x: subjectPerformance.map(d => d.grade),
                  y: subjectPerformance.map(d => d.history),
                  type: 'bar',
                  name: 'History',
                  marker: { color: '#EF4444' }
                }
              ]}
              layout={{
                height: 300,
                margin: { l: 40, r: 40, t: 20, b: 40 },
                xaxis: { title: 'Grade Level' },
                yaxis: { title: 'Average Score (%)' },
                barmode: 'group',
                legend: { x: 0, y: 1 }
              }}
              config={{ displayModeBar: false }}
              className="w-full"
            />
          </div>

          {/* Student Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Student Distribution by Grade</h3>
            <Plot
              data={[
                {
                  labels: demographicData.map(d => d.category),
                  values: demographicData.map(d => d.value),
                  type: 'pie',
                  marker: {
                    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
                  }
                }
              ]}
              layout={{
                height: 300,
                margin: { l: 40, r: 40, t: 20, b: 40 },
                showlegend: true,
                legend: { x: 0, y: 0 }
              }}
              config={{ displayModeBar: false }}
              className="w-full"
            />
          </div>
        </div>

        {/* Time Series Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Assessment Trends Over Time</h3>
          <Plot
            data={[
              {
                x: timeSeriesData.map(d => d.date),
                y: timeSeriesData.map(d => d.completions),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Completions',
                yaxis: 'y',
                line: { color: '#3B82F6' }
              },
              {
                x: timeSeriesData.map(d => d.date),
                y: timeSeriesData.map(d => d.avgScore),
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Avg Score (%)',
                yaxis: 'y2',
                line: { color: '#10B981' }
              }
            ]}
            layout={{
              height: 400,
              margin: { l: 60, r: 60, t: 20, b: 60 },
              xaxis: { title: 'Date' },
              yaxis: { 
                title: 'Number of Completions',
                side: 'left'
              },
              yaxis2: {
                title: 'Average Score (%)',
                side: 'right',
                overlaying: 'y'
              },
              legend: { x: 0, y: 1 }
            }}
            config={{ displayModeBar: false }}
            className="w-full"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/reports/generate"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentChartBarIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h4 className="font-medium text-gray-900">Generate Report</h4>
                <p className="text-sm text-gray-500">Create detailed analytics report</p>
              </div>
            </Link>
            
            <Link
              href="/assessments"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AcademicCapIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h4 className="font-medium text-gray-900">View Assessments</h4>
                <p className="text-sm text-gray-500">Browse all assessment data</p>
              </div>
            </Link>
            
            <Link
              href="/admin/users"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UsersIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h4 className="font-medium text-gray-900">Manage Users</h4>
                <p className="text-sm text-gray-500">User administration panel</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
