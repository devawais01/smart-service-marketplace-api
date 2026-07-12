const errorHandler = (err, req, res, next) => {
  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({
      success: false,
      error: `${field} already exists.`
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: messages.join(" ")
    });
  }

  // Invalid ObjectId cast
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format."
    });
  }

  // Invalid JSON body
  if (err.type === "entity.parse.failed" || (err instanceof SyntaxError && err.status === 400)) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON in request body."
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token."
    });
  }

  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error"
  });
};

module.exports = errorHandler;
