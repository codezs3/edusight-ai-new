'use client';

const stats = [
  { id: 1, name: 'Students Assessed', value: '10,000+', description: 'Comprehensive assessments completed' },
  { id: 2, name: 'Accuracy Rate', value: '95%', description: 'AI prediction accuracy' },
  { id: 3, name: 'Schools', value: '500+', description: 'Educational institutions trust us' },
  { id: 4, name: 'Countries', value: '25+', description: 'Global reach and impact' },
];

export function StatsSection() {
  return (
    <div className="bg-primary-600 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Trusted by educators worldwide
            </h2>
            <p className="mt-4 text-lg leading-8 text-primary-200">
              Our platform has helped thousands of students achieve their full potential
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="flex flex-col bg-primary-700 p-8 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <dt className="text-sm font-semibold leading-6 text-primary-200">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </dd>
                <dd className="mt-2 text-xs leading-5 text-primary-300">
                  {stat.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
