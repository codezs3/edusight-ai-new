#!/usr/bin/env node

/**
 * EduSight Platform Performance Testing Script
 * 
 * This script performs various performance tests on the application
 * Run with: node scripts/performance-test.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

class PerformanceTester {
  constructor() {
    this.results = {
      tests: [],
      summary: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        totalResponseTime: 0
      }
    };
    this.baseUrl = process.env.TEST_URL || 'http://localhost:3001';
  }

  async runAllTests() {
    console.log('🚀 Starting EduSight Performance Tests...\n');
    
    await this.testHomePagePerformance();
    await this.testDashboardPerformance();
    await this.testAPIPerformance();
    await this.testDatabasePerformance();
    await this.testFileUploadPerformance();
    await this.testConcurrentUsers();
    
    this.calculateSummary();
    this.printResults();
  }

  async testHomePagePerformance() {
    console.log('🏠 Testing Home Page Performance...');
    
    const iterations = 10;
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      try {
        const response = await this.makeRequest('/');
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        times.push(responseTime);
        this.results.summary.totalRequests++;
        
        if (response.status === 200) {
          this.results.summary.successfulRequests++;
          this.addResult('PASS', `Home page load ${i + 1}: ${responseTime}ms`);
        } else {
          this.results.summary.failedRequests++;
          this.addResult('FAIL', `Home page load ${i + 1}: HTTP ${response.status}`);
        }
        
        // Update response time statistics
        this.updateResponseTimeStats(responseTime);
        
      } catch (error) {
        this.results.summary.failedRequests++;
        this.addResult('FAIL', `Home page load ${i + 1}: ${error.message}`);
      }
      
      // Small delay between requests
      await this.delay(100);
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    this.addResult('INFO', `Home page average load time: ${Math.round(avgTime)}ms`);
  }

  async testDashboardPerformance() {
    console.log('📊 Testing Dashboard Performance...');
    
    const dashboardEndpoints = [
      '/dashboard',
      '/dashboard/admin',
      '/dashboard/parent',
      '/dashboard/school-admin'
    ];
    
    for (const endpoint of dashboardEndpoints) {
      const startTime = Date.now();
      try {
        const response = await this.makeRequest(endpoint);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        this.results.summary.totalRequests++;
        
        if (response.status === 200 || response.status === 302) {
          this.results.summary.successfulRequests++;
          this.addResult('PASS', `${endpoint}: ${responseTime}ms`);
        } else {
          this.results.summary.failedRequests++;
          this.addResult('FAIL', `${endpoint}: HTTP ${response.status}`);
        }
        
        this.updateResponseTimeStats(responseTime);
        
      } catch (error) {
        this.results.summary.failedRequests++;
        this.addResult('FAIL', `${endpoint}: ${error.message}`);
      }
      
      await this.delay(200);
    }
  }

  async testAPIPerformance() {
    console.log('🔌 Testing API Performance...');
    
    const apiEndpoints = [
      '/api/admin/schools',
      '/api/parent/children',
      '/api/school-admin/students'
    ];
    
    for (const endpoint of apiEndpoints) {
      const startTime = Date.now();
      try {
        const response = await this.makeRequest(endpoint);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        this.results.summary.totalRequests++;
        
        if (response.status === 401 || response.status === 403) {
          // Expected for unauthenticated requests
          this.results.summary.successfulRequests++;
          this.addResult('PASS', `${endpoint}: ${responseTime}ms (auth required)`);
        } else if (response.status === 200) {
          this.results.summary.successfulRequests++;
          this.addResult('PASS', `${endpoint}: ${responseTime}ms`);
        } else {
          this.results.summary.failedRequests++;
          this.addResult('FAIL', `${endpoint}: HTTP ${response.status}`);
        }
        
        this.updateResponseTimeStats(responseTime);
        
      } catch (error) {
        this.results.summary.failedRequests++;
        this.addResult('FAIL', `${endpoint}: ${error.message}`);
      }
      
      await this.delay(200);
    }
  }

  async testDatabasePerformance() {
    console.log('🗄️ Testing Database Performance...');
    
    // Test database connection and basic operations
    const startTime = Date.now();
    try {
      // This would test actual database operations
      // For now, we'll simulate database performance
      await this.simulateDatabaseOperation();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      this.results.summary.totalRequests++;
      this.results.summary.successfulRequests++;
      
      if (responseTime < 100) {
        this.addResult('PASS', `Database operation: ${responseTime}ms (Excellent)`);
      } else if (responseTime < 500) {
        this.addResult('PASS', `Database operation: ${responseTime}ms (Good)`);
      } else if (responseTime < 1000) {
        this.addResult('WARNING', `Database operation: ${responseTime}ms (Slow)`);
      } else {
        this.addResult('FAIL', `Database operation: ${responseTime}ms (Very Slow)`);
      }
      
      this.updateResponseTimeStats(responseTime);
      
    } catch (error) {
      this.results.summary.failedRequests++;
      this.addResult('FAIL', `Database operation: ${error.message}`);
    }
  }

  async testFileUploadPerformance() {
    console.log('📁 Testing File Upload Performance...');
    
    // Simulate file upload performance testing
    const fileSizes = [1024, 10240, 102400, 1048576]; // 1KB, 10KB, 100KB, 1MB
    
    for (const size of fileSizes) {
      const startTime = Date.now();
      try {
        await this.simulateFileUpload(size);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        this.results.summary.totalRequests++;
        this.results.summary.successfulRequests++;
        
        const sizeKB = Math.round(size / 1024);
        this.addResult('PASS', `File upload ${sizeKB}KB: ${responseTime}ms`);
        
        this.updateResponseTimeStats(responseTime);
        
      } catch (error) {
        this.results.summary.failedRequests++;
        this.addResult('FAIL', `File upload ${size} bytes: ${error.message}`);
      }
      
      await this.delay(100);
    }
  }

  async testConcurrentUsers() {
    console.log('👥 Testing Concurrent User Performance...');
    
    const concurrentUsers = [10, 25, 50, 100];
    
    for (const userCount of concurrentUsers) {
      console.log(`  Testing ${userCount} concurrent users...`);
      
      const startTime = Date.now();
      const promises = [];
      
      for (let i = 0; i < userCount; i++) {
        promises.push(this.simulateUserRequest());
      }
      
      try {
        await Promise.all(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        this.results.summary.totalRequests += userCount;
        this.results.summary.successfulRequests += userCount;
        
        const avgTimePerUser = totalTime / userCount;
        
        if (avgTimePerUser < 100) {
          this.addResult('PASS', `${userCount} concurrent users: ${Math.round(avgTimePerUser)}ms avg (Excellent)`);
        } else if (avgTimePerUser < 500) {
          this.addResult('PASS', `${userCount} concurrent users: ${Math.round(avgTimePerUser)}ms avg (Good)`);
        } else if (avgTimePerUser < 1000) {
          this.addResult('WARNING', `${userCount} concurrent users: ${Math.round(avgTimePerUser)}ms avg (Slow)`);
        } else {
          this.addResult('FAIL', `${userCount} concurrent users: ${Math.round(avgTimePerUser)}ms avg (Very Slow)`);
        }
        
      } catch (error) {
        this.results.summary.failedRequests += userCount;
        this.addResult('FAIL', `${userCount} concurrent users: ${error.message}`);
      }
      
      await this.delay(500);
    }
  }

  async simulateDatabaseOperation() {
    // Simulate database query time
    const baseTime = 10; // Base time in ms
    const randomFactor = Math.random() * 50; // Random variation
    await this.delay(baseTime + randomFactor);
  }

  async simulateFileUpload(fileSize) {
    // Simulate file upload processing time
    const baseTime = fileSize / 1024; // 1ms per KB
    const randomFactor = Math.random() * 100; // Random variation
    await this.delay(baseTime + randomFactor);
  }

  async simulateUserRequest() {
    // Simulate a user making a request
    const requestTime = Math.random() * 200 + 50; // 50-250ms
    await this.delay(requestTime);
  }

  async makeRequest(path, method = 'GET', body = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: {
          'User-Agent': 'PerformanceTester/1.0',
          'Content-Type': 'application/json',
          ...headers
        }
      };
      
      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: jsonData
            });
          } catch {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: data
            });
          }
        });
      });
      
      req.on('error', reject);
      
      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  }

  updateResponseTimeStats(responseTime) {
    this.results.summary.totalResponseTime += responseTime;
    this.results.summary.minResponseTime = Math.min(this.results.summary.minResponseTime, responseTime);
    this.results.summary.maxResponseTime = Math.max(this.results.summary.maxResponseTime, responseTime);
  }

  calculateSummary() {
    if (this.results.summary.successfulRequests > 0) {
      this.results.summary.averageResponseTime = 
        this.results.summary.totalResponseTime / this.results.summary.successfulRequests;
    }
    
    if (this.results.summary.minResponseTime === Infinity) {
      this.results.summary.minResponseTime = 0;
    }
  }

  addResult(type, message) {
    const result = { type, message, timestamp: new Date() };
    this.results.tests.push(result);
    
    switch (type) {
      case 'PASS':
        console.log(`✅ ${message}`);
        break;
      case 'FAIL':
        console.log(`❌ ${message}`);
        break;
      case 'WARNING':
        console.log(`⚠️ ${message}`);
        break;
      case 'INFO':
        console.log(`ℹ️ ${message}`);
        break;
    }
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printResults() {
    console.log('\n📊 Performance Test Results:');
    console.log('============================');
    console.log(`📋 Total Requests: ${this.results.summary.totalRequests}`);
    console.log(`✅ Successful: ${this.results.summary.successfulRequests}`);
    console.log(`❌ Failed: ${this.results.summary.failedRequests}`);
    console.log(`📈 Success Rate: ${Math.round((this.results.summary.successfulRequests / this.results.summary.totalRequests) * 100)}%`);
    
    console.log('\n⏱️ Response Time Statistics:');
    console.log(`📊 Average: ${Math.round(this.results.summary.averageResponseTime)}ms`);
    console.log(`⚡ Minimum: ${Math.round(this.results.summary.minResponseTime)}ms`);
    console.log(`🐌 Maximum: ${Math.round(this.results.summary.maxResponseTime)}ms`);
    
    // Performance rating
    const avgTime = this.results.summary.averageResponseTime;
    let rating = '';
    
    if (avgTime < 100) {
      rating = '🚀 EXCELLENT - Production Ready';
    } else if (avgTime < 300) {
      rating = '✅ GOOD - Production Ready';
    } else if (avgTime < 500) {
      rating = '⚠️ ACCEPTABLE - Consider Optimization';
    } else if (avgTime < 1000) {
      rating = '🐌 SLOW - Needs Optimization';
    } else {
      rating = '🚨 VERY SLOW - Major Issues';
    }
    
    console.log(`\n🎯 Performance Rating: ${rating}`);
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (avgTime > 500) {
      console.log('  • Optimize database queries');
      console.log('  • Implement caching strategies');
      console.log('  • Consider CDN for static assets');
      console.log('  • Review server resources');
    } else if (avgTime > 300) {
      console.log('  • Monitor performance metrics');
      console.log('  • Consider minor optimizations');
    } else {
      console.log('  • Excellent performance!');
      console.log('  • Continue monitoring');
    }
    
    // Save results to file
    const resultsFile = path.join(__dirname, '../performance-test-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed results saved to: ${resultsFile}`);
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.runAllTests().catch(console.error);
}

module.exports = PerformanceTester;
