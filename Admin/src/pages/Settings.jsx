import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Settings as SettingsIcon, Save, Shield, Bell, Globe, Percent } from 'lucide-react'

export default function Settings() {
  const [monthlyRate, setMonthlyRate] = useState('1.00')
  const [companyName, setCompanyName] = useState('Finance Hub')
  const [supportEmail, setSupportEmail] = useState('support@financehub.com')
  const [saved, setSaved] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [updatingPass, setUpdatingPass] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Settings</h1>
        <p style={{ color: '#64748B' }}>Platform configuration and preferences</p>
      </div>

      {saved && (
        <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
          Settings saved successfully!
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Business Settings */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', background: '#E0F2FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe style={{ width: '20px', height: '20px', color: '#0EA5E9' }} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Business Settings</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Company Name</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Support Email</label>
              <input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} type="email" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Investment Settings */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', background: '#DCFCE7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Percent style={{ width: '20px', height: '20px', color: '#22C55E' }} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Investment Settings</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Monthly Interest Rate (%)</label>
              <input value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} type="number" step="0.01" style={inputStyle} />
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Annual Rate: {(parseFloat(monthlyRate) * 12).toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* Security & Credentials */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', background: '#F3E8FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield style={{ width: '20px', height: '20px', color: '#9333EA' }} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Security & Credentials</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>Update Admin Password</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="password" 
                  placeholder="New password (min 6 chars)" 
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  style={inputStyle} 
                />
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  style={inputStyle} 
                />
                <button 
                  disabled={updatingPass}
                  onClick={async () => {
                    if (!newPass || newPass.length < 6) return alert('Password must be at least 6 characters');
                    if (newPass !== confirmPass) return alert('Passwords do not match');
                    
                    setUpdatingPass(true);
                    const { error } = await supabase.auth.updateUser({ password: newPass });
                    setUpdatingPass(false);
                    
                    if (error) alert(error.message);
                    else {
                      alert('Password updated successfully! Note: The "admin/admin" shortcut may no longer work.');
                      setNewPass('');
                      setConfirmPass('');
                    }
                  }}
                  style={{ 
                    padding: '12px', 
                    background: '#0F172A', 
                    color: '#FFFFFF', 
                    borderRadius: '12px', 
                    fontWeight: 700, 
                    border: 'none', 
                    cursor: 'pointer',
                    opacity: updatingPass ? 0.7 : 1
                  }}
                >
                  {updatingPass ? 'Updating...' : 'Update Password'}
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '12px', lineHeight: '1.4' }}>
                ⚠️ Warning: If you change this, the "admin / admin" quick-login will stop working and you must use your full email and the new password.
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', background: '#FEF3C7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
            </div>
            <h3 style={{ fontWeight: 700 }}>Notifications</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'New lead notifications', checked: true },
              { label: 'Investment maturity alerts', checked: true },
              { label: 'Support ticket updates', checked: false },
            ].map((item, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked={item.checked} style={{ width: '18px', height: '18px', accentColor: '#0EA5E9' }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          <Save style={{ width: '16px', height: '16px' }} /> Save Settings
        </button>
      </div>
    </div>
  )
}
