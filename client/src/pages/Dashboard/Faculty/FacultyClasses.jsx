import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Clock, Users } from 'lucide-react';

const FacultyClasses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      // In a real app, filter by logged-in faculty ID
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
        <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
        <p className="text-text-secondary mt-1">Subjects assigned to you this semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <BookOpen className="text-white" size={24} />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 uppercase tracking-wider font-bold">{course.code}</span>
            </div>
            
            <Link to={`/faculty/classes/${course._id}`} className="block">
              <h3 className="text-xl font-bold mb-1 hover:text-blue-400 transition-colors">{course.name}</h3>
            </Link>
            <p className="text-sm text-text-secondary mb-6">{course.department} • Sem {course.semester}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="bg-black/20 rounded-xl p-3 text-center">
                <p className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-1">Credits</p>
                <p className="font-bold text-lg">{course.credits}</p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 text-center">
                <p className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-1">Students</p>
                <p className="font-bold text-lg">42</p> {/* Mock Count */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyClasses;
