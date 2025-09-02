'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Framework {
  id: string
  name: string
  code: string
  subjects: Subject[]
}

interface Subject {
  id: string
  name: string
  code: string
}

interface AssessmentType {
  id: string
  name: string
  code: string
  config: any
}

interface AssessmentCycle {
  id: string
  name: string
  code: string
  duration: number
}

interface TemplateConfig {
  subjects: string[]
  assessmentTypes: { [key: string]: string[] }
  weightage: { [key: string]: number }
  gradingScale?: any
  passingCriteria?: any
}

export default function CreateTemplatePage() {
  const router = useRouter()
  
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([])
  const [assessmentCycles, setAssessmentCycles] = useState<AssessmentCycle[]>([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frameworkId: '',
    cycleId: '',
    isDefault: false
  })
  
  const [config, setConfig] = useState<TemplateConfig>({
    subjects: [],
    assessmentTypes: {},
    weightage: {}
  })
  
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [frameworksRes, typesRes, cyclesRes] = await Promise.all([
        fetch('/api/admin/assessments/frameworks?include=subjects'),
        fetch('/api/admin/assessments/types'),
        fetch('/api/admin/assessments/cycles')
      ])

      if (frameworksRes.ok) {
        const frameworksData = await frameworksRes.json()
        setFrameworks(frameworksData)
      }
      if (typesRes.ok) setAssessmentTypes(await typesRes.json())
      if (cyclesRes.ok) setAssessmentCycles(await cyclesRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId)
    setSelectedFramework(framework || null)
    setFormData({ ...formData, frameworkId })
    setConfig({ subjects: [], assessmentTypes: {}, weightage: {} })
  }

  const handleSubjectToggle = (subjectId: string) => {
    const newSubjects = config.subjects.includes(subjectId)
      ? config.subjects.filter(id => id !== subjectId)
      : [...config.subjects, subjectId]
    
    const newAssessmentTypes = { ...config.assessmentTypes }
    const newWeightage = { ...config.weightage }
    
    if (!config.subjects.includes(subjectId)) {
      // Adding subject - initialize assessment types
      newAssessmentTypes[subjectId] = []
    } else {
      // Removing subject - clean up
      delete newAssessmentTypes[subjectId]
      Object.keys(newWeightage).forEach(key => {
        if (key.startsWith(`${subjectId}_`)) {
          delete newWeightage[key]
        }
      })
    }
    
    setConfig({
      ...config,
      subjects: newSubjects,
      assessmentTypes: newAssessmentTypes,
      weightage: newWeightage
    })
  }

  const handleAssessmentTypeToggle = (subjectId: string, typeId: string) => {
    const subjectTypes = config.assessmentTypes[subjectId] || []
    const newTypes = subjectTypes.includes(typeId)
      ? subjectTypes.filter(id => id !== typeId)
      : [...subjectTypes, typeId]
    
    setConfig({
      ...config,
      assessmentTypes: {
        ...config.assessmentTypes,
        [subjectId]: newTypes
      }
    })
  }

  const handleWeightageChange = (key: string, value: number) => {
    setConfig({
      ...config,
      weightage: {
        ...config.weightage,
        [key]: value
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/assessments/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          config
        })
      })

      if (response.ok) {
        router.push('/dashboard/admin/assessments?tab=templates')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create template')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create template')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900">Create Assessment Template</h1>
            <p className="text-gray-600 mt-2">
              Build a comprehensive assessment template for schools and parents
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CBSE Standard Assessment"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Framework *
              </label>
              <select
                value={formData.frameworkId}
                onChange={(e) => handleFrameworkChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Framework</option>
                {frameworks.map((framework) => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name} ({framework.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe the purpose and scope of this template..."
            />
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Cycle *
            </label>
            <select
              value={formData.cycleId}
              onChange={(e) => setFormData({ ...formData, cycleId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Assessment Cycle</option>
              {assessmentCycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.name} ({cycle.duration} months)
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Set as default template</span>
            </label>
          </div>
        </div>

        {/* Subject Selection */}
        {selectedFramework && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Subjects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFramework.subjects?.map((subject) => (
                <label key={subject.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={config.subjects.includes(subject.id)}
                    onChange={() => handleSubjectToggle(subject.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                    <div className="text-xs text-gray-500">{subject.code}</div>
                  </div>
                </label>
              )) || (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No subjects available for this framework
                </div>
              )}
            </div>
          </div>
        )}

        {/* Assessment Types Configuration */}
        {config.subjects.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configure Assessment Types</h2>
            
            {config.subjects.map((subjectId) => {
              const subject = selectedFramework?.subjects?.find(s => s.id === subjectId)
              if (!subject) return null
              
              return (
                <div key={subjectId} className="mb-6 last:mb-0 border-b border-gray-200 pb-6 last:border-b-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">{subject.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assessmentTypes.map((type) => (
                      <label key={type.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={(config.assessmentTypes[subjectId] || []).includes(type.id)}
                          onChange={() => handleAssessmentTypeToggle(subjectId, type.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{type.name}</div>
                          <div className="text-xs text-gray-500">{type.code}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Create Template
          </button>
        </div>
      </form>
    </div>
  )
}
