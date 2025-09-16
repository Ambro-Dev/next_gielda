#!/usr/bin/env node

/**
 * Create Admin User from Environment Variables
 * This script creates an admin user using environment variables
 * 
 * Usage:
 *   node scripts/create-admin-from-env.js
 *   ADMIN_PASSWORD="MyPassword123!" node scripts/create-admin-from-env.js
 */

const { MongoClient } = require('mongodb');

async function createAdminFromEnv() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://mongo:27017/next_gielda?directConnection=true');
  
  try {
    await client.connect();
    console.log('🚀 Next.js Gielda Transport - Admin User Setup from Environment');
    console.log('===============================================================\n');
    
    const db = client.db('next_gielda');
    const users = db.collection('users');
    
    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gielda.fenilo.pl';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminSurname = process.env.ADMIN_SURNAME || 'User';
    
    console.log('📝 Admin user configuration:');
    console.log('Username:', adminUsername);
    console.log('Email:', adminEmail);
    console.log('Name:', adminName, adminSurname);
    console.log('Password:', adminPassword);
    console.log('');
    
    // Check if admin already exists
    const existingAdmin = await users.findOne({ 
      $or: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('');
      console.log('To create a new admin user, please:');
      console.log('1. Change ADMIN_USERNAME or ADMIN_EMAIL in your .env file');
      console.log('2. Or delete the existing admin user from the database');
      return;
    }
    
    // Create admin user
    const adminUser = {
      username: adminUsername,
      email: adminEmail,
      hashedPassword: adminPassword, // Note: In production, this should be hashed with bcrypt
      role: 'admin',
      name: adminName,
      surname: adminSurname,
      emailVerified: new Date(),
      isBlocked: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await users.insertOne(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log('================================');
    console.log('ID:', result.insertedId);
    console.log('Username:', adminUser.username);
    console.log('Email:', adminUser.email);
    console.log('Password:', adminPassword);
    console.log('Role:', adminUser.role);
    console.log('Created:', adminUser.createdAt);
    console.log('================================\n');
    
    console.log('🔐 You can now log in to the admin panel using these credentials.');
    console.log('🌐 Access the application at: http://localhost:3000/admin');
    console.log('');
    console.log('💡 To change the admin password:');
    console.log('1. Update ADMIN_PASSWORD in your .env file');
    console.log('2. Run this script again');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\nSetup cancelled by user.');
  process.exit(0);
});

// Run the script
if (require.main === module) {
  createAdminFromEnv()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createAdminFromEnv };
