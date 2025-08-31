'use client'

import { useState } from 'react'
import { 
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function InvoicingManagement() {
  const [searchTerm, setSearchTerm] = useState('')
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
      title: 'Invoicing',
      href: '/dashboard/admin/accounting/invoicing',
      icon: DocumentTextIcon,
      children: [
        { title: 'Create Invoice', href: '/dashboard/admin/accounting/invoices/create', icon: PlusIcon },
        { title: 'Pending Invoices', href: '/dashboard/admin/accounting/invoices/pending', icon: ClockIcon, badge: '23' },
        { title: 'Paid Invoices', href: '/dashboard/admin/accounting/invoices/paid', icon: CheckCircleIcon },
        { title: 'Overdue Invoices', href: '/dashboard/admin/accounting/invoices/overdue', icon: ExclamationTriangleIcon, badge: '7' }
      ]
    }
  ];

  // Invoice statistics
  const invoiceStats = [
    {
      title: 'Total Invoices',
      value: '156',
      change: '12',
      changeType: 'positive' as const,
      icon: DocumentTextIcon,
      color: 'blue',
      description: 'This month'
    },
    {
      title: 'Pending Payment',
      value: '$23,500',
      change: '5.2',
      changeType: 'negative' as const,
      icon: ClockIcon,
      color: 'orange',
      description: 'Outstanding amount'
    },
    {
      title: 'Paid Invoices',
      value: '$89,300',
      change: '8.7',
      changeType: 'positive' as const,
      icon: CheckCircleIcon,
      color: 'green',
      description: 'Collected this month'
    },
    {
      title: 'Overdue Amount',
      value: '$7,200',
      change: '2.1',
      changeType: 'negative' as const,
      icon: ExclamationTriangleIcon,
      color: 'red',
      description: 'Past due invoices'
    }
  ];

  // Invoice data
  const invoices = [
    {
      id: 'INV-2024-001',
      clientName: 'Springfield Elementary',
      amount: 2500,
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'paid',
      description: 'Monthly Subscription - January 2024',
      paymentDate: '2024-01-20'
    },
    {
      id: 'INV-2024-002',
      clientName: 'Riverside Academy',
      amount: 1800,
      issueDate: '2024-01-18',
      dueDate: '2024-02-18',
      status: 'pending',
      description: 'E360 Assessment Package',
      paymentDate: null
    },
    {
      id: 'INV-2024-003',
      clientName: 'Greenwood High School',
      amount: 15000,
      issueDate: '2024-01-10',
      dueDate: '2024-02-10',
      status: 'paid',
      description: 'Annual Subscription',
      paymentDate: '2024-01-25'
    },
    {
      id: 'INV-2024-004',
      clientName: 'Northfield Elementary',
      amount: 3500,
      issueDate: '2024-01-12',
      dueDate: '2024-02-12',
      status: 'overdue',
      description: 'Training Workshop Package',
      paymentDate: null
    },
    {
      id: 'INV-2024-005',
      clientName: 'District Office',
      amount: 5000,
      issueDate: '2024-01-08',
      dueDate: '2024-02-08',
      status: 'paid',
      description: 'Consulting Services',
      paymentDate: '2024-01-30'
    },
    {
      id: 'INV-2024-006',
      clientName: 'Oakwood Middle School',
      amount: 2200,
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      status: 'pending',
      description: 'Monthly Subscription',
      paymentDate: null
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  // Invoice status distribution
  const invoiceStatusData = [
    { label: 'Paid', value: 89 },
    { label: 'Pending', value: 23 },
    { label: 'Overdue', value: 7 },
    { label: 'Draft', value: 5 }
  ];

  return (
    <VerticalDashboardLayout
      title="Invoice Management"
      subtitle="Create, track, and manage invoices"
      menuItems={menuItems}
      activeItem="/dashboard/admin/accounting/invoicing"
    >
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
            <p className="text-gray-600">Create and track client invoices</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <PlusIcon className="h-4 w-4 inline mr-2" />
              Create Invoice
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <ArrowDownTrayIcon className="h-4 w-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Invoice Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {invoiceStats.map((stat, index) => (
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

        {/* Invoice Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Status Distribution */}
          <DashboardCard title="Invoice Status Distribution" value="" subtitle="Breakdown by payment status">
            <ModernChart
              title="Invoice Status"
              data={invoiceStatusData}
              type="donut"
              height={300}
            />
          </DashboardCard>

          {/* Collection Performance */}
          <DashboardCard title="Collection Performance" value="" subtitle="Payment collection metrics">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">89.2%</div>
                <p className="text-gray-600">Collection Rate</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">15 days</div>
                  <p className="text-xs text-green-600">Avg. Payment Time</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-semibold text-orange-600">$2,890</div>
                  <p className="text-xs text-orange-600">Avg. Invoice Value</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Invoice List */}
        <DashboardCard title="Invoice List" value="" subtitle="All invoices and their current status">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{invoice.clientName}</div>
                        <div className="text-gray-500">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900" title="Print">
                          <PrinterIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Download">
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No invoices found matching your criteria.</p>
            </div>
          )}
        </DashboardCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <PlusIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Create Invoice</h3>
            <p className="text-xs text-gray-600 mt-1">Generate new invoice</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <EnvelopeIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Send Reminders</h3>
            <p className="text-xs text-gray-600 mt-1">Email payment reminders</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <ArrowDownTrayIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Export Reports</h3>
            <p className="text-xs text-gray-600 mt-1">Download invoice reports</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
            <CalendarIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Schedule Invoice</h3>
            <p className="text-xs text-gray-600 mt-1">Set up recurring invoices</p>
          </button>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Streamline Your Billing Process</h3>
              <p className="text-blue-100">Create professional invoices and track payments efficiently</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                Create Invoice
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium text-sm border border-blue-400">
                View Templates
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
