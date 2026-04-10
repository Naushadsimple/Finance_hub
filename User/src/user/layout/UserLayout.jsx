import { useState } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { Menu, LogOut, LayoutDashboard, Wallet, FileText, HelpCircle, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useToastStore } from '../../store/toastStore'

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuthStore()
  const navigate = useNavigate()
  const addToast = useToastStore((s) => s.addToast)

  const handleSignOut = async () => {
    try {
      await signOut()
      addToast('Logged out successfully', 'info')
      navigate('/')
    } catch (error) {
      addToast(error.message, 'error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '72px' }}>
      {/* Sidebar removed as requested, using bottom nav instead */}

      {/* Main content */}
      <div className="w-full">
        {/* Top bar */}
        <header style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 30, 
          background: 'rgba(255,255,255,0.9)', 
          backdropFilter: 'blur(20px)', 
          borderBottom: '1px solid #E2E8F0', 
          height: '72px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 24px'
        }}> 
          {/* Menu button hidden as sidebar is removed */}
          
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>Authenticated as</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', background: '#F1F5F9', padding: '4px 12px', borderRadius: '8px' }}>{profile?.full_name || 'Member'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="sm:gap-5">
            <div style={{ textAlign: 'right', marginRight: '4px' }} className="hidden sm:block">
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{profile?.full_name}</p>
              <p style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, marginTop: '4px' }}>Active Session</p>
            </div>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #0EA5E9, #2563EB)', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#FFFFFF', 
                fontSize: '14px', 
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)'
              }} className="sm:w-11 sm:h-11 sm:text-base sm:rounded-14">
                {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button 
                onClick={handleSignOut}
                title="Sign Out"
                style={{ 
                  padding: '8px', 
                  background: '#FEF2F2', 
                  border: '1px solid #FEE2E2', 
                  borderRadius: '10px', 
                  color: '#EF4444', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                className="sm:p-2.5 sm:rounded-12"
                onMouseOver={(e) => e.currentTarget.style.background = '#FEE2E2'}
                onMouseOut={(e) => e.currentTarget.style.background = '#FEF2F2'}
              >
                <LogOut style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '24px 16px' }} className="sm:p-8 lg:p-10">
          <Outlet />
        </main>

        {/* New Bottom Navigation Bar */}
        <nav style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: '#FFFFFF', 
          borderTop: '1px solid #E2E8F0', 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-around',
          zIndex: 100,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.03)'
        }}>
          {[
            { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/user/investments', icon: Wallet, label: 'Investments' },
            { to: '/user/certificates', icon: FileText, label: 'Certificates' },
            { to: '/user/support', icon: HelpCircle, label: 'Support' },
            { to: '/user/profile', icon: User, label: 'Profile' },
          ].map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                color: isActive ? '#0EA5E9' : '#64748B',
                transition: 'color 0.2s'
              })}
            >
              <item.icon style={{ width: '20px', height: '20px' }} />
              <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
