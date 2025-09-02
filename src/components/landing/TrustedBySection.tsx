'use client';

import { useState, useEffect } from 'react';

export function TrustedBySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const partners = [
    { name: 'Delhi Public School', logo: '🏫', type: 'School Chain' },
    { name: 'Kendriya Vidyalaya', logo: '🎓', type: 'Government Schools' },
    { name: 'Ryan International', logo: '🌟', type: 'International Schools' },
    { name: 'DAV Schools', logo: '📚', type: 'Educational Trust' },
    { name: 'Amity Schools', logo: '🏛️', type: 'Private Schools' },
    { name: 'CBSE Board', logo: '📋', type: 'Education Board' },
    { name: 'ICSE Council', logo: '🎯', type: 'Education Council' },
    { name: 'IB Schools', logo: '🌍', type: 'International Baccalaureate' }
  ];

  const stats = [
    { number: '500+', label: 'Partner Schools', color: 'text-blue-600' },
    { number: '50,000+', label: 'Students Assessed', color: 'text-green-600' },
    { number: '25+', label: 'States Covered', color: 'text-purple-600' },
    { number: '98%', label: 'Satisfaction Rate', color: 'text-orange-600' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4) % partners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [mounted, partners.length]);

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Leading Educational Institutions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of schools and educators who are transforming student assessment with EduSight
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partner Logos Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
              {partners.slice(mounted ? currentIndex : 0, (mounted ? currentIndex : 0) + 4).map((partner, index) => (
                <div 
                  key={`${currentIndex}-${index}`}
                  className="group flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 animate-fade-in"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {partner.logo}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-center mb-1">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center">
                    {partner.type}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(partners.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 4)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  Math.floor((mounted ? currentIndex : 0) / 4) === index 
                    ? 'bg-primary-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-xl text-gray-700 italic mb-6">
              "EduSight has revolutionized how we understand and nurture our students' potential. 
              The AI-powered insights have helped us create more personalized learning experiences."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-primary-600 font-bold">Dr</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Dr. Priya Sharma</div>
                <div className="text-gray-600 text-sm">Principal, Delhi Public School</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
