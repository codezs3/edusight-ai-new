#!/usr/bin/env node

/**
 * EduSight Platform Security Testing Script
 * 
 * This script performs various security tests on the application
 * Run with: node scripts/security-test.js
 */

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class SecurityTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.baseUrl = process.env.TEST_URL || 'http://localhost:3001';
  }

  async runAllTests() {
    console.log('🔒 Starting EduSight Security Tests...\n');
    
    await this.testSecurityHeaders();
    await this.testRateLimiting();
    await this.testInputValidation();
    await this.testAuthentication();
    await this.testFileUploadSecurity();
    await this.testCORSConfiguration();
    await this.testErrorHandling();
    await this.testDatabaseSecurity();
    
    this.printResults();
  }

  async testSecurityHeaders() {
    console.log('📋 Testing Security Headers...');
    
    try {
      const response = await this.makeRequest('/');
      const headers = response.headers;
      
      const requiredHeaders = {
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'x-xss-protection': '1; mode=block',
        'referrer-policy': 'strict-origin-when-cross-origin'
      };
      
      for (const [header, expectedValue] of Object.entries(requiredHeaders)) {
        const actualValue = headers[header];
        if (actualValue && actualValue.toLowerCase().includes(expectedValue.toLowerCase())) {
          this.addResult('PASS', `Security header ${header} is properly set`);
        } else {
          this.addResult('FAIL', `Security header ${header} is missing or incorrect`);
        }
      }
      
      // Test CSP header
      if (headers['content-security-policy']) {
        this.addResult('PASS', 'Content Security Policy header is present');
      } else {
        this.addResult('WARNING', 'Content Security Policy header is missing');
      }
      
    } catch (error) {
      this.addResult('FAIL', `Security headers test failed: ${error.message}`);
    }
  }

  async testRateLimiting() {
    console.log('🚦 Testing Rate Limiting...');
    
    try {
      // Make multiple requests quickly
      const promises = [];
      for (let i = 0; i < 150; i++) {
        promises.push(this.makeRequest('/api/test'));
      }
      
      const responses = await Promise.allSettled(promises);
      const rateLimited = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status === 429
      ).length;
      
      if (rateLimited > 0) {
        this.addResult('PASS', `Rate limiting is working (${rateLimited} requests blocked)`);
      } else {
        this.addResult('WARNING', 'Rate limiting may not be working properly');
      }
      
    } catch (error) {
      this.addResult('FAIL', `Rate limiting test failed: ${error.message}`);
    }
  }

  async testInputValidation() {
    console.log('🛡️ Testing Input Validation...');
    
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      'data:text/html,<script>alert("xss")</script>',
      'admin\' OR 1=1--',
      '../../../etc/passwd',
      '${7*7}',
      '{{7*7}}'
    ];
    
    for (const input of maliciousInputs) {
      try {
        const response = await this.makeRequest('/api/test', 'POST', { 
          test: input 
        });
        
        if (response.body && response.body.includes(input)) {
          this.addResult('FAIL', `Input validation failed for: ${input}`);
        } else {
          this.addResult('PASS', `Input validation passed for: ${input}`);
        }
      } catch (error) {
        this.addResult('WARNING', `Input validation test error: ${error.message}`);
      }
    }
  }

  async testAuthentication() {
    console.log('🔐 Testing Authentication...');
    
    try {
      // Test protected endpoint without auth
      const response = await this.makeRequest('/api/admin/schools');
      
      if (response.status === 401 || response.status === 403) {
        this.addResult('PASS', 'Authentication is properly enforced');
      } else {
        this.addResult('FAIL', 'Authentication bypass possible');
      }
      
      // Test session management
      const sessionResponse = await this.makeRequest('/api/auth/session');
      if (sessionResponse.status === 200) {
        this.addResult('PASS', 'Session management is working');
      } else {
        this.addResult('WARNING', 'Session management may have issues');
      }
      
    } catch (error) {
      this.addResult('FAIL', `Authentication test failed: ${error.message}`);
    }
  }

  async testFileUploadSecurity() {
    console.log('📁 Testing File Upload Security...');
    
    try {
      // Test file type validation
      const maliciousFiles = [
        { name: 'test.exe', type: 'application/x-msdownload' },
        { name: 'test.php', type: 'application/x-php' },
        { name: 'test.sh', type: 'application/x-sh' }
      ];
      
      for (const file of maliciousFiles) {
        try {
          const response = await this.makeRequest('/api/upload', 'POST', {
            file: file
          });
          
          if (response.status === 400 || response.status === 415) {
            this.addResult('PASS', `File type validation passed for ${file.name}`);
          } else {
            this.addResult('FAIL', `File type validation failed for ${file.name}`);
          }
        } catch (error) {
          this.addResult('WARNING', `File upload test error: ${error.message}`);
        }
      }
      
    } catch (error) {
      this.addResult('FAIL', `File upload security test failed: ${error.message}`);
    }
  }

  async testCORSConfiguration() {
    console.log('🌐 Testing CORS Configuration...');
    
    try {
      const response = await this.makeRequest('/', 'OPTIONS', {}, {
        'Origin': 'https://malicious-site.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      });
      
      const corsHeader = response.headers['access-control-allow-origin'];
      
      if (!corsHeader || corsHeader === '*') {
        this.addResult('WARNING', 'CORS may be too permissive');
      } else if (corsHeader === 'https://malicious-site.com') {
        this.addResult('FAIL', 'CORS allows malicious origins');
      } else {
        this.addResult('PASS', 'CORS is properly configured');
      }
      
    } catch (error) {
      this.addResult('FAIL', `CORS test failed: ${error.message}`);
    }
  }

  async testErrorHandling() {
    console.log('⚠️ Testing Error Handling...');
    
    try {
      // Test for information disclosure
      const response = await this.makeRequest('/nonexistent-endpoint');
      
      if (response.status === 404) {
        if (response.body && response.body.includes('error') && !response.body.includes('stack')) {
          this.addResult('PASS', 'Error handling prevents information disclosure');
        } else {
          this.addResult('WARNING', 'Error handling may expose sensitive information');
        }
      } else {
        this.addResult('FAIL', 'Error handling not working properly');
      }
      
    } catch (error) {
      this.addResult('FAIL', `Error handling test failed: ${error.message}`);
    }
  }

  async testDatabaseSecurity() {
    console.log('🗄️ Testing Database Security...');
    
    try {
      // Test SQL injection prevention
      const sqlInjectionPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --"
      ];
      
      for (const payload of sqlInjectionPayloads) {
        try {
          const response = await this.makeRequest('/api/test', 'POST', {
            query: payload
          });
          
          if (response.status === 400 || response.status === 500) {
            this.addResult('PASS', `SQL injection prevented: ${payload}`);
          } else {
            this.addResult('WARNING', `SQL injection may be possible: ${payload}`);
          }
        } catch (error) {
          this.addResult('WARNING', `SQL injection test error: ${error.message}`);
        }
      }
      
    } catch (error) {
      this.addResult('FAIL', `Database security test failed: ${error.message}`);
    }
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
          'User-Agent': 'SecurityTester/1.0',
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

  addResult(type, message) {
    const result = { type, message, timestamp: new Date() };
    this.results.tests.push(result);
    
    switch (type) {
      case 'PASS':
        this.results.passed++;
        console.log(`✅ ${message}`);
        break;
      case 'FAIL':
        this.results.failed++;
        console.log(`❌ ${message}`);
        break;
      case 'WARNING':
        this.results.warnings++;
        console.log(`⚠️ ${message}`);
        break;
    }
  }

  printResults() {
    console.log('\n📊 Security Test Results:');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⚠️ Warnings: ${this.results.warnings}`);
    console.log(`📋 Total Tests: ${this.results.tests.length}`);
    
    const score = Math.round((this.results.passed / this.results.tests.length) * 100);
    console.log(`🎯 Security Score: ${score}%`);
    
    if (this.results.failed > 0) {
      console.log('\n🚨 CRITICAL: Security vulnerabilities detected!');
      console.log('Please fix failed tests before deployment.');
    } else if (this.results.warnings > 0) {
      console.log('\n⚠️ WARNING: Some security concerns detected.');
      console.log('Consider addressing warnings for better security.');
    } else {
      console.log('\n🎉 EXCELLENT: All security tests passed!');
      console.log('Your application is ready for production deployment.');
    }
    
    // Save results to file
    const resultsFile = path.join(__dirname, '../security-test-results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed results saved to: ${resultsFile}`);
  }
}

// Run tests if script is executed directly
if (require.main === module) {
  const tester = new SecurityTester();
  tester.runAllTests().catch(console.error);
}

module.exports = SecurityTester;
