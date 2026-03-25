import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Cpu,
  Database,
  DollarSign,
  Lightbulb,
  Radar,
  Target,
  TrendingUp
} from 'lucide-react';
import { analyticsAPI, organizationAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import { formatCurrency } from '../utils/formatters';

function clampPct(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function pctChange(current, previous) {
  const cur = Number(current) || 0;
  const prev = Number(previous) || 0;
  if (prev === 0) return { pct: cur === 0 ? 0 : 100, trend: cur === 0 ? 'down' : 'up' };
  const pct = ((cur - prev) / prev) * 100;
  return { pct, trend: pct >= 0 ? 'up' : 'down' };
}

function isoDate(d) {
  return new Date(d).toISOString();
}

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

function prettyLabel(value) {
  return String(value || 'unknown').replace(/^\w/, (c) => c.toUpperCase());
}

export default function Dashboard() {
  const authUser = useAuthStore((s) => s.user);
  const orgId = useMemo(() => {
    const v = authUser?.organizationId;
    if (!v) return null;
    if (typeof v === 'string') return v;
    if (typeof v === 'object' && v._id) return v._id;
    return null;
  }, [authUser]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsNow, setStatsNow] = useState(null);
  const [statsPrev, setStatsPrev] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [spendByProvider, setSpendByProvider] = useState([]);
  const [costByTeam, setCostByTeam] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [org, setOrg] = useState(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const now = new Date();
        const last7Start = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
        const last7End = endOfDay(now);
        const prev7Start = startOfDay(new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000));
        const prev7End = endOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [dashNow, dashPrev, providerSpend, teamCosts, forecastRes, orgRes] = await Promise.all([
          analyticsAPI.getDashboard({ startDate: isoDate(last7Start), endDate: isoDate(last7End) }),
          analyticsAPI.getDashboard({ startDate: isoDate(prev7Start), endDate: isoDate(prev7End) }),
          analyticsAPI.getSpendByProvider({ startDate: isoDate(monthStart), endDate: isoDate(last7End) }),
          analyticsAPI.getCostByTeam({ startDate: isoDate(monthStart), endDate: isoDate(last7End) }),
          analyticsAPI.getForecast(),
          orgId ? organizationAPI.getById(orgId) : Promise.resolve({ data: null })
        ]);

        setStatsNow(dashNow.data?.stats || null);
        setStatsPrev(dashPrev.data?.stats || null);
        setAlerts(dashNow.data?.alerts || []);
        setSpendByProvider(providerSpend.data?.spend || []);
        setCostByTeam(teamCosts.data?.costs || []);
        setForecast(forecastRes.data?.forecast || null);
        setOrg(orgRes?.data?.organization || orgRes?.data || null);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
        setError(e?.response?.data?.error || 'Failed to load dashboard analytics');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [orgId]);

  const computed = useMemo(() => {
    const now = statsNow || { ai: {}, infrastructure: {}, vector: {} };
    const prev = statsPrev || { ai: {}, infrastructure: {}, vector: {} };

    const aiCost = Number(now.ai?.totalCost) || 0;
    const infraCost = Number(now.infrastructure?.totalCost) || 0;
    const vectorCost = Number(now.vector?.totalCost) || 0;
    const totalSpend = aiCost + infraCost + vectorCost;

    const prevTotalSpend =
      (Number(prev.ai?.totalCost) || 0) +
      (Number(prev.infrastructure?.totalCost) || 0) +
      (Number(prev.vector?.totalCost) || 0);

    const spendDelta = pctChange(totalSpend, prevTotalSpend);
    const cprDelta = pctChange(Number(now.ai?.avgCostPerRequest) || 0, Number(prev.ai?.avgCostPerRequest) || 0);
    const gpuDelta = pctChange(Number(now.infrastructure?.avgUtilization) || 0, Number(prev.infrastructure?.avgUtilization) || 0);
    const vectorDelta = pctChange(Number(now.vector?.totalStorage) || 0, Number(prev.vector?.totalStorage) || 0);

    const providerRaw = (spendByProvider || [])
      .map((p) => ({ provider: prettyLabel(p._id), totalCost: Number(p.totalCost) || 0 }))
      .sort((a, b) => b.totalCost - a.totalCost);
    const providerTotal = providerRaw.reduce((sum, row) => sum + row.totalCost, 0);
    const topProvider = providerRaw[0] || null;
    const topProviderPct = topProvider && providerTotal > 0 ? (topProvider.totalCost / providerTotal) * 100 : 0;

    const teamRaw = (costByTeam || [])
      .map((t) => ({ name: prettyLabel(t._id), spend: Number(t.totalCost) || 0 }))
      .sort((a, b) => b.spend - a.spend);
    const topTeam = teamRaw[0] || null;
    const teamTotal = teamRaw.reduce((sum, t) => sum + t.spend, 0);
    const topTeamPct = topTeam && teamTotal > 0 ? (topTeam.spend / teamTotal) * 100 : 0;

    const budgetLimit = Number(org?.budgets?.monthlyAiBudget) || 0;
    const budgetUsedPct = budgetLimit > 0 ? (aiCost / budgetLimit) * 100 : 0;
    const forecastMonthly = Number(forecast?.monthly) || 0;
    const forecastConfidence = Number(forecast?.confidence) || 0;
    const projectedOverrun = budgetLimit > 0 ? Math.max(0, forecastMonthly - budgetLimit) : 0;

    const highSeverityAlerts = (alerts || []).filter((a) => ['critical', 'high'].includes(a?.severity));

    const topIssues = [];
    if (projectedOverrun > 0) {
      topIssues.push({
        title: `You are projected to overspend by ${formatCurrency(projectedOverrun)} this month.`,
        action: 'Set a hard guardrail at 80% budget and reroute low-risk traffic to lower-cost models.',
        severity: 'high'
      });
    }
    if (topProvider && topProviderPct >= 40) {
      topIssues.push({
        title: `${topProvider.provider} is responsible for ${topProviderPct.toFixed(0)}% of your AI cost.`,
        action: `Review ${topProvider.provider} endpoints first; this is your highest-leverage optimization area.`,
        severity: 'medium'
      });
    }
    if (topTeam && topTeamPct >= 55) {
      topIssues.push({
        title: `${topTeam.name} drives ${topTeamPct.toFixed(0)}% of tracked team spend.`,
        action: `Run a prompt and model audit with ${topTeam.name} this week to reduce concentration risk.`,
        severity: 'medium'
      });
    }
    if (highSeverityAlerts.length > 0) {
      topIssues.push({
        title: highSeverityAlerts[0].title || 'A critical anomaly was detected.',
        action: highSeverityAlerts[0].message || 'Investigate the source immediately and throttle if needed.',
        severity: 'high'
      });
    }
    while (topIssues.length < 3) {
      topIssues.push({
        title: 'No major blocker detected right now.',
        action: 'Keep monitoring daily and enforce budget alerts at 50%, 80%, and 100%.',
        severity: 'low'
      });
    }

    const savingsOpportunities = [
      {
        title: topProvider
          ? `Switch low-risk ${topProvider.provider} traffic to smaller models.`
          : 'Switch repetitive workloads to lower-cost models.',
        impact: formatCurrency((topProvider?.totalCost || aiCost) * 0.42),
        detail: 'Estimated monthly savings if 60% of low-criticality requests move to mini-tier models.'
      },
      {
        title: 'Enable prompt caching for repeated requests.',
        impact: formatCurrency(aiCost * 0.18),
        detail: 'Typical reduction from removing repeated input-token spend.'
      },
      {
        title: 'Right-size infrastructure usage windows.',
        impact: formatCurrency(infraCost * 0.22),
        detail: 'Reduce idle GPU and background processing cost during low-traffic periods.'
      }
    ];

    const anomalies = [];
    if (highSeverityAlerts.length > 0) {
      highSeverityAlerts.slice(0, 3).forEach((a) => {
        anomalies.push({
          label: a.title || 'High severity anomaly',
          detail: a.message || 'Unexpected spend pattern detected.'
        });
      });
    }
    if (anomalies.length < 3 && spendDelta.pct > 25) {
      anomalies.push({
        label: `Weekly spend increased ${spendDelta.pct.toFixed(0)}% vs previous week.`,
        detail: 'Investigate top endpoints launched in the last 7 days.'
      });
    }
    if (anomalies.length < 3 && budgetUsedPct > 70) {
      anomalies.push({
        label: `Budget usage already at ${budgetUsedPct.toFixed(0)}% for AI spend.`,
        detail: 'Turn on escalation notifications for budget crossings.'
      });
    }
    while (anomalies.length < 3) {
      anomalies.push({
        label: 'No strong anomaly signal at the moment.',
        detail: 'Continue monitoring provider and team-level change rates.'
      });
    }

    const providerRows = providerRaw.map((row, idx) => ({
      ...row,
      spend: formatCurrency(row.totalCost),
      percentage: clampPct(providerTotal > 0 ? (row.totalCost / providerTotal) * 100 : 0),
      color: ['bg-gray-900', 'bg-gray-700', 'bg-gray-500', 'bg-gray-300'][idx % 4]
    }));

    return {
      topIssues: topIssues.slice(0, 3),
      savingsOpportunities,
      anomalies: anomalies.slice(0, 3),
      providerRows,
      statsCards: [
        {
          name: 'Total Spend (7d)',
          value: formatCurrency(totalSpend),
          change: `${spendDelta.pct >= 0 ? '+' : ''}${spendDelta.pct.toFixed(1)}%`,
          trend: spendDelta.trend,
          icon: DollarSign
        },
        {
          name: 'Cost per Query',
          value: formatCurrency(Number(now.ai?.avgCostPerRequest) || 0),
          change: `${cprDelta.pct >= 0 ? '+' : ''}${cprDelta.pct.toFixed(1)}%`,
          trend: cprDelta.trend,
          icon: TrendingUp
        },
        {
          name: 'GPU Usage',
          value: `${(Number(now.infrastructure?.avgUtilization) || 0).toFixed(0)}%`,
          change: `${gpuDelta.pct >= 0 ? '+' : ''}${gpuDelta.pct.toFixed(1)}%`,
          trend: gpuDelta.trend,
          icon: Cpu
        },
        {
          name: 'Vector Storage',
          value: `${((Number(now.vector?.totalStorage) || 0) / 1024).toFixed(2)} TB`,
          change: `${vectorDelta.pct >= 0 ? '+' : ''}${vectorDelta.pct.toFixed(1)}%`,
          trend: vectorDelta.trend,
          icon: Database
        }
      ],
      budget: {
        used: aiCost,
        limit: budgetLimit,
        pct: clampPct(budgetUsedPct)
      },
      topTeam,
      forecast: {
        monthly: forecastMonthly,
        confidence: forecastConfidence
      },
      alerts
    };
  }, [alerts, costByTeam, forecast, org, spendByProvider, statsNow, statsPrev]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Cost Advisor</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
          <p className="mt-3 text-sm text-gray-600">Loading decision insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Cost Advisor</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Cost Advisor</h1>
        <p className="mt-1 text-sm text-gray-600">
          What should you do right now? These are your highest-impact actions.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-red-600" />
            <h2 className="text-sm font-semibold text-red-800">Top 3 Cost Issues</h2>
          </div>
          <div className="space-y-3">
            {computed.topIssues.map((issue, idx) => (
              <div key={`${issue.title}-${idx}`} className="rounded-lg border border-red-100 bg-white p-3">
                <p className="text-sm font-semibold text-gray-900">{issue.title}</p>
                <p className="mt-1 text-xs text-gray-600">{issue.action}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-green-700" />
            <h2 className="text-sm font-semibold text-green-800">Savings Opportunities</h2>
          </div>
          <div className="space-y-3">
            {computed.savingsOpportunities.map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="rounded-lg border border-green-100 bg-white p-3">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="mt-1 text-xs text-gray-600">{item.detail}</p>
                <p className="mt-2 text-xs font-semibold text-green-700">Estimated impact: {item.impact}/month</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Radar className="h-5 w-5 text-yellow-700" />
            <h2 className="text-sm font-semibold text-yellow-800">Anomaly Detection</h2>
          </div>
          <div className="space-y-3">
            {computed.anomalies.map((item, idx) => (
              <div key={`${item.label}-${idx}`} className="rounded-lg border border-yellow-100 bg-white p-3">
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="mt-1 text-xs text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {computed.statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Icon className="h-5 w-5 text-gray-700" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
                  {stat.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="mb-1 text-sm text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-base font-semibold text-gray-900">Where Your Money Is Going</h3>
          <div className="space-y-5">
            {computed.providerRows.length === 0 ? (
              <p className="text-sm text-gray-600">No provider spend data yet.</p>
            ) : (
              computed.providerRows.map((item) => (
                <div key={item.provider}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-700">{item.provider}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.spend}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-base font-semibold text-gray-900">Active Alerts</h3>
          <div className="space-y-3">
            {(computed.alerts || []).length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-900">No active alerts</p>
                    <p className="mt-1 text-xs text-gray-600">Enable guardrails to receive anomaly and budget alerts here.</p>
                  </div>
                </div>
              </div>
            ) : (
              computed.alerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`rounded-lg border p-4 ${
                    alert.severity === 'critical' || alert.severity === 'high'
                      ? 'border-red-200 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="mt-1 text-xs text-gray-700">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-sm text-gray-600">Monthly AI Budget</p>
          <p className="mb-1 text-2xl font-bold text-gray-900">{formatCurrency(computed.budget.used)}</p>
          <p className="text-xs text-gray-600">of {formatCurrency(computed.budget.limit)} used</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-gray-900" style={{ width: `${computed.budget.pct}%` }} />
            </div>
            <span className="text-xs font-medium text-gray-700">{computed.budget.pct.toFixed(0)}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-sm text-gray-600">Largest Team Cost Driver</p>
          <p className="mb-1 text-2xl font-bold text-gray-900">{computed.topTeam?.name || '-'}</p>
          <p className="text-xs text-gray-600">
            {computed.topTeam ? `${formatCurrency(computed.topTeam.spend)} tracked this month` : 'No team spend data yet'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-sm text-gray-600">Forecasted Monthly Spend</p>
          <p className="mb-1 text-2xl font-bold text-gray-900">{formatCurrency(computed.forecast.monthly)}</p>
          <p className="text-xs text-gray-600">{computed.forecast.confidence.toFixed(0)}% confidence</p>
        </div>
      </div>
    </div>
  );
}
