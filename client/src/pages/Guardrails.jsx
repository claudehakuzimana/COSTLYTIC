import { Card, Grid, Button } from '../components/ui';
import { Zap, TrendingDown } from 'lucide-react';
import FeatureGate from '../components/FeatureGate';

export default function Guardrails() {
  const guardrails = [
    { name: 'Monthly Budget', limit: '$25,000', current: '$12,345', percentage: 49, status: 'active' },
    { name: 'Team Budget - Data Science', limit: '$5,000', current: '$3,542', percentage: 71, status: 'warning' },
    { name: 'Cost per Request', limit: '$0.10', current: '$0.047', percentage: 47, status: 'active' },
    { name: 'Daily Limit', limit: '$1,000', current: '$412', percentage: 41, status: 'active' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Guardrails</h1>
        <p className="text-gray-600 mt-2">Set and monitor spending limits and alerts for your organization.</p>
      </div>

      {/* Stats */}
      <Grid cols={3} gap={6}>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Active Guardrails</p>
          <p className="text-3xl font-bold text-gray-900">4</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Warnings</p>
          <p className="text-3xl font-bold text-yellow-600">1</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Budget Utilization</p>
          <p className="text-3xl font-bold text-gray-900">49%</p>
        </Card>
      </Grid>

      {/* Guardrails List */}
      <FeatureGate 
        featureCategory="guardrails" 
        featureName="basic_limits"
        fallback={
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">Guardrails are a Pro feature</p>
            </div>
          </Card>
        }
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Spending Guardrails
            </h3>
            <Button variant="primary" size="sm">Add Guardrail</Button>
          </div>

          <div className="space-y-4">
            {guardrails.map((guardrail, idx) => (
              <Card key={idx} className="cursor-pointer hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{guardrail.name}</h4>
                    <p className="text-sm text-gray-600">Limit: {guardrail.limit}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    guardrail.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {guardrail.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Current: {guardrail.current}</span>
                    <span className="text-sm font-semibold text-gray-900">{guardrail.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        guardrail.percentage > 80 ? 'bg-red-500' : 
                        guardrail.percentage > 60 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${guardrail.percentage}%` }}
                    />
                  </div>
                </div>

                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Edit Guardrail →
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Alert Rules */}
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Alert Rules</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">Budget Threshold Alert</h4>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">ENABLED</span>
              </div>
              <p className="text-sm text-gray-600">Alert when monthly budget reaches 80%</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">Cost Spike Alert</h4>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">ENABLED</span>
              </div>
              <p className="text-sm text-gray-600">Alert when daily cost exceeds 150% of average</p>
            </div>
          </div>
        </Card>
      </FeatureGate>
    </div>
  );
}