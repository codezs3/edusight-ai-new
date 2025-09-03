'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateSchoolModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateSchoolModal({ onClose, onSuccess }: CreateSchoolModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    website: '',
    type: '',
    board: '',
    logo: '',
    description: '',
    establishedYear: '',
    capacity: '',
    principalName: '',
    principalEmail: '',
    principalPhone: '',
    subscriptionType: 'trial',
    maxStudents: '100',
    maxTeachers: '20',
    schoolAdminEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'School name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.principalEmail && !/\S+@\S+\.\S+/.test(formData.principalEmail)) {
      newErrors.principalEmail = 'Please enter a valid principal email address';
    }

    if (formData.schoolAdminEmail && !/\S+@\S+\.\S+/.test(formData.schoolAdminEmail)) {
      newErrors.schoolAdminEmail = 'Please enter a valid school admin email address';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL starting with http:// or https://';
    }

    if (formData.establishedYear) {
      const year = parseInt(formData.establishedYear);
      if (year < 1800 || year > new Date().getFullYear()) {
        newErrors.establishedYear = 'Please enter a valid year';
      }
    }

    if (formData.capacity) {
      const capacity = parseInt(formData.capacity);
      if (capacity < 1) {
        newErrors.capacity = 'Capacity must be at least 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);

    try {
      // Convert numeric fields
      const submitData = {
        ...formData,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        maxStudents: parseInt(formData.maxStudents),
        maxTeachers: parseInt(formData.maxTeachers)
      };

      // Remove empty strings
      Object.keys(submitData).forEach(key => {
        if (submitData[key as keyof typeof submitData] === '') {
          delete submitData[key as keyof typeof submitData];
        }
      });

      const response = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('School created successfully');
        onSuccess();
      } else {
        toast.error(data.error || 'Failed to create school');
      }
    } catch (error) {
      toast.error('Error creating school');
      console.error('Create school error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Create New School</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter school name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="school@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.website ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://school.com"
                />
                {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Board
                </label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="IB">IB</option>
                  <option value="MULTIPLE">Multiple Boards</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Principal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Principal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Name
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Principal name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Email
                </label>
                <input
                  type="email"
                  name="principalEmail"
                  value={formData.principalEmail}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.principalEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="principal@school.com"
                />
                {errors.principalEmail && <p className="text-red-500 text-sm mt-1">{errors.principalEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Phone
                </label>
                <input
                  type="tel"
                  name="principalPhone"
                  value={formData.principalPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Principal phone"
                />
              </div>
            </div>
          </div>

          {/* School Admin */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">School Administrator</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Admin Email
              </label>
              <input
                type="email"
                name="schoolAdminEmail"
                value={formData.schoolAdminEmail}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.schoolAdminEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="admin@school.com"
              />
              {errors.schoolAdminEmail && <p className="text-red-500 text-sm mt-1">{errors.schoolAdminEmail}</p>}
              <p className="text-gray-500 text-sm mt-1">
                If user exists, they'll be assigned as school admin. If not, a new account will be created.
              </p>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Established Year
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.establishedYear ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2020"
                />
                {errors.establishedYear && <p className="text-red-500 text-sm mt-1">{errors.establishedYear}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1000"
                />
                {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Type
                </label>
                <select
                  name="subscriptionType"
                  value={formData.subscriptionType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="trial">Trial (30 days)</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://school.com/logo.png"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description about the school..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create School'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
