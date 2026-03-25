import { Card, Grid } from '../components/ui';
import { Database, HardDrive, Zap } from 'lucide-react';
import FeatureGate from '../components/FeatureGate';

export default function VectorStorage() {
  const providers = [
    { name: 'Pinecone', documents: '2.3M', cost: '$1,240', usage: 78, trend: '+12%' },
    { name: 'Weaviate', documents: '1.8M', cost: '$890', usage: 62, trend: '+8%' },
    { name: 'Milvus', documents: '950K', cost: '$445', usage: 41, trend: '-3%' },
  ];

  const storageBreakdown = [
    { type: 'Production Vectors', size: '2.3 GB', cost: '$156' },
    { type: 'Staging Vectors', size: '856 MB', cost: '$58' },
    { type: 'Cache/Indices', size: '1.2 GB', cost: '$82' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vector Storage</h1>
        <p className="text-gray-600 mt-2">Monitor and optimize your vector database and RAG infrastructure costs.</p>
      </div>

      {/* Stats */}
      <Grid cols={4} gap={6}>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Total Cost</p>
          <p className="text-3xl font-bold text-gray-900">$2,575</p>
          <p className="text-xs text-gray-600 mt-1">Monthly run rate</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Total Documents</p>
          <p className="text-3xl font-bold text-gray-900">5.1M</p>
          <p className="text-xs text-gray-600 mt-1">↑ 320K this month</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Avg Query Latency</p>
          <p className="text-3xl font-bold text-gray-900">142ms</p>
          <p className="text-xs text-gray-600 mt-1">↓ 12ms vs last month</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm mb-2">Providers</p>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-600 mt-1">Active integrations</p>
        </Card>
      </Grid>

      {/* Providers */}
      <Card>
        <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-600" />
          Vector Database Providers
        </h3>
        <div className="space-y-4">
          {providers.map((provider, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{provider.name}</h4>
                  <p className="text-sm text-gray-600">{provider.documents} vectors stored</p>
                </div>
                <span className="text-lg font-bold text-orange-600">{provider.cost}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-600">Storage Utilization</span>
                    <span className="text-sm font-semibold text-gray-900">{provider.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-cyan-500 h-2 rounded-full" style={{ width: `${provider.usage}%` }} />
                  </div>
                </div>
                <span className={`ml-4 text-sm font-semibold ${
                  provider.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {provider.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Storage Breakdown */}
      <FeatureGate 
        featureCategory="vector_storage" 
        featureName="advanced_analytics"
        fallback={
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">Advanced storage analytics is a Pro feature</p>
            </div>
          </Card>
        }
      >
        <Card>
          <h3 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-green-600" />
            Storage Breakdown by Environment
          </h3>
          <div className="space-y-4">
            {storageBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-600">{item.size}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{item.cost}</p>
              </div>
            ))}
          </div>
        </Card>
      </FeatureGate>
    </div>
  );
}