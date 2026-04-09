import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { Menu, Bell } from 'lucide-react'
import { useAdminAuthStore } from '../../store/adminAuthStore'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile } = useAdminAuthStore()

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div 
        style={{ 
          marginLeft: window.innerWidth > 1024 ? '280px' : '0', 
          transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }} 
        className="lg:!ml-[280px]"
      >
        <header style={{ 
          position: 'sticky', top: 0, zIndex: 30, 
          background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', 
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)', 
          height: '72px', display: 'flex', alignItems: 'center', 
          justifyContent: 'space-between', padding: '0 32px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ padding: '10px', marginLeft: '-10px', color: '#1E293B', background: '#F1F5F9', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
            <Menu style={{ width: '20px', height: '20px' }} />
          </button>
          
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>System Status:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#DCFCE7', color: '#16A34A', borderRadius: '999px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
              <div style={{ width: '6px', height: '6px', background: '#16A34A', borderRadius: '50%', boxShadow: '0 0 8px rgba(22, 163, 74, 0.5)' }} />
              Live & Secure
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ padding: '10px', color: '#64748B', background: '#F1F5F9', border: 'none', borderRadius: '12px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
              <Bell style={{ width: '20px', height: '20px' }} />
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '6px', height: '6px', background: '#F43F5E', borderRadius: '50%', border: '2px solid #FFFFFF' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 6px 6px 16px', background: '#F1F5F9', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', lineHeight: '1' }}>{profile?.full_name || 'Admin'}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'capitalize' }}>{profile?.role || 'Administrator'}</span>
              </div>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '15px', fontWeight: 800, boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}>
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main style={{ padding: '32px', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
