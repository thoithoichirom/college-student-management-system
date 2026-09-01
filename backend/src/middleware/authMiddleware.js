import { verifyToken } from "../utils/auth.js";
import { httpError } from "../utils/httpError.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(httpError(401, "Authentication token required"));
  }

  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch (error) {
    next(httpError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(httpError(403, "You do not have permission for this action"));
    }

    next();
  };
}
