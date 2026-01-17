import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, GraduationCap } from 'lucide-react';

const DepartmentStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data.filter(u => u.role === 'student'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-card p-8 min-h-[600px]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Department Students</h2>
        <p className="text-text-secondary mt-1">Overview of enrolled students</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-text-tertiary border-b border-white/10 text-sm uppercase tracking-wider">
              <th className="p-6 font-semibold">Student</th>
              <th className="p-6 font-semibold">Roll No</th>
              <th className="p-6 font-semibold">Year</th>
              <th className="p-6 font-semibold">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{s.name}</p>
                      <p className="text-xs text-text-secondary">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 font-mono">{s.rollNumber}</td>
                <td className="p-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold">Year {s.year}</span>
                </td>
                <td className="p-6 text-text-secondary">{s.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentStudents;
