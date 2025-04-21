// redis.js
import Redis from 'ioredis';

const client = new Redis({
  host: 'redis-18443.c301.ap-south-1-1.ec2.redns.redis-cloud.com', // Your cloud host
  port: 18443,             // Your cloud port
  password: 'esrpqZNepEfWpBHYsG0MN5yjHMieWTO9', // Your password
  username: 'default',     // Optional, only if required by your provider
  maxRetriesPerRequest: null
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Test connection (optional, comment out after verifying)
client.set('foo', 'bar').then(() => {
  return client.get('foo');
}).then((result) => {
  console.log(result); // Should print "bar"
}).catch((err) => {
  console.error('Test failed:', err);
});

export default client;