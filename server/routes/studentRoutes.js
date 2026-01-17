const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication and Student role
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);

module.exports = router;
