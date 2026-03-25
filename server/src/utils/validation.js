export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validateMongoId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateNumberRange = (value, min, max) => {
  return typeof value === 'number' && value >= min && value <= max;
};

export const validateDateRange = (startDate, endDate) => {
  return new Date(startDate) < new Date(endDate);
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};
