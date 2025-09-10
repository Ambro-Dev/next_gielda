#!/usr/bin/env node

/**
 * Create First Admin User Script
 * This script creates the first admin user for the Next.js Gielda Transport Application
 * 
 * Usage:
 *   node scripts/create-admin.js
 *   node scripts/create-admin.js --username admin --email admin@example.com --password secret123
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Helper function to ask for password (hidden input)
function askPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeAllListeners('data');
          console.log(''); // New line
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\b':
        case '\u007f':
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  return null;
}

// Check if admin user already exists
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

// Create admin user
async function createAdminUser(userData) {
  try {
    const { username, email, password, name, surname } = userData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      throw new Error(`User with username "${username}" or email "${email}" already exists`);
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
        role: 'admin',
        name: name || 'Admin',
        surname: surname || 'User',
        emailVerified: new Date(),
        isBlocked: false
      }
    });
    
    return adminUser;
  } catch (error) {
    throw new Error(`Failed to create admin user: ${error.message}`);
  }
}

// Main function
async function main() {
  console.log('🚀 Next.js Gielda Transport - Admin User Setup');
  console.log('===============================================\n');
  
  try {
    // Check if admin already exists
    const adminExists = await checkAdminExists();
    if (adminExists) {
      console.log('⚠️  Admin user already exists in the database.');
      const continueSetup = await askQuestion('Do you want to create another admin user? (y/N): ');
      if (continueSetup.toLowerCase() !== 'y' && continueSetup.toLowerCase() !== 'yes') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
    }
    
    // Get command line arguments
    const args = process.argv.slice(2);
    let username, email, password, name, surname;
    
    // Parse command line arguments
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i];
      const value = args[i + 1];
      
      switch (key) {
        case '--username':
          username = value;
          break;
        case '--email':
          email = value;
          break;
        case '--password':
          password = value;
          break;
        case '--name':
          name = value;
          break;
        case '--surname':
          surname = value;
          break;
      }
    }
    
    // Collect user information
    if (!username) {
      username = await askQuestion('Enter admin username: ');
    }
    
    if (!email) {
      email = await askQuestion('Enter admin email: ');
    }
    
    // Validate email
    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    
    if (!name) {
      name = await askQuestion('Enter admin first name (optional): ');
    }
    
    if (!surname) {
      surname = await askQuestion('Enter admin last name (optional): ');
    }
    
    if (!password) {
      while (true) {
        password = await askPassword('Enter admin password: ');
        const passwordError = validatePassword(password);
        if (passwordError) {
          console.log(`\n❌ ${passwordError}`);
          continue;
        }
        
        const confirmPassword = await askPassword('Confirm admin password: ');
        if (password !== confirmPassword) {
          console.log('\n❌ Passwords do not match. Please try again.');
          continue;
        }
        break;
      }
    } else {
      // Validate provided password
      const passwordError = validatePassword(password);
      if (passwordError) {
        throw new Error(passwordError);
      }
    }
    
    console.log('\n📝 Creating admin user...');
    
    // Create admin user
    const adminUser = await createAdminUser({
      username,
      email,
      password,
      name,
      surname
    });
    
    console.log('\n✅ Admin user created successfully!');
    console.log('================================');
    console.log(`Username: ${adminUser.username}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Name: ${adminUser.name} ${adminUser.surname}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`Created: ${adminUser.createdAt}`);
    console.log('================================\n');
    
    console.log('🔐 You can now log in to the admin panel using these credentials.');
    console.log('🌐 Access the application at: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\nSetup cancelled by user.');
  rl.close();
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

module.exports = { createAdminUser, checkAdminExists };
