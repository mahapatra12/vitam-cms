const express = require('express');
const router = express.Router();
const { 
  createCourse, getCourses, getMyCourses, getCourseStudents,
  markAttendance, getAttendance,
  enterMarks, getMarks, getMyResults
} = require('../controllers/academicController');
const { protect } = require('../middleware/authMiddleware');

// Courses
router.post('/courses', protect, createCourse); // Admin/HOD
router.get('/courses', protect, getCourses);
router.get('/my-courses', protect, getMyCourses);
router.get('/courses/:id/students', protect, getCourseStudents);

// Attendance
router.post('/attendance', protect, markAttendance); // Faculty
router.post('/attendance/bulk', protect, markAttendance); // Alias for bulk
router.get('/attendance', protect, getAttendance);

// Marks
router.post('/marks', protect, enterMarks); // Faculty
router.post('/marks/bulk', protect, enterMarks); // Alias for bulk
router.get('/marks', protect, getMarks);
router.get('/my-results', protect, getMyResults);

module.exports = router;
