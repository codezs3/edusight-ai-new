'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  PlusIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface Subject {
  id: string
  name: string
  code: string
  description: string
  isActive: boolean
  createdAt: string
  _count: {
    assessmentTypes: number
  }
}

interface Framework {
  id: string
  name: string
  code: string
  description: string
}

export default function FrameworkSubjectsPage() {
  const params = useParams()
  const router = useRouter()
  const frameworkId = params.id as string
  
  const [framework, setFramework] = useState<Framework | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })

  useEffect(() => {
    fetchFramework()
    fetchSubjects()
  }, [frameworkId])

  const fetchFramework = async () => {
    try {
      const response = await fetch(`/api/admin/assessments/frameworks/${frameworkId}`)
      if (response.ok) {
        const data = await response.json()
        setFramework(data)
      }
    } catch (error) {
      console.error('Error fetching framework:', error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`/api/admin/assessments/frameworks/${frameworkId}/subjects`)
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingSubject 
        ? `/api/admin/assessments/frameworks/${frameworkId}/subjects/${editingSubject.id}`
        : `/api/admin/assessments/frameworks/${frameworkId}/subjects`
      
      const method = editingSubject ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowModal(false)
        setEditingSubject(null)
        setFormData({ name: '', code: '', description: '' })
        fetchSubjects()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save subject')
      }
    } catch (error) {
      console.error('Error saving subject:', error)
      alert('Failed to save subject')
    }
  }

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return

    try {
      const response = await fetch(`/api/admin/assessments/frameworks/${frameworkId}/subjects/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSubjects()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete subject')
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      alert('Failed to delete subject')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {framework?.name} Subjects
            </h1>
            <p className="text-gray-600 mt-2">
              Manage subjects for the {framework?.code} framework
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <AcademicCapIcon className="h-4 w-4 mr-1" />
              {framework?.code}
            </span>
            <span className="text-sm text-gray-500">
              {subjects.length} subjects
            </span>
          </div>
          <button
            onClick={() => {
              setEditingSubject(null)
              setFormData({ name: '', code: '', description: '' })
              setShowModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Subject
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{subject.code}</p>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(subject)}
                  className="p-1 text-gray-400 hover:text-green-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {subject.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {subject.description}
              </p>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{subject._count.assessmentTypes} assessment types</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                subject.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {subject.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {subjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a subject to this framework.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MATH, ENG, SCI"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
