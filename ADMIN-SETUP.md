# Admin User Setup Guide

This guide explains how to create and manage admin users for the Next.js Gielda Transport Application.

## 🚀 Quick Setup

### Automated Setup (Recommended)

The deployment script automatically creates a default admin user during installation:

```bash
# Run the deployment script
sudo ./deploy.sh
```

The script will:
1. Create a default admin user with secure credentials
2. Set up the database with required data
3. Generate environment configuration
4. Display admin credentials for first login

### Manual Setup

If you need to create admin users manually:

```bash
# Set up database with sample data
npm run setup:db

# Create an admin user interactively
npm run setup:admin

# Or create admin user with command line arguments
node scripts/create-admin.js --username admin --email admin@example.com --password SecurePass123!
```

## 👤 Admin User Management

### Creating Admin Users

#### Interactive Mode
```bash
node scripts/create-admin.js
```

This will prompt you for:
- Username
- Email address
- Password (with validation)
- First name (optional)
- Last name (optional)

#### Command Line Mode
```bash
node scripts/create-admin.js --username admin --email admin@example.com --password SecurePass123! --name John --surname Doe
```

### Password Requirements

Admin passwords must meet these criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### User Roles

The application supports these user roles:

1. **admin** - Full system administrator
   - Access to all features
   - User management
   - System configuration
   - School management

2. **school_admin** - School administrator
   - Manage school-specific data
   - Manage students and transports
   - Limited to assigned school

3. **user** - Regular user
   - Create and manage transports
   - Place offers
   - Basic functionality

4. **student** - Student user
   - View school transports
   - Limited functionality

## 🔐 Security Best Practices

### Default Admin User

After deployment, you'll receive credentials for the default admin user:

```
Username: admin
Email: admin@yourdomain.com
Password: [generated secure password]
```

**⚠️ IMPORTANT**: Change the default password immediately after first login!

### Password Security

1. **Use strong passwords** - Follow the password requirements
2. **Change default passwords** - Never keep default credentials
3. **Regular password updates** - Update passwords periodically
4. **Unique passwords** - Don't reuse passwords across accounts

### Access Control

1. **Limit admin access** - Only create admin users when necessary
2. **Monitor admin activity** - Check logs for suspicious activity
3. **Regular access review** - Remove unused admin accounts
4. **Secure communication** - Use HTTPS in production

## 🛠️ Database Setup

### Initial Database Setup

The application requires certain data to function properly:

```bash
# Set up database with sample data
npm run setup:db
```

This creates:
- Sample categories (transport types)
- Sample vehicles (vehicle types)
- Sample school for testing
- Database indexes for performance

### Production Database Setup

For production deployment:

```bash
# Initialize production database
npm run init:prod
```

This creates:
- Default admin user
- Default school
- All required categories and vehicles
- Production environment file

## 📊 Admin Panel Access

### Accessing the Admin Panel

1. **Login** to the application
2. **Navigate** to `/admin` (requires admin role)
3. **Manage** users, schools, and system settings

### Admin Panel Features

- **Dashboard** - System overview and statistics
- **User Management** - Create, edit, and manage users
- **School Management** - Manage schools and administrators
- **Reports** - View system reports and analytics
- **Settings** - Configure system settings

## 🔧 Troubleshooting

### Common Issues

#### Admin User Not Created
```bash
# Check if admin user exists
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany({ where: { role: 'admin' } }).then(console.log).finally(() => prisma.$disconnect());"
```

#### Database Connection Issues
```bash
# Test database connection
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$queryRaw\`SELECT 1\`.then(() => console.log('Connected')).catch(console.error).finally(() => prisma.$disconnect());"
```

#### Permission Issues
```bash
# Check file permissions
ls -la /opt/next-gielda/
sudo chown -R nextjs:nodejs /opt/next-gielda/
sudo chmod -R 755 /opt/next-gielda/
```

### Reset Admin Password

If you need to reset an admin password:

```bash
# Connect to database
mongosh "mongodb://localhost:27017/next_gielda"

# Update admin password (replace with actual ObjectId and new password hash)
db.users.updateOne(
  { _id: ObjectId("admin_user_id"), role: "admin" },
  { $set: { hashedPassword: "$2b$12$new_password_hash_here" } }
)
```

## 📝 Scripts Reference

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Database Setup | `npm run setup:db` | Initialize database with sample data |
| Admin Creation | `npm run setup:admin` | Create admin user interactively |
| Production Init | `npm run init:prod` | Full production initialization |
| Full Setup | `npm run setup:full` | Database + admin setup |

### Script Files

| File | Purpose |
|------|---------|
| `scripts/setup-database.js` | Database initialization |
| `scripts/create-admin.js` | Admin user creation |
| `scripts/init-production.js` | Production setup |

## 🚨 Emergency Procedures

### Lost Admin Access

If you lose admin access:

1. **Stop the application**:
   ```bash
   sudo systemctl stop next-gielda
   ```

2. **Create new admin user**:
   ```bash
   cd /opt/next-gielda
   sudo -u nextjs node scripts/create-admin.js
   ```

3. **Start the application**:
   ```bash
   sudo systemctl start next-gielda
   ```

### Database Recovery

If the database is corrupted:

1. **Stop the application**
2. **Restore from backup**:
   ```bash
   mongorestore --db next_gielda /backup/20231201/next_gielda
   ```
3. **Recreate admin user if needed**
4. **Start the application**

## 📞 Support

For additional help:

1. Check the application logs: `sudo journalctl -u next-gielda -f`
2. Review this documentation
3. Check GitHub issues
4. Contact system administrator

---

**Note**: Always test admin user creation in a development environment before deploying to production.
