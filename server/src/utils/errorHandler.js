export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
  }

  if (err.name === 'CastError') {
    err.statusCode = 400;
    err.message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    err.message = `${field} already exists`;
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
