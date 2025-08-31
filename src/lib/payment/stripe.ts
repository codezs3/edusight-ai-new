import { defaultPaymentConfig } from './config'

export interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
  created: number
  description?: string
  metadata?: Record<string, string>
}

export interface StripeCustomer {
  id: string
  email: string
  name?: string
  created: number
  metadata?: Record<string, string>
}

export interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  created: number
  items: {
    data: Array<{
      id: string
      price: {
        id: string
        unit_amount: number
        currency: string
        recurring: {
          interval: string
        }
      }
    }>
  }
}

export class StripeService {
  private publishableKey: string
  private secretKey: string
  private enabled: boolean

  constructor() {
    this.publishableKey = defaultPaymentConfig.stripe.publishableKey
    this.secretKey = defaultPaymentConfig.stripe.secretKey
    this.enabled = defaultPaymentConfig.stripe.enabled
  }

  // Create Payment Intent
  async createPaymentIntent(params: {
    amount: number // in smallest currency unit (cents for USD)
    currency?: string
    description?: string
    metadata?: Record<string, string>
    customer_email?: string
  }): Promise<StripePaymentIntent> {
    if (!this.enabled) {
      throw new Error('Stripe is not enabled')
    }

    try {
      // Mock implementation - replace with actual Stripe API call
      const paymentIntent: StripePaymentIntent = {
        id: `pi_${Date.now()}`,
        amount: params.amount,
        currency: params.currency || 'USD',
        status: 'requires_payment_method',
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        created: Math.floor(Date.now() / 1000),
        description: params.description,
        metadata: params.metadata
      }

      console.log('Stripe Payment Intent Created:', paymentIntent)
      return paymentIntent
    } catch (error) {
      console.error('Stripe Payment Intent Creation Failed:', error)
      throw new Error('Failed to create Stripe payment intent')
    }
  }

  // Confirm Payment Intent
  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string): Promise<StripePaymentIntent> {
    if (!this.enabled) {
      throw new Error('Stripe is not enabled')
    }

    try {
      // Mock implementation
      const paymentIntent: StripePaymentIntent = {
        id: paymentIntentId,
        amount: 250000, // $2500.00 in cents
        currency: 'USD',
        status: 'succeeded',
        client_secret: `${paymentIntentId}_secret_confirmed`,
        created: Math.floor(Date.now() / 1000),
        description: 'EduSight Subscription Payment'
      }

      console.log('Stripe Payment Intent Confirmed:', paymentIntent)
      return paymentIntent
    } catch (error) {
      console.error('Stripe Payment Intent Confirmation Failed:', error)
      throw new Error('Failed to confirm Stripe payment intent')
    }
  }

  // Create Customer
  async createCustomer(params: {
    email: string
    name?: string
    metadata?: Record<string, string>
  }): Promise<StripeCustomer> {
    if (!this.enabled) {
      throw new Error('Stripe is not enabled')
    }

    try {
      // Mock implementation
      const customer: StripeCustomer = {
        id: `cus_${Date.now()}`,
        email: params.email,
        name: params.name,
        created: Math.floor(Date.now() / 1000),
        metadata: params.metadata
      }

      console.log('Stripe Customer Created:', customer)
      return customer
    } catch (error) {
      console.error('Stripe Customer Creation Failed:', error)
      throw new Error('Failed to create Stripe customer')
    }
  }

  // Create Subscription
  async createSubscription(params: {
    customer_id: string
    price_id: string
    metadata?: Record<string, string>
  }): Promise<StripeSubscription> {
    if (!this.enabled) {
      throw new Error('Stripe is not enabled')
    }

    try {
      // Mock implementation
      const subscription: StripeSubscription = {
        id: `sub_${Date.now()}`,
        customer: params.customer_id,
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        created: Math.floor(Date.now() / 1000),
        items: {
          data: [{
            id: `si_${Date.now()}`,
            price: {
              id: params.price_id,
              unit_amount: 2500, // $25.00
              currency: 'USD',
              recurring: {
                interval: 'month'
              }
            }
          }]
        }
      }

      console.log('Stripe Subscription Created:', subscription)
      return subscription
    } catch (error) {
      console.error('Stripe Subscription Creation Failed:', error)
      throw new Error('Failed to create Stripe subscription')
    }
  }

  // Get Payment Intent
  async getPaymentIntent(paymentIntentId: string): Promise<StripePaymentIntent> {
    if (!this.enabled) {
      throw new Error('Stripe is not enabled')
    }

    try {
      // Mock implementation
      const paymentIntent: StripePaymentIntent = {
        id: paymentIntentId,
        amount: 250000,
        currency: 'USD',
        status: 'succeeded',
        client_secret: `${paymentIntentId}_secret`,
        created: Math.floor(Date.now() / 1000),
        description: 'EduSight Payment'
      }

      return paymentIntent
    } catch (error) {
      console.error('Failed to fetch Stripe payment intent:', error)
      throw new Error('Failed to fetch payment intent')
    }
  }

  // Create Refund
  async createRefund(paymentIntentId: string, amount?: number): Promise<any> {
    if (!this.enabled) {
      throw new Error('Stripe is not enabled')
    }

    try {
      // Mock implementation
      const refund = {
        id: `re_${Date.now()}`,
        payment_intent: paymentIntentId,
        amount: amount || 0,
        currency: 'USD',
        status: 'succeeded',
        created: Math.floor(Date.now() / 1000)
      }

      console.log('Stripe Refund Created:', refund)
      return refund
    } catch (error) {
      console.error('Stripe Refund Failed:', error)
      throw new Error('Failed to create refund')
    }
  }

  // Construct Webhook Event
  constructWebhookEvent(payload: string, signature: string): any {
    try {
      // Mock implementation - in production, use Stripe's webhook signature verification
      console.log('Constructing Stripe webhook event:', { payload, signature })
      
      return {
        id: `evt_${Date.now()}`,
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_mock_payment_intent',
            status: 'succeeded'
          }
        },
        created: Math.floor(Date.now() / 1000)
      }
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      throw new Error('Invalid webhook signature')
    }
  }

  // Get Payment Methods
  getPaymentMethods(): string[] {
    return ['card', 'bank_transfer', 'ideal', 'sofort', 'giropay', 'bancontact']
  }

  // Get Client Options for Frontend
  getClientOptions() {
    return {
      publishableKey: this.publishableKey,
      appearance: {
        theme: 'stripe' as const,
        variables: {
          colorPrimary: '#3B82F6',
          colorBackground: '#ffffff',
          colorText: '#1f2937',
          colorDanger: '#ef4444',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px'
        }
      },
      locale: 'en' as const
    }
  }
}

export const stripeService = new StripeService()
