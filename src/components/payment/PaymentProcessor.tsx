'use client'

import { useState } from 'react'
import { 
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface PaymentProcessorProps {
  amount: number
  currency: string
  description: string
  customerEmail?: string
  onSuccess: (paymentResult: any) => void
  onError: (error: string) => void
  onCancel: () => void
}

interface PaymentMethod {
  id: string
  name: string
  icon: any
  gateway: 'razorpay' | 'stripe'
  type: string
  enabled: boolean
}

export default function PaymentProcessor({
  amount,
  currency,
  description,
  customerEmail,
  onSuccess,
  onError,
  onCancel
}: PaymentProcessorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState<'select' | 'process' | 'success' | 'error'>('select')

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'razorpay-card',
      name: 'Credit/Debit Card (Razorpay)',
      icon: CreditCardIcon,
      gateway: 'razorpay',
      type: 'card',
      enabled: true
    },
    {
      id: 'razorpay-upi',
      name: 'UPI (Razorpay)',
      icon: DevicePhoneMobileIcon,
      gateway: 'razorpay',
      type: 'upi',
      enabled: true
    },
    {
      id: 'razorpay-netbanking',
      name: 'Net Banking (Razorpay)',
      icon: BanknotesIcon,
      gateway: 'razorpay',
      type: 'netbanking',
      enabled: true
    },
    {
      id: 'stripe-card',
      name: 'Credit/Debit Card (Stripe)',
      icon: CreditCardIcon,
      gateway: 'stripe',
      type: 'card',
      enabled: true
    },
    {
      id: 'stripe-bank',
      name: 'Bank Transfer (Stripe)',
      icon: BanknotesIcon,
      gateway: 'stripe',
      type: 'bank_transfer',
      enabled: true
    }
  ]

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })
    return formatter.format(amount)
  }

  const processPayment = async () => {
    if (!selectedMethod) return

    setProcessing(true)
    setStep('process')

    try {
      const method = paymentMethods.find(m => m.id === selectedMethod)
      if (!method) throw new Error('Invalid payment method')

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock payment result
      const paymentResult = {
        id: `pay_${Date.now()}`,
        gateway: method.gateway,
        method: method.type,
        amount: amount,
        currency: currency,
        status: 'success',
        transactionId: `txn_${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toISOString()
      }

      setStep('success')
      onSuccess(paymentResult)
    } catch (error) {
      setStep('error')
      onError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  const renderSelectMethod = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Payment Method</h3>
        <p className="text-gray-600">Choose your preferred payment method</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatAmount(amount, currency)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-600">Description:</span>
          <span className="text-sm text-gray-900">{description}</span>
        </div>
        {customerEmail && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm text-gray-900">{customerEmail}</span>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentMethods.filter(method => method.enabled).map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="sr-only"
            />
            <method.icon className="h-6 w-6 text-gray-600 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{method.name}</p>
              <p className="text-sm text-gray-600 capitalize">
                {method.gateway} • {method.type.replace('_', ' ')}
              </p>
            </div>
            {selectedMethod === method.id && (
              <CheckCircleIcon className="h-5 w-5 text-blue-500" />
            )}
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={processPayment}
          disabled={!selectedMethod || processing}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Pay {formatAmount(amount, currency)}
        </button>
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="space-y-6 text-center">
      <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
        <p className="text-gray-600">Please wait while we process your payment...</p>
        <p className="text-sm text-gray-500 mt-2">
          Amount: {formatAmount(amount, currency)}
        </p>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircleIcon className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Your payment has been processed successfully.</p>
        <p className="text-sm text-gray-500 mt-2">
          Amount: {formatAmount(amount, currency)}
        </p>
      </div>
      <button
        onClick={() => setStep('select')}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Close
      </button>
    </div>
  )

  const renderError = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Payment Failed</h3>
        <p className="text-gray-600">There was an error processing your payment.</p>
        <p className="text-sm text-gray-500 mt-2">Please try again or use a different payment method.</p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={() => setStep('select')}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      {step === 'select' && renderSelectMethod()}
      {step === 'process' && renderProcessing()}
      {step === 'success' && renderSuccess()}
      {step === 'error' && renderError()}
    </div>
  )
}
