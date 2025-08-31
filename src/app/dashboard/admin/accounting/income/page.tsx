'use client'

import { useState } from 'react'
import { 
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CreditCardIcon,
  AcademicCapIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  HomeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function IncomeManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false)

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
      title: 'Income Management',
      href: '/dashboard/admin/accounting/income',
      icon: ArrowTrendingUpIcon,
      children: [
        { title: 'All Income', href: '/dashboard/admin/accounting/income', icon: BanknotesIcon },
        { title: 'Subscription Revenue', href: '/dashboard/admin/accounting/subscriptions', icon: CreditCardIcon },
        { title: 'Assessment Fees', href: '/dashboard/admin/accounting/assessments', icon: AcademicCapIcon },
        { title: 'Add Income', href: '/dashboard/admin/accounting/income/add', icon: PlusIcon }
      ]
    }
  ];

  // Income statistics
  const incomeStats = [
    {
      title: 'Total Income',
      value: '$127,450',
      change: '12.5',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'green',
      description: 'This month'
    },
    {
      title: 'Subscription Revenue',
      value: '$89,300',
      change: '8.2',
      changeType: 'positive' as const,
      icon: CreditCardIcon,
      color: 'blue',
      description: 'Monthly subscriptions'
    },
    {
      title: 'Assessment Fees',
      value: '$28,150',
      change: '15.7',
      changeType: 'positive' as const,
      icon: AcademicCapIcon,
      color: 'purple',
      description: 'One-time assessments'
    },
    {
      title: 'Other Income',
      value: '$10,000',
      change: '22.1',
      changeType: 'positive' as const,
      icon: ArrowTrendingUpIcon,
      color: 'emerald',
      description: 'Miscellaneous income'
    }
  ];

  // Income breakdown by category
  const incomeByCategory = [
    { label: 'Subscriptions', value: 89300 },
    { label: 'Assessment Fees', value: 28150 },
    { label: 'Training Programs', value: 6500 },
    { label: 'Consulting', value: 2500 },
    { label: 'Other', value: 1000 }
  ];

  // Monthly income trend
  const monthlyIncomeData = [
    { label: 'Jan', value: 105000 },
    { label: 'Feb', value: 118000 },
    { label: 'Mar', value: 112000 },
    { label: 'Apr', value: 125000 },
    { label: 'May', value: 119000 },
    { label: 'Jun', value: 127450 }
  ];

  // Income records
  const incomeRecords = [
    {
      id: 1,
      date: '2024-01-20',
      description: 'Monthly Subscription - Springfield Elementary',
      category: 'Subscription',
      amount: 2500,
      status: 'received',
      client: 'Springfield Elementary',
      invoiceNumber: 'INV-2024-001',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      date: '2024-01-19',
      description: 'E360 Assessment Package - Riverside Academy',
      category: 'Assessment',
      amount: 1800,
      status: 'received',
      client: 'Riverside Academy',
      invoiceNumber: 'INV-2024-002',
      paymentMethod: 'Credit Card'
    },
    {
      id: 3,
      date: '2024-01-18',
      description: 'Annual Subscription - Greenwood High School',
      category: 'Subscription',
      amount: 15000,
      status: 'received',
      client: 'Greenwood High School',
      invoiceNumber: 'INV-2024-003',
      paymentMethod: 'Check'
    },
    {
      id: 4,
      date: '2024-01-17',
      description: 'Training Workshop - Northfield Elementary',
      category: 'Training',
      amount: 3500,
      status: 'pending',
      client: 'Northfield Elementary',
      invoiceNumber: 'INV-2024-004',
      paymentMethod: 'Pending'
    },
    {
      id: 5,
      date: '2024-01-16',
      description: 'Consulting Services - District Office',
      category: 'Consulting',
      amount: 5000,
      status: 'received',
      client: 'District Office',
      invoiceNumber: 'INV-2024-005',
      paymentMethod: 'Wire Transfer'
    }
  ];

  const filteredRecords = incomeRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || record.category.toLowerCase() === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <VerticalDashboardLayout
      title="Income Management"
      subtitle="Track and manage all revenue sources"
      menuItems={menuItems}
      activeItem="/dashboard/admin/accounting/income"
    >
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Income Management</h1>
            <p className="text-gray-600">Monitor and track all revenue streams</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <PlusIcon className="h-4 w-4 inline mr-2" />
              Add Income
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <ArrowDownTrayIcon className="h-4 w-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Income Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {incomeStats.map((stat, index) => (
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

        {/* Income Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income Trend */}
          <DashboardCard title="Monthly Income Trend" value="" subtitle="Revenue growth over time">
            <ModernChart
              title="Monthly Revenue ($)"
              data={monthlyIncomeData}
              type="line"
              height={300}
            />
          </DashboardCard>

          {/* Income by Category */}
          <DashboardCard title="Income by Category" value="" subtitle="Revenue breakdown by source">
            <ModernChart
              title="Income Sources"
              data={incomeByCategory}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Filters and Search */}
        <DashboardCard title="Income Records" value="" subtitle="Detailed income transaction history">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search income records..."
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
                <option value="subscription">Subscription</option>
                <option value="assessment">Assessment</option>
                <option value="training">Training</option>
                <option value="consulting">Consulting</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="received">Received</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Income Records Table */}
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
                    Client
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
                        <div className="text-gray-500">Invoice: {record.invoiceNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {record.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${record.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
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
              <p className="text-gray-500">No income records found matching your criteria.</p>
            </div>
          )}
        </DashboardCard>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Maximize Revenue Tracking</h3>
              <p className="text-green-100">Stay on top of all income sources with detailed analytics and reporting</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm">
                Add New Income
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium text-sm border border-green-400">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
