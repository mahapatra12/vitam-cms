const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllUsers, 
  updateUserRole, 
  getSystemLogs 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication and Admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/role', updateUserRole);
router.get('/logs', getSystemLogs);

module.exports = router;
