# Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Configuration
- [ ] Copy `env.example` to `.env` and configure all variables
- [ ] Set strong, unique secrets for `NEXTAUTH_SECRET`
- [ ] Configure proper `DATABASE_URL` for MongoDB
- [ ] Set correct `NEXTAUTH_URL` and `NEXT_PUBLIC_SERVER_URL`
- [ ] Configure Google Maps API key
- [ ] Set up email server configuration
- [ ] Configure UploadThing credentials (if using file uploads)

### ✅ Security Configuration
- [ ] Change all default passwords and secrets
- [ ] Configure firewall rules (ports 80, 443, 22)
- [ ] Set up SSL certificate (Let's Encrypt recommended)
- [ ] Configure security headers in Nginx
- [ ] Enable fail2ban for SSH protection
- [ ] Set up proper file permissions (755 for directories, 644 for files)

### ✅ Database Setup
- [ ] Install and configure MongoDB
- [ ] Create database and user with proper permissions
- [ ] Run database initialization script
- [ ] Set up database backup strategy
- [ ] Configure MongoDB authentication (recommended)

### ✅ Application Configuration
- [ ] Build application with production configuration
- [ ] Configure systemd service
- [ ] Set up log rotation
- [ ] Configure Nginx reverse proxy
- [ ] Set up health check endpoints

## Deployment Steps

### 1. Server Preparation
```bash
# Update system
sudo dnf update -y

# Install required packages
sudo dnf install -y nodejs mongodb-org nginx firewalld git curl wget

# Configure firewall
sudo systemctl enable --now firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 2. Application Deployment
```bash
# Clone repository
git clone <your-repo-url> /opt/next-gielda

# Create application user
sudo useradd -r -s /bin/false -d /opt/next-gielda nextjs
sudo usermod -aG nodejs nextjs

# Set up application
cd /opt/next-gielda
sudo chown -R nextjs:nodejs /opt/next-gielda
sudo -u nextjs npm ci --only=production
sudo -u nextjs npx prisma generate

# Configure environment
sudo cp env.example .env
sudo nano .env  # Configure your environment variables

# Build application
sudo -u nextjs npm run build:prod
```

### 3. Service Configuration
```bash
# Configure systemd service
sudo cp next-gielda.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable next-gielda

# Configure Nginx
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl enable --now nginx

# Start application
sudo systemctl start next-gielda
```

### 4. SSL Certificate Setup
```bash
# Install certbot
sudo dnf install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com --email admin@yourdomain.com --agree-tos

# Test auto-renewal
sudo certbot renew --dry-run
```

## Post-Deployment Verification

### ✅ Application Health Checks
- [ ] Application starts without errors
- [ ] Health endpoint responds: `curl http://localhost/health`
- [ ] Database connection is working
- [ ] All API endpoints are accessible
- [ ] Static files are served correctly
- [ ] SSL certificate is valid and working

### ✅ Performance Verification
- [ ] Application responds within acceptable time limits
- [ ] Memory usage is within expected ranges
- [ ] CPU usage is normal
- [ ] Database queries are optimized
- [ ] Nginx caching is working

### ✅ Security Verification
- [ ] HTTPS redirect is working
- [ ] Security headers are present
- [ ] Firewall rules are properly configured
- [ ] No sensitive information in logs
- [ ] File permissions are correct
- [ ] Database is not accessible from outside

### ✅ Monitoring Setup
- [ ] Log rotation is configured
- [ ] System monitoring is in place
- [ ] Application monitoring is configured
- [ ] Database monitoring is set up
- [ ] Alerting is configured for critical issues

## Maintenance Tasks

### Daily
- [ ] Check application logs for errors
- [ ] Monitor system resources (CPU, memory, disk)
- [ ] Verify database connectivity
- [ ] Check SSL certificate expiration

### Weekly
- [ ] Review security logs
- [ ] Check for system updates
- [ ] Verify backup integrity
- [ ] Monitor application performance

### Monthly
- [ ] Update system packages
- [ ] Review and rotate logs
- [ ] Test disaster recovery procedures
- [ ] Review security configurations
- [ ] Update dependencies

## Troubleshooting Common Issues

### Application Won't Start
1. Check logs: `sudo journalctl -u next-gielda -f`
2. Verify environment variables
3. Check database connectivity
4. Verify file permissions

### Database Connection Issues
1. Check MongoDB status: `sudo systemctl status mongod`
2. Verify connection string
3. Check firewall rules
4. Test connection: `mongosh "mongodb://localhost:27017/next_gielda"`

### Nginx Issues
1. Test configuration: `sudo nginx -t`
2. Check error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify port binding
4. Check SSL certificate

### Performance Issues
1. Monitor system resources
2. Check database performance
3. Review application logs
4. Verify Nginx configuration

## Emergency Procedures

### Application Down
1. Check service status: `sudo systemctl status next-gielda`
2. Restart service: `sudo systemctl restart next-gielda`
3. Check logs for errors
4. Verify database connectivity

### Database Issues
1. Check MongoDB status: `sudo systemctl status mongod`
2. Restart MongoDB: `sudo systemctl restart mongod`
3. Check disk space
4. Verify data integrity

### Security Incident
1. Check logs for suspicious activity
2. Review firewall rules
3. Check for unauthorized access
4. Update security configurations

## Backup and Recovery

### Database Backup
```bash
# Create backup
mongodump --db next_gielda --out /backup/$(date +%Y%m%d)

# Restore backup
mongorestore --db next_gielda /backup/20231201/next_gielda
```

### Application Backup
```bash
# Backup application files
tar -czf /backup/app-$(date +%Y%m%d).tar.gz /opt/next-gielda

# Backup configuration files
tar -czf /backup/config-$(date +%Y%m%d).tar.gz /etc/nginx/nginx.conf /etc/systemd/system/next-gielda.service
```

## Performance Optimization

### Nginx Optimization
- Enable gzip compression
- Configure caching headers
- Optimize worker processes
- Set up rate limiting

### Application Optimization
- Enable Next.js optimizations
- Configure Prisma connection pooling
- Optimize database queries
- Set up CDN for static assets

### System Optimization
- Configure swap space
- Optimize kernel parameters
- Set up monitoring
- Configure log rotation

---

**Note:** This checklist should be reviewed and updated regularly to ensure it remains current with your application and infrastructure requirements.
