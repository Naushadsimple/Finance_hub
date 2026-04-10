import { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { Mail, Phone, MapPin, Hash, Calendar, Save, Loader2 } from 'lucide-react'

export default function Profile() {
  const { profile, loading: saving, error, updateProfile } = useProfile()
  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const startEdit = () => {
    setPhone(profile?.phone || '')
    setAddress(profile?.address || '')
    setEditing(true)
  }

  const handleSave = async () => {
    await updateProfile({ phone, address })
    setEditing(false)
  }

  if (!profile) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><div className="skeleton" style={{ height: '32px', width: '192px' }} /><div className="skeleton" style={{ height: '256px' }} /></div>
  }

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', marginBottom: '24px' }}>My Profile</h1>

      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '24px', fontWeight: 800, backdropFilter: 'blur(8px)' }}>
              {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ color: '#FFFFFF' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{profile.full_name}</h2>
              <p style={{ opacity: 0.8, fontSize: '14px' }}>{profile.client_code || 'FH-XXXXX'}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px' }} className="sm:p-8">
          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }} className="sm:grid-cols-2 sm:gap-6">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail style={{ width: '20px', height: '20px', color: '#64748B' }} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Email</p>
                <p style={{ fontWeight: 600, fontSize: '14px' }} className="sm:text-base">{profile.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone style={{ width: '20px', height: '20px', color: '#64748B' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Phone</p>
                {editing ? (
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
                ) : (
                  <p style={{ fontWeight: 600, fontSize: '14px' }} className="sm:text-base">{profile.phone || 'Not set'}</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }} className="sm:col-span-2">
              <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin style={{ width: '20px', height: '20px', color: '#64748B' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Address</p>
                {editing ? (
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'none' }} />
                ) : (
                  <p style={{ fontWeight: 600, fontSize: '14px' }} className="sm:text-base">{profile.address || 'Not set'}</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Hash style={{ width: '20px', height: '20px', color: '#64748B' }} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Client Code</p>
                <p style={{ fontWeight: 600, fontSize: '14px' }} className="sm:text-base">{profile.client_code || 'Pending'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar style={{ width: '20px', height: '20px', color: '#64748B' }} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Member Since</p>
                <p style={{ fontWeight: 600, fontSize: '14px' }} className="sm:text-base">{new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #E2E8F0' }}>
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                  {saving ? <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: '16px', height: '16px' }} />} Save Changes
                </button>
                <button onClick={() => setEditing(false)} style={{ padding: '10px 20px', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: 600, background: '#FFFFFF', cursor: 'pointer' }}>Cancel</button>
              </>
            ) : (
              <button onClick={startEdit} style={{ padding: '10px 20px', background: '#E0F2FE', color: '#0369A1', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
