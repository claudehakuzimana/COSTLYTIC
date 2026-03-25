// Subscription middleware for feature access control

const TIER_ORDER = ['free', 'starter', 'growth', 'pro', 'enterprise']; // enterprise kept as legacy

// Feature access configuration (matches frontend)
const FEATURE_ACCESS = {
  dashboard: {
    basic_metrics: ['free', 'starter', 'growth', 'pro', 'enterprise'],
    advanced_analytics: ['pro', 'enterprise'],
    custom_dashboards: ['pro', 'enterprise']
  },
  ai_usage: {
    basic_tracking: ['free', 'starter', 'growth', 'pro', 'enterprise'],
    provider_breakdown: ['starter', 'growth', 'pro', 'enterprise'],
    model_comparison: ['growth', 'pro', 'enterprise'],
    advanced_filtering: ['pro', 'enterprise']
  },
  token_attribution: {
    basic_attribution: ['starter', 'growth', 'pro', 'enterprise'],
    team_breakdown: ['pro', 'enterprise'],
    project_level: ['growth', 'pro', 'enterprise'],
    agent_level: ['pro', 'enterprise']
  },
  infrastructure: {
    basic_monitoring: ['starter', 'growth', 'pro', 'enterprise'],
    gpu_tracking: ['growth', 'pro', 'enterprise'],
    cost_optimization: ['growth', 'pro', 'enterprise']
  },
  vector_storage: {
    basic_tracking: ['starter', 'growth', 'pro', 'enterprise'],
    advanced_analytics: ['pro', 'enterprise']
  },
  shadow_ai: {
    detection: ['growth', 'pro', 'enterprise'],
    alerts: ['growth', 'pro', 'enterprise'],
    advanced_detection: ['pro', 'enterprise']
  },
  guardrails: {
    basic_limits: ['starter', 'growth', 'pro', 'enterprise'],
    advanced_rules: ['growth', 'pro', 'enterprise'],
    automation: ['pro', 'enterprise']
  },
  forecasting: {
    basic_forecast: ['growth', 'pro', 'enterprise'],
    advanced_ml: ['pro', 'enterprise'],
    scenario_planning: ['pro', 'enterprise']
  }
};

const hasFeatureAccess = (tier, featureCategory, featureName) => {
  if (!tier || !FEATURE_ACCESS[featureCategory]) return false;
  const allowedTiers = FEATURE_ACCESS[featureCategory][featureName];
  return Array.isArray(allowedTiers) && allowedTiers.includes(tier);
};

export const requireSubscription = (featureCategory, featureName) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const tier = user.subscriptionTier || 'free';
      if (!hasFeatureAccess(tier, featureCategory, featureName)) {
        return res.status(403).json({
          error: 'Feature not available on your subscription tier',
          requiredTier: FEATURE_ACCESS[featureCategory]?.[featureName]?.[0],
          currentTier: tier,
          feature: featureName,
          category: featureCategory
        });
      }

      next();
    } catch (error) {
      console.error('Subscription middleware error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export const requireTier = (requiredTier) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const tier = user.subscriptionTier || 'free';
      const currentIndex = TIER_ORDER.indexOf(tier);
      const requiredIndex = TIER_ORDER.indexOf(requiredTier);

      if (currentIndex === -1 || requiredIndex === -1 || currentIndex < requiredIndex) {
        return res.status(403).json({
          error: 'Higher subscription tier required',
          requiredTier,
          currentTier: tier
        });
      }

      next();
    } catch (error) {
      console.error('Tier middleware error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export const getUserFeatures = (user) => {
  const tier = user?.subscriptionTier || 'free';
  const accessible = {};

  Object.keys(FEATURE_ACCESS).forEach((category) => {
    accessible[category] = {};
    Object.keys(FEATURE_ACCESS[category]).forEach((feature) => {
      accessible[category][feature] = hasFeatureAccess(tier, category, feature);
    });
  });

  return accessible;
};

export const canAccessFeature = (user, featureCategory, featureName) => {
  const tier = user?.subscriptionTier || 'free';
  return hasFeatureAccess(tier, featureCategory, featureName);
};

export default {
  requireSubscription,
  requireTier,
  getUserFeatures,
  canAccessFeature
};
