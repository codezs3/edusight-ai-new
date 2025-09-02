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
  ChevronRightIcon
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
    <div className="flex h-screen bg-gray-50">
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
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
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
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeItem === item.href
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} h-5 w-5 flex-shrink-0`} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.children && (
                        <ChevronDownIcon
                          className={`ml-2 h-4 w-4 transition-transform ${
                            expandedMenus.has(item.title) ? 'transform rotate-180' : ''
                          }`}
                        />
                      )}
                    </>
                  )}
                </button>

                {/* Submenu */}
                {item.children && sidebarOpen && expandedMenus.has(item.title) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((subItem) => (
                      <button
                        key={subItem.title}
                        onClick={() => handleNavigation(subItem.href)}
                        className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeItem === subItem.href
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <subItem.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                        <span>{subItem.title}</span>
                        {subItem.badge && (
                          <span className="ml-auto px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
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
        <div className="border-t border-gray-200 p-4">
          <div className={`flex items-center ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.email || ''}
                </p>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <div className="mt-3 space-y-1">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <HomeIcon className="mr-3 h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserCircleIcon className="mr-3 h-4 w-4" />
                Profile
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
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
  )
}
