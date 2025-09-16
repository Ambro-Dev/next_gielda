#!/bin/bash

# deploy-production.sh - Production deployment script
set -e

echo "🚀 Starting production deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    echo "Copy .env.production to .env and configure it:"
    echo "cp .env.production .env"
    exit 1
fi

# Check if required environment variables are set
print_status "Checking environment variables..."
required_vars=("MONGO_ROOT_PASSWORD" "NEXTAUTH_SECRET" "DATABASE_URL")

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "CHANGE_THIS" .env; then
        print_error "Please configure ${var} in .env file"
        exit 1
    fi
done

# Backup existing deployment (if exists)
if [ "$(docker-compose ps -q)" ]; then
    print_status "Creating backup of current deployment..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    docker-compose ps > "backup_${timestamp}.txt"
    
    print_warning "Stopping current deployment..."
    docker-compose down
fi

# Build and deploy
print_status "Building and starting services..."

# Build with no cache for clean production build
docker-compose build --no-cache app

# Start all services
docker-compose up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
timeout=300  # 5 minutes
elapsed=0

while [ $elapsed -lt $timeout ]; do
    if docker-compose ps | grep -q "(healthy)"; then
        print_status "All services are healthy!"
        break
    fi
    
    if [ $elapsed -eq 0 ]; then
        echo -n "Waiting for health checks"
    fi
    echo -n "."
    sleep 5
    elapsed=$((elapsed + 5))
done

echo "" # New line after dots

if [ $elapsed -ge $timeout ]; then
    print_error "Timeout waiting for services to be healthy"
    print_status "Checking service status:"
    docker-compose ps
    print_status "Checking logs:"
    docker-compose logs --tail=20
    exit 1
fi

# Run database initialization if needed
print_status "Checking database initialization..."
if docker-compose exec -T app node -e "
const { MongoClient } = require('mongodb');
const uri = process.env.DATABASE_URL;
MongoClient.connect(uri).then(client => {
    return client.db().admin().listCollections().toArray();
}).then(collections => {
    if (collections.length === 0) {
        process.exit(1); // Database is empty
    }
    process.exit(0);
}).catch(() => process.exit(1));
" 2>/dev/null; then
    print_status "Database already initialized"
else
    print_status "Initializing database..."
    # Run any initialization scripts here
    if [ -f "./scripts/init-admin.js" ]; then
        docker-compose exec -T app node ./scripts/init-admin.js
    fi
fi

# Display deployment status
echo ""
print_status "=== DEPLOYMENT SUMMARY ==="
docker-compose ps

echo ""
print_status "=== SERVICE URLS ==="
echo "🌐 Application: http://localhost:3000"
echo "🔧 Health Check: http://localhost:3000/api/health"
if docker-compose ps | grep -q nginx; then
    echo "🌍 Nginx: http://localhost:80"
fi

echo ""
print_status "=== USEFUL COMMANDS ==="
echo "📊 View logs: docker-compose logs -f"
echo "📋 Check status: docker-compose ps"
echo "🔄 Restart app: docker-compose restart app"
echo "🛑 Stop all: docker-compose down"

# Test the deployment
print_status "Testing deployment..."
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    print_status "✅ Deployment successful! Application is responding."
else
    print_error "❌ Deployment verification failed. Check logs:"
    docker-compose logs app --tail=10
    exit 1
fi

# Optional: Run smoke tests
if [ -f "./tests/smoke-tests.sh" ]; then
    print_status "Running smoke tests..."
    ./tests/smoke-tests.sh
fi

echo ""
print_status "🎉 Production deployment completed successfully!"
print_warning "Don't forget to:"
echo "  - Set up SSL certificates"
echo "  - Configure domain DNS"
echo "  - Set up monitoring and backups"
echo "  - Review security settings"