const express = require('express');
const router = express.Router();
const { login, verifyMfa, createUser, getUsers, updateProfile, getAuthenticatorSetup } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, mfaLimiter, createUserLimiter } = require('../middleware/rateLimiter');

// Public
router.post('/login', loginLimiter, login);
router.post('/mfa/verify', mfaLimiter, verifyMfa);

// Protected
router.get('/authenticator/setup', protect, getAuthenticatorSetup);
router.post('/create-user', protect, createUserLimiter, createUser);
router.get('/users', protect, getUsers);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
