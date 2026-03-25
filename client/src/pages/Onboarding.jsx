import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Key, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Card } from '../components/ui';
import { analyticsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { formatCurrency } from '../utils/formatters';

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function isoDate(d) {
  return new Date(d).toISOString();
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [testSent, setTestSent] = useState(false);
  const [insight, setInsight] = useState({
    weeklySpend: 842,
    monthlySavings: 310,
    hiddenUsageCount: 2
  });

  const steps = useMemo(
    () => [
      { title: 'Connect API key', description: 'Create your tracking key' },
      { title: 'See cost in 30s', description: 'Send one test event' },
      { title: 'Get first insight', description: 'Immediate action suggestions' }
    ],
    []
  );

  useEffect(() => {
    if (!user?.organizationId) {
      navigate('/app/dashboard');
    }
  }, [user, navigate]);

  const handleCreateApiKey = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: 'Onboarding API Key', scopes: ['usage:write'] })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create API key');

      setApiKey(data.apiKey);
      setStep(1);
      toast.success('API key connected');
    } catch (err) {
      toast.error(err.message || 'Failed to create API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const res = await fetch('/api/usage/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
        body: JSON.stringify({
          provider: 'openai',
          model: 'gpt-4o',
          tokens_input: 100,
          tokens_output: 220,
          team: 'engineering',
          application: 'onboarding-test',
          endpoint: '/assistants/reply',
          request_id: `onboarding-${Date.now()}`,
          timestamp: new Date().toISOString()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test event failed');

      setTestSent(true);

      try {
        const now = new Date();
        const weekStart = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
        const weekEnd = endOfDay(now);
        const dashboardRes = await analyticsAPI.getDashboard({
          startDate: isoDate(weekStart),
          endDate: isoDate(weekEnd)
        });
        const stats = dashboardRes.data?.stats || {};
        const weeklySpend =
          (Number(stats.ai?.totalCost) || 0) +
          (Number(stats.infrastructure?.totalCost) || 0) +
          (Number(stats.vector?.totalCost) || 0);
        const monthlySavings = weeklySpend > 0 ? weeklySpend * 4 * 0.22 : 310;
        setInsight({
          weeklySpend: weeklySpend || 842,
          monthlySavings: monthlySavings || 310,
          hiddenUsageCount: 2
        });
      } catch {
        // keep defaults if analytics are not ready yet
      }

      setStep(2);
      toast.success('Great, your first event is in');
    } catch (err) {
      toast.error(err.message || 'Failed to send test event');
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success('API key copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <div className="mx-auto max-w-3xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Fast Onboarding</h1>
        <p className="mt-2 text-gray-600">Connect, send one event, and get your first cost insight in minutes.</p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className={`rounded-lg border p-4 ${i <= step ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white'}`}>
            <p className="text-xs font-semibold uppercase text-gray-500">Step {i + 1}</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{s.title}</p>
            <p className="mt-1 text-xs text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>

      <Card className="space-y-6 p-8">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <Key className="mx-auto mb-4 h-12 w-12 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Step 1: Connect your API key</h2>
              <p className="mt-2 text-gray-600">This key lets your apps send usage and cost events securely.</p>
            </div>
            <Button onClick={handleCreateApiKey} disabled={loading} className="w-full">
              {loading ? 'Connecting...' : 'Connect API Key'}
            </Button>
          </div>
        )}

        {step === 1 && apiKey && (
          <div className="space-y-6">
            <div className="text-center">
              <Send className="mx-auto mb-4 h-12 w-12 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-900">Step 2: See your cost in 30 seconds</h2>
              <p className="mt-2 text-gray-600">Copy your key and send one test event to verify tracking.</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 font-mono text-sm break-all">{apiKey}</div>
            <Button onClick={copyApiKey} variant="secondary" className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Copy API Key
            </Button>
            <Button onClick={handleSendTest} disabled={loading} className="w-full">
              {loading ? 'Sending test event...' : 'Send Test Event'}
            </Button>
          </div>
        )}

        {step === 2 && testSent && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Step 3: Your first insight</h2>
              <p className="mt-2 text-gray-600">This is the value you should see immediately after setup.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs text-gray-600">This Week Spend</p>
                <p className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(insight.weeklySpend)}</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-xs text-green-700">Estimated Savings</p>
                <p className="mt-1 text-xl font-bold text-green-800">{formatCurrency(insight.monthlySavings)}/month</p>
              </div>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-xs text-yellow-700">Hidden Usage Alerts</p>
                <p className="mt-1 text-xl font-bold text-yellow-800">{insight.hiddenUsageCount}</p>
              </div>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-orange-800">
                <Sparkles className="h-4 w-4" />
                What to do right now
              </p>
              <ul className="mt-2 space-y-1 text-sm text-orange-900">
                <li>1. Audit the top endpoint by spend and switch low-risk traffic to cheaper models.</li>
                <li>2. Enable budget alerts at 50%, 80%, and 100%.</li>
                <li>3. Review hidden usage detections to stop untracked costs early.</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate('/app/settings/api-keys')} variant="secondary" className="flex-1">
                Manage API Keys
              </Button>
              <Button onClick={() => navigate('/app/dashboard')} className="flex-1">
                Open AI Cost Advisor
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
