// redisClient.js
import { createClient } from 'redis';
import config from './config.js';

const redisClient = createClient({
  url: config.REDIS_URL

});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));




export default redisClient;