const Leave = require('../models/Leave');
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

// Get all leaves (Admin/HOD)
exports.getLeaves = async (req, res) => {
  try {
    const { status, applicantRole } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (applicantRole) filter.applicantRole = applicantRole;
    
    // HOD can only see leaves from their department
    if (req.user.role === 'hod') {
      // TODO: Filter by department
    }
    
    const leaves = await Leave.find(filter)
      .populate('applicant', 'name email role department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ applicant: req.user._id })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave by ID
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('applicant', 'name email role department phoneNumber')
      .populate('approvedBy', 'name email');
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    // Check access
    if (leave.applicant._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && req.user.role !== 'hod') {
      return res.status(403).json({ message: 'Not authorized to view this leave' });
    }
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for leave
exports.applyLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason, attachments } = req.body;
  
  try {
    const leave = await Leave.create({
      applicant: req.user._id,
      applicantRole: req.user.role,
      leaveType,
      startDate,
      endDate,
      reason,
      attachments
    });
    
    await createAuditLog(
      req.user,
      'CREATE',
      'Leave',
      leave._id,
      `Applied for ${leaveType} from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
    );
    
    const populated = await Leave.findById(leave._id)
      .populate('applicant', 'name email role');
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update leave (Applicant can update if pending)
exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    // Only applicant can update their own pending leave
    if (leave.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this leave' });
    }
    
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot update leave that is not pending' });
    }
    
    const oldData = { ...leave.toObject() };
    
    Object.assign(leave, req.body);
    await leave.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Leave',
      leave._id,
      `Updated leave application`,
      { old: oldData, new: leave.toObject() }
    );
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject leave (Admin/HOD only)
exports.updateLeaveStatus = async (req, res) => {
  const { status, approverComments } = req.body;
  
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave has already been processed' });
    }
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    leave.status = status;
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();
    leave.approverComments = approverComments;
    
    await leave.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Leave',
      leave._id,
      `${status} leave application for ${leave.leaveType}`
    );
    
    const populated = await Leave.findById(leave._id)
      .populate('applicant', 'name email')
      .populate('approvedBy', 'name email');
    
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel leave (Applicant can cancel if pending or approved)
exports.cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    if (leave.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this leave' });
    }
    
    if (leave.status === 'Cancelled' || leave.status === 'Rejected') {
      return res.status(400).json({ message: 'Leave is already cancelled or rejected' });
    }
    
    leave.status = 'Cancelled';
    await leave.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'Leave',
      leave._id,
      `Cancelled leave application`
    );
    
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete leave (Admin only)
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    await leave.deleteOne();
    
    await createAuditLog(
      req.user,
      'DELETE',
      'Leave',
      leave._id,
      `Deleted leave application`
    );
    
    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
