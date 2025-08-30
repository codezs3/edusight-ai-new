'use client';

import { useState } from 'react';
import { 
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Demo users organized by category
const demoUsers = {
  admin: [
    { email: 'admin@edusight.com', name: 'System Administrator', role: 'ADMIN' },
    { email: 'superadmin@edusight.com', name: 'Super Admin', role: 'ADMIN' },
    { email: 'principal@edusight.com', name: 'Dr. Principal Smith', role: 'ADMIN' },
  ],
  business: [
    { email: 'crm@edusight.com', name: 'CRM Manager', role: 'ADMIN' },
    { email: 'sales1@edusight.com', name: 'Jennifer Sales', role: 'ADMIN' },
    { email: 'accounts@edusight.com', name: 'Finance Manager', role: 'ADMIN' },
    { email: 'accountant1@edusight.com', name: 'Patricia Accountant', role: 'ADMIN' },
  ],
  education: [
    { email: 'teacher1@edusight.com', name: 'Sarah Johnson', role: 'TEACHER' },
    { email: 'teacher2@edusight.com', name: 'Michael Chen', role: 'TEACHER' },
    { email: 'teacher3@edusight.com', name: 'Emily Rodriguez', role: 'TEACHER' },
  ],
  students: [
    { email: 'student1@edusight.com', name: 'Alex Thompson', role: 'STUDENT' },
    { email: 'student2@edusight.com', name: 'Emma Wilson', role: 'STUDENT' },
    { email: 'student3@edusight.com', name: 'James Davis', role: 'STUDENT' },
    { email: 'student4@edusight.com', name: 'Sophia Martinez', role: 'STUDENT' },
  ],
  parents: [
    { email: 'parent1@edusight.com', name: 'Robert Thompson', role: 'PARENT' },
    { email: 'parent2@edusight.com', name: 'Lisa Wilson', role: 'PARENT' },
    { email: 'parent3@edusight.com', name: 'David Martinez', role: 'PARENT' },
  ],
  support: [
    { email: 'counselor1@edusight.com', name: 'Dr. Amanda Foster', role: 'COUNSELOR' },
    { email: 'counselor2@edusight.com', name: 'Dr. Mark Stevens', role: 'COUNSELOR' },
    { email: 'customer1@edusight.com', name: 'Customer Service Rep', role: 'ADMIN' },
    { email: 'support@edusight.com', name: 'Technical Support', role: 'ADMIN' },
  ],
};

interface DemoUsersPanelProps {
  onUserSelect?: (email: string, password: string) => void;
  showCopyButton?: boolean;
  compact?: boolean;
}

export function DemoUsersPanel({ 
  onUserSelect, 
  showCopyButton = true, 
  compact = false 
}: DemoUsersPanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('admin');

  const handleUserSelect = (email: string) => {
    if (onUserSelect) {
      onUserSelect(email, 'password123');
    }
    toast.success(`Selected: ${email}`);
  };

  const handleCopyCredentials = (email: string) => {
    const credentials = `Email: ${email}\nPassword: password123`;
    navigator.clipboard.writeText(credentials);
    toast.success('Credentials copied to clipboard!');
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      admin: '👑',
      business: '💼',
      education: '🎓',
      students: '👨‍🎓',
      parents: '👨‍👩‍👧‍👦',
      support: '🎧'
    };
    return icons[category as keyof typeof icons] || '👤';
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      admin: 'Admin & Management',
      business: 'CRM & Finance',
      education: 'Teachers & Staff',
      students: 'Students',
      parents: 'Parents & Guardians',
      support: 'Support & Counseling'
    };
    return titles[category as keyof typeof titles] || category;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'TEACHER': return 'bg-green-100 text-green-800';
      case 'STUDENT': return 'bg-blue-100 text-blue-800';
      case 'PARENT': return 'bg-purple-100 text-purple-800';
      case 'COUNSELOR': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserGroupIcon className="h-5 w-5 mr-2 text-primary-600" />
          Quick Demo Access
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(demoUsers).map(([category, users]) => (
            users.slice(0, 1).map((user) => (
              <button
                key={user.email}
                onClick={() => handleUserSelect(user.email)}
                className="p-3 text-left hover:bg-blue-50 rounded border border-gray-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              </button>
            ))
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Password for all users:</strong> <code className="bg-blue-100 px-1 rounded">password123</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <UserGroupIcon className="h-6 w-6 mr-2 text-primary-600" />
          Demo Users Directory
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Click any user to auto-fill credentials or copy them to clipboard
        </p>
      </div>

      <div className="p-4">
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🔑 Universal Password:</strong> <code className="bg-blue-100 px-1 rounded">password123</code>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            All demo users use the same password for easy testing
          </p>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Object.entries(demoUsers).map(([category, users]) => (
            <div key={category} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 rounded-t-lg transition-colors"
              >
                <span className="flex items-center text-sm font-medium text-gray-700">
                  <span className="mr-2">{getCategoryIcon(category)}</span>
                  {getCategoryTitle(category)}
                  <span className="ml-2 text-xs text-gray-500">({users.length})</span>
                </span>
                {expandedCategory === category ? (
                  <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {expandedCategory === category && (
                <div className="border-t border-gray-200">
                  {users.map((user) => (
                    <div
                      key={user.email}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          
                          <div className="flex space-x-1">
                            {onUserSelect && (
                              <button
                                onClick={() => handleUserSelect(user.email)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                                title="Select user"
                              >
                                <UserGroupIcon className="h-4 w-4" />
                              </button>
                            )}
                            
                            {showCopyButton && (
                              <button
                                onClick={() => handleCopyCredentials(user.email)}
                                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                                title="Copy credentials"
                              >
                                <ClipboardDocumentIcon className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DemoUsersPanel;
