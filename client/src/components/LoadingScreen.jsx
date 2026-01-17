import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping" />
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">
          V
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Vitam CMS</h2>
      <p className="text-blue-400 text-sm font-mono mb-8">Initializing Secure Environment...</p>

      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2 font-mono">{Math.round(progress)}%</p>
    </div>
  );
};

export default LoadingScreen;
