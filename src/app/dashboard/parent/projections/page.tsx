'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  CrystalBallIcon,
  TrendingUpIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart,
  ReferenceLine,
} from 'recharts';

interface AcademicProjection {
  subject: string;
  currentScore: number;
  projectedScore: number;
  confidenceLevel: number;
  timeframe: string;
  factors: string[];
}

interface SkillProjection {
  skill: string;
  currentLevel: number;
  projectedLevel: number;
  industryDemand: number;
  growthRate: number;
}

interface CareerPathProjection {
  path: string;
  probability: number;
  timeline: Array<{
    year: number;
    milestone: string;
    probability: number;
  }>;
}

interface PerformanceData {
  period: string;
  actual: number;
  projected: number;
  confidence: number;
}

export default function ProjectionsPage() {
  const { data: session } = useSession();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1year');
  const [projectionType, setProjectionType] = useState('academic');
  
  // Filters
  const [filters, setFilters] = useState({
    subject: 'all',
    skill: 'all',
    confidence: 'all',
    timeframe: '1year',
  });

  // Mock data for projections
  const mockAcademicProjections: AcademicProjection[] = [
    {
      subject: 'Mathematics',
      currentScore: 85,
      projectedScore: 92,
      confidenceLevel: 87,
      timeframe: '6 months',
      factors: ['Consistent practice', 'Strong foundation', 'Improved problem-solving'],
    },
    {
      subject: 'Science',
      currentScore: 82,
      projectedScore: 89,
      confidenceLevel: 84,
      timeframe: '6 months',
      factors: ['Laboratory exposure', 'Conceptual understanding', 'Scientific method'],
    },
    {
      subject: 'English',
      currentScore: 75,
      projectedScore: 83,
      confidenceLevel: 91,
      timeframe: '6 months',
      factors: ['Reading comprehension', 'Vocabulary building', 'Writing practice'],
    },
  ];

  const mockSkillProjections: SkillProjection[] = [
    { skill: 'Critical Thinking', currentLevel: 78, projectedLevel: 88, industryDemand: 95, growthRate: 12.8 },
    { skill: 'Problem Solving', currentLevel: 82, projectedLevel: 91, industryDemand: 92, growthRate: 11.0 },
    { skill: 'Communication', currentLevel: 70, projectedLevel: 82, industryDemand: 89, growthRate: 17.1 },
    { skill: 'Digital Literacy', currentLevel: 85, projectedLevel: 93, industryDemand: 98, growthRate: 9.4 },
    { skill: 'Creativity', currentLevel: 88, projectedLevel: 94, industryDemand: 85, growthRate: 6.8 },
  ];

  const mockPerformanceData: PerformanceData[] = [
    { period: 'Jan 2024', actual: 75, projected: 74, confidence: 85 },
    { period: 'Feb 2024', actual: 78, projected: 77, confidence: 87 },
    { period: 'Mar 2024', actual: 80, projected: 79, confidence: 89 },
    { period: 'Apr 2024', actual: 82, projected: 81, confidence: 91 },
    { period: 'May 2024', actual: 85, projected: 84, confidence: 93 },
    { period: 'Jun 2024', actual: 0, projected: 87, confidence: 88 },
    { period: 'Jul 2024', actual: 0, projected: 89, confidence: 86 },
    { period: 'Aug 2024', actual: 0, projected: 91, confidence: 84 },
    { period: 'Sep 2024', actual: 0, projected: 93, confidence: 82 },
  ];

  const mockCareerPaths: CareerPathProjection[] = [
    {
      path: 'Software Engineering',
      probability: 78,
      timeline: [
        { year: 2026, milestone: 'Complete Class 12', probability: 95 },
        { year: 2030, milestone: 'B.Tech Graduation', probability: 85 },
        { year: 2032, milestone: 'Senior Developer', probability: 75 },
        { year: 2035, milestone: 'Tech Lead', probability: 65 },
      ],
    },
    {
      path: 'Data Science',
      probability: 72,
      timeline: [
        { year: 2026, milestone: 'Complete Class 12', probability: 95 },
        { year: 2030, milestone: 'B.Sc. Statistics/CS', probability: 80 },
        { year: 2032, milestone: 'Data Analyst', probability: 70 },
        { year: 2035, milestone: 'Senior Data Scientist', probability: 60 },
      ],
    },
  ];

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await fetch('/api/parent/children');
      if (response.ok) {
        const data = await response.json();
        setChildren(data.children || []);
        if (data.children?.length > 0) {
          setSelectedChild(data.children[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current: number, projected: number) => {
    if (projected > current) return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
    if (projected < current) return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
    return <MinusIcon className="h-4 w-4 text-gray-500" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <CrystalBallIcon className="h-8 w-8 mr-3" />
              Academic & Career Projections
            </h1>
            <p className="text-indigo-100 mt-2">
              AI-powered future performance predictions and growth insights
            </p>
          </div>
          <TrendingUpIcon className="h-16 w-16 text-indigo-200" />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              {children.map((child: any) => (
                <option key={child.id} value={child.id}>
                  {child.user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Projection Type
            </label>
            <select
              value={projectionType}
              onChange={(e) => setProjectionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="academic">Academic Performance</option>
              <option value="skills">Skills Development</option>
              <option value="career">Career Paths</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
              <option value="2years">2 Years</option>
              <option value="5years">5 Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Level
            </label>
            <select
              value={filters.confidence}
              onChange={(e) => setFilters({...filters, confidence: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="high">High (90%+)</option>
              <option value="medium">Medium (75-89%)</option>
              <option value="low">Low (&lt;75%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Projection Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-purple-600" />
          Performance Trajectory
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="confidence"
                fill="#e0e7ff"
                stroke="#6366f1"
                fillOpacity={0.3}
                name="Confidence Band"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#059669"
                strokeWidth={3}
                name="Actual Performance"
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#7c3aed"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Projected Performance"
              />
              <ReferenceLine y={85} stroke="#f59e0b" strokeDasharray="2 2" label="Target" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Academic Projections */}
      {projectionType === 'academic' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AcademicCapIcon className="h-6 w-6 mr-2 text-indigo-600" />
            Subject-wise Projections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAcademicProjections.map((projection, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{projection.subject}</h3>
                  {getTrendIcon(projection.currentScore, projection.projectedScore)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Score:</span>
                    <span className="font-medium">{projection.currentScore}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projected Score:</span>
                    <span className="font-medium text-purple-600">{projection.projectedScore}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Improvement:</span>
                    <span className="font-medium text-green-600">
                      +{projection.projectedScore - projection.currentScore}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Confidence:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(projection.confidenceLevel)}`}>
                      {projection.confidenceLevel}%
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Key Factors:</div>
                  <div className="space-y-1">
                    {projection.factors.map((factor, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex items-center">
                        <SparklesIcon className="h-3 w-3 mr-1 text-yellow-500" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700">Progress Bar</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(projection.projectedScore / 100) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Target: {projection.projectedScore}% by {projection.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Projections */}
      {projectionType === 'skills' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Skills Development Projections</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSkillProjections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="currentLevel" fill="#8884d8" name="Current Level" />
                <Bar dataKey="projectedLevel" fill="#82ca9d" name="Projected Level" />
                <Bar dataKey="industryDemand" fill="#ffc658" name="Industry Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Career Path Projections */}
      {projectionType === 'career' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Career Path Timelines</h2>
          <div className="space-y-6">
            {mockCareerPaths.map((path, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">{path.path}</h3>
                  <div className="text-2xl font-bold text-purple-600">{path.probability}%</div>
                </div>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                  {path.timeline.map((milestone, idx) => (
                    <div key={idx} className="relative flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-100 border-2 border-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-purple-700">
                        {milestone.year.toString().slice(-2)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="font-medium">{milestone.milestone}</div>
                        <div className="text-sm text-gray-600">
                          Probability: {milestone.probability}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projection Insights */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2 text-yellow-600" />
          AI Insights & Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Growth Opportunities</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Mathematics shows strongest growth potential (+7 points)</li>
              <li>• Science concepts are building solid foundation</li>
              <li>• Digital literacy ahead of peer average</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Predicted Strengths</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• STEM career paths show high probability</li>
              <li>• Analytical thinking developing rapidly</li>
              <li>• Problem-solving skills above average</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">Action Items</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Increase coding practice time</li>
              <li>• Join advanced mathematics program</li>
              <li>• Explore robotics competitions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
