'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import CreateSchoolModal from '@/components/dashboard/admin/CreateSchoolModal';
import MiniChart from '@/components/charts/MiniChart';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  board: string;
  city: string;
  state: string;
  subscriptionType: string;
  isActive: boolean;
  schoolAdmin: {
    id: string;
    name: string;
    email: string;
  } | null;
  _count: {
    students: number;
    teachers: number;
    parents: number;
  };
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function SchoolManagementPage() {
  const { data: session } = useSession();
  const [schools, setSchools] = useState<School[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('');
  const [filterBoard, setFilterBoard] = useState('');

  useEffect(() => {
    fetchSchools();
  }, [pagination.page, searchTerm, filterStatus, filterType, filterBoard]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterType && { type: filterType }),
        ...(filterBoard && { board: filterBoard })
      });

      const response = await fetch(`/api/admin/schools?${params}`);
      const data = await response.json();

      if (data.success) {
        setSchools(data.data.schools);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || 'Failed to fetch schools');
      }
    } catch (error) {
      toast.error('Error fetching schools');
      console.error('Fetch schools error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchool = () => {
    setSelectedSchool(null);
    setShowCreateModal(true);
  };

  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setShowEditModal(true);
  };

  const handleViewSchool = (school: School) => {
    setSelectedSchool(school);
    setShowViewModal(true);
  };

  const handleDeleteSchool = async (school: School) => {
    if (!confirm(`Are you sure you want to delete ${school.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/schools/${school.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('School deleted successfully');
        fetchSchools();
      } else {
        toast.error(data.error || 'Failed to delete school');
      }
    } catch (error) {
      toast.error('Error deleting school');
      console.error('Delete school error:', error);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getSubscriptionBadge = (type: string) => {
    const colors = {
      trial: 'bg-yellow-100 text-yellow-800',
      basic: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (loading && schools.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600">Manage schools and their administrators</p>
        </div>
        <button
          onClick={handleCreateSchool}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add School</span>
        </button>
      </div>

      {/* Stats Cards with Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              <p className="text-sm text-green-600">+12% this month</p>
            </div>
            <div className="w-16 h-12">
              <MiniChart
                type="line"
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{
                    data: [850, 920, 1050, 1180, 1210, pagination.total],
                    tension: 0.4
                  }]
                }}
                color="#3B82F6"
                height={48}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Schools</p>
              <p className="text-2xl font-bold text-gray-900">
                {schools.filter(s => s.isActive).length}
              </p>
              <p className="text-sm text-green-600">98.5% active rate</p>
            </div>
            <div className="w-16 h-12">
              <MiniChart
                type="doughnut"
                data={{
                  labels: ['Active', 'Inactive'],
                  datasets: [{
                    data: [
                      schools.filter(s => s.isActive).length,
                      schools.filter(s => !s.isActive).length
                    ]
                  }]
                }}
                color="#10B981"
                height={48}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {schools.reduce((acc, school) => acc + school._count.students, 0).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">Growing steadily</p>
            </div>
            <div className="w-16 h-12">
              <MiniChart
                type="bar"
                data={{
                  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                  datasets: [{
                    data: [28500, 32100, 35600, schools.reduce((acc, school) => acc + school._count.students, 0)]
                  }]
                }}
                color="#8B5CF6"
                height={48}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">
                {schools.reduce((acc, school) => acc + school._count.teachers, 0).toLocaleString()}
              </p>
              <p className="text-sm text-orange-600">Excellent ratio</p>
            </div>
            <div className="w-16 h-12">
              <MiniChart
                type="line"
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{
                    data: [5200, 5450, 5780, 6100, 6350, schools.reduce((acc, school) => acc + school._count.teachers, 0)],
                    tension: 0.4
                  }]
                }}
                color="#F59E0B"
                height={48}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Analytics Link */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Platform Analytics Dashboard</h3>
            <p className="text-blue-100 mb-4">
              Get comprehensive insights into platform performance, user growth, and revenue trends
            </p>
            <Link
              href="/dashboard/admin/analytics"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>View Full Analytics</span>
            </Link>
          </div>
          <div className="w-32 h-20 opacity-80">
            <MiniChart
              type="line"
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    data: [1200, 1450, 1680, 1890, 2100, 2350],
                    tension: 0.4,
                    borderColor: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                ]
              }}
              height={80}
              showTooltip={false}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="international">International</option>
          </select>

          <select
            value={filterBoard}
            onChange={(e) => setFilterBoard(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Boards</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="IGCSE">IGCSE</option>
            <option value="IB">IB</option>
            <option value="MULTIPLE">Multiple</option>
            <option value="OTHER">Other</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterType('');
              setFilterBoard('');
            }}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Board
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {school.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {school.city}, {school.state}
                      </div>
                      <div className="text-sm text-gray-500">
                        {school.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {school.schoolAdmin ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">
                            {school.schoolAdmin.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {school.schoolAdmin.email}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">No admin assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 capitalize">
                        {school.type || 'Not specified'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {school.board || 'Not specified'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>Students: {school._count.students}</div>
                      <div>Teachers: {school._count.teachers}</div>
                      <div>Parents: {school._count.parents}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      {getStatusBadge(school.isActive)}
                      {getSubscriptionBadge(school.subscriptionType)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewSchool(school)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditSchool(school)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit School"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchool(school)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete School"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.page === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals will be added here */}
      {showCreateModal && (
        <CreateSchoolModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchSchools();
          }}
        />
      )}

      {showEditModal && selectedSchool && (
        <EditSchoolModal
          school={selectedSchool}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchSchools();
          }}
        />
      )}

      {showViewModal && selectedSchool && (
        <ViewSchoolModal
          school={selectedSchool}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}

// Placeholder components for modals - these will be implemented next
function EditSchoolModal({ school, onClose, onSuccess }: { school: School; onClose: () => void; onSuccess: () => void }) {
  return <div>Edit School Modal - To be implemented</div>;
}

function ViewSchoolModal({ school, onClose }: { school: School; onClose: () => void }) {
  return <div>View School Modal - To be implemented</div>;
}
