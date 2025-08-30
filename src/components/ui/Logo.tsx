'use client';

import { AcademicCapIcon, CpuChipIcon } from '@heroicons/react/24/outline';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* AI-Education Logo Icon */}
      <div className="relative">
        {/* Background gradient circle */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-edu-primary-500 to-edu-secondary-500 flex items-center justify-center shadow-lg`}>
          {/* Academic cap as base */}
          <AcademicCapIcon className={`${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-6 w-6'} text-white`} />
        </div>
        {/* AI chip overlay */}
        <div className={`absolute -top-1 -right-1 ${size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} rounded-full bg-gradient-to-br from-edu-accent-400 to-edu-accent-600 flex items-center justify-center shadow-md`}>
          <CpuChipIcon className={`${size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-white`} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-to-r from-edu-primary-600 to-edu-secondary-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
            EduSight
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-edu-gray-500 -mt-1 font-medium">
              AI-Powered Education
            </span>
          )}
        </div>
      )}
    </div>
  );
}
