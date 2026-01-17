import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, User, Save } from 'lucide-react';
import './SubjectAssignment.css';

const SubjectAssignment = () => {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [subRes, facRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/hod/subjects`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/hod/faculty`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSubjects(subRes.data);
      setFaculty(facRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleAssign = async (subjectId) => {
    try {
      const token = localStorage.getItem('token');
      const facultyId = assignments[subjectId];
      if (!facultyId) return;

      await axios.post(`${import.meta.env.VITE_API_URL}/api/hod/subjects/assign`, 
        { subjectId, facultyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Subject assigned successfully');
    } catch (error) {
      console.error('Error assigning subject', error);
    }
  };

  return (
    <div className="subject-assignment ios-app-container">
      <h2 className="ios-section-title">Subject Allocation</h2>
      
      <div className="ios-grid-list">
        {subjects.map((sub) => (
          <div key={sub._id} className="ios-card assignment-card">
            <div className="subject-header">
              <div className="icon-box bg-blue-soft">
                <BookOpen size={20} />
              </div>
              <div>
                <h3>{sub.name}</h3>
                <p>{sub.code} • Sem {sub.semester}</p>
              </div>
            </div>
            
            <div className="assignment-control">
              <label>Assign Faculty</label>
              <div className="select-wrapper">
                <User size={16} className="select-icon" />
                <select 
                  value={assignments[sub._id] || sub.faculty?._id || ''}
                  onChange={(e) => setAssignments({...assignments, [sub._id]: e.target.value})}
                >
                  <option value="">Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="ios-btn-primary" onClick={() => handleAssign(sub._id)}>
              <Save size={18} />
              <span>Save Assignment</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectAssignment;
