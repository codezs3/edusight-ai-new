'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  Cog6ToothIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Framework {
  id: string
  name: string
  code: string
  description: string
  isCustom: boolean
  isActive: boolean
  _count: {
    subjects: number
    templates: number
  }
}

interface AssessmentType {
  id: string
  name: string
  code: string
  description: string
}

interface AssessmentCycle {
  id: string
  name: string
  code: string
  description: string
  duration: number
}

interface Template {
  id: string
  name: string
  description: string
  isDefault: boolean
  framework: {
    name: string
    code: string
  }
  cycle: {
    name: string
    code: string
  }
}

export default function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState('frameworks')
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([])
  const [assessmentCycles, setAssessmentCycles] = useState<AssessmentCycle[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showFrameworkModal, setShowFrameworkModal] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [showCycleModal, setShowCycleModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [frameworksRes, typesRes, cyclesRes, templatesRes] = await Promise.all([
        fetch('/api/admin/assessments/frameworks'),
        fetch('/api/admin/assessments/types'),
        fetch('/api/admin/assessments/cycles'),
        fetch('/api/admin/assessments/templates')
      ])

      if (frameworksRes.ok) setFrameworks(await frameworksRes.json())
      if (typesRes.ok) setAssessmentTypes(await typesRes.json())
      if (cyclesRes.ok) setAssessmentCycles(await cyclesRes.json())
      if (templatesRes.ok) setTemplates(await templatesRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { 
      id: 'frameworks', 
      name: 'Academic Frameworks', 
      icon: AcademicCapIcon,
      count: frameworks.length 
    },
    { 
      id: 'types', 
      name: 'Assessment Types', 
      icon: ClipboardDocumentListIcon,
      count: assessmentTypes.length 
    },
    { 
      id: 'cycles', 
      name: 'Assessment Cycles', 
      icon: CalendarDaysIcon,
      count: assessmentCycles.length 
    },
    { 
      id: 'templates', 
      name: 'Assessment Templates', 
      icon: DocumentTextIcon,
      count: templates.length 
    }
  ]

  const FrameworkCard = ({ framework }: { framework: Framework }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{framework.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{framework.code}</p>
          {framework.isCustom && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
              Custom Framework
            </span>
          )}
        </div>
        <div className="flex space-x-1">
          <button 
            className="p-1 text-gray-400 hover:text-blue-600"
            onClick={() => window.open(`/dashboard/admin/assessments/frameworks/${framework.id}/subjects`, '_blank')}
            title="Manage Subjects"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-green-600"
            onClick={() => {
              setEditingItem(framework)
              setShowFrameworkModal(true)
            }}
            title="Edit Framework"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          {framework.isCustom && (
            <button 
              className="p-1 text-gray-400 hover:text-red-600"
              title="Delete Framework"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{framework.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{framework._count.subjects} subjects</span>
        <span>{framework._count.templates} templates</span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          framework.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {framework.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )

  const TypeCard = ({ type }: { type: AssessmentType }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{type.code}</p>
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-green-600"
            onClick={() => {
              setEditingItem(type)
              setShowTypeModal(true)
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600">{type.description}</p>
    </div>
  )

  const CycleCard = ({ cycle }: { cycle: AssessmentCycle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{cycle.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{cycle.code}</p>
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-green-600"
            onClick={() => {
              setEditingItem(cycle)
              setShowCycleModal(true)
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{cycle.description}</p>
      <p className="text-sm text-blue-600 font-medium">Duration: {cycle.duration} month(s)</p>
    </div>
  )

  const TemplateCard = ({ template }: { template: Template }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          {template.isDefault && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
              Default Template
            </span>
          )}
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button 
            className="p-1 text-gray-400 hover:text-green-600"
            onClick={() => {
              setEditingItem(template)
              setShowTemplateModal(true)
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-red-600">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>Framework: {template.framework.code}</span>
        <span>Cycle: {template.cycle.code}</span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 h-48 rounded-lg"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Student Assessment Management</h1>
        <p className="text-gray-600 mt-2">
          Configure academic frameworks, assessment types, cycles, and templates for comprehensive student evaluation.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.name}
          </h2>
          <button
            onClick={() => {
              setEditingItem(null)
              if (activeTab === 'frameworks') setShowFrameworkModal(true)
              else if (activeTab === 'types') setShowTypeModal(true)
              else if (activeTab === 'cycles') setShowCycleModal(true)
              else if (activeTab === 'templates') {
                window.open('/dashboard/admin/assessments/templates/create', '_blank')
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {activeTab === 'templates' ? 'Create Template' : `Add New ${activeTab.slice(0, -1)}`}
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'frameworks' && frameworks.map((framework) => (
            <FrameworkCard key={framework.id} framework={framework} />
          ))}
          
          {activeTab === 'types' && assessmentTypes.map((type) => (
            <TypeCard key={type.id} type={type} />
          ))}
          
          {activeTab === 'cycles' && assessmentCycles.map((cycle) => (
            <CycleCard key={cycle.id} cycle={cycle} />
          ))}
          
          {activeTab === 'templates' && templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'frameworks' && frameworks.length === 0) ||
          (activeTab === 'types' && assessmentTypes.length === 0) ||
          (activeTab === 'cycles' && assessmentCycles.length === 0) ||
          (activeTab === 'templates' && templates.length === 0)) && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              {activeTab === 'frameworks' && <AcademicCapIcon />}
              {activeTab === 'types' && <ClipboardDocumentListIcon />}
              {activeTab === 'cycles' && <CalendarDaysIcon />}
              {activeTab === 'templates' && <DocumentTextIcon />}
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No {activeTab} found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new {activeTab.slice(0, -1)}.
            </p>
          </div>
        )}
      </div>

      {/* Note: Modals will be implemented in separate components */}
      {/* Framework Modal */}
      {showFrameworkModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Framework' : 'Add New Framework'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Framework management modal will be implemented here.
            </p>
            <button
              onClick={() => setShowFrameworkModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Similar modal placeholders for other types */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Assessment Type' : 'Add New Assessment Type'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Assessment type management modal will be implemented here.
            </p>
            <button
              onClick={() => setShowTypeModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
