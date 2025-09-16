#!/bin/bash

echo "🔄 Setting up MongoDB replica set for Prisma..."

# Update the DATABASE_URL in .env file
echo "📝 Updating DATABASE_URL with replica set parameter..."
sed -i 's|DATABASE_URL="mongodb://admin:AdminPassword123@localhost:27017/next_gielda?authSource=admin"|DATABASE_URL="mongodb://admin:AdminPassword123@localhost:27017/next_gielda?authSource=admin&replicaSet=rs0"|g' .env

echo "✅ Updated DATABASE_URL with replica set parameter"

# Stop current containers
echo "🛑 Stopping current containers..."
docker compose down

# Remove old MongoDB data to start fresh
echo "🗑️ Removing old MongoDB data..."
docker volume rm next_gielda_mongo_data 2>/dev/null || true

# Start MongoDB without authentication first
echo "🚀 Starting MongoDB without authentication for replica set setup..."
docker compose -f docker-compose-replica.yml up -d mongo

# Wait for MongoDB to start
echo "⏳ Waiting for MongoDB to start..."
sleep 20

# Initialize replica set
echo "🔧 Initializing MongoDB replica set..."
docker exec next_gielda-mongo-1 mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]})"

# Wait for replica set to be ready
echo "⏳ Waiting for replica set to be ready..."
sleep 10

# Enable authentication
echo "🔐 Enabling authentication..."
docker exec next_gielda-mongo-1 mongosh --eval "
use admin;
db.createUser({
  user: 'admin',
  pwd: 'AdminPassword123',
  roles: ['root']
});
"

# Restart MongoDB with authentication
echo "🔄 Restarting MongoDB with authentication..."
docker compose -f docker-compose-replica.yml stop mongo
docker compose -f docker-compose-replica.yml up -d mongo

# Wait for MongoDB to restart
echo "⏳ Waiting for MongoDB to restart with authentication..."
sleep 15

# Start all services
echo "🚀 Starting all services..."
docker compose up -d

echo "✅ MongoDB replica set setup complete!"
echo "🎉 You can now try creating the admin user again!"


