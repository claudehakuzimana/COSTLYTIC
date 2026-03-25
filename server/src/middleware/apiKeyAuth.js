import { APIKey } from '../models/APIKey.js';
import { hashApiKey } from '../utils/apiKeys.js';

function extractApiKey(req) {
  const headerKey = req.headers['x-api-key'];
  if (typeof headerKey === 'string' && headerKey.trim()) return headerKey.trim();

  const authHeader = req.headers.authorization;
  // allow: Authorization: ApiKey <key>
  if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('apikey ')) {
    return authHeader.substring(6).trim();
  }

  return null;
}

export const authenticateApiKey = (requiredScopes = ['usage:write']) => {
  return async (req, res, next) => {
    try {
      const apiKey = extractApiKey(req);
      if (!apiKey) {
        return res.status(401).json({ error: 'API key required' });
      }

      const keyHash = hashApiKey(apiKey);
      const record = await APIKey.findOne({ keyHash, revokedAt: { $exists: false } });

      if (!record) {
        return res.status(401).json({ error: 'Invalid API key' });
      }

      if (Array.isArray(record.scopes) && requiredScopes.length > 0) {
        const hasAll = requiredScopes.every((s) => record.scopes.includes(s));
        if (!hasAll) {
          return res.status(403).json({ error: 'API key missing required scope' });
        }
      }

      record.lastUsedAt = new Date();
      await record.save().catch(() => {});

      // Mirror JWT shape used elsewhere
      req.user = {
        userId: record.createdBy,
        organizationId: record.organizationId,
        role: 'engineer'
      };

      req.apiKey = {
        id: record._id,
        name: record.name,
        keyPrefix: record.keyPrefix,
        scopes: record.scopes
      };

      next();
    } catch (error) {
      console.error('API key auth error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};
