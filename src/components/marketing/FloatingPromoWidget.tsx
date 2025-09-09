'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  SparklesIcon, 
  ArrowRightIcon,
  XMarkIcon,
  GiftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export function FloatingPromoWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    // Show widget after 3 seconds
    const showTimer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isMinimized ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80 animate-bounce">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <GiftIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Special Offer!</h3>
                <p className="text-xs text-gray-500">Limited time only</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <SparklesIcon className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">20% OFF First Assessment</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Discover your potential with AI-powered insights
              </p>
              <div className="flex items-center space-x-2 text-xs text-red-600">
                <ClockIcon className="h-3 w-3" />
                <span>Offer expires in: {formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-green-600">
                Just ₹79 <span className="text-sm text-gray-500 line-through">₹99</span>
              </div>
              <Link
                href="/testvault"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-1"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Animated Elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-pulse"
        >
          <GiftIcon className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}
