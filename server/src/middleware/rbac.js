// Role-Based Access Control (RBAC) Middleware

export const ROLES = {
  ADMIN: 'admin',
  FINOPS_MANAGER: 'finops_manager',
  ENGINEER: 'engineer',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Organization Management
  ORG_CREATE: 'org:create',
  ORG_READ: 'org:read',
  ORG_UPDATE: 'org:update',
  ORG_DELETE: 'org:delete',
  ORG_SETTINGS: 'org:settings',
  
  // Usage Data
  USAGE_CREATE: 'usage:create',
  USAGE_READ: 'usage:read',
  USAGE_UPDATE: 'usage:update',
  USAGE_DELETE: 'usage:delete',
  
  // Analytics
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Budget & Alerts
  BUDGET_CREATE: 'budget:create',
  BUDGET_READ: 'budget:read',
  BUDGET_UPDATE: 'budget:update',
  BUDGET_DELETE: 'budget:delete',
  
  // Guardrails
  GUARDRAIL_CREATE: 'guardrail:create',
  GUARDRAIL_READ: 'guardrail:read',
  GUARDRAIL_UPDATE: 'guardrail:update',
  GUARDRAIL_DELETE: 'guardrail:delete',
  
  // API Keys
  APIKEY_CREATE: 'apikey:create',
  APIKEY_READ: 'apikey:read',
  APIKEY_DELETE: 'apikey:delete',
  
  // Shadow AI
  SHADOW_AI_READ: 'shadow_ai:read',
  SHADOW_AI_ACTION: 'shadow_ai:action',
};

// Role to Permissions Mapping
export const rolePermissions = {
  [ROLES.ADMIN]: [
    // Full access to everything
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.ORG_CREATE,
    PERMISSIONS.ORG_READ,
    PERMISSIONS.ORG_UPDATE,
    PERMISSIONS.ORG_DELETE,
    PERMISSIONS.ORG_SETTINGS,
    PERMISSIONS.USAGE_CREATE,
    PERMISSIONS.USAGE_READ,
    PERMISSIONS.USAGE_UPDATE,
    PERMISSIONS.USAGE_DELETE,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.BUDGET_CREATE,
    PERMISSIONS.BUDGET_READ,
    PERMISSIONS.BUDGET_UPDATE,
    PERMISSIONS.BUDGET_DELETE,
    PERMISSIONS.GUARDRAIL_CREATE,
    PERMISSIONS.GUARDRAIL_READ,
    PERMISSIONS.GUARDRAIL_UPDATE,
    PERMISSIONS.GUARDRAIL_DELETE,
    PERMISSIONS.APIKEY_CREATE,
    PERMISSIONS.APIKEY_READ,
    PERMISSIONS.APIKEY_DELETE,
    PERMISSIONS.SHADOW_AI_READ,
    PERMISSIONS.SHADOW_AI_ACTION,
  ],
  
  [ROLES.FINOPS_MANAGER]: [
    // Can manage budgets, view analytics, manage guardrails
    PERMISSIONS.USER_READ,
    PERMISSIONS.ORG_READ,
    PERMISSIONS.USAGE_READ,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.BUDGET_CREATE,
    PERMISSIONS.BUDGET_READ,
    PERMISSIONS.BUDGET_UPDATE,
    PERMISSIONS.BUDGET_DELETE,
    PERMISSIONS.GUARDRAIL_CREATE,
    PERMISSIONS.GUARDRAIL_READ,
    PERMISSIONS.GUARDRAIL_UPDATE,
    PERMISSIONS.GUARDRAIL_DELETE,
    PERMISSIONS.APIKEY_READ,
    PERMISSIONS.SHADOW_AI_READ,
    PERMISSIONS.SHADOW_AI_ACTION,
  ],
  
  [ROLES.ENGINEER]: [
    // Can create usage data, view analytics, read budgets
    PERMISSIONS.USER_READ,
    PERMISSIONS.ORG_READ,
    PERMISSIONS.USAGE_CREATE,
    PERMISSIONS.USAGE_READ,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.BUDGET_READ,
    PERMISSIONS.GUARDRAIL_READ,
    PERMISSIONS.APIKEY_CREATE,
    PERMISSIONS.APIKEY_READ,
    PERMISSIONS.SHADOW_AI_READ,
  ],
  
  [ROLES.VIEWER]: [
    // Read-only access
    PERMISSIONS.USER_READ,
    PERMISSIONS.ORG_READ,
    PERMISSIONS.USAGE_READ,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.BUDGET_READ,
    PERMISSIONS.GUARDRAIL_READ,
    PERMISSIONS.SHADOW_AI_READ,
  ],
};

// Check if user has permission
export const hasPermission = (userRole, permission) => {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
};

// Check if user has any of the permissions
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Check if user has all permissions
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Middleware to check single permission
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `You don't have permission to perform this action. Required: ${permission}`
      });
    }

    next();
  };
};

// Middleware to check multiple permissions (any)
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasAnyPermission(req.user.role, permissions)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `You don't have any of the required permissions: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// Middleware to check multiple permissions (all)
export const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!hasAllPermissions(req.user.role, permissions)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `You don't have all required permissions: ${permissions.join(', ')}`
      });
    }

    next();
  };
};

// Middleware to check role
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

export default {
  ROLES,
  PERMISSIONS,
  rolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
};
