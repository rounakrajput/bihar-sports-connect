import jwt from 'jsonwebtoken';

// Usage: requireAuth()                -> any signed-in user
//        requireAuth('admin')         -> admin only
// Access is always checked here on the server, not just by hiding buttons.
export function requireAuth(...roles) {
  return (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Please sign in.' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(payload.role)) {
        return res.status(403).json({ error: 'You do not have access to this page.' });
      }
      req.user = payload;
      next();
    } catch {
      res.clearCookie('token');
      res.status(401).json({ error: 'Your session has expired. Sign in again.' });
    }
  };
}
