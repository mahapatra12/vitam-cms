const facultyService = require('../services/facultyService');
const auditService = require('../services/auditService');

const getDashboard = async (req, res) => {
  try {
    const data = await facultyService.getDashboardStats(req.user._id);
    res.json(data);
  } catch (error) {
    console.error('Faculty Dashboard Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { classId, students, status } = req.body;
    const result = await facultyService.markAttendance(req.user._id, classId, students, status);
    await auditService.log(req.user._id, 'MARK_ATTENDANCE', { classId, studentCount: students.length, status }, req);
    res.json({ message: 'Attendance marked successfully', data: result });
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error: error.message });
  }
};

module.exports = {
  getDashboard,
  markAttendance
};
