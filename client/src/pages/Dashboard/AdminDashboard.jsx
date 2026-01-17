import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import AdminHome from './Admin/AdminHome';
import SystemSettings from './Admin/SystemSettings';
import UserManagement from './Admin/UserManagement';
import DepartmentManagement from './Admin/DepartmentManagement';
import CourseManagement from './Admin/CourseManagement';
import SubjectManagement from './Admin/SubjectManagement';
import SessionManagement from './Admin/SessionManagement';
import AnnouncementManagement from './Admin/AnnouncementManagement';
import GlobalReports from './Admin/GlobalReports';
import PagePlaceholder from '../../components/PagePlaceholder';
import { Users, GraduationCap, Building2, AlertCircle } from 'lucide-react';



const AdminDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/departments" element={<DepartmentManagement />} />
        <Route path="/courses" element={<CourseManagement />} />
        <Route path="/subjects" element={<SubjectManagement />} />
        <Route path="/sessions" element={<SessionManagement />} />
        <Route path="/announcements" element={<AnnouncementManagement />} />
        <Route path="/reports" element={<GlobalReports />} />
        <Route path="/settings" element={<SystemSettings />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
