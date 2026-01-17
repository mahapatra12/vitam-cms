import { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, User, Clock } from 'lucide-react';

const StudentSubjects = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      // Ideally filter by student's department/semester
      const res = await axios.get('http://localhost:5000/api/academic/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card p-8 min-h-[600px]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Subjects</h2>
        <p className="text-text-secondary mt-1">Enrolled courses for this semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Book className="text-white" size={24} />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 uppercase tracking-wider font-bold">{course.code}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-1 relative z-10">{course.name}</h3>
            <p className="text-sm text-text-secondary mb-4 relative z-10">Semester {course.semester}</p>
            
            <div className="flex flex-col gap-2 pt-4 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User size={16} />
                <span>{course.assignedFaculty?.name || 'TBA'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={16} />
                <span>{course.credits} Credits</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSubjects;
