// Payment Gateway Configuration

export interface PaymentConfig {
  razorpay: {
    keyId: string
    keySecret: string
    webhook_secret: string
    enabled: boolean
  }
  stripe: {
    publishableKey: string
    secretKey: string
    webhookSecret: string
    enabled: boolean
  }
}

export const defaultPaymentConfig: PaymentConfig = {
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    enabled: false
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    enabled: false
  }
}

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
]

export const PAYMENT_METHODS = {
  razorpay: [
    'card',
    'netbanking',
    'wallet',
    'upi',
    'emi',
    'paylater'
  ],
  stripe: [
    'card',
    'bank_transfer',
    'ideal',
    'sofort',
    'giropay',
    'bancontact'
  ]
}

export const WEBHOOK_EVENTS = {
  razorpay: [
    'payment.authorized',
    'payment.captured',
    'payment.failed',
    'order.paid',
    'refund.created',
    'subscription.charged'
  ],
  stripe: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'charge.succeeded',
    'charge.failed',
    'invoice.payment_succeeded',
    'customer.subscription.created'
  ]
}
