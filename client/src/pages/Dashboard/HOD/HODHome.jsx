import AnnouncementsList from '../../../components/AnnouncementsList';
import StatCard from '../../../components/StatCard';
import { Users, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';

const HODHome = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Faculty" value="12" icon={Users} color="bg-purple-500" />
          <StatCard title="Total Students" value="450" icon={Users} color="bg-blue-500" />
          <StatCard title="Avg Attendance" value="87%" icon={TrendingUp} color="bg-green-500" />
          <StatCard title="Issues Reported" value="3" icon={AlertCircle} color="bg-red-500" />
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Department Overview</h2>
          <p className="text-text-secondary mb-6">
            Review the latest academic reports. Faculty meeting scheduled for Friday at 2 PM.
          </p>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AnnouncementsList />
      </div>
    </div>
  );
};

export default HODHome;
