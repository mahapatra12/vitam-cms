import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import FacultyHome from './Faculty/FacultyHome';
import AttendanceManagement from './Faculty/AttendanceManagement';
import MarksEntry from './Faculty/MarksEntry';
import FacultyClasses from './Faculty/FacultyClasses';
import StudyMaterials from './Faculty/StudyMaterials';
import LeaveManagement from './Faculty/LeaveManagement';
import ClassDetails from './Faculty/ClassDetails';
import PagePlaceholder from '../../components/PagePlaceholder';
import { BookOpen, Users, Calendar, Upload, CheckCircle } from 'lucide-react';



const FacultyDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FacultyHome />} />
        <Route path="/classes" element={<FacultyClasses />} />
        <Route path="/classes/:courseId" element={<ClassDetails />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/marks" element={<MarksEntry />} />
        <Route path="/uploads" element={<StudyMaterials />} />
        <Route path="/leave" element={<LeaveManagement />} />
      </Routes>
    </Layout>
  );
};

export default FacultyDashboard;
