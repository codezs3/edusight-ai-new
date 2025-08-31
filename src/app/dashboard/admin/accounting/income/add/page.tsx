'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon,
  PlusIcon,
  SaveIcon,
  XMarkIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CreditCardIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'

interface IncomeFormData {
  description: string
  amount: number
  category: string
  client: string
  date: string
  paymentMethod: string
  invoiceNumber: string
  notes: string
  status: string
}

export default function AddIncome() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<IncomeFormData>({
    description: '',
    amount: 0,
    category: 'subscription',
    client: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'bank-transfer',
    invoiceNumber: '',
    notes: '',
    status: 'received'
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate invoice number if not provided
      if (!formData.invoiceNumber) {
        const invoiceNum = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
        setFormData(prev => ({ ...prev, invoiceNumber: invoiceNum }))
      }

      console.log('Income record created:', formData)
      
      // Redirect back to income list
      router.push('/dashboard/admin/accounting/income')
    } catch (error) {
      console.error('Error creating income record:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/admin/accounting/income')
  }

  return (
    <VerticalDashboardLayout
      title="Add New Income"
      subtitle="Record new income transaction"
      menuItems={menuItems}
      activeItem="/dashboard/admin/accounting/income/add"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Income</h1>
            <p className="text-gray-600">Record a new income transaction</p>
          </div>
        </div>

        {/* Income Form */}
        <DashboardCard title="Income Details" value="" subtitle="Enter complete income information">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Monthly Subscription - Springfield Elementary"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount ($) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="subscription">Subscription</option>
                  <option value="assessment">Assessment</option>
                  <option value="training">Training</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Client */}
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <input
                  type="text"
                  id="client"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Springfield Elementary"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="razorpay">Razorpay</option>
                  <option value="stripe">Stripe</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                  <option value="wire-transfer">Wire Transfer</option>
                </select>
              </div>

              {/* Invoice Number */}
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="received">Received</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Additional notes or comments..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <XMarkIcon className="h-4 w-4 inline mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Add Income
                  </>
                )}
              </button>
            </div>
          </form>
        </DashboardCard>

        {/* Income Preview */}
        <DashboardCard title="Income Preview" value="" subtitle="Preview of the income record">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-900">{formData.description || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-green-600 font-semibold">${formData.amount.toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <p className="text-gray-900 capitalize">{formData.category}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Client:</span>
                <p className="text-gray-900">{formData.client || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p className="text-gray-900">{new Date(formData.date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Payment Method:</span>
                <p className="text-gray-900 capitalize">{formData.paymentMethod.replace('-', ' ')}</p>
              </div>
            </div>
            {formData.notes && (
              <div className="mt-4 pt-4 border-t">
                <span className="font-medium text-gray-700">Notes:</span>
                <p className="text-gray-900 mt-1">{formData.notes}</p>
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </VerticalDashboardLayout>
  )
}
