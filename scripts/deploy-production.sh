#!/bin/bash

# EduSight Production Deployment Script
# Optimized for 1M+ users

set -e  # Exit on any error

echo "🚀 Starting EduSight Production Deployment"
echo "=========================================="

# Configuration
ENVIRONMENT=${1:-production}
BUILD_DIR=".next"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_NODE="18.0.0"
    if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_NODE') ? 0 : 1)" 2>/dev/null; then
        error "Node.js version $REQUIRED_NODE or higher is required. Current: $NODE_VERSION"
    fi
    
    # Check required commands
    for cmd in npm git docker; do
        if ! command -v $cmd &> /dev/null; then
            error "$cmd is required but not installed"
        fi
    done
    
    # Check environment variables
    if [ "$ENVIRONMENT" = "production" ]; then
        required_vars=(
            "DATABASE_URL"
            "NEXTAUTH_SECRET"
            "NEXTAUTH_URL"
            "STRIPE_SECRET_KEY"
            "REDIS_URL"
        )
        
        for var in "${required_vars[@]}"; do
            if [ -z "${!var}" ]; then
                error "Required environment variable $var is not set"
            fi
        done
    fi
    
    log "✅ Prerequisites check passed"
}

# Create backup
create_backup() {
    if [ -d "$BUILD_DIR" ]; then
        log "Creating backup of current build..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$BUILD_DIR" "$BACKUP_DIR/"
        log "✅ Backup created at $BACKUP_DIR"
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    # Clean install for production
    if [ "$ENVIRONMENT" = "production" ]; then
        npm ci --only=production --no-audit --no-fund
    else
        npm ci --no-audit --no-fund
    fi
    
    log "✅ Dependencies installed"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Type checking
    npm run type-check
    
    # Linting
    npm run lint
    
    # Unit tests (if available)
    if npm run | grep -q "test"; then
        npm run test
    fi
    
    log "✅ Tests passed"
}

# Build application
build_application() {
    log "Building application for $ENVIRONMENT..."
    
    # Set production config
    if [ "$ENVIRONMENT" = "production" ]; then
        cp next.config.production.js next.config.js
        cp prisma/schema-production.prisma prisma/schema.prisma
    fi
    
    # Generate Prisma client
    npx prisma generate
    
    # Build Next.js application
    npm run build
    
    # Analyze bundle size
    if [ "$ENVIRONMENT" = "production" ]; then
        ANALYZE=true npm run build > build-analysis.log 2>&1 || true
    fi
    
    log "✅ Application built successfully"
}

# Database migration
migrate_database() {
    log "Running database migrations..."
    
    # Push schema changes
    npx prisma db push
    
    # Run optimization script
    if [ -f "scripts/database-optimizations.sql" ] && [ "$ENVIRONMENT" = "production" ]; then
        log "Applying database optimizations..."
        psql $DATABASE_URL -f scripts/database-optimizations.sql || warn "Database optimizations failed"
    fi
    
    log "✅ Database migrations completed"
}

# Optimize assets
optimize_assets() {
    log "Optimizing assets..."
    
    # Compress images (if imagemin is available)
    if command -v imagemin &> /dev/null; then
        find public -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | xargs imagemin --out-dir=public/optimized/
    fi
    
    # Generate sitemap
    if [ -f "scripts/generate-sitemap.js" ]; then
        node scripts/generate-sitemap.js
    fi
    
    log "✅ Assets optimized"
}

# Security checks
security_checks() {
    log "Running security checks..."
    
    # Audit dependencies
    npm audit --audit-level=high
    
    # Check for secrets in code
    if command -v git-secrets &> /dev/null; then
        git secrets --scan
    fi
    
    log "✅ Security checks passed"
}

# Performance validation
validate_performance() {
    log "Validating performance..."
    
    # Check bundle sizes
    if [ -f ".next/analyze/client.html" ]; then
        BUNDLE_SIZE=$(du -sh .next/static/chunks | cut -f1)
        log "Bundle size: $BUNDLE_SIZE"
        
        # Warn if bundle is too large
        if [ "${BUNDLE_SIZE%M*}" -gt 5 ]; then
            warn "Bundle size is larger than 5MB. Consider code splitting."
        fi
    fi
    
    log "✅ Performance validation completed"
}

# Deploy to platform
deploy_to_platform() {
    log "Deploying to platform..."
    
    case "$DEPLOYMENT_PLATFORM" in
        "vercel")
            npx vercel --prod
            ;;
        "docker")
            docker build -t edusight:latest .
            docker tag edusight:latest edusight:$ENVIRONMENT
            ;;
        "aws")
            # AWS deployment logic
            aws s3 sync .next/static s3://$S3_BUCKET/static/
            ;;
        *)
            log "No specific deployment platform configured"
            ;;
    esac
    
    log "✅ Deployment completed"
}

# Health check
health_check() {
    log "Performing health check..."
    
    if [ -n "$HEALTH_CHECK_URL" ]; then
        for i in {1..5}; do
            if curl -f "$HEALTH_CHECK_URL/api/health" > /dev/null 2>&1; then
                log "✅ Health check passed"
                return 0
            fi
            log "Health check attempt $i failed, retrying in 10 seconds..."
            sleep 10
        done
        error "Health check failed after 5 attempts"
    else
        warn "HEALTH_CHECK_URL not set, skipping health check"
    fi
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    
    # Remove temporary files
    rm -rf .next/cache/webpack
    rm -f build-analysis.log
    
    # Restore original configs if needed
    if [ "$ENVIRONMENT" = "production" ]; then
        git checkout next.config.js prisma/schema.prisma 2>/dev/null || true
    fi
    
    log "✅ Cleanup completed"
}

# Rollback function
rollback() {
    error "Deployment failed. Rolling back..."
    
    if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$BUILD_DIR"
        cp -r "$BACKUP_DIR/$BUILD_DIR" .
        log "✅ Rollback completed"
    fi
    
    exit 1
}

# Set trap for rollback on error
trap rollback ERR

# Main deployment flow
main() {
    log "Starting deployment for environment: $ENVIRONMENT"
    
    check_prerequisites
    create_backup
    install_dependencies
    run_tests
    build_application
    migrate_database
    optimize_assets
    security_checks
    validate_performance
    deploy_to_platform
    health_check
    cleanup
    
    log "🎉 Deployment completed successfully!"
    log "Environment: $ENVIRONMENT"
    log "Build time: $(date)"
    log "Backup location: $BACKUP_DIR"
}

# Run main function
main "$@"
