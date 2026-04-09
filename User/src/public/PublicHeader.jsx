import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TrendingUp, LogIn, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B' }}>Finance Hub</span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/services" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>Services</Link>
            <button onClick={() => handleNavClick('calculator')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>Calculator</button>
            <button onClick={() => handleNavClick('lead-form')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#64748B' }}>Get Started</button>
            <Link to="/sign-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' }}>
              <LogIn style={{ width: '16px', height: '16px' }} /> Sign In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
