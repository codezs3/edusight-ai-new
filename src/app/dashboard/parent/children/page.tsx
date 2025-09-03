'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout';
import {
  PlusIcon,
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  AcademicCapIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  BookOpenIcon,
  ChartBarIcon,
  DocumentIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import AddChildModal from '@/components/dashboard/parent/AddChildModal';
import { GRADE_OPTIONS } from '@/constants/grades';

interface Child {
  id: string;
  grade: string;
  section?: string;
  rollNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  schoolId?: string;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
  };
  school?: {
    id: string;
    name: string;
    board: string;
  };
}

export default function ChildrenManagementPage() {
  const { data: session } = useSession();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Menu items for parent dashboard
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/parent',
      icon: HomeIcon
    },
    {
      title: 'My Children',
      href: '/dashboard/parent/children',
      icon: UserCircleIcon
    },
    {
      title: 'Upload Documents',
      href: '/dashboard/parent/upload',
      icon: DocumentIcon
    },
    {
      title: 'Analytics',
      href: '/dashboard/parent/analytics',
      icon: ChartBarIcon
    }
  ];

  useEffect(() => {
    if (session?.user?.id) {
      fetchChildren();
    }
  }, [session]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parent/children');
      const data = await response.json();

      if (response.ok && data.success) {
        setChildren(data.children || []);
      } else {
        console.error('Failed to fetch children:', data);
        toast.error(data.error || 'Failed to fetch children');
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to fetch children. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChildAdded = (newChild: any) => {
    console.log('Child added:', newChild);
    setChildren(prev => [newChild, ...prev]);
    setShowAddModal(false);
    toast.success('Child added successfully!');
    // Refresh the data to ensure consistency
    fetchChildren();
  };



  const handleDeleteChild = async (child: Child) => {
    if (!confirm(`Are you sure you want to remove ${child.user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/parent/children/${child.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Child removed successfully!');
        fetchChildren(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to remove child');
      }
    } catch (error) {
      console.error('Error removing child:', error);
      toast.error('Failed to remove child');
    }
  };

  const getGradeLabel = (gradeValue: string) => {
    const grade = GRADE_OPTIONS.find(g => g.value === gradeValue);
    return grade?.label || gradeValue;
  };

  const getGradeCategory = (gradeValue: string) => {
    const grade = GRADE_OPTIONS.find(g => g.value === gradeValue);
    return grade?.category || 'unknown';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'early_childhood': return 'bg-pink-100 text-pink-800';
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'middle': return 'bg-green-100 text-green-800';
      case 'secondary': return 'bg-orange-100 text-orange-800';
      case 'higher_secondary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading if session is not loaded or data is being fetched
  if (!session || loading) {
    return (
      <VerticalDashboardLayout
        title="My Children"
        subtitle="Manage your children's profiles and academic information"
        menuItems={menuItems}
        activeItem="/dashboard/parent/children"
      >
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </VerticalDashboardLayout>
    );
  }

  // Verify user is a parent
  const userRole = (session.user as any)?.role;
  if (userRole !== 'PARENT') {
    return (
      <VerticalDashboardLayout
        title="Access Denied"
        subtitle="This page is only available to parents"
        menuItems={menuItems}
        activeItem="/dashboard/parent/children"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Access denied. Parent role required.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </VerticalDashboardLayout>
    );
  }

  return (
    <VerticalDashboardLayout
      title="My Children"
      subtitle="Manage your children's profiles and academic information"
      menuItems={menuItems}
      activeItem="/dashboard/parent/children"
    >
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
          <p className="text-gray-600">Manage your children's profiles and academic information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Child
        </button>
      </div>

      {/* Children Grid */}
      {children.length === 0 ? (
        <div className="text-center py-12">
          <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Children Added Yet</h3>
          <p className="text-gray-600 mb-6">Add your first child to start tracking their academic progress</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Your First Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Child Avatar and Basic Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    {child.user.image ? (
                      <img
                        src={child.user.image}
                        alt={child.user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-xl">
                        {child.user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{child.user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(getGradeCategory(child.grade))}`}>
                        {getGradeLabel(child.grade)}
                      </span>
                      {child.section && (
                        <span className="text-sm text-gray-500">Sec {child.section}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-2 mb-4">
                  {child.school && (
                    <div className="flex items-center text-sm text-gray-600">
                      <AcademicCapIcon className="w-4 h-4 mr-2" />
                      <span>{child.school.name}</span>
                    </div>
                  )}
                  {child.rollNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpenIcon className="w-4 h-4 mr-2" />
                      <span>Roll No: {child.rollNumber}</span>
                    </div>
                  )}
                  {child.dateOfBirth && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      <span>{new Date(child.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toast('View functionality coming soon!', { icon: 'ℹ️' })}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <EyeIcon className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => toast('Edit functionality coming soon!', { icon: 'ℹ️' })}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteChild(child)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddChildModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onChildAdded={handleChildAdded}
          schoolId={(session?.user as any)?.schoolId || null}
        />
      )}

      {/* TODO: Add EditChildModal and ViewChildModal when needed */}
      </div>
    </VerticalDashboardLayout>
  );
}
