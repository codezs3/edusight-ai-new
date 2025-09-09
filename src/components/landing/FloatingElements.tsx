'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useClientOnly } from '@/hooks/useClientOnly';
import { 
  StarIcon,
  SparklesIcon,
  HeartIcon,
  LightBulbIcon,
  AcademicCapIcon,
  TrophyIcon,
  RocketLaunchIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface FloatingElement {
  id: number;
  icon: React.ComponentType<any>;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const mounted = useClientOnly();
  const [parent] = useAutoAnimate();

  const icons = [
    StarIcon,
    SparklesIcon,
    HeartIcon,
    LightBulbIcon,
    AcademicCapIcon,
    TrophyIcon,
    RocketLaunchIcon,
    CpuChipIcon
  ];

  const colors = [
    'text-blue-400',
    'text-purple-400',
    'text-green-400',
    'text-orange-400',
    'text-pink-400',
    'text-cyan-400',
    'text-yellow-400',
    'text-red-400'
  ];

  useEffect(() => {
    if (!mounted) return;
    
    const generateElements = () => {
      const newElements: FloatingElement[] = [];
      
      for (let i = 0; i < 15; i++) {
        const iconIndex = Math.floor(Math.random() * icons.length);
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        newElements.push({
          id: i,
          icon: icons[iconIndex] || StarIcon,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 5,
          color: colors[colorIndex] || 'text-blue-400'
        });
      }
      
      setElements(newElements);
    };

    generateElements();
  }, [mounted]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div ref={parent} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => {
        const IconComponent = element.icon;
        return (
          <div
            key={element.id}
            className="absolute opacity-20 animate-bounce"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            <IconComponent className={`${element.color} w-4 h-4`} />
          </div>
        );
      })}
    </div>
  );
}

export function ParticleSystem() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);
  const mounted = useClientOnly();
  const [parent] = useAutoAnimate();

  useEffect(() => {
    if (!mounted) return;
    
    const generateParticles = () => {
      const newParticles = [];
      
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          delay: Math.random() * 3,
          duration: Math.random() * 8 + 4
        });
      }
      
      setParticles(newParticles);
    };

    generateParticles();
  }, [mounted]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div ref={parent} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-30"
        style={{
          left: '10%',
          top: '20%',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />
      
      <div
        className="absolute w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl opacity-30"
        style={{
          right: '10%',
          bottom: '20%',
          animation: 'pulse 4s ease-in-out infinite 2s'
        }}
      />
      
      <div
        className="absolute w-64 h-64 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl opacity-30"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse 4s ease-in-out infinite 1s'
        }}
      />
    </div>
  );
}

export function InteractiveCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const mounted = useClientOnly();

  useEffect(() => {
    if (!mounted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mounted]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
      style={{
        left: mousePosition.x - 20,
        top: mousePosition.y - 20,
        transform: `scale(${isHovering ? 1.5 : 1})`,
        opacity: isHovering ? 0.8 : 0.3
      }}
    >
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
    </div>
  );
}
