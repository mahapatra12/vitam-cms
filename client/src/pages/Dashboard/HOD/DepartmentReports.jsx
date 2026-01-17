import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, TrendingUp, Users, CheckCircle } from 'lucide-react';

const data = [
  { name: 'Year 1', attendance: 85, results: 78 },
  { name: 'Year 2', attendance: 82, results: 75 },
  { name: 'Year 3', attendance: 88, results: 82 },
  { name: 'Year 4', attendance: 75, results: 85 },
];

const DepartmentReports = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Department Reports</h2>
          <p className="text-text-secondary mt-1">Performance and attendance analytics</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FileText size={20} />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Avg Attendance" value="82.5%" icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Pass Percentage" value="94%" icon={TrendingUp} color="bg-blue-500" />
        <StatCard title="Total Students" value="450" icon={Users} color="bg-purple-500" />
        <StatCard title="Faculty Load" value="18 hrs/wk" icon={FileText} color="bg-orange-500" />
      </div>

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold mb-6">Attendance vs Results</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="results" fill="#8b5cf6" name="Avg Results %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DepartmentReports;
