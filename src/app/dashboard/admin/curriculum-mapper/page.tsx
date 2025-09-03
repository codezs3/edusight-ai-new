'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  BeakerIcon, 
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

// Default cycle ID - should be configurable in production
const DEFAULT_CYCLE_ID = process.env.NEXT_PUBLIC_DEFAULT_CYCLE_ID || 'cmf0oc16r0004exfg8r9l2bq3'

// Validation schema for template creation
const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(100, 'Template name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
})

interface Framework {
  id: string
  name: string
  code: string
  description?: string
  isCustom: boolean
}

interface Subject {
  id: string
  name: string
  code?: string
  description?: string
}

interface AssessmentType {
  id: string
  name: string
  code: string
  description?: string
}

export default function CurriculumMapper() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([])
  
  // Form state
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([])
  const [selectedAssessmentTypes, setSelectedAssessmentTypes] = useState<AssessmentType[]>([])
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  const loadFrameworks = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/assessments/frameworks')
      if (!response.ok) throw new Error('Failed to fetch frameworks')
      const data = await response.json()
      setFrameworks(data)
    } catch (error) {
      console.error('Failed to load frameworks:', error)
    }
  }, [])

  const loadSubjects = useCallback(async (frameworkId: string) => {
    try {
      const response = await fetch(`/api/admin/assessments/frameworks/${frameworkId}/subjects`)
      if (!response.ok) throw new Error('Failed to fetch subjects')
      const data = await response.json()
      setSubjects(data)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    }
  }, [])

  const loadAssessmentTypes = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/assessments/types')
      if (!response.ok) throw new Error('Failed to fetch assessment types')
      const data = await response.json()
      setAssessmentTypes(data)
    } catch (error) {
      console.error('Failed to load assessment types:', error)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/curriculum-mapper')
      return
    }
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    
    // Load initial data
    loadFrameworks()
    loadAssessmentTypes()
  }, [session, status, router, loadFrameworks, loadAssessmentTypes])

  const handleFrameworkSelect = (framework: Framework) => {
    setSelectedFramework(framework)
    loadSubjects(framework.id)
    setSelectedSubjects([])
    setCurrentStep(2)
  }

  const handleSubjectToggle = (subject: Subject) => {
    setSelectedSubjects(prev => {
      const exists = prev.find(s => s.id === subject.id)
      if (exists) {
        return prev.filter(s => s.id !== subject.id)
      } else {
        return [...prev, subject]
      }
    })
  }

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const generateSkillMappings = useMemo(() => {
    const mappings: any = {}
    selectedSubjects.forEach(subject => {
      mappings[subject.id] = {
        subjectName: subject.name,
        skills: {
          cognitive: ['Problem Solving', 'Critical Thinking', 'Analysis & Evaluation'],
          psychomotor: ['Practical Application', 'Laboratory Techniques', 'Physical Coordination'],
          affective: ['Communication', 'Collaboration', 'Cultural Awareness']
        },
        assessmentTypes: selectedAssessmentTypes.map(t => t.id)
      }
    })
    return mappings
  }, [selectedSubjects, selectedAssessmentTypes])

  const handleCreateTemplate = async () => {
    // Validate form data
    const result = templateSchema.safeParse({ name: templateName, description: templateDescription })
    if (!result.success) {
      const errors: {[key: string]: string} = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message
        }
      })
      setFormErrors(errors)
      return
    }
    setFormErrors({}) // Clear previous errors

    try {
      const templateData = {
        name: templateName,
        description: templateDescription,
        frameworkId: selectedFramework?.id,
        cycleId: DEFAULT_CYCLE_ID,
        subjectIds: selectedSubjects.map(s => s.id),
        assessmentTypeIds: selectedAssessmentTypes.map(t => t.id),
        skillMappings: generateSkillMappings
      }

      const response = await fetch('/api/admin/curriculum-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      })

      if (response.ok) {
        const template = await response.json()
        toast.success(`Template "${template.name}" created successfully!`)
        router.push('/dashboard/admin/assessments/templates')
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
        toast.error(`Error creating template: ${error.error || 'Failed to create template'}`)
      }
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
    }
  }

  const steps = [
    { number: 1, title: 'Framework Selection', icon: AcademicCapIcon },
    { number: 2, title: 'Subject Selection', icon: BookOpenIcon },
    { number: 3, title: 'Skills Definition', icon: BeakerIcon },
    { number: 4, title: 'Assessment Types', icon: ClipboardDocumentListIcon },
    { number: 5, title: 'Template Creation', icon: DocumentTextIcon }
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

  const menuItems = [
    { title: 'Dashboard', href: '/dashboard/admin', icon: AcademicCapIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: AcademicCapIcon }
  ]

  return (
    <VerticalDashboardLayout 
      title="Curriculum Mapper" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/curriculum-mapper"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Curriculum Mapping Wizard</h1>
              <p className="text-gray-600">Create comprehensive assessment templates step by step</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Step 1: Framework Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select or Create Framework</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedFramework?.id === framework.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleFrameworkSelect(framework)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${framework.name} framework`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleFrameworkSelect(framework)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                      {framework.isCustom && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Custom</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{framework.description}</p>
                    <div className="text-xs text-gray-500 mt-2">Code: {framework.code}</div>
                  </div>
                ))}
                
                {/* Create New Framework Option */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors"
                  role="button"
                  tabIndex={0}
                  aria-label="Create new framework"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      // TODO: Implement create framework modal
                      toast.info('Create framework feature coming soon!')
                    }
                  }}
                  onClick={() => {
                    // TODO: Implement create framework modal
                    toast.info('Create framework feature coming soon!')
                  }}
                >
                  <div className="text-center">
                    <PlusIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-700">Create New Framework</div>
                    <div className="text-xs text-gray-500">Design custom framework</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Subject Selection */}
          {currentStep === 2 && selectedFramework && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select Subjects for {selectedFramework.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedSubjects.find(s => s.id === subject.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => handleSubjectToggle(subject)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${selectedSubjects.find(s => s.id === subject.id) ? 'Deselect' : 'Select'} ${subject.name} subject`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSubjectToggle(subject)
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                      {selectedSubjects.find(s => s.id === subject.id) && (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    {subject.description && (
                      <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                    )}
                    {subject.code && (
                      <div className="text-xs text-gray-500 mt-2">Code: {subject.code}</div>
                    )}
                  </div>
                ))}
              </div>
              
              {selectedSubjects.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-800">
                    Selected Subjects ({selectedSubjects.length}):
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {selectedSubjects.map(s => s.name).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Skills Definition */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Skills for Selected Subjects</h2>
              
              {selectedSubjects.length === 0 ? (
                <div className="bg-yellow-50 rounded-lg p-6 text-center">
                  <BeakerIcon className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subjects Selected</h3>
                  <p className="text-gray-600 mb-4">
                    Please go back to Step 2 and select subjects first.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedSubjects.map((subject) => (
                    <div key={subject.id} className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{subject.name}</h3>
                      
                      {/* Skills Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Cognitive Skills</h4>
                          <div className="text-sm text-blue-700">
                            • Problem Solving<br/>
                            • Critical Thinking<br/>
                            • Analysis & Evaluation
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-purple-900 mb-2">Psychomotor Skills</h4>
                          <div className="text-sm text-purple-700">
                            • Practical Application<br/>
                            • Laboratory Techniques<br/>
                            • Physical Coordination
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-medium text-yellow-900 mb-2">Affective Skills</h4>
                          <div className="text-sm text-yellow-700">
                            • Communication<br/>
                            • Collaboration<br/>
                            • Cultural Awareness
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <button 
                          onClick={() => router.push(`/dashboard/admin/skills?subject=${subject.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Manage Skills for {subject.name} →
                        </button>
                        <div className="text-sm text-gray-600">
                          Skills will be automatically included in template
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-800">
                      ✅ All subject skills will be included in the assessment template
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Assessment Types */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Assessment Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {assessmentTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedAssessmentTypes.find(t => t.id === type.id)
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => {
                      setSelectedAssessmentTypes(prev => {
                        const exists = prev.find(t => t.id === type.id)
                        if (exists) {
                          return prev.filter(t => t.id !== type.id)
                        } else {
                          return [...prev, type]
                        }
                      })
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${selectedAssessmentTypes.find(t => t.id === type.id) ? 'Deselect' : 'Select'} ${type.name} assessment type`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedAssessmentTypes(prev => {
                          const exists = prev.find(t => t.id === type.id)
                          if (exists) {
                            return prev.filter(t => t.id !== type.id)
                          } else {
                            return [...prev, type]
                          }
                        })
                      }
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{type.name}</h3>
                      {selectedAssessmentTypes.find(t => t.id === type.id) && (
                        <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                    <div className="text-xs text-gray-500 mt-2">Code: {type.code}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Template Creation */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Assessment Template</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter template name"
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                  />
                  {formErrors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      formErrors.description 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter template description"
                    aria-describedby={formErrors.description ? 'description-error' : undefined}
                  />
                  {formErrors.description && (
                    <p id="description-error" className="mt-1 text-sm text-red-600">
                      {formErrors.description}
                    </p>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Framework:</span>
                      <span className="ml-2 text-gray-600">{selectedFramework?.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Subjects:</span>
                      <span className="ml-2 text-gray-600">
                        {selectedSubjects.map(s => s.name).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Assessment Types:</span>
                      <span className="ml-2 text-gray-600">
                        {selectedAssessmentTypes.map(t => t.name).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentStep === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Previous
          </button>
          
          <button
            onClick={currentStep === 5 ? handleCreateTemplate : handleNextStep}
            disabled={
              (currentStep === 1 && !selectedFramework) || 
              (currentStep === 2 && selectedSubjects.length === 0) ||
              (currentStep === 4 && selectedAssessmentTypes.length === 0) ||
              (currentStep === 5 && (!templateName || !templateDescription))
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              (currentStep === 1 && !selectedFramework) || 
              (currentStep === 2 && selectedSubjects.length === 0) ||
              (currentStep === 4 && selectedAssessmentTypes.length === 0) ||
              (currentStep === 5 && (!templateName || !templateDescription))
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentStep === 5 ? 'Create Template' : 'Next'}
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}