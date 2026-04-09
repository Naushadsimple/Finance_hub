import { useServices } from '../hooks/useServices'
import { TrendingUp, PieChart, ShieldCheck, ArrowUpRight, LayoutGrid, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicHeader from './PublicHeader'
import LeadForm from './LeadForm'
import Footer from './Footer'

const ICON_MAP = {
  TrendingUp: <TrendingUp />,
  PieChart: <PieChart />,
  ShieldCheck: <ShieldCheck />,
  ArrowUpRight: <ArrowUpRight />,
  LayoutGrid: <LayoutGrid />,
  CheckCircle2: <CheckCircle2 />,
}

export default function Services() {
  const { services, loading } = useServices()

  const scrollToLead = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <PublicHeader />

      {/* Hero Section */}
      <section style={{ padding: '120px 24px 80px', textAlign: 'center', background: 'linear-gradient(135deg, #F8FAFC, #EFF6FF)', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px' }}>Wealth Management</span>
          <h1 style={{ fontSize: '56px', fontWeight: 900, color: '#0F172A', marginTop: '16px', marginBottom: '24px', letterSpacing: '-1.5px' }}>
            Comprehensive <span style={{ color: '#0EA5E9' }}>Financial Solutions</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#64748B', lineHeight: 1.6 }}>
            Empowering individuals and businesses with secure, high-yield investment options designed for long-term growth.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '350px', borderRadius: '32px' }} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '48px' }}>
              {services.map((service) => (
                <div key={service.id} className="service-card" style={{ padding: '48px', background: '#FFFFFF', borderRadius: '40px', border: '1px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', transition: 'transform 0.3s' }}>
                  <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #0EA5E915, #0EA5E925)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '32px' }}>
                    {ICON_MAP[service.icon_name] || <LayoutGrid style={{ width: '36px', height: '36px' }} />}
                  </div>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '20px' }}>{service.title}</h3>
                  <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.8, marginBottom: '32px' }}>
                    {service.description}
                  </p>
                  <button onClick={scrollToLead} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', fontWeight: 800, textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                    Enquire Now <ArrowRight style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lead Form Integration */}
      <LeadForm />

      <Footer />
    </div>
  )
}
