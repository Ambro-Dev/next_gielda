#!/bin/bash

# SSL Setup Script for Production
# This script helps set up SSL certificates for the production deployment

set -e

DOMAIN="gielda.fenilo.pl"
EMAIL="your-email@example.com"

echo "🔒 SSL Certificate Setup for $DOMAIN"
echo "=================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    sudo apt update
    sudo apt install -y certbot
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p ssl-challenge
mkdir -p ssl/live/$DOMAIN

# Check if certificates already exist
if [ -f "ssl/live/$DOMAIN/fullchain.pem" ] && [ -f "ssl/live/$DOMAIN/privkey.pem" ]; then
    echo "✅ SSL certificates already exist"
    echo "   Certificate expires: $(openssl x509 -in ssl/live/$DOMAIN/fullchain.pem -noout -dates | grep notAfter | cut -d= -f2)"
    read -p "Do you want to renew them? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Renewing certificates..."
        sudo certbot renew --webroot -w ./ssl-challenge
        sudo cp -r /etc/letsencrypt/live/$DOMAIN/* ssl/live/$DOMAIN/
        sudo chown -R $USER:$USER ssl/
        echo "✅ Certificates renewed"
    fi
else
    echo "🔐 Obtaining new SSL certificates..."
    echo "   Domain: $DOMAIN"
    echo "   Email: $EMAIL"
    echo ""
    echo "⚠️  Make sure your domain $DOMAIN points to this server's IP address"
    echo "⚠️  Make sure ports 80 and 443 are open in your firewall"
    echo ""
    read -p "Press Enter to continue..."
    
    # Get certificate
    sudo certbot certonly --webroot -w ./ssl-challenge -d $DOMAIN --email $EMAIL --agree-tos --non-interactive
    
    # Copy certificates to our ssl directory
    echo "📋 Copying certificates..."
    sudo cp -r /etc/letsencrypt/live/$DOMAIN/* ssl/live/$DOMAIN/
    sudo chown -R $USER:$USER ssl/
    
    echo "✅ SSL certificates obtained and copied"
fi

# Set proper permissions
echo "🔐 Setting permissions..."
chmod 600 ssl/live/$DOMAIN/privkey.pem
chmod 644 ssl/live/$DOMAIN/fullchain.pem

# Test certificate
echo "🧪 Testing certificate..."
if openssl x509 -in ssl/live/$DOMAIN/fullchain.pem -noout -checkend 0; then
    echo "✅ Certificate is valid"
else
    echo "❌ Certificate is invalid or expired"
    exit 1
fi

echo ""
echo "🎉 SSL setup complete!"
echo "   Certificate location: ssl/live/$DOMAIN/"
echo "   Full chain: ssl/live/$DOMAIN/fullchain.pem"
echo "   Private key: ssl/live/$DOMAIN/privkey.pem"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the correct domain"
echo "2. Run: ./production-setup.sh"
echo "3. Start services: docker-compose up -d"
