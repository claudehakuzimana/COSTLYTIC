import { Card, Grid } from '../components/ui';
import FeatureGate from '../components/FeatureGate';

export default function TokenAttribution() {
  const tokenBreakdown = [
    { model: 'GPT-4', percentage: 35, tokens: '840K', cost: '$2,520' },
    { model: 'Claude-3', percentage: 28, tokens: '672K', cost: '$1,344' },
    { model: 'Gemini', percentage: 18, tokens: '432K', cost: '$389' },
    { model: 'GPT-3.5', percentage: 19, tokens: '456K', cost: '$136' },
  ];

  const teamBreakdown = [
    { team: 'Data Science', percentage: 42, cost: '$2,102' },
    { team: 'Engineering', percentage: 31, cost: '$1,551' },
    { team: 'Product', percentage: 16, cost: '$802' },
    { team: 'Support', percentage: 11, cost: '$552' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Token Attribution</h1>
        <p className="text-gray-600 mt-2">Understand where your tokens are being used and by whom.</p>
      </div>

      {/* Overview */}
      <Grid cols={2} gap={6}>
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900">Tokens by Model</h3>
          <div className="space-y-4">
            {tokenBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.model}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.tokens}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">{item.percentage}% • {item.cost}</p>
              </div>
            ))}
          </div>
        </Card>

        <FeatureGate 
          featureCategory="token_attribution" 
          featureName="team_breakdown"
          fallback={
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">Team breakdown is a Pro feature</p>
              </div>
            </Card>
          }
        >
          <Card>
            <h3 className="text-lg font-semibold mb-6 text-gray-900">Tokens by Team</h3>
            <div className="space-y-4">
              {teamBreakdown.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.team}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.cost}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{item.percentage}% of total</p>
                </div>
              ))}
            </div>
          </Card>
        </FeatureGate>
      </Grid>

      {/* Detailed Stats */}
      <Grid cols={4} gap={6}>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Total Tokens</p>
          <p className="text-2xl font-bold text-gray-900">2.4M</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Input Tokens</p>
          <p className="text-2xl font-bold text-gray-900">1.8M</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Output Tokens</p>
          <p className="text-2xl font-bold text-gray-900">600K</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Avg Per Request</p>
          <p className="text-2xl font-bold text-gray-900">191</p>
        </Card>
      </Grid>
    </div>
  );
}