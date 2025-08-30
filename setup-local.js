#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up EduSight for local development...\n');

// Create .env.local file
const envContent = `# Basic configuration for local development
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# Database (using SQLite for local development)
DATABASE_URL="file:./dev.db"

# Optional: Add these when you have the services set up
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
# STRIPE_SECRET_KEY=""
`;

try {
  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local file');
} catch (error) {
  console.log('⚠️  Could not create .env.local file:', error.message);
  console.log('Please create it manually with the following content:');
  console.log(envContent);
}

console.log('\n📋 Next steps:');
console.log('1. Run: npx prisma generate');
console.log('2. Run: npx prisma db push');
console.log('3. Run: npm run dev');
console.log('\n🌐 The app will be available at: http://localhost:3000');
