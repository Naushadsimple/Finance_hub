import { useEffect, useRef } from 'react'
import { TrendingUp, Shield, BarChart3, ArrowRight, CheckCircle2, Star, Users, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

export default function HeroSection() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      })
      gsap.from('.floating-card', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        stagger: 0.3,
        ease: 'back.out(1.7)'
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const stats = [
    { icon: <Users />, label: 'Happy Clients', value: '10k+' },
    { icon: <TrendingUp />, label: 'Returns p.a.', value: '12% Fixed' },
    { icon: <Shield />, label: 'Asset Security', value: '100%' },
  ]

  return (
    <div ref={containerRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', position: 'relative', overflow: 'hidden', padding: '100px 24px 60px' }}>
      {/* Abstract Background Shapes */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, #0EA5E915 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '30%', height: '30%', background: 'radial-gradient(circle, #0EA5E910 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px', alignItems: 'center' }}>
        
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#FFFFFF', borderRadius: '99px', border: '1px solid #E2E8F0', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '1px' }}>Rated 4.9/5 by Investors</span>
          </div>

          <h1 style={{ fontSize: '72px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px' }}>
            Smart Wealth <br />
            <span style={{ color: '#0EA5E9' }}>Management</span> for a <br />
            Secure Future
          </h1>

          <p style={{ fontSize: '20px', color: '#64748B', lineHeight: 1.6, marginBottom: '40px', maxWidth: '600px' }}>
            Invest in expert-curated portfolios with <b>12% Fixed Annual Returns</b>. No market volatility, just consistent growth powered by strategic asset management.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
            <Link to="/sign-up" style={{ padding: '18px 36px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '16px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(14,165,233,0.3)' }}>
              Start Investing <ArrowRight style={{ width: '20px', height: '20px' }} />
            </Link>
            <Link to="/services" style={{ padding: '18px 36px', background: '#FFFFFF', color: '#1E293B', borderRadius: '16px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '1px solid #E2E8F0' }}>
              Explore Services
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '32px' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>{s.value}</p>
                <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Main Illustration Area */}
          <div style={{ background: '#FFFFFF', borderRadius: '40px', padding: '40px', border: '1px solid #E2E8F0', boxShadow: '0 40px 80px rgba(0,0,0,0.06)', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#0EA5E9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <TrendingUp />
                </div>
                <h3 style={{ fontWeight: 800, color: '#0F172A' }}>Performance Overview</h3>
              </div>
              <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>+12% P.A</div>
            </div>
            
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
              {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? '#0EA5E9' : '#E2E8F0', borderRadius: '6px' }} />
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Monthly Yield</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>1.0% Fixed</p>
              </div>
              <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Safety Score</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#0EA5E9' }}>99/100</p>
              </div>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="floating-card" style={{ position: 'absolute', top: '-30px', right: '-40px', background: '#FFFFFF', padding: '20px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', zIndex: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', background: '#DCFCE7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                <CheckCircle2 style={{ width: '18px', height: '18px' }} />
              </div>
              <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Auto-payout Enabled</span>
            </div>
          </div>

          <div className="floating-card" style={{ position: 'absolute', bottom: '-20px', left: '-40px', background: '#0F172A', padding: '20px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', color: '#FFFFFF', zIndex: 20 }}>
             <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>Live AUM</p>
             <p style={{ fontSize: '20px', fontWeight: 800 }}>₹843.5 Crore</p>
          </div>
        </div>

      </div>
    </div>
  )
}
