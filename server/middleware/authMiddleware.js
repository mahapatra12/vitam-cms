const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // If it's a temp token for 2FA, don't allow full access
      if (decoded.isMfaPending) {
        return res.status(401).json({ message: '2FA verification required' });
      }

      req.user = await User.findById(decoded.id).select('-password -twoFactorSecret -smsOtp -emailOtp');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Check if account is locked
      if (req.user.isLocked) {
        return res.status(401).json({ message: 'Account is locked. Please contact admin.' });
      }
      
      // Check if account is active
      if (!req.user.isActive) {
        return res.status(401).json({ message: 'Account is inactive' });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role '${req.user.role}' is not authorized to access this resource` 
      });
    }
    
    next();
  };
};

module.exports = { protect, authorize };
