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

      {/* Trust & Stats Section */}
      <section style={{ padding: '40px 24px', position: 'relative', marginTop: '-40px', zIndex: 30 }}>
         <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', border: '1px solid #F1F5F9' }}>
            {[
              { label: 'Trust Score', value: '4.9/5', desc: 'Verified by TrustPilot' },
              { label: 'Total Assets', value: '₹843Cr+', desc: 'Under Management' },
              { label: 'Return Rate', value: '12%', desc: 'Fixed Annual Yield' },
              { label: 'Active Users', value: '10,000+', desc: 'Wealth Builders' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px', fontWeight: 600 }}>{s.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 900, color: '#0EA5E9' }}>{s.value}</p>
                <p style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginTop: '2px' }}>{s.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Dynamic Services Section */}
      <ServiceSection />

      {/* Why Choose Us Section */}
      <section style={{ padding: '100px 24px', background: '#F8FAFC' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
               <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Why Finance Hub</span>
               <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A', marginTop: '12px' }}>Designed for Secure Growth</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {[
                    { icon: <Shield />, title: 'Bank-Grade Security', desc: 'Your assets are protected with industry-leading security protocols.' },
                    { icon: <Clock />, title: 'Real-time Tracking', desc: 'Monitor your portfolio growth 24/7 through our intuitive dashboard.' },
                    { icon: <TrendingUp />, title: 'Consistent Yields', desc: 'Enjoy guaranteed 12% annual returns on your investments.' },
                    { icon: <Users />, title: 'Expert Support', desc: 'Our financial advisors are always one click away to help you.' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '32px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                       <div style={{ color: '#0EA5E9', marginBottom: '16px' }}>{item.icon}</div>
                       <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>{item.title}</h4>
                       <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  ))}
               </div>
               <div style={{ padding: '40px' }}>
                  <h3 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', marginBottom: '24px', lineHeight: 1.3 }}>We bridge the gap between <span style={{ color: '#0EA5E9' }}>Savings and Wealth</span>.</h3>
                  <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.8, marginBottom: '32px' }}>
                    Traditional saving methods are no longer enough to keep up with inflation. Finance Hub provides a secure, high-yield alternative that works for you. Our expert team manages complex market dynamics while you enjoy fixed, predictable returns.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {['Automated monthly payouts', 'Zero hidden maintenance fees', 'Full control over your portfolio', 'Transparent reporting systems'].map(text => (
                      <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#1E293B', fontWeight: 600 }}>
                        <div style={{ color: '#22C55E' }}><CheckCircle2 style={{ width: '20px', height: '20px' }} /></div> {text}
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
