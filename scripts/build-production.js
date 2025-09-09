#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build process...');

try {
  // Step 1: Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci --only=production', { stdio: 'inherit' });

  // Step 2: Generate Prisma client
  console.log('🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Step 3: Run database migrations
  console.log('🗄️ Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // Step 4: Type check
  console.log('🔍 Running type check...');
  execSync('npm run type-check', { stdio: 'inherit' });

  // Step 5: Lint check
  console.log('🧹 Running lint check...');
  execSync('npm run lint', { stdio: 'inherit' });

  // Step 6: Build Next.js app
  console.log('🏗️ Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 7: Verify build
  console.log('✅ Verifying build...');
  const buildDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found');
  }

  console.log('🎉 Production build completed successfully!');
  console.log('📁 Build artifacts are in the .next directory');
  console.log('🚀 Ready for deployment!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
