'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';
import { CheckIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PricingPlan {
  id: string;
  name: string;
  planType: 'basic' | 'premium' | 'enterprise';
  price: number;
  currency: string;
  durationMonths: number;
  stripePriceId: string;
  features: {
    academicAssessments: boolean;
    physicalAssessments: boolean;
    psychologicalAssessments: boolean;
    careerMapping: boolean;
    mlPredictions: boolean;
    advancedAnalytics: boolean;
    customReports: boolean;
    prioritySupport: boolean;
    maxStudents?: number;
    maxAssessmentsPerMonth?: number;
  };
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    planType: 'basic',
    price: 29,
    currency: 'USD',
    durationMonths: 1,
    stripePriceId: 'price_basic_monthly',
    features: {
      academicAssessments: true,
      physicalAssessments: false,
      psychologicalAssessments: false,
      careerMapping: false,
      mlPredictions: false,
      advancedAnalytics: false,
      customReports: false,
      prioritySupport: false,
      maxStudents: 1,
      maxAssessmentsPerMonth: 3,
    },
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    planType: 'premium',
    price: 79,
    currency: 'USD',
    durationMonths: 1,
    stripePriceId: 'price_premium_monthly',
    popular: true,
    features: {
      academicAssessments: true,
      physicalAssessments: true,
      psychologicalAssessments: true,
      careerMapping: true,
      mlPredictions: true,
      advancedAnalytics: true,
      customReports: false,
      prioritySupport: false,
      maxStudents: 3,
      maxAssessmentsPerMonth: 10,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    planType: 'enterprise',
    price: 199,
    currency: 'USD',
    durationMonths: 1,
    stripePriceId: 'price_enterprise_monthly',
    features: {
      academicAssessments: true,
      physicalAssessments: true,
      psychologicalAssessments: true,
      careerMapping: true,
      mlPredictions: true,
      advancedAnalytics: true,
      customReports: true,
      prioritySupport: true,
      maxStudents: 10,
      maxAssessmentsPerMonth: 50,
    },
  },
];

const featureLabels = {
  academicAssessments: 'Academic Assessments',
  physicalAssessments: 'Physical Health Assessments',
  psychologicalAssessments: 'Psychological Assessments',
  careerMapping: 'Career Mapping & Guidance',
  mlPredictions: 'AI-Powered Predictions',
  advancedAnalytics: 'Advanced Analytics Dashboard',
  customReports: 'Custom Report Generation',
  prioritySupport: '24/7 Priority Support',
};

export function SubscriptionPlans() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/pricing');
      return;
    }

    setLoadingPlan(plan.id);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planId: plan.id,
          userId: session.user.id,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start subscription');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Assessment Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Unlock comprehensive insights into your child's academic, psychological, and physical development
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? 'border-primary-500 shadow-lg'
                  : 'border-gray-200'
              } bg-white p-8 shadow-sm`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold bg-primary-500 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /month
                  </span>
                </div>
                {plan.features.maxStudents && (
                  <p className="mt-2 text-sm text-gray-500">
                    Up to {plan.features.maxStudents} student{plan.features.maxStudents > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <ul className="mt-8 space-y-4">
                {Object.entries(featureLabels).map(([key, label]) => {
                  const isIncluded = plan.features[key as keyof typeof plan.features];
                  return (
                    <li key={key} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon
                          className={`h-6 w-6 ${
                            isIncluded ? 'text-green-500' : 'text-gray-300'
                          }`}
                        />
                      </div>
                      <p
                        className={`ml-3 text-sm ${
                          isIncluded ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {label}
                      </p>
                    </li>
                  );
                })}
                {plan.features.maxAssessmentsPerMonth && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">
                      {plan.features.maxAssessmentsPerMonth} assessments per month
                    </p>
                  </li>
                )}
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.id}
                  className={`w-full py-3 px-6 border border-transparent rounded-md text-center text-sm font-medium ${
                    plan.popular
                      ? 'text-white bg-primary-600 hover:bg-primary-700'
                      : 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Get Started'
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Cancel anytime • 30-day money-back guarantee
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            All plans include secure data storage, mobile-responsive dashboard, and email support.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Need a custom solution? {' '}
            <a href="/contact" className="text-primary-600 hover:text-primary-500 font-medium">
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
