// String utilities
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[-]+/g, '-');
};

export const generateRandomString = (length = 16) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const maskEmail = (email) => {
  const [name, domain] = email.split('@');
  const maskedName = name.substring(0, 2) + '*'.repeat(name.length - 2);
  return `${maskedName}@${domain}`;
};

export const truncate = (str, length = 50) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

export default {
  generateSlug,
  generateRandomString,
  maskEmail,
  truncate
};
