const express = require('express');
const router = express.Router();
const systemSettingsController = require('../controllers/systemSettingsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get system settings (all authenticated users, but sensitive data hidden for non-admins)
router.get('/', systemSettingsController.getSettings);

// Admin-only routes
router.put('/', authorize('admin', 'super_admin'), systemSettingsController.updateSettings);
router.put('/branding', authorize('admin', 'super_admin'), systemSettingsController.updateBranding);
router.put('/email-config', authorize('admin', 'super_admin'), systemSettingsController.updateEmailConfig);
router.put('/sms-config', authorize('admin', 'super_admin'), systemSettingsController.updateSmsConfig);
router.post('/maintenance-mode', authorize('admin', 'super_admin'), systemSettingsController.toggleMaintenanceMode);

module.exports = router;
