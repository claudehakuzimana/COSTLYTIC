import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/auth.js';
import { oauthStatus } from '../controllers/oauth.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('organizationName').trim().isLength({ min: 2 }).withMessage('Organization name must be at least 2 characters'),
  body('role').isIn(['admin', 'finops_manager', 'engineer', 'viewer']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);

// OAuth status (for UI to enable/disable buttons)
router.get('/oauth/status', oauthStatus);

export default router;