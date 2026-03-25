import { Shield, Users, KeyRound, ServerCog, Activity } from 'lucide-react';
import { Card, Grid, Alert } from '../components/ui';
import FeatureGate from '../components/FeatureGate';

const rogueKeys = [
  { key: 'sk-unknown-91f2', provider: 'OpenAI', cost: 72, source: 'CI runner (unregistered)' },
  { key: 'ant-api-0ac4', provider: 'Anthropic', cost: 28, source: 'side script on dev laptop' }
];

const untrackedEnvironments = [
  { env: 'cron-job-content-sync', owner: 'platform', spend: 36 },
  { env: 'test-playground', owner: 'frontend', spend: 22 }
];

const anomalies = [
  { event: 'Usage spiked 300% from service api-worker-3', impact: '$24 in 2 hours' },
  { event: 'Unexpected burst from IP 172.24.8.91', impact: '$11 in 30 minutes' }
];

const teamLeaks = [
  { user: 'alex.m', team: 'growth', spend: '$120/day', note: 'Prompt loop retry bug' },
  { user: 'sarah.o', team: 'support', spend: '$48/day', note: 'Uncached FAQ assistant' }
];

const hiddenUsage = 180;

export default function ShadowAI() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hidden AI Usage Detection</h1>
        <p className="mt-2 text-gray-600">
          We detect hidden or unauthorized AI API usage that is costing your company money.
        </p>
      </div>

      <Alert
        type="warning"
        title={`We found ${`$${hiddenUsage}`} of hidden AI usage you did not know about.`}
        message="2 rogue API keys, 2 untracked environments, and 2 cost anomalies require action."
      />

      <Grid cols={4} gap={6}>
        <Card>
          <p className="mb-2 text-sm text-gray-600">Rogue API Keys</p>
          <p className="text-3xl font-bold text-gray-900">{rogueKeys.length}</p>
          <p className="mt-1 text-xs text-gray-600">Unauthorized key activity detected</p>
        </Card>
        <Card>
          <p className="mb-2 text-sm text-gray-600">Untracked Environments</p>
          <p className="text-3xl font-bold text-gray-900">{untrackedEnvironments.length}</p>
          <p className="mt-1 text-xs text-gray-600">Scripts, cron jobs, and test paths</p>
        </Card>
        <Card>
          <p className="mb-2 text-sm text-gray-600">Cost Anomalies</p>
          <p className="text-3xl font-bold text-gray-900">{anomalies.length}</p>
          <p className="mt-1 text-xs text-gray-600">Abnormal spikes from services or IPs</p>
        </Card>
        <Card>
          <p className="mb-2 text-sm text-gray-600">Team-Level Leaks</p>
          <p className="text-3xl font-bold text-red-600">{teamLeaks.length}</p>
          <p className="mt-1 text-xs text-gray-600">Users generating outsized daily spend</p>
        </Card>
      </Grid>

      <FeatureGate
        featureCategory="shadow_ai"
        featureName="detection"
        fallback={
          <Card>
            <div className="py-8 text-center">
              <p className="text-gray-500">Hidden usage detection is a Pro feature</p>
            </div>
          </Card>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <KeyRound className="h-5 w-5 text-orange-600" />
              Rogue API Key Detection
            </h3>
            <div className="space-y-3">
              {rogueKeys.map((item) => (
                <div key={item.key} className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">{item.key}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {item.provider} · {item.source}
                  </p>
                  <p className="mt-2 text-sm font-medium text-red-600">${item.cost} hidden spend</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ServerCog className="h-5 w-5 text-orange-600" />
              Untracked Environments
            </h3>
            <div className="space-y-3">
              {untrackedEnvironments.map((item) => (
                <div key={item.env} className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">{item.env}</p>
                  <p className="mt-1 text-xs text-gray-600">Owner: {item.owner}</p>
                  <p className="mt-2 text-sm font-medium text-gray-900">${item.spend} untracked cost</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Activity className="h-5 w-5 text-orange-600" />
              Cost Anomalies
            </h3>
            <div className="space-y-3">
              {anomalies.map((item) => (
                <div key={item.event} className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">{item.event}</p>
                  <p className="mt-1 text-xs text-gray-700">{item.impact}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Users className="h-5 w-5 text-orange-600" />
              Team-Level Leaks
            </h3>
            <div className="space-y-3">
              {teamLeaks.map((item) => (
                <div key={item.user} className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.user} ({item.team})
                  </p>
                  <p className="mt-1 text-xs text-gray-700">{item.note}</p>
                  <p className="mt-2 text-sm font-medium text-red-700">{item.spend}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Shield className="h-5 w-5 text-orange-600" />
                Recommended Action Right Now
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Revoke rogue keys, block untracked environments, and enforce spend guardrails on risky services.
              </p>
            </div>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Review & Contain
            </button>
          </div>
        </Card>
      </FeatureGate>
    </div>
  );
}
