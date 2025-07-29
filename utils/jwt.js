const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generate JWT token
 * @param {Object} payload - The payload to encode in the token
 * @param {String} expiresIn - Token expiration time (optional)
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn = config.JWT_EXPIRE) => {
  try {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn,
      issuer: 'auth-backend',
      audience: 'auth-client'
    });
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

/**
 * Generate access token for user
 * @param {Object} user - User object
 * @returns {String} Access token
 */
const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    type: 'access'
  };
  
  return generateToken(payload, '10s'); // Access token expires in 10seconds
};

/**
 * Generate refresh token for user
 * @param {Object} user - User object
 * @returns {String} Refresh token
 */
const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    type: 'refresh'
  };
  
  return generateToken(payload, config.JWT_EXPIRE); // Refresh token uses default expiry
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET, {
      issuer: 'auth-backend',
      audience: 'auth-client'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {String} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    throw new Error('Token decode failed');
  }
};

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {String|null} Token or null if not found
 */
const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  // Check for Bearer token format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  
  return authHeader; // Return as is if no Bearer prefix
};

/**
 * Check if token is expired
 * @param {Object} decodedToken - Decoded JWT token
 * @returns {Boolean} True if token is expired
 */
const isTokenExpired = (decodedToken) => {
  if (!decodedToken.exp) {
    return false; // No expiration set
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};

module.exports = {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  extractTokenFromHeader,
  isTokenExpired
}; 