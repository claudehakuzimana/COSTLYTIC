import { Card, Grid } from '../components/ui';
import { TrendingUp, AlertTriangle, Target } from 'lucide-react';
import FeatureGate from '../components/FeatureGate';

export default function Forecasting() {
  const forecast = [
    { month: 'April', predicted: '$14,200', trend: '+15.1%', confidence: '92%' },
    { month: 'May', predicted: '$16,800', trend: '+18.3%', confidence: '87%' },
    { month: 'June', predicted: '$19,450', trend: '+15.7%', confidence: '81%' },
    { month: 'July', predicted: '$22,100', trend: '+13.6%', confidence: '76%' },
  ];

  const scenarios = [
    { name: 'Conservative', q2: '$38K', q3: '$52K', change: '-8%' },
    { name: 'Current Trend', q2: '$44K', q3: '$65K', change: '0%' },
    { name: 'High Growth', q2: '$52K', q3: '$79K', change: '+18%' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cost Forecasting</h1>
        <p className="text-gray-600 mt-2">Predict future AI costs and identify optimization opportunities.</p>
      </div>

      {/* Key Metrics */}
      <Grid cols={4} gap={6}>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Q2 Forecast</p>
          <p className="text-3xl font-bold text-gray-900">$44K</p>
          <p className="text-xs text-red-600 mt-1">↑ +22% vs Q1</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Avg Confidence</p>
          <p className="text-3xl font-bold text-gray-900">84%</p>
          <p className="text-xs text-gray-600 mt-1">Based on 6mo history</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Budget Risk</p>
          <p className="text-3xl font-bold text-orange-600">Medium</p>
          <p className="text-xs text-gray-600 mt-1">Projected +15% vs budget</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Annual Run Rate</p>
          <p className="text-3xl font-bold text-gray-900">$238K</p>
          <p className="text-xs text-gray-600 mt-1">Based on current trend</p>
        </Card>
      </Grid>

      {/* Monthly Forecast */}
      <FeatureGate 
        featureCategory="forecasting" 
        featureName="basic_forecast"
        fallback={
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">Cost forecasting is a Pro feature</p>
            </div>
          </Card>
        }
      >
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            30-Day Forecast
          </h3>
          <div className="space-y-4">
            {forecast.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.month}</h4>
                    <p className="text-2xl font-bold text-orange-600 mt-1">{item.predicted}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      item.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {item.trend}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">vs previous month</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Forecast Confidence</span>
                  <span className="font-semibold text-gray-900">{item.confidence}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: item.confidence }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>

      {/* Scenarios */}
      <FeatureGate 
        featureCategory="forecasting" 
        featureName="scenario_planning"
        fallback={
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">Scenario planning is an Enterprise feature</p>
            </div>
          </Card>
        }
      >
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Scenario Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">{scenario.name}</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Q2 Forecast</p>
                    <p className="text-lg font-bold text-gray-900">{scenario.q2}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Q3 Forecast</p>
                    <p className="text-lg font-bold text-gray-900">{scenario.q3}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className={`text-sm font-semibold ${
                      scenario.change.startsWith('-') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scenario.change} vs current
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>
    </div>
  );
}