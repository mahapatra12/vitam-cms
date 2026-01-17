import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import './AttendanceManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AttendanceManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/academic/my-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      showToast('Failed to fetch courses', 'error');
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/academic/courses/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      
      // Initialize attendance state
      const initialAttendance = {};
      response.data.forEach(student => {
        initialAttendance[student._id] = 'Present';
      });
      setAttendance(initialAttendance);
    } catch (error) {
      showToast('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchStudents(course._id);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) {
      showToast('Please select a course', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        student: studentId,
        course: selectedCourse._id,
        date: attendanceDate,
        status,
        markedBy: user._id
      }));

      await axios.post(
        `${API_URL}/academic/attendance/bulk`,
        { attendance: attendanceData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('Attendance marked successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to mark attendance', 'error');
    }
  };

  return (
    <div className="attendance-management">
      <Card title="Mark Attendance" subtitle="Select a course and mark student attendance">
        <div className="attendance-controls">
          <div className="control-group">
            <label>Select Course</label>
            <select 
              value={selectedCourse?._id || ''}
              onChange={(e) => {
                const course = courses.find(c => c._id === e.target.value);
                if (course) handleCourseSelect(course);
              }}
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name} - {course.code}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {selectedCourse && (
          <>
            <div className="attendance-summary">
              <div className="summary-item">
                <span className="label">Total Students:</span>
                <span className="value">{students.length}</span>
              </div>
              <div className="summary-item">
                <span className="label">Present:</span>
                <span className="value present">
                  {Object.values(attendance).filter(s => s === 'Present').length}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Absent:</span>
                <span className="value absent">
                  {Object.values(attendance).filter(s => s === 'Absent').length}
                </span>
              </div>
              <div className="summary-item">
                <span className="label">Leave:</span>
                <span className="value leave">
                  {Object.values(attendance).filter(s => s === 'Leave').length}
                </span>
              </div>
            </div>

            <div className="students-list">
              {students.map((student, index) => (
                <div key={student._id} className="student-row">
                  <div className="student-info">
                    <span className="student-number">{index + 1}</span>
                    <div className="student-details">
                      <span className="student-name">{student.name}</span>
                      <span className="student-roll">{student.rollNumber}</span>
                    </div>
                  </div>
                  <div className="attendance-options">
                    <button
                      className={`attendance-btn ${attendance[student._id] === 'Present' ? 'active present' : ''}`}
                      onClick={() => handleAttendanceChange(student._id, 'Present')}
                    >
                      Present
                    </button>
                    <button
                      className={`attendance-btn ${attendance[student._id] === 'Absent' ? 'active absent' : ''}`}
                      onClick={() => handleAttendanceChange(student._id, 'Absent')}
                    >
                      Absent
                    </button>
                    <button
                      className={`attendance-btn ${attendance[student._id] === 'Leave' ? 'active leave' : ''}`}
                      onClick={() => handleAttendanceChange(student._id, 'Leave')}
                    >
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <Button variant="primary" onClick={handleSubmit} fullWidth>
                Submit Attendance
              </Button>
            </div>
          </>
        )}

        {!selectedCourse && (
          <div className="empty-state">
            <p>Select a course to start marking attendance</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AttendanceManagement;
