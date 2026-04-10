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
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E2E8F0' }}>
      <div className="sm:px-6" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.2)' }}>
              <TrendingUp style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
            </div>
            <span className="sm:text-xl" style={{ fontSize: '19px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>Finance Hub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex lg:gap-8 gap-[32px] items-center">
            <Link to="/services" style={{ textDecoration: 'none', fontSize: '14px', fontWeight: 600, color: '#64748B', transition: 'color 0.2s' }} className="hover:text-[#0EA5E9]">Services</Link>
            <button onClick={() => handleNavClick('calculator')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#64748B' }} className="hover:text-[#0EA5E9]">Calculator</button>
            <button onClick={() => handleNavClick('lead-form')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#64748B' }} className="hover:text-[#0EA5E9]">Get Started</button>
    <Link to="/sign-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 20px rgba(14,165,233,0.3)', transition: 'all 0.2s' }} className="hover:scale-105 active:scale-95">
      <LogIn style={{ width: '18px', height: '18px' }} /> Sign In
    </Link>
          </nav>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(true)} className="md:hidden active:bg-slate-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#1E293B', cursor: 'pointer', padding: '10px', borderRadius: '12px', transition: 'all 0.2s' }}>
            <Menu style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div 
        onClick={() => setMenuOpen(false)}
        style={{ 
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', 
          backdropFilter: 'blur(2px)', zIndex: 9998,
          opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* Mobile Sidebar */}
      <aside style={{ 
        position: 'fixed', top: 0, right: 0, width: '280px', height: '100dvh', 
        background: '#FFFFFF', zIndex: 9999, padding: '24px',
        boxShadow: '-10px 0 50px rgba(0,0,0,0.15)',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
        visibility: menuOpen ? 'visible' : 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
            </div>
            <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '16px' }}>Finance Hub</span>
          </div>
          <button onClick={() => setMenuOpen(false)} style={{ background: '#F1F5F9', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#64748B' }}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} className="flex-1">
          {[
            { label: 'Services', to: '/services', type: 'link' },
            { label: 'Calculator', id: 'calculator', type: 'scroll' },
            { label: 'Get Started', id: 'lead-form', type: 'scroll' },
          ].map((item) => (
            item.type === 'link' ? (
              <Link 
                key={item.label} to={item.to} 
                onClick={() => setMenuOpen(false)} 
                style={{ 
                  padding: '14px 16px', borderRadius: '12px', fontSize: '15px', 
                  fontWeight: 600, color: '#334155', textDecoration: 'none', 
                  background: location.pathname === item.to ? '#F1F5F9' : 'transparent',
                  transition: 'background 0.2s'
                }}
                className="hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ) : (
              <button 
                key={item.label} 
                onClick={() => handleNavClick(item.id)} 
                style={{ 
                  textAlign: 'left', padding: '14px 16px', borderRadius: '12px', 
                  fontSize: '15px', fontWeight: 600, color: '#334155', 
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                className="hover:bg-slate-50"
              >
                {item.label}
              </button>
            )
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <Link 
            to="/sign-in" 
            onClick={() => setMenuOpen(false)} 
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              gap: '10px', padding: '16px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', 
              color: '#FFFFFF', borderRadius: '16px', fontSize: '15px', 
              fontWeight: 700, textDecoration: 'none', 
              boxShadow: '0 8px 20px rgba(14,165,233,0.3)' 
            }}
          >
            <LogIn style={{ width: '18px', height: '18px' }} /> Sign In
          </Link>
        </div>
      </aside>
    </header>
  )
}
