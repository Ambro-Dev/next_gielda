#!/bin/bash

# SSL Setup Script for Next.js Gielda Application
# Usage: ./ssl-setup.sh [setup|renew|status|help]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=""
EMAIL=""
SSL_DIR="./ssl"
NGINX_CONF="./nginx.conf"

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

# Function to check if certbot is installed
check_certbot() {
    if ! command -v certbot &> /dev/null; then
        print_error "Certbot is not installed. Installing..."
        sudo apt update
        sudo apt install -y certbot
    fi
}

# Function to setup SSL certificates
setup_ssl() {
    # Interactive input if not provided
    if [ -z "$DOMAIN" ]; then
        echo -n "Enter your domain (e.g., example.com): "
        read DOMAIN
    fi
    
    if [ -z "$EMAIL" ]; then
        echo -n "Enter your email address: "
        read EMAIL
    fi
    
    # Validate inputs
    if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
        print_error "Domain and email are required!"
        exit 1
    fi
    
    # Validate email format
    if [[ ! "$EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
        print_error "Invalid email format!"
        exit 1
    fi
    
    print_status "Setting up SSL for domain: $DOMAIN"
    check_certbot
    
    # Create SSL directory
    mkdir -p "$SSL_DIR"
    
    # Stop nginx temporarily
    print_status "Stopping nginx temporarily..."
    docker compose -f docker-compose.yml -p next-gielda stop nginx-proxy
    
    # Get SSL certificate (only main domain, no www)
    print_status "Requesting SSL certificate from Let's Encrypt..."
    print_status "Note: Only requesting certificate for $DOMAIN (without www)"
    print_status "If you need www subdomain, configure DNS first"
    
    sudo certbot certonly \
        --standalone \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --domains "$DOMAIN" \
        --cert-path "$SSL_DIR"
    
    # Copy certificates to our SSL directory
    print_status "Copying certificates..."
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/cert.pem"
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/key.pem"
    sudo chown -R $(whoami):$(whoami) "$SSL_DIR"
    
    # Update nginx configuration with domain
    print_status "Updating nginx configuration..."
    sed -i "s/yourdomain.com/$DOMAIN/g" "$NGINX_CONF"
    
    # Restart nginx
    print_status "Starting nginx with SSL..."
    docker compose -f docker-compose.yml -p next-gielda up -d nginx-proxy
    
    print_success "SSL setup completed!"
    print_status "Your application is now available at: https://$DOMAIN"
}

# Function to renew SSL certificates
renew_ssl() {
    print_status "Renewing SSL certificates..."
    check_certbot
    
    # Renew certificates
    sudo certbot renew --quiet
    
    # Copy renewed certificates
    if [ -n "$DOMAIN" ]; then
        sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" "$SSL_DIR/cert.pem"
        sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" "$SSL_DIR/key.pem"
        sudo chown -R $(whoami):$(whoami) "$SSL_DIR"
        
        # Reload nginx
        docker compose -f docker-compose.yml -p next-gielda exec nginx-proxy nginx -s reload
        
        print_success "SSL certificates renewed!"
    else
        print_warning "Domain not set. Please set DOMAIN variable."
    fi
}

# Function to check SSL status
check_ssl_status() {
    print_status "Checking SSL status..."
    
    if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
        print_success "SSL certificates found!"
        
        # Check certificate expiry
        if command -v openssl &> /dev/null; then
            EXPIRY=$(openssl x509 -in "$SSL_DIR/cert.pem" -noout -dates | grep notAfter | cut -d= -f2)
            print_status "Certificate expires: $EXPIRY"
        fi
        
        # Check if nginx is running with SSL
        if docker compose -f docker-compose.yml -p next-gielda ps | grep -q "nginx-proxy.*Up"; then
            print_success "Nginx is running with SSL support"
        else
            print_warning "Nginx is not running"
        fi
    else
        print_warning "SSL certificates not found in $SSL_DIR"
        print_status "Run: ./ssl-setup.sh setup"
    fi
}

# Function to create self-signed certificate for testing
create_self_signed() {
    # Interactive input if not provided
    if [ -z "$DOMAIN" ]; then
        echo -n "Enter your domain (e.g., example.com): "
        read DOMAIN
    fi
    
    # Validate input
    if [ -z "$DOMAIN" ]; then
        print_error "Domain is required for self-signed certificate!"
        exit 1
    fi
    
    print_status "Creating self-signed certificate for testing..."
    
    mkdir -p "$SSL_DIR"
    
    # Generate private key
    openssl genrsa -out "$SSL_DIR/key.pem" 2048
    
    # Generate certificate
    openssl req -new -x509 -key "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.pem" -days 365 \
        -subj "/C=PL/ST=State/L=City/O=Organization/CN=$DOMAIN"
    
    # Update nginx configuration
    sed -i "s/yourdomain.com/$DOMAIN/g" "$NGINX_CONF"
    
    print_success "Self-signed certificate created!"
    print_warning "This is for testing only. Use Let's Encrypt for production."
}

# Function to show help
show_help() {
    echo "SSL Setup Script for Next.js Gielda Application"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup         Setup SSL with Let's Encrypt"
    echo "  renew         Renew existing SSL certificates"
    echo "  status        Check SSL certificate status"
    echo "  self-signed   Create self-signed certificate for testing"
    echo "  help          Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DOMAIN        Your domain name (required for setup/self-signed)"
    echo "  EMAIL         Your email address (required for setup)"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 self-signed"
    echo "  $0 renew"
    echo "  $0 status"
}

# Main script logic
case "${1:-help}" in
    setup)
        setup_ssl
        ;;
    renew)
        renew_ssl
        ;;
    status)
        check_ssl_status
        ;;
    self-signed)
        create_self_signed
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
