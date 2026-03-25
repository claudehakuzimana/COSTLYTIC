import express from 'express';
import { body } from 'express-validator';
import { createOrganization, getOrganizations, getOrganization, updateOrganization } from '../controllers/organization.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const organizationValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Organization name must be at least 2 characters'),
  body('description').optional().isString().withMessage('Description must be a string')
];

// Routes
router.post('/', authenticate, organizationValidation, createOrganization);
router.get('/', authenticate, getOrganizations);
router.get('/:id', authenticate, getOrganization);
router.put('/:id', authenticate, organizationValidation, updateOrganization);

export default router;