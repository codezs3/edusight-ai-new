'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: any; // Heroicon component
  color: string;
  description?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color,
  description
}: StatCardProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        text: 'text-blue-600'
      },
      green: {
        bg: 'from-emerald-500 to-emerald-600', 
        light: 'bg-emerald-50',
        text: 'text-emerald-600'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50', 
        text: 'text-purple-600'
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        light: 'bg-orange-50',
        text: 'text-orange-600'
      },
      red: {
        bg: 'from-red-500 to-red-600',
        light: 'bg-red-50',
        text: 'text-red-600'
      },
      indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        light: 'bg-indigo-50',
        text: 'text-indigo-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-emerald-600 bg-emerald-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${colorClasses.bg} rounded-full transform translate-x-8 -translate-y-8`}></div>
      </div>
      
      <div className="relative p-4">
        {/* Icon */}
        <div className="flex items-center justify-between mb-3">
          <div className={`w-10 h-10 ${colorClasses.light} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-5 h-5 ${colorClasses.text}`} />
          </div>
          
          {change && (
            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getChangeColor(changeType)}`}>
              {changeType === 'positive' ? '+' : changeType === 'negative' ? '-' : ''}{change}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-slate-600 font-medium text-xs uppercase tracking-wide">
            {title}
          </h3>
          <div className="text-2xl font-bold text-slate-900">
            {value}
          </div>
          {description && (
            <p className="text-slate-500 text-xs">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
