const { IncrementalCache } = require('@neshca/cache-handler');
const createRedisHandler = require('@neshca/cache-handler/redis-strings').default;
const createLruHandler = require('@neshca/cache-handler/local-lru').default;

// Redis configuration for production caching
const redisHandler = createRedisHandler({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  keyPrefix: 'edusight:',
  timeoutMs: 1000,
  // Connection pool settings for high traffic
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// Local LRU cache as fallback
const lruHandler = createLruHandler({
  maxItemsNumber: 1000,
  maxItemSizeBytes: 1024 * 1024, // 1MB per item
});

// Create incremental cache with Redis primary and LRU fallback
const incrementalCache = new IncrementalCache({
  cache: [redisHandler, lruHandler],
  
  // Cache configuration for different content types
  cacheConfig: {
    // Static pages - cache for 1 hour
    '/': { revalidate: 3600 },
    '/about': { revalidate: 3600 },
    '/contact': { revalidate: 3600 },
    '/pricing': { revalidate: 1800 }, // 30 minutes for pricing
    
    // Dynamic pages - shorter cache times
    '/dashboard': { revalidate: 300 }, // 5 minutes
    '/assessments': { revalidate: 600 }, // 10 minutes
    '/analytics': { revalidate: 300 }, // 5 minutes
    
    // API routes - very short cache times
    '/api/users': { revalidate: 60 }, // 1 minute
    '/api/assessments': { revalidate: 120 }, // 2 minutes
    '/api/analytics': { revalidate: 180 }, // 3 minutes
    
    // Static assets - long cache times
    '/_next/static': { revalidate: 31536000 }, // 1 year
    '/static': { revalidate: 31536000 }, // 1 year
  },

  // Error handling
  onError: (error) => {
    console.error('Cache handler error:', error);
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, DataDog, etc.
      // captureException(error);
    }
  },

  // Performance monitoring
  onHit: (key) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache HIT: ${key}`);
    }
  },

  onMiss: (key) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Cache MISS: ${key}`);
    }
  },
});

module.exports = incrementalCache;
