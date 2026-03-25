import crypto from 'crypto';

export function generateApiKey() {
  // prefix makes it easy to identify in logs without leaking full secret
  const prefix = 'aci_';
  const secret = crypto.randomBytes(24).toString('hex');
  return `${prefix}${secret}`;
}

export function getKeyPrefix(apiKey) {
  if (!apiKey) return '';
  return apiKey.slice(0, 8);
}

export function hashApiKey(apiKey) {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}
