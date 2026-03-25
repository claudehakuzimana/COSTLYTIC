import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowRight, Check, Menu, Play, Sparkles, X } from 'lucide-react';

const randomSeed = (seed) => {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const barGroups = useMemo(() => {
    const next = randomSeed(42);
    return Array.from({ length: 30 }, (_, i) =>
      ['#00e5a0', '#818cf8', '#f59e0b'].map((color, ci) => ({
        color,
        height: Math.max(10, Math.floor(next() * [75, 55, 40][ci])),
        highlight: i === 29,
      }))
    );
  }, []);

  const tickers = [
    'gpt-4o - $0.0050 / 1K tokens',
    'claude-3.5-sonnet - $0.0030 / 1K tokens',
    'gemini-1.5-pro - $0.00125 / 1K tokens',
    'gpt-4o-mini - $0.000150 / 1K tokens',
    'claude-3-haiku - $0.000250 / 1K tokens',
    'mistral-large - $0.004 / 1K tokens',
    'gemini-flash - $0.000075 / 1K tokens',
    'gpt-4-turbo - $0.010 / 1K tokens',
  ];

  const steps = [
    {
      title: 'Connect your providers',
      desc: 'Add OpenAI, Anthropic, and Gemini keys in one panel. Usage data only, no prompt storage.',
      code: ['const client = new OpenAI({', "  defaultHeaders: { 'X-Costlytic-Tag': 'team:frontend' }", '})'],
      status: ['Connected and tracking live', '3 providers synced', 'Last sync: 2 seconds ago'],
    },
    {
      title: 'Tag your requests',
      desc: 'Add one metadata header for team and feature attribution.',
      code: ["headers['X-Costlytic-Tag'] = 'feature:search'", "headers['X-Costlytic-Team'] = 'platform'"],
      status: ['Tag validation passed', 'Attribution coverage: 96%', 'Finance views unlocked'],
    },
    {
      title: 'Set budgets and alerts',
      desc: 'Define thresholds by project and notify Slack, email, or webhooks.',
      code: ['budget.monthly = 6000', 'alerts.thresholds = [50, 80, 100]', "alerts.channel = 'slack'"],
      status: ['Budget policies active', '80% alert configured', 'Escalation channel mapped'],
    },
    {
      title: 'Optimize and iterate',
      desc: 'Use model comparisons and anomalies to lower spend while preserving quality.',
      code: ["optimizer.suggest('chat-assistant')", "switchModel('gpt-4o', 'gpt-4o-mini')", 'estimatedSavings = 31%'],
      status: ['3 savings opportunities found', 'Projected monthly savings: $1,920', 'Confidence score: high'],
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090b] text-zinc-100 font-display">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-35"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,160,0.12),transparent_55%)]" />

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#09090b]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#00e5a0] text-black shadow-[0_0_20px_rgba(0,229,160,0.35)]"><Sparkles className="h-4 w-4" /></span>
            <span className="text-sm font-bold">Costlytic</span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {['#features', '#integrations', '#pricing', '#docs'].map((href, i) => (
              <a key={href} href={href} className="text-sm text-zinc-400 transition hover:text-zinc-100">
                {['Features', 'Integrations', 'Pricing', 'Docs'][i]}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-[#00e5a0] hover:text-[#00e5a0]">Sign in</Link>
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-lg bg-[#00e5a0] px-4 py-2 text-sm font-bold text-black shadow-[0_0_24px_rgba(0,229,160,0.35)]">Start free <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <button type="button" className="text-zinc-400 md:hidden" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#09090b] px-4 py-4 md:hidden">
            <div className="space-y-3">
              {['Features', 'Integrations', 'Pricing', 'Docs'].map((label, i) => (
                <a key={label} href={['#features', '#integrations', '#pricing', '#docs'][i]} className="block text-sm text-zinc-400">{label}</a>
              ))}
              <Link to="/login" className="block text-sm text-zinc-400">Sign in</Link>
              <Link to="/signup" className="inline-flex w-full justify-center rounded-lg bg-[#00e5a0] px-4 py-2 text-sm font-semibold text-black">Start free</Link>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        <section className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00e5a0]/30 bg-[#00e5a0]/10 px-4 py-1.5 font-mono text-sm text-[#00e5a0] animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00e5a0] animate-pulse" />
              Now tracking GPT-4o, Claude 3.5, Gemini 1.5 and 40+ models
            </div>
            <h1 className="mx-auto mt-8 max-w-3xl text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl lg:text-7xl animate-slide-up">
              Stop guessing<br />your <span className="text-[#00e5a0] font-semibold">AI costs.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300 sm:text-xl animate-fade-in-up-delay">Real-time spend tracking, budget alerts, and team usage analytics for every AI API your company uses.</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-delay-2">
              <Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#00e5a0] px-7 py-3.5 text-sm font-bold text-black shadow-[0_0_26px_rgba(0,229,160,0.35)]">Get started free <ArrowRight className="h-4 w-4" /></Link>
              <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-zinc-300"><Play className="h-4 w-4" />Watch 2-minute demo</button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-sm text-zinc-500">
              {['No credit card required', '5-minute setup', 'SOC 2 Type II certified', 'Free up to $10k/month spend'].map((item) => (
                <p key={item} className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#00e5a0]" />{item}</p>
              ))}
            </div>

            <div className="mx-auto mt-16 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#111113] shadow-[0_40px_120px_rgba(0,0,0,0.6)] animate-fade-in-up-delay-2">
              <div className="flex items-center gap-3 border-b border-white/10 bg-[#18181b] px-5 py-3">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-green-400" /></div>
                <div className="mx-auto w-full max-w-xs rounded bg-[#09090b] px-3 py-1.5 text-left font-mono text-sm text-zinc-500">app.costlytic.io/dashboard</div>
              </div>
              <div className="space-y-4 p-4 md:p-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['This Month', '$4,281', 'Up 18.4% vs last month', 'text-[#ff6b35]'],
                    ['Total Tokens', '84.2M', 'Down 3.1% efficiency gain', 'text-[#00e5a0]'],
                    ['Active Models', '7', 'Across 3 providers', 'text-zinc-100'],
                    ['Budget Used', '71%', '$1,219 remaining', 'text-[#ff6b35]'],
                  ].map(([label, value, sub, accent]) => (
                    <article key={label} className="rounded-xl border border-white/10 bg-[#18181b] p-4 card-saasy">
                      <p className="font-mono text-sm uppercase tracking-normal text-zinc-500">{label}</p>
                      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
                      <p className="mt-1 font-mono text-sm text-zinc-500">{sub}</p>
                    </article>
                  ))}
                </div>
                <article className="rounded-xl border border-white/10 bg-[#18181b] p-4 card-saasy">
                  <h3 className="mb-4 text-sm font-semibold">Daily spend (last 30 days)</h3>
                  <div className="flex h-24 items-end gap-1 overflow-hidden">
                    {barGroups.map((group, i) => (
                      <div key={i} className="flex h-full flex-1 items-end gap-[2px]">
                        {group.map((bar, j) => (
                          <div key={j} className="h-4 flex-1 rounded-t-sm" style={{ height: `${bar.height}%`, backgroundColor: bar.color, opacity: bar.highlight ? 1 : 0.7 }} />
                        ))}
                      </div>
                    ))}
                  </div>
                </article>
                <div className="grid gap-3 lg:grid-cols-2">
                  <article className="rounded-xl border border-white/10 bg-[#18181b] p-4 card-saasy">
                    <h3 className="mb-3 text-sm font-semibold">Top models by cost</h3>
                    {[
                      ['gpt-4o', '$2,104', '82%', '#00e5a0'],
                      ['claude-3.5-sonnet', '$1,184', '55%', '#818cf8'],
                      ['gemini-1.5-pro', '$648', '32%', '#f59e0b'],
                      ['gpt-4-turbo', '$345', '16%', '#fb7185'],
                    ].map(([name, value, width, color]) => (
                      <div key={name} className="mb-2 flex items-center gap-3 rounded-lg border border-white/10 bg-[#09090b] px-3 py-2">
                        <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="flex-1 font-mono text-sm text-zinc-300">{name}</span>
                        <span className="h-1 w-14 overflow-hidden rounded bg-white/10"><span className="block h-full rounded" style={{ width, backgroundColor: color }} /></span>
                        <span className="font-mono text-sm text-zinc-100">{value}</span>
                      </div>
                    ))}
                  </article>
                  <article className="rounded-xl border border-white/10 bg-[#18181b] p-4 card-saasy">
                    <h3 className="mb-3 text-sm font-semibold">Budget alerts</h3>
                    {[
                      ['OpenAI budget 71% consumed - 9 days remaining in billing cycle', true],
                      ['Anthropic spend on track - $0.42/day average vs $0.50 budget', false],
                      ['gpt-4o token usage +34% week over week - review prompt cache', true],
                    ].map(([text, warn]) => (
                      <div key={text} className={`mb-2 rounded-lg border px-3 py-2 text-sm ${warn ? 'border-[#ff6b35]/35 bg-[#ff6b35]/10 text-[#ff6b35]' : 'border-[#00e5a0]/35 bg-[#00e5a0]/10 text-[#00e5a0]'}`}>{text}</div>
                    ))}
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-y border-[#00e5a0]/25 bg-[#00e5a0]/10 py-3">
          <div className="flex w-max animate-ticker">
            {[...tickers, ...tickers].map((item, i) => <span key={`${item}-${i}`} className="inline-flex items-center gap-3 px-12 font-mono text-sm uppercase tracking-normal text-[#00e5a0]"><span className="text-[#00e5a0]/40">+</span>{item}</span>)}
          </div>
        </div>

        <section className="border-b border-white/10 px-4 py-12 text-center sm:px-6 lg:px-8"><p className="font-mono text-sm uppercase tracking-normal text-zinc-500">Trusted by engineering teams at</p><div className="mx-auto mt-7 flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4">{['ACME CORP', 'HORIZON AI', 'LOOP LABS', 'STACKWORKS', 'NOVA TECH', 'CIPHER IO'].map((logo) => <span key={logo} className="font-mono text-sm tracking-normal text-zinc-500">{logo}</span>)}</div></section>
        <section className="border-b border-white/10 bg-[#111113] px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-6xl gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">{[['$12M+', 'AI spend tracked monthly', true], ['2,400+', 'Teams onboarded'], ['40+', 'AI models supported', true], ['31%', 'Average cost reduction']].map(([value, label, accent]) => <div key={label}><p className={`text-4xl font-extrabold tracking-normal ${accent ? 'text-[#00e5a0]' : 'text-zinc-100'}`}>{value}</p><p className="mt-2 font-mono text-sm uppercase tracking-normal text-zinc-500">{label}</p></div>)}</div></section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 animate-fade-in-up">
          <p className="font-mono text-sm uppercase tracking-normal text-[#00e5a0]">Platform Features</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-snug tracking-normal sm:text-5xl">Everything you need to <span className="text-[#00e5a0] font-semibold">control</span> AI costs</h2>
          <p className="mt-4 max-w-2xl text-zinc-400">From raw token usage to team chargebacks, Costlytic gives you the intelligence layer missing from provider dashboards.</p>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {[
              ['RT', 'Real-time cost monitoring', 'Sub-second spend visibility across every provider with per-request granularity.'],
              ['BA', 'Smart budget alerts', 'Flexible thresholds by team, project, or model.'],
              ['TA', 'Token analytics and trends', 'Input vs output patterns, cache efficiency, and trajectory insights.'],
              ['CA', 'Cost attribution', 'Tag requests by feature, customer, and team for chargebacks.'],
              ['UP', 'Unified provider view', 'OpenAI, Anthropic, Gemini, Bedrock, Mistral, and Cohere in one timeline.'],
              ['OA', 'Optimization advisor', 'Recommendations to lower spend without quality loss.'],
            ].map(([icon, title, desc]) => (
              <article key={title} className="bg-[#111113] p-8 transition hover:bg-[#18181b] card-saasy">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#00e5a0]/40 bg-[#00e5a0]/10 font-mono text-sm font-bold text-[#00e5a0]">{icon}</span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#111113]"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_460px] lg:items-start lg:px-8"><div><p className="font-mono text-sm uppercase tracking-normal text-[#00e5a0]">How It Works</p><h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-snug tracking-normal sm:text-5xl">Up and running in <span className="text-[#00e5a0] font-semibold">5 minutes</span></h2><p className="mt-4 max-w-xl text-zinc-400">No infrastructure changes required. One API key unlocks complete cost intelligence.</p><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{steps.map((step, i) => <button key={step.title} type="button" onMouseEnter={() => setActiveStep(i)} onFocus={() => setActiveStep(i)} onClick={() => setActiveStep(i)} className={`w-full py-6 text-left ${activeStep === i ? 'text-zinc-100' : 'text-zinc-400'}`}><p className={`font-mono text-sm uppercase tracking-normal ${activeStep === i ? 'text-[#00e5a0]' : 'text-zinc-500'}`}>{String(i + 1).padStart(2, '0')}</p><h3 className={`mt-2 text-lg font-bold ${activeStep === i ? 'text-[#00e5a0]' : 'text-zinc-100'}`}>{step.title}</h3><p className="mt-1 text-sm leading-7">{step.desc}</p></button>)}</div></div><div className="top-24 rounded-2xl border border-white/10 bg-[#09090b] p-6 lg:sticky"><p className="font-mono text-sm uppercase tracking-normal text-zinc-500">Step preview</p><p className="mt-3 text-sm text-zinc-300">{steps[activeStep].title}</p><div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-4"><pre className="space-y-2 whitespace-pre-wrap font-mono text-sm leading-6 text-zinc-300">{steps[activeStep].code.map((line) => <div key={line}>{line}</div>)}</pre></div><div className="mt-4 space-y-2 rounded-xl border border-[#00e5a0]/30 bg-[#00e5a0]/10 p-4">{steps[activeStep].status.map((item) => <p key={item} className="text-sm text-[#00e5a0]">{item}</p>)}</div></div></div></section>

        <section id="integrations" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 animate-fade-in-up"><p className="font-mono text-sm uppercase tracking-normal text-[#00e5a0]">Integrations</p><h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-snug tracking-normal sm:text-5xl">Works with every AI <span className="text-[#00e5a0] font-semibold">provider</span></h2><p className="mt-4 max-w-2xl text-zinc-400">Connect your current stack in minutes. New integrations ship continuously.</p><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['OpenAI', 'GPT-4o, o1, DALL-E', 'bg-emerald-500'], ['Anthropic', 'Claude 3.5, Claude 3', 'bg-violet-400'], ['Google Gemini', 'Gemini Pro and Flash', 'bg-blue-500'], ['AWS Bedrock', 'All Bedrock models', 'bg-amber-500'], ['Mistral AI', 'Mixtral and Mistral-7B', 'bg-zinc-400'], ['Cohere', 'Command R and Embed', 'bg-rose-500'], ['Slack Alerts', 'Budget and anomaly alerts', 'bg-cyan-400'], ['Datadog', 'Export metrics and dashboards', 'bg-indigo-400']].map(([name, desc, color]) => <article key={name} className="rounded-xl border border-white/10 bg-[#111113] p-5 text-center card-saasy"><span className={`mx-auto inline-block h-10 w-10 rounded-lg ${color}`} /><p className="mt-3 text-sm font-semibold">{name}</p><p className="mt-1 font-mono text-sm uppercase tracking-normal text-zinc-500">{desc}</p></article>)}</div></section>

        <section id="pricing" className="border-y border-white/10 bg-[#111113] px-4 py-20 sm:px-6 lg:px-8 animate-fade-in-up"><div className="mx-auto max-w-7xl"><p className="text-center font-mono text-sm uppercase tracking-normal text-[#00e5a0]">Pricing</p><h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl font-extrabold leading-snug tracking-normal sm:text-5xl">Simple pricing, <span className="text-[#00e5a0] font-semibold">serious savings</span></h2><p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">Start free, then move to Growth when you want stronger savings control.</p><div className="mt-12 grid gap-5 lg:grid-cols-4">{[['Free', '0', 'Limited tracking with 1 API key and basic insights.', false], ['Starter', '29', 'Full tracking, basic alerts, and provider cost breakdown.', false], ['Growth', '79', 'Shadow detection, anomaly alerts, and optimization suggestions.', true], ['Pro', '149', 'Team features, advanced analytics, and priority support.', false]].map(([tier, price, note, featured]) => <article key={tier} className={`relative rounded-2xl border p-7 card-saasy ${featured ? 'border-[#00e5a0] bg-[#00e5a0]/5' : 'border-white/10 bg-[#09090b]'}`}>{featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00e5a0] px-4 py-1 font-mono text-sm font-bold uppercase tracking-normal text-black animate-float">Most popular</span>}<p className="font-mono text-sm uppercase tracking-normal text-zinc-500">{tier}</p><p className="mt-3 text-5xl font-extrabold tracking-normal"><span className="text-2xl text-zinc-400">$</span>{price}<span className="ml-1 font-mono text-sm uppercase tracking-normal text-zinc-500">/month</span></p><p className="mt-4 text-sm leading-7 text-zinc-400">{note}</p><Link to="/signup" className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${featured ? 'bg-[#00e5a0] text-black' : 'border border-white/20 text-zinc-200'}`}>{featured ? 'Choose Growth' : tier === 'Pro' ? 'Choose Pro' : tier === 'Starter' ? 'Choose Starter' : 'Get started free'}</Link><div className="mt-6 space-y-2">{['Usage tracking', 'Cost visibility', 'Budget awareness', 'Optimization support'].map((line) => <p key={line} className="flex items-center gap-2 text-sm text-zinc-300"><Check className="h-4 w-4 text-[#00e5a0]" />{line}</p>)}</div></article>)}</div></div></section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 animate-fade-in-up"><p className="font-mono text-sm uppercase tracking-normal text-[#00e5a0]">Customer stories</p><h2 className="mt-4 text-4xl font-extrabold leading-snug tracking-normal sm:text-5xl">Loved by <span className="text-[#00e5a0] font-semibold">engineering teams</span></h2><div className="mt-12 grid gap-5 lg:grid-cols-3">{[['We had no idea our chatbot was burning $3,400 each month on GPT-4. Costlytic surfaced that in the first day.', 'Amir Hassan', 'Staff Engineer - LoopLabs', 'AH'], ['Finance kept asking how much our AI features cost. Before this, we could not answer accurately. Now we can.', 'Sarah Oduya', 'VP Engineering - Stackworks', 'SO'], ['An 80% budget alert saved us from a $12k overage. The team fixed it in 20 minutes after the Slack ping.', 'Tom Reyes', 'CTO - Cipher.io', 'TR']].map(([quote, name, role, initials]) => <article key={name} className="rounded-2xl border border-white/10 bg-[#111113] p-6"><p className="font-mono text-sm uppercase tracking-normal text-amber-300">*****</p><p className="mt-4 text-sm leading-7 text-zinc-300">{quote}</p><div className="mt-5 flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#18181b] text-sm font-semibold">{initials}</span><div><p className="text-sm font-semibold">{name}</p><p className="font-mono text-sm uppercase tracking-normal text-zinc-500">{role}</p></div></div></article>)}</div></section>

        <section className="relative overflow-hidden border-y border-white/10 px-4 py-24 text-center sm:px-6 lg:px-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.14),transparent_70%)]" /><div className="relative mx-auto max-w-4xl"><h2 className="text-4xl font-extrabold leading-tight tracking-normal sm:text-5xl">Your AI bill is a<br /><span className="text-[#00e5a0] font-semibold">solvable problem.</span></h2><p className="mx-auto mt-5 max-w-xl text-zinc-400">Join 2,400+ teams who replaced spreadsheet guesswork with real-time cost intelligence.</p><div className="mt-9 flex flex-wrap items-center justify-center gap-4"><Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#00e5a0] px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_24px_rgba(0,229,160,0.3)]">Start for free <ArrowRight className="h-4 w-4" /></Link><button type="button" className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-zinc-300">Schedule a demo</button></div><p className="mt-5 font-mono text-sm uppercase tracking-normal text-zinc-500">Free tier forever - setup in 5 minutes - cancel anytime</p></div></section>

        <footer id="docs" className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8"><div><a href="/" className="inline-flex items-center gap-2"><span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#00e5a0] text-black"><Sparkles className="h-3.5 w-3.5" /></span><span className="text-base font-bold">Costlytic</span></a><p className="mt-3 max-w-xs text-sm leading-7 text-zinc-500">AI spend intelligence for engineering teams building products with confidence.</p></div>{[['Product', ['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap']], ['Developers', ['Documentation', 'API Reference', 'SDKs', 'Status']], ['Company', ['About', 'Blog', 'Careers', 'Security', 'Privacy']]].map(([title, links]) => <div key={title}><p className="font-mono text-sm uppercase tracking-normal text-zinc-500">{title}</p><div className="mt-4 space-y-2">{links.map((link) => <a key={link} href="/" className="block text-sm text-zinc-400">{link}</a>)}</div></div>)}</footer>
        <div className="border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 font-mono text-sm uppercase tracking-normal text-zinc-500"><p>Copyright 2026 Costlytic, Inc. All rights reserved.</p><p>SOC 2 Type II - GDPR compliant - 99.9% uptime SLA</p></div></div>
      </main>
    </div>
  );
}







