import { NextRequest, NextResponse } from 'next/server'
import { stripeService } from '@/lib/payment/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature and construct event
    const event = stripeService.constructWebhookEvent(body, signature)
    
    // Process webhook event
    await processStripeWebhook(event)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function processStripeWebhook(event: any) {
  const { type, data } = event

  console.log(`Processing Stripe webhook: ${type}`)

  switch (type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(data.object)
      break
    
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(data.object)
      break
    
    case 'charge.succeeded':
      await handleChargeSucceeded(data.object)
      break
    
    case 'charge.failed':
      await handleChargeFailed(data.object)
      break
    
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(data.object)
      break
    
    case 'customer.subscription.created':
      await handleSubscriptionCreated(data.object)
      break
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(data.object)
      break
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(data.object)
      break
    
    case 'charge.dispute.created':
      await handleDisputeCreated(data.object)
      break
    
    default:
      console.log(`Unhandled Stripe event type: ${type}`)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment intent succeeded:', paymentIntent.id)
  
  // Update payment status in database
  // await updatePaymentStatus(paymentIntent.id, 'succeeded')
  
  // Add to accounting records
  await addIncomeRecord({
    description: `Payment successful - ${paymentIntent.description || 'Stripe payment'}`,
    amount: paymentIntent.amount / 100, // Convert from cents to dollars
    category: 'subscription',
    client: paymentIntent.receipt_email || 'Unknown',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'stripe',
    invoiceNumber: paymentIntent.id,
    status: 'received',
    notes: `Stripe Payment Intent: ${paymentIntent.id}`
  })
  
  // Send confirmation email
  // await sendPaymentConfirmation(paymentIntent)
  
  // Activate service or subscription
  // await activateService(paymentIntent.metadata?.order_id)
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment intent failed:', paymentIntent.id)
  
  // Update payment status
  // await updatePaymentStatus(paymentIntent.id, 'failed')
  
  // Send failure notification
  // await sendPaymentFailureNotification(paymentIntent)
  
  // Log failure reason
  console.log('Payment failure reason:', paymentIntent.last_payment_error?.message)
}

async function handleChargeSucceeded(charge: any) {
  console.log('Charge succeeded:', charge.id)
  
  // Update charge status
  // await updateChargeStatus(charge.id, 'succeeded')
  
  // Record transaction fees
  const fee = charge.balance_transaction?.fee || 0
  if (fee > 0) {
    await addExpenseRecord({
      description: `Stripe processing fee - ${charge.id}`,
      amount: fee / 100,
      category: 'transaction_fee',
      vendor: 'Stripe',
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      notes: `Charge ID: ${charge.id}`
    })
  }
}

async function handleChargeFailed(charge: any) {
  console.log('Charge failed:', charge.id)
  
  // Update charge status
  // await updateChargeStatus(charge.id, 'failed')
  
  // Log failure
  console.log('Charge failure reason:', charge.failure_message)
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  // Update invoice status
  // await updateInvoiceStatus(invoice.id, 'paid')
  
  // Add to income records
  await addIncomeRecord({
    description: `Invoice payment - ${invoice.number}`,
    amount: invoice.amount_paid / 100,
    category: 'subscription',
    client: invoice.customer_email || 'Invoice customer',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'stripe',
    invoiceNumber: invoice.number,
    status: 'received',
    notes: `Stripe Invoice: ${invoice.id}`
  })
  
  // Send invoice paid notification
  // await sendInvoicePaidNotification(invoice)
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id)
  
  // Create subscription record
  // await createSubscriptionRecord(subscription)
  
  // Send welcome email
  // await sendSubscriptionWelcome(subscription)
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id)
  
  // Update subscription record
  // await updateSubscriptionRecord(subscription)
  
  // Handle status changes
  if (subscription.status === 'canceled') {
    // Handle cancellation
    // await handleSubscriptionCancellation(subscription)
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id)
  
  // Update subscription status
  // await updateSubscriptionStatus(subscription.id, 'canceled')
  
  // Send cancellation confirmation
  // await sendSubscriptionCancellation(subscription)
}

async function handleDisputeCreated(dispute: any) {
  console.log('Dispute created:', dispute.id)
  
  // Record dispute
  await addExpenseRecord({
    description: `Chargeback dispute - ${dispute.charge}`,
    amount: dispute.amount / 100,
    category: 'chargeback',
    vendor: 'Stripe Dispute',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    notes: `Dispute ID: ${dispute.id}, Reason: ${dispute.reason}`
  })
  
  // Alert admin about dispute
  // await sendDisputeAlert(dispute)
}

// Mock function to add income record
async function addIncomeRecord(incomeData: any) {
  console.log('Adding income record:', incomeData)
  // In production, this would save to database
  // await db.income.create({ data: incomeData })
}

// Mock function to add expense record
async function addExpenseRecord(expenseData: any) {
  console.log('Adding expense record:', expenseData)
  // In production, this would save to database
  // await db.expense.create({ data: expenseData })
}
