'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

interface ParentProfile {
  id: string
  userId: string
  phone?: string
  address?: string
  occupation?: string
  user: {
    id: string
    name: string
    email: string
    image?: string
    createdAt: string
  }
  school?: {
    id: string
    name: string
    board: string
  }
}

export default function ParentProfile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    occupation: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/parent/profile')
      return
    }
    if (session?.user?.role !== 'PARENT') {
      router.push('/dashboard')
      return
    }

    fetchProfile()
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/parent/profile')
      const data = await response.json()

      if (response.ok) {
        setProfile(data.profile)
        setFormData({
          name: data.profile.user.name || '',
          phone: data.profile.phone || '',
          address: data.profile.address || '',
          occupation: data.profile.occupation || ''
        })
      } else {
        console.error('Failed to fetch profile:', data)
        toast.error(data.error || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/parent/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data.profile)
        setEditing(false)
        toast.success('Profile updated successfully')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.user.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        occupation: profile.occupation || ''
      })
    }
    setEditing(false)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'PARENT' || !profile) {
    return null
  }

  const menuItems = [
    { title: 'Dashboard', href: '/dashboard/parent', icon: UserIcon },
    { title: 'Children', href: '/dashboard/parent/children', icon: UserIcon },
    { title: 'Profile', href: '/dashboard/parent/profile', icon: UserIcon },
  ]

  return (
    <VerticalDashboardLayout 
      title="Parent Profile" 
      menuItems={menuItems}
      activeItem="/dashboard/parent/profile"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {profile.user.image ? (
                  <img 
                    src={profile.user.image} 
                    alt={profile.user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.user.name}</h1>
                <p className="text-gray-600">{profile.user.email}</p>
                {profile.school && (
                  <p className="text-sm text-blue-600">{profile.school.name}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.user.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">{profile.user.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <PhoneIcon className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                  {profile.phone || 'Not provided'}
                </p>
              )}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="h-4 w-4 inline mr-2" />
                Occupation
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your occupation"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                  {profile.occupation || 'Not provided'}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPinIcon className="h-4 w-4 inline mr-2" />
                Address
              </label>
              {editing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md min-h-[80px]">
                  {profile.address || 'Not provided'}
                </p>
              )}
            </div>

            {/* Account Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-2" />
                Member Since
              </label>
              <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-md">
                {new Date(profile.user.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* School Association */}
            {profile.school && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Association
                </label>
                <p className="text-gray-900 py-2 px-3 bg-blue-50 rounded-md">
                  {profile.school.name}
                  <span className="text-sm text-blue-600 block">{profile.school.board}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/dashboard/parent/children')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              Manage Children
            </button>
            <button 
              onClick={() => toast.info('Password change feature coming soon!')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
