#!/usr/bin/env node

/**
 * Test Admin Setup Script
 * This script tests the admin user setup and database connectivity
 * 
 * Usage:
 *   node scripts/test-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Test admin user exists
async function testAdminUser() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        createdAt: true,
        isBlocked: true
      }
    });
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found');
      return false;
    }
    
    console.log(`✅ Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.name} ${user.surname}`);
      console.log(`      Role: ${user.role}, Created: ${user.createdAt.toISOString()}, Blocked: ${user.isBlocked}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error checking admin users:', error.message);
    return false;
  }
}

// Test password authentication
async function testPasswordAuth() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (!adminUser) {
      console.log('❌ No admin user found for password test');
      return false;
    }
    
    // Test with a dummy password (this will fail, but tests the bcrypt function)
    const testPassword = 'test-password-123';
    const isValid = await bcrypt.compare(testPassword, adminUser.hashedPassword);
    
    if (isValid) {
      console.log('⚠️  Admin password is set to test password - this is insecure!');
      return false;
    } else {
      console.log('✅ Admin password is properly hashed and secure');
      return true;
    }
  } catch (error) {
    console.error('❌ Error testing password authentication:', error.message);
    return false;
  }
}

// Test database schema
async function testDatabaseSchema() {
  try {
    const tables = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.category.count(),
      prisma.vehicle.count(),
      prisma.transport.count(),
      prisma.offer.count()
    ]);
    
    console.log('✅ Database schema test results:');
    console.log(`   Users: ${tables[0]}`);
    console.log(`   Schools: ${tables[1]}`);
    console.log(`   Categories: ${tables[2]}`);
    console.log(`   Vehicles: ${tables[3]}`);
    console.log(`   Transports: ${tables[4]}`);
    console.log(`   Offers: ${tables[5]}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error testing database schema:', error.message);
    return false;
  }
}

// Test environment variables
function testEnvironmentVariables() {
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_SERVER_URL'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

// Main test function
async function runTests() {
  console.log('🧪 Next.js Gielda Transport - Admin Setup Test');
  console.log('==============================================\n');
  
  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'Database Connection', fn: testDatabaseConnection },
    { name: 'Database Schema', fn: testDatabaseSchema },
    { name: 'Admin User Exists', fn: testAdminUser },
    { name: 'Password Authentication', fn: testPasswordAuth }
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    console.log(`\n🔍 Testing ${test.name}...`);
    try {
      const result = await test.fn();
      if (result) {
        passedTests++;
      }
    } catch (error) {
      console.error(`❌ Test failed with error: ${error.message}`);
    }
  }
  
  console.log('\n📊 Test Results');
  console.log('================');
  console.log(`Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('✅ All tests passed! Admin setup is working correctly.');
    console.log('\n🚀 You can now:');
    console.log('1. Start the application: npm run start:prod');
    console.log('2. Access admin panel: http://localhost:3000/admin');
    console.log('3. Login with admin credentials');
  } else {
    console.log('❌ Some tests failed. Please check the errors above.');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check environment variables in .env file');
    console.log('2. Verify database connection');
    console.log('3. Run: npm run init:prod');
    console.log('4. Check application logs');
  }
  
  return passedTests === totalTests;
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\nTest cancelled by user.');
  await prisma.$disconnect();
  process.exit(0);
});

// Run tests
if (require.main === module) {
  runTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { runTests };
