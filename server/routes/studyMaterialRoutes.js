const express = require('express');
const router = express.Router();
const studyMaterialController = require('../controllers/studyMaterialController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Get study materials (with optional filters)
router.get('/', studyMaterialController.getStudyMaterials);

// Get student's study materials
router.get('/my-materials', authorize('student'), studyMaterialController.getStudentMaterials);

// Get study material by ID
router.get('/:id', studyMaterialController.getStudyMaterialById);

// Track download
router.post('/:id/download', studyMaterialController.trackDownload);

// Faculty and Admin routes
router.post('/', authorize('faculty', 'admin', 'super_admin'), studyMaterialController.uploadStudyMaterial);
router.put('/:id', authorize('faculty', 'admin', 'super_admin'), studyMaterialController.updateStudyMaterial);
router.delete('/:id', authorize('faculty', 'admin', 'super_admin'), studyMaterialController.deleteStudyMaterial);

module.exports = router;
