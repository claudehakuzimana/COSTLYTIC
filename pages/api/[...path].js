let app;
async function getApp() {
  if (!app) {
    const express = await import('express');
    const cors = await import('cors');
    const morgan = await import('morgan');
    
    app = express.default();
    
    app.use(cors.default({
      origin: '*',
      credentials: true
    }));
    app.use(morgan.default('combined'));
    app.use(express.default.json({ limit: '10mb' }));
    app.use(express.default.urlencoded({ extended: true }));

    const { default: authRoutes } = await import('../../server/src/routes/auth.js');
    const { default: usageRoutes } = await import('../../server/src/routes/usage.js');
    const { default: analyticsRoutes } = await import('../../server/src/routes/analytics.js');
    const { default: organizationRoutes } = await import('../../server/src/routes/organization.js');
    const { default: subscriptionRoutes } = await import('../../server/src/routes/subscription.js');
    const { default: aiRoutes } = await import('../../server/src/routes/ai.js');
    const { default: apiKeysRoutes } = await import('../../server/src/routes/apiKeys.js');
    const { default: integrationsRoutes } = await import('../../server/src/routes/integrations.js');

    app.use('/api/auth', authRoutes);
    app.use('/api/usage', usageRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/organizations', organizationRoutes);
    app.use('/api/subscription', subscriptionRoutes);
    app.use('/api/ai', aiRoutes);
    app.use('/api/api-keys', apiKeysRoutes);
    app.use('/api/integrations', integrationsRoutes);
    
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
    
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }
  return app;
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'API unavailable', message: error.message });
  }
}
