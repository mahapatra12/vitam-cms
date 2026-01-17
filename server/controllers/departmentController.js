const Department = require('../models/Department');
const User = require('../models/User');
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

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hod', 'name email designation')
      .sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hod', 'name email designation phoneNumber');
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create department (Admin only)
exports.createDepartment = async (req, res) => {
  const { name, code, hod } = req.body;
  
  try {
    // Check if department with same code exists
    const existing = await Department.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Department code already exists' });
    }
    
    const department = await Department.create({
      name,
      code,
      hod
    });
    
    await createAuditLog(
      req.user,
      'CREATE',
      'Department',
      department._id,
      `Created department: ${name} (${code})`
    );
    
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update department (Admin only)
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    const oldData = { ...department.toObject() };
    
    Object.assign(department, req.body);
    await department.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Department',
      department._id,
      `Updated department: ${department.name}`,
      { old: oldData, new: department.toObject() }
    );
    
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete department (Admin only)
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Check if department has students or faculty
    const studentCount = await User.countDocuments({ department: department._id, role: 'student' });
    const facultyCount = await User.countDocuments({ department: department._id, role: 'faculty' });
    
    if (studentCount > 0 || facultyCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with active students or faculty. Please reassign them first.' 
      });
    }
    
    await department.deleteOne();
    
    await createAuditLog(
      req.user,
      'DELETE',
      'Department',
      department._id,
      `Deleted department: ${department.name} (${department.code})`
    );
    
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get department statistics
exports.getDepartmentStats = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    const students = await User.countDocuments({ department: department._id, role: 'student', isActive: true });
    const faculty = await User.countDocuments({ department: department._id, role: 'faculty', isActive: true });
    
    res.json({
      department: department.name,
      code: department.code,
      studentCount: students,
      facultyCount: faculty,
      hod: department.hod
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
