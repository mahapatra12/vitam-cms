const Session = require('../models/Session');
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

// Get all sessions
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ startDate: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active session
exports.getActiveSession = async (req, res) => {
  try {
    const session = await Session.findOne({ isActive: true });
    
    if (!session) {
      return res.status(404).json({ message: 'No active session found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create session (Admin only)
exports.createSession = async (req, res) => {
  const { name, startDate, endDate, currentSemester, isActive, academicYear, importantDates } = req.body;
  
  try {
    const session = await Session.create({
      name,
      startDate,
      endDate,
      currentSemester,
      isActive,
      academicYear,
      importantDates
    });
    
    await createAuditLog(
      req.user,
      'CREATE',
      'Session',
      session._id,
      `Created session: ${name}`
    );
    
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update session (Admin only)
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    const oldData = { ...session.toObject() };
    
    Object.assign(session, req.body);
    await session.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Session',
      session._id,
      `Updated session: ${session.name}`,
      { old: oldData, new: session.toObject() }
    );
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Set active session (Admin only)
exports.setActiveSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Deactivate all other sessions
    await Session.updateMany({ _id: { $ne: session._id } }, { isActive: false });
    
    session.isActive = true;
    await session.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Session',
      session._id,
      `Set active session: ${session.name}`
    );
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete session (Admin only)
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    if (session.isActive) {
      return res.status(400).json({ message: 'Cannot delete active session' });
    }
    
    await session.deleteOne();
    
    await createAuditLog(
      req.user,
      'DELETE',
      'Session',
      session._id,
      `Deleted session: ${session.name}`
    );
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
