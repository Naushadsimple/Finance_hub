import PublicHeader from './PublicHeader'
import HeroSection from './HeroSection'
import ServiceSection from './ServiceSection'
import InvestmentCalculator from './InvestmentCalculator'
import Testimonials from './Testimonials'
import LeadForm from './LeadForm'
import Footer from './Footer'
import { Shield, TrendingUp, BarChart3, Clock, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react'

import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function LandingPage() {
  const { session } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.state])

  if (session) {
    return <Navigate to="/user/dashboard" replace />
  }

  return (
    <div style={{ background: '#FFFFFF' }}>
      <PublicHeader />

      <HeroSection />

      {/* Trust Stats Section */}
      <section style={{ padding: '40px 20px', position: 'relative', marginTop: '-40px', zIndex: 30 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }} className="sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { label: 'Trust Score', value: '4.9/5', desc: 'TrustPilot' },
              { label: 'Total Assets', value: '\u20b9843Cr+', desc: 'Under Management' },
              { label: 'Active Users', value: '10,000+', desc: 'Investors' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                <p style={{ fontWeight: 900, color: '#0EA5E9' }} className="text-xl sm:text-3xl">{s.value}</p>
                <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginTop: '4px' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Services Section */}
      <ServiceSection />

      {/* Why Choose Us Section */}
      <section style={{ padding: '80px 20px', background: '#F8FAFC' }} className="sm:py-24 sm:px-8">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="sm:mb-16">
            <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px' }}>Why Finance Hub</span>
            <h2 style={{ fontWeight: 900, color: '#0F172A', marginTop: '12px', letterSpacing: '-1px' }} className="text-2xl sm:text-4xl">Designed for Secure Growth</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 lg:items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {[
                { icon: <Shield />, title: 'Bank-Grade Security', desc: 'Protected with industry-leading protocols.' },
                { icon: <Clock />, title: 'Real-time Tracking', desc: 'Monitor growth 24/7 through your dashboard.' },
                { icon: <TrendingUp />, title: 'Consistent Yields', desc: 'Enjoy guaranteed 12% annual returns.' },
                { icon: <Users />, title: 'Expert Support', desc: 'Advisors are always one click away.' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    padding: '24px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                  }}
                  className="sm:p-8 card-hover"
                >
                  <div className="icon-animate" style={{
                    width: '48px', height: '48px',
                    background: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
                    borderRadius: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF',
                    marginBottom: '16px',
                    boxShadow: '0 6px 16px rgba(14,165,233,0.2)'
                  }}>{item.icon}</div>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>{item.title}</h4>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }} className="lg:text-left">
              <h3 style={{ fontWeight: 900, color: '#0F172A', marginBottom: '20px', lineHeight: 1.3 }} className="text-2xl sm:text-3xl">We bridge the gap between <span style={{ color: '#0EA5E9' }}>Savings and Wealth</span>.</h3>
              <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.8, marginBottom: '28px' }}>
                Traditional saving methods are no longer enough. Finance Hub provides a secure, high-yield alternative that works for you.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'inline-flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }} className="lg:flex">
                {['Automated monthly payouts', 'Zero hidden fees', 'Full portfolio control', 'Transparent reporting'].map(text => (
                  <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#1E293B', fontWeight: 600 }}>
                    <div style={{ width: '24px', height: '24px', background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: '#22C55E' }} />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      <div id="calculator">
        <InvestmentCalculator />
      </div>

      <div id="lead-form">
        <LeadForm />
      </div>

      <Footer />
    </div>
  )
}
