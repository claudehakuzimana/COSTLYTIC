import { Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';

export default function FeatureGate({ 
  featureCategory, 
  featureName, 
  children,
  fallback = null,
  showUpgradePrompt = true 
}) {
  const { canAccess, getUpgradePath, tier } = useSubscription();
  
  // Check if user has access
  if (canAccess(featureCategory, featureName)) {
    return children;
  }
  
  // Get upgrade suggestion
  const upgradePath = getUpgradePath(featureCategory, featureName);
  
  // If fallback provided, show it
  if (fallback) {
    return fallback;
  }
  
  // Show upgrade prompt
  if (!showUpgradePrompt) {
    return null;
  }
  
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-gray-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Feature Locked
      </h3>
      
      <p className="text-gray-600 mb-6">
        This feature is available on the {upgradePath?.tierDetails?.name || 'Pro'} plan and above.
      </p>
      
      {upgradePath && (
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Upgrade to {upgradePath.tierDetails.name}</strong> to unlock this feature
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {upgradePath.tierDetails.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                {feature}
              </span>
            ))}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            ${upgradePath.tierDetails.price}/month
          </p>
        </div>
      )}
      
      <Link
        to="/upgrade"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
      >
        Upgrade Now <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
