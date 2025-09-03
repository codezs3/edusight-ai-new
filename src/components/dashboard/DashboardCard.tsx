'use client';

import React, { ReactNode } from 'react';
import { IconType } from 'react-icons';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: any; // Heroicon component
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  gradient?: string;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  gradient = 'from-blue-500 to-indigo-600',
  onClick,
  className = '',
  children
}: DashboardCardProps) {
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-emerald-600 bg-emerald-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/30 rounded-2xl"></div>
      
      {/* Card Content */}
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-slate-600 font-medium text-xs uppercase tracking-wide mb-1">
              {title}
            </h3>
            <div className="text-2xl font-bold text-slate-900 mb-1">
              {value}
            </div>
            {subtitle && (
              <p className="text-slate-500 text-xs">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Icon */}
          {Icon && (
            <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(trend.direction)}`}>
              <span className="mr-1">{getTrendIcon(trend.direction)}</span>
              {trend.value}
            </div>
            <div className="text-xs text-slate-400">vs last month</div>
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mt-3">
            {children}
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}
