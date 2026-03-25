// Subscription tier definitions and feature access control

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  STARTER: 'starter',
  GROWTH: 'growth',
  PRO: 'pro',
  // Legacy tier retained for backward compatibility with existing users
  ENTERPRISE: 'enterprise'
};

export const TIER_ORDER = ['free', 'starter', 'growth', 'pro', 'enterprise'];
export const DISPLAY_TIER_ORDER = ['free', 'starter', 'growth', 'pro'];

export const TIER_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Lead generator plan to get started quickly',
    users: 1,
    features: [
      'Limited tracking (1 API key)',
      'Basic insights',
      'No alerts',
      'Community support'
    ]
  },
  starter: {
    name: 'Starter',
    price: 29,
    description: 'Full tracking for small teams',
    users: 5,
    features: [
      'Full usage tracking',
      'Basic alerts',
      'Cost breakdown by provider',
      'Email support'
    ]
  },
  growth: {
    name: 'Growth',
    price: 79,
    description: 'Main plan for cost control and optimization',
    users: 25,
    recommended: true,
    features: [
      'Shadow usage detection',
      'Anomaly alerts',
      'Optimization suggestions',
      'Forecasting and guardrails'
    ]
  },
  pro: {
    name: 'Pro',
    price: 149,
    description: 'Advanced controls for scaling teams',
    users: null,
    features: [
      'Team features and access controls',
      'Advanced analytics',
      'Priority support',
      'Security and governance features'
    ]
  },
  enterprise: {
    name: 'Enterprise (Legacy)',
    price: 299,
    description: 'Legacy tier for existing contracts',
    users: null,
    hidden: true,
    features: [
      'Legacy enterprise access',
      'Dedicated support',
      'SSO and custom workflows'
    ]
  }
};

// Feature access control based on subscription tier
export const FEATURE_ACCESS = {
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
  },

  settings: {
    basic_settings: ['free', 'starter', 'growth', 'pro', 'enterprise'],
    team_management: ['pro', 'enterprise'],
    advanced_security: ['pro', 'enterprise'],
    sso: ['pro', 'enterprise']
  },

  support: {
    email_support: ['free', 'starter', 'growth', 'pro', 'enterprise'],
    priority_support: ['pro', 'enterprise'],
    dedicated_support: ['enterprise']
  }
};

export const hasFeatureAccess = (tier, featureCategory, featureName) => {
  if (!tier || !FEATURE_ACCESS[featureCategory]) return false;
  const allowedTiers = FEATURE_ACCESS[featureCategory][featureName];
  return Array.isArray(allowedTiers) && allowedTiers.includes(tier);
};

export const getAccessibleFeatures = (tier) => {
  const accessible = {};
  Object.keys(FEATURE_ACCESS).forEach((category) => {
    accessible[category] = {};
    Object.keys(FEATURE_ACCESS[category]).forEach((feature) => {
      accessible[category][feature] = hasFeatureAccess(tier, category, feature);
    });
  });
  return accessible;
};

function getTierIndex(tier) {
  const index = TIER_ORDER.indexOf(tier);
  return index === -1 ? 0 : index;
}

// Get upgrade suggestions
export const getUpgradeSuggestions = (currentTier, desiredFeature) => {
  const suggestions = [];
  const currentIndex = getTierIndex(currentTier);

  Object.keys(FEATURE_ACCESS).forEach((category) => {
    Object.keys(FEATURE_ACCESS[category]).forEach((feature) => {
      if (feature !== desiredFeature) return;

      const allowedTiers = FEATURE_ACCESS[category][feature];
      if (!Array.isArray(allowedTiers) || allowedTiers.includes(currentTier)) return;

      // Choose the first allowed tier above current tier (instead of max tier).
      const recommendedTier =
        TIER_ORDER.find((tier) => allowedTiers.includes(tier) && getTierIndex(tier) > currentIndex) ||
        allowedTiers[0];

      suggestions.push({
        feature,
        category,
        recommendedTier,
        tierDetails: TIER_DETAILS[recommendedTier]
      });
    });
  });

  return suggestions;
};

// Tier comparison
export const getTierComparison = () => {
  const comparison = {};

  Object.keys(FEATURE_ACCESS).forEach((category) => {
    comparison[category] = {};
    Object.keys(FEATURE_ACCESS[category]).forEach((feature) => {
      comparison[category][feature] = {};
      TIER_ORDER.forEach((tier) => {
        comparison[category][feature][tier] = FEATURE_ACCESS[category][feature].includes(tier);
      });
    });
  });

  return comparison;
};
