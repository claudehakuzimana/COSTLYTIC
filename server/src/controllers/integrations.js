import { validationResult } from 'express-validator';
import { Integration } from '../models/Integration.js';
import { decryptSecret, encryptSecret, maskSecret } from '../utils/secrets.js';

const PROVIDER_CATALOG = [
  { id: 'openai', name: 'OpenAI', category: 'ai' },
  { id: 'anthropic', name: 'Anthropic', category: 'ai' },
  { id: 'google', name: 'Google Gemini', category: 'ai' },
  { id: 'aws_bedrock', name: 'AWS Bedrock', category: 'ai' },
  { id: 'mistral', name: 'Mistral AI', category: 'ai' },
  { id: 'cohere', name: 'Cohere', category: 'ai' },
  { id: 'slack', name: 'Slack Alerts', category: 'alerts' },
  { id: 'datadog', name: 'Datadog', category: 'observability' }
];

function providerExists(provider) {
  return PROVIDER_CATALOG.some((p) => p.id === provider);
}

function getProviderMeta(provider) {
  return PROVIDER_CATALOG.find((p) => p.id === provider);
}

function validateSecretFormat(provider, secret) {
  const normalized = String(secret || '').trim();
  if (!normalized) {
    return { success: false, message: 'Missing secret' };
  }

  switch (provider) {
    case 'openai':
      return /^sk-/.test(normalized)
        ? { success: true, message: 'OpenAI key format looks valid' }
        : { success: false, message: 'OpenAI keys usually start with sk-' };
    case 'anthropic':
      return /^sk-/.test(normalized)
        ? { success: true, message: 'Anthropic key format looks valid' }
        : { success: false, message: 'Anthropic keys usually start with sk-' };
    case 'google':
      return normalized.length >= 20
        ? { success: true, message: 'Google key format looks valid' }
        : { success: false, message: 'Google API key seems too short' };
    case 'aws_bedrock':
      return /^(AKIA|ASIA)/.test(normalized)
        ? { success: true, message: 'AWS access key format looks valid' }
        : { success: false, message: 'AWS access keys usually start with AKIA/ASIA' };
    case 'mistral':
    case 'cohere':
      return normalized.length >= 20
        ? { success: true, message: `${provider} key format looks valid` }
        : { success: false, message: `${provider} key seems too short` };
    case 'slack':
      return /^https:\/\/hooks\.slack\.com\//.test(normalized)
        ? { success: true, message: 'Slack webhook format looks valid' }
        : { success: false, message: 'Slack integration expects a webhook URL' };
    case 'datadog':
      return normalized.length >= 20
        ? { success: true, message: 'Datadog key format looks valid' }
        : { success: false, message: 'Datadog API key seems too short' };
    default:
      return { success: false, message: 'Unsupported provider' };
  }
}

function toDTO(record) {
  return {
    id: record._id,
    provider: record.provider,
    category: record.category,
    connected: record.connected,
    secretPreview: record.secretPreview,
    lastTestStatus: record.lastTestStatus,
    lastTestError: record.lastTestError || null,
    lastTestedAt: record.lastTestedAt || null,
    connectedAt: record.connectedAt
  };
}

export const listIntegrations = async (req, res) => {
  try {
    const records = await Integration.find({ organizationId: req.user.organizationId }).sort({ provider: 1 });
    const byProvider = new Map(records.map((record) => [record.provider, record]));

    const integrations = PROVIDER_CATALOG.map((provider) => {
      const record = byProvider.get(provider.id);
      if (!record) {
        return {
          provider: provider.id,
          category: provider.category,
          connected: false,
          secretPreview: null,
          lastTestStatus: 'never',
          lastTestError: null,
          lastTestedAt: null,
          connectedAt: null
        };
      }
      return toDTO(record);
    });

    res.json({ integrations });
  } catch (error) {
    console.error('List integrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const connectIntegration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { provider } = req.params;
    if (!providerExists(provider)) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    const { secret, metadata = {} } = req.body;
    const trimmedSecret = String(secret || '').trim();
    if (!trimmedSecret) {
      return res.status(400).json({ error: 'Secret is required' });
    }

    const providerMeta = getProviderMeta(provider);
    const encrypted = encryptSecret(trimmedSecret);
    const preview = maskSecret(trimmedSecret);
    const formatCheck = validateSecretFormat(provider, trimmedSecret);

    const record = await Integration.findOneAndUpdate(
      { organizationId: req.user.organizationId, provider },
      {
        organizationId: req.user.organizationId,
        provider,
        category: providerMeta.category,
        connected: true,
        secretEncrypted: encrypted,
        secretPreview: preview,
        metadata,
        updatedBy: req.user.userId,
        connectedAt: new Date(),
        lastTestStatus: formatCheck.success ? 'success' : 'failed',
        lastTestError: formatCheck.success ? null : formatCheck.message,
        lastTestedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: `${providerMeta.name} connected`,
      integration: toDTO(record),
      test: formatCheck
    });
  } catch (error) {
    console.error('Connect integration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const testIntegration = async (req, res) => {
  try {
    const { provider } = req.params;
    if (!providerExists(provider)) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    const record = await Integration.findOne({ organizationId: req.user.organizationId, provider });
    if (!record) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const secret = decryptSecret(record.secretEncrypted);
    if (!secret) {
      record.lastTestStatus = 'failed';
      record.lastTestError = 'Unable to decrypt stored secret';
      record.lastTestedAt = new Date();
      await record.save();
      return res.status(500).json({ error: 'Failed to read integration secret' });
    }

    const result = validateSecretFormat(provider, secret);
    record.lastTestStatus = result.success ? 'success' : 'failed';
    record.lastTestError = result.success ? null : result.message;
    record.lastTestedAt = new Date();
    await record.save();

    res.json({
      message: result.success ? 'Integration test passed' : 'Integration test failed',
      test: result,
      integration: toDTO(record)
    });
  } catch (error) {
    console.error('Test integration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const disconnectIntegration = async (req, res) => {
  try {
    const { provider } = req.params;
    if (!providerExists(provider)) {
      return res.status(400).json({ error: 'Unsupported provider' });
    }

    const deleted = await Integration.findOneAndDelete({
      organizationId: req.user.organizationId,
      provider
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    res.json({ message: `${provider} disconnected` });
  } catch (error) {
    console.error('Disconnect integration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
