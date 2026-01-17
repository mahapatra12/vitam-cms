const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get timetables (with optional filters)
router.get('/', timetableController.getTimetables);

// Get student's timetable
router.get('/my-timetable', authorize('student'), timetableController.getStudentTimetable);

// Get timetable by ID
router.get('/:id', timetableController.getTimetableById);

// Admin-only routes
router.post('/', authorize('admin', 'super_admin'), timetableController.createTimetable);
router.put('/:id', authorize('admin', 'super_admin'), timetableController.updateTimetable);
router.delete('/:id', authorize('admin', 'super_admin'), timetableController.deleteTimetable);

module.exports = router;
