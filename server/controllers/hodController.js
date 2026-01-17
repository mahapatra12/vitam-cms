const Leave = require('../models/Leave');
const User = require('../models/User');
const Subject = require('../models/Subject');

/**
 * Get all pending leave requests for HOD's department
 */
exports.getPendingLeaves = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);
    
    if (!hod || hod.role !== 'hod') {
      return res.status(403).json({ message: 'Access denied. HOD role required.' });
    }

    const leaves = await Leave.find({
      department: hod.department,
      status: 'Pending'
    })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Approve a leave request
 */
exports.approveLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const hod = await User.findById(req.user._id);
    
    // Verify HOD is from the same department
    if (leave.department.toString() !== hod.department.toString()) {
      return res.status(403).json({ message: 'You can only approve leaves from your department' });
    }

    leave.status = 'Approved';
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();
    await leave.save();

    // TODO: Send notification to the faculty/student
    console.log(`[NOTIFICATION] Leave approved for user ${leave.userId}`);

    res.json({ 
      message: 'Leave approved successfully',
      leave 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Reject a leave request
 */
exports.rejectLeave = async (req, res) => {
  try {
    const { reason } = req.body;
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    const hod = await User.findById(req.user._id);
    
    // Verify HOD is from the same department
    if (leave.department.toString() !== hod.department.toString()) {
      return res.status(403).json({ message: 'You can only reject leaves from your department' });
    }

    leave.status = 'Rejected';
    leave.rejectedBy = req.user._id;
    leave.rejectedAt = new Date();
    leave.rejectionReason = reason || 'No reason provided';
    await leave.save();

    // TODO: Send notification to the faculty/student
    console.log(`[NOTIFICATION] Leave rejected for user ${leave.userId}`);

    res.json({ 
      message: 'Leave rejected successfully',
      leave 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Assign subject to faculty
 */
exports.assignSubjectToFaculty = async (req, res) => {
  try {
    const { facultyId, subjectId } = req.body;

    if (!facultyId || !subjectId) {
      return res.status(400).json({ message: 'Faculty ID and Subject ID are required' });
    }

    const hod = await User.findById(req.user._id);
    const faculty = await User.findById(facultyId);
    const subject = await Subject.findById(subjectId);

    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Verify faculty is from the same department
    if (faculty.department.toString() !== hod.department.toString()) {
      return res.status(403).json({ message: 'You can only assign subjects to faculty in your department' });
    }

    // Assign faculty to subject
    subject.faculty = facultyId;
    await subject.save();

    res.json({ 
      message: 'Subject assigned to faculty successfully',
      subject: {
        _id: subject._id,
        name: subject.name,
        code: subject.code,
        faculty: {
          _id: faculty._id,
          name: faculty.name,
          email: faculty.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all faculty in HOD's department
 */
exports.getDepartmentFaculty = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);
    
    const faculty = await User.find({
      department: hod.department,
      role: 'faculty',
      isActive: true
    }).select('name email designation qualification specialization');

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all subjects in HOD's department
 */
exports.getDepartmentSubjects = async (req, res) => {
  try {
    const hod = await User.findById(req.user._id);
    
    const subjects = await Subject.find({
      department: hod.department
    }).populate('faculty', 'name email');

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
