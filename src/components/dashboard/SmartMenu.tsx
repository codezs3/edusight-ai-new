'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  AcademicCapIcon,
  HeartIcon,
  LightBulbIcon,
  MapPinIcon,
  CloudArrowUpIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  MegaphoneIcon,
  BookOpenIcon,
  FolderIcon,
  QuestionMarkCircleIcon,
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  children?: MenuItem[];
  permission?: string;
  isActive?: boolean;
  count?: number;
  description?: string;
}

interface SmartMenuProps {
  role: string;
  activeItem?: string;
  onItemClick?: (item: MenuItem) => void;
}

export default function SmartMenu({ role, activeItem, onItemClick }: SmartMenuProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  // Generate menu items based on role and permissions
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
                description: 'Add a new child to your profile',
                badge: 'New'
              },
              {
                id: 'children-analytics',
                title: 'Analytics',
                href: `/dashboard/parent/children/analytics`,
                icon: ChartBarIcon,
                description: 'View children performance analytics'
              }
            ]
          },
          {
            id: 'documents',
            title: 'Documents',
            href: `/dashboard/parent/upload`,
            icon: CloudArrowUpIcon,
            description: 'Upload and manage documents',
            children: [
              {
                id: 'upload',
                title: 'Upload Files',
                href: `/dashboard/parent/upload`,
                icon: CloudArrowUpIcon,
                description: 'Upload assessment documents'
              },
              {
                id: 'documents-list',
                title: 'All Documents',
                href: `/dashboard/parent/documents`,
                icon: DocumentTextIcon,
                description: 'View uploaded documents'
              },
              {
                id: 'reports',
                title: 'Reports',
                href: `/dashboard/parent/reports`,
                icon: ChartBarIcon,
                description: 'View assessment reports'
              }
            ]
          },
          {
            id: 'assessments',
            title: 'Assessments',
            href: `/dashboard/parent/assessments`,
            icon: AcademicCapIcon,
            description: 'Academic assessments and progress',
            children: [
              {
                id: 'schedule',
                title: 'Schedule Tests',
                href: `/dashboard/parent/schedule`,
                icon: CalendarIcon,
                description: 'Schedule new assessments'
              },
              {
                id: 'progress',
                title: 'Progress Tracking',
                href: `/dashboard/parent/progress`,
                icon: ChartBarIcon,
                description: 'Track academic progress'
              },
              {
                id: 'downloads',
                title: 'Download Reports',
                href: `/dashboard/parent/downloads`,
                icon: DocumentTextIcon,
                description: 'Download assessment reports'
              }
            ]
          },
          {
            id: 'communication',
            title: 'Communication',
            href: `/dashboard/parent/communication`,
            icon: ChatBubbleLeftRightIcon,
            description: 'School and teacher communication',
            children: [
              {
                id: 'messages',
                title: 'Messages',
                href: `/dashboard/parent/messages`,
                icon: EnvelopeIcon,
                description: 'View and send messages',
                badge: '3'
              },
              {
                id: 'meetings',
                title: 'Parent-Teacher Meetings',
                href: `/dashboard/parent/meetings`,
                icon: VideoCameraIcon,
                description: 'Schedule and attend meetings'
              },
              {
                id: 'notifications',
                title: 'Notifications',
                href: `/dashboard/parent/notifications`,
                icon: BellIcon,
                description: 'School notifications and updates'
              }
            ]
          },
          {
            id: 'resources',
            title: 'Resources',
            href: `/dashboard/parent/resources`,
            icon: BookOpenIcon,
            description: 'Learning resources and guides',
            children: [
              {
                id: 'learning-materials',
                title: 'Learning Materials',
                href: `/dashboard/parent/learning`,
                icon: FolderIcon,
                description: 'Access learning resources'
              },
              {
                id: 'parent-guides',
                title: 'Parent Guides',
                href: `/dashboard/parent/guides`,
                icon: BookOpenIcon,
                description: 'Parenting and education guides'
              },
              {
                id: 'support',
                title: 'Support Center',
                href: `/dashboard/parent/support`,
                icon: QuestionMarkCircleIcon,
                description: 'Get help and support'
              }
            ]
          },
          {
            id: 'billing',
            title: 'Billing & Subscription',
            href: `/dashboard/parent/billing`,
            icon: CurrencyDollarIcon,
            description: 'Manage payments and subscription',
            children: [
              {
                id: 'payments',
                title: 'Payment History',
                href: `/dashboard/parent/payments`,
                icon: CurrencyDollarIcon,
                description: 'View payment history'
              },
              {
                id: 'invoices',
                title: 'Invoices',
                href: `/dashboard/parent/invoices`,
                icon: DocumentTextIcon,
                description: 'Download invoices'
              },
              {
                id: 'subscription',
                title: 'Subscription',
                href: `/dashboard/parent/subscription`,
                icon: CheckCircleIcon,
                description: 'Manage subscription plan'
              }
            ]
          }
        ];

      case 'ADMIN':
        return [
          ...baseItems,
          {
            id: 'schools',
            title: 'School Management',
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
                description: 'Add a new school',
                badge: 'New'
              },
              {
                id: 'school-analytics',
                title: 'School Analytics',
                href: `/dashboard/admin/schools/analytics`,
                icon: ChartBarIcon,
                description: 'View school performance data'
              }
            ]
          },
          {
            id: 'users',
            title: 'User Management',
            href: `/dashboard/admin/users`,
            icon: UserGroupIcon,
            description: 'Manage platform users',
            children: [
              {
                id: 'all-users',
                title: 'All Users',
                href: `/dashboard/admin/users`,
                icon: UserGroupIcon,
                description: 'View and manage all users'
              },
              {
                id: 'roles',
                title: 'Role Management',
                href: `/dashboard/admin/roles`,
                icon: KeyIcon,
                description: 'Manage user roles and permissions'
              },
              {
                id: 'user-analytics',
                title: 'User Analytics',
                href: `/dashboard/admin/users/analytics`,
                icon: ChartBarIcon,
                description: 'View user activity data'
              }
            ]
          },
          {
            id: 'system',
            title: 'System Management',
            href: `/dashboard/admin/system`,
            icon: CogIcon,
            description: 'System configuration and monitoring',
            children: [
              {
                id: 'settings',
                title: 'System Settings',
                href: `/dashboard/admin/system/settings`,
                icon: CogIcon,
                description: 'Configure system settings'
              },
              {
                id: 'security',
                title: 'Security',
                href: `/dashboard/admin/system/security`,
                icon: ShieldCheckIcon,
                description: 'Security settings and monitoring'
              },
              {
                id: 'logs',
                title: 'System Logs',
                href: `/dashboard/admin/system/logs`,
                icon: DocumentTextIcon,
                description: 'View system logs and events'
              }
            ]
          },
          {
            id: 'analytics',
            title: 'Platform Analytics',
            href: `/dashboard/admin/analytics`,
            icon: ChartBarIcon,
            description: 'Platform-wide analytics and insights',
            children: [
              {
                id: 'overview',
                title: 'Overview',
                href: `/dashboard/admin/analytics`,
                icon: ChartBarIcon,
                description: 'Platform overview dashboard'
              },
                             {
                 id: 'ml-analytics',
                 title: 'ML Analytics',
                 href: `/dashboard/admin/analytics/ml`,
                 icon: ChartBarIcon,
                 description: 'Machine learning insights'
               },
              {
                id: 'reports',
                title: 'Reports',
                href: `/dashboard/admin/analytics/reports`,
                icon: DocumentTextIcon,
                description: 'Generate platform reports'
              }
            ]
          }
        ];

      case 'SCHOOL_ADMIN':
        return [
          ...baseItems,
          {
            id: 'students',
            title: 'Student Management',
            href: `/dashboard/school-admin/students`,
            icon: UserGroupIcon,
            description: 'Manage school students',
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
                description: 'Add a new student',
                badge: 'New'
              },
              {
                id: 'student-analytics',
                title: 'Student Analytics',
                href: `/dashboard/school-admin/students/analytics`,
                icon: ChartBarIcon,
                description: 'View student performance data'
              }
            ]
          },
          {
            id: 'teachers',
            title: 'Teacher Management',
            href: `/dashboard/school-admin/teachers`,
            icon: AcademicCapIcon,
            description: 'Manage school teachers',
            children: [
              {
                id: 'teachers-list',
                title: 'All Teachers',
                href: `/dashboard/school-admin/teachers`,
                icon: AcademicCapIcon,
                description: 'View and manage all teachers'
              },
              {
                id: 'add-teacher',
                title: 'Add Teacher',
                href: `/dashboard/school-admin/teachers/add`,
                icon: PlusIcon,
                description: 'Add a new teacher'
              }
            ]
          },
          {
            id: 'school-analytics',
            title: 'School Analytics',
            href: `/dashboard/school-admin/analytics`,
            icon: ChartBarIcon,
            description: 'School performance analytics',
            children: [
              {
                id: 'overview',
                title: 'Overview',
                href: `/dashboard/school-admin/analytics`,
                icon: ChartBarIcon,
                description: 'School overview dashboard'
              },
              {
                id: 'performance',
                title: 'Performance Metrics',
                href: `/dashboard/school-admin/analytics/performance`,
                icon: ChartBarIcon,
                description: 'Detailed performance metrics'
              }
            ]
          }
        ];

      default:
        return baseItems;
    }
  };

  const menuItems = generateMenuItems();

  // Filter menu items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(menuItems);
      return;
    }

    const filtered = menuItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (item.children) {
        const matchingChildren = item.children.filter(child =>
          child.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesSearch || matchingChildren.length > 0;
      }
      
      return matchesSearch;
    });

    setFilteredItems(filtered);
  }, [searchTerm, menuItems]);

  const toggleMenu = (menuTitle: string) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuTitle)) {
      newExpanded.delete(menuTitle);
    } else {
      newExpanded.add(menuTitle);
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

  return (
    <div className="space-y-2">
      {/* Search Bar */}
      <div className="px-2 pb-2">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-0.5">
        {filteredItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.children) {
                  toggleMenu(item.title);
                } else {
                  handleItemClick(item);
                }
              }}
              className={`w-full flex items-center px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                activeItem === item.href
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
              }`}
            >
              <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
              <div className="flex-1 text-left min-w-0">
                <div className="truncate">{item.title}</div>
                {item.description && (
                  <div className="text-xs text-gray-400 truncate">{item.description}</div>
                )}
              </div>
              {item.badge && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-600 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {item.count && item.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full min-w-[20px] text-center">
                  {item.count}
                </span>
              )}
              {item.children && (
                <ChevronDownIcon
                  className={`ml-1 h-3 w-3 transition-transform ${
                    expandedMenus.has(item.title) ? 'transform rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {item.children && expandedMenus.has(item.title) && (
              <div className="ml-4 mt-0.5 space-y-0.5">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => handleItemClick(child)}
                    className={`w-full flex items-center px-2 py-1 text-xs font-medium rounded transition-colors ${
                      activeItem === child.href
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    <child.icon className="mr-2 h-3 w-3 flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="truncate">{child.title}</div>
                      {child.description && (
                        <div className="text-xs text-gray-400 truncate">{child.description}</div>
                      )}
                    </div>
                    {child.badge && (
                      <span className="ml-1 px-1 py-0.5 text-xs bg-green-100 text-green-600 rounded-full min-w-[16px] text-center">
                        {child.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {searchTerm && filteredItems.length === 0 && (
        <div className="px-2 py-4 text-center">
          <div className="text-gray-400 text-xs">
            No menu items found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
}
