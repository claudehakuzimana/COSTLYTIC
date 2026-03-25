import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

function getEncryptionKey() {
  const base = process.env.INTEGRATION_ENCRYPTION_KEY || process.env.JWT_SECRET || 'local-dev-secret';
  return crypto.createHash('sha256').update(base).digest();
}

export function encryptSecret(plainText) {
  if (!plainText || typeof plainText !== 'string') return null;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
}

export function decryptSecret(payload) {
  if (!payload || typeof payload !== 'string') return null;

  const parts = payload.split('.');
  if (parts.length !== 3) return null;

  try {
    const iv = Buffer.from(parts[0], 'base64');
    const tag = Buffer.from(parts[1], 'base64');
    const encrypted = Buffer.from(parts[2], 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (_) {
    return null;
  }
}

export function maskSecret(secret) {
  if (!secret || typeof secret !== 'string') return '***';
  if (secret.length <= 8) return `${secret.slice(0, 2)}***${secret.slice(-2)}`;
  return `${secret.slice(0, 4)}***${secret.slice(-4)}`;
}
