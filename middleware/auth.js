const User = require('../models/User');
const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

/**
 * Authentication middleware - Verify JWT token and attach user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Check if token is access token
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type. Access token required.'
      });
    }

    // Find user by ID
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Attach user and token info to request
    req.user = user;
    req.token = decoded;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid token'
    });
  }
};

/**
 * Authorization middleware - Check if user has required role
 * @param {...String} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware - Attach user if token is valid, but don't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    
    if (!token) {
      return next(); // No token provided, continue without user
    }

    const decoded = verifyToken(token);
    
    if (decoded.type === 'access') {
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = user;
        req.token = decoded;
      }
    }
    
    next();
  } catch (error) {
    // Don't fail the request, just continue without user
    console.warn('Optional auth warning:', error.message);
    next();
  }
};

/**
 * Refresh token middleware - Verify refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyRefreshToken = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req) || req.body.refreshToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required.'
      });
    }

    const decoded = verifyToken(token);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type. Refresh token required.'
      });
    }

    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated.'
      });
    }

    req.user = user;
    req.token = decoded;
    
    next();
  } catch (error) {
    console.error('Refresh token verification error:', error.message);
    
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid refresh token'
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  verifyRefreshToken
}; 