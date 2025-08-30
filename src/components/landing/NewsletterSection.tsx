'use client';

import { useState } from 'react';
import { 
  EnvelopeIcon,
  CheckCircleIcon,
  SparklesIcon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const benefits = [
    {
      icon: SparklesIcon,
      title: 'Latest AI Insights',
      description: 'Get cutting-edge research on educational AI and student assessment'
    },
    {
      icon: ChartBarIcon,
      title: 'Success Stories',
      description: 'Real case studies from schools transforming student outcomes'
    },
    {
      icon: BellIcon,
      title: 'Product Updates',
      description: 'Be first to know about new features and platform improvements'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to the EduSight Community! 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing! You'll receive our next newsletter with exclusive insights 
              on educational AI and student success stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsSubscribed(false)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Subscribe another email
              </button>
              <a 
                href="/about" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Learn more about EduSight →
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white via-transparent to-transparent rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-primary-100 text-sm font-medium mb-6">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Join 10,000+ Educators
            </div>

            <h2 className="text-4xl font-bold mb-6">
              Stay Ahead in Educational Innovation
            </h2>
            
            <p className="text-xl text-primary-100 mb-8">
              Get exclusive insights, research findings, and success stories delivered to your inbox. 
              Join educators who are transforming student outcomes with AI-powered assessment.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                      <p className="text-primary-100 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-4 text-primary-200 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 bg-white bg-opacity-30 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <span>Join 10,000+ educators already subscribed</span>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    required
                  />
                  <EnvelopeIcon className="absolute right-3 top-3 w-5 h-5 text-primary-200" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-900 mr-2"></div>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe to Newsletter'
                )}
              </button>

              <p className="text-xs text-primary-200 text-center">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our team.
                Unsubscribe at any time.
              </p>
            </form>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-white border-opacity-20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">Weekly</div>
                  <div className="text-xs text-primary-200">Newsletter</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">No Spam</div>
                  <div className="text-xs text-primary-200">Guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-primary-100 mb-4">
            Prefer to connect directly? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-900 transition-colors"
            >
              Contact Our Team
            </a>
            <a 
              href="/auth/signin" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white bg-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-30 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
