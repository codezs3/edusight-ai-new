'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeftIcon,
  PencilIcon,
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
  id: string
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

export default function EditIncome() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<IncomeFormData>({
    id: '',
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
        { title: 'Assessment Fees', href: '/dashboard/admin/accounting/assessments', icon: AcademicCapIcon }
      ]
    }
  ];

  // Mock data for demonstration
  const mockIncomeData = {
    '1': {
      id: '1',
      description: 'Monthly Subscription - Springfield Elementary',
      amount: 2500,
      category: 'subscription',
      client: 'Springfield Elementary',
      date: '2024-01-20',
      paymentMethod: 'bank-transfer',
      invoiceNumber: 'INV-2024-001',
      notes: 'Regular monthly subscription payment',
      status: 'received'
    },
    '2': {
      id: '2',
      description: 'E360 Assessment Package - Riverside Academy',
      amount: 1800,
      category: 'assessment',
      client: 'Riverside Academy',
      date: '2024-01-19',
      paymentMethod: 'credit-card',
      invoiceNumber: 'INV-2024-002',
      notes: 'One-time assessment package',
      status: 'received'
    }
  }

  useEffect(() => {
    const loadIncomeData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const incomeId = params.id as string
        const mockData = mockIncomeData[incomeId as keyof typeof mockIncomeData]
        
        if (mockData) {
          setFormData(mockData)
        } else {
          // Handle not found
          router.push('/dashboard/admin/accounting/income')
        }
      } catch (error) {
        console.error('Error loading income data:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadIncomeData()
  }, [params.id, router])

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
      
      console.log('Income record updated:', formData)
      
      // Redirect back to income list
      router.push('/dashboard/admin/accounting/income')
    } catch (error) {
      console.error('Error updating income record:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/admin/accounting/income')
  }

  if (initialLoading) {
    return (
      <VerticalDashboardLayout
        title="Edit Income"
        subtitle="Loading income data..."
        menuItems={menuItems}
        activeItem="/dashboard/admin/accounting/income"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </VerticalDashboardLayout>
    )
  }

  return (
    <VerticalDashboardLayout
      title="Edit Income"
      subtitle="Modify income transaction details"
      menuItems={menuItems}
      activeItem="/dashboard/admin/accounting/income"
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Income Record</h1>
            <p className="text-gray-600">Modify income transaction: {formData.invoiceNumber}</p>
          </div>
        </div>

        {/* Income Form */}
        <DashboardCard title="Income Details" value="" subtitle="Update income information">
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full inline mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <PencilIcon className="h-4 w-4 inline mr-2" />
                    Update Income
                  </>
                )}
              </button>
            </div>
          </form>
        </DashboardCard>

        {/* Change History */}
        <DashboardCard title="Change History" value="" subtitle="Track of modifications">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Record Created</p>
                <p className="text-xs text-gray-500">Original income record created</p>
              </div>
              <span className="text-xs text-gray-500">{new Date(formData.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Currently Editing</p>
                <p className="text-xs text-blue-600">Making changes to this record</p>
              </div>
              <span className="text-xs text-blue-600">Now</span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </VerticalDashboardLayout>
  )
}
