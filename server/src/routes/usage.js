import express from 'express';
import { body } from 'express-validator';
import { ingestUsage, getUsage, getUsageByTeam, getUsageByApplication } from '../controllers/usage.js';
import { authenticate } from '../middleware/auth.js';
import { authenticateApiKey } from '../middleware/apiKeyAuth.js';
import { requirePermission, PERMISSIONS } from '../middleware/rbac.js';
import { checkABAC, checkOrganization } from '../middleware/abac.js';

const router = express.Router();

// Validation rules
const usageValidation = [
  body('provider')
    .isIn(['openai', 'anthropic', 'google', 'meta', 'aws_bedrock', 'mistral', 'cohere', 'openrouter', 'groq'])
    .withMessage('Invalid provider'),
  body('model').isString().notEmpty().withMessage('Model is required'),
  body('tokens_input').isInt({ min: 0 }).withMessage('Tokens input must be a non-negative integer'),
  body('tokens_output').isInt({ min: 0 }).withMessage('Tokens output must be a non-negative integer'),
  body('team').isString().notEmpty().withMessage('Team is required'),
  body('application').isString().notEmpty().withMessage('Application is required'),
  body('request_id').isString().notEmpty().withMessage('Request ID is required'),
  body('timestamp').isISO8601().withMessage('Invalid timestamp format')
];

// Routes with RBAC and ABAC
router.post('/ingest', 
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    const hasBearer = typeof authHeader === 'string' && authHeader.startsWith('Bearer ');
    const hasApiKey = typeof req.headers['x-api-key'] === 'string' || (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('apikey '));

    if (hasBearer) return authenticate(req, res, next);
    if (hasApiKey) return authenticateApiKey(['usage:write'])(req, res, next);
    return res.status(401).json({ error: 'Access token or API key required' });
  },
  // Only apply RBAC/ABAC when request is made by a user JWT.
  (req, res, next) => {
    if (req.apiKey) return next();
    return requirePermission(PERMISSIONS.USAGE_CREATE)(req, res, next);
  },
  (req, res, next) => {
    if (req.apiKey) return next();
    return checkABAC('usage:create', (req2) => req2.body)(req, res, next);
  },
  usageValidation, 
  ingestUsage
);

router.get('/', 
  authenticate, 
  requirePermission(PERMISSIONS.USAGE_READ),
  checkOrganization(),
  getUsage
);

router.get('/team/:team', 
  authenticate, 
  requirePermission(PERMISSIONS.USAGE_READ),
  checkOrganization(),
  getUsageByTeam
);

router.get('/application/:application', 
  authenticate, 
  requirePermission(PERMISSIONS.USAGE_READ),
  checkOrganization(),
  getUsageByApplication
);

export default router;
