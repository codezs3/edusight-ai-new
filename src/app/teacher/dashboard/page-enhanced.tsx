'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  AcademicCapIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  BellIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  BookOpenIcon,
  UserGroupIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface TeacherDashboardData {
  profile: {
    name: string;
    department: string;
    school: string;
    subjects: string[];
  };
  stats: {
    totalStudents: number;
    activeAssessments: number;
    pendingGrading: number;
    averageClassScore: number;
    trends: {
      students: number;
      assessments: number;
      grading: number;
      score: number;
    };
  };
  myClasses: any[];
  recentActivity: any[];
  upcomingTasks: any[];
  studentPerformance: any[];
  assessmentStats: any[];
  notifications: any[];
  quickStats: any[];
}

export default function EnhancedTeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'TEACHER') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      // Mock comprehensive teacher dashboard data
      const mockData: TeacherDashboardData = {
        profile: {
          name: session?.user.name || 'Sarah Johnson',
          department: 'Mathematics',
          school: 'EduSight Demo School',
          subjects: ['Algebra', 'Geometry', 'Statistics']
        },
        stats: {
          totalStudents: 89,
          activeAssessments: 12,
          pendingGrading: 23,
          averageClassScore: 82.4,
          trends: {
            students: 5.2,
            assessments: 15.8,
            grading: -12.3,
            score: 3.7
          }
        },
        myClasses: [
          {
            id: '1',
            name: 'Algebra II - Period 1',
            students: 28,
            subject: 'Mathematics',
            grade: 'Grade 10',
            nextClass: '2024-02-01T08:00:00Z',
            averageScore: 85.2,
            recentAssessment: 'Quadratic Functions Quiz'
          },
          {
            id: '2',
            name: 'Geometry - Period 3',
            students: 32,
            subject: 'Mathematics',
            grade: 'Grade 9',
            nextClass: '2024-02-01T10:30:00Z',
            averageScore: 78.9,
            recentAssessment: 'Triangle Properties Test'
          },
          {
            id: '3',
            name: 'Statistics - Period 5',
            students: 29,
            subject: 'Mathematics',
            grade: 'Grade 11',
            nextClass: '2024-02-01T13:15:00Z',
            averageScore: 83.7,
            recentAssessment: 'Probability Assessment'
          }
        ],
        recentActivity: [
          {
            type: 'assessment_completed',
            student: 'Alex Thompson',
            action: 'Completed Algebra Quiz',
            score: 92,
            timestamp: '2024-01-30T14:30:00Z'
          },
          {
            type: 'assignment_submitted',
            student: 'Emma Davis',
            action: 'Submitted Geometry Homework',
            timestamp: '2024-01-30T13:45:00Z'
          },
          {
            type: 'question_asked',
            student: 'Michael Chen',
            action: 'Asked question about quadratic equations',
            timestamp: '2024-01-30T12:20:00Z'
          },
          {
            type: 'assessment_started',
            student: 'Sarah Wilson',
            action: 'Started Statistics Practice Test',
            timestamp: '2024-01-30T11:15:00Z'
          }
        ],
        upcomingTasks: [
          {
            type: 'grading',
            title: 'Grade Algebra Quizzes',
            count: 28,
            dueDate: '2024-02-02',
            priority: 'high'
          },
          {
            type: 'meeting',
            title: 'Parent-Teacher Conference',
            description: 'Meeting with Thompson family',
            dueDate: '2024-02-03',
            priority: 'medium'
          },
          {
            type: 'assessment',
            title: 'Create Geometry Test',
            description: 'Chapter 5: Triangles and Polygons',
            dueDate: '2024-02-05',
            priority: 'medium'
          },
          {
            type: 'report',
            title: 'Monthly Progress Reports',
            count: 89,
            dueDate: '2024-02-07',
            priority: 'low'
          }
        ],
        studentPerformance: [
          { class: 'Algebra II', excellent: 12, good: 10, needs_improvement: 6 },
          { class: 'Geometry', excellent: 8, good: 15, needs_improvement: 9 },
          { class: 'Statistics', excellent: 14, good: 11, needs_improvement: 4 }
        ],
        assessmentStats: [
          { month: 'Sep', completed: 45, average: 78.5 },
          { month: 'Oct', completed: 52, average: 80.2 },
          { month: 'Nov', completed: 48, average: 79.8 },
          { month: 'Dec', completed: 38, average: 81.5 },
          { month: 'Jan', completed: 55, average: 82.4 }
        ],
        notifications: [
          {
            id: '1',
            type: 'urgent',
            title: 'Assessment Deadline',
            message: '23 assignments need grading by tomorrow',
            timestamp: '2024-01-30T15:00:00Z',
            read: false
          },
          {
            id: '2',
            type: 'info',
            title: 'New Student Enrolled',
            message: 'John Smith joined your Algebra II class',
            timestamp: '2024-01-30T10:30:00Z',
            read: false
          },
          {
            id: '3',
            type: 'achievement',
            title: 'Class Milestone',
            message: 'Your Geometry class achieved 90% completion rate',
            timestamp: '2024-01-29T16:45:00Z',
            read: true
          }
        ],
        quickStats: [
          { label: 'This Week', assessments: 15, avgScore: 84.2, participation: 92 },
          { label: 'Last Week', assessments: 12, avgScore: 81.8, participation: 88 },
          { label: 'This Month', assessments: 55, avgScore: 82.4, participation: 90 }
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

  if (!session || session.user.role !== 'TEACHER') {
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

  const { profile, stats, myClasses, recentActivity, upcomingTasks, studentPerformance, assessmentStats, notifications, quickStats } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <AcademicCapIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1>
                <p className="text-green-100 mt-1">{profile.department} • {profile.school}</p>
                <p className="text-green-200 text-sm mt-1">
                  Teaching: {profile.subjects.join(', ')}
                </p>
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
                href="/assessments/create"
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-md hover:bg-opacity-30 transition-colors"
              >
                <PlusIcon className="h-5 w-5 inline mr-2" />
                Create Assessment
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
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                <div className="flex items-center mt-1">
                  {stats.trends.students >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${stats.trends.students >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.trends.students)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Assessments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeAssessments}</p>
                <div className="flex items-center mt-1">
                  {stats.trends.assessments >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${stats.trends.assessments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.trends.assessments)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Grading</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingGrading}</p>
                <div className="flex items-center mt-1">
                  {stats.trends.grading <= 0 ? (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${stats.trends.grading <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.trends.grading)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Class Average</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageClassScore}%</p>
                <div className="flex items-center mt-1">
                  {stats.trends.score >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${stats.trends.score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.trends.score)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Classes */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">My Classes</h3>
                <Link
                  href="/teacher/classes"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {myClasses.map((classItem) => (
                  <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                        <p className="text-sm text-gray-500">{classItem.grade} • {classItem.students} students</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{classItem.averageScore}%</p>
                        <p className="text-sm text-gray-500">avg score</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Next: {new Date(classItem.nextClass).toLocaleString()}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {classItem.recentAssessment && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-600">Recent: </span>
                        <span className="font-medium">{classItem.recentAssessment}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Statistics Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Assessment Statistics</h3>
              <Plot
                data={[
                  {
                    x: assessmentStats.map(d => d.month),
                    y: assessmentStats.map(d => d.completed),
                    type: 'bar',
                    name: 'Completed',
                    marker: { color: '#3B82F6' },
                    yaxis: 'y'
                  },
                  {
                    x: assessmentStats.map(d => d.month),
                    y: assessmentStats.map(d => d.average),
                    type: 'scatter',
                    mode: 'lines+markers',
                    name: 'Average Score',
                    line: { color: '#10B981' },
                    yaxis: 'y2'
                  }
                ]}
                layout={{
                  height: 300,
                  margin: { l: 60, r: 60, t: 20, b: 40 },
                  xaxis: { title: 'Month' },
                  yaxis: { 
                    title: 'Assessments Completed',
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

            {/* Student Performance Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Student Performance Distribution</h3>
              <Plot
                data={[
                  {
                    x: studentPerformance.map(d => d.class),
                    y: studentPerformance.map(d => d.excellent),
                    type: 'bar',
                    name: 'Excellent (90-100%)',
                    marker: { color: '#10B981' }
                  },
                  {
                    x: studentPerformance.map(d => d.class),
                    y: studentPerformance.map(d => d.good),
                    type: 'bar',
                    name: 'Good (70-89%)',
                    marker: { color: '#F59E0B' }
                  },
                  {
                    x: studentPerformance.map(d => d.class),
                    y: studentPerformance.map(d => d.needs_improvement),
                    type: 'bar',
                    name: 'Needs Improvement (<70%)',
                    marker: { color: '#EF4444' }
                  }
                ]}
                layout={{
                  height: 300,
                  margin: { l: 40, r: 40, t: 20, b: 40 },
                  xaxis: { title: 'Class' },
                  yaxis: { title: 'Number of Students' },
                  barmode: 'stack',
                  legend: { x: 0, y: 1 }
                }}
                config={{ displayModeBar: false }}
                className="w-full"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Upcoming Tasks</h3>
              <div className="space-y-4">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        {task.count && (
                          <p className="text-sm text-gray-600 mt-1">{task.count} items</p>
                        )}
                        <div className="flex items-center mt-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'assessment_completed' ? 'bg-green-100' :
                      activity.type === 'assignment_submitted' ? 'bg-blue-100' :
                      activity.type === 'question_asked' ? 'bg-yellow-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'assessment_completed' ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      ) : activity.type === 'assignment_submitted' ? (
                        <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                      ) : activity.type === 'question_asked' ? (
                        <ExclamationCircleIcon className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <BookOpenIcon className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.student}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      {activity.score && (
                        <p className="text-sm text-green-600 font-medium">Score: {activity.score}%</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Stats</h3>
              <div className="space-y-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 mb-2">{stat.label}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-blue-600">{stat.assessments}</p>
                        <p className="text-gray-500">Assessments</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-green-600">{stat.avgScore}%</p>
                        <p className="text-gray-500">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-purple-600">{stat.participation}%</p>
                        <p className="text-gray-500">Participation</p>
                      </div>
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
                  href="/assessments/create"
                  className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">Create Assessment</span>
                </Link>
                <Link
                  href="/teacher/grading"
                  className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <DocumentTextIcon className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="font-medium text-gray-900">Grade Assignments</span>
                </Link>
                <Link
                  href="/teacher/students"
                  className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-gray-900">Manage Students</span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="font-medium text-gray-900">View Analytics</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
