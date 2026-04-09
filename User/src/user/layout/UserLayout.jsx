import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import UserSidebar from './UserSidebar'
import { Menu } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile } = useAuthStore()

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-[260px]">
        {/* Top bar */}
        <header style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 30, 
          background: 'rgba(255,255,255,0.8)', 
          backdropFilter: 'blur(20px)', 
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)', 
          height: '72px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 32px' 
        }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden" style={{ padding: '8px', marginLeft: '-8px', color: '#1E293B', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Menu style={{ width: '24px', height: '24px' }} />
          </button>
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Authenticated as</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', background: '#F1F5F9', padding: '4px 12px', borderRadius: '8px' }}>{profile?.full_name || 'Member'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', marginRight: '4px' }} className="hidden sm:block">
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{profile?.full_name}</p>
              <p style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>Active Session</p>
            </div>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              background: 'linear-gradient(135deg, #0EA5E9, #2563EB)', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: '#FFFFFF', 
              fontSize: '16px', 
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
            }}>
              {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '32px', paddingBottom: '96px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
