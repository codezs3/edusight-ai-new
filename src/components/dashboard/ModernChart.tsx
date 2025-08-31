'use client';

import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ModernChartProps {
  title: string;
  data: ChartData[];
  type?: 'bar' | 'line' | 'donut' | 'area';
  height?: number;
  className?: string;
}

export default function ModernChart({
  title,
  data,
  type = 'bar',
  height = 300,
  className = ''
}: ModernChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
            style={{ 
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: '8px'
            }}
          ></div>
          <div className="text-xs text-slate-600 mt-2 text-center font-medium">
            {item.label}
          </div>
          <div className="text-xs text-slate-900 font-bold">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="relative h-full">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={40 + i * 32}
            x2="400"
            y2={40 + i * 32}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        ))}
        
        {/* Line path */}
        <path
          d={`M ${data.map((item, index) => 
            `${(index * 400) / (data.length - 1)},${200 - (item.value / maxValue) * 160}`
          ).join(' L ')}`}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Area fill */}
        <path
          d={`M ${data.map((item, index) => 
            `${(index * 400) / (data.length - 1)},${200 - (item.value / maxValue) * 160}`
          ).join(' L ')} L 400,200 L 0,200 Z`}
          fill="url(#lineGradient)"
        />
        
        {/* Data points */}
        {data.map((item, index) => (
          <circle
            key={index}
            cx={(index * 400) / (data.length - 1)}
            cy={200 - (item.value / maxValue) * 160}
            r="4"
            fill="#3B82F6"
            stroke="white"
            strokeWidth="2"
            className="hover:r-6 transition-all duration-200"
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-600">
        {data.map((item, index) => (
          <span key={index} className="font-medium">{item.label}</span>
        ))}
      </div>
    </div>
  );

  const renderDonutChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="80"
                  cy="80"
                  r="70"
                  fill="transparent"
                  stroke={colors[index % colors.length]}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:stroke-width-16"
                  pathLength="100"
                />
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{total}</div>
              <div className="text-xs text-slate-600">Total</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-xs text-slate-600">{item.label}</span>
              <span className="text-xs font-semibold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line': return renderLineChart();
      case 'donut': return renderDonutChart();
      case 'area': return renderLineChart();
      default: return renderBarChart();
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">{title}</h3>
        <div style={{ height: `${height}px` }}>
          {renderChart()}
        </div>
      </div>
    </div>
  );
}
