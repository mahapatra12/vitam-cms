const User = require('../models/User');
const Subject = require('../models/Subject');
const Timetable = require('../models/Timetable');
const Attendance = require('../models/Attendance');

class StudentService {
  async getDashboardStats(studentId) {
    const student = await User.findById(studentId);
    
    // Mock CGPA calculation or fetch from academic record
    const cgpa = 8.5; 

    // Get enrolled subjects
    // Assuming we have an Enrollment model or subjects are linked to Department/Semester
    const subjects = await Subject.find({ 
      department: student.department,
      semester: student.semester // Assuming student has a current semester field
    });

    // Calculate Attendance Percentage
    const totalClasses = 100; // Mock total
    const attendedClasses = 85; // Mock attended
    const attendance = Math.round((attendedClasses / totalClasses) * 100);

    // Get Today's Classes
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const upcomingClasses = await Timetable.find({
      department: student.department,
      semester: student.semester,
      day: today
    }).sort({ startTime: 1 });

    return {
      attendance,
      cgpa,
      subjects: subjects.map(s => ({
        name: s.name,
        code: s.code,
        faculty: 'Dr. Faculty' // Mock, should populate
      })),
      upcomingClasses: upcomingClasses.map(c => ({
        time: `${c.startTime} - ${c.endTime}`,
        subject: c.subject.name, // Needs populate
        room: c.room
      }))
    };
  }
}

module.exports = new StudentService();
