export function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: { message: err.message || "Internal server error" },
  });
}
