'use client';

import React from 'react';

interface CompactMetricCardProps {
  title: string;
  value: string | number;
  icon: any; // Heroicon component
  color: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  onClick?: () => void;
  className?: string;
}

export default function CompactMetricCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
  className = ''
}: CompactMetricCardProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
      purple: { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      red: { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
      cyan: { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
      pink: { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-emerald-600';
      case 'down': return 'text-red-600';
      default: return 'text-slate-500';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div 
      className={`group relative bg-white rounded-lg border ${colorClasses.border} hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          {/* Icon and Title */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 ${colorClasses.light} rounded-lg flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${colorClasses.text}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                {title}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {value}
              </p>
            </div>
          </div>
          
          {/* Trend */}
          {trend && (
            <div className={`text-xs font-medium ${getTrendColor(trend.direction)}`}>
              <span className="mr-1">{getTrendIcon(trend.direction)}</span>
              {trend.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
