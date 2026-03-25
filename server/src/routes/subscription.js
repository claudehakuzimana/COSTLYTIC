import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { getUserFeatures } from '../middleware/subscription.js';
import { requireRole, ROLES } from '../middleware/rbac.js';

const router = express.Router();
const BILLING_ROLES = [ROLES.ADMIN, ROLES.FINOPS_MANAGER];

// Get user's subscription info
router.get('/info', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const accessibleFeatures = getUserFeatures(user);
    
    res.json({
      subscription: {
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        endDate: user.subscriptionEndDate,
        accessibleFeatures,
        canManageBilling: BILLING_ROLES.includes(req.user.role)
      },
      role: req.user.role
    });
  } catch (error) {
    console.error('Get subscription info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all subscription tiers
router.get('/tiers', authenticate, async (req, res) => {
  try {
    const tiers = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        description: 'Lead generator tier for fast adoption',
        features: [
          'Limited tracking (1 API key)',
          'Basic insights',
          'No alerts'
        ]
      },
      {
        id: 'starter',
        name: 'Starter',
        price: 29,
        description: 'For teams needing full tracking',
        features: [
          'Full tracking',
          'Basic alerts',
          'Cost breakdown'
        ]
      },
      {
        id: 'growth',
        name: 'Growth',
        price: 79,
        description: 'Main plan for optimization and anomaly control',
        features: [
          'Shadow detection',
          'Anomaly alerts',
          'Optimization suggestions'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 149,
        description: 'For advanced teams and analytics',
        features: [
          'Team features',
          'Advanced analytics',
          'Priority support'
        ]
      }
    ];
    
    res.json({
      tiers,
      role: req.user.role,
      canManageBilling: BILLING_ROLES.includes(req.user.role)
    });
  } catch (error) {
    console.error('Get tiers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription (simulated - in real app, this would integrate with payment processor)
router.post('/upgrade', authenticate, requireRole(...BILLING_ROLES), async (req, res) => {
  try {
    const { tier } = req.body;
    
    // Keep enterprise as legacy for backward compatibility.
    if (!['free', 'starter', 'growth', 'pro', 'enterprise'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }
    
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user can upgrade
    const tierOrder = ['free', 'starter', 'growth', 'pro', 'enterprise'];
    const currentIndex = tierOrder.indexOf(user.subscriptionTier);
    const targetIndex = tierOrder.indexOf(tier);
    
    if (targetIndex < currentIndex) {
      return res.status(400).json({ error: 'Cannot downgrade via this endpoint' });
    }
    
    // In a real app, you would:
    // 1. Create a checkout session with Stripe/other payment processor
    // 2. Handle webhook for successful payment
    // 3. Update subscription in database
    
    // For demo purposes, we'll simulate the upgrade
    user.subscriptionTier = tier;
    user.subscriptionStatus = 'active';
    user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    
    await user.save();
    
    const accessibleFeatures = getUserFeatures(user);
    
    res.json({
      message: 'Subscription upgraded successfully',
      subscription: {
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        endDate: user.subscriptionEndDate,
        accessibleFeatures
      }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel subscription
router.post('/cancel', authenticate, requireRole(...BILLING_ROLES), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // In a real app, you would:
    // 1. Cancel subscription with payment processor
    // 2. Handle webhook for cancellation
    // 3. Update subscription in database
    
    // For demo purposes, we'll simulate cancellation
    user.subscriptionStatus = 'canceled';
    user.subscriptionTier = 'free'; // Downgrade to free
    
    await user.save();
    
    res.json({
      message: 'Subscription canceled successfully',
      subscription: {
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        endDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
