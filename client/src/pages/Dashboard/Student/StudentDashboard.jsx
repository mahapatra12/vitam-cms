import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  LayoutDashboard, BookOpen, Calendar, 
  CreditCard, User, Briefcase, FileText
} from 'lucide-react';

// Import Sub-pages
import StudentHome from './StudentHome';
import StudentCareer from './StudentCareer';
// Placeholder for other pages
const Placeholder = ({ title }) => (
  <div className="p-8 text-center text-gray-500">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p>This module is coming soon.</p>
  </div>
);

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/student' },
    { icon: Briefcase, label: 'Career Guidance', path: '/student/career' },
    { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
    { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
    { icon: FileText, label: 'Results', path: '/student/results' },
    { icon: CreditCard, label: 'Fees', path: '/student/fees' },
    { icon: User, label: 'Profile', path: '/student/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      <Sidebar 
        title="Student Portal" 
        role="Student"
        menuItems={menuItems}
        currentPath={location.pathname}
        onNavigate={navigate}
      />
      
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="/career" element={<StudentCareer />} />
          <Route path="/courses" element={<Placeholder title="My Courses" />} />
          <Route path="/timetable" element={<Placeholder title="Timetable" />} />
          <Route path="/results" element={<Placeholder title="Exam Results" />} />
          <Route path="/fees" element={<Placeholder title="Fee Payments" />} />
          <Route path="/profile" element={<Placeholder title="My Profile" />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
