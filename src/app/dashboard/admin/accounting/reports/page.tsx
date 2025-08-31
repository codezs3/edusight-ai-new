'use client'

import { useState } from 'react'
import { 
  ChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  HomeIcon,
  PrinterIcon,
  ShareIcon,
  EyeIcon,
  PresentationChartLineIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import StatCard from '@/components/dashboard/StatCard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ModernChart from '@/components/dashboard/ModernChart'

export default function FinancialReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')
  const [selectedReport, setSelectedReport] = useState('profitLoss')

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
      title: 'Financial Reports',
      href: '/dashboard/admin/accounting/reports',
      icon: ChartBarIcon,
      children: [
        { title: 'Profit & Loss', href: '/dashboard/admin/accounting/profit-loss', icon: ChartBarIcon },
        { title: 'Cash Flow', href: '/dashboard/admin/accounting/cashflow', icon: ArrowTrendingUpIcon },
        { title: 'Budget Analysis', href: '/dashboard/admin/accounting/budget', icon: DocumentTextIcon },
        { title: 'Tax Reports', href: '/dashboard/admin/accounting/tax', icon: ClipboardDocumentCheckIcon }
      ]
    }
  ];

  // Financial summary data
  const financialSummary = [
    {
      title: 'Total Revenue',
      value: '$127,450',
      change: '12.5',
      changeType: 'positive' as const,
      icon: ArrowTrendingUpIcon,
      color: 'green',
      description: 'This month'
    },
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
      title: 'Net Profit',
      value: '$38,220',
      change: '15.8',
      changeType: 'positive' as const,
      icon: BanknotesIcon,
      color: 'emerald',
      description: 'This month'
    },
    {
      title: 'Profit Margin',
      value: '30.0%',
      change: '2.3',
      changeType: 'positive' as const,
      icon: PresentationChartLineIcon,
      color: 'blue',
      description: 'This month'
    }
  ];

  // Profit & Loss data for the past 6 months
  const profitLossData = [
    { 
      month: 'January',
      revenue: 105000,
      expenses: 78000,
      profit: 27000,
      margin: 25.7
    },
    { 
      month: 'February',
      revenue: 118000,
      expenses: 82000,
      profit: 36000,
      margin: 30.5
    },
    { 
      month: 'March',
      revenue: 112000,
      expenses: 79000,
      profit: 33000,
      margin: 29.5
    },
    { 
      month: 'April',
      revenue: 125000,
      expenses: 85000,
      profit: 40000,
      margin: 32.0
    },
    { 
      month: 'May',
      revenue: 119000,
      expenses: 81000,
      profit: 38000,
      margin: 31.9
    },
    { 
      month: 'June',
      revenue: 127450,
      expenses: 89230,
      profit: 38220,
      margin: 30.0
    }
  ];

  // Cash flow data
  const cashFlowData = [
    { label: 'Jan', inflow: 105000, outflow: 78000 },
    { label: 'Feb', inflow: 118000, outflow: 82000 },
    { label: 'Mar', inflow: 112000, outflow: 79000 },
    { label: 'Apr', inflow: 125000, outflow: 85000 },
    { label: 'May', inflow: 119000, outflow: 81000 },
    { label: 'Jun', inflow: 127450, outflow: 89230 }
  ];

  // Revenue breakdown by source
  const revenueBreakdown = [
    { label: 'Subscriptions', value: 89300, percentage: 70.0 },
    { label: 'Assessment Fees', value: 28150, percentage: 22.1 },
    { label: 'Training Programs', value: 6500, percentage: 5.1 },
    { label: 'Consulting', value: 2500, percentage: 2.0 },
    { label: 'Other', value: 1000, percentage: 0.8 }
  ];

  // Expense breakdown by category
  const expenseBreakdown = [
    { label: 'Staff Salaries', value: 45000, percentage: 50.4 },
    { label: 'Operations', value: 22430, percentage: 25.1 },
    { label: 'Technology', value: 15800, percentage: 17.7 },
    { label: 'Marketing', value: 4000, percentage: 4.5 },
    { label: 'Other', value: 2000, percentage: 2.2 }
  ];

  const generateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report for ${selectedPeriod}`);
    // Implement report generation logic
  };

  return (
    <VerticalDashboardLayout
      title="Financial Reports"
      subtitle="Comprehensive financial analysis and reporting"
      menuItems={menuItems}
      activeItem="/dashboard/admin/accounting/reports"
    >
      <div className="space-y-6">
        {/* Header with Report Controls */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-gray-600">Detailed financial analysis and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <ArrowDownTrayIcon className="h-4 w-4 inline mr-2" />
              Export PDF
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <PrinterIcon className="h-4 w-4 inline mr-2" />
              Print
            </button>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialSummary.map((stat, index) => (
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

        {/* Profit & Loss Statement */}
        <DashboardCard title="Profit & Loss Statement" value="" subtitle="Detailed income and expense breakdown">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profitLossData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${item.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                      ${item.expenses.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                      ${item.profit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.margin}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* Cash Flow Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cash Flow Chart */}
          <DashboardCard title="Cash Flow Analysis" value="" subtitle="Monthly cash inflow vs outflow">
            <ModernChart
              title="Cash Flow ($)"
              data={cashFlowData.map(item => ({ 
                label: item.label, 
                inflow: item.inflow, 
                outflow: item.outflow 
              }))}
              type="bar"
              height={300}
            />
          </DashboardCard>

          {/* Profit Trend */}
          <DashboardCard title="Profit Trend" value="" subtitle="Net profit over time">
            <ModernChart
              title="Net Profit ($)"
              data={profitLossData.map(item => ({ 
                label: item.month.substring(0, 3), 
                value: item.profit 
              }))}
              type="line"
              height={300}
            />
          </DashboardCard>
        </div>

        {/* Revenue and Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Breakdown */}
          <DashboardCard title="Revenue Breakdown" value="" subtitle="Income sources analysis">
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-green-600">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Expense Breakdown */}
          <DashboardCard title="Expense Breakdown" value="" subtitle="Cost categories analysis">
            <div className="space-y-4">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold text-red-600">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Report Actions */}
        <DashboardCard title="Generate Custom Reports" value="" subtitle="Create detailed financial reports">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => generateReport('profit-loss')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Profit & Loss</h3>
              <p className="text-xs text-gray-600 mt-1">Detailed P&L statement</p>
            </button>
            
            <button 
              onClick={() => generateReport('cash-flow')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Cash Flow</h3>
              <p className="text-xs text-gray-600 mt-1">Cash flow analysis</p>
            </button>
            
            <button 
              onClick={() => generateReport('balance-sheet')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Balance Sheet</h3>
              <p className="text-xs text-gray-600 mt-1">Assets & liabilities</p>
            </button>
            
            <button 
              onClick={() => generateReport('tax-summary')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Tax Summary</h3>
              <p className="text-xs text-gray-600 mt-1">Tax preparation report</p>
            </button>
          </div>
        </DashboardCard>

        {/* Financial Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            title="Financial Health Score" 
            value="" 
            subtitle="" 
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">87/100</div>
              <p className="text-sm text-green-700">Excellent Financial Health</p>
              <div className="mt-4 w-full bg-green-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Revenue Growth Rate" 
            value="" 
            subtitle="" 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">+12.5%</div>
              <p className="text-sm text-blue-700">Month-over-Month</p>
              <div className="mt-4 flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-sm text-blue-600">Strong Growth</span>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Expense Ratio" 
            value="" 
            subtitle="" 
            className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">70%</div>
              <p className="text-sm text-orange-700">Expenses to Revenue</p>
              <div className="mt-4 w-full bg-orange-200 rounded-full h-3">
                <div className="bg-orange-600 h-3 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Comprehensive Financial Insights</h3>
              <p className="text-blue-100">Make informed decisions with detailed financial reports and analysis</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                Download Reports
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium text-sm border border-blue-400">
                Schedule Reports
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors font-medium text-sm border border-purple-400">
                Share with Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
