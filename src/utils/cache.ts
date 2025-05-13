import Redis from 'ioredis';
import { CACHE } from './constants';

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Cache middleware
export const cache = (duration: number = CACHE.DEFAULT_TTL) => {
  return async (req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      res.sendResponse = res.json;
      res.json = (body: any) => {
        redis.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Get cached data
export const getCache = async (key: string): Promise<any> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// Set cached data
export const setCache = async (
  key: string,
  value: any,
  duration: number = CACHE.DEFAULT_TTL
): Promise<void> => {
  try {
    await redis.setex(key, duration, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

// Delete cached data
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

// Clear all cache
export const clearCache = async (): Promise<void> => {
  try {
    const keys = await redis.keys('cache:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};

// Cache with tags
export const cacheWithTags = (
  tags: string[],
  duration: number = CACHE.DEFAULT_TTL
) => {
  return async (req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    const tagKeys = tags.map((tag) => `tag:${tag}`);

    try {
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      res.sendResponse = res.json;
      res.json = async (body: any) => {
        const multi = redis.multi();
        multi.setex(key, duration, JSON.stringify(body));
        tagKeys.forEach((tagKey) => {
          multi.sadd(tagKey, key);
        });
        await multi.exec();
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Invalidate cache by tags
export const invalidateCacheByTags = async (tags: string[]): Promise<void> => {
  try {
    const multi = redis.multi();
    const tagKeys = tags.map((tag) => `tag:${tag}`);

    for (const tagKey of tagKeys) {
      const keys = await redis.smembers(tagKey);
      if (keys.length > 0) {
        multi.del(...keys);
        multi.del(tagKey);
      }
    }

    await multi.exec();
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

// Cache with versioning
export const cacheWithVersion = (
  version: string,
  duration: number = CACHE.DEFAULT_TTL
) => {
  return async (req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${version}:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      res.sendResponse = res.json;
      res.json = (body: any) => {
        redis.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Invalidate cache by version
export const invalidateCacheByVersion = async (version: string): Promise<void> => {
  try {
    const keys = await redis.keys(`cache:${version}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

// Cache with compression
export const cacheWithCompression = (
  duration: number = CACHE.DEFAULT_TTL
) => {
  return async (req: any, res: any, next: any) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse));
      }

      res.sendResponse = res.json;
      res.json = (body: any) => {
        const compressed = JSON.stringify(body);
        redis.setex(key, duration, compressed);
        res.sendResponse(body);
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default {
  cache,
  getCache,
  setCache,
  deleteCache,
  clearCache,
  cacheWithTags,
  invalidateCacheByTags,
  cacheWithVersion,
  invalidateCacheByVersion,
  cacheWithCompression,
}; 