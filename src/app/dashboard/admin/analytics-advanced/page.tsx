'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import RechartsLineChart from '@/components/charts/advanced/RechartsLineChart';
import NivoRadarChart from '@/components/charts/advanced/NivoRadarChart';
import TremorDashboard from '@/components/charts/advanced/TremorDashboard';
import {
  SparklesIcon,
  ChartBarIcon,
  CpuChipIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface AdvancedAnalyticsData {
  predictiveMetrics: {
    userGrowth: Array<{
      name: string;
      actual: number;
      predicted?: number;
      schools: number;
      students: number;
    }>;
    aiInsights: {
      trend: 'up' | 'down' | 'stable';
      prediction: string;
      confidence: number;
    };
  };
  performanceRadar: {
    data: Array<{
      metric: string;
      current: number;
      target: number;
      industry: number;
    }>;
    aiInsights: {
      strongestArea: string;
      weakestArea: string;
      recommendation: string;
      balanceScore: number;
    };
  };
  tremorData: {
    overview: Array<{
      title: string;
      value: string | number;
      change: number;
      changeType: 'positive' | 'negative' | 'neutral';
      data: Array<any>;
    }>;
    charts: Array<any>;
  };
  aiRecommendations: Array<{
    type: 'insight' | 'recommendation' | 'alert';
    title: string;
    description: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
    category: string;
  }>;
}

export default function AdvancedAnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  useEffect(() => {
    generateAdvancedAnalytics();
  }, [selectedTimeframe]);

  const generateAdvancedAnalytics = async () => {
    // Simulate AI-powered analytics generation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockData: AdvancedAnalyticsData = {
      predictiveMetrics: {
        userGrowth: [
          { name: 'Jan', actual: 950, schools: 180, students: 32450 },
          { name: 'Feb', actual: 1025, schools: 195, students: 35678 },
          { name: 'Mar', actual: 1089, schools: 210, students: 38912 },
          { name: 'Apr', actual: 1156, schools: 225, students: 41234 },
          { name: 'May', actual: 1203, schools: 240, students: 43567 },
          { name: 'Jun', actual: 1247, schools: 255, students: 45632 },
          { name: 'Jul', predicted: 1290, schools: 270, students: 47800 },
          { name: 'Aug', predicted: 1335, schools: 285, students: 50100 },
          { name: 'Sep', predicted: 1382, schools: 300, students: 52500 }
        ],
        aiInsights: {
          trend: 'up',
          prediction: 'Based on current growth patterns and market analysis, we predict 28% growth in school registrations over the next quarter, driven by increased digitalization in education post-pandemic.',
          confidence: 87
        }
      },
      performanceRadar: {
        data: [
          { metric: 'User Engagement', current: 88, target: 90, industry: 75 },
          { metric: 'Platform Stability', current: 96, target: 98, industry: 85 },
          { metric: 'Customer Satisfaction', current: 92, target: 95, industry: 80 },
          { metric: 'Feature Adoption', current: 78, target: 85, industry: 70 },
          { metric: 'Revenue Growth', current: 85, target: 90, industry: 65 },
          { metric: 'Market Share', current: 72, target: 80, industry: 60 }
        ],
        aiInsights: {
          strongestArea: 'Platform Stability (96/100) - Excellent infrastructure performance',
          weakestArea: 'Market Share (72/100) - Opportunity for aggressive expansion',
          recommendation: 'Focus on feature adoption through improved onboarding and user training programs. Consider strategic partnerships to accelerate market share growth.',
          balanceScore: 85
        }
      },
      tremorData: {
        overview: [
          {
            title: 'Total Revenue',
            value: '₹2.85M',
            change: 34.2,
            changeType: 'positive',
            data: []
          },
          {
            title: 'Active Schools',
            value: '1,247',
            change: 23.5,
            changeType: 'positive',
            data: []
          },
          {
            title: 'Churn Rate',
            value: '2.3%',
            change: -12.5,
            changeType: 'positive',
            data: []
          },
          {
            title: 'AI Accuracy',
            value: '94.7%',
            change: 8.2,
            changeType: 'positive',
            data: []
          }
        ],
        charts: [
          {
            type: 'area',
            title: 'Revenue Prediction with AI Forecasting',
            data: [
              { month: 'Jan', actual: 1890000, predicted: 1850000 },
              { month: 'Feb', actual: 2120000, predicted: 2100000 },
              { month: 'Mar', actual: 2356000, predicted: 2380000 },
              { month: 'Apr', actual: 2478000, predicted: 2450000 },
              { month: 'May', actual: 2689000, predicted: 2700000 },
              { month: 'Jun', actual: 2847650, predicted: 2850000 },
              { month: 'Jul', predicted: 3020000 },
              { month: 'Aug', predicted: 3210000 },
              { month: 'Sep', predicted: 3425000 }
            ],
            categories: ['actual', 'predicted'],
            colors: ['blue', 'cyan'],
            valueFormatter: (value: number) => `₹${(value / 100000).toFixed(1)}L`
          },
          {
            type: 'bar',
            title: 'User Engagement by Feature',
            data: [
              { feature: 'Analytics', usage: 87, satisfaction: 92 },
              { feature: 'Reports', usage: 94, satisfaction: 89 },
              { feature: 'AI Insights', usage: 76, satisfaction: 95 },
              { feature: 'Workflows', usage: 82, satisfaction: 88 },
              { feature: 'Integrations', usage: 68, satisfaction: 85 }
            ],
            categories: ['usage', 'satisfaction'],
            colors: ['blue', 'emerald']
          },
          {
            type: 'donut',
            title: 'AI Model Performance Distribution',
            data: [
              { name: 'Academic Analysis', value: 96.2 },
              { name: 'Career Prediction', value: 94.7 },
              { name: 'Behavioral Assessment', value: 92.1 },
              { name: 'Framework Detection', value: 98.5 },
              { name: 'Performance Prediction', value: 93.8 }
            ],
            colors: ['blue', 'cyan', 'indigo', 'violet', 'purple']
          }
        ]
      },
      aiRecommendations: [
        {
          type: 'insight',
          title: 'Peak Performance Period Detected',
          description: 'AI analysis shows 23% higher engagement during weekday mornings (8-11 AM). Consider scheduling important features and announcements during this window.',
          confidence: 92,
          impact: 'high',
          category: 'User Behavior'
        },
        {
          type: 'recommendation',
          title: 'Predictive Maintenance Alert',
          description: 'System load patterns suggest potential bottlenecks in 3-4 weeks. Recommend infrastructure scaling for database and API services.',
          confidence: 85,
          impact: 'high',
          category: 'Technical'
        },
        {
          type: 'alert',
          title: 'Churn Risk Identification',
          description: '127 schools showing early warning signs of churn based on usage patterns. Automated outreach campaign recommended.',
          confidence: 78,
          impact: 'medium',
          category: 'Customer Success'
        },
        {
          type: 'insight',
          title: 'AI Model Optimization Opportunity',
          description: 'Career prediction accuracy can be improved by 3.2% by incorporating additional behavioral data points from recent user interactions.',
          confidence: 89,
          impact: 'medium',
          category: 'AI/ML'
        },
        {
          type: 'recommendation',
          title: 'Market Expansion Strategy',
          description: 'Data analysis suggests high potential for expansion in tier-2 cities. Consider targeted marketing campaigns in identified regions.',
          confidence: 81,
          impact: 'high',
          category: 'Business Growth'
        }
      ]
    };

    setAnalyticsData(mockData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <CpuChipIcon className="w-8 h-8 text-blue-600 absolute top-4 left-4" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">AI is analyzing your data...</p>
          <p className="text-sm text-gray-600">Generating predictive insights and recommendations</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-blue-600" />
            <span>AI-Powered Analytics</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Advanced insights powered by machine learning and predictive analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="2years">Last 2 Years</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CpuChipIcon className="w-4 h-4" />
            <span>AI Confidence: 89%</span>
          </div>
        </div>
      </div>

      {/* Tremor Dashboard */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Executive Dashboard</h2>
        </div>
        <TremorDashboard 
          data={analyticsData.tremorData}
          aiInsights={analyticsData.aiRecommendations.slice(0, 3)}
        />
      </div>

      {/* Predictive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Predictive Growth Analysis</h2>
          </div>
          <RechartsLineChart
            data={analyticsData.predictiveMetrics.userGrowth.filter(d => d.actual)}
            predictiveData={analyticsData.predictiveMetrics.userGrowth.filter(d => d.predicted).map(d => ({
              ...d,
              actual: d.predicted
            }))}
            lines={[
              {
                dataKey: 'schools',
                stroke: '#3B82F6',
                name: 'Schools',
                strokeWidth: 3
              },
              {
                dataKey: 'students',
                stroke: '#10B981',
                name: 'Students (x100)',
                strokeWidth: 3
              }
            ]}
            height={350}
            showArea={true}
            targetLine={{
              value: 300,
              label: 'Target: 300 Schools',
              color: '#F59E0B'
            }}
            aiInsights={analyticsData.predictiveMetrics.aiInsights}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CpuChipIcon className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Performance Radar</h2>
          </div>
          <NivoRadarChart
            data={analyticsData.performanceRadar.data}
            keys={['current', 'target', 'industry']}
            indexBy="metric"
            height={350}
            colors={['#3B82F6', '#10B981', '#F59E0B']}
            aiInsights={analyticsData.performanceRadar.aiInsights}
          />
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <LightBulbIcon className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI-Generated Recommendations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsData.aiRecommendations.map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              rec.type === 'alert' ? 'border-red-500 bg-red-50' :
              rec.type === 'recommendation' ? 'border-blue-500 bg-blue-50' :
              'border-green-500 bg-green-50'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{rec.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    rec.impact === 'high' ? 'bg-red-100 text-red-800' :
                    rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.impact}
                  </span>
                  <span className="text-xs text-gray-500">{rec.confidence}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {rec.category}
                </span>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  Take Action →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model Performance */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">AI Model Performance</h2>
            <p className="text-purple-100 mb-4">
              Real-time monitoring of machine learning model accuracy and performance
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-purple-200">Academic Analysis</p>
                <p className="text-2xl font-bold">96.2%</p>
              </div>
              <div>
                <p className="text-purple-200">Career Prediction</p>
                <p className="text-2xl font-bold">94.7%</p>
              </div>
              <div>
                <p className="text-purple-200">Behavioral Assessment</p>
                <p className="text-2xl font-bold">92.1%</p>
              </div>
              <div>
                <p className="text-purple-200">Framework Detection</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <div>
                <p className="text-purple-200">Performance Prediction</p>
                <p className="text-2xl font-bold">93.8%</p>
              </div>
            </div>
          </div>
          <CpuChipIcon className="w-16 h-16 text-purple-200" />
        </div>
      </div>
    </div>
  );
}
