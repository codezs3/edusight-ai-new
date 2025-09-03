'use client'

import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface HorizontalDashboardLayoutProps {
  children: React.ReactNode
}

export default function HorizontalDashboardLayout({
  children
}: HorizontalDashboardLayoutProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const handleDashboard = () => {
    // Navigate to appropriate dashboard based on role
    const role = (session?.user as any)?.role
    switch (role) {
      case 'ADMIN':
        router.push('/dashboard/admin')
        break
      case 'SCHOOL_ADMIN':
        router.push('/dashboard/school-admin')
        break
      case 'TEACHER':
        router.push('/dashboard/teacher')
        break
      case 'PARENT':
        router.push('/dashboard/parent')
        break
      case 'STUDENT':
        router.push('/dashboard/student')
        break
      default:
        router.push('/dashboard')
    }
  }

  const handleProfile = () => {
    router.push('/dashboard/profile')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">EduSight</h1>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <button
                  onClick={handleDashboard}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={handleProfile}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <UserCircleIcon className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* User Menu - Right Side */}
            <div className="flex items-center">
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="flex items-center text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {session?.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {session?.user?.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session?.user?.email}
                        </div>
                      </div>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleDashboard}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex items-center w-full px-4 py-2 text-sm`}
                          >
                            <HomeIcon className="w-4 h-4 mr-3" />
                            Dashboard
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleProfile}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex items-center w-full px-4 py-2 text-sm`}
                          >
                            <UserCircleIcon className="w-4 h-4 mr-3" />
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`${
                              active ? 'bg-red-50 text-red-900' : 'text-red-600'
                            } group flex items-center w-full px-4 py-2 text-sm`}
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Menu as="div" className="relative">
                <Menu.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  <ChevronDownIcon className="h-6 w-6" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleDashboard}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex items-center w-full px-4 py-2 text-sm`}
                          >
                            <HomeIcon className="w-4 h-4 mr-3" />
                            Dashboard
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleProfile}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex items-center w-full px-4 py-2 text-sm`}
                          >
                            <UserCircleIcon className="w-4 h-4 mr-3" />
                            Profile
                          </button>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-100"></div>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`${
                              active ? 'bg-red-50 text-red-900' : 'text-red-600'
                            } group flex items-center w-full px-4 py-2 text-sm`}
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  )
}
