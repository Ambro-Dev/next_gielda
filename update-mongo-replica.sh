#!/bin/bash

echo "🔄 Updating MongoDB configuration for replica set..."

# Update the DATABASE_URL in .env file
sed -i 's|DATABASE_URL="mongodb://admin:AdminPassword123@localhost:27017/next_gielda?authSource=admin"|DATABASE_URL="mongodb://admin:AdminPassword123@localhost:27017/next_gielda?authSource=admin&replicaSet=rs0"|g' .env

echo "✅ Updated DATABASE_URL with replica set parameter"

# Stop current containers
echo "🛑 Stopping current containers..."
docker compose down

# Start MongoDB with replica set
echo "🚀 Starting MongoDB with replica set configuration..."
docker compose up -d mongo

# Wait for MongoDB to start
echo "⏳ Waiting for MongoDB to start..."
sleep 15

# Initialize replica set
echo "🔧 Initializing MongoDB replica set..."
docker exec next-gielda-mongo mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]})"

echo "✅ MongoDB replica set initialized"

# Start all services
echo "🚀 Starting all services..."
docker compose up -d

echo "✅ All services started with replica set configuration"
echo "🎉 You can now try creating the admin user again!"
