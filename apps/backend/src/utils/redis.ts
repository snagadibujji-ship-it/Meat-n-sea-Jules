import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(REDIS_URL);
export const redisSubscriber = new Redis(REDIS_URL);

// Configure keyspace notifications so we can react when an offer expires
redisClient.config('SET', 'notify-keyspace-events', 'Ex').catch((err) => {
  console.warn('Failed to configure Redis keyspace events (may require admin privileges):', err.message);
});
