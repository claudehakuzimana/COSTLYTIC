// Health check utility
export const healthCheck = async (mongoConnection, redisConnection) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'unknown',
      redis: 'unknown'
    }
  };

  // Check MongoDB
  try {
    if (mongoConnection?.connection?.readyState === 1) {
      health.services.mongodb = 'ok';
    } else {
      health.services.mongodb = 'down';
      health.status = 'degraded';
    }
  } catch (error) {
    health.services.mongodb = 'error';
    health.status = 'degraded';
  }

  // Check Redis
  try {
    if (redisConnection?.status === 'ready') {
      health.services.redis = 'ok';
    } else {
      health.services.redis = 'down';
      health.status = 'degraded';
    }
  } catch (error) {
    health.services.redis = 'error';
    health.status = 'degraded';
  }

  return health;
};

export default { healthCheck };
