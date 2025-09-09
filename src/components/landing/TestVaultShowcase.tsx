import { 
  SparklesIcon, 
  ArrowRightIcon,
  StarIcon,
  ClockIcon,
  CpuChipIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const featuredAssessments = [
  {
    id: '1',
    title: 'Cognitive Intelligence Assessment',
    description: 'Comprehensive evaluation of logical reasoning and analytical thinking.',
    icon: '🧠',
    rating: 4.8,
    reviews: 1247,
    duration: '45 min',
    price: 99,
    isPopular: true,
    successRate: 87,
    avgScore: 78
  },
  {
    id: '2',
    title: 'Mathematical Aptitude Mastery',
    description: 'Advanced mathematical reasoning for competitive exams.',
    icon: '📊',
    rating: 4.9,
    reviews: 892,
    duration: '60 min',
    price: 99,
    isPopular: true,
    successRate: 82,
    avgScore: 74
  },
  {
    id: '3',
    title: 'Emotional Intelligence Profiler',
    description: 'Assess emotional awareness and social skills.',
    icon: '💝',
    rating: 4.7,
    reviews: 1156,
    duration: '25 min',
    price: 99,
    isPopular: false,
    successRate: 89,
    avgScore: 76
  }
];

export function TestVaultShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 mb-4">
            <SparklesIcon className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Premium Assessments</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Potential with{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TestVault
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered assessments designed to unlock your true potential. 
            Get personalized insights and career guidance at just ₹99 per assessment.
          </p>
        </div>

        {/* Featured Assessments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Assessment Header */}
              <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-4xl">{assessment.icon}</div>
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium" style={{ display: assessment.isPopular ? 'block' : 'none' }}>
                  Popular
                </div>
              </div>

              {/* Assessment Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {assessment.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {assessment.description}
                </p>

                {/* Rating and Duration */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{assessment.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({assessment.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4" />
                    <span>{assessment.duration}</span>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CpuChipIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">AI Insights</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                    <div className="flex items-center space-x-1">
                      <CheckCircleIcon className="h-3 w-3" />
                      <span>{assessment.successRate}% Success</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircleIcon className="h-3 w-3" />
                      <span>Avg: {assessment.avgScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">₹{assessment.price}</div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">
                    View Details
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Discover Your Potential?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of students and professionals who have unlocked their potential 
              with our AI-powered assessments. Get personalized insights and career guidance.
            </p>
            <a
              href="/testvault"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Explore TestVault</span>
              <ArrowRightIcon className="h-5 w-5" />
            </a>
            <p className="text-sm text-gray-500 mt-4">
              No payment gateway connected yet • Premium assessments at ₹99 each
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}