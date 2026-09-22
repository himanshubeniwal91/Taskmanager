// backend/middleware/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Default error values
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorMiddleware;