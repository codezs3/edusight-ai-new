'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  GlobeAltIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import RadarChart from '@/components/charts/RadarChart';

interface AnalyticsData {
  overview: {
    totalSchools: number;
    totalStudents: number;
    totalTeachers: number;
    totalRevenue: number;
    growth: {
      schools: number;
      students: number;
      revenue: number;
    };
  };
  trends: {
    userGrowth: {
      labels: string[];
      schools: number[];
      students: number[];
      teachers: number[];
    };
    revenue: {
      labels: string[];
      data: number[];
    };
  };
  distribution: {
    schoolTypes: {
      labels: string[];
      data: number[];
    };
    subscriptionTiers: {
      labels: string[];
      data: number[];
    };
    frameworks: {
      labels: string[];
      data: number[];
    };
  };
  performance: {
    schoolPerformance: {
      labels: string[];
      data: number[];
    };
    systemHealth: {
      labels: string[];
      data: number[];
    };
  };
}

export default function AdminAnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    generateMockAnalytics();
  }, [selectedPeriod]);

  const generateMockAnalytics = () => {
    // Generate comprehensive mock analytics data
    const mockData: AnalyticsData = {
      overview: {
        totalSchools: 1247,
        totalStudents: 45632,
        totalTeachers: 8934,
        totalRevenue: 2847650,
        growth: {
          schools: 23.5,
          students: 18.7,
          revenue: 34.2
        }
      },
      trends: {
        userGrowth: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          schools: [950, 1025, 1089, 1156, 1203, 1247],
          students: [32450, 35678, 38912, 41234, 43567, 45632],
          teachers: [6789, 7234, 7678, 8123, 8567, 8934]
        },
        revenue: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [1890000, 2120000, 2356000, 2478000, 2689000, 2847650]
        }
      },
      distribution: {
        schoolTypes: {
          labels: ['Private', 'Public', 'International', 'Other'],
          data: [567, 389, 234, 57]
        },
        subscriptionTiers: {
          labels: ['Trial', 'Basic', 'Premium', 'Enterprise'],
          data: [234, 456, 398, 159]
        },
        frameworks: {
          labels: ['CBSE', 'ICSE', 'IGCSE', 'IB', 'Multiple', 'Other'],
          data: [423, 289, 198, 156, 134, 47]
        }
      },
      performance: {
        schoolPerformance: {
          labels: ['Student Engagement', 'Academic Progress', 'Teacher Satisfaction', 'System Usage', 'Support Rating'],
          data: [87, 92, 85, 94, 89]
        },
        systemHealth: {
          labels: ['Uptime', 'Response Time', 'Error Rate', 'Security Score', 'Performance'],
          data: [99.8, 95, 99.2, 96, 93]
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
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into platform performance and growth</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Schools</p>
              <p className="text-3xl font-bold">{analyticsData.overview.totalSchools.toLocaleString()}</p>
              <p className="text-blue-100 text-sm mt-1">
                +{analyticsData.overview.growth.schools}% this month
              </p>
            </div>
            <BuildingOfficeIcon className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Students</p>
              <p className="text-3xl font-bold">{analyticsData.overview.totalStudents.toLocaleString()}</p>
              <p className="text-green-100 text-sm mt-1">
                +{analyticsData.overview.growth.students}% this month
              </p>
            </div>
            <AcademicCapIcon className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Teachers</p>
              <p className="text-3xl font-bold">{analyticsData.overview.totalTeachers.toLocaleString()}</p>
              <p className="text-purple-100 text-sm mt-1">
                +12.3% this month
              </p>
            </div>
            <UserGroupIcon className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">₹{(analyticsData.overview.totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-orange-100 text-sm mt-1">
                +{analyticsData.overview.growth.revenue}% this month
              </p>
            </div>
            <CurrencyDollarIcon className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Growth Trends</h3>
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <LineChart
            data={{
              labels: analyticsData.trends.userGrowth.labels,
              datasets: [
                {
                  label: 'Schools',
                  data: analyticsData.trends.userGrowth.schools,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Students',
                  data: analyticsData.trends.userGrowth.students,
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Teachers',
                  data: analyticsData.trends.userGrowth.teachers,
                  borderColor: '#8B5CF6',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            }}
            height={300}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Growth</h3>
            <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
          </div>
          <BarChart
            data={{
              labels: analyticsData.trends.revenue.labels,
              datasets: [
                {
                  label: 'Revenue (₹)',
                  data: analyticsData.trends.revenue.data,
                  backgroundColor: [
                    '#F59E0B',
                    '#EF4444',
                    '#10B981',
                    '#3B82F6',
                    '#8B5CF6',
                    '#F97316'
                  ],
                  borderColor: [
                    '#D97706',
                    '#DC2626',
                    '#059669',
                    '#2563EB',
                    '#7C3AED',
                    '#EA580C'
                  ],
                  borderWidth: 2
                }
              ]
            }}
            height={300}
          />
        </div>
      </div>

      {/* Distribution Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">School Types</h3>
            <BuildingOfficeIcon className="w-5 h-5 text-blue-500" />
          </div>
          <DoughnutChart
            data={{
              labels: analyticsData.distribution.schoolTypes.labels,
              datasets: [
                {
                  data: analyticsData.distribution.schoolTypes.data,
                  backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444'
                  ],
                  borderColor: [
                    '#2563EB',
                    '#059669',
                    '#D97706',
                    '#DC2626'
                  ],
                  borderWidth: 2
                }
              ]
            }}
            height={250}
            centerText={{
              value: analyticsData.distribution.schoolTypes.data.reduce((a, b) => a + b, 0),
              label: 'Total Schools'
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Subscription Tiers</h3>
            <ChartBarIcon className="w-5 h-5 text-purple-500" />
          </div>
          <DoughnutChart
            data={{
              labels: analyticsData.distribution.subscriptionTiers.labels,
              datasets: [
                {
                  data: analyticsData.distribution.subscriptionTiers.data,
                  backgroundColor: [
                    '#FDE047',
                    '#60A5FA',
                    '#A78BFA',
                    '#34D399'
                  ],
                  borderColor: [
                    '#FACC15',
                    '#3B82F6',
                    '#8B5CF6',
                    '#10B981'
                  ],
                  borderWidth: 2
                }
              ]
            }}
            height={250}
            centerText={{
              value: analyticsData.distribution.subscriptionTiers.data.reduce((a, b) => a + b, 0),
              label: 'Active Plans'
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Academic Frameworks</h3>
            <GlobeAltIcon className="w-5 h-5 text-green-500" />
          </div>
          <BarChart
            data={{
              labels: analyticsData.distribution.frameworks.labels,
              datasets: [
                {
                  label: 'Schools',
                  data: analyticsData.distribution.frameworks.data,
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
            height={250}
            horizontal={true}
          />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">School Performance Metrics</h3>
            <AcademicCapIcon className="w-5 h-5 text-blue-500" />
          </div>
          <RadarChart
            data={{
              labels: analyticsData.performance.schoolPerformance.labels,
              datasets: [
                {
                  label: 'Average Score',
                  data: analyticsData.performance.schoolPerformance.data,
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderColor: '#3B82F6',
                  borderWidth: 2,
                  fill: true
                }
              ]
            }}
            height={300}
            maxValue={100}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Health Metrics</h3>
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <RadarChart
            data={{
              labels: analyticsData.performance.systemHealth.labels,
              datasets: [
                {
                  label: 'Health Score',
                  data: analyticsData.performance.systemHealth.data,
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

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Key Insights & Recommendations</h3>
          <CalendarIcon className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUpIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Growth Trend</span>
            </div>
            <p className="text-sm text-green-700">
              Student enrollment is up 18.7% this month, with private schools leading growth.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Revenue Insight</span>
            </div>
            <p className="text-sm text-blue-700">
              Premium subscriptions account for 32% of revenue with highest retention rates.
            </p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <UserGroupIcon className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">User Engagement</span>
            </div>
            <p className="text-sm text-purple-700">
              CBSE schools show highest platform engagement with 94% active usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
