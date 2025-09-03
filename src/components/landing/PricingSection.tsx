'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  XMarkIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Basic',
      description: 'Perfect for individual families (Nursery to Grade 12)',
      price: {
        monthly: 599,
        yearly: 5990 // ~17% discount
      },
      icon: StarIcon,
      color: 'blue',
      popular: false,
      features: [
        'Age Coverage: Nursery to Grade 12',
        'Up to 100 students',
        'Basic assessment tools',
        'Framework detection (CBSE, ICSE, IB, IGCSE)',
        'Email support',
        'Basic reporting',
        'Parent portal access',
        'Student progress tracking',
        'Basic analytics dashboard'
      ],
      limitations: [
        'No PDF downloads',
        'Basic analytics only',
        'Limited career recommendations'
      ]
    },
    {
      name: 'Professional',
      description: 'For small to medium schools and coaching centers',
      price: {
        monthly: 899,
        yearly: 8990 // ~17% discount
      },
      icon: StarIcon,
      color: 'yellow',
      popular: true,
      features: [
        'Age Coverage: Nursery to Grade 12',
        'Up to 500 students',
        'Advanced AI assessments & ML predictions',
        'PDF report downloads',
        'Framework-specific analysis',
        'Priority email & chat support',
        'Parent & teacher portals',
        'Skills development tracking',
        'Career recommendations (Grade 9-12)',
        'Comprehensive analytics dashboard'
      ],
      limitations: [
        'No white-label options',
        'Standard integrations only'
      ]
    },
    {
      name: 'Premium',
      description: 'For large educational institutions',
      price: {
        monthly: 1499,
        yearly: 14990 // ~17% discount
      },
      icon: StarIcon,
      color: 'purple',
      popular: false,
      features: [
        'Age Coverage: Nursery to Grade 12',
        'Up to 2,000 students',
        'Full ML analytics suite',
        'Real-time predictive insights',
        'Advanced reporting & visualizations',
        'Multi-framework comparison',
        '24/7 priority support',
        'Complete dashboard access (Admin, Teacher, Parent)',
        'Physical & psychological assessments',
        'Comprehensive EduSight 360° scoring',
        'Custom career path analysis'
      ],
      limitations: [
        'No white-label options'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For educational networks and large institutions',
      price: {
        monthly: null, // Custom pricing
        yearly: null
      },
      icon: SparklesIcon,
      color: 'indigo',
      popular: false,
      enterprise: true,
      features: [
        'Age Coverage: Nursery to Grade 12',
        'Unlimited students & schools',
        'White-label solutions',
        'Custom AI model training',
        'API access & integrations',
        'Dedicated account manager',
        'On-premise deployment options',
        'Custom framework development',
        'Advanced analytics & reporting',
        'Multi-school management',
        'Regional analytics dashboard',
        'Custom branding & UI',
        'SLA guarantees',
        'Custom training & onboarding'
      ],
      limitations: []
    }
  ];

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'button') => {
    const colors = {
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        border: 'border-yellow-200',
        button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700 text-white'
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        border: 'border-indigo-200',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }
    };
    return colors[color as keyof typeof colors]?.[variant] || 'bg-yellow-50';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your educational needs. All plans include GST.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Save 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                } transition-all duration-300 hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-purple-500 text-white">
                      <SparklesIcon className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getColorClasses(plan.color, 'bg')} mb-4`}>
                      <IconComponent className={`h-8 w-8 ${getColorClasses(plan.color, 'text')}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(plan.price[billingPeriod])}
                        </span>
                        <span className="text-gray-500 ml-2">
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">+ GST as applicable</p>
                      {billingPeriod === 'yearly' && (
                        <p className="text-sm text-green-600 mt-1">
                          Save {formatPrice(plan.price.monthly * 12 - plan.price.yearly)} annually
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start opacity-60">
                        <XMarkIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-500">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href="/auth/signin"
                    className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg transition-colors ${getColorClasses(plan.color, 'button')}`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* DMIT Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <SparklesIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4">
              Dermatoglyphics Multiple Intelligence Test (DMIT)
            </h3>
            <p className="text-xl text-indigo-100 mb-6">
              Discover your child's innate intelligence and learning style through advanced fingerprint analysis
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-4">What's Included:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    Complete fingerprint analysis
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    Multiple intelligence assessment
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    Learning style identification
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    Personality trait analysis
                  </li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="text-lg font-semibold mb-4">You'll Receive:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    Detailed 25+ page report
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    Career guidance recommendations
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    Learning enhancement strategies
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                    One-on-one counseling session
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">₹2,999</div>
                <div className="text-indigo-100">per test + GST</div>
                <div className="text-sm text-indigo-200 mt-2">
                  Complete analysis with detailed report and counseling
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dmit"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Learn More About DMIT
              </Link>
              <Link
                href="/dmit/book"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Book DMIT Test
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">Yes, all plans come with a 14-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How is GST calculated?</h4>
              <p className="text-gray-600">GST is calculated as per Indian tax regulations and will be added to your final bill amount.</p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-gray-600 mb-6">
              Contact our team for custom pricing, bulk discounts, and enterprise features.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Sales Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}