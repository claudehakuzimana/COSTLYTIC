import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env files relative to the server directory so imported Next API routes
// can still see the same variables as the standalone Express server.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

/** Comma-separated list; used so both localhost and 127.0.0.1 work in dev */
function parseCorsOrigins() {
  const raw =
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000,http://127.0.0.1:3000";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const required = ["MONGO_URI", "JWT_SECRET"];
required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});

const corsOrigins = parseCorsOrigins();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 6000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  apiPrefix: process.env.API_PREFIX || "/api",
  /** @deprecated use corsOrigins — kept as first entry for single-origin consumers */
  corsOrigin: corsOrigins[0] || "http://localhost:3000",
  corsOrigins,
  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || "http://localhost:6000/api/auth/google/callback",
  frontendUrl: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || "http://localhost:3000"
};
