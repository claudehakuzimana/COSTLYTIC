import { useState } from 'react';
import { Check, ArrowRight, CreditCard, Shield, Zap, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useSubscription from '../hooks/useSubscription';
import useAuthStore from '../store/authStore';
import { subscriptionAPI } from '../services/api';
import { DISPLAY_TIER_ORDER, TIER_DETAILS } from '../utils/subscriptionTiers';

export default function Upgrade() {
  const { tier, canUpgrade } = useSubscription();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showFAQ, setShowFAQ] = useState(null);
  const [upgradingTier, setUpgradingTier] = useState(null);

  const canManageBilling = ['admin', 'finops_manager'].includes(user?.role);
  const roleLabel = user?.role === 'admin'
    ? 'Administrator'
    : user?.role === 'finops_manager'
    ? 'FinOps Manager'
    : user?.role === 'engineer'
    ? 'Engineer'
    : 'Viewer';

  const handleUpgrade = async (targetTier) => {
    if (!canManageBilling) {
      toast.error('Only Administrator or FinOps Manager can change plans');
      return;
    }

    try {
      setUpgradingTier(targetTier);
      const response = await subscriptionAPI.upgrade(targetTier);
      const next = response.data?.subscription;

      if (next && user) {
        setUser({
          ...user,
          subscriptionTier: next.tier,
          subscriptionStatus: next.status
        });
      }

      toast.success(response.data?.message || 'Plan updated successfully');
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to update plan'
      );
    } finally {
      setUpgradingTier(null);
    }
  };

  const faqs = [
    { q: 'Can I change my plan anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
    { q: 'Do you offer annual billing?', a: 'Yes, annual billing is available with a 20% discount. Contact our sales team for details.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards and invoicing for annual Pro plans.' },
    { q: 'Is there a free trial?', a: 'Yes, all plans come with a 14-day free trial. No credit card required to get started.' },
    { q: 'What if I need more users?', a: 'Contact our sales team for custom pricing on additional users beyond your plan limit.' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Upgrade to unlock more features and scale your AI cost management</p>
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
        <p className="text-sm text-orange-700 dark:text-orange-300">
          <strong>Current Plan:</strong> {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </p>
        <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
          <strong>Role:</strong> {roleLabel}
        </p>
      </div>

      {!canManageBilling && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Pricing is view-only for your role. Ask an Administrator or FinOps Manager to upgrade or cancel plans.
          </p>
        </div>
      )}

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Yearly <span className="text-green-600 text-xs ml-1">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
        {DISPLAY_TIER_ORDER.map((tierKey) => {
          const tierData = TIER_DETAILS[tierKey];
          const isCurrentTier = tier === tierKey;
          const canUpgradeToTier = canUpgrade(tierKey);
          const price = billingCycle === 'yearly' ? Math.round(tierData.price * 0.8) : tierData.price;

          return (
            <div
              key={tierKey}
              className={`p-10 rounded-xl border-2 transition-all ${
                isCurrentTier
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10 shadow-lg'
                  : tierKey === 'growth'
                  ? 'border-gray-900 dark:border-gray-700 shadow-lg relative'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg'
              }`}
            >
              {tierKey === 'growth' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tierData.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{tierData.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">${price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-green-600 mt-1">Billed ${price * 12} yearly</p>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Users:</strong> {tierData.users ? `Up to ${tierData.users}` : 'Unlimited'}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {tierData.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrentTier ? (
                <button disabled className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  Current Plan
                </button>
              ) : !canManageBilling ? (
                <button disabled className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  Role Restricted
                </button>
              ) : canUpgradeToTier ? (
                <button
                  onClick={() => handleUpgrade(tierKey)}
                  disabled={upgradingTier === tierKey}
                  className="w-full py-3 px-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition font-medium flex items-center justify-center gap-2"
                >
                  {upgradingTier === tierKey ? 'Processing...' : 'Upgrade'} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button disabled className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  Downgrade Not Available
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Secure Payments</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">All payments are processed securely via Stripe</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Money-Back Guarantee</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">30-day money-back guarantee on all plans</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Instant Access</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get access immediately after payment</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowFAQ(showFAQ === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <span className="font-medium text-gray-900 dark:text-white">{item.q}</span>
                <HelpCircle className={`w-5 h-5 text-gray-400 transition ${showFAQ === idx ? 'rotate-180' : ''}`} />
              </button>
              {showFAQ === idx && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Need help choosing a plan?</p>
        <Link
          to="/app/settings"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition font-medium"
        >
          Contact Sales <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
