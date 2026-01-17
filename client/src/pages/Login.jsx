import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Lock, ArrowRight, Shield, Smartphone, Mail, ShieldCheck, Fingerprint } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // MFA States
  const [mfaMethod, setMfaMethod] = useState('authenticator');
  const [mfaCode, setMfaCode] = useState('');
  
  const [step, setStep] = useState(1); // 1: Login, 2: MFA
  const [tempToken, setTempToken] = useState(null);
  
  const { login, verifyMfa } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !email.trim()) {
      addToast('Please enter your email address', 'error');
      return;
    }
    
    if (!password || !password.trim()) {
      addToast('Please enter your password', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    
    try {
      const res = await login(email, password);
      if (res.requireMfa) {
        setTempToken(res.tempToken);
        setStep(2);
        addToast('Please complete 2-Factor Authentication', 'info');
      } else {
        addToast('Login Successful!', 'success');
        navigate(`/${res.role}`);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid credentials', 'error');
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyMfa(tempToken, mfaCode, mfaMethod);
      addToast('Identity Verified. Welcome back!', 'success');
      navigate(`/${res.role}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Verification Failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-sm" />
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[150px] animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/30 rounded-full blur-[150px] animate-float" style={{ animationDelay: '2s' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glass w-full max-w-[420px] relative z-10 p-8 border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40 ring-4 ring-white/10">
            <ShieldCheck className="text-white" size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">
            {step === 1 ? 'Welcome Back' : 'Security Check'}
          </h2>
          <p className="text-text-secondary text-lg font-light">
            {step === 1 ? 'Sign in to VITAM Portal' : 'Multi-Factor Authentication'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-tertiary ml-4 uppercase tracking-widest">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={22} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vitam.edu.in"
                  className="pl-14 h-14 bg-white/5 border-white/10 focus:bg-white/10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-tertiary ml-4 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={22} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-14 h-14 bg-white/5 border-white/10 focus:bg-white/10"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3 mt-8 h-14 text-lg">
              <span>Sign In</span>
              <ArrowRight size={22} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaVerify} className="space-y-5">
            
            {/* Method Selection Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
              <button
                type="button"
                onClick={() => setMfaMethod('authenticator')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mfaMethod === 'authenticator' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                App
              </button>
              <button
                type="button"
                onClick={() => setMfaMethod('email')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mfaMethod === 'email' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setMfaMethod('sms')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mfaMethod === 'sms' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                SMS
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-tertiary ml-4 uppercase tracking-widest">
                {mfaMethod === 'authenticator' && 'Authenticator Code'}
                {mfaMethod === 'email' && 'Email Verification Code'}
                {mfaMethod === 'sms' && 'SMS Verification Code'}
              </label>
              <div className="relative group">
                {mfaMethod === 'authenticator' && <ShieldCheck className="absolute left-5 top-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={22} />}
                {mfaMethod === 'email' && <Mail className="absolute left-5 top-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={22} />}
                {mfaMethod === 'sms' && <Smartphone className="absolute left-5 top-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={22} />}
                
                <input 
                  type="text" 
                  value={mfaCode} 
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000000"
                  className="pl-14 h-14 bg-white/5 border-white/10 focus:bg-white/10 tracking-widest font-mono text-xl"
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 ml-4">
                {mfaMethod === 'authenticator' && 'Enter the 6-digit code from your Google Authenticator app.'}
                {mfaMethod === 'email' && 'Enter the code sent to your registered email address.'}
                {mfaMethod === 'sms' && 'Enter the code sent to your registered mobile number.'}
              </p>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3 mt-8 h-14 text-lg">
              <span>Verify Identity</span>
              <ShieldCheck size={22} />
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
