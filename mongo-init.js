// MongoDB initialization script
db = db.getSiblingDB('next_gielda');

// Create collections with proper indexes
db.createCollection('users');
db.createCollection('accounts');
db.createCollection('sessions');
db.createCollection('verificationtokens');
db.createCollection('resettokens');
db.createCollection('schools');
db.createCollection('conversations');
db.createCollection('students');
db.createCollection('transports');
db.createCollection('messages');
db.createCollection('offers');
db.createCollection('files');
db.createCollection('offermessages');
db.createCollection('directions');
db.createCollection('objects');
db.createCollection('categories');
db.createCollection('vehicles');
db.createCollection('reports');
db.createCollection('usersvehicles');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.accounts.createIndex({ "provider": 1, "providerAccountId": 1 }, { unique: true });
db.sessions.createIndex({ "sessionToken": 1 }, { unique: true });
db.verificationtokens.createIndex({ "identifier": 1, "token": 1 }, { unique: true });
db.resettokens.createIndex({ "userId": 1 }, { unique: true });
db.resettokens.createIndex({ "token": 1 }, { unique: true });
db.schools.createIndex({ "identifier": 1 }, { unique: true });
db.transports.createIndex({ "creatorId": 1 });
db.transports.createIndex({ "schoolId": 1 });
db.transports.createIndex({ "isAvailable": 1 });
db.transports.createIndex({ "sendDate": 1 });
db.messages.createIndex({ "conversationId": 1 });
db.messages.createIndex({ "senderId": 1 });
db.offers.createIndex({ "transportId": 1 });
db.offers.createIndex({ "creatorId": 1 });
db.offers.createIndex({ "isAccepted": 1 });
db.files.createIndex({ "offerId": 1 });
db.files.createIndex({ "userId": 1 });
db.offermessages.createIndex({ "offerId": 1 });
db.offermessages.createIndex({ "senderId": 1 });
db.offermessages.createIndex({ "receiverId": 1 });
db.directions.createIndex({ "transportId": 1 }, { unique: true });
db.objects.createIndex({ "tansportId": 1 });
db.categories.createIndex({ "name": 1 }, { unique: true });
db.vehicles.createIndex({ "name": 1 }, { unique: true });
db.reports.createIndex({ "userId": 1 });
db.usersvehicles.createIndex({ "userId": 1 });

print('Database initialized successfully');
