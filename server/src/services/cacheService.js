import Redis from 'ioredis';
import { env } from '../config/env.js';

class CacheService {
  constructor() {
    this.redis = new Redis(env.redisUrl);
    this.defaultTTL = 3600; // 1 hour
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error);
      return false;
    }
  }

  async clear() {
    try {
      await this.redis.flushdb();
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  async getOrSet(key, fetchFunction, ttl = this.defaultTTL) {
    try {
      let value = await this.get(key);
      if (!value) {
        value = await fetchFunction();
        await this.set(key, value, ttl);
      }
      return value;
    } catch (error) {
      console.error(`Error in getOrSet for key ${key}:`, error);
      return await fetchFunction();
    }
  }
}

export default new CacheService();
