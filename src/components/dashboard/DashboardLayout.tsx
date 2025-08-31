'use client';

import React, { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
}

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle,
  rightContent 
}: DashboardLayoutProps) {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors lg:hidden">
              <Bars3Icon className="w-5 h-5 text-slate-600" />
            </button>
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-slate-900 text-lg hidden sm:block">EduSight</span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students, reports, analytics..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 border-0 rounded-xl text-sm placeholder-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
              <BellIcon className="w-5 h-5 text-slate-600" />
              <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            </button>

            {/* Theme Toggle */}
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
              <SunIcon className="w-5 h-5 text-slate-600" />
            </button>

            {/* Settings */}
            <button className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
              <Cog6ToothIcon className="w-5 h-5 text-slate-600" />
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-sm font-medium text-slate-900">
                    {session?.user?.name}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {session?.user?.role?.toLowerCase()}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left">
                    <UserCircleIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left">
                    <Cog6ToothIcon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700">Settings</span>
                  </button>
                  <hr className="my-2 border-slate-200" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 p-2 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            {subtitle && (
              <p className="text-slate-600 text-lg">{subtitle}</p>
            )}
          </div>
          {rightContent && (
            <div className="mt-4 sm:mt-0">
              {rightContent}
            </div>
          )}
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}
