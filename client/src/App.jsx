import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/Dashboard/Admin/AdminDashboardOverview';
import HODDashboard from './pages/Dashboard/HOD/HODHome';
import FacultyDashboard from './pages/Dashboard/Faculty/FacultyDashboard';
import StudentDashboard from './pages/Dashboard/Student/StudentDashboard';
import FacultyAttendance from './pages/Dashboard/Faculty/FacultyAttendance';
import LoadingScreen from './components/LoadingScreen';
import NotFound from './pages/NotFound';
import { ToastProvider } from './context/ToastContext';
// New imports for missing parts
import Setup2FA from './pages/Setup2FA';
import LeaveApprovals from './pages/Dashboard/HOD/LeaveApprovals';
import SubjectAssignment from './pages/Dashboard/HOD/SubjectAssignment';
import UserManagement from './pages/Dashboard/Admin/UserManagement';
import SystemLogs from './pages/Dashboard/Admin/SystemLogs';
import AIChatWidget from './components/AIChatWidget';
import StudentAnalytics from './pages/Dashboard/Faculty/StudentAnalytics';

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading on route change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s load time
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <LoadingScreen />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/hod/*" element={<HODDashboard />} />
        <Route path="/faculty/*" element={<FacultyDashboard />} />
        <Route path="/student/*" element={<StudentDashboard />} />
        
        {/* 2FA Setup */}
        <Route path="/setup-2fa" element={<Setup2FA />} />
        
        {/* HOD Specific Routes */}
        <Route path="/dashboard/hod/leave-approvals" element={<LeaveApprovals />} />
        <Route path="/dashboard/hod/subject-assignment" element={<SubjectAssignment />} />
        
        {/* New Dashboard Routes */}
        <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
        <Route path="/faculty/attendance" element={<FacultyAttendance />} />
        <Route path="/faculty/analytics" element={<StudentAnalytics />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard/admin/users" element={<UserManagement />} />
        <Route path="/dashboard/admin/logs" element={<SystemLogs />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatWidget />
    </>
  );
};

function AppWrapper() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default AppWrapper;
