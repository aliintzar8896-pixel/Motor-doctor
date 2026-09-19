import db from '../config/db.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Guest or unauthenticated
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  // Simple token matching or decode
  const user = db.users.find(u => u.id === token || token === 'guest-token') || db.users[0];
  req.user = user;
  next();
};

export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required to access this resource',
    });
  }
  next();
};

export default authMiddleware;
