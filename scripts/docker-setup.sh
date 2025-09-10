#!/bin/bash

# Docker Compose Production Setup Script
# This script sets up the Next.js Gielda Transport Application for production using Docker Compose

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
DOMAIN=""
EMAIL=""

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

# Check if Docker and Docker Compose are installed
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check for docker compose (newer version) or docker-compose (older version)
    if command -v docker &> /dev/null && docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
        print_success "Docker and Docker Compose (new version) are installed"
    elif command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
        print_success "Docker and Docker Compose (legacy version) are installed"
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root. It's recommended to run as a non-root user with docker group access."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Get domain and email from user
get_configuration() {
    print_status "Getting configuration..."
    
    if [ -z "$DOMAIN" ]; then
        read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
    fi
    
    if [ -z "$EMAIL" ]; then
        read -p "Enter your email address for SSL certificate: " EMAIL
    fi
    
    print_success "Configuration collected"
}

# Create environment file
create_env_file() {
    print_status "Creating environment file..."
    
    if [ -f "$ENV_FILE" ]; then
        print_warning "Environment file already exists. Creating backup..."
        cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Generate secure secrets
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    MONGO_ROOT_PASSWORD=$(openssl rand -base64 32)
    
    cat > "$ENV_FILE" << EOF
# Docker Compose Environment Variables
# Generated on $(date)

# Database Configuration
DATABASE_URL="mongodb://mongo:27017/next_gielda"
MONGO_ROOT_USERNAME="admin"
MONGO_ROOT_PASSWORD="$MONGO_ROOT_PASSWORD"

# NextAuth Configuration
NEXTAUTH_URL="https://$DOMAIN"
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_PUBLIC_SITE_URL="https://$DOMAIN"

# Server Configuration
NEXT_PUBLIC_SERVER_URL="https://$DOMAIN"
NODE_ENV="production"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAP_API_KEY="your-google-maps-api-key-here"

# Email Configuration
EMAIL_SERVER="smtp://username:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@$DOMAIN"

# UploadThing Configuration
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Socket.io Configuration
SOCKET_IO_PORT="3001"
EOF
    
    print_success "Environment file created"
    print_warning "Please update the following variables in $ENV_FILE:"
    print_warning "- NEXT_PUBLIC_GOOGLE_MAP_API_KEY"
    print_warning "- EMAIL_SERVER"
    print_warning "- UPLOADTHING_SECRET (if using file uploads)"
    print_warning "- UPLOADTHING_APP_ID (if using file uploads)"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p uploads logs/nginx backups ssl
    
    print_success "Directories created"
}

# Build and start services
start_services() {
    print_status "Building and starting services..."
    
    # Build the application
    $COMPOSE_CMD -f "$COMPOSE_FILE" build --no-cache
    
    # Start services
    $COMPOSE_CMD -f "$COMPOSE_FILE" up -d
    
    print_success "Services started"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be healthy..."
    
    # Wait for MongoDB
    print_status "Waiting for MongoDB..."
    timeout 60 bash -c "until $COMPOSE_CMD -f $COMPOSE_FILE exec mongo mongosh --eval 'db.adminCommand(\"ping\")' > /dev/null 2>&1; do sleep 2; done"
    
    # Wait for application
    print_status "Waiting for application..."
    timeout 60 bash -c 'until curl -f http://localhost/health > /dev/null 2>&1; do sleep 2; done'
    
    print_success "All services are healthy"
}

# Set up SSL certificate
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    # Install certbot if not installed
    if ! command -v certbot &> /dev/null; then
        print_status "Installing certbot..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y certbot
        elif command -v yum &> /dev/null; then
            sudo yum install -y certbot
        elif command -v dnf &> /dev/null; then
            sudo dnf install -y certbot
        else
            print_warning "Cannot install certbot automatically. Please install it manually."
            return
        fi
    fi
    
    # Get SSL certificate
    print_status "Getting SSL certificate for $DOMAIN..."
    sudo certbot certonly --standalone -d "$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive
    
    # Copy certificates to ssl directory
    if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
        sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ssl/cert.pem
        sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" ssl/key.pem
        sudo chown $(id -u):$(id -g) ssl/cert.pem ssl/key.pem
        
        print_success "SSL certificate installed"
        
        # Update nginx configuration for HTTPS
        print_status "Updating nginx configuration for HTTPS..."
        # This would require updating the nginx.conf file to enable HTTPS
        print_warning "Please update nginx.conf to enable HTTPS configuration"
    else
        print_warning "SSL certificate not found. Please check the domain configuration."
    fi
}

# Initialize database and create admin user
initialize_database() {
    print_status "Initializing database and creating admin user..."
    
    # Wait a bit more for the application to be fully ready
    sleep 10
    
    # Run database initialization
    $COMPOSE_CMD -f "$COMPOSE_FILE" exec app node scripts/init-production.js
    
    print_success "Database initialized and admin user created"
}

# Show status and credentials
show_status() {
    print_status "Checking service status..."
    
    $COMPOSE_CMD -f "$COMPOSE_FILE" ps
    
    print_success "Deployment completed successfully!"
    echo
    print_status "Application is available at: https://$DOMAIN"
    print_status "Admin panel: https://$DOMAIN/admin"
    print_status "Health check: https://$DOMAIN/health"
    echo
    print_status "Default admin credentials:"
    print_status "Username: admin"
    print_status "Email: admin@$DOMAIN"
    print_status "Password: [Check the logs above for the generated password]"
    echo
    print_warning "IMPORTANT: Change the admin password after first login!"
    echo
    print_status "Useful commands:"
    print_status "  View logs: $COMPOSE_CMD -f $COMPOSE_FILE logs -f"
    print_status "  Stop services: $COMPOSE_CMD -f $COMPOSE_FILE down"
    print_status "  Restart services: $COMPOSE_CMD -f $COMPOSE_FILE restart"
    print_status "  Update services: $COMPOSE_CMD -f $COMPOSE_FILE pull && $COMPOSE_CMD -f $COMPOSE_FILE up -d"
}

# Main function
main() {
    print_status "Starting Docker Compose production setup..."
    echo
    
    check_docker
    check_root
    get_configuration
    create_env_file
    create_directories
    start_services
    wait_for_services
    initialize_database
    
    # Ask about SSL setup
    read -p "Do you want to set up SSL certificate with Let's Encrypt? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        setup_ssl
    fi
    
    show_status
}

# Run main function
main "$@"
