'use client'

import { useState } from 'react'
import { 
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ComputerDesktopIcon,
  TruckIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  HomeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function ExpenseManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Sidebar Menu Items
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: HomeIcon
    },
    {
      title: 'Accounting Overview',
      href: '/dashboard/admin/accounting',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Expense Management',
      href: '/dashboard/admin/accounting/expenses',
      icon: ArrowTrendingDownIcon,
      children: [
        { title: 'All Expenses', href: '/dashboard/admin/accounting/expenses', icon: DocumentTextIcon },
        { title: 'Operational Costs', href: '/dashboard/admin/accounting/operational', icon: BuildingOfficeIcon },
        { title: 'Staff Salaries', href: '/dashboard/admin/accounting/salaries', icon: UsersIcon },
        { title: 'Add Expense', href: '/dashboard/admin/accounting/expenses/add', icon: PlusIcon }
      ]
    }
  ];

  // Expense statistics
  const expenseStats = [
    {
      title: 'Total Expenses',
      value: '$89,230',
      change: '8.2',
      changeType: 'positive' as const,
      icon: ArrowTrendingDownIcon,
      color: 'red',
      description: 'This month'
    },
    {
      title: 'Staff Salaries',
      value: '$45,000',
      change: '2.1',
      changeType: 'positive' as const,
      icon: UsersIcon,
      color: 'blue',
      description: 'Payroll expenses'
    },
    {
      title: 'Operations',
      value: '$22,430',
      change: '12.5',
      changeType: 'positive' as const,
      icon: BuildingOfficeIcon,
      color: 'orange',
      description: 'Operational costs'
    },
    {
      title: 'Technology',
      value: '$15,800',
      change: '5.7',
      changeType: 'positive' as const,
      icon: ComputerDesktopIcon,
      color: 'purple',
      description: 'Tech infrastructure'
    }
  ];

  // Expense breakdown by category
  const expenseByCategory = [
    { label: 'Staff Salaries', value: 45000 },
    { label: 'Operations', value: 22430 },
    { label: 'Technology', value: 15800 },
    { label: 'Marketing', value: 8200 },
    { label: 'Travel', value: 4500 },
    { label: 'Other', value: 3300 }
  ];

  // Monthly expense trend
  const monthlyExpenseData = [
    { label: 'Jan', value: 78000 },
    { label: 'Feb', value: 82000 },
    { label: 'Mar', value: 79000 },
    { label: 'Apr', value: 85000 },
    { label: 'May', value: 81000 },
    { label: 'Jun', value: 89230 }
  ];

  // Expense records
  const expenseRecords = [
    {
      id: 1,
      date: '2024-01-20',
      description: 'Development Team Salaries',
      category: 'Salary',
      amount: 15000,
      status: 'paid',
      vendor: 'Internal Payroll',
      receiptNumber: 'PAY-2024-001',
      approvedBy: 'John Smith'
    },
    {
      id: 2,
      date: '2024-01-19',
      description: 'AWS Cloud Services',
      category: 'Technology',
      amount: 850,
      status: 'paid',
      vendor: 'Amazon Web Services',
      receiptNumber: 'AWS-2024-001',
      approvedBy: 'Sarah Johnson'
    },
    {
      id: 3,
      date: '2024-01-18',
      description: 'Office Rent - January',
      category: 'Operations',
      amount: 3500,
      status: 'paid',
      vendor: 'Property Management Inc.',
      receiptNumber: 'RENT-2024-001',
      approvedBy: 'John Smith'
    },
    {
      id: 4,
      date: '2024-01-17',
      description: 'Marketing Campaign - Q1',
      category: 'Marketing',
      amount: 2500,
      status: 'pending',
      vendor: 'Digital Marketing Co.',
      receiptNumber: 'MKT-2024-001',
      approvedBy: 'Pending'
    },
    {
      id: 5,
      date: '2024-01-16',
      description: 'Software Licenses',
      category: 'Technology',
      amount: 1200,
      status: 'approved',
      vendor: 'Software Solutions Inc.',
      receiptNumber: 'LIC-2024-001',
      approvedBy: 'Sarah Johnson'
    },
    {
      id: 6,
      date: '2024-01-15',
      description: 'Business Travel - Conference',
      category: 'Travel',
      amount: 800,
      status: 'paid',
      vendor: 'Travel Agency',
      receiptNumber: 'TRV-2024-001',
      approvedBy: 'John Smith'
    }
  ];

  const filteredRecords = expenseRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || record.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'approved':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'rejected':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <VerticalDashboardLayout
      title="Expense Management"
      subtitle="Track and control all business expenses"
      menuItems={menuItems}
      activeItem="/dashboard/admin/accounting/expenses"
    >
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
            <p className="text-gray-600">Monitor and control all business expenditures</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              <PlusIcon className="h-4 w-4 inline mr-2" />
              Add Expense
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <ArrowDownTrayIcon className="h-4 w-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Expense Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expenseStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              color={stat.color}
              description={stat.description}
            />
          ))}
        </div>

        {/* Expense Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Expense Trend */}
          <DashboardCard title="Monthly Expense Trend" value="" subtitle="Expense patterns over time">
            <ModernChart
              title="Monthly Expenses ($)"
              data={monthlyExpenseData}
              type="line"
              height={300}
            />
          </DashboardCard>

          {/* Expense by Category */}
          <DashboardCard title="Expense by Category" value="" subtitle="Spending breakdown by category">
            <ModernChart
              title="Expense Categories"
              data={expenseByCategory}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Budget vs Actual Spending */}
        <DashboardCard title="Budget vs Actual Spending" value="" subtitle="Compare budgeted vs actual expenses">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Monthly Budget</h3>
              <p className="text-2xl font-bold text-blue-600">$95,000</p>
              <p className="text-sm text-blue-600">Allocated for this month</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900">Actual Spending</h3>
              <p className="text-2xl font-bold text-red-600">$89,230</p>
              <p className="text-sm text-red-600">Spent this month</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Remaining Budget</h3>
              <p className="text-2xl font-bold text-green-600">$5,770</p>
              <p className="text-sm text-green-600">6.1% under budget</p>
            </div>
          </div>
        </DashboardCard>

        {/* Expense Records */}
        <DashboardCard title="Expense Records" value="" subtitle="Detailed expense transaction history">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expense records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="salary">Salary</option>
                <option value="technology">Technology</option>
                <option value="operations">Operations</option>
                <option value="marketing">Marketing</option>
                <option value="travel">Travel</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Expense Records Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
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
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{record.description}</div>
                        <div className="text-gray-500">Receipt: {record.receiptNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{record.vendor}</div>
                        <div className="text-gray-500">Approved by: {record.approvedBy}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      ${record.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
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

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No expense records found matching your criteria.</p>
            </div>
          )}
        </DashboardCard>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-600 to-orange-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Smart Expense Control</h3>
              <p className="text-red-100">Keep expenses under control with detailed tracking and budget monitoring</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm">
                Add New Expense
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors font-medium text-sm border border-red-400">
                Budget Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
