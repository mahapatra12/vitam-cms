import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, BookOpen, CheckSquare, FileText, Upload, Shield } from 'lucide-react';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingAttendance: 0
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/faculty/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data.stats);
      setClasses(response.data.classes);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard', error);
      setLoading(false);
    }
  };

  return (
    <div className="faculty-dashboard ios-app-container">
      {/* iOS Style Header */}
      <header className="ios-header">
        <div>
          <h1 className="ios-title">Faculty Dashboard</h1>
          <p className="ios-subtitle">Manage your academic tasks</p>
        </div>
        <div className="ios-profile-pill">
          <img src="https://ui-avatars.com/api/?name=Faculty+User" alt="Profile" />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="ios-grid">
        <div className="ios-card blue-gradient">
          <div className="card-icon"><BookOpen size={24} /></div>
          <div className="card-content">
            <h3>My Classes</h3>
            <p className="big-number">{stats.totalClasses}</p>
          </div>
        </div>
        <div className="ios-card purple-gradient">
          <div className="card-icon"><Users size={24} /></div>
          <div className="card-content">
            <h3>Total Students</h3>
            <p className="big-number">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="ios-card orange-gradient">
          <div className="card-icon"><CheckSquare size={24} /></div>
          <div className="card-content">
            <h3>Pending Attendance</h3>
            <p className="big-number">{stats.pendingAttendance}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="ios-section-title">Quick Actions</h2>
      <div className="ios-action-grid">
        <button className="ios-action-btn" onClick={() => window.location.href='/faculty/attendance'}>
          <div className="icon-box bg-green"><Calendar size={24} /></div>
          <span>Mark Attendance</span>
        </button>
        <button className="ios-action-btn" onClick={() => window.location.href='/faculty/marks'}>
          <div className="icon-box bg-blue"><FileText size={24} /></div>
          <span>Enter Marks</span>
        </button>
        <button className="ios-action-btn" onClick={() => window.location.href='/faculty/materials'}>
          <div className="icon-box bg-purple"><Upload size={24} /></div>
          <span>Upload Materials</span>
        </button>
        <button className="ios-action-btn" onClick={() => window.location.href='/faculty/analytics'}>
          <div className="icon-box bg-red"><TrendingUp size={24} /></div>
          <span>AI Analytics</span>
        </button>
      </div>

      {/* Today's Schedule */}
      <h2 className="ios-section-title">Today's Schedule</h2>
      <div className="ios-list">
        {classes.length > 0 ? (
          classes.map((cls, index) => (
            <div key={index} className="ios-list-item">
              <div className="time-slot">
                <span className="start-time">{cls.startTime}</span>
                <span className="end-time">{cls.endTime}</span>
              </div>
              <div className="class-details">
                <h3>{cls.subject.name}</h3>
                <p>{cls.course.name} - Sem {cls.semester}</p>
              </div>
              <div className="room-badge">{cls.room}</div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No classes scheduled for today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
