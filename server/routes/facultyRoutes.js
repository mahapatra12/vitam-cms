const express = require('express');
const router = express.Router();
const { getDashboard, markAttendance } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication and Faculty role
router.use(protect);
router.use(authorize('faculty'));

router.get('/dashboard', getDashboard);
router.post('/attendance', markAttendance);

module.exports = router;
