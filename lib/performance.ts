// Performance monitoring and optimization utilities for 1M+ users

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

interface DatabaseMetrics {
  queryTime: number;
  connectionPoolSize: number;
  activeConnections: number;
  slowQueries: number;
}

interface CacheMetrics {
  hitRate: number;
  missRate: number;
  evictionRate: number;
  memoryUsage: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, any> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals();
    }
  }

  // Initialize Web Vitals monitoring
  private initializeWebVitals() {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('FID', (entry as any).processingStart - entry.startTime);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.recordMetric('CLS', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);

    // Time to First Byte
    this.measureTTFB();
  }

  // Measure Time to First Byte
  private measureTTFB() {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.recordMetric('TTFB', ttfb);
    }
  }

  // Record performance metric
  recordMetric(name: string, value: number, tags?: Record<string, string>) {
    const timestamp = Date.now();
    const metric = {
      name,
      value,
      timestamp,
      tags: tags || {},
    };

    this.metrics.set(`${name}_${timestamp}`, metric);

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(metric);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value}ms`, tags);
    }
  }

  // Database query performance tracking
  async trackDatabaseQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await queryFn();
      const duration = performance.now() - startTime;
      
      this.recordMetric('db_query_duration', duration, {
        query: queryName,
        status: 'success',
        ...tags,
      });

      // Log slow queries
      if (duration > 1000) { // > 1 second
        console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
        this.recordMetric('db_slow_query', duration, {
          query: queryName,
          ...tags,
        });
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordMetric('db_query_duration', duration, {
        query: queryName,
        status: 'error',
        ...tags,
      });

      throw error;
    }
  }

  // API endpoint performance tracking
  async trackAPICall<T>(
    endpoint: string,
    apiFn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await apiFn();
      const duration = performance.now() - startTime;
      
      this.recordMetric('api_call_duration', duration, {
        endpoint,
        status: 'success',
        ...tags,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.recordMetric('api_call_duration', duration, {
        endpoint,
        status: 'error',
        ...tags,
      });

      throw error;
    }
  }

  // Cache performance tracking
  recordCacheMetrics(metrics: CacheMetrics) {
    this.recordMetric('cache_hit_rate', metrics.hitRate);
    this.recordMetric('cache_miss_rate', metrics.missRate);
    this.recordMetric('cache_eviction_rate', metrics.evictionRate);
    this.recordMetric('cache_memory_usage', metrics.memoryUsage);
  }

  // Memory usage tracking
  trackMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory_used', memory.usedJSHeapSize);
      this.recordMetric('memory_total', memory.totalJSHeapSize);
      this.recordMetric('memory_limit', memory.jsHeapSizeLimit);
    }
  }

  // User interaction tracking
  trackUserInteraction(action: string, element: string, duration?: number) {
    this.recordMetric('user_interaction', duration || 0, {
      action,
      element,
    });
  }

  // Page load performance
  trackPageLoad(route: string) {
    if (typeof window !== 'undefined') {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigationEntry) {
        const loadTime = navigationEntry.loadEventEnd - navigationEntry.navigationStart;
        const domContentLoaded = navigationEntry.domContentLoadedEventEnd - navigationEntry.navigationStart;
        
        this.recordMetric('page_load_time', loadTime, { route });
        this.recordMetric('dom_content_loaded', domContentLoaded, { route });
      }
    }
  }

  // Send metrics to monitoring service
  private async sendToMonitoringService(metric: any) {
    try {
      // Example: Send to your monitoring service
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to send metric to monitoring service:', error);
    }
  }

  // Get performance summary
  getPerformanceSummary(): PerformanceMetrics | null {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    
    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
      firstContentfulPaint: fcp ? fcp.startTime : 0,
      largestContentfulPaint: this.getMetricValue('LCP') || 0,
      cumulativeLayoutShift: this.getMetricValue('CLS') || 0,
      firstInputDelay: this.getMetricValue('FID') || 0,
      timeToInteractive: this.calculateTTI(),
    };
  }

  // Calculate Time to Interactive
  private calculateTTI(): number {
    // Simplified TTI calculation
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation ? navigation.domInteractive - navigation.navigationStart : 0;
  }

  // Get specific metric value
  private getMetricValue(metricName: string): number | null {
    const entries = Array.from(this.metrics.values())
      .filter(metric => metric.name === metricName)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return entries.length > 0 ? entries[0].value : null;
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Rate limiting utility for API endpoints
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];
    
    // Filter out requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if under the limit
    if (validRequests.length < maxRequests) {
      validRequests.push(now);
      this.requests.set(identifier, validRequests);
      return true;
    }

    return false;
  }

  cleanup() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    // Clean up old entries
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > oneHourAgo);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Connection pool monitoring
export class ConnectionPoolMonitor {
  private poolStats: DatabaseMetrics = {
    queryTime: 0,
    connectionPoolSize: 0,
    activeConnections: 0,
    slowQueries: 0,
  };

  updateStats(stats: Partial<DatabaseMetrics>) {
    this.poolStats = { ...this.poolStats, ...stats };
    
    // Alert if pool is getting full
    if (this.poolStats.activeConnections / this.poolStats.connectionPoolSize > 0.8) {
      console.warn('Connection pool is 80% full');
    }
  }

  getStats(): DatabaseMetrics {
    return { ...this.poolStats };
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility functions
export const trackPageView = (route: string) => {
  performanceMonitor.trackPageLoad(route);
};

export const trackUserAction = (action: string, element: string) => {
  performanceMonitor.trackUserInteraction(action, element);
};

export const trackAPIPerformance = async <T>(
  endpoint: string,
  apiFn: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.trackAPICall(endpoint, apiFn);
};

export const trackDatabasePerformance = async <T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.trackDatabaseQuery(queryName, queryFn);
};
