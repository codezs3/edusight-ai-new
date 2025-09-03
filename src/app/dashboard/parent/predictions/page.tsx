'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  BeakerIcon,
  CpuChipIcon,
  ChartBarIcon,
  LightBulbIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
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
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';

interface PredictionModel {
  name: string;
  accuracy: number;
  lastUpdated: string;
  status: 'active' | 'training' | 'error';
}

interface SubjectPrediction {
  subject: string;
  nextExamScore: number;
  confidence: number;
  riskFactors: string[];
  recommendations: string[];
  trend: 'improving' | 'declining' | 'stable';
}

interface BehavioralPrediction {
  trait: string;
  currentLevel: number;
  predictedLevel: number;
  influencingFactors: string[];
  interventions: string[];
}

interface PerformanceRisk {
  type: 'high' | 'medium' | 'low';
  area: string;
  probability: number;
  impact: string;
  mitigation: string[];
}

interface LearningPattern {
  pattern: string;
  strength: number;
  description: string;
  utilization: string;
}

export default function PredictionsPage() {
  const { data: session } = useSession();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('comprehensive');
  const [predictionScope, setPredictionScope] = useState('academic');
  
  // Filters
  const [filters, setFilters] = useState({
    confidence: 'all',
    timeframe: '3months',
    riskLevel: 'all',
    subject: 'all',
  });

  // Mock data for ML predictions
  const mockModels: PredictionModel[] = [
    { name: 'Comprehensive Academic Model', accuracy: 94.2, lastUpdated: '2024-09-03', status: 'active' },
    { name: 'Behavioral Analysis Model', accuracy: 91.8, lastUpdated: '2024-09-02', status: 'active' },
    { name: 'Career Aptitude Model', accuracy: 89.5, lastUpdated: '2024-09-01', status: 'training' },
    { name: 'Learning Style Optimizer', accuracy: 92.7, lastUpdated: '2024-09-03', status: 'active' },
  ];

  const mockSubjectPredictions: SubjectPrediction[] = [
    {
      subject: 'Mathematics',
      nextExamScore: 87,
      confidence: 92,
      riskFactors: ['Complex word problems', 'Time management'],
      recommendations: ['Practice timed tests', 'Focus on problem interpretation'],
      trend: 'improving',
    },
    {
      subject: 'Science',
      nextExamScore: 84,
      confidence: 88,
      riskFactors: ['Laboratory concepts', 'Diagram labeling'],
      recommendations: ['Hands-on experiments', 'Visual learning aids'],
      trend: 'stable',
    },
    {
      subject: 'English',
      nextExamScore: 78,
      confidence: 85,
      riskFactors: ['Essay writing', 'Grammar rules'],
      recommendations: ['Daily writing practice', 'Grammar exercises'],
      trend: 'declining',
    },
  ];

  const mockBehavioralPredictions: BehavioralPrediction[] = [
    {
      trait: 'Focus & Attention',
      currentLevel: 75,
      predictedLevel: 82,
      influencingFactors: ['Regular study schedule', 'Reduced distractions', 'Interest in subject'],
      interventions: ['Mindfulness exercises', 'Structured breaks', 'Gamified learning'],
    },
    {
      trait: 'Collaboration',
      currentLevel: 68,
      predictedLevel: 76,
      influencingFactors: ['Group activities', 'Peer interaction', 'Social confidence'],
      interventions: ['Team projects', 'Leadership roles', 'Communication skills'],
    },
    {
      trait: 'Persistence',
      currentLevel: 82,
      predictedLevel: 88,
      influencingFactors: ['Challenge level', 'Goal setting', 'Support system'],
      interventions: ['Graduated challenges', 'Progress tracking', 'Celebration of milestones'],
    },
  ];

  const mockPerformanceRisks: PerformanceRisk[] = [
    {
      type: 'high',
      area: 'Mathematics - Advanced Topics',
      probability: 78,
      impact: 'May struggle with calculus preparation',
      mitigation: ['Additional tutoring', 'Conceptual reinforcement', 'Practice tests'],
    },
    {
      type: 'medium',
      area: 'Science - Laboratory Skills',
      probability: 65,
      impact: 'Practical exam performance',
      mitigation: ['Virtual labs', 'Guided experiments', 'Safety protocols'],
    },
    {
      type: 'low',
      area: 'English - Creative Writing',
      probability: 34,
      impact: 'Limited expression in essays',
      mitigation: ['Writing prompts', 'Peer review', 'Genre exploration'],
    },
  ];

  const mockLearningPatterns: LearningPattern[] = [
    {
      pattern: 'Visual Learning',
      strength: 89,
      description: 'Learns best through diagrams, charts, and visual aids',
      utilization: 'Use mind maps and infographics for complex topics',
    },
    {
      pattern: 'Sequential Processing',
      strength: 76,
      description: 'Prefers step-by-step instructions and structured approach',
      utilization: 'Break down complex problems into smaller steps',
    },
    {
      pattern: 'Kinesthetic Learning',
      strength: 82,
      description: 'Benefits from hands-on activities and movement',
      utilization: 'Incorporate physical activities and manipulatives',
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

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'training': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-green-300 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrophyIcon className="h-5 w-5 text-green-500" />;
      case 'declining': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'stable': return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BeakerIcon className="h-8 w-8 mr-3" />
              AI-Powered Predictions
            </h1>
            <p className="text-blue-100 mt-2">
              Machine learning insights for academic and behavioral outcomes
            </p>
          </div>
          <CpuChipIcon className="h-16 w-16 text-blue-200" />
        </div>
      </div>

      {/* ML Models Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CpuChipIcon className="h-6 w-6 mr-2 text-blue-600" />
          Machine Learning Models
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockModels.map((model, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm">{model.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getModelStatusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{model.accuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
              <div className="text-xs text-gray-400 mt-2">
                Updated: {model.lastUpdated}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              Prediction Scope
            </label>
            <select
              value={predictionScope}
              onChange={(e) => setPredictionScope(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="academic">Academic Performance</option>
              <option value="behavioral">Behavioral Traits</option>
              <option value="risks">Performance Risks</option>
              <option value="patterns">Learning Patterns</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe
            </label>
            <select
              value={filters.timeframe}
              onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="1month">1 Month</option>
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="1year">1 Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Level
            </label>
            <select
              value={filters.confidence}
              onChange={(e) => setFilters({...filters, confidence: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="high">High (90%+)</option>
              <option value="medium">Medium (75-89%)</option>
              <option value="low">Low (&lt;75%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Risk Level
            </label>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risks</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Academic Predictions */}
      {predictionScope === 'academic' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ChartBarIcon className="h-6 w-6 mr-2 text-green-600" />
            Academic Performance Predictions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSubjectPredictions.map((prediction, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{prediction.subject}</h3>
                  {getTrendIcon(prediction.trend)}
                </div>
                
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{prediction.nextExamScore}%</div>
                    <div className="text-sm text-gray-500">Predicted Next Exam Score</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium text-green-600">{prediction.confidence}%</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Risk Factors:</div>
                  <div className="space-y-1">
                    {prediction.riskFactors.map((factor, idx) => (
                      <div key={idx} className="text-xs text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Recommendations:</div>
                  <div className="space-y-1">
                    {prediction.recommendations.map((rec, idx) => (
                      <div key={idx} className="text-xs text-green-600 flex items-center">
                        <LightBulbIcon className="h-3 w-3 mr-1" />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700">Confidence Level</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Behavioral Predictions */}
      {predictionScope === 'behavioral' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Behavioral Development Predictions</h2>
          <div className="h-96 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBehavioralPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="trait" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="currentLevel" fill="#8884d8" name="Current Level" />
                <Bar dataKey="predictedLevel" fill="#82ca9d" name="Predicted Level" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockBehavioralPredictions.map((prediction, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">{prediction.trait}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  Expected improvement: +{prediction.predictedLevel - prediction.currentLevel} points
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Influencing Factors:</div>
                  {prediction.influencingFactors.map((factor, idx) => (
                    <div key={idx} className="text-xs text-blue-600">• {factor}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Risks */}
      {predictionScope === 'risks' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-yellow-600" />
            Performance Risk Analysis
          </h2>
          <div className="space-y-4">
            {mockPerformanceRisks.map((risk, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getRiskColor(risk.type)}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{risk.area}</h3>
                  <div className="text-right">
                    <div className="text-xl font-bold">{risk.probability}%</div>
                    <div className="text-xs capitalize">{risk.type} Risk</div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700">Potential Impact:</div>
                  <div className="text-sm text-gray-600">{risk.impact}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Mitigation Strategies:</div>
                  <div className="space-y-1">
                    {risk.mitigation.map((strategy, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-1 text-green-500" />
                        {strategy}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Patterns */}
      {predictionScope === 'patterns' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <LightBulbIcon className="h-6 w-6 mr-2 text-purple-600" />
            Learning Pattern Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockLearningPatterns}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({pattern, strength}) => `${pattern}: ${strength}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="strength"
                  >
                    {mockLearningPatterns.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {mockLearningPatterns.map((pattern, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{pattern.pattern}</h3>
                    <span className="text-lg font-bold text-purple-600">{pattern.strength}%</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{pattern.description}</div>
                  <div className="text-sm font-medium text-purple-700">
                    Utilization: {pattern.utilization}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
