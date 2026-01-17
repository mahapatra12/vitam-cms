const Timetable = require('../models/Timetable');
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

// Get timetables
exports.getTimetables = async (req, res) => {
  try {
    const { department, semester, section, session } = req.query;
    const filter = {};
    
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    if (section) filter.section = section;
    if (session) filter.session = session;
    
    const timetables = await Timetable.find(filter)
      .populate('department', 'name code')
      .populate('session', 'name academicYear')
      .populate('entries.subject', 'name code')
      .populate('entries.faculty', 'name email');
    
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get timetable by ID
exports.getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('department', 'name code')
      .populate('session', 'name academicYear')
      .populate('entries.subject', 'name code credits')
      .populate('entries.faculty', 'name email designation');
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get timetable for student
exports.getStudentTimetable = async (req, res) => {
  try {
    const student = req.user;
    
    if (!student.department || !student.semester) {
      return res.status(400).json({ message: 'Student department or semester not set' });
    }
    
    const timetable = await Timetable.findOne({
      department: student.department,
      semester: student.semester,
      section: student.section || 'A',
      isActive: true
    })
      .populate('entries.subject', 'name code credits')
      .populate('entries.faculty', 'name email');
    
    if (!timetable) {
      return res.status(404).json({ message: 'No timetable found for your class' });
    }
    
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create timetable (Admin only)
exports.createTimetable = async (req, res) => {
  const { department, semester, section, session, entries } = req.body;
  
  try {
    const timetable = await Timetable.create({
      department,
      semester,
      section,
      session,
      entries
    });
    
    await createAuditLog(
      req.user,
      'CREATE',
      'Timetable',
      timetable._id,
      `Created timetable for Sem ${semester}, Section ${section}`
    );
    
    const populated = await Timetable.findById(timetable._id)
      .populate('department', 'name code')
      .populate('session', 'name')
      .populate('entries.subject', 'name code')
      .populate('entries.faculty', 'name');
    
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Timetable already exists for this department/semester/section/session' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update timetable (Admin only)
exports.updateTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    const oldData = { ...timetable.toObject() };
    
    Object.assign(timetable, req.body);
    await timetable.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Timetable',
      timetable._id,
      `Updated timetable for Sem ${timetable.semester}`,
      { old: oldData, new: timetable.toObject() }
    );
    
    const populated = await Timetable.findById(timetable._id)
      .populate('department', 'name code')
      .populate('entries.subject', 'name code')
      .populate('entries.faculty', 'name');
    
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete timetable (Admin only)
exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    await timetable.deleteOne();
    
    await createAuditLog(
      req.user,
      'DELETE',
      'Timetable',
      timetable._id,
      `Deleted timetable for Sem ${timetable.semester}`
    );
    
    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
