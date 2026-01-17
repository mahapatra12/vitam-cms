import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { setupSessionTimeout, clearSessionTimeout } from '../utils/sessionManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  // Session timeout management
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      const cleanup = setupSessionTimeout(
        // Warning callback (5 minutes before logout)
        () => {
          setShowSessionWarning(true);
        },
        // Logout callback (session expired)
        () => {
          logout();
          alert('Your session has expired due to inactivity. Please login again.');
          window.location.href = '/login';
        }
      );

      return cleanup;
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    if (res.data.requireMfa) {
      return { requireMfa: true, tempToken: res.data.tempToken };
    }
    // Should not happen given requirements, but fallback
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    setUser(res.data);
    return { success: true, role: res.data.role };
  };

  const verifyMfa = async (tempToken, codeOrSms, methodOrEmail, authCode) => {
    // Support both new (tempToken, code, method) and old (tempToken, sms, email, auth) signatures
    let payload = {};
    if (authCode) {
      // Old signature: verifyMfa(tempToken, smsCode, emailCode, authCode)
      payload = { tempToken, smsCode: codeOrSms, emailCode: methodOrEmail, authCode };
    } else {
      // New signature: verifyMfa(tempToken, code, method)
      payload = { tempToken, code: codeOrSms, method: methodOrEmail };
    }

    const res = await axios.post('http://localhost:5000/api/auth/mfa/verify', payload);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
    setUser(res.data);
    return { success: true, role: res.data.role };
  };

  const logout = () => {
    clearSessionTimeout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const extendSession = () => {
    setShowSessionWarning(false);
    // Activity will automatically reset the timeout
  };

  return (
    <AuthContext.Provider value={{ user, login, verifyMfa, logout, loading }}>
      {children}
      
      {/* Session Warning Modal */}
      {showSessionWarning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ color: '#f59e0b', marginBottom: '15px' }}>⏰ Session Expiring Soon</h2>
            <p style={{ marginBottom: '20px', color: '#4b5563' }}>
              Your session will expire in 5 minutes due to inactivity.
            </p>
            <button
              onClick={extendSession}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Stay Logged In
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
