'use client'

import React, { useState, useEffect } from 'react'
import { useCurrentTime } from '@/hooks/useClientOnly'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface MenuItem {
  title: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  children?: MenuItem[]
}

interface VerticalDashboardLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  menuItems: MenuItem[]
  activeItem?: string
}

export default function VerticalDashboardLayout({
  title,
  subtitle,
  children,
  menuItems,
  activeItem = ''
}: VerticalDashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const currentTime = useCurrentTime()

  const toggleMenu = (menuTitle: string) => {
    const newExpanded = new Set(expandedMenus)
    if (newExpanded.has(menuTitle)) {
      newExpanded.delete(menuTitle)
    } else {
      newExpanded.add(menuTitle)
    }
    setExpandedMenus(newExpanded)
  }

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top User Menu Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="flex justify-between items-center px-4 h-12">
          {/* Left side - can be empty or show breadcrumbs */}
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              {title && `${title}${subtitle ? ' • ' + subtitle : ''}`}
            </span>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-1.5" />
              Dashboard
            </button>
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <UserCircleIcon className="w-4 h-4 mr-1.5" />
              Profile
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-1.5" />
              Sign Out
            </button>

            {/* User Avatar */}
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {session?.user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500">
                  {session?.user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gray-900">EduSight</h1>
                <p className="text-xs text-gray-500">AI Education Platform</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <Bars3Icon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-1 space-y-0.5">
            {menuItems.map((item) => (
              <div key={item.title}>
                <button
                  onClick={() => {
                    if (item.children) {
                      toggleMenu(item.title)
                    } else {
                      handleNavigation(item.href)
                    }
                  }}
                  className={`w-full flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                    activeItem === item.href
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <item.icon className={`${sidebarOpen ? 'mr-2' : 'mx-auto'} h-4 w-4 flex-shrink-0`} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left truncate">{item.title}</span>
                      {item.badge && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        <ChevronDownIcon
                          className={`ml-1 h-3 w-3 transition-transform ${
                            expandedMenus.has(item.title) ? 'transform rotate-180' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.children && sidebarOpen && expandedMenus.has(item.title) && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {item.children.map((subItem) => (
                      <button
                        key={subItem.title}
                        onClick={() => handleNavigation(subItem.href)}
                        className={`w-full flex items-center px-2 py-1 text-xs font-medium rounded transition-colors ${
                          activeItem === subItem.href
                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        <subItem.icon className="mr-2 h-3 w-3 flex-shrink-0" />
                        <span className="flex-1 text-left truncate">{subItem.title}</span>
                        {subItem.badge && (
                          <span className="ml-1 px-1 py-0.5 text-xs bg-green-100 text-green-600 rounded-full min-w-[16px] text-center">
                            {subItem.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile & Actions */}

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Last updated:</span>
                <span className="font-medium">{currentTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
      </div>
    </div>
  )
}
