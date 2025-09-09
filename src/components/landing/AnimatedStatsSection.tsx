'use client';

import React, { useState, useEffect } from 'react';
import { useClientOnly } from '@/hooks/useClientOnly';
import { 
  UserGroupIcon,
  GlobeAltIcon,
  CpuChipIcon,
  StarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface Stat {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
  description: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: UserGroupIcon,
    value: "10,000+",
    label: "Students Assessed",
    description: "Comprehensive evaluations completed",
    color: "from-blue-400 to-cyan-400"
  },
  {
    icon: AcademicCapIcon,
    value: "95%",
    label: "Accuracy Rate",
    description: "AI-powered assessment precision",
    color: "from-green-400 to-emerald-400"
  },
  {
    icon: ChartBarIcon,
    value: "50+",
    label: "Assessment Types",
    description: "Diverse evaluation methodologies",
    color: "from-purple-400 to-pink-400"
  },
  {
    icon: TrophyIcon,
    value: "98%",
    label: "Satisfaction Rate",
    description: "Student and parent feedback",
    color: "from-yellow-400 to-orange-400"
  }
];

export function AnimatedStatsSection() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number }>>([]);
  const mounted = useClientOnly();

  useEffect(() => {
    if (!mounted) return;
    
    // Generate particles only on client side
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
    setParticles(newParticles);
  }, [mounted]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {mounted && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Numbers That
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Speak Volumes
            </span>
          </h2>
          
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Our impact is measured not just in numbers, but in the lives we transform 
            and the futures we help shape.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="relative p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center hover:bg-white/20 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                {/* Value */}
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-blue-200 mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-blue-300">
                  {stat.description}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-200">Support Available</div>
          </div>
          
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-blue-200">Uptime Guarantee</div>
          </div>
          
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">1000+</div>
            <div className="text-blue-200">Tests Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}