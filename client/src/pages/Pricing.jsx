import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Lead generator tier for fast adoption.',
    highlights: ['Limited tracking (1 API key)', 'Basic insights', 'No alerts'],
    cta: 'Get started free'
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    description: 'Full tracking with the essentials.',
    highlights: ['Full tracking', 'Basic alerts', 'Cost breakdown'],
    cta: 'Start Starter'
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 79,
    description: 'Main plan for active cost control.',
    highlights: ['Shadow detection', 'Anomaly alerts', 'Optimization suggestions'],
    recommended: true,
    cta: 'Start Growth'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    description: 'Advanced controls for larger teams.',
    highlights: ['Team features', 'Advanced analytics', 'Priority support'],
    cta: 'Start Pro'
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Pricing</h1>
          <p className="mt-3 text-lg text-gray-600">Start free, then move to Growth when you want cost savings at scale.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/signup" className="rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-800">
              Create account
            </Link>
            <Link to="/login" className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-900 transition hover:bg-gray-50">
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-xl border p-8 ${
                tier.recommended ? 'border-gray-900 shadow-sm ring-2 ring-gray-900/10' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{tier.name}</h2>
                  <p className="mt-1 text-gray-600">{tier.description}</p>
                </div>
                {tier.recommended ? (
                  <span className="rounded-full bg-gray-900 px-2 py-1 text-xs font-semibold text-white">Main target</span>
                ) : null}
              </div>

              <div className="mt-6 flex items-end gap-2">
                <div className="text-4xl font-bold text-gray-900">${tier.price}</div>
                <div className="mb-1 text-gray-600">/month</div>
              </div>

              <ul className="mt-6 space-y-3">
                {tier.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="mt-0.5 h-5 w-5 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to="/signup"
                  className={`inline-flex w-full justify-center rounded-lg px-4 py-3 font-medium transition ${
                    tier.recommended ? 'bg-gray-900 text-white hover:bg-gray-800' : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-gray-200 bg-gray-50 p-8">
          <h3 className="text-lg font-semibold text-gray-900">Plan strategy</h3>
          <p className="mt-2 text-gray-600">
            Free gets users in, Starter establishes visibility, Growth drives ROI, and Pro supports advanced team operations.
          </p>
        </div>
      </div>
    </div>
  );
}
