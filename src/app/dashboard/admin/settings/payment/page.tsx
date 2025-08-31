'use client'

import { useState } from 'react'
import { 
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeIcon,
  BanknotesIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import VerticalDashboardLayout from '@/components/dashboard/VerticalDashboardLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'
import StatCard from '@/components/dashboard/StatCard'

interface PaymentSettings {
  razorpay: {
    enabled: boolean
    keyId: string
    keySecret: string
    webhookSecret: string
    testMode: boolean
  }
  stripe: {
    enabled: boolean
    publishableKey: string
    secretKey: string
    webhookSecret: string
    testMode: boolean
  }
  general: {
    defaultCurrency: string
    allowedCurrencies: string[]
    minimumAmount: number
    maximumAmount: number
    autoCapture: boolean
    webhookRetries: number
  }
}

export default function PaymentSettings() {
  const [loading, setLoading] = useState(false)
  const [showSecrets, setShowSecrets] = useState({
    razorpaySecret: false,
    razorpayWebhook: false,
    stripeSecret: false,
    stripeWebhook: false
  })

  const [settings, setSettings] = useState<PaymentSettings>({
    razorpay: {
      enabled: true,
      keyId: 'rzp_test_xxxxxxxxxx',
      keySecret: 'xxxxxxxxxxxxxxxxxxxx',
      webhookSecret: 'whsec_xxxxxxxxxxxxxxxx',
      testMode: true
    },
    stripe: {
      enabled: true,
      publishableKey: 'pk_test_xxxxxxxxxxxxxxxxx',
      secretKey: 'sk_test_xxxxxxxxxxxxxxxxx',
      webhookSecret: 'whsec_xxxxxxxxxxxxxxxx',
      testMode: true
    },
    general: {
      defaultCurrency: 'USD',
      allowedCurrencies: ['USD', 'INR', 'EUR', 'GBP'],
      minimumAmount: 1,
      maximumAmount: 100000,
      autoCapture: true,
      webhookRetries: 3
    }
  })

  // Sidebar Menu Items
  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/admin',
      icon: HomeIcon
    },
    {
      title: 'Payment Settings',
      href: '/dashboard/admin/settings/payment',
      icon: CreditCardIcon,
      children: [
        { title: 'Payment Gateways', href: '/dashboard/admin/settings/payment', icon: CreditCardIcon },
        { title: 'Transaction Logs', href: '/dashboard/admin/settings/payment/logs', icon: BanknotesIcon },
        { title: 'Webhook Events', href: '/dashboard/admin/settings/payment/webhooks', icon: GlobeAltIcon }
      ]
    }
  ];

  const handleInputChange = (section: keyof PaymentSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Payment settings updated:', settings)
      
      // Show success message
      alert('Payment settings updated successfully!')
    } catch (error) {
      console.error('Error updating payment settings:', error)
      alert('Failed to update payment settings')
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async (gateway: 'razorpay' | 'stripe') => {
    try {
      setLoading(true)
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`${gateway} connection test successful!`)
    } catch (error) {
      alert(`${gateway} connection test failed!`)
    } finally {
      setLoading(false)
    }
  }

  const toggleSecretVisibility = (field: keyof typeof showSecrets) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const paymentStats = [
    {
      title: 'Razorpay Status',
      value: settings.razorpay.enabled ? 'Active' : 'Inactive',
      change: '',
      changeType: 'neutral' as const,
      icon: CheckCircleIcon,
      color: settings.razorpay.enabled ? 'green' : 'red',
      description: settings.razorpay.testMode ? 'Test Mode' : 'Live Mode'
    },
    {
      title: 'Stripe Status',
      value: settings.stripe.enabled ? 'Active' : 'Inactive',
      change: '',
      changeType: 'neutral' as const,
      icon: CheckCircleIcon,
      color: settings.stripe.enabled ? 'green' : 'red',
      description: settings.stripe.testMode ? 'Test Mode' : 'Live Mode'
    },
    {
      title: 'Default Currency',
      value: settings.general.defaultCurrency,
      change: '',
      changeType: 'neutral' as const,
      icon: BanknotesIcon,
      color: 'blue',
      description: `${settings.general.allowedCurrencies.length} currencies supported`
    },
    {
      title: 'Auto Capture',
      value: settings.general.autoCapture ? 'Enabled' : 'Disabled',
      change: '',
      changeType: 'neutral' as const,
      icon: CogIcon,
      color: settings.general.autoCapture ? 'green' : 'orange',
      description: 'Automatic payment capture'
    }
  ];

  const currencyOptions = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ]

  return (
    <VerticalDashboardLayout
      title="Payment Gateway Settings"
      subtitle="Configure Razorpay and Stripe integration"
      menuItems={menuItems}
      activeItem="/dashboard/admin/settings/payment"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Gateway Settings</h1>
            <p className="text-gray-600">Configure payment processing and gateway integrations</p>
          </div>
        </div>

        {/* Payment Gateway Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentStats.map((stat, index) => (
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Razorpay Settings */}
          <DashboardCard title="Razorpay Configuration" value="" subtitle="Configure Razorpay payment gateway">
            <div className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Enable Razorpay</h3>
                  <p className="text-sm text-gray-600">Accept payments through Razorpay gateway</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.razorpay.enabled}
                    onChange={(e) => handleInputChange('razorpay', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {settings.razorpay.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Key ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key ID *
                    </label>
                    <input
                      type="text"
                      value={settings.razorpay.keyId}
                      onChange={(e) => handleInputChange('razorpay', 'keyId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="rzp_test_xxxxxxxxxx"
                    />
                  </div>

                  {/* Key Secret */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Secret *
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.razorpaySecret ? 'text' : 'password'}
                        value={settings.razorpay.keySecret}
                        onChange={(e) => handleInputChange('razorpay', 'keySecret', e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="xxxxxxxxxxxxxxxxxxxx"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecretVisibility('razorpaySecret')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showSecrets.razorpaySecret ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Webhook Secret */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.razorpayWebhook ? 'text' : 'password'}
                        value={settings.razorpay.webhookSecret}
                        onChange={(e) => handleInputChange('razorpay', 'webhookSecret', e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="whsec_xxxxxxxxxxxxxxxx"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecretVisibility('razorpayWebhook')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showSecrets.razorpayWebhook ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Test Mode */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="razorpay-test-mode"
                      checked={settings.razorpay.testMode}
                      onChange={(e) => handleInputChange('razorpay', 'testMode', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="razorpay-test-mode" className="ml-2 text-sm text-gray-700">
                      Enable Test Mode
                    </label>
                  </div>
                </div>
              )}

              {settings.razorpay.enabled && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => testConnection('razorpay')}
                    disabled={loading}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Test Razorpay Connection
                  </button>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* Stripe Settings */}
          <DashboardCard title="Stripe Configuration" value="" subtitle="Configure Stripe payment gateway">
            <div className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Enable Stripe</h3>
                  <p className="text-sm text-gray-600">Accept payments through Stripe gateway</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.stripe.enabled}
                    onChange={(e) => handleInputChange('stripe', 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {settings.stripe.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Publishable Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publishable Key *
                    </label>
                    <input
                      type="text"
                      value={settings.stripe.publishableKey}
                      onChange={(e) => handleInputChange('stripe', 'publishableKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="pk_test_xxxxxxxxxxxxxxxxx"
                    />
                  </div>

                  {/* Secret Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.stripeSecret ? 'text' : 'password'}
                        value={settings.stripe.secretKey}
                        onChange={(e) => handleInputChange('stripe', 'secretKey', e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="sk_test_xxxxxxxxxxxxxxxxx"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecretVisibility('stripeSecret')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showSecrets.stripeSecret ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Webhook Secret */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.stripeWebhook ? 'text' : 'password'}
                        value={settings.stripe.webhookSecret}
                        onChange={(e) => handleInputChange('stripe', 'webhookSecret', e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="whsec_xxxxxxxxxxxxxxxx"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecretVisibility('stripeWebhook')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showSecrets.stripeWebhook ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Test Mode */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stripe-test-mode"
                      checked={settings.stripe.testMode}
                      onChange={(e) => handleInputChange('stripe', 'testMode', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="stripe-test-mode" className="ml-2 text-sm text-gray-700">
                      Enable Test Mode
                    </label>
                  </div>
                </div>
              )}

              {settings.stripe.enabled && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => testConnection('stripe')}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Test Stripe Connection
                  </button>
                </div>
              )}
            </div>
          </DashboardCard>

          {/* General Settings */}
          <DashboardCard title="General Payment Settings" value="" subtitle="Global payment configuration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Default Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Currency *
                </label>
                <select
                  value={settings.general.defaultCurrency}
                  onChange={(e) => handleInputChange('general', 'defaultCurrency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencyOptions.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Minimum Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Amount
                </label>
                <input
                  type="number"
                  value={settings.general.minimumAmount}
                  onChange={(e) => handleInputChange('general', 'minimumAmount', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Maximum Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Amount
                </label>
                <input
                  type="number"
                  value={settings.general.maximumAmount}
                  onChange={(e) => handleInputChange('general', 'maximumAmount', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Webhook Retries */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Retries
                </label>
                <input
                  type="number"
                  value={settings.general.webhookRetries}
                  onChange={(e) => handleInputChange('general', 'webhookRetries', parseInt(e.target.value))}
                  min="0"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Auto Capture */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-capture"
                    checked={settings.general.autoCapture}
                    onChange={(e) => handleInputChange('general', 'autoCapture', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-capture" className="ml-2 text-sm text-gray-700">
                    Auto-capture payments (Automatically capture authorized payments)
                  </label>
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Save Button */}
          <div className="flex justify-end">
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
                'Save Payment Settings'
              )}
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Never share your API keys or webhook secrets publicly</li>
                  <li>Use test mode for development and testing</li>
                  <li>Regularly rotate your API keys for security</li>
                  <li>Monitor webhook delivery and retry failures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VerticalDashboardLayout>
  )
}
