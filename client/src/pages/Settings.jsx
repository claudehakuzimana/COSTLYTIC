import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle2, Code2, Plug, RefreshCw, ShieldAlert, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Button, Input } from '../components/ui';
import { aiAPI, integrationsAPI } from '../services/api';

const providerCatalog = [
  { id: 'openai', name: 'OpenAI', help: 'Track GPT spend and token usage from your project' },
  { id: 'anthropic', name: 'Anthropic', help: 'Track Claude usage and cost by team and feature' },
  { id: 'google', name: 'Google Gemini', help: 'Track Gemini credit usage and model-level spend' },
  { id: 'aws_bedrock', name: 'AWS Bedrock', help: 'Track Bedrock model costs across workloads' },
  { id: 'mistral', name: 'Mistral AI', help: 'Track Mistral request and token spending' },
  { id: 'cohere', name: 'Cohere', help: 'Track Cohere generation and embed usage spend' },
  { id: 'slack', name: 'Slack Alerts', help: 'Send budget and anomaly alerts to Slack' },
  { id: 'datadog', name: 'Datadog', help: 'Export spend metrics to Datadog dashboards' }
];

function statusBadge(status) {
  if (status === 'success') return { icon: CheckCircle2, text: 'Healthy', className: 'text-green-700 bg-green-100' };
  if (status === 'failed') return { icon: XCircle, text: 'Needs attention', className: 'text-red-700 bg-red-100' };
  return { icon: ShieldAlert, text: 'Not tested', className: 'text-gray-700 bg-gray-100' };
}

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [secrets, setSecrets] = useState({});
  const [assistantType, setAssistantType] = useState('api_code');
  const [assistantLanguage, setAssistantLanguage] = useState('nodejs');
  const [assistantDatabase, setAssistantDatabase] = useState('postgres');
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [assistantResult, setAssistantResult] = useState(null);

  const byProvider = useMemo(() => {
    const map = new Map(integrations.map((item) => [item.provider, item]));
    return providerCatalog.map((provider) => ({
      ...provider,
      ...(map.get(provider.id) || {
        connected: false,
        secretPreview: null,
        lastTestStatus: 'never',
        lastTestError: null
      }),
      // Keep stable provider id for route params. Backend integration payload includes `id` as DB record id.
      id: provider.id
    }));
  }, [integrations]);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const res = await integrationsAPI.list();
      setIntegrations(res.data.integrations || []);
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to load integrations');
    } finally {
      setLoading(false);
    }
  };

  const connectProvider = async (provider) => {
    const secret = (secrets[provider] || '').trim();
    if (!secret) {
      toast.error('Enter a key/secret first');
      return;
    }

    setLoading(true);
    try {
      const res = await integrationsAPI.connect(provider, { secret });
      setSecrets((prev) => ({ ...prev, [provider]: '' }));
      toast.success(res.data?.message || 'Provider connected');
      await loadIntegrations();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to connect provider');
    } finally {
      setLoading(false);
    }
  };

  const testProvider = async (provider) => {
    setLoading(true);
    try {
      const res = await integrationsAPI.test(provider);
      const msg = res.data?.test?.success ? 'Integration test passed' : res.data?.test?.message || 'Integration test failed';
      if (res.data?.test?.success) toast.success(msg);
      else toast.error(msg);
      await loadIntegrations();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to test integration');
    } finally {
      setLoading(false);
    }
  };

  const disconnectProvider = async (provider) => {
    setLoading(true);
    try {
      await integrationsAPI.disconnect(provider);
      toast.success('Provider disconnected');
      await loadIntegrations();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to disconnect provider');
    } finally {
      setLoading(false);
    }
  };

  const generateImplementationKit = async () => {
    setAssistantBusy(true);
    try {
      const res = await aiAPI.getImplementationKit({
        requestType: assistantType,
        language: assistantLanguage,
        database: assistantDatabase
      });
      setAssistantResult(res.data?.kit || null);
      toast.success('Implementation output generated');
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Failed to generate output');
    } finally {
      setAssistantBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Connect providers to your project, then send usage events to analyze spend and detect cost anomalies.
        </p>
      </div>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Plug className="h-5 w-5 text-orange-600" />
          Provider Integrations
        </h3>
        <div className="space-y-4">
          {byProvider.map((item) => {
            const badge = statusBadge(item.lastTestStatus);
            const BadgeIcon = badge.icon;

            return (
              <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.help}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
                    <BadgeIcon className="h-3.5 w-3.5" />
                    {item.connected ? badge.text : 'Not connected'}
                  </div>
                </div>

                {item.connected && (
                  <p className="mb-2 text-xs text-gray-500">
                    Connected secret: {item.secretPreview || '***'}
                  </p>
                )}

                {item.lastTestError ? <p className="mb-2 text-xs text-red-600">Last test: {item.lastTestError}</p> : null}

                <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto]">
                  <Input
                    placeholder={`Paste ${item.name} key/secret`}
                    value={secrets[item.id] || ''}
                    onChange={(e) => setSecrets((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  />
                  <Button
                    variant={item.connected ? 'secondary' : 'primary'}
                    onClick={() => connectProvider(item.id)}
                    disabled={loading}
                  >
                    {item.connected ? 'Update' : 'Connect'}
                  </Button>
                  <Button variant="outline" onClick={() => testProvider(item.id)} disabled={loading || !item.connected}>
                    Test
                  </Button>
                  <Button variant="danger" onClick={() => disconnectProvider(item.id)} disabled={loading || !item.connected}>
                    Disconnect
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Bell className="h-5 w-5 text-orange-600" />
          Send Usage From Your Project
        </h3>
        <p className="mb-3 text-sm text-gray-600">
          After connecting providers, tag requests and ingest usage to analyze total spend, token usage, and cost anomalies.
        </p>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
{`POST /api/usage/ingest
X-API-Key: <your-api-key>
Content-Type: application/json

{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "tokens_input": 1200,
  "tokens_output": 450,
  "team": "frontend",
  "application": "chat-assistant",
  "agent": "support-bot",
  "request_id": "req_123456",
  "timestamp": "2026-03-24T10:00:00.000Z"
}`}
        </pre>
      </Card>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
          <Code2 className="h-5 w-5 text-orange-600" />
          Implementation Assistant
        </h3>
        <p className="mb-4 text-sm text-gray-600">
          When a user asks for API code, backend architecture, or a database schema, generate it instantly here.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Request</span>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={assistantType}
              onChange={(e) => setAssistantType(e.target.value)}
            >
              <option value="api_code">API code</option>
              <option value="backend_architecture">Backend architecture</option>
              <option value="database_schema">Database schema</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Language</span>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={assistantLanguage}
              onChange={(e) => setAssistantLanguage(e.target.value)}
            >
              <option value="nodejs">Node.js</option>
              <option value="python">Python</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Database</span>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={assistantDatabase}
              onChange={(e) => setAssistantDatabase(e.target.value)}
            >
              <option value="postgres">PostgreSQL</option>
              <option value="mysql">MySQL</option>
            </select>
          </label>
        </div>

        <div className="mt-4">
          <Button onClick={generateImplementationKit} disabled={assistantBusy}>
            {assistantBusy ? 'Generating...' : 'Generate Output'}
          </Button>
        </div>

        {assistantResult ? (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-900">{assistantResult.title}</p>
            <p className="mt-1 text-sm text-gray-600">{assistantResult.summary}</p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
{assistantResult.output}
            </pre>
          </div>
        ) : null}
      </Card>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      )}
    </div>
  );
}
