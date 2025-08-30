'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  UserIcon,
  BellIcon,
  CalendarIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  StarIcon,
  ArrowRightIcon,
  FireIcon
} from '@heroicons/react/24/outline';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface StudentDashboardData {
  profile: {
    name: string;
    grade: string;
    school: string;
    avatar?: string;
  };
  stats: {
    completedAssessments: number;
    averageScore: number;
    rank: number;
    totalStudents: number;
    streak: number;
    badges: number;
  };
  recentAssessments: any[];
  upcomingAssessments: any[];
  performanceData: any[];
  subjectProgress: any[];
  achievements: any[];
  recommendations: any[];
  notifications: any[];
}

export default function EnhancedStudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'STUDENT') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      // Mock comprehensive student dashboard data
      const mockData: StudentDashboardData = {
        profile: {
          name: session?.user.name || 'Alex Thompson',
          grade: 'Grade 10',
          school: 'EduSight Demo School'
        },
        stats: {
          completedAssessments: 23,
          averageScore: 85.2,
          rank: 3,
          totalStudents: 44,
          streak: 7,
          badges: 12
        },
        recentAssessments: [
          {
            id: '1',
            title: 'Mathematics - Algebra',
            score: 92,
            maxScore: 100,
            completedAt: '2024-01-29',
            status: 'completed',
            feedback: 'Excellent work on quadratic equations!'
          },
          {
            id: '2',
            title: 'Science - Physics',
            score: 78,
            maxScore: 100,
            completedAt: '2024-01-27',
            status: 'completed',
            feedback: 'Good understanding of motion concepts.'
          },
          {
            id: '3',
            title: 'English - Literature',
            score: 88,
            maxScore: 100,
            completedAt: '2024-01-25',
            status: 'completed',
            feedback: 'Great analysis of character development.'
          }
        ],
        upcomingAssessments: [
          {
            id: '4',
            title: 'History - World War II',
            dueDate: '2024-02-05',
            duration: 60,
            questions: 40,
            type: 'academic'
          },
          {
            id: '5',
            title: 'Career Interest Survey',
            dueDate: '2024-02-08',
            duration: 45,
            questions: 60,
            type: 'career'
          }
        ],
        performanceData: [
          { subject: 'Mathematics', current: 92, previous: 85, target: 90 },
          { subject: 'Science', current: 78, previous: 82, target: 85 },
          { subject: 'English', current: 88, previous: 86, target: 90 },
          { subject: 'History', current: 82, previous: 79, target: 85 },
          { subject: 'Psychology', current: 95, previous: 91, target: 95 }
        ],
        subjectProgress: [
          { month: 'Sep', math: 75, science: 72, english: 80, history: 70 },
          { month: 'Oct', math: 78, science: 75, english: 82, history: 73 },
          { month: 'Nov', math: 82, science: 78, english: 85, history: 76 },
          { month: 'Dec', math: 85, science: 80, english: 87, history: 79 },
          { month: 'Jan', math: 92, science: 78, english: 88, history: 82 }
        ],
        achievements: [
          {
            id: '1',
            title: 'Math Wizard',
            description: 'Scored 90+ on 5 consecutive math assessments',
            icon: '🧮',
            earnedAt: '2024-01-29',
            rarity: 'rare'
          },
          {
            id: '2',
            title: 'Consistent Learner',
            description: '7-day assessment streak',
            icon: '🔥',
            earnedAt: '2024-01-28',
            rarity: 'common'
          },
          {
            id: '3',
            title: 'Literature Expert',
            description: 'Perfect score on Shakespeare analysis',
            icon: '📚',
            earnedAt: '2024-01-25',
            rarity: 'epic'
          }
        ],
        recommendations: [
          {
            type: 'assessment',
            title: 'Take Physics Practice Test',
            description: 'Based on your recent performance, additional practice in mechanics would be beneficial.',
            priority: 'high',
            estimatedTime: 30
          },
          {
            type: 'study',
            title: 'Review Algebra Concepts',
            description: 'Strengthen your foundation before moving to advanced topics.',
            priority: 'medium',
            estimatedTime: 45
          },
          {
            type: 'career',
            title: 'Explore STEM Careers',
            description: 'Your strong performance in math and science suggests STEM career paths.',
            priority: 'low',
            estimatedTime: 20
          }
        ],
        notifications: [
          {
            id: '1',
            type: 'achievement',
            title: 'New Badge Earned!',
            message: 'You earned the "Math Wizard" badge',
            timestamp: '2024-01-29T10:30:00Z',
            read: false
          },
          {
            id: '2',
            type: 'reminder',
            title: 'Assessment Due Soon',
            message: 'History assessment due in 3 days',
            timestamp: '2024-01-29T09:00:00Z',
            read: false
          },
          {
            id: '3',
            type: 'feedback',
            title: 'Teacher Feedback Available',
            message: 'Ms. Johnson left feedback on your English essay',
            timestamp: '2024-01-28T15:45:00Z',
            read: true
          }
        ]
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  if (!session || session.user.role !== 'STUDENT') {
    return null;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No dashboard data available</h3>
          <p className="text-gray-500">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { profile, stats, recentAssessments, upcomingAssessments, performanceData, subjectProgress, achievements, recommendations, notifications } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">Welcome back, {profile.name}!</h1>
                <p className="text-primary-100 mt-1">{profile.grade} • {profile.school}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full">
                <BellIcon className="h-6 w-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              <Link
                href="/student/profile"
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-md hover:bg-opacity-30 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completedAssessments}</p>
                <p className="text-xs text-gray-500">assessments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageScore}%</p>
                <p className="text-xs text-green-600">+2.3% this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Class Rank</p>
                <p className="text-2xl font-semibold text-gray-900">#{stats.rank}</p>
                <p className="text-xs text-gray-500">of {stats.totalStudents} students</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Streak</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.streak}</p>
                <p className="text-xs text-gray-500">days active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Performance Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Subject Performance Trends</h3>
              <Plot
                data={[
                  {
                    x: subjectProgress.map(d => d.month),
                    y: subjectProgress.map(d => d.math),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Mathematics',
                    line: { color: '#3B82F6' }
                  },
                  {
                    x: subjectProgress.map(d => d.month),
                    y: subjectProgress.map(d => d.science),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Science',
                    line: { color: '#10B981' }
                  },
                  {
                    x: subjectProgress.map(d => d.month),
                    y: subjectProgress.map(d => d.english),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'English',
                    line: { color: '#F59E0B' }
                  },
                  {
                    x: subjectProgress.map(d => d.month),
                    y: subjectProgress.map(d => d.history),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'History',
                    line: { color: '#EF4444' }
                  }
                ]}
                layout={{
                  height: 300,
                  margin: { l: 40, r: 40, t: 20, b: 40 },
                  xaxis: { title: 'Month' },
                  yaxis: { title: 'Score (%)' },
                  legend: { x: 0, y: 1 }
                }}
                config={{ displayModeBar: false }}
                className="w-full"
              />
            </div>

            {/* Recent Assessments */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Assessments</h3>
                <Link
                  href="/student/assessments"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentAssessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        assessment.score >= 90 ? 'bg-green-100' :
                        assessment.score >= 80 ? 'bg-blue-100' :
                        assessment.score >= 70 ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <BookOpenIcon className={`h-5 w-5 ${
                          assessment.score >= 90 ? 'text-green-600' :
                          assessment.score >= 80 ? 'text-blue-600' :
                          assessment.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{assessment.title}</h4>
                        <p className="text-sm text-gray-500">{assessment.feedback}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {assessment.score}/{assessment.maxScore}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(assessment.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">AI Recommendations</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg">
                    <div className={`p-2 rounded-lg mr-4 ${
                      rec.priority === 'high' ? 'bg-red-100' :
                      rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <StarIcon className={`h-5 w-5 ${
                        rec.priority === 'high' ? 'text-red-600' :
                        rec.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                      <div className="flex items-center mt-2">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{rec.estimatedTime} min</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {rec.priority} priority
                        </span>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Assessments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Upcoming Assessments</h3>
              <div className="space-y-4">
                {upcomingAssessments.map((assessment) => (
                  <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{assessment.title}</h4>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {assessment.duration} min • {assessment.questions} questions
                      </div>
                    </div>
                    <button className="mt-3 w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                      <PlayIcon className="h-4 w-4 inline mr-2" />
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full mt-1 ${
                        achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/assessments"
                  className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpenIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Browse Assessments</span>
                </Link>
                <Link
                  href="/student/progress"
                  className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">View Progress</span>
                </Link>
                <Link
                  href="/student/achievements"
                  className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TrophyIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">View Achievements</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
