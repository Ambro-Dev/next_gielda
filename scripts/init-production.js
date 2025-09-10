#!/usr/bin/env node

/**
 * Production Initialization Script
 * This script sets up the application for production deployment
 * 
 * Usage:
 *   node scripts/init-production.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Generate secure random password
function generateSecurePassword(length = 16) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Generate secure random secret
function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Check if admin user exists
async function checkAdminExists() {
  try {
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    });
    return adminCount > 0;
  } catch (error) {
    console.error('Error checking for existing admin users:', error.message);
    return false;
  }
}

// Create default admin user
async function createDefaultAdmin() {
  try {
    const adminExists = await checkAdminExists();
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }
    
    const username = 'admin';
    const email = 'admin@yourdomain.com';
    const password = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const adminUser = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        role: 'admin',
        name: 'System',
        surname: 'Administrator',
        emailVerified: new Date(),
        isBlocked: false
      }
    });
    
    console.log('✅ Default admin user created');
    console.log('================================');
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('================================');
    console.log('⚠️  IMPORTANT: Change the admin password after first login!');
    
    return adminUser;
  } catch (error) {
    throw new Error(`Failed to create admin user: ${error.message}`);
  }
}

// Create default school
async function createDefaultSchool() {
  try {
    const schoolExists = await prisma.school.findFirst({
      where: { identifier: 'DEFAULT001' }
    });
    
    if (schoolExists) {
      console.log('✅ Default school already exists');
      return schoolExists;
    }
    
    const school = await prisma.school.create({
      data: {
        name: 'Szkoła Domyślna',
        identifier: 'DEFAULT001',
        isActive: true,
        accessExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    });
    
    console.log('✅ Default school created');
    console.log(`   Name: ${school.name}`);
    console.log(`   Identifier: ${school.identifier}`);
    
    return school;
  } catch (error) {
    throw new Error(`Failed to create default school: ${error.message}`);
  }
}

// Create default categories
async function createDefaultCategories() {
  const categories = [
    { name: 'Transport krajowy' },
    { name: 'Transport międzynarodowy' },
    { name: 'Transport lokalny' },
    { name: 'Transport specjalistyczny' },
    { name: 'Transport palet' },
    { name: 'Transport kontenerów' },
    { name: 'Transport chłodniczy' },
    { name: 'Transport niebezpieczny' }
  ];
  
  try {
    let createdCount = 0;
    
    for (const category of categories) {
      try {
        await prisma.category.upsert({
          where: { name: category.name },
          update: {},
          create: category
        });
        createdCount++;
      } catch (error) {
        // Category might already exist, continue
      }
    }
    
    console.log(`✅ Created/verified ${createdCount} categories`);
  } catch (error) {
    throw new Error(`Failed to create categories: ${error.message}`);
  }
}

// Create default vehicles
async function createDefaultVehicles() {
  const vehicles = [
    { name: 'Bus' },
    { name: 'Samochód osobowy z przyczepą' },
    { name: 'Mała ciężarówka (do 3.5t)' },
    { name: 'Średnia ciężarówka (3.5t - 7.5t)' },
    { name: 'Duża ciężarówka (powyżej 7.5t)' },
    { name: 'Ciężarówka z naczepą' },
    { name: 'Cysterna' },
    { name: 'Platforma' },
    { name: 'Chłodnia' },
    { name: 'Kontenerowiec' }
  ];
  
  try {
    let createdCount = 0;
    
    for (const vehicle of vehicles) {
      try {
        await prisma.vehicle.upsert({
          where: { name: vehicle.name },
          update: {},
          create: vehicle
        });
        createdCount++;
      } catch (error) {
        // Vehicle might already exist, continue
      }
    }
    
    console.log(`✅ Created/verified ${createdCount} vehicles`);
  } catch (error) {
    throw new Error(`Failed to create vehicles: ${error.message}`);
  }
}

// Generate environment file
function generateEnvFile() {
  const envContent = `# Production Environment Variables
# Generated on ${new Date().toISOString()}

# Database Configuration
DATABASE_URL="mongodb://localhost:27017/next_gielda"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="${generateSecureSecret()}"
NEXTAUTH_PUBLIC_SITE_URL="https://yourdomain.com"

# Server Configuration
NEXT_PUBLIC_SERVER_URL="https://yourdomain.com"
NODE_ENV="production"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="your-google-maps-api-key-here"

# Email Configuration
EMAIL_SERVER="smtp://username:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@yourdomain.com"

# UploadThing Configuration
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Socket.io Configuration
SOCKET_IO_PORT="3001"
`;
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    fs.writeFileSync(path.join(process.cwd(), '.env.production'), envContent);
    console.log('✅ Generated .env.production file');
    console.log('   Please update the values with your actual configuration');
  } catch (error) {
    console.log('⚠️  Could not generate .env.production file:', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 Next.js Gielda Transport - Production Initialization');
  console.log('======================================================\n');
  
  try {
    // Check database connection
    console.log('🔌 Checking database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful\n');
    
    // Create default admin user
    console.log('👤 Setting up admin user...');
    await createDefaultAdmin();
    console.log('');
    
    // Create default school
    console.log('🏫 Setting up default school...');
    await createDefaultSchool();
    console.log('');
    
    // Create default categories
    console.log('📁 Setting up categories...');
    await createDefaultCategories();
    console.log('');
    
    // Create default vehicles
    console.log('🚛 Setting up vehicles...');
    await createDefaultVehicles();
    console.log('');
    
    // Generate environment file
    console.log('📝 Generating environment file...');
    generateEnvFile();
    console.log('');
    
    console.log('✅ Production initialization completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update .env.production with your actual configuration');
    console.log('2. Copy .env.production to .env');
    console.log('3. Build the application: npm run build:prod');
    console.log('4. Start the application: npm run start:prod');
    console.log('5. Access admin panel: https://yourdomain.com/admin');
    console.log('\n🔐 Default admin credentials:');
    console.log('   Username: admin');
    console.log('   Email: admin@yourdomain.com');
    console.log('   Password: [generated secure password - see above]');
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');
    
  } catch (error) {
    console.error('\n❌ Production initialization failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\nProduction initialization cancelled by user.');
  await prisma.$disconnect();
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { 
  createDefaultAdmin, 
  createDefaultSchool, 
  createDefaultCategories, 
  createDefaultVehicles 
};
