const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get all departments (accessible to all authenticated users)
router.get('/', departmentController.getDepartments);

// Get department by ID
router.get('/:id', departmentController.getDepartmentById);

// Get department statistics
router.get('/:id/stats', departmentController.getDepartmentStats);

// Admin-only routes
router.post('/', authorize('admin', 'super_admin'), departmentController.createDepartment);
router.put('/:id', authorize('admin', 'super_admin'), departmentController.updateDepartment);
router.delete('/:id', authorize('admin', 'super_admin'), departmentController.deleteDepartment);

module.exports = router;
