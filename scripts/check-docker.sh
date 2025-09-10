#!/bin/bash

# Docker and Docker Compose Version Check Script

echo "🔍 Checking Docker and Docker Compose installation..."

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed:"
    docker --version
    
    # Check Docker Compose (new version)
    if docker compose version &> /dev/null; then
        echo "✅ Docker Compose (new version) is installed:"
        docker compose version
        echo "📝 Use: docker compose"
    elif command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose (legacy version) is installed:"
        docker-compose --version
        echo "📝 Use: docker-compose"
    else
        echo "❌ Docker Compose is not installed"
        echo "💡 Install Docker Compose or use Docker Desktop"
    fi
else
    echo "❌ Docker is not installed"
    echo "💡 Please install Docker first"
fi

echo ""
echo "🚀 To run the application:"
echo "   npm run docker:setup"
