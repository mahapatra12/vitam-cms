const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const User = require('../models/User');

// --- Course Management (Admin/HOD) ---
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    // Filter by department if provided query param
    const query = req.query.department ? { department: req.query.department } : {};
    const courses = await Course.find(query)
      .populate('assignedFaculty', 'name')
      .populate('department', 'name')
      .populate('subject', 'name code');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Courses (Faculty/Student)
exports.getMyCourses = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'faculty') {
      query.assignedFaculty = req.user._id;
    } else if (req.user.role === 'student') {
      query.enrolledStudents = req.user._id;
    } else {
      // Admin sees all
      return exports.getCourses(req, res);
    }

    const courses = await Course.find(query)
      .populate('subject', 'name code')
      .populate('department', 'name')
      .populate('assignedFaculty', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Students in a Course
exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('enrolledStudents', 'name rollNumber email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course.enrolledStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Attendance (Faculty) ---
exports.markAttendance = async (req, res) => {
  // Handle both single and bulk formats
  const records = req.body.attendance || req.body.records; // Support both formats
  
  if (!records || !Array.isArray(records)) {
    // Fallback for single record legacy support if needed, or error
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    const operations = records.map(rec => ({
      updateOne: {
        filter: { 
          date: new Date(rec.date), 
          course: rec.course || req.body.courseId, 
          student: rec.student || rec.studentId 
        },
        update: { 
          $set: { 
            status: rec.status,
            markedBy: req.user._id,
            course: rec.course || req.body.courseId,
            student: rec.student || rec.studentId,
            date: new Date(rec.date)
          } 
        },
        upsert: true
      }
    }));
    
    await Attendance.bulkWrite(operations);
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    // For Student: Get their own attendance
    // For Faculty: Get attendance for a course
    const { courseId, studentId } = req.query;
    let query = {};
    
    if (courseId) query.course = courseId;
    if (studentId) query.student = studentId;
    
    // If student is requesting, force their ID
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    const records = await Attendance.find(query).populate('student', 'name rollNumber').populate('course', 'name code');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Marks (Faculty) ---
exports.enterMarks = async (req, res) => {
  // Handle both formats
  const records = req.body.marks || req.body.records;
  const { courseId, examType, maxMarks } = req.body;

  if (!records || !Array.isArray(records)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    const operations = records.map(rec => ({
      updateOne: {
        filter: { 
          course: rec.course || courseId, 
          student: rec.student || rec.studentId, 
          examType: rec.examType || examType 
        },
        update: { 
          $set: { 
            marksObtained: rec.marksObtained,
            maxMarks: rec.maxMarks || maxMarks,
            gradedBy: req.user._id,
            course: rec.course || courseId,
            student: rec.student || rec.studentId,
            examType: rec.examType || examType
          } 
        },
        upsert: true
      }
    }));

    await Mark.bulkWrite(operations);
    res.json({ message: 'Marks updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.query.courseId) {
      query.course = req.query.courseId;
    }

    const marks = await Mark.find(query).populate('course', 'name code').populate('student', 'name');
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'name code semester credits',
        populate: { path: 'department', select: 'name' }
      });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
