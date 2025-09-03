# EduSight Platform - Environment Setup Guide

## Overview
This guide provides step-by-step instructions for configuring the EduSight platform for production deployment.

## Environment Variables Required

### 1. Create `.env.local` file
Create a `.env.local` file in your project root with the following variables:

```bash
# Database Configuration
DATABASE_URL="file:./dev.db"
# For production: DATABASE_URL="postgresql://username:password@localhost:5432/edusight"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3001"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key-here-change-in-production"

# Application Configuration
NODE_ENV="development"
# For production: NODE_ENV="production"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"
# For production: NEXT_PUBLIC_API_URL="https://yourdomain.com"

# Logging Configuration
LOG_LEVEL="info"
# Options: debug, info, warn, error

# Security Configuration
ENABLE_RATE_LIMIT="true"
ENABLE_SECURITY_HEADERS="true"
ENABLE_CORS="true"
ENABLE_VIRUS_SCANNING="false"
ENABLE_SUSPICIOUS_ACTIVITY_DETECTION="true"

# File Upload Configuration
MAX_FILE_SIZE="10485760"
MAX_FILES_PER_UPLOAD="5"
UPLOAD_DIRECTORY="./uploads"

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# CORS Configuration
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
# For production: ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"

# Monitoring Configuration
ENABLE_AUDIT_LOGGING="true"
ENABLE_SECURITY_LOGGING="true"
ENABLE_PERFORMANCE_MONITORING="false"
```

## Production Deployment Checklist

### 1. Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `NEXTAUTH_SECRET` (use: `openssl rand -base64 32`)
- [ ] Generate strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Configure production `DATABASE_URL`
- [ ] Set production `NEXT_PUBLIC_API_URL`

### 2. Database Setup
- [ ] Create production database
- [ ] Run database migrations: `npx prisma db push`
- [ ] Verify database connections
- [ ] Set up database backups

### 3. Security Configuration
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up SSL certificates
- [ ] Enable security headers
- [ ] Configure CORS for production domains

### 4. File Storage
- [ ] Configure production upload directory
- [ ] Set up file permissions
- [ ] Configure backup strategy
- [ ] Set up CDN (optional)

### 5. Monitoring & Logging
- [ ] Configure production logging
- [ ] Set up error monitoring
- [ ] Configure audit logging
- [ ] Set up performance monitoring

## Security Best Practices

### 1. Secret Management
- Never commit `.env` files to version control
- Use environment-specific secret files
- Rotate secrets regularly
- Use strong, random secrets

### 2. Database Security
- Use strong database passwords
- Limit database access to application only
- Enable database encryption
- Regular security updates

### 3. Network Security
- Enable HTTPS only
- Configure firewall rules
- Use VPN for admin access
- Monitor network traffic

### 4. Application Security
- Regular security updates
- Input validation
- Output encoding
- Error handling (no sensitive data in errors)

## Performance Optimization

### 1. Database
- Add database indexes
- Optimize queries
- Use connection pooling
- Regular maintenance

### 2. Application
- Enable compression
- Use CDN for static assets
- Implement caching
- Monitor performance metrics

### 3. Infrastructure
- Use load balancers
- Implement auto-scaling
- Monitor resource usage
- Regular backups

## Monitoring & Alerting

### 1. Application Monitoring
- Error rates
- Response times
- User activity
- Security events

### 2. Infrastructure Monitoring
- Server resources
- Database performance
- Network traffic
- Disk usage

### 3. Security Monitoring
- Failed login attempts
- Permission violations
- Suspicious activity
- Rate limit violations

## Backup & Recovery

### 1. Database Backups
- Daily automated backups
- Point-in-time recovery
- Test restore procedures
- Off-site storage

### 2. File Backups
- Regular file backups
- Version control
- Disaster recovery plan
- Backup testing

### 3. Configuration Backups
- Environment files
- Database schemas
- Application configs
- Documentation

## Deployment Process

### 1. Pre-deployment
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Backup procedures tested
- [ ] Rollback plan ready

### 2. Deployment
- [ ] Deploy to staging first
- [ ] Run integration tests
- [ ] Performance validation
- [ ] Security verification

### 3. Post-deployment
- [ ] Monitor application health
- [ ] Verify all features work
- [ ] Check security logs
- [ ] Update documentation

## Troubleshooting

### Common Issues
1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database is running
   - Check network connectivity

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET
   - Check NEXTAUTH_URL
   - Verify JWT_SECRET

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check disk space

4. **Performance Issues**
   - Monitor database queries
   - Check server resources
   - Verify caching configuration

## Support & Maintenance

### 1. Regular Maintenance
- Security updates
- Performance optimization
- Database maintenance
- Log rotation

### 2. Monitoring
- 24/7 application monitoring
- Security event monitoring
- Performance monitoring
- User activity monitoring

### 3. Support
- Technical documentation
- User guides
- Support contact information
- Escalation procedures
