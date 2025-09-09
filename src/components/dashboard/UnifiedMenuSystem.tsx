'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  HeartIcon,
  LightBulbIcon,
  TrophyIcon,
  CogIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  UserCircleIcon,
  BookOpenIcon,
  CalendarIcon,
  EnvelopeIcon,
  CloudArrowUpIcon,
  ArrowTrendingUpIcon,
  FolderIcon,
  DevicePhoneMobileIcon,
  ShareIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  MapPinIcon,
  VideoCameraIcon,
  MegaphoneIcon,
  ArchiveBoxIcon,
  WrenchScrewdriverIcon,
  GlobeAltIcon,
  PhoneIcon,
  AtSymbolIcon,
  KeyIcon,
  ShieldCheckIcon,
  ServerIcon,
  ComputerDesktopIcon,
  WifiIcon,
  BugAntIcon,
  LifebuoyIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartPieIcon,
  StarIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
  isUrgent?: boolean;
  permissions?: string[];
  description?: string;
}

interface UnifiedMenuSystemProps {
  userRole: string;
  className?: string;
}

const UnifiedMenuSystem: React.FC<UnifiedMenuSystemProps> = ({ userRole, className = '' }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Menu configurations for different user roles
  const menuConfigs: Record<string, MenuItem[]> = {
    ADMIN: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: HomeIcon,
        href: '/dashboard/admin',
        children: [
          { id: 'overview', title: 'Overview', icon: ChartBarIcon, href: '/dashboard/admin' },
          { id: 'analytics', title: 'Analytics', icon: ArrowTrendingUpIcon, href: '/dashboard/analytics' },
          { id: 'quick-stats', title: 'Quick Stats', icon: ChartPieIcon, href: '/dashboard/admin/stats' }
        ]
      },
      {
        id: 'school-management',
        title: 'School Management',
        icon: BuildingOfficeIcon,
        children: [
          { id: 'schools', title: 'Schools', icon: BuildingOfficeIcon, href: '/dashboard/admin/school' },
          { id: 'students', title: 'Students', icon: UsersIcon, href: '/dashboard/admin/students' },
          { id: 'teachers', title: 'Teachers', icon: AcademicCapIcon, href: '/dashboard/admin/teachers' },
          { id: 'classes', title: 'Classes', icon: BookOpenIcon, href: '/dashboard/admin/classes' }
        ]
      },
      {
        id: 'assessments',
        title: 'Assessments',
        icon: DocumentTextIcon,
        children: [
          { id: 'assessment-center', title: 'Assessment Center', icon: DocumentTextIcon, href: '/dashboard/assessment' },
          { id: 'academic', title: 'Academic Assessments', icon: AcademicCapIcon, href: '/assessments/academic/' },
          { id: 'psychological', title: 'Psychological Assessments', icon: LightBulbIcon, href: '/assessments/psychometric/' },
          { id: 'physical', title: 'Physical Assessments', icon: HeartIcon, href: '/assessments/physical/' },
          { id: 'reports', title: 'Reports & Analytics', icon: ChartBarIcon, href: '/assessments/reports/' }
        ]
      },
      {
        id: 'system-admin',
        title: 'System Admin',
        icon: CogIcon,
        children: [
          { id: 'users', title: 'User Management', icon: UsersIcon, href: '/dashboard/admin/users' },
          { id: 'settings', title: 'Settings', icon: CogIcon, href: '/dashboard/admin/settings' },
          { id: 'api', title: 'API Management', icon: ServerIcon, href: '/dashboard/admin/api' },
          { id: 'maintenance', title: 'Maintenance', icon: WrenchScrewdriverIcon, href: '/dashboard/admin/maintenance' }
        ]
      },
      {
        id: 'business',
        title: 'Business',
        icon: CurrencyDollarIcon,
        children: [
          { id: 'billing', title: 'Billing', icon: BanknotesIcon, href: '/dashboard/admin/billing' },
          { id: 'subscriptions', title: 'Subscriptions', icon: CreditCardIcon, href: '/dashboard/admin/subscriptions' },
          { id: 'payments', title: 'Payments', icon: CurrencyDollarIcon, href: '/dashboard/admin/payments' }
        ]
      },
      {
        id: 'support',
        title: 'Support',
        icon: QuestionMarkCircleIcon,
        children: [
          { id: 'help', title: 'Help Center', icon: LifebuoyIcon, href: '/dashboard/admin/help' },
          { id: 'docs', title: 'Documentation', icon: BookOpenIcon, href: '/dashboard/admin/docs' },
          { id: 'contact', title: 'Contact', icon: PhoneIcon, href: '/dashboard/admin/contact' }
        ]
      }
    ],
    PARENT: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: HomeIcon,
        href: '/dashboard/parent',
        children: [
          { id: 'overview', title: 'Overview', icon: ChartBarIcon, href: '/dashboard/parent' },
          { id: 'activity', title: 'Recent Activity', icon: ClockIcon, href: '/dashboard/parent/activity' },
          { id: 'quick-actions', title: 'Quick Actions', icon: PlusIcon, href: '/dashboard/parent/quick-actions' }
        ]
      },
      {
        id: 'children',
        title: 'My Children',
        icon: UserCircleIcon,
        children: [
          { id: 'all-children', title: 'All Children', icon: UsersIcon, href: '/dashboard/parent/children' },
          { id: 'add-child', title: 'Add New Child', icon: PlusIcon, href: '/dashboard/parent/add-child', isNew: true },
          { id: 'child-profiles', title: 'Child Profiles', icon: UserCircleIcon, href: '/dashboard/parent/profiles' }
        ]
      },
      {
        id: 'assessments',
        title: 'Assessments',
        icon: DocumentTextIcon,
        badge: '3',
        badgeColor: 'bg-blue-500',
        children: [
          { id: 'start-assessment', title: 'Start Assessment', icon: PlusIcon, href: '/assessments/', isNew: true },
          { id: 'academic', title: 'Academic Assessment', icon: AcademicCapIcon, href: '/assessments/academic/' },
          { id: 'psychological', title: 'Psychological Assessment', icon: LightBulbIcon, href: '/assessments/psychometric/' },
          { id: 'physical', title: 'Physical Assessment', icon: HeartIcon, href: '/assessments/physical/' },
          { id: 'combined', title: '360° Combined Assessment', icon: TrophyIcon, href: '/assessments/combined/', isNew: true },
          { id: 'reports', title: 'View All Reports', icon: EyeIcon, href: '/assessments/reports/' }
        ]
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: ChartBarIcon,
        children: [
          { id: 'performance', title: 'Performance Dashboard', icon: ArrowTrendingUpIcon, href: '/dashboard/analytics' },
          { id: 'progress', title: 'Progress Tracking', icon: ChartBarIcon, href: '/dashboard/parent/progress' },
          { id: 'insights', title: 'Trends & Insights', icon: LightBulbIcon, href: '/dashboard/parent/insights' },
          { id: 'export', title: 'Export Data', icon: ArrowDownTrayIcon, href: '/dashboard/parent/export' }
        ]
      },
      {
        id: 'communication',
        title: 'Communication',
        icon: ChatBubbleLeftRightIcon,
        badge: '5',
        badgeColor: 'bg-green-500',
        children: [
          { id: 'messages', title: 'Messages', icon: EnvelopeIcon, href: '/dashboard/parent/messages' },
          { id: 'notifications', title: 'Notifications', icon: BellIcon, href: '/dashboard/parent/notifications' },
          { id: 'school-updates', title: 'School Updates', icon: MegaphoneIcon, href: '/dashboard/parent/updates' },
          { id: 'teacher-contact', title: 'Teacher Contact', icon: VideoCameraIcon, href: '/dashboard/parent/teachers' }
        ]
      },
      {
        id: 'resources',
        title: 'Resources',
        icon: BookOpenIcon,
        children: [
          { id: 'materials', title: 'Learning Materials', icon: FolderIcon, href: '/dashboard/parent/materials' },
          { id: 'guides', title: 'Parent Guides', icon: BookOpenIcon, href: '/dashboard/parent/guides' },
          { id: 'support', title: 'Support Center', icon: QuestionMarkCircleIcon, href: '/dashboard/parent/support' },
          { id: 'mobile', title: 'Mobile App', icon: DevicePhoneMobileIcon, href: '/dashboard/parent/mobile' }
        ]
      },
      {
        id: 'account',
        title: 'Account',
        icon: CogIcon,
        children: [
          { id: 'profile', title: 'Profile Settings', icon: UserCircleIcon, href: '/dashboard/parent/profile' },
          { id: 'billing', title: 'Billing', icon: CurrencyDollarIcon, href: '/dashboard/parent/billing' },
          { id: 'preferences', title: 'Preferences', icon: CogIcon, href: '/dashboard/parent/preferences' }
        ]
      }
    ],
    TEACHER: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: HomeIcon,
        href: '/dashboard/teacher',
        children: [
          { id: 'overview', title: 'My Classes', icon: BookOpenIcon, href: '/dashboard/teacher' },
          { id: 'schedule', title: "Today's Schedule", icon: CalendarIcon, href: '/dashboard/teacher/schedule' },
          { id: 'quick-actions', title: 'Quick Actions', icon: PlusIcon, href: '/dashboard/teacher/quick-actions' }
        ]
      },
      {
        id: 'students',
        title: 'Student Management',
        icon: UsersIcon,
        children: [
          { id: 'my-students', title: 'My Students', icon: UsersIcon, href: '/dashboard/teacher/students' },
          { id: 'class-performance', title: 'Class Performance', icon: ChartBarIcon, href: '/dashboard/teacher/performance' },
          { id: 'individual-progress', title: 'Individual Progress', icon: UserCircleIcon, href: '/dashboard/teacher/progress' },
          { id: 'assessment-results', title: 'Assessment Results', icon: DocumentTextIcon, href: '/dashboard/teacher/assessments' }
        ]
      },
      {
        id: 'assessments',
        title: 'Assessments',
        icon: DocumentTextIcon,
        children: [
          { id: 'create', title: 'Create Assessment', icon: PlusIcon, href: '/dashboard/teacher/create-assessment' },
          { id: 'grade', title: 'Grade Assessments', icon: PencilIcon, href: '/dashboard/teacher/grade' },
          { id: 'results', title: 'View Results', icon: EyeIcon, href: '/dashboard/teacher/results' },
          { id: 'reports', title: 'Generate Reports', icon: ArrowDownTrayIcon, href: '/dashboard/teacher/reports' }
        ]
      },
      {
        id: 'curriculum',
        title: 'Curriculum',
        icon: BookOpenIcon,
        children: [
          { id: 'lesson-plans', title: 'Lesson Plans', icon: ClipboardDocumentListIcon, href: '/dashboard/teacher/lessons' },
          { id: 'resources', title: 'Resources', icon: FolderIcon, href: '/dashboard/teacher/resources' },
          { id: 'standards', title: 'Standards', icon: BookOpenIcon, href: '/dashboard/teacher/standards' },
          { id: 'templates', title: 'Templates', icon: DocumentTextIcon, href: '/dashboard/teacher/templates' }
        ]
      },
      {
        id: 'communication',
        title: 'Communication',
        icon: ChatBubbleLeftRightIcon,
        children: [
          { id: 'parent-messages', title: 'Parent Messages', icon: EnvelopeIcon, href: '/dashboard/teacher/parents' },
          { id: 'student-feedback', title: 'Student Feedback', icon: UsersIcon, href: '/dashboard/teacher/feedback' },
          { id: 'announcements', title: 'Announcements', icon: MegaphoneIcon, href: '/dashboard/teacher/announcements' },
          { id: 'meetings', title: 'Meetings', icon: VideoCameraIcon, href: '/dashboard/teacher/meetings' }
        ]
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: ChartBarIcon,
        children: [
          { id: 'class-analytics', title: 'Class Analytics', icon: ChartBarIcon, href: '/dashboard/teacher/analytics' },
          { id: 'student-insights', title: 'Student Insights', icon: LightBulbIcon, href: '/dashboard/teacher/insights' },
          { id: 'trends', title: 'Performance Trends', icon: ArrowTrendingUpIcon, href: '/dashboard/teacher/trends' },
          { id: 'comparative', title: 'Comparative Analysis', icon: ChartPieIcon, href: '/dashboard/teacher/comparative' }
        ]
      },
      {
        id: 'account',
        title: 'Account',
        icon: CogIcon,
        children: [
          { id: 'profile', title: 'Profile', icon: UserCircleIcon, href: '/dashboard/teacher/profile' },
          { id: 'settings', title: 'Settings', icon: CogIcon, href: '/dashboard/teacher/settings' },
          { id: 'preferences', title: 'Preferences', icon: AdjustmentsHorizontalIcon, href: '/dashboard/teacher/preferences' }
        ]
      }
    ],
    SCHOOL_ADMIN: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        icon: HomeIcon,
        href: '/dashboard/school-admin',
        children: [
          { id: 'overview', title: 'School Overview', icon: BuildingOfficeIcon, href: '/dashboard/school-admin' },
          { id: 'metrics', title: 'Key Metrics', icon: ChartBarIcon, href: '/dashboard/school-admin/metrics' },
          { id: 'activity', title: 'Recent Activity', icon: ClockIcon, href: '/dashboard/school-admin/activity' }
        ]
      },
      {
        id: 'staff-students',
        title: 'Staff & Students',
        icon: UsersIcon,
        children: [
          { id: 'teachers', title: 'Teachers', icon: AcademicCapIcon, href: '/dashboard/school-admin/teachers' },
          { id: 'students', title: 'Students', icon: UsersIcon, href: '/dashboard/school-admin/students' },
          { id: 'classes', title: 'Classes', icon: BookOpenIcon, href: '/dashboard/school-admin/classes' },
          { id: 'schedules', title: 'Schedules', icon: CalendarIcon, href: '/dashboard/school-admin/schedules' }
        ]
      },
      {
        id: 'assessments',
        title: 'Assessments',
        icon: DocumentTextIcon,
        children: [
          { id: 'school-assessments', title: 'School Assessments', icon: DocumentTextIcon, href: '/dashboard/school-admin/assessments' },
          { id: 'performance-reports', title: 'Performance Reports', icon: ChartBarIcon, href: '/dashboard/school-admin/reports' },
          { id: 'analytics', title: 'Analytics', icon: ArrowTrendingUpIcon, href: '/dashboard/school-admin/analytics' },
          { id: 'export', title: 'Export Data', icon: ArrowDownTrayIcon, href: '/dashboard/school-admin/export' }
        ]
      },
      {
        id: 'curriculum',
        title: 'Curriculum',
        icon: BookOpenIcon,
        children: [
          { id: 'subjects', title: 'Subjects', icon: BookOpenIcon, href: '/dashboard/school-admin/subjects' },
          { id: 'standards', title: 'Standards', icon: ClipboardDocumentListIcon, href: '/dashboard/school-admin/standards' },
          { id: 'resources', title: 'Resources', icon: FolderIcon, href: '/dashboard/school-admin/resources' },
          { id: 'templates', title: 'Templates', icon: DocumentTextIcon, href: '/dashboard/school-admin/templates' }
        ]
      },
      {
        id: 'communication',
        title: 'Communication',
        icon: ChatBubbleLeftRightIcon,
        children: [
          { id: 'announcements', title: 'Announcements', icon: MegaphoneIcon, href: '/dashboard/school-admin/announcements' },
          { id: 'parent-communication', title: 'Parent Communication', icon: EnvelopeIcon, href: '/dashboard/school-admin/parents' },
          { id: 'staff-messages', title: 'Staff Messages', icon: ChatBubbleLeftRightIcon, href: '/dashboard/school-admin/staff' },
          { id: 'notifications', title: 'Notifications', icon: BellIcon, href: '/dashboard/school-admin/notifications' }
        ]
      },
      {
        id: 'analytics',
        title: 'Analytics',
        icon: ChartBarIcon,
        children: [
          { id: 'school-performance', title: 'School Performance', icon: ChartBarIcon, href: '/dashboard/school-admin/performance' },
          { id: 'student-insights', title: 'Student Insights', icon: LightBulbIcon, href: '/dashboard/school-admin/insights' },
          { id: 'teacher-analytics', title: 'Teacher Analytics', icon: AcademicCapIcon, href: '/dashboard/school-admin/teacher-analytics' },
          { id: 'comparative', title: 'Comparative Reports', icon: ChartPieIcon, href: '/dashboard/school-admin/comparative' }
        ]
      },
      {
        id: 'administration',
        title: 'Administration',
        icon: CogIcon,
        children: [
          { id: 'settings', title: 'Settings', icon: CogIcon, href: '/dashboard/school-admin/settings' },
          { id: 'user-management', title: 'User Management', icon: UsersIcon, href: '/dashboard/school-admin/users' },
          { id: 'billing', title: 'Billing', icon: CurrencyDollarIcon, href: '/dashboard/school-admin/billing' },
          { id: 'support', title: 'Support', icon: QuestionMarkCircleIcon, href: '/dashboard/school-admin/support' }
        ]
      }
    ]
  };

  const currentMenu = menuConfigs[userRole] || [];

  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.href) {
      router.push(item.href);
      setActiveItem(item.href);
    } else if (item.children) {
      toggleExpanded(item.id);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeItem === item.href;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="mb-1">
        <motion.button
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 ${
            isActive 
              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500' 
              : 'text-gray-700 hover:bg-gray-100'
          } ${level > 0 ? 'ml-4' : ''}`}
          onClick={() => handleItemClick(item)}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className="font-medium">{item.title}</span>
            {item.isNew && (
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full">
                New
              </span>
            )}
            {item.isUrgent && (
              <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                Urgent
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className={`px-2 py-0.5 text-xs font-bold text-white rounded-full ${item.badgeColor || 'bg-blue-500'}`}>
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </motion.div>
            )}
          </div>
        </motion.button>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children!.map(child => renderMenuItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {userRole === 'ADMIN' && 'Admin Menu'}
          {userRole === 'PARENT' && 'Parent Menu'}
          {userRole === 'TEACHER' && 'Teacher Menu'}
          {userRole === 'SCHOOL_ADMIN' && 'School Admin Menu'}
        </h3>
        <p className="text-sm text-gray-600">
          Navigate through your dashboard features
        </p>
      </div>
      
      <div className="space-y-1">
        {currentMenu.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default UnifiedMenuSystem;
