import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Shield, Check } from 'lucide-react';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const setup2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/2fa/setup', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQrCode(res.data.qrCode);
      setSecret(res.data.secret);
    } catch (err) {
      console.error(err);
    }
  };

  const verify2FA = async () => {
    try {
      const authToken = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/2fa/verify', { token }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setMessage('2FA Enabled Successfully!');
      setQrCode(null);
    } catch (err) {
      setMessage('Invalid Token');
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
      
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Shield className="text-blue-400" size={24} />
          </div>
          <div>
            <p className="font-bold">Two-Factor Authentication</p>
            <p className="text-sm text-text-secondary">Secure your account with Google Authenticator</p>
          </div>
        </div>
        <button 
          onClick={setup2FA}
          className="btn-primary"
        >
          {user?.isTwoFactorEnabled ? 'Re-configure' : 'Enable 2FA'}
        </button>
      </div>

      {qrCode && (
        <div className="mt-6 p-6 bg-white rounded-xl text-center text-black">
          <p className="mb-4 font-medium">Scan this QR Code with your Authenticator App</p>
          <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4 w-48 h-48" />
          <p className="text-sm text-gray-500 mb-4">Secret: {secret}</p>
          
          <div className="max-w-xs mx-auto flex gap-2">
            <input 
              type="text" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter Code"
              className="bg-gray-100 border-gray-300 text-black"
            />
            <button onClick={verify2FA} className="bg-green-500 text-white px-4 rounded-xl">
              <Check size={20} />
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-4 p-3 bg-green-500/20 text-green-300 rounded-xl text-center">
          {message}
        </div>
      )}
    </div>
  );
};

export default Settings;
