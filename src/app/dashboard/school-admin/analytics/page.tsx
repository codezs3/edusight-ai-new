'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  ChartBarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BookOpenIcon,
  TrophyIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import RadarChart from '@/components/charts/RadarChart';

interface SchoolAnalyticsData {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    averageGrade: number;
    attendance: number;
    growth: {
      students: number;
      performance: number;
      attendance: number;
    };
  };
  performance: {
    gradeDistribution: {
      labels: string[];
      data: number[];
    };
    subjectPerformance: {
      labels: string[];
      data: number[];
    };
    classPerformance: {
      labels: string[];
      datasets: {
        mathematics: number[];
        english: number[];
        science: number[];
      };
    };
  };
  trends: {
    attendanceTrend: {
      labels: string[];
      data: number[];
    };
    performanceTrend: {
      labels: string[];
      data: number[];
    };
  };
  demographics: {
    gradeDistribution: {
      labels: string[];
      data: number[];
    };
    genderDistribution: {
      labels: string[];
      data: number[];
    };
  };
  insights: {
    topPerformers: Array<{
      name: string;
      grade: string;
      score: number;
    }>;
    needsAttention: Array<{
      name: string;
      grade: string;
      issue: string;
    }>;
    teacherPerformance: {
      labels: string[];
      data: number[];
    };
  };
}

