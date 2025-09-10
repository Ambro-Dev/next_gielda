#!/usr/bin/env node

/**
 * Database Setup Script
 * This script initializes the database with required data for the Next.js Gielda Transport Application
 * 
 * Usage:
 *   node scripts/setup-database.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample categories data
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

// Sample vehicles data
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

// Sample school data
const sampleSchool = {
  name: 'Szkoła Przykładowa',
  identifier: 'SAMPLE001',
  isActive: true,
  accessExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
};

// Create categories
async function createCategories() {
  console.log('📁 Creating categories...');
  
  for (const category of categories) {
    try {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category
      });
      console.log(`  ✅ Created category: ${category.name}`);
    } catch (error) {
      console.log(`  ⚠️  Category ${category.name} already exists or error: ${error.message}`);
    }
  }
}

// Create vehicles
async function createVehicles() {
  console.log('🚛 Creating vehicles...');
  
  for (const vehicle of vehicles) {
    try {
      await prisma.vehicle.upsert({
        where: { name: vehicle.name },
        update: {},
        create: vehicle
      });
      console.log(`  ✅ Created vehicle: ${vehicle.name}`);
    } catch (error) {
      console.log(`  ⚠️  Vehicle ${vehicle.name} already exists or error: ${error.message}`);
    }
  }
}

// Create sample school
async function createSampleSchool() {
  console.log('🏫 Creating sample school...');
  
  try {
    const school = await prisma.school.upsert({
      where: { identifier: sampleSchool.identifier },
      update: {},
      create: sampleSchool
    });
    console.log(`  ✅ Created school: ${school.name} (${school.identifier})`);
    return school;
  } catch (error) {
    console.log(`  ⚠️  School already exists or error: ${error.message}`);
    return await prisma.school.findUnique({
      where: { identifier: sampleSchool.identifier }
    });
  }
}

// Check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Get database statistics
async function getDatabaseStats() {
  try {
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.school.count(),
      prisma.category.count(),
      prisma.vehicle.count(),
      prisma.transport.count(),
      prisma.offer.count()
    ]);
    
    return {
      users: stats[0],
      schools: stats[1],
      categories: stats[2],
      vehicles: stats[3],
      transports: stats[4],
      offers: stats[5]
    };
  } catch (error) {
    console.error('Error getting database stats:', error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('🗄️  Next.js Gielda Transport - Database Setup');
  console.log('==============================================\n');
  
  try {
    // Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database. Please check your DATABASE_URL.');
    }
    
    // Get initial stats
    console.log('📊 Initial database statistics:');
    const initialStats = await getDatabaseStats();
    if (initialStats) {
      console.log(`  Users: ${initialStats.users}`);
      console.log(`  Schools: ${initialStats.schools}`);
      console.log(`  Categories: ${initialStats.categories}`);
      console.log(`  Vehicles: ${initialStats.vehicles}`);
      console.log(`  Transports: ${initialStats.transports}`);
      console.log(`  Offers: ${initialStats.offers}`);
    }
    
    console.log('\n🚀 Setting up database...\n');
    
    // Create categories
    await createCategories();
    console.log('');
    
    // Create vehicles
    await createVehicles();
    console.log('');
    
    // Create sample school
    const school = await createSampleSchool();
    console.log('');
    
    // Get final stats
    console.log('📊 Final database statistics:');
    const finalStats = await getDatabaseStats();
    if (finalStats) {
      console.log(`  Users: ${finalStats.users}`);
      console.log(`  Schools: ${finalStats.schools}`);
      console.log(`  Categories: ${finalStats.categories}`);
      console.log(`  Vehicles: ${finalStats.vehicles}`);
      console.log(`  Transports: ${finalStats.transports}`);
      console.log(`  Offers: ${finalStats.offers}`);
    }
    
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Create an admin user: node scripts/create-admin.js');
    console.log('2. Start the application: npm run dev');
    console.log('3. Access admin panel: http://localhost:3000/admin');
    
    if (school) {
      console.log(`\n🏫 Sample school created: ${school.name} (${school.identifier})`);
      console.log('   You can use this school for testing purposes.');
    }
    
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\nDatabase setup cancelled by user.');
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

module.exports = { createCategories, createVehicles, createSampleSchool };
