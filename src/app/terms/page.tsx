import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateMetadata } from '@/lib/seo/utils';

export const metadata: Metadata = generateMetadata({
  title: 'Terms of Service | EduSight AI - Educational Platform Terms',
  description: 'EduSight AI terms of service and user agreement for educational analytics platform. Legal terms and conditions for students, parents, schools, and educators.',
  keywords: 'terms of service, user agreement, educational platform terms, legal conditions',
  noIndex: false
});

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600">
                Last updated: January 1, 2025
              </p>
              <p className="text-gray-600 mt-2">
                These Terms of Service ("Terms") govern your use of the EduSight AI educational analytics platform operated by EduSight AI Technologies Pvt. Ltd.
              </p>
            </header>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing or using the EduSight platform, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the service.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Important:</strong> If you are under 18 years of age, you must have your parent or guardian read and agree to these Terms on your behalf.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  EduSight is an AI-powered educational analytics platform that provides:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Comprehensive student assessments (academic, physical, psychological)</li>
                  <li>EduSight 360° scoring and analytics</li>
                  <li>DMIT (Dermatoglyphics Multiple Intelligence Test) assessments</li>
                  <li>Dashboard interfaces for parents, teachers, students, and administrators</li>
                  <li>Automated report generation and progress tracking</li>
                  <li>AI-powered insights and recommendations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for safeguarding your account credentials</li>
                  <li>You must notify us immediately of any unauthorized access</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2 User Categories</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Students:</strong> Direct users of assessments and learning tools</li>
                  <li><strong>Parents:</strong> Access to their children's assessment data and progress</li>
                  <li><strong>Teachers:</strong> Assessment creation and student progress monitoring</li>
                  <li><strong>School Administrators:</strong> School-wide analytics and user management</li>
                  <li><strong>Counselors:</strong> Psychological assessment tools and intervention planning</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 Permitted Uses</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Educational assessment and monitoring purposes</li>
                  <li>Academic research with proper anonymization</li>
                  <li>Communication between authorized educational stakeholders</li>
                  <li>Professional development and training activities</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 Prohibited Activities</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Sharing login credentials with unauthorized persons</li>
                  <li>Attempting to access data you're not authorized to view</li>
                  <li>Using the platform for non-educational commercial purposes</li>
                  <li>Uploading malicious software or attempting to compromise security</li>
                  <li>Harassment, bullying, or inappropriate communication</li>
                  <li>Falsifying assessment data or student information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1 Student Data Protection</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Student data is used solely for educational purposes</li>
                  <li>We comply with FERPA, COPPA, and GDPR requirements</li>
                  <li>Parents have the right to access and control their child's data</li>
                  <li>Data is encrypted and stored securely</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2 Consent Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Parental consent required for users under 13</li>
                  <li>Student consent required for psychological assessments</li>
                  <li>School administrator consent for institutional data sharing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Subscription and Payment Terms</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">6.1 Subscription Plans</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Gold Plan:</strong> ₹899 + GST per month</li>
                  <li><strong>Platinum Plan:</strong> ₹1,499 + GST per month</li>
                  <li><strong>Enterprise Plan:</strong> ₹50,000 + GST per month (50 users)</li>
                  <li><strong>DMIT Assessment:</strong> ₹2,999 + GST per test</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">6.2 Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Payments are processed securely through approved payment gateways</li>
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>Prices may change with 30 days notice to existing subscribers</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">6.3 Cancellation</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>You may cancel your subscription at any time</li>
                  <li>Cancellation takes effect at the end of the current billing cycle</li>
                  <li>Data export available for 30 days after cancellation</li>
                  <li>No refunds for partial months unless required by law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">7.1 Platform Ownership</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>EduSight platform, software, and algorithms are owned by EduSight AI</li>
                  <li>Users receive a limited license to use the platform for educational purposes</li>
                  <li>Reverse engineering or copying platform functionality is prohibited</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">7.2 User Content</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Users retain ownership of their uploaded content and data</li>
                  <li>Users grant us a license to process data for service provision</li>
                  <li>Anonymized, aggregated data may be used for research and improvement</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">7.3 Assessment Methodologies</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>EduSight 360° methodology is proprietary to EduSight AI</li>
                  <li>DMIT assessments use licensed methodologies</li>
                  <li>Users may not replicate or redistribute assessment frameworks</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers and Limitations</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">8.1 Educational Tool Disclaimer</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800">
                    <strong>Important:</strong> EduSight is an educational assessment tool and should not be used as the sole basis for educational decisions. Professional judgment and additional assessments should always be considered.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">8.2 Medical Disclaimer</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800">
                    <strong>Medical Attention Required:</strong> Students with EduSight 360° scores below 40 are flagged for potential medical or psychological intervention. This is not a medical diagnosis and professional consultation is required.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">8.3 Service Availability</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                  <li>Scheduled maintenance will be announced in advance</li>
                  <li>Emergency maintenance may occur without notice</li>
                  <li>Force majeure events may affect service availability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  To the maximum extent permitted by law, EduSight AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Loss of profits, data, or use</li>
                  <li>Cost of procurement of substitute goods or services</li>
                  <li>Interruption of business or any consequential damages</li>
                  <li>Educational decisions made based solely on platform data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
                <p className="text-gray-700">
                  You agree to indemnify and hold harmless EduSight AI, its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the platform or violation of these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law and Jurisdiction</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>These Terms are governed by the laws of India</li>
                  <li>Disputes will be resolved in the courts of Bengaluru, Karnataka</li>
                  <li>For international users, local consumer protection laws may also apply</li>
                  <li>Arbitration may be required for certain disputes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms at any time. We will notify users of material changes through:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Email notifications to registered users</li>
                  <li>Prominent notices on the platform</li>
                  <li>Updated "Last modified" date on this page</li>
                  <li>Required acknowledgment for continued use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-2">
                    <strong>Legal Department</strong><br />
                    EduSight AI Technologies Pvt. Ltd.
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> legal@edusight.ai
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> +91-9876543210
                  </p>
                  <p className="text-gray-700">
                    <strong>Address:</strong> Bengaluru, Karnataka, India
                  </p>
                </div>
              </section>

              <section className="border-t border-gray-200 pt-8">
                <p className="text-sm text-gray-500">
                  By using EduSight, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
