import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { GRADE_OPTIONS } from '@/constants/grades';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentAdded: (student: any) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onStudentAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    section: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    parentEmail: '',
    parentName: '',
    parentPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/school-admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add student');
      }

      onStudentAdded(data.student);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        grade: '',
        section: '',
        rollNumber: '',
        dateOfBirth: '',
        gender: '',
        bloodGroup: '',
        parentEmail: '',
        parentName: '',
        parentPhone: '',
      });
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error instanceof Error ? error.message : 'Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <AcademicCapIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Add New Student
                      </Dialog.Title>
                      <p className="text-sm text-gray-600">
                        Add a new student to your school
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Student Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Student Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter student's full name"
                        />
                      </div>

                      {/* Email */}
                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="student@school.edu (auto-generated if empty)"
                        />
                      </div>

                      {/* Grade */}
                      <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Grade *
                        </label>
                        <select
                          id="grade"
                          name="grade"
                          required
                          value={formData.grade}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="">Select Grade</option>
                          {GRADE_OPTIONS.map((grade) => (
                            <option key={grade.value} value={grade.value}>
                              {grade.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Section */}
                      <div>
                        <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                          Section
                        </label>
                        <input
                          type="text"
                          id="section"
                          name="section"
                          value={formData.section}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="A, B, C..."
                        />
                      </div>

                      {/* Roll Number */}
                      <div>
                        <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          id="rollNumber"
                          name="rollNumber"
                          value={formData.rollNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Roll No."
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Blood Group */}
                      <div>
                        <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Group
                        </label>
                        <select
                          id="bloodGroup"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
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
                    </div>
                  </div>

                  {/* Parent Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Parent Information (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Parent Name */}
                      <div>
                        <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Name
                        </label>
                        <input
                          type="text"
                          id="parentName"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Parent's full name"
                        />
                      </div>

                      {/* Parent Email */}
                      <div>
                        <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Email
                        </label>
                        <input
                          type="email"
                          id="parentEmail"
                          name="parentEmail"
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="parent@example.com"
                        />
                      </div>

                      {/* Parent Phone */}
                      <div className="md:col-span-2">
                        <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                          Parent Phone
                        </label>
                        <input
                          type="tel"
                          id="parentPhone"
                          name="parentPhone"
                          value={formData.parentPhone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Add Student</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddStudentModal;
