import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Shield, Award } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-bold text-xl text-white">V</span>
          </div>
          <span className="text-xl font-bold tracking-tight">VITAM CMS</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <Link to="/login" className="btn-primary px-6 py-2.5 flex items-center gap-2">
          Login <ArrowRight size={18} />
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Admissions Open 2025</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Campus Management
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Experience a seamless educational ecosystem. From admissions to alumni, 
            VITAM CMS powers the next generation of academic excellence with 
            advanced security and intuitive design.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
            <Link to="/login" className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors text-lg">
              Get Started
            </Link>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-lg font-medium backdrop-blur-md">
              View Prospectus
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Shield, title: 'Military-Grade Security', desc: 'Protected by 3-Layer Multi-Factor Authentication and advanced encryption.' },
            { icon: Users, title: 'Seamless Collaboration', desc: 'Integrated portals for Students, Faculty, and Administration.' },
            { icon: Award, title: 'Academic Excellence', desc: 'Real-time tracking of grades, attendance, and performance analytics.' }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 hover:bg-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="font-bold text-white">V</span>
            </div>
            <span className="font-bold text-gray-300">VITAM CMS</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 VITAM College of Engineering. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
