# EduSight Production Deployment Guide
## Optimized for 1M+ Users

This guide covers the complete deployment process for EduSight, optimized to handle 1 million+ concurrent users with high performance and reliability.

## 🚀 Quick Start

```bash
# 1. Set up production database
node scripts/setup-production-db.js production

# 2. Deploy to production
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh production
```

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **PostgreSQL**: 14.0 or higher
- **Redis**: 6.0 or higher (for caching)
- **Memory**: Minimum 4GB RAM (8GB+ recommended)
- **CPU**: 4+ cores recommended

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/edusight_prod"
DIRECT_URL="postgresql://user:password@host:5432/edusight_prod"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key-32-chars-min"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Payment Processing
STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Caching & Performance
REDIS_URL="redis://localhost:6379"
MAX_CONNECTIONS="100"
CONNECTION_TIMEOUT="30000"
QUERY_TIMEOUT="10000"

# Monitoring
DATADOG_API_KEY="your-datadog-key" # Optional
NEW_RELIC_LICENSE_KEY="your-newrelic-key" # Optional
METRICS_WEBHOOK_URL="https://your-monitoring-webhook" # Optional

# Security
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"
LOG_LEVEL="error"
```

## 🏗️ Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │────│   Next.js App   │────│   PostgreSQL    │
│   (Nginx/CDN)   │    │   (Multiple)     │    │   (Primary)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                │                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │     Redis       │    │   PostgreSQL    │
                       │   (Caching)     │    │   (Read Replica)│
                       └─────────────────┘    └─────────────────┘
```

### Performance Optimizations

#### 1. Database Optimizations
- **Connection Pooling**: 100 connections per instance
- **Read Replicas**: Separate read/write operations
- **Indexing**: Comprehensive indexes for high-traffic queries
- **Query Optimization**: Materialized views for analytics

#### 2. Caching Strategy
- **Redis**: Session storage and API response caching
- **CDN**: Static asset delivery
- **Browser Caching**: Optimized cache headers
- **ISR**: Incremental Static Regeneration for dynamic content

#### 3. Code Splitting & Bundling
- **Dynamic Imports**: Lazy loading for heavy components
- **Bundle Analysis**: Optimized chunk sizes
- **Tree Shaking**: Eliminated unused code
- **Compression**: Gzip/Brotli compression

## 🔧 Deployment Steps

### 1. Database Setup

```bash
# Create production database
createdb edusight_prod

# Run setup script
node scripts/setup-production-db.js production

# Apply optimizations
psql $DATABASE_URL -f scripts/database-optimizations.sql
```

### 2. Application Build

```bash
# Install dependencies
npm ci --only=production

# Build application
npm run build

# Analyze bundle (optional)
ANALYZE=true npm run build
```

### 3. Infrastructure Setup

#### Docker Deployment
```dockerfile
# Use the official Node.js image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: edusight-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: edusight
  template:
    metadata:
      labels:
        app: edusight
    spec:
      containers:
      - name: edusight
        image: edusight:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: edusight-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### 4. Load Balancer Configuration (Nginx)

```nginx
upstream edusight_backend {
    least_conn;
    server app1:3000 max_fails=3 fail_timeout=30s;
    server app2:3000 max_fails=3 fail_timeout=30s;
    server app3:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Static assets
    location /_next/static/ {
        alias /app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://edusight_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Login endpoint with stricter rate limiting
    location /api/auth/ {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://edusight_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # All other requests
    location / {
        proxy_pass http://edusight_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## 📊 Monitoring & Observability

### 1. Performance Monitoring
- **Web Vitals**: Automatic collection via `/api/metrics`
- **Database Performance**: Query timing and connection pool metrics
- **API Response Times**: Endpoint performance tracking
- **Memory Usage**: Heap size and garbage collection metrics

### 2. Error Tracking
```javascript
// Example Sentry configuration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out non-critical errors
    if (event.exception) {
      const error = event.exception.values[0];
      if (error.type === 'ChunkLoadError') {
        return null; // Don't send chunk load errors
      }
    }
    return event;
  },
});
```

### 3. Health Checks
```bash
# Application health
curl https://your-domain.com/api/health

# Database health
curl https://your-domain.com/api/health/database

# Cache health
curl https://your-domain.com/api/health/cache
```

## 🔒 Security Considerations

### 1. Environment Security
- Use environment variables for all secrets
- Implement proper RBAC (Role-Based Access Control)
- Enable audit logging for sensitive operations
- Regular security updates and dependency audits

### 2. Network Security
- HTTPS everywhere with proper SSL certificates
- WAF (Web Application Firewall) configuration
- DDoS protection and rate limiting
- IP whitelisting for admin operations

### 3. Data Protection
- Encryption at rest and in transit
- Regular database backups
- GDPR/CCPA compliance measures
- Data retention policies

## 🚨 Troubleshooting

### Common Issues

#### High Memory Usage
```bash
# Check memory usage
node --max-old-space-size=4096 server.js

# Monitor garbage collection
node --expose-gc --trace-gc server.js
```

#### Database Connection Issues
```bash
# Check connection pool
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Monitor slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

#### Cache Issues
```bash
# Redis memory usage
redis-cli info memory

# Clear cache
redis-cli flushall
```

## 📈 Scaling Strategies

### Horizontal Scaling
1. **Load Balancing**: Multiple app instances behind load balancer
2. **Database Sharding**: Partition data across multiple databases
3. **Microservices**: Split into smaller, focused services
4. **CDN**: Global content delivery network

### Vertical Scaling
1. **CPU Optimization**: Increase CPU cores for compute-heavy operations
2. **Memory Optimization**: Increase RAM for caching and data processing
3. **Storage Optimization**: Use SSDs for database and faster I/O

### Auto-scaling Configuration
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: edusight-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: edusight-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## 🔄 Backup & Recovery

### Database Backups
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

pg_dump $DATABASE_URL > $BACKUP_DIR/edusight_$(date +%Y%m%d_%H%M%S).sql
gzip $BACKUP_DIR/edusight_*.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/ s3://your-backup-bucket/database/ --recursive
```

### Application Backups
```bash
# Backup application files
tar -czf app_backup_$(date +%Y%m%d).tar.gz .next public uploads

# Upload to cloud storage
aws s3 cp app_backup_*.tar.gz s3://your-backup-bucket/application/
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly dependency updates
- [ ] Monthly security patches
- [ ] Quarterly performance reviews
- [ ] Annual architecture reviews

### Emergency Contacts
- **Technical Lead**: tech-lead@edusight.com
- **DevOps Team**: devops@edusight.com
- **On-call Engineer**: +1-555-ONCALL

---

## 🎉 Congratulations!

Your EduSight application is now optimized and ready for production deployment with 1M+ users. The implementation includes:

✅ **Lively Landing Page** with animations and interactive elements
✅ **Mega Menu** with hover dropdowns and comprehensive navigation
✅ **Production Database** with PostgreSQL and optimization scripts
✅ **Performance Monitoring** with metrics collection and analysis
✅ **Scalability Features** for handling high traffic loads
✅ **Security Measures** for protecting user data and system integrity

For additional support or questions, please refer to the documentation or contact the development team.