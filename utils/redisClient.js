// redisClient.js
const Redis = require('ioredis');

// Create and export a single Redis client instance
const redis = new Redis({
  host: 'localhost',  // Redis host
  port: 6379,         // Redis port
  db: 0               // Database index
});

module.exports = redis;
