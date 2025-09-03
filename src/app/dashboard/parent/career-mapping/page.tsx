'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  TrendingUpIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChartBarIcon,
  SparklesIcon,
  FunnelIcon,
  CalendarIcon,
  BookOpenIcon,
  LightBulbIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CareerPrediction {
  field: string;
  probability: number;
  growth: number;
  requiredSkills: string[];
  educationPath: string[];
  salaryRange: string;
  timeToAchieve: string;
}

interface SkillData {
  skill: string;
  current: number;
  target: number;
  industry: number;
}

interface SubjectPerformance {
  subject: string;
  year: number;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

export default function CareerMappingPage() {
  const { data: session } = useSession();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [loading, setLoading] = useState(true);
  const [careerPredictions, setCareerPredictions] = useState<CareerPrediction[]>([]);
  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  
  // Filters
  const [filters, setFilters] = useState({
    year: 'all',
    subject: 'all',
    skill: 'all',
    class: 'all',
  });

  // Mock data for demonstration
  const mockCareerPredictions: CareerPrediction[] = [
    {
      field: 'Artificial Intelligence Engineer',
      probability: 89,
      growth: 42,
      requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'Mathematics'],
      educationPath: ['Computer Science', 'AI Specialization', 'Advanced ML'],
      salaryRange: '₹15-40 Lakhs',
      timeToAchieve: '6-8 years',
    },
    {
      field: 'Data Scientist',
      probability: 82,
      growth: 35,
      requiredSkills: ['Statistics', 'Python', 'SQL', 'Data Visualization'],
      educationPath: ['Statistics/Math', 'Data Science Certification'],
      salaryRange: '₹12-35 Lakhs',
      timeToAchieve: '4-6 years',
    },
    {
      field: 'Software Engineer',
      probability: 76,
      growth: 28,
      requiredSkills: ['Programming', 'Problem Solving', 'System Design'],
      educationPath: ['Computer Science', 'Software Engineering'],
      salaryRange: '₹8-25 Lakhs',
      timeToAchieve: '4-5 years',
    },
    {
      field: 'Research Scientist',
      probability: 71,
      growth: 24,
      requiredSkills: ['Research Methods', 'Scientific Writing', 'Analysis'],
      educationPath: ['PhD in relevant field', 'Research Experience'],
      salaryRange: '₹10-30 Lakhs',
      timeToAchieve: '8-10 years',
    },
  ];

  const mockSkillData: SkillData[] = [
    { skill: 'Mathematics', current: 85, target: 95, industry: 90 },
    { skill: 'Logical Reasoning', current: 78, target: 88, industry: 85 },
    { skill: 'Scientific Thinking', current: 82, target: 92, industry: 87 },
    { skill: 'Problem Solving', current: 75, target: 90, industry: 83 },
    { skill: 'Communication', current: 70, target: 85, industry: 80 },
    { skill: 'Creativity', current: 88, target: 95, industry: 78 },
  ];

  const mockSubjectPerformance: SubjectPerformance[] = [
    { subject: 'Mathematics', year: 2022, score: 78, trend: 'up' },
    { subject: 'Mathematics', year: 2023, score: 82, trend: 'up' },
    { subject: 'Mathematics', year: 2024, score: 85, trend: 'up' },
    { subject: 'Science', year: 2022, score: 75, trend: 'stable' },
    { subject: 'Science', year: 2023, score: 79, trend: 'up' },
    { subject: 'Science', year: 2024, score: 82, trend: 'up' },
    { subject: 'English', year: 2022, score: 70, trend: 'up' },
    { subject: 'English', year: 2023, score: 72, trend: 'up' },
    { subject: 'English', year: 2024, score: 75, trend: 'up' },
  ];

  useEffect(() => {
    fetchChildren();
    setCareerPredictions(mockCareerPredictions);
    setSkillData(mockSkillData);
    setSubjectPerformance(mockSubjectPerformance);
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

  const filteredData = useMemo(() => {
    let filtered = subjectPerformance;
    
    if (filters.year !== 'all') {
      filtered = filtered.filter(item => item.year.toString() === filters.year);
    }
    
    if (filters.subject !== 'all') {
      filtered = filtered.filter(item => item.subject === filters.subject);
    }
    
    return filtered;
  }, [subjectPerformance, filters]);

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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <TrendingUpIcon className="h-8 w-8 mr-3" />
              Career Mapping & Predictions
            </h1>
            <p className="text-purple-100 mt-2">
              AI-powered career guidance and skill development roadmap
            </p>
          </div>
          <SparklesIcon className="h-16 w-16 text-purple-200" />
        </div>
      </div>

      {/* Child Selection & Filters */}
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
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpenIcon className="h-4 w-4 inline mr-1" />
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({...filters, subject: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <LightBulbIcon className="h-4 w-4 inline mr-1" />
              Skill
            </label>
            <select
              value={filters.skill}
              onChange={(e) => setFilters({...filters, skill: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Skills</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Logical Reasoning">Logical Reasoning</option>
              <option value="Scientific Thinking">Scientific Thinking</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UserGroupIcon className="h-4 w-4 inline mr-1" />
              Class
            </label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({...filters, class: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career Predictions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BriefcaseIcon className="h-6 w-6 mr-2 text-blue-600" />
          AI Career Predictions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerPredictions.map((prediction, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{prediction.field}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{prediction.probability}%</div>
                  <div className="text-sm text-gray-500">Match Score</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Industry Growth:</span>
                  <span className="font-medium text-blue-600">+{prediction.growth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary Range:</span>
                  <span className="font-medium">{prediction.salaryRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time to Achieve:</span>
                  <span className="font-medium">{prediction.timeToAchieve}</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Required Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {prediction.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Radar Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-purple-600" />
          Skills Analysis
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Current Level" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Target Level" dataKey="target" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              <Radar name="Industry Average" dataKey="industry" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AcademicCapIcon className="h-6 w-6 mr-2 text-indigo-600" />
            Subject Performance Trends
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Skills Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({skill, current}) => `${skill}: ${current}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="current"
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <SparklesIcon className="h-6 w-6 mr-2 text-yellow-600" />
          AI Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Focus Areas</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Strengthen mathematical reasoning</li>
              <li>• Develop programming concepts</li>
              <li>• Enhance analytical thinking</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Excellent creative thinking</li>
              <li>• Strong pattern recognition</li>
              <li>• Good scientific reasoning</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">Next Steps</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Enroll in coding courses</li>
              <li>• Join robotics club</li>
              <li>• Practice problem-solving</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
