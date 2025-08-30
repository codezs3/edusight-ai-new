import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateMetadata, generateStructuredData } from '@/lib/seo/utils';
import { 
  AcademicCapIcon,
  HeartIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CogIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = generateMetadata({
  page: 'solutions'
});

export default function SolutionsPage() {
  const solutions = [
    {
      icon: UserGroupIcon,
      title: 'For Parents',
      description: 'Comprehensive insights into your child\'s development',
      features: [
        'Real-time progress tracking',
        'EduSight 360° score monitoring',
        'Personalized recommendations',
        'Parent-teacher communication',
        'Detailed assessment reports',
        'Growth prediction analytics'
      ],
      color: 'purple',
      href: '/solutions/parents'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'For Schools',
      description: 'Complete school management and analytics platform',
      features: [
        'School-wide performance analytics',
        'Student management system',
        'Teacher collaboration tools',
        'Automated report generation',
        'Curriculum alignment tracking',
        'Risk assessment alerts'
      ],
      color: 'blue',
      href: '/solutions/schools'
    },
    {
      icon: AcademicCapIcon,
      title: 'For Teachers',
      description: 'Powerful tools for educators and specialists',
      features: [
        'Student assessment creation',
        'Progress tracking dashboard',
        'Intervention recommendations',
        'Class performance analytics',
        'Collaborative assessments',
        'Professional development insights'
      ],
      color: 'green',
      href: '/solutions/teachers'
    },
    {
      icon: HeartIcon,
      title: 'For Counselors',
      description: 'Mental health and psychological assessment tools',
      features: [
        'Psychological assessment battery',
        'Mental health monitoring',
        'Risk identification system',
        'Intervention planning',
        'Progress documentation',
        'Professional reporting'
      ],
      color: 'red',
      href: '/solutions/counselors'
    }
  ];

  const assessmentTypes = [
    {
      icon: AcademicCapIcon,
      title: 'Academic Assessment',
      description: 'Comprehensive evaluation of academic performance across all subjects',
      features: [
        'Subject-wise performance tracking',
        'Learning outcome analysis',
        'Skill gap identification',
        'Progress prediction',
        'Curriculum alignment',
        'Personalized learning paths'
      ]
    },
    {
      icon: HeartIcon,
      title: 'Psychological Assessment',
      description: 'Mental health and psychological wellbeing evaluation',
      features: [
        'Emotional intelligence testing',
        'Behavioral pattern analysis',
        'Stress and anxiety monitoring',
        'Social skills assessment',
        'Mental health screening',
        'Therapeutic recommendations'
      ]
    },
    {
      icon: BeakerIcon,
      title: 'Physical Assessment',
      description: 'Physical health and fitness evaluation',
      features: [
        'Physical fitness testing',
        'Health metrics tracking',
        'Motor skills assessment',
        'Nutritional analysis',
        'Exercise recommendations',
        'Growth monitoring'
      ]
    },
    {
      icon: LightBulbIcon,
      title: 'DMIT Assessment',
      description: 'Dermatoglyphics Multiple Intelligence Test',
      features: [
        'Intelligence pattern analysis',
        'Learning style identification',
        'Talent discovery',
        'Career guidance insights',
        'Personality profiling',
        'Potential optimization'
      ]
    }
  ];

  const features = [
    {
      icon: ChartBarIcon,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms provide deep insights into student performance and development patterns.'
    },
    {
      icon: DocumentTextIcon,
      title: 'Automated Reporting',
      description: 'Generate comprehensive, branded reports with detailed analysis and actionable recommendations.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Data Security',
      description: 'Enterprise-grade security with GDPR compliance ensuring student data protection and privacy.'
    },
    {
      icon: CogIcon,
      title: 'Easy Integration',
      description: 'Seamlessly integrate with existing school management systems and educational platforms.'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colors = {
      purple: 'text-purple-600',
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const serviceSchema = generateStructuredData('service');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Comprehensive Educational Solutions
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-4xl mx-auto">
                AI-powered assessment platform designed for every stakeholder in the educational ecosystem
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                  Explore Solutions
                </button>
                <button className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                  Request Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Role-based Solutions */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Solutions for Every Role
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tailored dashboards and tools designed specifically for parents, schools, teachers, and counselors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {solutions.map((solution, index) => {
                const IconComponent = solution.icon;
                return (
                  <div
                    key={index}
                    className={`p-8 border-2 rounded-xl transition-all duration-200 hover:shadow-lg ${getColorClasses(solution.color)}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent className={`h-10 w-10 ${getIconColorClasses(solution.color)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {solution.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {solution.description}
                        </p>
                        <ul className="space-y-2">
                          {solution.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Assessment Types */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comprehensive Assessment Framework
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                EduSight 360° assessment covers all aspects of student development for a holistic view
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {assessmentTypes.map((assessment, index) => {
                const IconComponent = assessment.icon;
                return (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {assessment.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {assessment.description}
                        </p>
                        <ul className="space-y-2">
                          {assessment.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Platform Features
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Advanced technology and user-friendly design for effective educational assessment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Education?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join hundreds of schools already using EduSight to improve student outcomes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Start Free Trial
              </button>
              <button className="inline-flex items-center px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
