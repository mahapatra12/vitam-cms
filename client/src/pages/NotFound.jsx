import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      
      <h1 className="text-6xl font-bold text-white mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-400 mb-6">Page Not Found</h2>
      
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link to="/" className="btn-primary flex items-center gap-2">
        <Home size={20} /> Return Home
      </Link>
    </div>
  );
};

export default NotFound;
