import { validationResult } from 'express-validator';
import { APIKey } from '../models/APIKey.js';
import { generateApiKey, getKeyPrefix, hashApiKey } from '../utils/apiKeys.js';

export const listApiKeys = async (req, res) => {
  try {
    const keys = await APIKey.find({ organizationId: req.user.organizationId })
      .sort({ createdAt: -1 })
      .select('_id name keyPrefix scopes lastUsedAt revokedAt createdAt');

    res.json({ keys });
  } catch (error) {
    console.error('List API keys error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createApiKey = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, scopes = ['usage:write'] } = req.body;
    const customApiKey = typeof req.body.apiKey === 'string' ? req.body.apiKey.trim() : '';
    const apiKey = customApiKey || generateApiKey();
    const keyHash = hashApiKey(apiKey);

    const existing = await APIKey.findOne({
      organizationId: req.user.organizationId,
      keyHash,
      revokedAt: { $exists: false }
    });

    if (existing) {
      return res.status(409).json({ error: 'API key already exists' });
    }

    const record = new APIKey({
      organizationId: req.user.organizationId,
      name,
      keyPrefix: getKeyPrefix(apiKey),
      keyHash,
      scopes,
      createdBy: req.user.userId
    });

    await record.save();

    // Return secret ONCE
    res.status(201).json({
      message: 'API key created',
      apiKey,
      key: {
        id: record._id,
        name: record.name,
        keyPrefix: record.keyPrefix,
        scopes: record.scopes,
        createdAt: record.createdAt
      }
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const key = await APIKey.findOne({ _id: id, organizationId: req.user.organizationId });

    if (!key) {
      return res.status(404).json({ error: 'API key not found' });
    }

    if (key.revokedAt) {
      return res.json({ message: 'API key already revoked' });
    }

    key.revokedAt = new Date();
    await key.save();

    res.json({ message: 'API key revoked' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
