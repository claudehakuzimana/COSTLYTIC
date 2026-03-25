import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  database: {
    mongoUri: process.env.MONGO_URI,
    mongoDb: process.env.MONGO_DB || 'ai_cost_intelligence'
  },
  cache: {
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};

export default config;
