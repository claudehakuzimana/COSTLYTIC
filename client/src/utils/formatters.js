export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const truncateString = (str, maxLength = 50) => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const getInitials = (fullName) => {
  return fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase();
};
