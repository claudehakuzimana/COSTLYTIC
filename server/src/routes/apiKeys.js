import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { requirePermission, PERMISSIONS } from '../middleware/rbac.js';
import { listApiKeys, createApiKey, revokeApiKey } from '../controllers/apiKeys.js';

const router = express.Router();

router.get('/', authenticate, requirePermission(PERMISSIONS.APIKEY_READ), listApiKeys);

router.post(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.APIKEY_CREATE),
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('scopes').optional().isArray().withMessage('Scopes must be an array'),
    body('apiKey')
      .optional()
      .isString()
      .isLength({ min: 10 })
      .withMessage('apiKey must be a valid string')
  ],
  createApiKey
);

router.post('/:id/revoke', authenticate, requirePermission(PERMISSIONS.APIKEY_DELETE), revokeApiKey);

export default router;
