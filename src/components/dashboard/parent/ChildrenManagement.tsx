'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  HeartIcon,
  AcademicCapIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  UserCircleIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface Child {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  grade: string;
  dateOfBirth: Date;
  rollNumber?: string;
  section?: string;
  gender?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  medicalInfo?: string;
  specialNeeds?: string;
  learningStyle?: string;
  interests?: string;
  school?: {
    name: string;
  };
  assessments: any[];
  createdAt: Date;
}

interface ChildFormData {
  name: string;
  email: string;
  grade: string;
  dateOfBirth: string;
  section: string;
  gender: string;
  bloodGroup: string;
  emergencyContact: string;
  medicalInfo: string;
  specialNeeds: string;
  learningStyle: string;
  interests: string;
}

export default function ChildrenManagement() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [viewingChild, setViewingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState<ChildFormData>({
    name: '',
    email: '',
    grade: '',
    dateOfBirth: '',
    section: '',
    gender: '',
    bloodGroup: '',
    emergencyContact: '',
    medicalInfo: '',
    specialNeeds: '',
    learningStyle: '',
    interests: '',
  });

  const grades = [
    'Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12'
  ];

  const learningStyles = [
    'Visual Learner',
    'Auditory Learner',
    'Kinesthetic Learner',
    'Reading/Writing Learner',
    'Mixed Style'
  ];

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parent/children');
      const data = await response.json();

      if (response.ok && data.success) {
        setChildren(data.children || []);
      } else {
        toast.error(data.error || 'Failed to fetch children');
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to fetch children');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingChild ? `/api/parent/children/${editingChild.id}` : '/api/parent/children';
      const method = editingChild ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(editingChild ? 'Child updated successfully!' : 'Child added successfully!');
        setShowForm(false);
        setEditingChild(null);
        resetForm();
        fetchChildren();
      } else {
        toast.error(data.error || 'Failed to save child');
      }
    } catch (error) {
      console.error('Error saving child:', error);
      toast.error('Failed to save child');
    }
  };

  const handleEdit = (child: Child) => {
    setFormData({
      name: child.user.name,
      email: child.user.email,
      grade: child.grade || '',
      dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
      section: child.section || '',
      gender: child.gender || '',
      bloodGroup: child.bloodGroup || '',
      emergencyContact: child.emergencyContact || '',
      medicalInfo: child.medicalInfo || '',
      specialNeeds: child.specialNeeds || '',
      learningStyle: child.learningStyle || '',
      interests: child.interests || '',
    });
    setEditingChild(child);
    setShowForm(true);
  };

  const handleDelete = async (childId: string) => {
    if (!confirm('Are you sure you want to remove this child? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/parent/children/${childId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Child removed successfully');
        fetchChildren();
      } else {
        toast.error(data.error || 'Failed to remove child');
      }
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('Failed to remove child');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      grade: '',
      dateOfBirth: '',
      section: '',
      gender: '',
      bloodGroup: '',
      emergencyContact: '',
      medicalInfo: '',
      specialNeeds: '',
      learningStyle: '',
      interests: '',
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Children Management</h1>
          <p className="text-gray-600">Manage your children's profiles and information</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingChild(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <UserPlusIcon className="h-5 w-5" />
          <span>Add Child</span>
        </button>
      </div>

      {/* Children Grid */}
      {children.length === 0 ? (
        <div className="text-center py-12">
          <UserCircleIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Children Added</h3>
          <p className="text-gray-500 mb-4">Start by adding your first child to begin tracking their progress.</p>
          <button
            onClick={() => {
              resetForm();
              setEditingChild(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <div key={child.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {child.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{child.user.name}</h3>
                    <p className="text-sm text-gray-500">{child.grade}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setViewingChild(child)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="View Details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(child)}
                    className="p-1 text-gray-400 hover:text-green-600"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    Age: {child.dateOfBirth ? calculateAge(child.dateOfBirth) : 'N/A'} years
                  </span>
                </div>
                
                {child.school && (
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{child.school.name}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {child.assessments?.length || 0} Assessments
                  </span>
                </div>

                {child.learningStyle && (
                  <div className="flex items-center space-x-2">
                    <HeartIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{child.learningStyle}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Added: {new Date(child.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-1">
                    {child.specialNeeds && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Special Needs
                      </span>
                    )}
                    {child.medicalInfo && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Medical
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingChild ? 'Edit Child' : 'Add New Child'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingChild(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade *
                    </label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section
                    </label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => setFormData({...formData, section: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., A, B, C"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Style
                  </label>
                  <select
                    value={formData.learningStyle}
                    onChange={(e) => setFormData({...formData, learningStyle: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Learning Style</option>
                    {learningStyles.map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical Information
                  </label>
                  <textarea
                    value={formData.medicalInfo}
                    onChange={(e) => setFormData({...formData, medicalInfo: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Allergies, medical conditions, medications..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Needs
                  </label>
                  <textarea
                    value={formData.specialNeeds}
                    onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Learning disabilities, accommodations needed..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interests & Hobbies
                  </label>
                  <textarea
                    value={formData.interests}
                    onChange={(e) => setFormData({...formData, interests: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Sports, arts, music, reading..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingChild(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingChild ? 'Update Child' : 'Add Child'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingChild && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Child Details</h2>
                <button
                  onClick={() => setViewingChild(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {viewingChild.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{viewingChild.user.name}</h3>
                    <p className="text-gray-600">{viewingChild.grade}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span>{viewingChild.dateOfBirth ? calculateAge(viewingChild.dateOfBirth) : 'N/A'} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span>{viewingChild.gender || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Group:</span>
                        <span>{viewingChild.bloodGroup || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Section:</span>
                        <span>{viewingChild.section || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Contact & Emergency</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span>{viewingChild.user.email || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emergency Contact:</span>
                        <span>{viewingChild.emergencyContact || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">School:</span>
                        <span>{viewingChild.school?.name || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {viewingChild.learningStyle && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Learning Style</h4>
                    <p className="text-sm text-gray-600">{viewingChild.learningStyle}</p>
                  </div>
                )}

                {viewingChild.interests && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Interests & Hobbies</h4>
                    <p className="text-sm text-gray-600">{viewingChild.interests}</p>
                  </div>
                )}

                {viewingChild.medicalInfo && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Medical Information</h4>
                    <p className="text-sm text-gray-600">{viewingChild.medicalInfo}</p>
                  </div>
                )}

                {viewingChild.specialNeeds && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Special Needs</h4>
                    <p className="text-sm text-gray-600">{viewingChild.specialNeeds}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setViewingChild(null);
                      handleEdit(viewingChild);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
