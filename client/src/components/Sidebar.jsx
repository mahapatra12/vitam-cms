import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Calendar, FileText, Settings, LogOut, ShieldCheck, Bell, CheckCircle } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const role = user?.role || 'student';

  const links = {
    admin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Departments', path: '/admin/departments', icon: BookOpen },
      { name: 'Courses', path: '/admin/courses', icon: BookOpen },
      { name: 'Subjects', path: '/admin/subjects', icon: BookOpen },
      { name: 'Sessions', path: '/admin/sessions', icon: Calendar },
      { name: 'Announcements', path: '/admin/announcements', icon: FileText },
      { name: 'Reports', path: '/admin/reports', icon: FileText },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
    hod: [
      { name: 'Dashboard', path: '/hod', icon: LayoutDashboard },
      { name: 'Faculty', path: '/hod/faculty', icon: Users },
      { name: 'Students', path: '/hod/students', icon: Users },
      { name: 'Leave Requests', path: '/hod/leaves', icon: CheckSquare },
      { name: 'Allocation', path: '/hod/allocation', icon: BookOpen },
      { name: 'Announcements', path: '/hod/announcements', icon: Bell },
      { name: 'Reports', path: '/hod/reports', icon: FileText },
    ],
    faculty: [
      { name: 'Dashboard', path: '/faculty', icon: LayoutDashboard },
      { name: 'My Classes', path: '/faculty/classes', icon: BookOpen },
      { name: 'Attendance', path: '/faculty/attendance', icon: Calendar },
      { name: 'Enter Marks', path: '/faculty/marks', icon: FileText },
      { name: 'Uploads', path: '/faculty/uploads', icon: FileText },
      { name: 'Leave', path: '/faculty/leave', icon: Calendar },
    ],
    student: [
      { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
      { name: 'My Profile', path: '/student/profile', icon: Users },
      { name: 'My Subjects', path: '/student/subjects', icon: BookOpen },
      { name: 'Timetable', path: '/student/timetable', icon: Calendar },
      { name: 'Results', path: '/student/results', icon: FileText },
      { name: 'Attendance', path: '/student/attendance', icon: CheckCircle },
      { name: 'Downloads', path: '/student/downloads', icon: BookOpen },
      { name: 'Fee Management', path: '/student/fees', icon: FileText },
    ]
  };

  const currentLinks = links[role] || [];

  return (
    <div className="h-[96vh] w-72 glass flex flex-col p-6 fixed left-4 top-[2vh] z-50 shadow-2xl border border-white/10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <ShieldCheck className="text-white" size={26} />
        </div>
        <div>
          <h1 className="font-bold text-2xl tracking-tight">VITAM</h1>
          <p className="text-xs text-blue-300 font-medium uppercase tracking-widest">{role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {currentLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-white/15 text-white shadow-lg backdrop-blur-md border border-white/10' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon size={22} className={`transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-blue-300'}`} />
              <span className="font-medium text-[15px]">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-4 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 ring-2 ring-white/20"></div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-3.5 w-full rounded-2xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
