// redis.js
import Redis from 'ioredis';

const client = new Redis({
  host: '**********************', // Your cloud host
  port: 18443,             // Your cloud port
  password: '***************************', // Your password
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