const REQUEST_TYPES = ['api_code', 'backend_architecture', 'database_schema'];
const LANGUAGES = ['nodejs', 'python'];
const DATABASES = ['postgres', 'mysql'];

function buildApiCode(language = 'nodejs') {
  if (language === 'python') {
    return `# FastAPI usage ingestion example
from fastapi import FastAPI, Request
import httpx
import os
from datetime import datetime, timezone

app = FastAPI()
COSTPILOT_INGEST_URL = "https://your-domain.com/api/usage/ingest"
COSTPILOT_API_KEY = os.getenv("COSTPILOT_API_KEY")

@app.post("/assistants/reply")
async def assistants_reply(request: Request):
    payload = await request.json()
    team = request.headers.get("x-costlytic-team", "platform")
    feature = request.headers.get("x-costlytic-feature", "chat-assistant")

    # ... run your model call here ...
    model_response = {"text": "ok", "input_tokens": 420, "output_tokens": 180}

    usage_event = {
        "provider": "openai",
        "model": "gpt-4o-mini",
        "tokens_input": model_response["input_tokens"],
        "tokens_output": model_response["output_tokens"],
        "team": team,
        "application": feature,
        "agent": "support-bot",
        "request_id": payload.get("request_id", f"req_{int(datetime.now().timestamp())}"),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    async with httpx.AsyncClient(timeout=5) as client:
        await client.post(
            COSTPILOT_INGEST_URL,
            json=usage_event,
            headers={"X-API-Key": COSTPILOT_API_KEY}
        )

    return {"reply": model_response["text"]}`;
  }

  return `// Express usage ingestion example
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const COSTPILOT_INGEST_URL = 'https://your-domain.com/api/usage/ingest';
const COSTPILOT_API_KEY = process.env.COSTPILOT_API_KEY;

app.post('/assistants/reply', async (req, res) => {
  const team = req.headers['x-costlytic-team'] || 'platform';
  const feature = req.headers['x-costlytic-feature'] || 'chat-assistant';

  // ... run your model call here ...
  const modelResponse = { text: 'ok', inputTokens: 420, outputTokens: 180 };

  const usageEvent = {
    provider: 'openai',
    model: 'gpt-4o-mini',
    tokens_input: modelResponse.inputTokens,
    tokens_output: modelResponse.outputTokens,
    team,
    application: feature,
    agent: 'support-bot',
    request_id: req.body.request_id || \`req_\${Date.now()}\`,
    timestamp: new Date().toISOString()
  };

  await fetch(COSTPILOT_INGEST_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': COSTPILOT_API_KEY
    },
    body: JSON.stringify(usageEvent)
  });

  res.json({ reply: modelResponse.text });
});`;
}

function buildArchitecture() {
  return `# AI Cost Tracking Backend Architecture

1. Ingestion Layer
- Endpoint: POST /api/usage/ingest
- Auth: API key or bearer token
- Validates provider, model, tokens, team, application, request_id, timestamp

2. Storage Layer
- usage_events: raw request-level spend records
- provider_integrations: encrypted provider credentials + health status
- budgets + alerts: guardrails by org/team/project

3. Analytics Layer
- Daily spend rollups by provider, team, application, endpoint
- Anomaly detection jobs (hourly): spend spikes, unknown keys, unusual source IP
- Optimization jobs (daily): model-switch recommendations + projected savings

4. Alerting Layer
- Triggers at 50%, 80%, 100% budget utilization
- Channels: Slack, email, webhook
- Includes direct remediation hints (switch model, cap endpoint, revoke key)

5. API Surface
- GET /api/analytics/dashboard
- GET /api/analytics/spend-by-provider
- GET /api/analytics/cost-by-team
- GET /api/analytics/token-trends
- POST /api/integrations/:provider/test

6. Security + Compliance
- Encrypt provider secrets at rest
- Never store prompts or response content
- Store usage metadata only (tokens, model, cost, attribution tags)`;
}

