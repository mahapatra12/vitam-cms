const express = require('express');
const router = express.Router();
const facultyAIController = require('../controllers/facultyAIController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Faculty, HOD, and Admin can access this
router.post('/analyze-student', protect, authorize('faculty', 'hod', 'admin'), facultyAIController.analyzeStudent);

module.exports = router;
