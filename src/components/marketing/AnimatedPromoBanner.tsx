'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  SparklesIcon, 
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const promoMessages = [
  {
    id: 1,
    text: "🔥 Limited Time: Get 20% OFF your first assessment!",
    icon: "🔥",
    color: "from-red-500 to-orange-500"
  },
  {
    id: 2,
    text: "⭐ Join 10,000+ students who discovered their potential!",
    icon: "⭐",
    color: "from-yellow-500 to-amber-500"
  },
  {
    id: 3,
    text: "🚀 AI-Powered insights at just ₹99 - Unlock your future!",
    icon: "🚀",
    color: "from-blue-500 to-purple-500"
  },
  {
    id: 4,
    text: "💎 Premium assessments with instant results!",
    icon: "💎",
    color: "from-purple-500 to-pink-500"
  }
];

export function AnimatedPromoBanner() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % promoMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`relative overflow-hidden transition-all duration-300 ${isClosing ? 'opacity-0 h-0' : 'opacity-100 h-auto'}`}>
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Animated Message */}
            <div className="flex items-center space-x-3 flex-1">
              <div className="text-2xl animate-bounce">
                {promoMessages[currentMessage].icon}
              </div>
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium animate-pulse">
                  {promoMessages[currentMessage].text}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-3">
              <Link
                href="/testvault"
                className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 animate-pulse"
              >
                <span>Explore Now</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-1 left-1/4 w-2 h-2 bg-pink-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}
