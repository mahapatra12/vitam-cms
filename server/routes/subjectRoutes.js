const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get all subjects (with optional filters)
router.get('/', subjectController.getSubjects);

// Get subject by ID
router.get('/:id', subjectController.getSubjectById);

// Admin-only routes
router.post('/', authorize('admin', 'super_admin'), subjectController.createSubject);
router.put('/:id', authorize('admin', 'super_admin'), subjectController.updateSubject);
router.delete('/:id', authorize('admin', 'super_admin'), subjectController.deleteSubject);

module.exports = router;
