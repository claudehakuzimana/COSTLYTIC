// Number utilities
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

export const roundToDecimals = (num, decimals = 2) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return roundToDecimals((value / total) * 100);
};

export const calculateChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return roundToDecimals(((current - previous) / previous) * 100);
};

export const clamp = (num, min, max) => {
  return Math.max(min, Math.min(max, num));
};

export default {
  formatCurrency,
  roundToDecimals,
  calculatePercentage,
  calculateChange,
  clamp
};
