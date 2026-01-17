import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, TrendingUp, AlertCircle } from 'lucide-react';

const ClassDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Mock Data
    setStudents([
      { id: 1, name: 'Alice Johnson', roll: 'CS001', attendance: 85, marks: 78 },
      { id: 2, name: 'Bob Smith', roll: 'CS002', attendance: 92, marks: 88 },
      { id: 3, name: 'Charlie Brown', roll: 'CS003', attendance: 65, marks: 45 },
    ]);
  }, [courseId]);

  return (
    <div className="space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Classes</span>
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Class Details</h2>
          <p className="text-text-secondary mt-1">Student performance and attendance</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-text-tertiary border-b border-white/10 text-sm uppercase tracking-wider">
              <th className="p-6 font-semibold">Student</th>
              <th className="p-6 font-semibold">Roll No</th>
              <th className="p-6 font-semibold">Attendance</th>
              <th className="p-6 font-semibold">Performance</th>
              <th className="p-6 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                      {s.name.charAt(0)}
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="p-6 font-mono text-text-secondary">{s.roll}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${s.attendance}%` }} />
                    </div>
                    <span className="text-sm font-bold">{s.attendance}%</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className={s.marks >= 50 ? 'text-green-400' : 'text-red-400'} />
                    <span className="font-bold">{s.marks}%</span>
                  </div>
                </td>
                <td className="p-6">
                  {s.attendance < 75 || s.marks < 50 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold">
                      <AlertCircle size={12} /> At Risk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs font-bold">
                      Good
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassDetails;
