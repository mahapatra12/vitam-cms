import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Settings from '../../../components/Settings'; // Personal Security Settings
import { useToast } from '../../../context/ToastContext';
import { Settings as SettingsIcon, Shield, Globe, Mail, MessageSquare, AlertTriangle, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const [settings, setSettings] = useState({
    instituteName: '',
    instituteShortName: '',
    emailConfig: {
      host: '',
      port: 587,
      user: '',
      password: '',
      secure: false
    },
    smsConfig: {
      provider: 'twilio',
      apiKey: '',
      apiSecret: '',
      senderId: ''
    },
    maintenanceMode: false,
    maintenanceMessage: ''
  });

  useEffect(() => {
    if (activeTab === 'system') {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      showToast('Failed to fetch system settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/branding`, {
        instituteName: settings.instituteName,
        instituteShortName: settings.instituteShortName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('General settings updated', 'success');
    } catch (error) {
      showToast('Failed to update settings', 'error');
    }
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/email`, settings.emailConfig, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Email configuration updated', 'success');
    } catch (error) {
      showToast('Failed to update email config', 'error');
    }
  };

  const handleSaveSMS = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings/sms`, settings.smsConfig, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('SMS configuration updated', 'success');
    } catch (error) {
      showToast('Failed to update SMS config', 'error');
    }
  };

  const toggleMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/settings/maintenance`, {
        message: settings.maintenanceMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSettings(prev => ({
        ...prev,
        maintenanceMode: response.data.maintenanceMode
      }));
      
      showToast(`Maintenance mode ${response.data.maintenanceMode ? 'enabled' : 'disabled'}`, 'success');
    } catch (error) {
      showToast('Failed to toggle maintenance mode', 'error');
    }
  };

  return (
    <div className="system-settings p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-text-secondary mt-1">Manage system configuration and personal security</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0 space-y-2">
          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'system' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'hover:bg-white/5 text-text-secondary'
            }`}
          >
            <Globe size={20} />
            <span className="font-medium">System Config</span>
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'security' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'hover:bg-white/5 text-text-secondary'
            }`}
          >
            <Shield size={20} />
            <span className="font-medium">Personal Security</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'security' ? (
            <Settings />
          ) : (
            <div className="space-y-6">
              {/* General Settings */}
              <Card title="General Information" icon={<Globe className="text-blue-400" />}>
                <form onSubmit={handleSaveGeneral} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Institute Name</label>
                      <input 
                        type="text" 
                        value={settings.instituteName}
                        onChange={(e) => setSettings({...settings, instituteName: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Short Name (Acronym)</label>
                      <input 
                        type="text" 
                        value={settings.instituteShortName}
                        onChange={(e) => setSettings({...settings, instituteShortName: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" icon={<Save size={16} />}>Save Changes</Button>
                  </div>
                </form>
              </Card>

              {/* Email Config */}
              <Card title="Email Configuration" icon={<Mail className="text-green-400" />}>
                <form onSubmit={handleSaveEmail} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">SMTP Host</label>
                      <input 
                        type="text" 
                        value={settings.emailConfig?.host || ''}
                        onChange={(e) => setSettings({
                          ...settings, 
                          emailConfig: {...settings.emailConfig, host: e.target.value}
                        })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Port</label>
                      <input 
                        type="number" 
                        value={settings.emailConfig?.port || 587}
                        onChange={(e) => setSettings({
                          ...settings, 
                          emailConfig: {...settings.emailConfig, port: parseInt(e.target.value)}
                        })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Username</label>
                      <input 
                        type="text" 
                        value={settings.emailConfig?.user || ''}
                        onChange={(e) => setSettings({
                          ...settings, 
                          emailConfig: {...settings.emailConfig, user: e.target.value}
                        })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary">Password</label>
                      <input 
                        type="password" 
                        value={settings.emailConfig?.password || ''}
                        onChange={(e) => setSettings({
                          ...settings, 
                          emailConfig: {...settings.emailConfig, password: e.target.value}
                        })}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" icon={<Save size={16} />}>Save Config</Button>
                  </div>
                </form>
              </Card>

              {/* Maintenance Mode */}
              <Card title="Danger Zone" icon={<AlertTriangle className="text-red-400" />}>
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div>
                    <h4 className="font-bold text-red-200">Maintenance Mode</h4>
                    <p className="text-sm text-red-200/60">Disable access for all non-admin users</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="text" 
                      placeholder="Maintenance Message"
                      value={settings.maintenanceMessage || ''}
                      onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
                      className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-red-500 outline-none w-64"
                    />
                    <button 
                      onClick={toggleMaintenance}
                      className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                        settings.maintenanceMode 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {settings.maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
