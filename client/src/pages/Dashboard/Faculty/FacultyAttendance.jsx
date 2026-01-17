import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Save, CheckCircle, XCircle } from 'lucide-react';

const FacultyAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faculty/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCourses(res.data);
  };

  const fetchStudents = async (courseId) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faculty/courses/${courseId}/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStudents(res.data);
    
    // Initialize all as present by default
    const initialAttendance = {};
    res.data.forEach(s => initialAttendance[s._id] = true);
    setAttendance(initialAttendance);
    setLoading(false);
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const submitAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/faculty/attendance`, {
        courseId: selectedCourse,
        date,
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
          student: studentId,
          status: status ? 'Present' : 'Absent'
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Attendance marked successfully!');
    } catch (error) {
      alert('Failed to mark attendance');
    }
  };

  return (
    <div className="faculty-attendance ios-app-container">
      <header className="ios-header">
        <h1 className="ios-title">Mark Attendance</h1>
      </header>

      <div className="controls-card ios-card">
        <div className="form-group">
          <label>Select Class</label>
          <select 
            value={selectedCourse} 
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              fetchStudents(e.target.value);
            }}
            className="ios-select"
          >
            <option value="">-- Select a Subject --</option>
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="ios-input"
          />
        </div>
      </div>

      {students.length > 0 && (
        <div className="student-list ios-list">
          <div className="list-header">
            <span>Student Name</span>
            <span>Roll No</span>
            <span>Status</span>
          </div>
          {students.map(student => (
            <div 
              key={student._id} 
              className={`student-row ${attendance[student._id] ? 'present' : 'absent'}`}
              onClick={() => toggleAttendance(student._id)}
            >
              <div className="student-info">
                <span className="name">{student.name}</span>
                <span className="roll">{student.rollNumber}</span>
              </div>
              <div className="status-toggle">
                {attendance[student._id] ? (
                  <div className="badge-present"><CheckCircle size={20} /> Present</div>
                ) : (
                  <div className="badge-absent"><XCircle size={20} /> Absent</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {students.length > 0 && (
        <div className="floating-action">
          <button className="ios-btn-primary" onClick={submitAttendance}>
            <Save size={20} /> Save Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyAttendance;
