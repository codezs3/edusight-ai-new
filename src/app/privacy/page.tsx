import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateMetadata } from '@/lib/seo/utils';

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy | EduSight AI - Student Data Protection',
  description: 'EduSight AI privacy policy detailing how we collect, use, and protect student data. GDPR compliant educational technology platform.',
  keywords: 'privacy policy, student data protection, GDPR compliance, educational data privacy',
  noIndex: false
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-lg text-gray-600">
                Last updated: January 1, 2025
              </p>
              <p className="text-gray-600 mt-2">
                This Privacy Policy describes how EduSight AI Technologies Pvt. Ltd. ("we," "our," or "us") collects, uses, and protects your information when you use our educational analytics platform.
              </p>
            </header>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">1.1 Student Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Academic performance data and assessment results</li>
                  <li>Physical health and fitness metrics</li>
                  <li>Psychological assessment data (with appropriate consent)</li>
                  <li>Basic demographic information (age, grade, school)</li>
                  <li>Learning preferences and educational goals</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">1.2 User Account Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Name, email address, and contact information</li>
                  <li>Role within the educational institution (teacher, parent, administrator)</li>
                  <li>School or organization affiliation</li>
                  <li>Professional credentials (for educators and counselors)</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">1.3 Usage Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Platform usage patterns and feature interactions</li>
                  <li>Device information and browser details</li>
                  <li>IP address and general location data</li>
                  <li>Session duration and navigation patterns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1 Educational Purposes</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Generate comprehensive student assessment reports</li>
                  <li>Provide personalized learning recommendations</li>
                  <li>Track academic, physical, and psychological development</li>
                  <li>Identify students who may need additional support</li>
                  <li>Enable communication between parents, teachers, and counselors</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2 Platform Improvement</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Enhance AI algorithms and assessment accuracy</li>
                  <li>Improve user experience and platform functionality</li>
                  <li>Develop new features and assessment tools</li>
                  <li>Ensure platform security and prevent misuse</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">2.3 Communication</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Send important platform updates and notifications</li>
                  <li>Provide customer support and technical assistance</li>
                  <li>Share relevant educational resources and insights</li>
                  <li>Respond to inquiries and support requests</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Protection and Security</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1 Security Measures</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>End-to-end encryption for all student data</li>
                  <li>Secure cloud infrastructure with regular security audits</li>
                  <li>Role-based access controls and authentication</li>
                  <li>Regular data backups and disaster recovery procedures</li>
                  <li>Compliance with international data protection standards</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2 Access Controls</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Students can only access their own assessment data</li>
                  <li>Parents can only view their child's information</li>
                  <li>Teachers can only access students in their classes</li>
                  <li>School administrators have broader access within their institution</li>
                  <li>Counselors access psychological data only with appropriate permissions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">4.1 We Do NOT Share Student Data With:</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Third-party advertisers or marketing companies</li>
                  <li>Social media platforms</li>
                  <li>Data brokers or analytics companies</li>
                  <li>Any entity for commercial purposes unrelated to education</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">4.2 Limited Sharing for Educational Purposes</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>With educational institutions as authorized by parents/students</li>
                  <li>With qualified educational professionals involved in student care</li>
                  <li>For research purposes (only anonymized, aggregated data)</li>
                  <li>As required by law or to protect student safety</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1 Data Access and Control</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Access and download your personal data</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your account and associated data</li>
                  <li>Withdraw consent for data processing (where applicable)</li>
                  <li>Object to certain types of data processing</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2 Communication Preferences</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Opt out of non-essential communications</li>
                  <li>Choose notification frequency and methods</li>
                  <li>Unsubscribe from marketing emails</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Children's Privacy (COPPA Compliance)</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800">
                    <strong>Special Protection for Children Under 13:</strong> We comply with the Children's Online Privacy Protection Act (COPPA) and similar international regulations.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Parental consent required for children under 13</li>
                  <li>Limited data collection to educational purposes only</li>
                  <li>No behavioral advertising to children</li>
                  <li>Parents can review and request deletion of child's data</li>
                  <li>Special security measures for children's accounts</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Student assessment data: Retained for the duration of enrollment plus 7 years for academic records</li>
                  <li>User account information: Retained while account is active plus 30 days for account recovery</li>
                  <li>Usage analytics: Aggregated data retained indefinitely, individual data deleted after 2 years</li>
                  <li>Communication records: Retained for 3 years for customer support purposes</li>
                  <li>Legal documents: Retained as required by applicable laws</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for international transfers, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Adequacy decisions from relevant data protection authorities</li>
                  <li>Standard contractual clauses approved by regulatory bodies</li>
                  <li>Certification schemes and codes of conduct</li>
                  <li>Other lawful transfer mechanisms as required</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Posting the updated policy on our website</li>
                  <li>Sending email notifications to registered users</li>
                  <li>Displaying prominent notices in the platform</li>
                  <li>Requiring acknowledgment of changes for continued use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Protection Officer</h3>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> privacy@edusight.ai
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone:</strong> +91-9876543210
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Address:</strong> EduSight AI Technologies Pvt. Ltd.<br />
                    Bengaluru, Karnataka, India
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For EU/UK Users</h3>
                  <p className="text-gray-700">
                    <strong>Representative Email:</strong> eu-representative@edusight.ai<br />
                    For questions about GDPR compliance and data protection rights
                  </p>
                </div>
              </section>

              <section className="border-t border-gray-200 pt-8">
                <p className="text-sm text-gray-500">
                  This Privacy Policy is part of our Terms of Service and is governed by the same terms and conditions. By using EduSight, you acknowledge that you have read and understood this Privacy Policy.
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
