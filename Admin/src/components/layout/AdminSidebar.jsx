import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuthStore } from '../../store/adminAuthStore'
import { LayoutDashboard, Users, Wallet, FileText, Mail, Settings, LogOut, ShieldCheck, X, LayoutGrid, MessageSquare } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/investments', icon: Wallet, label: 'Investments' },
  { to: '/certificates', icon: FileText, label: 'Certificates' },
  { to: '/leads', icon: Mail, label: 'Leads' },
  { to: '/services', icon: LayoutGrid, label: 'Services' },
  { to: '/tickets', icon: MessageSquare, label: 'Tickets' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { signOut } = useAdminAuthStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/sign-in')
  }

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
    borderRadius: '12px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    ...(isActive
      ? { background: 'rgba(14,165,233,0.12)', color: '#38BDF8', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.1)' }
      : { color: '#94A3B8' }
    ),
  })

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        onClick={onClose} 
        style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40,
          backdropFilter: 'blur(4px)',
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.4s'
        }} 
        className="lg:hidden"
      />

      <aside 
        style={{
          position: 'fixed', top: 0, left: 0, height: '100%', width: '280px',
          background: '#0F172A', zIndex: 50,
          display: 'flex', flexDirection: 'column',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }} 
        className={open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      >
        {/* Brand Section */}
        <div style={{ padding: '32px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.3)' }}>
              <ShieldCheck style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
            </div>
            <div>
              <p style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '18px', letterSpacing: '-0.5px', marginBottom: '-2px' }}>Finance Hub</p>
              <p style={{ fontSize: '11px', fontWeight: 600, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Dashboard</p>
            </div>
            <button onClick={onClose} className="lg:hidden" style={{ marginLeft: 'auto', padding: '8px', color: '#94A3B8', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: '0 16px', overflowY: 'auto', marginTop: '8px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', padding: '0 12px 16px' }}>Main Navigation</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={onClose} style={({ isActive }) => linkStyle(isActive)}>
                {({ isActive }) => (
                  <>
                    <item.icon style={{ width: '20px', height: '20px', transition: 'transform 0.3s' }} className={isActive ? 'scale-110' : ''} />
                    <span>{item.label}</span>
                    {isActive && <div style={{ position: 'absolute', right: '0', top: '20%', bottom: '20%', width: '3px', background: '#0EA5E9', borderRadius: '4px 0 0 4px' }} />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profile & Sign Out Section */}
        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.1)' }}>
          <button 
            onClick={handleSignOut} 
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
              borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#F87171', 
              background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', 
              cursor: 'pointer', width: '100%', transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} /> 
            Sign Out Account
          </button>
        </div>
      </aside>
    </>
  )
}
