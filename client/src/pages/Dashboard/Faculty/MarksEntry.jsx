import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Search, FileText } from 'lucide-react';
import './MarksEntry.css';

const MarksEntry = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('mid1');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faculty/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(res.data);
    } catch (error) {
      console.error('Error fetching subjects', error);
    }
  };

  const fetchStudents = async () => {
    if (!selectedSubject) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faculty/subjects/${selectedSubject}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
      // Initialize marks or fetch existing
      const initialMarks = {};
      res.data.forEach(s => initialMarks[s._id] = '');
      setMarks(initialMarks);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedSubject]);

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/faculty/marks`, {
        subjectId: selectedSubject,
        examType,
        marks: Object.entries(marks).map(([studentId, score]) => ({ studentId, score }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Marks saved successfully');
    } catch (error) {
      console.error('Error saving marks', error);
      alert('Failed to save marks');
    }
  };

  return (
    <div className="marks-entry ios-app-container">
      <h2 className="ios-section-title">Enter Marks</h2>

      <div className="controls-card ios-card">
        <div className="control-group">
          <label>Subject</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Exam Type</label>
          <select value={examType} onChange={(e) => setExamType(e.target.value)}>
            <option value="mid1">Mid Term 1</option>
            <option value="mid2">Mid Term 2</option>
            <option value="sem">Semester End</option>
            <option value="lab">Lab Internal</option>
          </select>
        </div>
      </div>

      {students.length > 0 && (
        <div className="marks-table-container ios-card">
          <table className="marks-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Marks (Max: 100)</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={marks[student._id]} 
                      onChange={(e) => handleMarkChange(student._id, e.target.value)}
                      className="mark-input"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="action-footer">
            <button className="ios-btn-primary" onClick={handleSubmit}>
              <Save size={18} />
              <span>Save Marks</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksEntry;
