import { useCallback } from 'react';
import useAuthStore from '../store/authStore';
import {
  hasFeatureAccess,
  getAccessibleFeatures as getAccessibleFeaturesFromTiers,
  getUpgradeSuggestions,
  TIER_DETAILS,
  TIER_ORDER
} from '../utils/subscriptionTiers';

export const useSubscription = () => {
  const user = useAuthStore(state => state.user);
  
  // Get user's subscription tier (default to free if not set)
  const tier = user?.subscriptionTier || 'free';
  
  // Check if user has access to a specific feature
  const canAccess = useCallback((featureCategory, featureName) => {
    return hasFeatureAccess(tier, featureCategory, featureName);
  }, [tier]);
  
  // Get all accessible features for current tier
  const getAccessibleFeatures = useCallback(() => {
    return getAccessibleFeaturesFromTiers(tier);
  }, [tier]);
  
  // Get upgrade suggestions for a feature
  const getUpgradePath = useCallback((featureCategory, featureName) => {
    if (canAccess(featureCategory, featureName)) {
      return null; // Already has access
    }
    
    const suggestions = getUpgradeSuggestions(tier, featureName);
    return suggestions.length > 0 ? suggestions[0] : null;
  }, [tier, canAccess]);
  
  // Check if user is on a specific tier
  const isTier = useCallback((tierName) => {
    return tier === tierName;
  }, [tier]);
  
  // Get current tier details
  const getTierInfo = useCallback(() => {
    return TIER_DETAILS[tier] || TIER_DETAILS.free;
  }, [tier]);
  
  // Check if user can upgrade
  const canUpgrade = useCallback((targetTier) => {
    const currentIndex = TIER_ORDER.indexOf(tier);
    const targetIndex = TIER_ORDER.indexOf(targetTier);
    if (currentIndex === -1 || targetIndex === -1) return false;
    return targetIndex > currentIndex;
  }, [tier]);
  
  return {
    tier,
    canAccess,
    getAccessibleFeatures,
    getUpgradePath,
    isTier,
    getTierInfo,
    canUpgrade,
    tierDetails: TIER_DETAILS
  };
};

export default useSubscription;
