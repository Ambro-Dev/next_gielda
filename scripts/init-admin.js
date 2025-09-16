#!/usr/bin/env node

/**
 * Initialize Admin User
 * This script creates an admin user if it doesn't exist
 * 
 * Usage:
 *   node scripts/init-admin.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function initAdmin() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://mongo:27017/next_gielda?directConnection=true');
  
  try {
    await client.connect();
    console.log('🔍 Checking for admin user...');
    
    const db = client.db('next_gielda');
    const users = db.collection('users');
    
    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gielda.fenilo.pl';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123456';
    const adminName = process.env.ADMIN_NAME || 'Admin';
    const adminSurname = process.env.ADMIN_SURNAME || 'User';
    
    console.log('📋 Admin configuration:');
    console.log('  Username:', adminUsername);
    console.log('  Email:', adminEmail);
    console.log('  Name:', adminName, adminSurname);
    
    // Check if admin already exists
    const existingAdmin = await users.findOne({ 
      $or: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.username);
      console.log('  Role:', existingAdmin.role);
      console.log('  Email:', existingAdmin.email);
      return;
    }
    
    // Hash the password using sync version
    console.log('🔐 Hashing password...');
    const hashedPassword = bcrypt.hashSync(adminPassword, 12);
    console.log('🔐 Password hashed successfully');
    
    // Create admin user
    const adminUser = {
      username: adminUsername,
      email: adminEmail,
      hashedPassword: hashedPassword,
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
    console.log('  ID:', result.insertedId);
    console.log('  Username:', adminUser.username);
    console.log('  Email:', adminUser.email);
    console.log('  Password:', adminPassword);
    console.log('  Role:', adminUser.role);
    
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    console.error('Stack trace:', error.stack);
    // Don't exit with error code to avoid breaking the container startup
  } finally {
    await client.close();
  }
}

// Run the script
if (require.main === module) {
  initAdmin()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      process.exit(0); // Don't fail the container startup
    });
}

module.exports = { initAdmin };
