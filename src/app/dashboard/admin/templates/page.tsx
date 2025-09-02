'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  DocumentTextIcon, 
  PlusIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DownloadIcon,
  ShareIcon,
  TagIcon,
  AcademicCapIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

interface Template {
  id: string
  name: string
  description?: string
  framework: {
    id: string
    name: string
    code: string
  }
  cycle: {
    id: string
    name: string
    code: string
  }
  config: string
  isDefault: boolean
  isActive: boolean
  createdAt: string
  createdBy: string
}

interface Framework {
  id: string
  name: string
  code: string
  description?: string
}

export default function TemplatesManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFramework, setSelectedFramework] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/templates')
      return
    }
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    
    loadTemplates()
    loadFrameworks()
  }, [session, status, router])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/curriculum-templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFrameworks = async () => {
    try {
      const response = await fetch('/api/admin/assessments/frameworks')
      const data = await response.json()
      setFrameworks(data)
    } catch (error) {
      console.error('Failed to load frameworks:', error)
    }
  }

  const createDefaultTemplates = async () => {
    try {
      const defaultTemplates = [
        {
          name: 'IGCSE Standard Assessment Template',
          description: 'Comprehensive assessment template for IGCSE framework covering all core subjects with balanced cognitive, psychomotor, and affective skills evaluation.',
          frameworkCode: 'IGCSE'
        },
        {
          name: 'IB Diploma Programme Template',
          description: 'International Baccalaureate assessment template with Theory of Knowledge integration and extended essay components.',
          frameworkCode: 'IB'
        },
        {
          name: 'ICSE Comprehensive Evaluation',
          description: 'Indian Certificate assessment template focusing on continuous evaluation and skill-based learning outcomes.',
          frameworkCode: 'ICSE'
        },
        {
          name: 'CBSE Competency-Based Assessment',
          description: 'CBSE framework template aligned with National Education Policy 2020 and competency-based evaluation.',
          frameworkCode: 'CBSE'
        },
        {
          name: 'STREAM Integrated Assessment',
          description: 'Science Technology Engineering Arts Mathematics integrated assessment template for modern education.',
          frameworkCode: 'STREAM'
        }
      ]

      for (const template of defaultTemplates) {
        const framework = frameworks.find(f => f.code === template.frameworkCode)
        if (framework) {
          // Create template
          await fetch('/api/admin/curriculum-templates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: template.name,
              description: template.description,
              frameworkId: framework.id,
              cycleId: 'cmf0oc16r0004exfg8r9l2bq3', // Default quarterly cycle
              subjectIds: [], // Will be populated based on framework
              assessmentTypeIds: [], // All assessment types
              skillMappings: {},
              isDefault: true
            }),
          })
        }
      }
      
      alert('Default templates created successfully!')
      loadTemplates()
    } catch (error) {
      console.error('Error creating default templates:', error)
      alert('Failed to create default templates')
    }
  }

  const filteredTemplates = templates.filter(template => {
    if (!selectedFramework) return true
    return template.framework.code === selectedFramework
  })

  const menuItems = [
    { title: 'Dashboard', href: '/dashboard/admin', icon: DocumentTextIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: DocumentTextIcon }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <VerticalDashboardLayout 
      title="Assessment Templates" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/templates"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assessment Templates</h1>
                <p className="text-gray-600">Framework-based assessment templates for educational institutions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={createDefaultTemplates}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <TagIcon className="h-5 w-5" />
                Create Defaults
              </button>
              <button 
                onClick={() => router.push('/dashboard/admin/curriculum-mapper')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create Template
              </button>
            </div>
          </div>
        </div>

        {/* Framework Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Framework:</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Frameworks</option>
              {frameworks.map(framework => (
                <option key={framework.id} value={framework.code}>
                  {framework.name} ({framework.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Framework Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworks.map((framework) => (
            <div key={framework.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
                    <div className="text-sm text-gray-600">{framework.code}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {framework.description || `${framework.name} assessment framework with comprehensive subject coverage and skill-based evaluation.`}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Templates:</span>
                    <span className="font-medium text-gray-900">
                      {filteredTemplates.filter(t => t.framework.code === framework.code).length}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t flex gap-2">
                <button 
                  onClick={() => router.push(`/dashboard/admin/curriculum-mapper?framework=${framework.id}`)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Create Template
                </button>
                <button 
                  onClick={() => setSelectedFramework(framework.code)}
                  className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
                >
                  View Templates
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Templates List */}
        {filteredTemplates.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedFramework ? `${selectedFramework} Templates` : 'All Templates'} ({filteredTemplates.length})
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Framework
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cycle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          {template.description && (
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {template.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{template.framework.name}</div>
                          <div className="text-xs text-gray-500">{template.framework.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {template.cycle.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          template.isDefault ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.isDefault ? 'Default' : 'Custom'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <DownloadIcon className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            <ShareIcon className="h-4 w-4" />
                          </button>
                          {!template.isDefault && (
                            <button className="text-red-600 hover:text-red-900">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTemplates.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-600 mb-4">
              {selectedFramework 
                ? `No templates found for ${selectedFramework} framework.`
                : 'No assessment templates have been created yet.'
              }
            </p>
            <button 
              onClick={() => router.push('/dashboard/admin/curriculum-mapper')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Template
            </button>
          </div>
        )}
      </div>
    </VerticalDashboardLayout>
  )
}
