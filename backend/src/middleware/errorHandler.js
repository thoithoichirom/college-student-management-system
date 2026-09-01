export function notFound(req, res, next) {
  next(Object.assign(new Error(`Route not found: ${req.method} ${req.originalUrl}`), { status: 404 }));
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = status === 500 ? "Something went wrong" : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({
    message
  });
}
