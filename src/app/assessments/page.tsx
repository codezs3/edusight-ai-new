'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  HeartIcon,
  ChartBarIcon,
  PlayIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'psychological' | 'physical' | 'behavioral' | 'career';
  category: string;
  duration: number; // in minutes
  questions: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'published' | 'archived';
  completions: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

export default function AssessmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetchAssessments();
  }, [session, status, router]);

  const fetchAssessments = async () => {
    try {
      // Mock assessment data
      const mockAssessments: Assessment[] = [
        {
          id: '1',
          title: 'Mathematics Proficiency Test',
          description: 'Comprehensive assessment covering algebra, geometry, and statistics for grade 10 students.',
          type: 'academic',
          category: 'Mathematics',
          duration: 90,
          questions: 50,
          difficulty: 'intermediate',
          status: 'published',
          completions: 234,
          averageScore: 78.5,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-25'
        },
        {
          id: '2',
          title: 'Personality Assessment (Big Five)',
          description: 'Evaluate personality traits using the Big Five personality dimensions model.',
          type: 'psychological',
          category: 'Personality',
          duration: 45,
          questions: 60,
          difficulty: 'beginner',
          status: 'published',
          completions: 189,
          averageScore: 85.2,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-20'
        },
        {
          id: '3',
          title: 'Career Interest Inventory',
          description: 'Discover career paths that align with your interests, values, and skills.',
          type: 'career',
          category: 'Career Guidance',
          duration: 60,
          questions: 80,
          difficulty: 'intermediate',
          status: 'published',
          completions: 156,
          averageScore: 82.1,
          createdAt: '2024-01-12',
          updatedAt: '2024-01-22'
        },
        {
          id: '4',
          title: 'Physical Fitness Assessment',
          description: 'Evaluate physical fitness levels including cardiovascular health, strength, and flexibility.',
          type: 'physical',
          category: 'Health & Fitness',
          duration: 30,
          questions: 25,
          difficulty: 'beginner',
          status: 'published',
          completions: 98,
          averageScore: 73.8,
          createdAt: '2024-01-18',
          updatedAt: '2024-01-28'
        },
        {
          id: '5',
          title: 'Social-Emotional Learning Assessment',
          description: 'Measure social awareness, self-management, and relationship skills.',
          type: 'behavioral',
          category: 'SEL',
          duration: 40,
          questions: 35,
          difficulty: 'intermediate',
          status: 'published',
          completions: 145,
          averageScore: 79.3,
          createdAt: '2024-01-14',
          updatedAt: '2024-01-24'
        },
        {
          id: '6',
          title: 'Advanced Physics Concepts',
          description: 'Challenging assessment covering quantum mechanics and relativity for advanced students.',
          type: 'academic',
          category: 'Physics',
          duration: 120,
          questions: 40,
          difficulty: 'advanced',
          status: 'draft',
          completions: 0,
          averageScore: 0,
          createdAt: '2024-01-20',
          updatedAt: '2024-01-30'
        }
      ];
      
      setAssessments(mockAssessments);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || assessment.type === typeFilter;
    const matchesStatus = !statusFilter || assessment.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return AcademicCapIcon;
      case 'psychological': return HeartIcon;
      case 'physical': return ChartBarIcon;
      case 'behavioral': return DocumentTextIcon;
      case 'career': return ClipboardDocumentListIcon;
      default: return DocumentTextIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'psychological': return 'bg-purple-100 text-purple-800';
      case 'physical': return 'bg-green-100 text-green-800';
      case 'behavioral': return 'bg-orange-100 text-orange-800';
      case 'career': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return CheckCircleIcon;
      case 'draft': return ExclamationCircleIcon;
      case 'archived': return ClockIcon;
      default: return ClockIcon;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment Center</h1>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive assessment tools for holistic student evaluation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </Link>
              {(session.user.role === 'ADMIN' || session.user.role === 'TEACHER') && (
                <Link
                  href="/assessments/create"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 inline mr-2" />
                  Create Assessment
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Assessments</p>
                <p className="text-2xl font-semibold text-gray-900">{assessments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assessments.filter(a => a.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PlayIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Completions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assessments.reduce((sum, a) => sum + a.completions, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Score</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(assessments.reduce((sum, a) => sum + a.averageScore, 0) / assessments.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value="academic">Academic</option>
                <option value="psychological">Psychological</option>
                <option value="physical">Physical</option>
                <option value="behavioral">Behavioral</option>
                <option value="career">Career</option>
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                <FunnelIcon className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => {
            const TypeIcon = getTypeIcon(assessment.type);
            const StatusIcon = getStatusIcon(assessment.status);
            
            return (
              <div key={assessment.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getTypeColor(assessment.type)}`}>
                        <TypeIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {assessment.status}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assessment.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {assessment.duration} minutes • {assessment.questions} questions
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ChartBarIcon className="h-4 w-4 mr-2" />
                      {assessment.completions} completions • {assessment.averageScore}% avg score
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(assessment.type)}`}>
                      {assessment.category}
                    </span>
                    <div className="flex space-x-2">
                      {assessment.status === 'published' && (
                        <Link
                          href={`/assessments/${assessment.id}/take`}
                          className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
                        >
                          <PlayIcon className="h-4 w-4 inline mr-1" />
                          Take
                        </Link>
                      )}
                      <Link
                        href={`/assessments/${assessment.id}`}
                        className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
            {(session.user.role === 'ADMIN' || session.user.role === 'TEACHER') && (
              <Link
                href="/assessments/create"
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 inline mr-2" />
                Create Your First Assessment
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
