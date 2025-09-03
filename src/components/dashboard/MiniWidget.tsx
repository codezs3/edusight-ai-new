'use client';

import React from 'react';

interface MiniWidgetProps {
  title: string;
  value: string | number;
  icon: any; // Heroicon component
  color: string;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export default function MiniWidget({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  onClick,
  className = ''
}: MiniWidgetProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600' },
      green: { bg: 'bg-emerald-500', text: 'text-emerald-600' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600' },
      red: { bg: 'bg-red-500', text: 'text-red-600' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600' },
      cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600' },
      pink: { bg: 'bg-pink-500', text: 'text-pink-600' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600' },
      slate: { bg: 'bg-slate-500', text: 'text-slate-600' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div 
      className={`group bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="p-3">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className={`w-8 h-8 ${colorClasses.bg} rounded-lg flex items-center justify-center shadow-sm`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="text-sm font-bold text-slate-900">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
