import express from 'express';
import {
  getDashboardStats,
  getSpendByProvider,
  getCostByTeam,
  getTokenUsageTrends,
  getCostForecast
} from '../controllers/analytics.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermission, requireAnyPermission, PERMISSIONS } from '../middleware/rbac.js';
import { checkOrganization } from '../middleware/abac.js';

const router = express.Router();

// Routes with RBAC
router.get('/dashboard', 
  authenticate, 
  requirePermission(PERMISSIONS.ANALYTICS_READ),
  checkOrganization(),
  getDashboardStats
);

router.get('/spend-by-provider', 
  authenticate, 
  requirePermission(PERMISSIONS.ANALYTICS_READ),
  checkOrganization(),
  getSpendByProvider
);

router.get('/cost-by-team', 
  authenticate, 
  requireAnyPermission(PERMISSIONS.ANALYTICS_READ, PERMISSIONS.BUDGET_READ),
  checkOrganization(),
  getCostByTeam
);

router.get('/token-trends', 
  authenticate, 
  requirePermission(PERMISSIONS.ANALYTICS_READ),
  checkOrganization(),
  getTokenUsageTrends
);

router.get('/forecast', 
  authenticate, 
  requirePermission(PERMISSIONS.ANALYTICS_READ),
  checkOrganization(),
  getCostForecast
);

export default router;