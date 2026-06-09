// middleware/errorHandler.js
// Global error handling middleware for Express

/**
 * Global Error Handler
 * Catches all errors thrown or passed via next(error)
 * Returns consistent JSON error responses
 * Must be registered LAST in Express middleware chain
 */
const errorHandler = (err, req, res, next) => {
  // Log error details in development
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err.stack);
  } else {
    console.error("❌ Error:", err.message);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = `Resource not found with id: ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * Not Found Handler
 * Catches requests to undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