function buildDatabaseSchema(database = 'postgres') {
  const jsonType = database === 'mysql' ? 'JSON' : 'JSONB';
  const timestampType = database === 'mysql' ? 'TIMESTAMP' : 'TIMESTAMPTZ';
  const serialType = database === 'mysql' ? 'BIGINT AUTO_INCREMENT' : 'BIGSERIAL';
  const primaryKey = database === 'mysql' ? 'BIGINT PRIMARY KEY AUTO_INCREMENT' : 'BIGSERIAL PRIMARY KEY';

  return `-- ${database.toUpperCase()} schema for AI cost tracking

CREATE TABLE organizations (
  id ${primaryKey},
  name VARCHAR(120) NOT NULL,
  plan VARCHAR(30) NOT NULL DEFAULT 'free',
  created_at ${timestampType} NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE api_keys (
  id ${primaryKey},
  organization_id BIGINT NOT NULL,
  key_hash VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  scopes ${jsonType} NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at ${timestampType} NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE provider_integrations (
  id ${primaryKey},
  organization_id BIGINT NOT NULL,
  provider VARCHAR(40) NOT NULL,
  encrypted_secret TEXT NOT NULL,
  secret_preview VARCHAR(32),
  connected BOOLEAN NOT NULL DEFAULT TRUE,
  last_test_status VARCHAR(20) NOT NULL DEFAULT 'never',
  last_test_error TEXT,
  updated_at ${timestampType} NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usage_events (
  id ${serialType} PRIMARY KEY,
  organization_id BIGINT NOT NULL,
  provider VARCHAR(40) NOT NULL,
  model VARCHAR(80) NOT NULL,
  team VARCHAR(80) NOT NULL,
  application VARCHAR(120) NOT NULL,
  agent VARCHAR(120),
  request_id VARCHAR(120) NOT NULL,
  endpoint VARCHAR(160),
  tokens_input BIGINT NOT NULL,
  tokens_output BIGINT NOT NULL,
  total_cost_usd NUMERIC(12, 6) NOT NULL,
  metadata ${jsonType},
  created_at ${timestampType} NOT NULL
);

CREATE TABLE budgets (
  id ${primaryKey},
  organization_id BIGINT NOT NULL,
  scope_type VARCHAR(30) NOT NULL, -- org, team, project
  scope_ref VARCHAR(120) NOT NULL,
  monthly_limit_usd NUMERIC(12, 2) NOT NULL,
  alert_thresholds ${jsonType} NOT NULL, -- [50,80,100]
  created_at ${timestampType} NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE anomalies (
  id ${primaryKey},
  organization_id BIGINT NOT NULL,
  anomaly_type VARCHAR(40) NOT NULL, -- cost_spike, unknown_key, rogue_service
  severity VARCHAR(20) NOT NULL, -- low, medium, high
  summary TEXT NOT NULL,
  details ${jsonType},
  detected_at ${timestampType} NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usage_org_time ON usage_events (organization_id, created_at);
CREATE INDEX idx_usage_org_team ON usage_events (organization_id, team);
CREATE INDEX idx_usage_org_app ON usage_events (organization_id, application);
CREATE UNIQUE INDEX idx_integrations_org_provider ON provider_integrations (organization_id, provider);`;
}

export function generateImplementationKit({
  requestType = 'api_code',
  language = 'nodejs',
  database = 'postgres'
} = {}) {
  if (!REQUEST_TYPES.includes(requestType)) {
    return { error: 'Invalid requestType' };
  }

  if (!LANGUAGES.includes(language)) {
    return { error: 'Invalid language' };
  }

  if (!DATABASES.includes(database)) {
    return { error: 'Invalid database' };
  }

  if (requestType === 'api_code') {
    return {
      requestType,
      title: language === 'python' ? 'Python API implementation' : 'Node.js API implementation',
      summary: 'Ready-to-run ingestion wiring for team/feature attribution and spend tracking.',
      output: buildApiCode(language)
    };
  }

  if (requestType === 'backend_architecture') {
    return {
      requestType,
      title: 'Backend architecture blueprint',
      summary: 'A production-oriented architecture for ingestion, analytics, anomaly detection, and alerts.',
      output: buildArchitecture()
    };
  }

  return {
    requestType,
    title: `${database.toUpperCase()} database schema`,
    summary: 'Schema covering organizations, API keys, integrations, usage events, budgets, and anomalies.',
    output: buildDatabaseSchema(database)
  };
}
