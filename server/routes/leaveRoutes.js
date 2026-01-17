const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get all leaves (Admin/HOD)
router.get('/', authorize('admin', 'super_admin', 'hod'), leaveController.getLeaves);

// Get my leaves
router.get('/my-leaves', leaveController.getMyLeaves);

// Get leave by ID
router.get('/:id', leaveController.getLeaveById);

// Apply for leave (Faculty/Student)
router.post('/', authorize('faculty', 'student'), leaveController.applyLeave);

// Update leave (Applicant only, if pending)
router.put('/:id', leaveController.updateLeave);

// Approve/Reject leave (Admin/HOD)
router.put('/:id/status', authorize('admin', 'super_admin', 'hod'), leaveController.updateLeaveStatus);

// Cancel leave (Applicant)
router.put('/:id/cancel', leaveController.cancelLeave);

// Delete leave (Admin only)
router.delete('/:id', authorize('admin', 'super_admin'), leaveController.deleteLeave);

module.exports = router;
