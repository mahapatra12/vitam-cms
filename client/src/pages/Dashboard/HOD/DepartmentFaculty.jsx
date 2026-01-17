import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, BookOpen } from 'lucide-react';

const DepartmentFaculty = () => {
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      // In real app, filter by HOD's department
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculty(res.data.filter(u => u.role === 'faculty'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card p-8 min-h-[600px]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Department Faculty</h2>
        <p className="text-text-secondary mt-1">Overview of teaching staff</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((f) => (
          <div key={f._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl font-bold text-white">{f.name.charAt(0)}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-1">{f.name}</h3>
            <p className="text-sm text-text-secondary mb-4">{f.department || 'General'}</p>
            
            <div className="w-full space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-sm text-gray-400 justify-center">
                <Mail size={16} />
                <span>{f.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 justify-center">
                <Phone size={16} />
                <span>{f.phoneNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentFaculty;
