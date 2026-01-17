import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import HODHome from './HOD/HODHome';
import DepartmentFaculty from './HOD/DepartmentFaculty';
import DepartmentStudents from './HOD/DepartmentStudents';
import DepartmentReports from './HOD/DepartmentReports';
import DepartmentAnnouncements from './HOD/DepartmentAnnouncements';
import LeaveRequests from './HOD/LeaveRequests';
import SubjectAllocation from './HOD/SubjectAllocation';
import PagePlaceholder from '../../components/PagePlaceholder';
import { Users, BookOpen, FileText, Bell, CheckSquare } from 'lucide-react';



const HODDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HODHome />} />
        <Route path="/faculty" element={<DepartmentFaculty />} />
        <Route path="/students" element={<DepartmentStudents />} />
        <Route path="/leaves" element={<LeaveRequests />} />
        <Route path="/allocation" element={<SubjectAllocation />} />
        <Route path="/announcements" element={<DepartmentAnnouncements />} />
        <Route path="/reports" element={<DepartmentReports />} />
      </Routes>
    </Layout>
  );
};

export default HODDashboard;
