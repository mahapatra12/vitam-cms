const User = require('../models/User');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');

class FacultyService {
  /**
   * Get dashboard statistics for a faculty member
   * @param {string} facultyId - The ID of the faculty user
   */
  async getDashboardStats(facultyId) {
    // Get classes assigned to this faculty
    const classes = await Timetable.find({ faculty: facultyId })
      .populate('subject')
      .populate('course')
      .sort({ startTime: 1 });

    // Calculate total students (unique students in assigned subjects)
    // This is a simplification; in a real app, we'd query the enrollment table
    const subjects = await Subject.find({ faculty: facultyId });
    const totalStudents = subjects.reduce((acc, sub) => acc + (sub.enrolledCount || 0), 0);

    // Get pending attendance (classes in the past with no attendance record)
    const pendingAttendance = await this.getPendingAttendanceCount(facultyId);

    return {
      stats: {
        totalClasses: classes.length,
        totalStudents,
        pendingAttendance
      },
      classes: classes.map(c => ({
        id: c._id,
        subject: c.subject,
        course: c.course,
        semester: c.semester,
        startTime: c.startTime,
        endTime: c.endTime,
        room: c.room
      }))
    };
  }

  async getPendingAttendanceCount(facultyId) {
    // Mock implementation - in real app, check schedule vs attendance records
    return 5; 
  }

  async markAttendance(facultyId, classId, studentIds, status) {
    // Implementation for marking attendance
    const attendance = new Attendance({
      faculty: facultyId,
      class: classId,
      students: studentIds.map(id => ({ student: id, status })),
      date: new Date()
    });
    await attendance.save();
    return attendance;
  }
}

module.exports = new FacultyService();
