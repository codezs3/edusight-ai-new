'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  SparklesIcon, 
  ArrowRightIcon,
  UserIcon,
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const discoveryAnchors = [
  {
    id: 1,
    question: "Does your child struggle to choose the right career path?",
    insight: "85% of students change their career choice 3+ times before finding their true calling",
    emotion: "confusion",
    solution: "Our AI-powered assessments reveal hidden talents and natural inclinations"
  },
  {
    id: 2,
    question: "Are you worried about your child's future in an uncertain world?",
    insight: "Students with clear career direction are 3x more likely to succeed",
    emotion: "worry",
    solution: "Get personalized career guidance based on personality, skills, and market trends"
  },
  {
    id: 3,
    question: "Do you want to unlock your child's hidden potential?",
    insight: "Every child has unique strengths - 70% remain undiscovered without proper assessment",
    emotion: "curiosity",
    solution: "Discover strengths, learning styles, and optimal career paths through scientific analysis"
  },
  {
    id: 4,
    question: "Are you tired of generic career advice that doesn't fit your child?",
    insight: "One-size-fits-all advice fails 78% of students in career satisfaction",
    emotion: "frustration",
    solution: "Get personalized insights tailored specifically to your child's unique profile"
  }
];

const benefits = [
  {
    icon: "🧠",
    title: "Personality Analysis",
    description: "Deep dive into personality traits, learning styles, and behavioral patterns",
    features: ["Big 5 Personality Traits", "Learning Style Assessment", "Communication Preferences", "Decision-Making Patterns"]
  },
  {
    icon: "🎯",
    title: "Skill Assessment",
    description: "Comprehensive evaluation of cognitive abilities and skill strengths",
    features: ["Logical Reasoning", "Creative Thinking", "Problem-Solving", "Memory & Processing"]
  },
  {
    icon: "🚀",
    title: "Career Mapping",
    description: "AI-powered career recommendations based on personality and skills",
    features: ["Top 10 Career Matches", "Salary Projections", "Growth Opportunities", "Required Skills Gap"]
  },
  {
    icon: "📊",
    title: "Detailed Reports",
    description: "Comprehensive 25-page report with actionable insights and recommendations",
    features: ["Strengths & Weaknesses", "Learning Recommendations", "Career Roadmap", "Development Plan"]
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Parent of Class 12 Student",
    content: "The assessment revealed my daughter's natural talent for data analysis. She's now pursuing Data Science and loving every moment!",
    rating: 5
  },
  {
    name: "Rajesh Kumar",
    role: "Parent of Class 10 Student",
    content: "We were confused about choosing between Engineering and Medicine. The detailed report made the decision crystal clear.",
    rating: 5
  },
  {
    name: "Anita Patel",
    role: "Student, Class 11",
    content: "I discovered I have strong leadership qualities I never knew about. Now I'm confident about my future in management.",
    rating: 5
  }
];

export function PersonalityDiscoveryAd() {
  const [currentAnchor, setCurrentAnchor] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentAnchor((prev) => (prev + 1) % discoveryAnchors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section with Emotional Anchors */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            <span className="text-lg font-semibold text-purple-800">Discover Your True Potential</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Stop Guessing. Start{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Knowing.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Unlock the mystery of your personality, discover hidden talents, and find the perfect career path 
            with our scientifically-backed AI assessments. No more confusion, no more wrong choices.
          </p>

          {/* Animated Question Rotator */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
            <div className="text-left">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {discoveryAnchors[currentAnchor].question}
                  </h3>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                    <p className="text-red-800 font-medium">
                      💡 <strong>Reality Check:</strong> {discoveryAnchors[currentAnchor].insight}
                    </p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <p className="text-green-800 font-medium">
                      ✅ <strong>Solution:</strong> {discoveryAnchors[currentAnchor].solution}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/testvault"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Discover My Potential Now</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center space-x-2">
              <span>View Sample Report</span>
              <ChartBarIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You'll Discover About Yourself
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Real Stories, Real Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Section */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              ⏰ Limited Time Offer - Don't Miss Out!
            </h2>
            <p className="text-xl mb-6">
              Get your comprehensive personality and career assessment for just <span className="line-through">₹199</span> <span className="text-3xl font-bold">₹99</span>
            </p>
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm opacity-90">Students Assessed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm opacity-90">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24hrs</div>
                <div className="text-sm opacity-90">Report Delivery</div>
              </div>
            </div>
            <Link
              href="/testvault"
              className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            >
              <span>Start My Assessment Now</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How accurate are these assessments?
              </h3>
              <p className="text-gray-600">
                Our assessments are based on scientifically validated psychological models and have a 92% accuracy rate in career prediction. They're used by leading educational institutions worldwide.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does it take to complete?
              </h3>
              <p className="text-gray-600">
                The complete assessment takes 45-60 minutes and can be completed in multiple sessions. You'll receive your detailed report within 24 hours.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What age groups can take these assessments?
              </h3>
              <p className="text-gray-600">
                Our assessments are designed for students from Class 8 to Class 12, as well as college students and young professionals up to age 25.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
