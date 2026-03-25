import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import usageRoutes from './routes/usage.js';
import analyticsRoutes from './routes/analytics.js';
import organizationRoutes from './routes/organization.js';
import subscriptionRoutes from './routes/subscription.js';
import aiRoutes from './routes/ai.js';
import apiKeysRoutes from './routes/apiKeys.js';
import integrationsRoutes from './routes/integrations.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, '../../client/dist');

const app = express();

// Middleware — allow multiple dev origins (localhost vs 127.0.0.1)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (env.corsOrigins.includes(origin)) {
        return callback(null, origin);
      }
      callback(null, false);
    },
    credentials: true
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// API Routes (must be before static so /api/* is not served as static)
app.use('/api', authRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/integrations', integrationsRoutes);

// Health check
app.get(['/health', '/api/health'], (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve frontend: if client/dist exists, serve SPA; otherwise show HTML with instructions
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Costlytic – API</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f3f4f6; }
    .card { background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,.1); max-width: 420px; text-align: center; }
    h1 { margin: 0 0 .5rem; font-size: 1.25rem; color: #111; }
    p { color: #4b5563; margin: 0 0 1.5rem; line-height: 1.5; }
    a { display: inline-block; background: #2563eb; color: #fff; padding: .75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
    a:hover { background: #1d4ed8; }
    code { background: #f3f4f6; padding: .2em .4em; border-radius: 4px; font-size: .9em; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Costlytic API</h1>
    <p>The API is running. To use the app UI, start the frontend and open it in your browser.</p>
    <p><strong>From the project root:</strong><br><code>cd client && npm run dev</code></p>
    <p>Then open <a href="http://localhost:3000" target="_blank" rel="noopener">http://localhost:3000</a></p>
    <a href="http://localhost:3000" target="_blank" rel="noopener">Open app (port 3000)</a>
  </div>
</body>
</html>
    `);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = env.port || 5000;

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
