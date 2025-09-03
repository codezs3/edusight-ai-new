'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  LightBulbIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  BrainIcon
} from '@heroicons/react/24/outline';
import { CpuChipIcon as BrainIconSolid } from '@heroicons/react/24/solid';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import RadarChart from '@/components/charts/RadarChart';

interface StudentAnalyticsData {
  studentProfile: {
    name: string;
    grade: string;
    school: string;
    overallGrade: number;
    rank: number;
    totalStudents: number;
  };
  performance: {
    currentScores: {
      labels: string[];
      data: number[];
    };
    progressTrend: {
      labels: string[];
      data: number[];
    };
    subjectComparison: {
      labels: string[];
      studentData: number[];
      classAverage: number[];
    };
  };
  assessment: {
    eduSightScore: {
      overall: number;
      academic: number;
      behavioral: number;
      potential: number;
    };
    skillsRadar: {
      labels: string[];
      data: number[];
    };
    learningStyle: {
      visual: number;
      auditory: number;
      kinesthetic: number;
      reading: number;
    };
  };
  insights: {
    strengths: string[];
    improvements: string[];
    recommendations: Array<{
      category: string;
      action: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    careerSuggestions: Array<{
      field: string;
      match: number;
      description: string;
    }>;
  };
  attendance: {
    overall: number;
    trend: {
      labels: string[];
      data: number[];
    };
    subjectWise: {
      labels: string[];
      data: number[];
    };
  };
}

export default function ParentAnalyticsPage() {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<StudentAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('student1');
  const [selectedPeriod, setSelectedPeriod] = useState('semester');

  useEffect(() => {
    generateMockStudentAnalytics();
  }, [selectedStudent, selectedPeriod]);

  const generateMockStudentAnalytics = () => {
    const mockData: StudentAnalyticsData = {
      studentProfile: {
        name: 'Aarav Sharma',
        grade: '10th Grade',
        school: 'Modern Public School',
        overallGrade: 87.5,
        rank: 12,
        totalStudents: 156
      },
      performance: {
        currentScores: {
          labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science'],
          data: [92, 89, 85, 87, 83, 78, 94]
        },
        progressTrend: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [82, 84, 85, 86, 87, 87.5]
        },
        subjectComparison: {
          labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'CS'],
          studentData: [92, 89, 85, 87, 83, 78, 94],
          classAverage: [78, 82, 79, 81, 85, 83, 80]
        }
      },
      assessment: {
        eduSightScore: {
          overall: 88,
          academic: 91,
          behavioral: 85,
          potential: 92
        },
        skillsRadar: {
          labels: ['Analytical Thinking', 'Problem Solving', 'Creativity', 'Communication', 'Leadership', 'Teamwork'],
          data: [92, 89, 75, 78, 82, 86]
        },
        learningStyle: {
          visual: 35,
          auditory: 25,
          kinesthetic: 20,
          reading: 20
        }
      },
      insights: {
        strengths: [
          'Exceptional in STEM subjects',
          'Strong analytical and problem-solving skills',
          'Consistent academic improvement',
          'Good time management abilities'
        ],
        improvements: [
          'Language arts could be improved',
          'Public speaking confidence',
          'Creative writing skills',
          'Collaborative teamwork'
        ],
        recommendations: [
          {
            category: 'Academic',
            action: 'Consider advanced mathematics courses or competitions',
            priority: 'high'
          },
          {
            category: 'Skills',
            action: 'Join debate club to improve communication skills',
            priority: 'medium'
          },
          {
            category: 'Career',
            action: 'Explore engineering and computer science programs',
            priority: 'high'
          },
          {
            category: 'Personal',
            action: 'Participate in group projects to enhance teamwork',
            priority: 'medium'
          }
        ],
        careerSuggestions: [
          {
            field: 'Software Engineering',
            match: 94,
            description: 'Strong analytical skills and computer science performance indicate great potential'
          },
          {
            field: 'Data Science',
            match: 91,
            description: 'Excellent mathematics and problem-solving abilities align well with data science'
          },
          {
            field: 'Mechanical Engineering',
            match: 87,
            description: 'Strong STEM foundation with good practical problem-solving skills'
          }
        ]
      },
      attendance: {
        overall: 94.5,
        trend: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
          data: [96, 94, 95, 93, 94, 96, 95, 94.5]
        },
        subjectWise: {
          labels: ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'CS'],
          data: [96, 95, 94, 93, 92, 90, 97]
        }
      }
    };

    setAnalyticsData(mockData);
    setLoading(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">{analyticsData.studentProfile.name}'s Progress</h1>
          <p className="text-gray-600">
            {analyticsData.studentProfile.grade} • {analyticsData.studentProfile.school}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="student1">Aarav Sharma</option>
            <option value="student2">Priya Sharma</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Student Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-blue-100 text-sm">Overall Grade</p>
            <p className="text-3xl font-bold">{analyticsData.studentProfile.overallGrade}%</p>
            <p className="text-blue-100 text-sm">Excellent Performance</p>
          </div>
          <div className="text-center">
            <p className="text-blue-100 text-sm">Class Rank</p>
            <p className="text-3xl font-bold">#{analyticsData.studentProfile.rank}</p>
            <p className="text-blue-100 text-sm">of {analyticsData.studentProfile.totalStudents} students</p>
          </div>
          <div className="text-center">
            <p className="text-blue-100 text-sm">EduSight Score</p>
            <p className="text-3xl font-bold">{analyticsData.assessment.eduSightScore.overall}</p>
            <p className="text-blue-100 text-sm">Above Average</p>
          </div>
          <div className="text-center">
            <p className="text-blue-100 text-sm">Attendance</p>
            <p className="text-3xl font-bold">{analyticsData.attendance.overall}%</p>
            <p className="text-blue-100 text-sm">Excellent Attendance</p>
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
              labels: analyticsData.performance.currentScores.labels,
              datasets: [
                {
                  label: 'Student Score',
                  data: analyticsData.performance.currentScores.data,
                  backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#6B7280',
                    '#EC4899'
                  ],
                  borderColor: [
                    '#2563EB',
                    '#059669',
                    '#D97706',
                    '#DC2626',
                    '#7C3AED',
                    '#4B5563',
                    '#DB2777'
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
            <h3 className="text-lg font-semibold text-gray-900">Progress Trend</h3>
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <LineChart
            data={{
              labels: analyticsData.performance.progressTrend.labels,
              datasets: [
                {
                  label: 'Overall Grade (%)',
                  data: analyticsData.performance.progressTrend.data,
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            }}
            height={300}
            yAxisMax={100}
            yAxisMin={75}
          />
        </div>
      </div>

      {/* EduSight Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">EduSight 360° Score</h3>
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overall</span>
              <span className="text-2xl font-bold text-gray-900">{analyticsData.assessment.eduSightScore.overall}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Academic</span>
                <span className="font-semibold text-blue-600">{analyticsData.assessment.eduSightScore.academic}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Behavioral</span>
                <span className="font-semibold text-green-600">{analyticsData.assessment.eduSightScore.behavioral}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Potential</span>
                <span className="font-semibold text-purple-600">{analyticsData.assessment.eduSightScore.potential}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Skills Assessment</h3>
            <BrainIconSolid className="w-5 h-5 text-purple-500" />
          </div>
          <RadarChart
            data={{
              labels: analyticsData.assessment.skillsRadar.labels,
              datasets: [
                {
                  label: 'Skill Level',
                  data: analyticsData.assessment.skillsRadar.data,
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  borderColor: '#8B5CF6',
                  borderWidth: 2,
                  fill: true
                }
              ]
            }}
            height={250}
            maxValue={100}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Learning Style</h3>
            <HeartIcon className="w-5 h-5 text-pink-500" />
          </div>
          <DoughnutChart
            data={{
              labels: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'],
              datasets: [
                {
                  data: [
                    analyticsData.assessment.learningStyle.visual,
                    analyticsData.assessment.learningStyle.auditory,
                    analyticsData.assessment.learningStyle.kinesthetic,
                    analyticsData.assessment.learningStyle.reading
                  ],
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
              value: 'Visual',
              label: 'Primary Style'
            }}
          />
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance vs Class Average</h3>
          <ChartBarIcon className="w-5 h-5 text-blue-500" />
        </div>
        <BarChart
          data={{
            labels: analyticsData.performance.subjectComparison.labels,
            datasets: [
              {
                label: `${analyticsData.studentProfile.name}`,
                data: analyticsData.performance.subjectComparison.studentData,
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                borderWidth: 2
              },
              {
                label: 'Class Average',
                data: analyticsData.performance.subjectComparison.classAverage,
                backgroundColor: '#E5E7EB',
                borderColor: '#9CA3AF',
                borderWidth: 2
              }
            ]
          }}
          height={350}
          yAxisMax={100}
        />
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Strengths & Areas for Improvement</h3>
            <LightBulbIcon className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-green-800 mb-3">Strengths</h4>
              <div className="space-y-2">
                {analyticsData.insights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <StarIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-orange-800 mb-3">Areas for Improvement</h4>
              <div className="space-y-2">
                {analyticsData.insights.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
            <BrainIconSolid className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-3">
            {analyticsData.insights.recommendations.map((rec, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{rec.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Suggestions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Career Path Suggestions</h3>
          <AcademicCapIcon className="w-5 h-5 text-purple-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analyticsData.insights.careerSuggestions.map((career, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{career.field}</h4>
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{career.match}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{career.description}</p>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${career.match}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trend</h3>
            <ClockIcon className="w-5 h-5 text-blue-500" />
          </div>
          <LineChart
            data={{
              labels: analyticsData.attendance.trend.labels,
              datasets: [
                {
                  label: 'Attendance Rate (%)',
                  data: analyticsData.attendance.trend.data,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            }}
            height={300}
            yAxisMax={100}
            yAxisMin={85}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Subject-wise Attendance</h3>
            <BookOpenIcon className="w-5 h-5 text-green-500" />
          </div>
          <BarChart
            data={{
              labels: analyticsData.attendance.subjectWise.labels,
              datasets: [
                {
                  label: 'Attendance (%)',
                  data: analyticsData.attendance.subjectWise.data,
                  backgroundColor: '#10B981',
                  borderColor: '#059669',
                  borderWidth: 2
                }
              ]
            }}
            height={300}
            yAxisMax={100}
            yAxisMin={85}
          />
        </div>
      </div>
    </div>
  );
}
