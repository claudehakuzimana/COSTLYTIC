import express from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import {
  listIntegrations,
  connectIntegration,
  testIntegration,
  disconnectIntegration
} from '../controllers/integrations.js';

const router = express.Router();

const providerValidation = [
  param('provider').isString().notEmpty().withMessage('Provider is required')
];

router.get('/', authenticate, listIntegrations);

router.put(
  '/:provider',
  authenticate,
  providerValidation,
  [body('secret').isString().isLength({ min: 8 }).withMessage('Secret is required')],
  connectIntegration
);

router.post(
  '/:provider/test',
  authenticate,
  providerValidation,
  testIntegration
);

router.delete(
  '/:provider',
  authenticate,
  providerValidation,
  disconnectIntegration
);

export default router;
