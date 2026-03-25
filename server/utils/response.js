// Request/Response utilities
export const formatResponse = (success, data, message = '') => {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  };
};

export const formatError = (error, statusCode = 500) => {
  return {
    success: false,
    error: error.message || 'Internal Server Error',
    statusCode,
    timestamp: new Date().toISOString()
  };
};

export const paginate = (items, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: items.length,
      pages: Math.ceil(items.length / limit)
    }
  };
};

export default {
  formatResponse,
  formatError,
  paginate
};
