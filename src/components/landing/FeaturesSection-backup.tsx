'use client';
import {
  ChartBarIcon,
  CpuChipIcon,
  DocumentChartBarIcon,
  AcademicCapIcon,
  HeartIcon,
  UserGroupIcon,
  ClockIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Comprehensive Assessment',
    description: 'Evaluate academic performance, psychological wellbeing, and physical health in one integrated platform.',
    icon: ChartBarIcon,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    name: 'AI-Powered Analytics',
    description: 'Advanced machine learning algorithms provide personalized insights and predictive analytics.',
    icon: CpuChipIcon,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
  },
  {
    name: 'Interactive Reports',
    description: 'Beautiful, interactive reports with advanced visualizations using Plotly.js and D3.js.',
    icon: DocumentChartBarIcon,
    color: 'text-accent-600',
    bgColor: 'bg-accent-100',
  },
  {
    name: 'Academic Tracking',
    description: 'Monitor grades, study habits, and learning progress across all subjects and curricula.',
    icon: AcademicCapIcon,
    color: 'text-success-600',
    bgColor: 'bg-success-100',
  },
  {
    name: 'Wellbeing Monitoring',
    description: 'Track psychological health, stress levels, and emotional development with validated assessments.',
    icon: HeartIcon,
    color: 'text-warning-600',
    bgColor: 'bg-warning-100',
  },
  {
    name: 'Multi-User Access',
    description: 'Secure access for students, parents, teachers, and counselors with role-based permissions.',
    icon: UserGroupIcon,
    color: 'text-danger-600',
    bgColor: 'bg-danger-100',
  },
  {
    name: 'Real-Time Updates',
    description: 'Get instant notifications and updates on assessment progress and important milestones.',
    icon: ClockIcon,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    name: 'Data Security',
    description: 'Enterprise-grade security with encrypted data storage and GDPR compliance.',
    icon: ShieldCheckIcon,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
  },
];

function FeaturesSection() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-fade-in">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Comprehensive Platform
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for student success
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform combines cutting-edge technology with educational expertise to provide 
              comprehensive insights into every aspect of student development.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="flex flex-col animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>


      </div>
    </div>
  );
}

export default FeaturesSection;