export default function SchoolAnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<SchoolAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedGrade, setSelectedGrade] = useState('all');

  useEffect(() => {
    generateMockSchoolAnalytics();
  }, [selectedPeriod, selectedGrade]);

  const generateMockSchoolAnalytics = () => {
    const mockData: SchoolAnalyticsData = {
      overview: {
        totalStudents: 847,
        totalTeachers: 42,
        averageGrade: 83.7,
        attendance: 94.2,
        growth: {
          students: 8.3,
          performance: 12.5,
          attendance: 3.2
        }
      },
      performance: {
        gradeDistribution: {
          labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Below C'],
          data: [145, 198, 156, 134, 98, 76, 40]
        },
        subjectPerformance: {
          labels: ['Mathematics', 'English', 'Science', 'Social Studies', 'Computer Science', 'Hindi'],
          data: [87.3, 82.1, 89.4, 78.9, 91.2, 79.6]
        },
        classPerformance: {
          labels: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
          datasets: {
            mathematics: [82, 79, 84, 86, 88, 85, 87],
            english: [78, 81, 83, 79, 82, 84, 86],
            science: [85, 87, 89, 91, 88, 86, 89]
          }
        }
      },
      trends: {
        attendanceTrend: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
          data: [92.5, 93.2, 94.1, 93.8, 94.5, 93.9, 94.2, 94.8]
        },
        performanceTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [78.5, 79.8, 81.2, 82.4, 83.1, 83.7]
        }
      },
      demographics: {
        gradeDistribution: {
          labels: ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
          data: [120, 125, 118, 122, 115, 124, 123]
        },
        genderDistribution: {
          labels: ['Male', 'Female'],
          data: [432, 415]
        }
      },
      insights: {
        topPerformers: [
          { name: 'Aarav Sharma', grade: '10th', score: 97.8 },
          { name: 'Priya Patel', grade: '12th', score: 96.5 },
          { name: 'Rohan Kumar', grade: '9th', score: 95.9 },
          { name: 'Ananya Singh', grade: '11th', score: 95.2 },
          { name: 'Vikram Mehta', grade: '10th', score: 94.8 }
        ],
        needsAttention: [
          { name: 'Rahul Gupta', grade: '8th', issue: 'Low Mathematics Score' },
          { name: 'Shreya Jain', grade: '7th', issue: 'Poor Attendance' },
          { name: 'Amit Verma', grade: '9th', issue: 'Declining Performance' }
        ],
        teacherPerformance: {
          labels: ['Student Engagement', 'Academic Results', 'Innovation', 'Communication', 'Professional Development'],
          data: [88, 92, 85, 90, 87]
        }
      }
    };

    setAnalyticsData(mockData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into student and school performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Grades</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Students</p>
              <p className="text-3xl font-bold">{analyticsData.overview.totalStudents}</p>
              <p className="text-blue-100 text-sm mt-1">
                +{analyticsData.overview.growth.students}% this semester
              </p>
            </div>
            <AcademicCapIcon className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Average Grade</p>
              <p className="text-3xl font-bold">{analyticsData.overview.averageGrade}%</p>
              <p className="text-green-100 text-sm mt-1">
                +{analyticsData.overview.growth.performance}% improvement
              </p>
            </div>
            <TrophyIcon className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Attendance Rate</p>
              <p className="text-3xl font-bold">{analyticsData.overview.attendance}%</p>
              <p className="text-purple-100 text-sm mt-1">
                +{analyticsData.overview.growth.attendance}% this month
              </p>
            </div>
            <ClockIcon className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Teaching Staff</p>
              <p className="text-3xl font-bold">{analyticsData.overview.totalTeachers}</p>
              <p className="text-orange-100 text-sm mt-1">
                Active educators
              </p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
            <BookOpenIcon className="w-5 h-5 text-blue-500" />
          </div>
          <BarChart
            data={{
              labels: analyticsData.performance.subjectPerformance.labels,
              datasets: [
                {
                  label: 'Average Score (%)',
                  data: analyticsData.performance.subjectPerformance.data,
                  backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#6B7280'
                  ],
                  borderColor: [
                    '#2563EB',
                    '#059669',
                    '#D97706',
                    '#DC2626',
                    '#7C3AED',
                    '#4B5563'
                  ],
                  borderWidth: 2
                }
              ]
            }}
            height={300}
            yAxisMax={100}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
            <ChartBarIcon className="w-5 h-5 text-green-500" />
          </div>
          <DoughnutChart
            data={{
              labels: analyticsData.performance.gradeDistribution.labels,
              datasets: [
                {
                  data: analyticsData.performance.gradeDistribution.data,
                  backgroundColor: [
                    '#10B981',
                    '#34D399',
                    '#60A5FA',
                    '#3B82F6',
                    '#F59E0B',
                    '#EF4444',
                    '#DC2626'
                  ],
                  borderColor: [
                    '#059669',
                    '#10B981',
                    '#3B82F6',
                    '#2563EB',
                    '#D97706',
                    '#DC2626',
                    '#B91C1C'
                  ],
                  borderWidth: 2
                }
              ]
            }}
            height={300}
            centerText={{
              value: analyticsData.performance.gradeDistribution.data.reduce((a, b) => a + b, 0),
              label: 'Total Students'
            }}
          />
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
            <TrophyIcon className="w-5 h-5 text-green-500" />
          </div>
          <LineChart
            data={{
              labels: analyticsData.trends.performanceTrend.labels,
              datasets: [
                {
                  label: 'Average Performance (%)',
                  data: analyticsData.trends.performanceTrend.data,
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            }}
            height={300}
            yAxisMax={100}
            yAxisMin={70}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trend</h3>
            <ClockIcon className="w-5 h-5 text-blue-500" />
          </div>
          <LineChart
            data={{
              labels: analyticsData.trends.attendanceTrend.labels,
              datasets: [
                {
                  label: 'Attendance Rate (%)',
                  data: analyticsData.trends.attendanceTrend.data,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            }}
            height={300}
            yAxisMax={100}
            yAxisMin={90}
          />
        </div>
      </div>

      {/* Class Performance Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Class-wise Performance Comparison</h3>
          <AcademicCapIcon className="w-5 h-5 text-purple-500" />
        </div>
        <LineChart
          data={{
            labels: analyticsData.performance.classPerformance.labels,
            datasets: [
              {
                label: 'Mathematics',
                data: analyticsData.performance.classPerformance.datasets.mathematics,
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'English',
                data: analyticsData.performance.classPerformance.datasets.english,
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: false,
                tension: 0.4
              },
              {
                label: 'Science',
                data: analyticsData.performance.classPerformance.datasets.science,
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: false,
                tension: 0.4
              }
            ]
          }}
          height={350}
          yAxisMax={100}
          yAxisMin={70}
        />
      </div>

      {/* Demographics and Teacher Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Student Demographics</h3>
            <UserGroupIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Grade Distribution</h4>
              <BarChart
                data={{
                  labels: analyticsData.demographics.gradeDistribution.labels,
                  datasets: [
                    {
                      label: 'Students',
                      data: analyticsData.demographics.gradeDistribution.data,
                      backgroundColor: '#3B82F6',
                      borderColor: '#2563EB',
                      borderWidth: 2
                    }
                  ]
                }}
                height={200}
                showLegend={false}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Gender Distribution</h4>
              <DoughnutChart
                data={{
                  labels: analyticsData.demographics.genderDistribution.labels,
                  datasets: [
                    {
                      data: analyticsData.demographics.genderDistribution.data,
                      backgroundColor: ['#3B82F6', '#EC4899'],
                      borderColor: ['#2563EB', '#DB2777'],
                      borderWidth: 2
                    }
                  ]
                }}
                height={200}
                showLegend={false}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Teacher Performance Metrics</h3>
            <TrophyIcon className="w-5 h-5 text-green-500" />
          </div>
          <RadarChart
            data={{
              labels: analyticsData.insights.teacherPerformance.labels,
              datasets: [
                {
                  label: 'Average Score',
                  data: analyticsData.insights.teacherPerformance.data,
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  borderColor: '#10B981',
                  borderWidth: 2,
                  fill: true
                }
              ]
            }}
            height={300}
            maxValue={100}
          />
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.insights.topPerformers.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.grade} Grade</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{student.score}%</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.floor(student.score / 20) ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Needs Attention</h3>
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {analyticsData.insights.needsAttention.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.grade} Grade</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-orange-600">{student.issue}</p>
                  <button className="text-xs text-orange-500 hover:text-orange-700 underline mt-1">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
