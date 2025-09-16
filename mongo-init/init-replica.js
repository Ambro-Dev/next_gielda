// init-replica.js
// Script to initialize replica set for MongoDB

print('Initializing replica set...');

try {
  // Check if replica set already exists
  var status = rs.status();
  print('Replica set already exists');
} catch (error) {
  // If it doesn't exist, initialize it
  print('Creating new replica set...');
  
  var config = {
    _id: 'rs0',
    members: [
      {
        _id: 0,
        host: 'mongo:27017',
        priority: 1
      }
    ]
  };
  
  rs.initiate(config);
  
  print('Replica set initialized');
  
  // Wait for primary
  print('Waiting for primary...');
  while (rs.status().myState !== 1) {
    sleep(1000);
  }
  
  print('MongoDB ready with replica set!');
}
