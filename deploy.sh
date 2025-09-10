#!/bin/bash

# Next.js Gielda Transport Application Deployment Script for AlmaLinux 9
# This script automates the deployment process on AlmaLinux 9

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="next-gielda"
APP_DIR="/opt/$APP_NAME"
SERVICE_USER="nextjs"
SERVICE_GROUP="nodejs"
DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Update system packages
update_system() {
    print_status "Updating system packages..."
    dnf update -y
    print_success "System packages updated"
}

# Install required packages
install_packages() {
    print_status "Installing required packages..."
    
    # Install Node.js 18
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    dnf install -y nodejs
    
    # Install MongoDB
    cat > /etc/yum.repos.d/mongodb-org-6.0.repo << EOF
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF
    
    dnf install -y mongodb-org
    systemctl enable mongod
    systemctl start mongod
    
    # Install Nginx
    dnf install -y nginx
    systemctl enable nginx
    
    # Install other utilities
    dnf install -y git curl wget unzip firewalld
    
    print_success "Required packages installed"
}

# Create application user
create_user() {
    print_status "Creating application user..."
    
    if ! id "$SERVICE_USER" &>/dev/null; then
        useradd -r -s /bin/false -d "$APP_DIR" "$SERVICE_USER"
        usermod -aG "$SERVICE_GROUP" "$SERVICE_USER"
        print_success "User $SERVICE_USER created"
    else
        print_warning "User $SERVICE_USER already exists"
    fi
}

# Setup application directory
setup_app_directory() {
    print_status "Setting up application directory..."
    
    mkdir -p "$APP_DIR"
    chown -R "$SERVICE_USER:$SERVICE_GROUP" "$APP_DIR"
    chmod 755 "$APP_DIR"
    
    print_success "Application directory created"
}

# Deploy application
deploy_app() {
    print_status "Deploying application..."
    
    # Copy application files
    cp -r . "$APP_DIR/"
    cd "$APP_DIR"
    
    # Install dependencies
    npm ci --only=production
    
    # Generate Prisma client
    npx prisma generate
    
    # Set environment variables for build
    export NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
    export NEXTAUTH_URL="http://localhost:3000"
    export NEXTAUTH_SECRET="temp-secret-for-build"
    export NEXTAUTH_PUBLIC_SITE_URL="http://localhost:3000"
    export DATABASE_URL="mongodb://localhost:27017/next_gielda"
    export NEXT_PUBLIC_GOOGLE_MAP_API_KEY="temp-key"
    export EMAIL_SERVER="smtp://temp:temp@smtp.gmail.com:587"
    export EMAIL_FROM="temp@temp.com"
    export UPLOADTHING_SECRET="temp"
    export UPLOADTHING_APP_ID="temp"
    export SOCKET_IO_PORT="3001"
    
    # Build application
    npm run build:prod
    
    # Set up database and admin user
    print_status "Setting up database and admin user..."
    sudo -u nextjs node scripts/init-production.js
    
    # Set proper permissions
    chown -R "$SERVICE_USER:$SERVICE_GROUP" "$APP_DIR"
    chmod -R 755 "$APP_DIR"
    
    print_success "Application deployed"
}

# Configure systemd service
configure_systemd() {
    print_status "Configuring systemd service..."
    
    cp "$APP_DIR/next-gielda.service" /etc/systemd/system/
    systemctl daemon-reload
    systemctl enable next-gielda
    
    print_success "Systemd service configured"
}

# Configure Nginx
configure_nginx() {
    print_status "Configuring Nginx..."
    
    # Backup original nginx config
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
    
    # Copy custom nginx config
    cp "$APP_DIR/nginx.conf" /etc/nginx/nginx.conf
    
    # Test nginx configuration
    nginx -t
    
    print_success "Nginx configured"
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    systemctl enable firewalld
    systemctl start firewalld
    
    # Allow HTTP and HTTPS
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-port=3000/tcp
    
    # Reload firewall
    firewall-cmd --reload
    
    print_success "Firewall configured"
}

# Setup SSL certificate (Let's Encrypt)
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    # Install certbot
    dnf install -y certbot python3-certbot-nginx
    
    # Get SSL certificate
    certbot --nginx -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive
    
    # Setup auto-renewal
    echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
    
    print_success "SSL certificate configured"
}

# Start services
start_services() {
    print_status "Starting services..."
    
    # Start MongoDB
    systemctl restart mongod
    
    # Start application
    systemctl start next-gielda
    
    # Start Nginx
    systemctl restart nginx
    
    # Check service status
    systemctl status next-gielda --no-pager
    systemctl status mongod --no-pager
    systemctl status nginx --no-pager
    
    print_success "Services started"
}

# Setup monitoring and logging
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Create log rotation config
    cat > /etc/logrotate.d/next-gielda << EOF
/opt/next-gielda/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nextjs nodejs
}
EOF
    
    # Setup log directory
    mkdir -p "$APP_DIR/logs"
    chown -R "$SERVICE_USER:$SERVICE_GROUP" "$APP_DIR/logs"
    
    print_success "Monitoring configured"
}

# Main deployment function
main() {
    print_status "Starting deployment of Next.js Gielda Transport Application..."
    
    check_root
    update_system
    install_packages
    create_user
    setup_app_directory
    deploy_app
    configure_systemd
    configure_nginx
    configure_firewall
    
    # Ask for SSL setup
    read -p "Do you want to setup SSL certificate with Let's Encrypt? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_ssl
    fi
    
    setup_monitoring
    start_services
    
    print_success "Deployment completed successfully!"
    print_status "Application is available at: http://$DOMAIN"
    print_status "To check application status: systemctl status next-gielda"
    print_status "To view logs: journalctl -u next-gielda -f"
}

# Run main function
main "$@"
