import { Card, Grid } from '../components/ui';
import FeatureGate from '../components/FeatureGate';

export default function Infrastructure() {
  const providers = [
    {
      name: 'AWS',
      services: [
        { type: 'EC2 GPU p4', usage: '128 GPU-hours', cost: '$512', utilization: 85 },
        { type: 'RDS', usage: '500 GB', cost: '$150', utilization: 62 },
        { type: 'S3', usage: '2 TB', cost: '$45', utilization: 40 },
      ]
    },
    {
      name: 'GCP',
      services: [
        { type: 'Compute', usage: '256 vCPU', cost: '$256', utilization: 78 },
        { type: 'BigQuery', usage: '10 TB scanned', cost: '$50', utilization: 55 },
        { type: 'Storage', usage: '1.5 TB', cost: '$35', utilization: 35 },
      ]
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Infrastructure</h1>
        <p className="text-gray-600 mt-2">Monitor your cloud infrastructure costs and utilization.</p>
      </div>

      {/* Overall Stats */}
      <Grid cols={4} gap={6}>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Total Cost</p>
          <p className="text-2xl font-bold text-gray-900">$2,145</p>
          <p className="text-xs text-gray-600 mt-2">↑ 5.2% from last week</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Avg Utilization</p>
          <p className="text-2xl font-bold text-gray-900">68%</p>
          <p className="text-xs text-gray-600 mt-2">↑ 2.1% from last week</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Active Resources</p>
          <p className="text-2xl font-bold text-gray-900">47</p>
          <p className="text-xs text-gray-600 mt-2">↓ 3 from last week</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Idle Resources</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-600 mt-2">Potential savings: $450</p>
        </Card>
      </Grid>

      {/* Provider Breakdown */}
      {providers.map((provider, idx) => (
        <Card key={idx}>
          <h3 className="text-lg font-semibold mb-6 text-gray-900">{provider.name}</h3>
          <div className="space-y-4">
            {provider.services.map((service, sidx) => {
              // Check if this is a GPU tracking feature (Pro/Enterprise only)
              const isGPUTracking = service.type.includes('GPU');
              
              if (isGPUTracking) {
                return (
                  <FeatureGate 
                    key={sidx}
                    featureCategory="infrastructure" 
                    featureName="gpu_tracking"
                    fallback={
                      <div className="border-t pt-4 first:border-t-0 first:pt-0">
                        <div className="text-center py-4">
                          <p className="text-gray-500">GPU tracking is a Pro feature</p>
                        </div>
                      </div>
                    }
                  >
                    <div className="border-t pt-4 first:border-t-0 first:pt-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{service.type}</p>
                          <p className="text-sm text-gray-600">{service.usage}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{service.cost}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${service.utilization}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Utilization: {service.utilization}%</p>
                    </div>
                  </FeatureGate>
                );
              }
              
              return (
                <div key={sidx} className="border-t pt-4 first:border-t-0 first:pt-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{service.type}</p>
                      <p className="text-sm text-gray-600">{service.usage}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{service.cost}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: `${service.utilization}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Utilization: {service.utilization}%</p>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}