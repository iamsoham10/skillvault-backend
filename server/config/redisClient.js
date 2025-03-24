const redis = require('ioredis');
require('dotenv').config();

// new redis instance
const redisClient = new redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('connect', () => {
    console.log('Connected to redis');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error: ', err);
});

module.exports = redisClient;