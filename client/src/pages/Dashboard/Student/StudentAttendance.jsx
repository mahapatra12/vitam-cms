import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const StudentAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Mock Data
    setAttendanceData([
      { id: 1, subject: 'Data Structures', attended: 24, total: 28, percentage: 85.7 },
      { id: 2, subject: 'Database Management', attended: 20, total: 25, percentage: 80.0 },
      { id: 3, subject: 'Operating Systems', attended: 18, total: 28, percentage: 64.3 },
      { id: 4, subject: 'Computer Networks', attended: 26, total: 28, percentage: 92.8 },
      { id: 5, subject: 'Software Engineering', attended: 22, total: 25, percentage: 88.0 },
    ]);
  }, []);

  const getStatusColor = (percentage) => {
    if (percentage >= 75) return 'text-green-400';
    if (percentage >= 65) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Attendance</h2>
        <p className="text-text-secondary mt-1">Subject-wise attendance records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendanceData.map((item) => {
          const data = [
            { name: 'Attended', value: item.attended },
            { name: 'Missed', value: item.total - item.attended },
          ];
          const COLORS = [item.percentage >= 75 ? '#4ade80' : item.percentage >= 65 ? '#facc15' : '#f87171', '#374151'];

          return (
            <div key={item.id} className="glass-card p-6 flex flex-col items-center">
              <h3 className="text-xl font-bold mb-4 w-full text-center truncate">{item.subject}</h3>
              
              <div className="h-40 w-40 relative mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-2xl font-bold ${getStatusColor(item.percentage)}`}>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4 text-center border-t border-white/5 pt-4">
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider">Attended</p>
                  <p className="font-bold text-lg text-white">{item.attended}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary uppercase tracking-wider">Total</p>
                  <p className="font-bold text-lg text-white">{item.total}</p>
                </div>
              </div>

              {item.percentage < 75 && (
                <div className="mt-4 flex items-center gap-2 text-red-400 text-xs bg-red-500/10 px-3 py-2 rounded-lg w-full justify-center">
                  <AlertTriangle size={14} />
                  <span>Low Attendance Warning</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAttendance;
