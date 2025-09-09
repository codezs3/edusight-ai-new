'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  AcademicCapIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { getUserTypeConfig } from '@/lib/user-types';

interface MenuItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  children?: MenuItem[];
  permission?: string;
  isActive?: boolean;
}

interface SimplifiedSchoolMenuProps {
  role: string;
  activeItem?: string;
  onItemClick?: (item: MenuItem) => void;
}

export default function SimplifiedSchoolMenu({ role, activeItem, onItemClick }: SimplifiedSchoolMenuProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  
  const userTypeConfig = getUserTypeConfig(role);

  // Simplified menu structure focusing on essential items only
  const generateMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      {
        id: 'dashboard',
        title: 'Dashboard',
        href: `/dashboard/${role.toLowerCase()}`,
        icon: HomeIcon,
        description: 'Main dashboard overview'
      }
    ];

    switch (role) {
      case 'PARENT':
        return [
          ...baseItems,
          {
            id: 'children',
            title: 'My Children',
            href: `/dashboard/parent/children`,
            icon: UserGroupIcon,
            description: 'Manage children profiles',
            children: [
              {
                id: 'children-list',
                title: 'All Children',
                href: `/dashboard/parent/children`,
                icon: UserGroupIcon,
                description: 'View and manage all children'
              },
              {
                id: 'add-child',
                title: 'Add New Child',
                href: `/dashboard/parent/children/add`,
                icon: PlusIcon,
                description: 'Add a new child to your profile'
              }
            ]
          },
          {
            id: 'assessment',
            title: 'Assessment',
            href: `/dashboard/parent/assessment`,
            icon: DocumentTextIcon,
            description: 'Upload and analyze academic documents'
          },
          {
            id: 'analytics',
            title: 'Analytics',
            href: `/dashboard/parent/analytics`,
            icon: ChartBarIcon,
            description: 'View performance insights and reports'
          }
        ];

      case 'SCHOOL_ADMIN':
        return [
          ...baseItems,
          {
            id: 'students',
            title: 'Students',
            href: `/dashboard/school-admin/students`,
            icon: UserGroupIcon,
            description: 'Manage student records and profiles',
            children: [
              {
                id: 'students-list',
                title: 'All Students',
                href: `/dashboard/school-admin/students`,
                icon: UserGroupIcon,
                description: 'View and manage all students'
              },
              {
                id: 'add-student',
                title: 'Add Student',
                href: `/dashboard/school-admin/students/add`,
                icon: PlusIcon,
                description: 'Add a new student'
              }
            ]
          },
          {
            id: 'assessment',
            title: 'Assessment',
            href: `/dashboard/school-admin/assessment`,
            icon: DocumentTextIcon,
            description: 'Upload and analyze academic documents'
          },
          {
            id: 'analytics',
            title: 'Analytics',
            href: `/dashboard/school-admin/analytics`,
            icon: ChartBarIcon,
            description: 'View school-wide performance insights'
          }
        ];

      case 'ADMIN':
        return [
          ...baseItems,
          {
            id: 'schools',
            title: 'Schools',
            href: `/dashboard/admin/schools`,
            icon: UserGroupIcon,
            description: 'Manage schools and institutions',
            children: [
              {
                id: 'schools-list',
                title: 'All Schools',
                href: `/dashboard/admin/schools`,
                icon: UserGroupIcon,
                description: 'View and manage all schools'
              },
              {
                id: 'add-school',
                title: 'Add School',
                href: `/dashboard/admin/schools/add`,
                icon: PlusIcon,
                description: 'Add a new school'
              }
            ]
          },
          {
            id: 'analytics',
            title: 'Analytics',
            href: `/dashboard/admin/analytics`,
            icon: ChartBarIcon,
            description: 'View platform-wide analytics and insights'
          },
          {
            id: 'settings',
            title: 'Settings',
            href: `/dashboard/admin/settings`,
            icon: CogIcon,
            description: 'System configuration and settings'
          }
        ];

      case 'TEACHER':
        return [
          ...baseItems,
          {
            id: 'students',
            title: 'My Students',
            href: `/dashboard/teacher/students`,
            icon: UserGroupIcon,
            description: 'Manage assigned students'
          },
          {
            id: 'assessment',
            title: 'Assessment',
            href: `/dashboard/teacher/assessment`,
            icon: DocumentTextIcon,
            description: 'Upload and analyze academic documents'
          },
          {
            id: 'analytics',
            title: 'Analytics',
            href: `/dashboard/teacher/analytics`,
            icon: ChartBarIcon,
            description: 'View class performance insights'
          }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = generateMenuItems();

  const toggleMenu = (itemId: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedMenus(newExpanded);
  };

  const handleItemClick = (item: MenuItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      router.push(item.href);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedMenus.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = activeItem === item.id;

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
            isActive
              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.id);
            } else {
              handleItemClick(item);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <item.icon className="w-5 h-5" />
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </div>
          {hasChildren && (
            <div className="text-gray-400">
              {isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">EduSight</h2>
            <p className="text-xs text-gray-500">{userTypeConfig.name}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {session?.user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {session?.user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => renderMenuItem(item))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => handleItemClick({ id: 'upload', title: 'Upload', href: '/upload', icon: CloudArrowUpIcon, description: 'Upload documents' })}
            className="w-full flex items-center space-x-3 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>Upload Documents</span>
          </button>
          <button
            onClick={() => handleItemClick({ id: 'reports', title: 'Reports', href: '/reports', icon: EyeIcon, description: 'View reports' })}
            className="w-full flex items-center space-x-3 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
