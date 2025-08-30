#!/usr/bin/env node

/**
 * Production Database Setup Script
 * Sets up PostgreSQL database for 1M+ users with proper indexing and optimization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Database configuration for different environments
const dbConfigs = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'edusight_dev',
    username: 'postgres',
    password: 'password'
  },
  staging: {
    host: process.env.STAGING_DB_HOST || 'localhost',
    port: process.env.STAGING_DB_PORT || 5432,
    database: process.env.STAGING_DB_NAME || 'edusight_staging',
    username: process.env.STAGING_DB_USER || 'postgres',
    password: process.env.STAGING_DB_PASSWORD || 'password'
  },
  production: {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT || 5432,
    database: process.env.PROD_DB_NAME,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD
  }
};

function createEnvironmentFile(environment = 'development') {
  const config = dbConfigs[environment];
  
  if (!config) {
    console.error(`❌ Unknown environment: ${environment}`);
    process.exit(1);
  }

  // Validate required production environment variables
  if (environment === 'production') {
    const requiredVars = ['PROD_DB_HOST', 'PROD_DB_NAME', 'PROD_DB_USER', 'PROD_DB_PASSWORD'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      console.error(`❌ Missing required environment variables for production: ${missing.join(', ')}`);
      console.log('\nPlease set the following environment variables:');
      missing.forEach(varName => {
        console.log(`  export ${varName}="your_value"`);
      });
      process.exit(1);
    }
  }

  const databaseUrl = `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}?schema=public`;
  
  const envContent = `# EduSight ${environment.toUpperCase()} Environment Configuration
# Generated on ${new Date().toISOString()}

# Database Configuration
DATABASE_URL="${databaseUrl}"
DIRECT_URL="${databaseUrl}"

# NextAuth Configuration
NEXTAUTH_URL=${environment === 'production' ? 'https://your-domain.com' : 'http://localhost:3000'}
NEXTAUTH_SECRET=${generateRandomSecret()}

# Google OAuth (replace with your credentials)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe Configuration (replace with your keys)
STRIPE_PUBLISHABLE_KEY="pk_${environment === 'production' ? 'live' : 'test'}_your-stripe-key"
STRIPE_SECRET_KEY="sk_${environment === 'production' ? 'live' : 'test'}_your-stripe-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"

# Redis Configuration (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# Email Configuration (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# File Upload Configuration
UPLOAD_MAX_SIZE="10485760" # 10MB
ALLOWED_FILE_TYPES="pdf,doc,docx,jpg,jpeg,png,csv,xlsx"

# Performance Configuration
MAX_CONNECTIONS="100"
CONNECTION_TIMEOUT="30000"
QUERY_TIMEOUT="10000"

# Security Configuration
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000" # 15 minutes

# Monitoring Configuration
LOG_LEVEL="${environment === 'production' ? 'error' : 'debug'}"
ENABLE_METRICS="true"

# Feature Flags
ENABLE_ML_PREDICTIONS="true"
ENABLE_REAL_TIME_ANALYTICS="true"
ENABLE_ADVANCED_REPORTING="true"
`;

  const envFile = environment === 'production' ? '.env.production' : 
                  environment === 'staging' ? '.env.staging' : '.env.local';
  
  fs.writeFileSync(envFile, envContent);
  console.log(`✅ Created ${envFile} for ${environment} environment`);
  
  return databaseUrl;
}

function generateRandomSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

function setupPrismaSchema(environment) {
  const sourceSchema = environment === 'development' ? 
    'prisma/schema-sqlite.prisma' : 'prisma/schema-production.prisma';
  
  if (!fs.existsSync(sourceSchema)) {
    console.error(`❌ Source schema not found: ${sourceSchema}`);
    process.exit(1);
  }

  // Backup current schema if it exists
  if (fs.existsSync('prisma/schema.prisma')) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    fs.copyFileSync('prisma/schema.prisma', `prisma/schema.backup.${timestamp}.prisma`);
    console.log(`📦 Backed up existing schema to schema.backup.${timestamp}.prisma`);
  }

  // Copy the appropriate schema
  fs.copyFileSync(sourceSchema, 'prisma/schema.prisma');
  console.log(`✅ Updated Prisma schema for ${environment} environment`);
}

function runDatabaseMigration() {
  try {
    console.log('🔄 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🔄 Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    process.exit(1);
  }
}

function createOptimizationSQL() {
  const optimizationSQL = `-- Performance optimizations for 1M+ users
-- Run these after initial migration

-- Create additional indexes for high-traffic queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_active ON users(email, is_active);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_students_school_grade ON students(school_id, grade);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_student_created ON assessments(student_id, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_test_sessions_student_status ON test_sessions(student_id, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Partial indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_only ON users(id) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_valid_only ON sessions(user_id, expires) WHERE expires > NOW();

-- Composite indexes for complex queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_form_submissions_complex ON form_submissions(student_id, status, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_action_time ON audit_logs(user_id, action, timestamp DESC);

-- Enable auto-vacuum for better maintenance
ALTER TABLE users SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE assessments SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE test_sessions SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE notifications SET (autovacuum_vacuum_scale_factor = 0.1);

-- Create materialized views for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS student_performance_summary AS
SELECT 
  s.id as student_id,
  s.grade,
  s.school_id,
  COUNT(a.id) as total_assessments,
  AVG(a.score) as average_score,
  MAX(a.created_at) as last_assessment_date
FROM students s
LEFT JOIN assessments a ON s.id = a.student_id
WHERE s.is_active = true
GROUP BY s.id, s.grade, s.school_id;

CREATE UNIQUE INDEX ON student_performance_summary (student_id);

-- Refresh materialized view function
CREATE OR REPLACE FUNCTION refresh_student_performance_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY student_performance_summary;
END;
$$ LANGUAGE plpgsql;

-- Schedule materialized view refresh (requires pg_cron extension)
-- SELECT cron.schedule('refresh-student-performance', '0 2 * * *', 'SELECT refresh_student_performance_summary();');
`;

  fs.writeFileSync('scripts/database-optimizations.sql', optimizationSQL);
  console.log('✅ Created database optimization SQL script');
}

function createConnectionPoolConfig() {
  const poolConfig = `// Database connection pool configuration for production
// Add this to your database connection setup

const { Pool } = require('pg');

const createDatabasePool = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Connection pool settings for 1M+ users
    max: parseInt(process.env.MAX_CONNECTIONS) || 100,
    min: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: parseInt(process.env.CONNECTION_TIMEOUT) || 30000,
    maxUses: 7500,
    
    // SSL configuration for production
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false,
    
    // Query timeout
    query_timeout: parseInt(process.env.QUERY_TIMEOUT) || 10000,
    
    // Statement timeout
    statement_timeout: parseInt(process.env.QUERY_TIMEOUT) || 10000,
  });

  // Pool event handlers
  pool.on('connect', (client) => {
    console.log('New database connection established');
  });

  pool.on('error', (err, client) => {
    console.error('Database pool error:', err);
  });

  pool.on('remove', (client) => {
    console.log('Database connection removed from pool');
  });

  return pool;
};

module.exports = { createDatabasePool };
`;

  fs.writeFileSync('lib/database-pool.js', poolConfig);
  console.log('✅ Created database connection pool configuration');
}

function main() {
  const environment = process.argv[2] || 'development';
  
  console.log(`🚀 Setting up EduSight database for ${environment} environment`);
  console.log('=' .repeat(60));
  
  try {
    // Step 1: Create environment configuration
    const databaseUrl = createEnvironmentFile(environment);
    
    // Step 2: Setup Prisma schema
    setupPrismaSchema(environment);
    
    // Step 3: Run database migration
    runDatabaseMigration();
    
    // Step 4: Create optimization scripts
    if (environment !== 'development') {
      createOptimizationSQL();
      createConnectionPoolConfig();
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review and update the generated environment file');
    console.log('2. Configure your OAuth providers (Google, etc.)');
    console.log('3. Set up Stripe payment processing');
    console.log('4. Configure email service for notifications');
    
    if (environment !== 'development') {
      console.log('5. Run the database optimization script:');
      console.log('   psql $DATABASE_URL -f scripts/database-optimizations.sql');
      console.log('6. Set up monitoring and alerting');
      console.log('7. Configure backup and disaster recovery');
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = {
  createEnvironmentFile,
  setupPrismaSchema,
  runDatabaseMigration
};
