import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './Timetable.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Timetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/timetables/my-timetable`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimetable(response.data);
    } catch (error) {
      showToast('Failed to fetch timetable', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getEntriesForDay = (day) => {
    if (!timetable || !timetable.entries) return [];
    return timetable.entries
      .filter(entry => entry.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (loading) {
    return (
      <div className="timetable-page">
        <Card title="My Timetable">
          <div className="loading-state">Loading timetable...</div>
        </Card>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="timetable-page">
        <Card title="My Timetable">
          <div className="empty-state">
            <p>No timetable available for your class.</p>
            <p className="empty-subtitle">Please contact your department for timetable information.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="timetable-page">
      <Card 
        title="My Timetable" 
        subtitle={`Semester ${user.semester} - Section ${user.section || 'A'}`}
      >
        <div className="timetable-grid">
          {days.map(day => {
            const entries = getEntriesForDay(day);
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            const isToday = day === today;

            return (
              <div key={day} className={`day-column ${isToday ? 'today' : ''}`}>
                <div className="day-header">
                  <span className="day-name">{day}</span>
                  {isToday && <span className="today-badge">Today</span>}
                </div>
                <div className="day-entries">
                  {entries.length > 0 ? (
                    entries.map((entry, index) => (
                      <div key={index} className="timetable-entry">
                        <div className="entry-time">
                          {entry.startTime} - {entry.endTime}
                        </div>
                        <div className="entry-subject">
                          {entry.subject?.name || 'N/A'}
                        </div>
                        <div className="entry-code">
                          {entry.subject?.code}
                        </div>
                        <div className="entry-faculty">
                          {entry.faculty?.name}
                        </div>
                        {entry.room && (
                          <div className="entry-room">
                            📍 {entry.room}
                          </div>
                        )}
                        <div className={`entry-type ${entry.type?.toLowerCase()}`}>
                          {entry.type}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-classes">No classes</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Timetable;
