'use client'

import { useState } from 'react'
import { 
  CurrencyDollarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function AccountingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  // Sidebar Menu Items for Accounting
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
    },
    {
      title: 'Financial Reports',
      href: '/dashboard/admin/accounting/reports',
      icon: ChartBarIcon,
      children: [
        { title: 'Profit & Loss', href: '/dashboard/admin/accounting/profit-loss', icon: ChartBarIcon },
        { title: 'Cash Flow', href: '/dashboard/admin/accounting/cashflow', icon: ArrowTrendingUpIcon },
        { title: 'Budget Analysis', href: '/dashboard/admin/accounting/budget', icon: DocumentTextIcon },
        { title: 'Tax Reports', href: '/dashboard/admin/accounting/tax', icon: DocumentTextIcon }
      ]
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

  // Financial data
  const financialStats = [
    {
      title: 'Total Revenue',
      value: '$127,450',
      change: '12.5',
      changeType: 'positive' as const,
      icon: ArrowTrendingUpIcon,
      color: 'green',
      description: 'Monthly revenue'
    },
    {
      title: 'Total Expenses',
      value: '$89,230',
      change: '8.2',
      changeType: 'positive' as const,
      icon: ArrowTrendingDownIcon,
      color: 'red',
      description: 'Monthly expenses'
    },
    {
      title: 'Net Profit',
      value: '$38,220',
      change: '15.8',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'emerald',
      description: 'Monthly profit'
    },
    {
      title: 'Outstanding Invoices',
      value: '$23,500',
      change: '5.2',
      changeType: 'negative' as const,
      icon: DocumentTextIcon,
      color: 'orange',
      description: 'Pending payments'
    }
  ];

  // Monthly revenue data
  const revenueData = [
    { label: 'Jan', value: 105000 },
    { label: 'Feb', value: 118000 },
    { label: 'Mar', value: 112000 },
    { label: 'Apr', value: 125000 },
    { label: 'May', value: 119000 },
    { label: 'Jun', value: 127450 }
  ];

  // Expense breakdown data
  const expenseData = [
    { label: 'Staff Salaries', value: 45000 },
    { label: 'Technology', value: 15000 },
    { label: 'Marketing', value: 12000 },
    { label: 'Operations', value: 10000 },
    { label: 'Rent & Utilities', value: 7230 }
  ];

  // Profit vs Expense comparison
  const profitExpenseData = [
    { label: 'Jan', revenue: 105000, expenses: 78000 },
    { label: 'Feb', revenue: 118000, expenses: 82000 },
    { label: 'Mar', revenue: 112000, expenses: 79000 },
    { label: 'Apr', revenue: 125000, expenses: 85000 },
    { label: 'May', revenue: 119000, expenses: 81000 },
    { label: 'Jun', revenue: 127450, expenses: 89230 }
  ];

  // Recent transactions
  const recentTransactions = [
    {
      id: 1,
      type: 'income',
      description: 'Subscription Payment - Springfield Elementary',
      amount: 2500,
      date: '2024-01-20',
      category: 'Subscription',
      status: 'completed'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Staff Salary - Development Team',
      amount: 15000,
      date: '2024-01-20',
      category: 'Salary',
      status: 'completed'
    },
    {
      id: 3,
      type: 'income',
      description: 'Assessment Fee - Riverside Academy',
      amount: 1800,
      date: '2024-01-19',
      category: 'Assessment',
      status: 'completed'
    },
    {
      id: 4,
      type: 'expense',
      description: 'AWS Cloud Services',
      amount: 850,
      date: '2024-01-19',
      category: 'Technology',
      status: 'completed'
    },
    {
      id: 5,
      type: 'expense',
      description: 'Office Rent - January',
      amount: 3500,
      date: '2024-01-18',
      category: 'Operations',
      status: 'completed'
    }
  ];

  return (
    <VerticalDashboardLayout
      title="Financial Management"
      subtitle="Comprehensive accounting and financial tracking system"
      menuItems={menuItems}
      activeItem="/dashboard/admin/accounting"
    >
      <div className="space-y-6">
        {/* Period Selector */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounting Dashboard</h1>
            <p className="text-gray-600">Track income, expenses, and financial performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
            </select>
            <button 
              onClick={() => setShowIncomeModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <PlusIcon className="h-4 w-4 inline mr-2" />
              Add Income
            </button>
            <button 
              onClick={() => setShowExpenseModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <PlusIcon className="h-4 w-4 inline mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialStats.map((stat, index) => (
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

        {/* Revenue and Expense Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <DashboardCard title="Revenue Trend" value="" subtitle="Monthly revenue over time">
            <ModernChart
              title="Monthly Revenue ($)"
              data={revenueData}
              type="line"
              height={300}
            />
          </DashboardCard>

          {/* Expense Breakdown */}
          <DashboardCard title="Expense Breakdown" value="" subtitle="Current month expenses by category">
            <ModernChart
              title="Expense Categories"
              data={expenseData}
              type="donut"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Profit vs Expenses Comparison */}
        <DashboardCard title="Profit & Loss Overview" value="" subtitle="Revenue vs expenses comparison">
          <div className="h-80">
            <ModernChart
              title="Revenue vs Expenses"
              data={profitExpenseData.map(item => ({ 
                label: item.label, 
                revenue: item.revenue, 
                expenses: item.expenses 
              }))}
              type="bar"
              height={320}
            />
          </div>
        </DashboardCard>

        {/* Recent Transactions and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <DashboardCard title="Recent Transactions" value="" subtitle="Latest financial activities">
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowTrendingUpIcon className="h-4 w-4" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <button className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All Transactions
                </button>
              </div>
            </DashboardCard>
          </div>

          {/* Quick Financial Actions */}
          <DashboardCard title="Quick Actions" value="" subtitle="Financial management shortcuts">
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-900">Record Income</p>
                  <p className="text-xs text-green-600">Add revenue entry</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                <ArrowTrendingDownIcon className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-900">Record Expense</p>
                  <p className="text-xs text-red-600">Add expense entry</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Generate Invoice</p>
                  <p className="text-xs text-blue-600">Create new invoice</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <ChartBarIcon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Financial Reports</p>
                  <p className="text-xs text-purple-600">View detailed reports</p>
                </div>
              </button>
              <button className="w-full flex items-center p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <ArrowDownTrayIcon className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Export Data</p>
                  <p className="text-xs text-orange-600">Download CSV/PDF</p>
                </div>
              </button>
            </div>
          </DashboardCard>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Summary */}
          <DashboardCard 
            title="Monthly Summary" 
            value="" 
            subtitle="" 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="text-lg font-semibold text-green-600">$127,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Expenses</span>
                <span className="text-lg font-semibold text-red-600">$89,230</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Net Profit</span>
                  <span className="text-xl font-bold text-blue-600">$38,220</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Cash Flow Status */}
          <DashboardCard 
            title="Cash Flow Status" 
            value="" 
            subtitle="" 
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Inflow</span>
                <span className="text-lg font-semibold text-green-600">$142,300</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Outflow</span>
                <span className="text-lg font-semibold text-red-600">$96,180</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Net Cash Flow</span>
                  <span className="text-xl font-bold text-green-600">+$46,120</span>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Accounts Receivable */}
          <DashboardCard 
            title="Accounts Receivable" 
            value="" 
            subtitle="" 
            className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Outstanding</span>
                <span className="text-lg font-semibold text-orange-600">$23,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overdue</span>
                <span className="text-lg font-semibold text-red-600">$7,200</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Collection Rate</span>
                  <span className="text-xl font-bold text-orange-600">89.2%</span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Call to Action Panel */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Complete Financial Control</h3>
              <p className="text-green-100">Track every penny with comprehensive income and expense management</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm">
                View P&L Report
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors font-medium text-sm border border-green-400">
                Export Financial Data
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium text-sm border border-blue-400">
                Generate Tax Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
