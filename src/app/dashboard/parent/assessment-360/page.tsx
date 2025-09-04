'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  CalendarIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface Assessment360 {
  id: string;
  childId: string;
  academicScore: number;
  physicalScore: number;
  psychologicalScore: number;
  totalScore: number;
  assessmentDate: Date;
  academicComponents: {
    mathematics: number;
    science: number;
    english: number;
    socialStudies: number;
    overallGPA: number;
  };
  physicalComponents: {
    height: number;
    weight: number;
    bmi: number;
    fitnessLevel: number;
    healthStatus: number;
  };
  psychologicalComponents: {
    emotionalIntelligence: number;
    socialSkills: number;
    behavioralPatterns: number;
    stressLevels: number;
    motivation: number;
  };
  recommendations: string[];
  riskFactors: string[];
  strengths: string[];
}

interface Child {
  id: string;
  user: { name: string };
  grade: string;
}

export default function Assessment360Page() {
  const { data: session } = useSession();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [assessments, setAssessments] = useState<Assessment360[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment360 | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    dateRange: '6months',
    scoreType: 'all',
    showTrends: true,
  });

  // Mock data for demonstration
  const mockAssessment: Assessment360 = {
    id: '1',
    childId: '1',
    academicScore: 85,
    physicalScore: 78,
    psychologicalScore: 82,
    totalScore: 82,
    assessmentDate: new Date(),
    academicComponents: {
      mathematics: 88,
      science: 85,
      english: 82,
      socialStudies: 80,
      overallGPA: 8.4,
    },
    physicalComponents: {
      height: 120, // cm
      weight: 25,  // kg
      bmi: 17.4,
      fitnessLevel: 85,
      healthStatus: 90,
    },
    psychologicalComponents: {
      emotionalIntelligence: 85,
      socialSkills: 80,
      behavioralPatterns: 82,
      stressLevels: 75, // Lower is better for stress
      motivation: 88,
    },
    recommendations: [
      'Increase physical activity to improve fitness levels',
      'Focus on strengthening social studies fundamentals',
      'Continue excellent work in mathematics',
      'Practice stress management techniques',
    ],
    riskFactors: [
      'Slightly below average in physical fitness',
      'Minor stress indicators detected',
    ],
    strengths: [
      'Excellent mathematical reasoning',
      'Strong emotional intelligence',
      'High motivation levels',
      'Good overall health status',
    ],
  };

  const radarData = useMemo(() => {
    if (!currentAssessment) return [];
    
    return [
      { subject: 'Mathematics', A: currentAssessment.academicComponents.mathematics, fullMark: 100 },
      { subject: 'Science', A: currentAssessment.academicComponents.science, fullMark: 100 },
      { subject: 'English', A: currentAssessment.academicComponents.english, fullMark: 100 },
      { subject: 'Social Studies', A: currentAssessment.academicComponents.socialStudies, fullMark: 100 },
      { subject: 'Physical Fitness', A: currentAssessment.physicalComponents.fitnessLevel, fullMark: 100 },
      { subject: 'Emotional Intelligence', A: currentAssessment.psychologicalComponents.emotionalIntelligence, fullMark: 100 },
      { subject: 'Social Skills', A: currentAssessment.psychologicalComponents.socialSkills, fullMark: 100 },
      { subject: 'Motivation', A: currentAssessment.psychologicalComponents.motivation, fullMark: 100 },
    ];
  }, [currentAssessment]);

  const scoreCategories = [
    { name: 'Academic', score: currentAssessment?.academicScore || 0, color: '#3B82F6' },
    { name: 'Physical', score: currentAssessment?.physicalScore || 0, color: '#10B981' },
    { name: 'Psychological', score: currentAssessment?.psychologicalScore || 0, color: '#8B5CF6' },
  ];

  const trendData = [
    { month: 'Jan', academic: 80, physical: 75, psychological: 78, total: 78 },
    { month: 'Feb', academic: 82, physical: 76, psychological: 79, total: 79 },
    { month: 'Mar', academic: 84, physical: 77, psychological: 80, total: 80 },
    { month: 'Apr', academic: 85, physical: 78, psychological: 82, total: 82 },
  ];

  useEffect(() => {
    fetchChildren();
    setCurrentAssessment(mockAssessment);
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Developing';
    return 'Needs Support';
  };

  const calculatePercentile = (score: number) => {
    // Mock percentile calculation based on score
    return Math.min(95, Math.max(5, score - 10 + Math.random() * 20));
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
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <TrophyIcon className="h-8 w-8 mr-3" />
              360° Assessment Dashboard
            </h1>
            <p className="text-blue-100 mt-2">
              Comprehensive evaluation across academic, physical, and psychological dimensions
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{currentAssessment?.totalScore || 0}</div>
            <div className="text-sm text-blue-100">EduSight 360° Score</div>
          </div>
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.user.name} ({child.grade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus Area
            </label>
            <select
              value={filters.scoreType}
              onChange={(e) => setFilters({...filters, scoreType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Areas</option>
              <option value="academic">Academic Only</option>
              <option value="physical">Physical Only</option>
              <option value="psychological">Psychological Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Score Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total 360° Score</p>
              <p className="text-3xl font-bold text-blue-600">{currentAssessment?.totalScore || 0}</p>
              <p className="text-sm text-gray-500">
                {getScoreLabel(currentAssessment?.totalScore || 0)}
              </p>
            </div>
            <TrophyIcon className="h-12 w-12 text-blue-600" />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Percentile</span>
              <span className="font-medium">{calculatePercentile(currentAssessment?.totalScore || 0).toFixed(0)}th</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(currentAssessment?.totalScore || 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {scoreCategories.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{category.name}</p>
                <p className="text-2xl font-bold" style={{ color: category.color }}>
                  {category.score}
                </p>
                <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(category.score)}`}>
                  {getScoreLabel(category.score)}
                </span>
              </div>
              {category.name === 'Academic' && <AcademicCapIcon className="h-10 w-10" style={{ color: category.color }} />}
              {category.name === 'Physical' && <HeartIcon className="h-10 w-10" style={{ color: category.color }} />}
              {category.name === 'Psychological' && <LightBulbIcon className="h-10 w-10" style={{ color: category.color }} />}
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
            Skills & Abilities Radar
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Current Level"
                  dataKey="A"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-green-600" />
            Performance Trends
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[70, 90]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} name="Total Score" />
                <Line type="monotone" dataKey="academic" stroke="#10B981" strokeWidth={2} name="Academic" />
                <Line type="monotone" dataKey="physical" stroke="#F59E0B" strokeWidth={2} name="Physical" />
                <Line type="monotone" dataKey="psychological" stroke="#8B5CF6" strokeWidth={2} name="Psychological" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
            Academic Performance
          </h3>
          <div className="space-y-3">
            {currentAssessment && Object.entries(currentAssessment.academicComponents).map(([subject, score]) => (
              subject !== 'overallGPA' && (
                <div key={subject} className="flex justify-between items-center">
                  <span className="text-sm font-medium capitalize">{subject.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold">{score}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Physical Health */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HeartIcon className="h-5 w-5 mr-2 text-green-600" />
            Physical Health
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Height</span>
              <span className="font-medium">{currentAssessment?.physicalComponents.height} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Weight</span>
              <span className="font-medium">{currentAssessment?.physicalComponents.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">BMI</span>
              <span className="font-medium">{currentAssessment?.physicalComponents.bmi}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Fitness Level</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(currentAssessment?.physicalComponents.fitnessLevel || 0)}`}>
                {currentAssessment?.physicalComponents.fitnessLevel}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Health Status</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getScoreColor(currentAssessment?.physicalComponents.healthStatus || 0)}`}>
                {currentAssessment?.physicalComponents.healthStatus}%
              </span>
            </div>
          </div>
        </div>

        {/* Psychological Profile */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <LightBulbIcon className="h-5 w-5 mr-2 text-purple-600" />
            Psychological Profile
          </h3>
          <div className="space-y-3">
            {currentAssessment && Object.entries(currentAssessment.psychologicalComponents).map(([trait, score]) => (
              <div key={trait} className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{trait.replace(/([A-Z])/g, ' $1')}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold">{score}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-green-800">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {currentAssessment?.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-green-700 flex items-start">
                <StarIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-blue-800">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {currentAssessment?.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-blue-700 flex items-start">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                {recommendation}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-yellow-800">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            Areas to Watch
          </h3>
          <ul className="space-y-2">
            {currentAssessment?.riskFactors.map((risk, index) => (
              <li key={index} className="text-sm text-yellow-700 flex items-start">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
