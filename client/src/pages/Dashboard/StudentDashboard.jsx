import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import StudentHome from './Student/StudentHome';
import FeeManagement from './Student/FeeManagement';
import StudentResults from './Student/StudentResults';
import StudentSubjects from './Student/StudentSubjects';
import Timetable from './Student/Timetable';
import StudyMaterials from './Student/StudyMaterials';
import StudentAttendance from './Student/StudentAttendance';
import StudentProfile from './Student/StudentProfile';
import PagePlaceholder from '../../components/PagePlaceholder';
import { BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react';



const StudentDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/fees" element={<FeeManagement />} />
        <Route path="/subjects" element={<StudentSubjects />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/results" element={<StudentResults />} />
        <Route path="/attendance" element={<StudentAttendance />} />
        <Route path="/downloads" element={<StudyMaterials />} />
      </Routes>
    </Layout>
  );
};

export default StudentDashboard;
