const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get all sessions
router.get('/', sessionController.getSessions);

// Get active session
router.get('/active', sessionController.getActiveSession);

// Get session by ID
router.get('/:id', sessionController.getSessionById);

// Admin-only routes
router.post('/', authorize('admin', 'super_admin'), sessionController.createSession);
router.put('/:id', authorize('admin', 'super_admin'), sessionController.updateSession);
router.put('/:id/activate', authorize('admin', 'super_admin'), sessionController.setActiveSession);
router.delete('/:id', authorize('admin', 'super_admin'), sessionController.deleteSession);

module.exports = router;
