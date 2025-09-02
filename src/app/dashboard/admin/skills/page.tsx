'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  BeakerIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'

interface Skill {
  id: string
  name: string
  code?: string
  description?: string
  category: string
  level: string
  isActive: boolean
  subject: {
    id: string
    name: string
    framework: {
      name: string
      code: string
    }
  }
  _count: {
    skillAssessments: number
  }
}

interface Framework {
  id: string
  name: string
  code: string
}

export default function SkillsManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const categories = ['cognitive', 'psychomotor', 'affective']
  const levels = ['beginner', 'intermediate', 'advanced']

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/admin/skills')
      return
    }
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    
    loadSkills()
    loadFrameworks()
  }, [session, status, router])

  const loadSkills = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/skills')
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error('Failed to load skills:', error)
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

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFramework = !selectedFramework || skill.subject.framework.code === selectedFramework
    const matchesCategory = !selectedCategory || skill.category === selectedCategory
    const matchesLevel = !selectedLevel || skill.level === selectedLevel
    
    return matchesSearch && matchesFramework && matchesCategory && matchesLevel
  })

  const getSkillStats = () => {
    const totalSkills = skills.length
    const activeSkills = skills.filter(s => s.isActive).length
    const cognitiveSkills = skills.filter(s => s.category === 'cognitive').length
    const psychomotorSkills = skills.filter(s => s.category === 'psychomotor').length
    const affectiveSkills = skills.filter(s => s.category === 'affective').length
    
    return {
      total: totalSkills,
      active: activeSkills,
      cognitive: cognitiveSkills,
      psychomotor: psychomotorSkills,
      affective: affectiveSkills
    }
  }

  const stats = getSkillStats()

  const menuItems = [
    { title: 'Dashboard', href: '/dashboard/admin', icon: BeakerIcon },
    { title: 'Back to Academic', href: '/dashboard/admin', icon: BeakerIcon }
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
      title="Skills Management" 
      menuItems={menuItems}
      activeItem="/dashboard/admin/skills"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BeakerIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Skills Management</h1>
                <p className="text-gray-600">Manage cognitive, psychomotor, and affective skills across all frameworks</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Add Skill
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Skills</div>
              </div>
              <BeakerIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Active Skills</div>
              </div>
              <TagIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.cognitive}</div>
                <div className="text-sm text-gray-600">Cognitive</div>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.psychomotor}</div>
                <div className="text-sm text-gray-600">Psychomotor</div>
              </div>
              <BeakerIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.affective}</div>
                <div className="text-sm text-gray-600">Affective</div>
              </div>
              <TagIcon className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Framework Filter */}
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Frameworks</option>
              {frameworks.map(framework => (
                <option key={framework.id} value={framework.code}>
                  {framework.name}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              {levels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>

            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              More Filters
            </button>
          </div>
        </div>

        {/* Skills Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Skills ({filteredSkills.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <div className="mt-2 text-gray-600">Loading skills...</div>
            </div>
          ) : filteredSkills.length === 0 ? (
            <div className="p-8 text-center">
              <BeakerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600">No skills found matching your criteria</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject & Framework
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSkills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{skill.name}</div>
                          {skill.code && (
                            <div className="text-xs text-gray-500">{skill.code}</div>
                          )}
                          {skill.description && (
                            <div className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                              {skill.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{skill.subject.name}</div>
                          <div className="text-xs text-gray-500">{skill.subject.framework.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          skill.category === 'cognitive' ? 'bg-blue-100 text-blue-800' :
                          skill.category === 'psychomotor' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {skill.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          skill.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          skill.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {skill.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {skill._count.skillAssessments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          skill.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {skill.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Integration Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/admin/curriculum-mapper')}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Curriculum Mapper</h3>
            <p className="text-gray-600 text-sm">Use skills in curriculum mapping workflow</p>
          </div>
          <div 
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/admin/assessments')}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Assessment Systems</h3>
            <p className="text-gray-600 text-sm">Configure skill-based assessments</p>
          </div>
          <div 
            className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/dashboard/admin/subjects')}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Subject Management</h3>
            <p className="text-gray-600 text-sm">Manage subjects and their skills</p>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
