import { defaultPaymentConfig } from './config'

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export interface RazorpayPayment {
  id: string
  order_id: string
  amount: number
  currency: string
  status: string
  method: string
  captured: boolean
  created_at: number
  email?: string
  contact?: string
  description?: string
}

export class RazorpayService {
  private keyId: string
  private keySecret: string
  private enabled: boolean

  constructor() {
    this.keyId = defaultPaymentConfig.razorpay.keyId
    this.keySecret = defaultPaymentConfig.razorpay.keySecret
    this.enabled = defaultPaymentConfig.razorpay.enabled
  }

  // Create Order
  async createOrder(params: {
    amount: number // in smallest currency unit (paise for INR)
    currency?: string
    receipt: string
    notes?: Record<string, string>
  }): Promise<RazorpayOrder> {
    if (!this.enabled) {
      throw new Error('Razorpay is not enabled')
    }

    try {
      // Mock implementation - replace with actual Razorpay API call
      const order: RazorpayOrder = {
        id: `order_${Date.now()}`,
        amount: params.amount,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        status: 'created',
        created_at: Date.now()
      }

      console.log('Razorpay Order Created:', order)
      return order
    } catch (error) {
      console.error('Razorpay Order Creation Failed:', error)
      throw new Error('Failed to create Razorpay order')
    }
  }

  // Capture Payment
  async capturePayment(paymentId: string, amount: number): Promise<RazorpayPayment> {
    if (!this.enabled) {
      throw new Error('Razorpay is not enabled')
    }

    try {
      // Mock implementation
      const payment: RazorpayPayment = {
        id: paymentId,
        order_id: `order_${Date.now()}`,
        amount: amount,
        currency: 'INR',
        status: 'captured',
        method: 'card',
        captured: true,
        created_at: Date.now()
      }

      console.log('Razorpay Payment Captured:', payment)
      return payment
    } catch (error) {
      console.error('Razorpay Payment Capture Failed:', error)
      throw new Error('Failed to capture Razorpay payment')
    }
  }

  // Get Payment Details
  async getPayment(paymentId: string): Promise<RazorpayPayment> {
    if (!this.enabled) {
      throw new Error('Razorpay is not enabled')
    }

    try {
      // Mock implementation
      const payment: RazorpayPayment = {
        id: paymentId,
        order_id: `order_${Date.now()}`,
        amount: 250000, // 2500 INR in paise
        currency: 'INR',
        status: 'captured',
        method: 'card',
        captured: true,
        created_at: Date.now(),
        email: 'customer@example.com',
        contact: '+919999999999',
        description: 'EduSight Subscription Payment'
      }

      return payment
    } catch (error) {
      console.error('Failed to fetch Razorpay payment:', error)
      throw new Error('Failed to fetch payment details')
    }
  }

  // Create Refund
  async createRefund(paymentId: string, amount?: number): Promise<any> {
    if (!this.enabled) {
      throw new Error('Razorpay is not enabled')
    }

    try {
      // Mock implementation
      const refund = {
        id: `rfnd_${Date.now()}`,
        payment_id: paymentId,
        amount: amount || 0,
        currency: 'INR',
        status: 'processed',
        created_at: Date.now()
      }

      console.log('Razorpay Refund Created:', refund)
      return refund
    } catch (error) {
      console.error('Razorpay Refund Failed:', error)
      throw new Error('Failed to create refund')
    }
  }

  // Verify Payment Signature
  verifyPaymentSignature(params: {
    order_id: string
    payment_id: string
    signature: string
  }): boolean {
    try {
      // Mock implementation - in production, use Razorpay's signature verification
      // const crypto = require('crypto')
      // const generated_signature = crypto
      //   .createHmac('sha256', this.keySecret)
      //   .update(params.order_id + '|' + params.payment_id)
      //   .digest('hex')
      // return generated_signature === params.signature

      console.log('Verifying Razorpay signature:', params)
      return true // Mock verification
    } catch (error) {
      console.error('Signature verification failed:', error)
      return false
    }
  }

  // Get Payment Methods
  getPaymentMethods(): string[] {
    return ['card', 'netbanking', 'wallet', 'upi', 'emi', 'paylater']
  }

  // Get Client Options for Frontend
  getClientOptions() {
    return {
      key: this.keyId,
      currency: 'INR',
      name: 'EduSight',
      description: 'Educational Assessment Platform',
      image: '/logo.png',
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay modal dismissed')
        }
      }
    }
  }
}

export const razorpayService = new RazorpayService()
