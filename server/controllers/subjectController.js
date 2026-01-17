const Subject = require('../models/Subject');
const AuditLog = require('../models/AuditLog');

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

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const { department, semester } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    
    const subjects = await Subject.find(filter)
      .populate('department', 'name code')
      .sort({ semester: 1, name: 1 });
    
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('department', 'name code');
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create subject (Admin only)
exports.createSubject = async (req, res) => {
  const { name, code, department, semester, credits, type, description, syllabus } = req.body;
  
  try {
    // Check if subject with same code exists
    const existing = await Subject.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }
    
    const subject = await Subject.create({
      name,
      code,
      department,
      semester,
      credits,
      type,
      description,
      syllabus
    });
    
    await createAuditLog(
      req.user,
      'CREATE',
      'Subject',
      subject._id,
      `Created subject: ${name} (${code})`
    );
    
    const populated = await Subject.findById(subject._id).populate('department', 'name code');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subject (Admin only)
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    const oldData = { ...subject.toObject() };
    
    Object.assign(subject, req.body);
    await subject.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Subject',
      subject._id,
      `Updated subject: ${subject.name}`,
      { old: oldData, new: subject.toObject() }
    );
    
    const populated = await Subject.findById(subject._id).populate('department', 'name code');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete subject (Admin only)
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // TODO: Check if subject is used in any courses
    
    await subject.deleteOne();
    
    await createAuditLog(
      req.user,
      'DELETE',
      'Subject',
      subject._id,
      `Deleted subject: ${subject.name} (${subject.code})`
    );
    
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
