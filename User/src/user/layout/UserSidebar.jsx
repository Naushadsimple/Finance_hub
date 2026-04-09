import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { TrendingUp, LayoutDashboard, Wallet, FileText, User, HelpCircle, LogOut, X } from 'lucide-react'

const navItems = [
  { to: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/user/investments', icon: Wallet, label: 'My Investments' },
  { to: '/user/certificates', icon: FileText, label: 'Certificates' },
  { to: '/user/support', icon: HelpCircle, label: 'Support' },
]

export default function UserSidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    navigate('/sign-in')
  }

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
    borderRadius: '12px', fontSize: '14px', fontWeight: 500, textDecoration: 'none',
    transition: 'all 0.2s',
    ...(isActive
      ? { background: '#E0F2FE', color: '#0369A1' }
      : { color: '#64748B' }
    ),
  })

  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} className="lg:hidden" />}

      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100%', width: '260px',
        background: '#FFFFFF', borderRight: '1px solid #E2E8F0', zIndex: 50,
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.3s',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
      }} className="lg:!translate-x-0">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', padding: '0 20px', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
            </div>
            <span style={{ fontWeight: 700, color: '#1E293B' }}>Finance Hub</span>
          </div>
          <button onClick={onClose} className="lg:hidden" style={{ padding: '4px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={onClose} style={({ isActive }) => linkStyle(isActive)}>
              <item.icon style={{ width: '20px', height: '20px' }} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/user/profile" onClick={onClose} style={({ isActive }) => linkStyle(isActive)}>
            <User style={{ width: '20px', height: '20px' }} /> Profile
          </NavLink>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <LogOut style={{ width: '20px', height: '20px' }} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFFFFF', borderTop: '1px solid #E2E8F0', zIndex: 40, display: 'flex' }}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 0', fontSize: '12px', fontWeight: 500, textDecoration: 'none', color: isActive ? '#0EA5E9' : '#64748B' })}>
            <item.icon style={{ width: '20px', height: '20px' }} />
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/user/profile" style={({ isActive }) => ({ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '10px 0', fontSize: '12px', fontWeight: 500, textDecoration: 'none', color: isActive ? '#0EA5E9' : '#64748B' })}>
          <User style={{ width: '20px', height: '20px' }} /> Profile
        </NavLink>
      </div>
    </>
  )
}
