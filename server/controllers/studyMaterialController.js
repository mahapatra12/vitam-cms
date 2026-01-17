const StudyMaterial = require('../models/StudyMaterial');
const AuditLog = require('../models/AuditLog');
const path = require('path');
const fs = require('fs').promises;

// Helper: Create audit log
const createAuditLog = async (user, action, resourceType, resourceId, description, changes = null) => {
  try {
    await AuditLog.create({
      user: user._id,
      userEmail: user.email,
      userRole: user.role,
      action,
      resourceType,
      resourceId,
      description,
      changes,
      status: 'SUCCESS'
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};

// Get study materials
exports.getStudyMaterials = async (req, res) => {
  try {
    const { subject, department, semester, category } = req.query;
    const filter = { isActive: true };
    
    if (subject) filter.subject = subject;
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    if (category) filter.category = category;
    
    const materials = await StudyMaterial.find(filter)
      .populate('subject', 'name code')
      .populate('department', 'name code')
      .populate('uploadedBy', 'name email designation')
      .sort({ createdAt: -1 });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get study materials for student
exports.getStudentMaterials = async (req, res) => {
  try {
    const student = req.user;
    
    if (!student.department || !student.semester) {
      return res.status(400).json({ message: 'Student department or semester not set' });
    }
    
    const materials = await StudyMaterial.find({
      department: student.department,
      semester: student.semester,
      isActive: true
    })
      .populate('subject', 'name code')
      .populate('uploadedBy', 'name designation')
      .sort({ createdAt: -1 });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get study material by ID
exports.getStudyMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id)
      .populate('subject', 'name code')
      .populate('department', 'name code')
      .populate('uploadedBy', 'name email designation');
    
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload study material (Faculty only)
exports.uploadStudyMaterial = async (req, res) => {
  const { title, description, subject, category, semester, department } = req.body;
  
  try {
    // In production, handle actual file upload here (multer, AWS S3, etc.)
    // For now, we'll use mock file data
    const mockFileUrl = `/uploads/materials/${Date.now()}_${req.body.fileName || 'document.pdf'}`;
    
    const material = await StudyMaterial.create({
      title,
      description,
      subject,
      uploadedBy: req.user._id,
      fileUrl: mockFileUrl,
      fileName: req.body.fileName || 'document.pdf',
      fileSize: req.body.fileSize || 0,
      fileType: req.body.fileType || 'PDF',
      category,
      semester,
      department
    });
    
    await createAuditLog(
      req.user,
      'FILE_UPLOAD',
      'StudyMaterial',
      material._id,
      `Uploaded study material: ${title}`
    );
    
    const populated = await StudyMaterial.findById(material._id)
      .populate('subject', 'name code')
      .populate('department', 'name code');
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update study material (Faculty who uploaded it or Admin)
exports.updateStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    // Check if user is the uploader or admin
    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this material' });
    }
    
    const oldData = { ...material.toObject() };
    
    Object.assign(material, req.body);
    await material.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'StudyMaterial',
      material._id,
      `Updated study material: ${material.title}`,
      { old: oldData, new: material.toObject() }
    );
    
    const populated = await StudyMaterial.findById(material._id)
      .populate('subject', 'name code')
      .populate('department', 'name code');
    
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete study material (Faculty who uploaded it or Admin)
exports.deleteStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    // Check if user is the uploader or admin
    if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this material' });
    }
    
    // In production, also delete the actual file from storage
    
    await material.deleteOne();
    
    await createAuditLog(
      req.user,
      'FILE_DELETE',
      'StudyMaterial',
      material._id,
      `Deleted study material: ${material.title}`
    );
    
    res.json({ message: 'Study material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track download
exports.trackDownload = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    material.downloads += 1;
    await material.save();
    
    res.json({ message: 'Download tracked', fileUrl: material.fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
