import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting for metrics endpoint
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - userLimit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  userLimit.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const headersList = headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Apply rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const metric = await request.json();

    // Validate metric structure
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric format' },
        { status: 400 }
      );
    }

    // Add metadata
    const enrichedMetric = {
      ...metric,
      timestamp: metric.timestamp || Date.now(),
      ip,
      userAgent: headersList.get('user-agent'),
      environment: process.env.NODE_ENV,
    };

    // In production, send to your monitoring service
    if (process.env.NODE_ENV === 'production') {
      await sendToMonitoringService(enrichedMetric);
    } else {
      // Log in development
      console.log('Performance Metric:', enrichedMetric);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing metric:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendToMonitoringService(metric: any) {
  // Example implementations for different monitoring services:
  
  // 1. DataDog
  if (process.env.DATADOG_API_KEY) {
    try {
      await fetch('https://api.datadoghq.com/api/v1/series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': process.env.DATADOG_API_KEY,
        },
        body: JSON.stringify({
          series: [{
            metric: `edusight.${metric.name}`,
            points: [[metric.timestamp / 1000, metric.value]],
            tags: Object.entries(metric.tags || {}).map(([k, v]) => `${k}:${v}`),
          }],
        }),
      });
    } catch (error) {
      console.error('Failed to send metric to DataDog:', error);
    }
  }

  // 2. New Relic
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      await fetch('https://metric-api.newrelic.com/metric/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.NEW_RELIC_LICENSE_KEY,
        },
        body: JSON.stringify([{
          metrics: [{
            name: `edusight.${metric.name}`,
            type: 'gauge',
            value: metric.value,
            timestamp: metric.timestamp,
            attributes: metric.tags || {},
          }],
        }]),
      });
    } catch (error) {
      console.error('Failed to send metric to New Relic:', error);
    }
  }

  // 3. Custom webhook
  if (process.env.METRICS_WEBHOOK_URL) {
    try {
      await fetch(process.env.METRICS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.METRICS_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to send metric to webhook:', error);
    }
  }

  // 4. Store in database for custom analytics
  if (process.env.STORE_METRICS_IN_DB === 'true') {
    try {
      // You would implement database storage here
      // Example with Prisma:
      /*
      await prisma.performanceMetric.create({
        data: {
          name: metric.name,
          value: metric.value,
          timestamp: new Date(metric.timestamp),
          tags: metric.tags,
          metadata: {
            ip: metric.ip,
            userAgent: metric.userAgent,
            environment: metric.environment,
          },
        },
      });
      */
    } catch (error) {
      console.error('Failed to store metric in database:', error);
    }
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
  });
}
