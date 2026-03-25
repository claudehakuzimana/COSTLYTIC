// Attribute-Based Access Control (ABAC) Middleware

import { ROLES } from './rbac.js';

// ABAC Policy Engine
export class ABACPolicy {
  constructor() {
    this.policies = [];
  }

  // Add a policy
  addPolicy(policy) {
    this.policies.push(policy);
  }

  // Evaluate if action is allowed based on attributes
  evaluate(subject, resource, action, context = {}) {
    // Check all policies
    for (const policy of this.policies) {
      const result = policy.evaluate(subject, resource, action, context);
      if (result === 'allow') return true;
      if (result === 'deny') return false;
    }
    
    // Default deny
    return false;
  }
}

// Policy class
export class Policy {
  constructor(name, conditions, effect = 'allow') {
    this.name = name;
    this.conditions = conditions;
    this.effect = effect; // 'allow' or 'deny'
  }

  evaluate(subject, resource, action, context) {
    // Check if all conditions are met
    const conditionsMet = this.conditions.every(condition => 
      condition(subject, resource, action, context)
    );

    if (conditionsMet) {
      return this.effect;
    }

    return null; // No decision
  }
}

// Initialize ABAC Policy Engine
export const abacEngine = new ABACPolicy();

// ============================================
// PREDEFINED POLICIES
// ============================================

// Policy 1: Admin can do everything
abacEngine.addPolicy(new Policy(
  'admin-full-access',
  [
    (subject) => subject.role === ROLES.ADMIN
  ],
  'allow'
));

// Policy 2: Users can only access their own organization's data
abacEngine.addPolicy(new Policy(
  'organization-isolation',
  [
    (subject, resource) => {
      if (!resource.organizationId) return true; // No org restriction
      return subject.organizationId === resource.organizationId.toString();
    }
  ],
  'allow'
));

// Policy 3: Users can only modify their own profile
abacEngine.addPolicy(new Policy(
  'own-profile-only',
  [
    (subject, resource, action) => {
      if (action !== 'user:update' && action !== 'user:delete') return false;
      return subject.userId === resource._id?.toString();
    }
  ],
  'allow'
));

// Policy 4: FinOps Manager can view all usage data in their org
abacEngine.addPolicy(new Policy(
  'finops-usage-access',
  [
    (subject, resource, action) => {
      if (subject.role !== ROLES.FINOPS_MANAGER) return false;
      if (!action.startsWith('usage:') && !action.startsWith('analytics:')) return false;
      return subject.organizationId === resource.organizationId?.toString();
    }
  ],
  'allow'
));

// Policy 5: Engineers can only create/read usage data, not delete
abacEngine.addPolicy(new Policy(
  'engineer-usage-restrictions',
  [
    (subject, resource, action) => {
      if (subject.role !== ROLES.ENGINEER) return false;
      if (action === 'usage:delete') return false;
      return ['usage:create', 'usage:read'].includes(action);
    }
  ],
  'allow'
));

// Policy 6: Viewers cannot modify anything
abacEngine.addPolicy(new Policy(
  'viewer-read-only',
  [
    (subject, resource, action) => {
      if (subject.role !== ROLES.VIEWER) return false;
      return action.endsWith(':read');
    }
  ],
  'allow'
));

// Policy 7: Budget modifications require FinOps Manager or Admin
abacEngine.addPolicy(new Policy(
  'budget-modification-restriction',
  [
    (subject, resource, action) => {
      if (!action.startsWith('budget:')) return false;
      if (action === 'budget:read') return true;
      return [ROLES.ADMIN, ROLES.FINOPS_MANAGER].includes(subject.role);
    }
  ],
  'allow'
));

// Policy 8: Time-based access - No modifications during maintenance window
abacEngine.addPolicy(new Policy(
  'maintenance-window-restriction',
  [
    (subject, resource, action, context) => {
      // Example: Block modifications between 2 AM - 4 AM UTC
      const hour = new Date().getUTCHours();
      const isMaintenanceWindow = hour >= 2 && hour < 4;
      
      if (!isMaintenanceWindow) return true;
      
      // During maintenance, only allow read operations
      if (action.endsWith(':read')) return true;
      
      // Admins can still modify during maintenance
      return subject.role === ROLES.ADMIN;
    }
  ],
  'allow'
));

// Policy 9: Team-based access - Users can only see their team's data
abacEngine.addPolicy(new Policy(
  'team-based-access',
  [
    (subject, resource, action, context) => {
      // If resource has team attribute and user has team attribute
      if (resource.team && subject.team) {
        return subject.team === resource.team;
      }
      return true; // No team restriction
    }
  ],
  'allow'
));

// Policy 10: Cost threshold - Require approval for high-cost operations
abacEngine.addPolicy(new Policy(
  'high-cost-approval',
  [
    (subject, resource, action, context) => {
      if (action !== 'usage:create') return true;
      
      // If cost is above threshold, require admin approval
      const costThreshold = 1000;
      if (resource.cost && resource.cost > costThreshold) {
        return subject.role === ROLES.ADMIN || context.approved === true;
      }
      
      return true;
    }
  ],
  'allow'
));

// ============================================
// ABAC MIDDLEWARE
// ============================================

// Middleware to check ABAC policy
export const checkABAC = (action, getResource) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Build subject from authenticated user
      const subject = {
        userId: req.user.userId,
        role: req.user.role,
        organizationId: req.user.organizationId,
        team: req.user.team,
        email: req.user.email,
      };

      // Get resource (can be from params, body, or database)
      let resource = {};
      if (typeof getResource === 'function') {
        resource = await getResource(req);
      } else if (getResource) {
        resource = getResource;
      }

      // Build context
      const context = {
        ip: req.ip,
        timestamp: new Date(),
        method: req.method,
        path: req.path,
        approved: req.body?.approved || false,
      };

      // Evaluate policy
      const allowed = abacEngine.evaluate(subject, resource, action, context);

      if (!allowed) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Access denied by policy',
          action,
          reason: 'ABAC policy evaluation failed'
        });
      }

      // Store evaluation result in request for logging
      req.abacEvaluation = {
        subject,
        resource,
        action,
        context,
        allowed
      };

      next();
    } catch (error) {
      console.error('ABAC evaluation error:', error);
      return res.status(500).json({ error: 'Access control evaluation failed' });
    }
  };
};

// Helper to check ABAC programmatically
export const canAccess = (subject, resource, action, context = {}) => {
  return abacEngine.evaluate(subject, resource, action, context);
};

// Middleware to check resource ownership
export const checkOwnership = (getResourceId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const resourceId = typeof getResourceId === 'function' 
        ? await getResourceId(req) 
        : req.params.id;

      // Check if user owns the resource or is admin
      if (req.user.role === ROLES.ADMIN) {
        return next();
      }

      // Add ownership check logic here based on your models
      // This is a placeholder - implement based on your needs
      
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ error: 'Ownership verification failed' });
    }
  };
};

// Middleware to check organization membership
export const checkOrganization = () => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const orgId = req.params.organizationId || req.body.organizationId;
      
      if (!orgId) {
        return next(); // No org check needed
      }

      // Admins can access any organization
      if (req.user.role === ROLES.ADMIN) {
        return next();
      }

      // Check if user belongs to the organization
      if (req.user.organizationId !== orgId) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You do not have access to this organization'
        });
      }

      next();
    } catch (error) {
      console.error('Organization check error:', error);
      return res.status(500).json({ error: 'Organization verification failed' });
    }
  };
};

export default {
  ABACPolicy,
  Policy,
  abacEngine,
  checkABAC,
  canAccess,
  checkOwnership,
  checkOrganization,
};
