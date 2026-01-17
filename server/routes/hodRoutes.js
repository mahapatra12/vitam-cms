const express = require('express');
const router = express.Router();
const {
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  assignSubjectToFaculty,
  getDepartmentFaculty,
  getDepartmentSubjects
} = require('../controllers/hodController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication and HOD role
router.use(protect);
router.use(authorize('hod'));

// Leave management
router.get('/leaves/pending', getPendingLeaves);
router.put('/leaves/:id/approve', approveLeave);
router.put('/leaves/:id/reject', rejectLeave);

// Subject assignment
router.post('/subjects/assign', assignSubjectToFaculty);
router.get('/subjects', getDepartmentSubjects);

// Faculty management
router.get('/faculty', getDepartmentFaculty);

module.exports = router;
