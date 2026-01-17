import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Setup2FA.css';

const Setup2FA = () => {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthenticatorSetup();
  }, []);

  const fetchAuthenticatorSetup = async () => {
    const apiUrl = 'http://localhost:5000/api/auth/authenticator/setup';
    console.log('Fetching setup from:', apiUrl);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
      setSetupComplete(response.data.setupComplete);
      setLoading(false);
    } catch (err) {
      console.error('Setup Error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load authenticator setup');
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    alert('Secret copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="setup-2fa-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="setup-2fa-container">
      <div className="setup-2fa-card">
        <div className="setup-header">
          <h1>🔐 Two-Factor Authentication Setup</h1>
          {setupComplete && (
            <span className="badge-success">✓ Already Configured</span>
          )}
        </div>

        {error && (
          <div className="error-message flex flex-col items-center gap-2">
            <span>{error}</span>
            <button 
              onClick={() => { setLoading(true); setError(''); fetchAuthenticatorSetup(); }}
              className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-sm"
            >
              Retry
            </button>
          </div>
        )}

        <div className="setup-content">
          <div className="step">
            <h2>Step 1: Download an Authenticator App</h2>
            <p>Install one of these apps on your mobile device:</p>
            <ul className="app-list">
              <li>📱 Google Authenticator (Android/iOS)</li>
              <li>🔷 Microsoft Authenticator (Android/iOS/Windows)</li>
              <li>🍎 Apple Authenticator (iOS only)</li>
              <li>🔓 Authy (Android/iOS)</li>
            </ul>
          </div>

          <div className="step">
            <h2>Step 2: Scan QR Code</h2>
            <p>Open your authenticator app and scan this QR code:</p>
            <div className="qr-code-container">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="qr-code" />
              ) : (
                <div className="qr-placeholder">QR Code not available</div>
              )}
            </div>
          </div>

          <div className="step">
            <h2>Step 3: Manual Entry (Alternative)</h2>
            <p>If you can't scan the QR code, enter this secret manually:</p>
            <div className="secret-container">
              <code className="secret-code">{secret}</code>
              <button onClick={copySecret} className="btn-copy">
                📋 Copy
              </button>
            </div>
          </div>

          <div className="step">
            <h2>Step 4: Verify Setup</h2>
            <p>
              During your next login, you'll be asked to enter codes from:
            </p>
            <ul className="verification-list">
              <li>✉️ Email OTP (sent to your email)</li>
              <li>📱 SMS OTP (sent to your phone)</li>
              <li>🔐 Authenticator App (6-digit code)</li>
            </ul>
          </div>

          <div className="important-note">
            <h3>⚠️ Important</h3>
            <p>
              Keep your authenticator app safe. If you lose access to it, you
              won't be able to log in. Contact your administrator if you need
              to reset your 2FA.
            </p>
          </div>

          <div className="action-buttons">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              {setupComplete ? 'Back to Dashboard' : 'I\'ve Set It Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup2FA;
