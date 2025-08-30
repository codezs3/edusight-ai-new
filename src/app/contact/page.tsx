import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateMetadata, generateStructuredData } from '@/lib/seo/utils';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = generateMetadata({
  page: 'contact'
});

export default function ContactPage() {
  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Speak with our education specialists',
      contact: '+91-9876543210',
      availability: 'Mon-Fri, 9 AM - 6 PM IST'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Get detailed assistance via email',
      contact: 'support@edusight.ai',
      availability: '24/7 Response within 24 hours'
    },
    {
      icon: MapPinIcon,
      title: 'Office Address',
      description: 'Visit our headquarters',
      contact: 'EduSight AI Technologies Pvt. Ltd.',
      availability: 'Bengaluru, Karnataka, India'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Instant support during business hours',
      contact: 'Available on website',
      availability: 'Mon-Fri, 9 AM - 6 PM IST'
    }
  ];

  const departments = [
    {
      icon: UserGroupIcon,
      title: 'Sales & Partnerships',
      email: 'sales@edusight.ai',
      description: 'School partnerships and enterprise solutions'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Technical Support',
      email: 'support@edusight.ai', 
      description: 'Platform assistance and troubleshooting'
    },
    {
      icon: AcademicCapIcon,
      title: 'Educational Consultancy',
      email: 'education@edusight.ai',
      description: 'Assessment methodology and curriculum alignment'
    },
    {
      icon: UserGroupIcon,
      title: 'Parent Support',
      email: 'parents@edusight.ai',
      description: 'Guidance for parents and guardians'
    }
  ];

  const faqSchema = generateStructuredData('faq');
  const organizationSchema = generateStructuredData('organization');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact EduSight AI
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                Get in touch with our educational technology experts for demos, support, and partnership opportunities
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                <PhoneIcon className="h-5 w-5 mr-2" />
                Schedule a Demo
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the most convenient way to connect with our team of educational technology specialists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {info.description}
                    </p>
                    <p className="font-medium text-blue-600 mb-2">
                      {info.contact}
                    </p>
                    <p className="text-sm text-gray-500">
                      {info.availability}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Department-specific Contact */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Department-Specific Support
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Connect directly with the right team for your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {departments.map((dept, index) => {
                const IconComponent = dept.icon;
                return (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {dept.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {dept.description}
                        </p>
                        <a 
                          href={`mailto:${dept.email}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {dept.email}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-lg text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <form className="bg-white shadow-lg rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization/School Name
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="demo">Request Demo</option>
                  <option value="partnership">School Partnership</option>
                  <option value="support">Technical Support</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your needs and how we can help..."
                ></textarea>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  We typically respond within 24 hours during business days
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Quick answers to common questions about EduSight
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How do I get started with EduSight?
                </h3>
                <p className="text-gray-600">
                  Contact our sales team to schedule a demo and discuss your specific needs. We'll help you choose the right plan and provide onboarding support.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Do you offer training for teachers and administrators?
                </h3>
                <p className="text-gray-600">
                  Yes, we provide comprehensive training programs for all user roles including teachers, administrators, counselors, and parents to ensure effective platform usage.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What kind of support do you provide?
                </h3>
                <p className="text-gray-600">
                  We offer multiple support channels including phone, email, live chat, and video support. Our team provides technical assistance, training, and educational consultancy.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can EduSight integrate with existing school systems?
                </h3>
                <p className="text-gray-600">
                  Yes, EduSight can integrate with most existing school management systems, LMS platforms, and educational tools through our API and data import/export features.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}