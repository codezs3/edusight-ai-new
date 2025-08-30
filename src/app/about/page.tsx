import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  AcademicCapIcon,
  HeartIcon,
  ChartBarIcon,
  UserGroupIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'About EduSight - Transforming Educational Assessment',
  description: 'Learn about EduSight\'s mission to revolutionize educational assessment through AI-powered insights, comprehensive analytics, and holistic student development.',
};

export default function AboutPage() {
  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Academic Excellence',
      description: 'Comprehensive assessment tools that measure and enhance academic performance across all subjects and grade levels.'
    },
    {
      icon: HeartIcon,
      title: 'Holistic Development',
      description: 'Beyond academics - we assess psychological wellbeing, physical health, and social-emotional development.'
    },
    {
      icon: ChartBarIcon,
      title: 'Data-Driven Insights',
      description: 'Advanced analytics and machine learning provide actionable insights for educators, parents, and students.'
    },
    {
      icon: UserGroupIcon,
      title: 'Collaborative Platform',
      description: 'Seamless communication between teachers, parents, students, and counselors for comprehensive support.'
    },
    {
      icon: LightBulbIcon,
      title: 'AI-Powered Recommendations',
      description: 'Intelligent recommendations for learning paths, career guidance, and intervention strategies.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy & Security',
      description: 'Enterprise-grade security ensuring student data privacy and compliance with educational standards.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Executive Officer',
      image: '/team/ceo.jpg',
      bio: 'Former educator with 15+ years in educational technology and student assessment.'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      image: '/team/cto.jpg',
      bio: 'AI/ML expert with experience in educational data analytics and predictive modeling.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Chief Academic Officer',
      image: '/team/cao.jpg',
      bio: 'Educational psychologist specializing in student development and assessment methodologies.'
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      image: '/team/product.jpg',
      bio: 'Product strategist focused on user experience and educational workflow optimization.'
    }
  ];

  const stats = [
    { label: 'Students Assessed', value: '50,000+' },
    { label: 'Schools Partnered', value: '500+' },
    { label: 'Countries Served', value: '25+' },
    { label: 'Assessment Types', value: '100+' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-edu-primary-600 to-edu-secondary-600 text-white py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium mb-6">
              <SparklesIcon className="w-4 h-4 mr-2" />
              India's NEP 2020 Aligned Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Unlocking Every Indian Student's
              <span className="block text-edu-primary-200">Full Potential</span>
            </h1>
            <p className="text-xl md:text-2xl text-edu-primary-100 max-w-4xl mx-auto mb-8">
              Holistic K-12 analytics platform spanning academic performance, physical health, and psychological wellbeing. 
              Transform fragmented student data into actionable insights with AI-powered career guidance aligned with India's National Education Policy (NEP 2020).
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="bg-gradient-to-br from-edu-primary-50 to-edu-secondary-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-edu-primary-600 rounded-xl flex items-center justify-center mr-4">
                  <LightBulbIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-edu-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-edu-gray-700 leading-relaxed">
                To unlock the full potential of every Indian student by providing deep, data-driven self-awareness 
                and AI-powered educational guidance that inspires informed, personalized, and future-ready learning journeys.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-edu-secondary-50 to-edu-accent-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-edu-secondary-600 rounded-xl flex items-center justify-center mr-4">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-edu-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-edu-gray-700 leading-relaxed mb-4">
                To build a scalable and trusted analytics ecosystem that:
              </p>
              <ul className="space-y-2 text-edu-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-edu-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Offers personalized insights into student strengths, challenges, and aspirations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-edu-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Equips schools with tools to benchmark performance and improve outcomes</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-edu-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Enables data-informed decision-making for students, parents, and educators</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-edu-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Bridges academic, behavioral, and career domains through validated, multi-dimensional metrics</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-edu-secondary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Ensures inclusivity, privacy, and real-world relevance across diverse learning contexts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize educational assessment by providing comprehensive, AI-powered tools 
                that measure not just academic performance, but the complete spectrum of student 
                development including psychological wellbeing, physical health, and social-emotional growth.
              </p>
              <p className="text-lg text-gray-600">
                We believe every student deserves personalized insights and support to reach their 
                full potential, and every educator deserves the tools to make data-driven decisions 
                that truly impact student success.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 mb-6">
                A world where every student's unique strengths, challenges, and potential are 
                understood and nurtured through intelligent, compassionate assessment and support systems.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Personalized learning for every student</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Data-driven educational decisions</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">Holistic student development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes EduSight Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform goes beyond traditional assessment to provide 
              a complete picture of student development and potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-primary-100">
              Trusted by educators and families worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Passionate educators, technologists, and researchers dedicated to transforming education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserGroupIcon className="w-16 h-16 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Student-Centered</h3>
              <p className="text-gray-600">
                Every decision we make is guided by what's best for student growth, wellbeing, and success.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence-Based</h3>
              <p className="text-gray-600">
                Our tools and recommendations are grounded in educational research and data science.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy First</h3>
              <p className="text-gray-600">
                Student privacy and data security are fundamental to our platform design and operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Educational Assessment?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of educators who are already using EduSight to unlock student potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signin"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Start Free Trial
            </a>
            <a
              href="/demo-users"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              View Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
