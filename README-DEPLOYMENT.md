# Next.js Gielda Transport Application - Production Deployment Guide

This guide provides comprehensive instructions for deploying the Next.js Gielda Transport Application on AlmaLinux 9.

## 🚀 Quick Start

### Prerequisites

- AlmaLinux 9 server with root access
- Domain name pointing to your server
- Email address for SSL certificate registration

### Automated Deployment

1. **Clone the repository and run the deployment script:**
   ```bash
   git clone <your-repository-url>
   cd next_gielda
   chmod +x deploy.sh
   sudo ./deploy.sh
   ```

2. **Follow the interactive prompts** to configure your domain and SSL certificate.

## 📋 Manual Deployment Steps

### 1. System Preparation

```bash
# Update system
sudo dnf update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install MongoDB
sudo tee /etc/yum.repos.d/mongodb-org-6.0.repo << EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF

sudo dnf install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod

# Install Nginx
sudo dnf install -y nginx
sudo systemctl enable nginx
```

### 2. Application Setup

```bash
# Create application user
sudo useradd -r -s /bin/false -d /opt/next-gielda nextjs
sudo usermod -aG nodejs nextjs

# Create application directory
sudo mkdir -p /opt/next-gielda
sudo chown -R nextjs:nodejs /opt/next-gielda

# Copy application files
sudo cp -r . /opt/next-gielda/
cd /opt/next-gielda

# Install dependencies
sudo -u nextjs npm ci --only=production

# Generate Prisma client
sudo -u nextjs npx prisma generate

# Build application
sudo -u nextjs npm run build:prod

# Set up database and create admin user
sudo -u nextjs npm run init:prod
```

### 3. Environment Configuration

Create `/opt/next-gielda/.env` with the following variables:

```env
# Database Configuration
DATABASE_URL="mongodb://localhost:27017/next_gielda"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
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
```

### 4. Systemd Service Configuration

```bash
# Copy service file
sudo cp next-gielda.service /etc/systemd/system/

# Reload systemd and enable service
sudo systemctl daemon-reload
sudo systemctl enable next-gielda
sudo systemctl start next-gielda
```

### 5. Nginx Configuration

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Start nginx
sudo systemctl start nginx
```

### 6. SSL Certificate Setup (Let's Encrypt)

```bash
# Install certbot
sudo dnf install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com --email admin@yourdomain.com --agree-tos

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 7. Firewall Configuration

```bash
# Enable and start firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld

# Allow HTTP and HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Configure environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

### Using Docker

1. **Build the image:**
   ```bash
   docker build -t next-gielda .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name next-gielda \
     -p 3000:3000 \
     -e DATABASE_URL="mongodb://host.docker.internal:27017/next_gielda" \
     -e NEXTAUTH_URL="https://yourdomain.com" \
     -e NEXTAUTH_SECRET="your-secret" \
     next-gielda
   ```

## 👤 Admin User Setup

### Automatic Setup

The deployment process automatically creates a default admin user with secure credentials. After deployment, you'll receive:

- **Username**: `admin`
- **Email**: `admin@yourdomain.com` 
- **Password**: [Generated secure password displayed during setup]

### Manual Admin Creation

If you need to create additional admin users:

```bash
# Interactive admin creation
npm run setup:admin

# Command line admin creation
node scripts/create-admin.js --username admin2 --email admin2@example.com --password SecurePass123!
```

### Admin Panel Access

1. Login with admin credentials
2. Navigate to `/admin` 
3. Access full administrative features

**⚠️ Important**: Change the default admin password after first login!

For detailed admin management, see [ADMIN-SETUP.md](./ADMIN-SETUP.md).

## 🔧 Configuration Details

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Public URL of your application | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes |
| `NEXT_PUBLIC_SERVER_URL` | Public server URL for API calls | Yes |
| `NEXT_PUBLIC_GOOGLE_MAP_API_KEY` | Google Maps API key | Yes |
| `EMAIL_SERVER` | SMTP server configuration | Yes |
| `EMAIL_FROM` | From email address | Yes |
| `UPLOADTHING_SECRET` | UploadThing secret key | No |
| `UPLOADTHING_APP_ID` | UploadThing app ID | No |

### Security Considerations

1. **Change default secrets** in production
2. **Use strong passwords** for database and services
3. **Enable firewall** and configure proper rules
4. **Use HTTPS** in production
5. **Regular security updates** for the system
6. **Monitor logs** for suspicious activity

### Performance Optimization

1. **Enable gzip compression** in Nginx
2. **Use CDN** for static assets
3. **Configure caching** headers
4. **Monitor resource usage**
5. **Use PM2** for process management (optional)

## 📊 Monitoring and Maintenance

### Service Management

```bash
# Check service status
sudo systemctl status next-gielda

# View logs
sudo journalctl -u next-gielda -f

# Restart service
sudo systemctl restart next-gielda

# Stop service
sudo systemctl stop next-gielda
```

### Database Management

```bash
# Connect to MongoDB
mongosh

# Backup database
mongodump --db next_gielda --out /backup/$(date +%Y%m%d)

# Restore database
mongorestore --db next_gielda /backup/20231201/next_gielda
```

### Log Management

```bash
# View application logs
sudo journalctl -u next-gielda --since "1 hour ago"

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Setup log rotation
sudo logrotate -f /etc/logrotate.d/next-gielda
```

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start:**
   - Check environment variables
   - Verify database connection
   - Check logs: `sudo journalctl -u next-gielda -f`

2. **Database connection issues:**
   - Verify MongoDB is running: `sudo systemctl status mongod`
   - Check connection string in `.env`
   - Test connection: `mongosh "mongodb://localhost:27017/next_gielda"`

3. **Nginx issues:**
   - Test configuration: `sudo nginx -t`
   - Check error logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify port 80/443 are open

4. **SSL certificate issues:**
   - Check certificate status: `sudo certbot certificates`
   - Renew certificate: `sudo certbot renew`
   - Verify domain DNS settings

### Performance Issues

1. **High memory usage:**
   - Check for memory leaks
   - Adjust systemd memory limits
   - Monitor with `htop` or `top`

2. **Slow response times:**
   - Check database performance
   - Verify Nginx configuration
   - Monitor network latency

## 📞 Support

For additional support or questions:

1. Check the application logs
2. Review this documentation
3. Check GitHub issues
4. Contact system administrator

## 🔄 Updates and Maintenance

### Application Updates

1. **Stop the service:**
   ```bash
   sudo systemctl stop next-gielda
   ```

2. **Backup current version:**
   ```bash
   sudo cp -r /opt/next-gielda /opt/next-gielda.backup.$(date +%Y%m%d)
   ```

3. **Update application:**
   ```bash
   cd /opt/next-gielda
   sudo -u nextjs git pull
   sudo -u nextjs npm ci --only=production
   sudo -u nextjs npx prisma generate
   sudo -u nextjs npm run build
   ```

4. **Start the service:**
   ```bash
   sudo systemctl start next-gielda
   ```

### System Updates

```bash
# Update system packages
sudo dnf update -y

# Update Node.js (if needed)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf update nodejs

# Update MongoDB (if needed)
sudo dnf update mongodb-org
```

---

**Note:** This deployment guide assumes you have basic knowledge of Linux system administration. Always test in a staging environment before deploying to production.
