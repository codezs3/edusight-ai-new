'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  inquiryType: z.enum(['general', 'sales', 'support', 'partnership', 'demo']),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Contact form submission:', data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      content: 'hello@edusight.com',
      description: 'Send us an email anytime'
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm EST'
    },
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      content: '123 Education Street, Learning City, LC 12345',
      description: 'Our headquarters'
    },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      content: 'Monday - Friday: 8:00 AM - 6:00 PM EST',
      description: 'We\'re here to help'
    }
  ];

  const faqItems = [
    {
      question: 'How do I get started with EduSight?',
      answer: 'You can start with our free trial by signing up on our platform. We also offer demo sessions to help you understand our features.'
    },
    {
      question: 'What types of assessments does EduSight support?',
      answer: 'EduSight supports academic assessments, psychological evaluations, physical health checks, career interest surveys, and custom assessment types.'
    },
    {
      question: 'Is student data secure on your platform?',
      answer: 'Yes, we use enterprise-grade security with end-to-end encryption, FERPA compliance, and regular security audits to protect student data.'
    },
    {
      question: 'Can EduSight integrate with our existing school management system?',
      answer: 'Yes, we offer API integrations with most popular school management systems. Contact our technical team for specific integration details.'
    },
    {
      question: 'Do you provide training for educators?',
      answer: 'Absolutely! We offer comprehensive training programs, webinars, and ongoing support to help educators make the most of our platform.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Have questions about EduSight? We're here to help you transform 
              your educational assessment experience.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="form-error">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="organization" className="form-label">
                  Organization
                </label>
                <input
                  {...register('organization')}
                  type="text"
                  className="form-input"
                  placeholder="Your school or organization"
                />
              </div>

              <div>
                <label htmlFor="inquiryType" className="form-label">
                  Inquiry Type *
                </label>
                <select
                  {...register('inquiryType')}
                  className="form-input"
                >
                  <option value="">Select inquiry type</option>
                  <option value="general">General Information</option>
                  <option value="sales">Sales & Pricing</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="demo">Request Demo</option>
                </select>
                {errors.inquiryType && (
                  <p className="form-error">{errors.inquiryType.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="form-label">
                  Subject *
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  className="form-input"
                  placeholder="Brief subject of your inquiry"
                />
                {errors.subject && (
                  <p className="form-error">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="form-label">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="form-input"
                  placeholder="Tell us more about your inquiry..."
                />
                {errors.message && (
                  <p className="form-error">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Message...
                  </div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                    <p className="text-gray-900 mb-1">{info.content}</p>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="/demo-users"
                  className="flex items-center p-3 bg-white rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">Try Live Demo</span>
                </a>
                <a
                  href="/pricing"
                  className="flex items-center p-3 bg-white rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <QuestionMarkCircleIcon className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">View Pricing Plans</span>
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Support Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">8:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">10:00 AM - 2:00 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                For urgent technical issues, please email support@edusight.com
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-6">
            Join thousands of educators already using EduSight to transform student assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signin"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/pricing"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
