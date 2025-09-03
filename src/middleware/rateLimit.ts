import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
}

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, max, message = 'Too many requests', statusCode = 429 } = config;

  return function rateLimitMiddleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const key = `rate_limit:${ip}`;
    const now = Date.now();

    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key].count++;
    }

    if (store[key].count > max) {
      return NextResponse.json(
        { error: message },
        { status: statusCode }
      );
    }

    return NextResponse.next();
  };
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key] && now > store[key].resetTime) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);
