const csrf = require('csurf');

// CSRF protection middleware
// Note: This requires cookie-parser middleware to be installed and configured
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict'
  }
});

// Middleware to attach CSRF token to response
const attachCsrfToken = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

// API endpoint to get CSRF token
const getCsrfToken = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

module.exports = {
  csrfProtection,
  attachCsrfToken,
  getCsrfToken
};
