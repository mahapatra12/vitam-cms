import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Calendar, Award, Download, Bell, Shield } from 'lucide-react';
import './StudentDashboard.css';

const StudentHome = () => {
    // Re-implemented logic from original StudentDashboard
    const [data, setData] = useState({
        attendance: 0,
        cgpa: 0,
        subjects: [],
        upcomingClasses: []
      });
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
          } catch (err) {
            console.error(err);
             // Dummy data fallback
             setData({
                attendance: 78,
                cgpa: 8.5,
                subjects: [
                    {name: 'Data Structures', code: 'CS201', faculty: 'Dr. Smith'},
                    {name: 'Web Dev', code: 'CS202', faculty: 'Prof. Doe'}
                ],
                upcomingClasses: [
                    {time: '10:00 AM', subject: 'Data Structures', room: 'LH-101'},
                    {time: '11:30 AM', subject: 'Web Dev', room: 'LAB-2'}
                ]
             })
          }
        };
        fetchData();
      }, []);
    
      return (
        <div className="student-dashboard ios-app-container p-6">
          <header className="ios-header mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Overview</h1>
              <p className="text-gray-500">Welcome back, Student</p>
            </div>
            <div className="notification-icon">
              <Bell size={24} />
              <span className="badge">3</span>
            </div>
          </header>
    
          {/* Overview Cards */}
          <div className="ios-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="ios-card blue-gradient p-6 rounded-2xl text-white">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg"><Calendar size={24} /></div>
                  <h3 className="font-medium opacity-90">Attendance</h3>
              </div>
              <p className="text-4xl font-bold">{data.attendance}%</p>
            </div>
            <div className="ios-card purple-gradient p-6 rounded-2xl text-white">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-lg"><Award size={24} /></div>
                  <h3 className="font-medium opacity-90">CGPA</h3>
              </div>
              <p className="text-4xl font-bold">{data.cgpa}</p>
            </div>
          </div>
    
          {/* My Subjects */}
          <h2 className="text-lg font-semibold mb-4 text-gray-700">My Subjects</h2>
          <div className="space-y-3 mb-8">
            {data.subjects.map((sub, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Book size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{sub.name}</h3>
                    <p className="text-xs text-gray-500">{sub.code} • {sub.faculty}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-blue-600"><Download size={18} /></button>
              </div>
            ))}
          </div>
    
          {/* Timetable Preview */}
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Today's Classes</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {data.upcomingClasses.map((cls, idx) => (
              <div key={idx} className="min-w-[160px] bg-white p-4 rounded-xl shadow-sm border border-gray-100 p-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{cls.time}</span>
                <h4 className="font-medium text-gray-800 mt-2">{cls.subject}</h4>
                <p className="text-xs text-gray-500">{cls.room}</p>
              </div>
            ))}
          </div>
        </div>
      );
};

export default StudentHome;
