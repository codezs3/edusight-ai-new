'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import AddStudentModal from '@/components/dashboard/school-admin/AddStudentModal';
import { GRADE_OPTIONS } from '@/constants/grades';

interface Student {
  id: string;
  grade: string;
  section?: string;
  rollNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  bloodGroup?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: Date;
  };
  parent?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
  };
  school: {
    id: string;
    name: string;
    board: string;
  };
}

export default function StudentsPage() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<any>(null);

  const limit = 10;

  // Fetch students
  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedGrade && { grade: selectedGrade }),
        ...(selectedSection && { section: selectedSection }),
      });

      const response = await fetch(`/api/school-admin/students?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch students');
      }

      setStudents(data.students);
      setTotalPages(data.pagination.pages);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'SCHOOL_ADMIN') {
      fetchStudents();
    }
  }, [session, currentPage, searchTerm, selectedGrade, selectedSection]);

  const handleStudentAdded = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    setShowAddModal(false);
    toast.success('Student added successfully!');
    fetchStudents(); // Refresh to get updated stats
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to remove this student?')) return;

    try {
      const response = await fetch(`/api/school-admin/students/${studentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove student');
      }

      setStudents(prev => prev.filter(s => s.id !== studentId));
      toast.success('Student removed successfully');
      fetchStudents(); // Refresh stats
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Failed to remove student');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedSection('');
    setCurrentPage(1);
  };

  if (session?.user?.role !== 'SCHOOL_ADMIN') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. School admin role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage students in your school</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <UserGroupIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Grades</p>
                <p className="text-2xl font-bold text-gray-900">{stats.grades?.length || 0}</p>
              </div>
              <AcademicCapIcon className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sections</p>
                <p className="text-2xl font-bold text-gray-900">{stats.sections?.length || 0}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Students
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Grades</option>
              {GRADE_OPTIONS.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <input
              type="text"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              placeholder="Section"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center space-x-2"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </form>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade & Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <UserGroupIcon className="w-12 h-12 text-gray-400" />
                      <p className="text-gray-500">No students found</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="text-green-600 hover:text-green-700 underline"
                      >
                        Add your first student
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700">
                            {student.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.user.email}
                          </div>
                          {student.rollNumber && (
                            <div className="text-xs text-gray-400">
                              Roll: {student.rollNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Grade {student.grade}
                        {student.section && ` - Section ${student.section}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.parent ? (
                        <div>
                          <div className="text-sm text-gray-900">
                            {student.parent.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.parent.user.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No parent assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(student.user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {/* View student details */}}
                          className="text-green-600 hover:text-green-700 p-1"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* Edit student */}}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Edit Student"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Remove Student"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
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

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
}
