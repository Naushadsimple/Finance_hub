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
      <section style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', position: 'relative', overflow: 'hidden', paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '0 20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#FFFFFF', borderRadius: '99px', border: '1px solid #E2E8F0', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0EA5E9' }} />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '1px' }}>Wealth Management</span>
          </div>
          <h1 style={{ fontSize: '46px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1.5px' }} className="sm:text-5xl lg:text-6xl">
            Comprehensive <span style={{ color: '#0EA5E9' }}>Financial</span> Solutions
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }} className="sm:text-lg">
            Empowering individuals and businesses with secure, high-yield investment options designed for long-term growth.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '80px 20px', background: '#FFFFFF' }} className="sm:py-24 sm:px-8">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} style={{ height: '320px', borderRadius: '24px', background: '#F1F5F9', animation: 'pulse 2s infinite' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={scrollToLead}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '32px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                  className="sm:p-10 hover:-translate-y-1 hover:shadow-lg hover:border-sky-200"
                >
                  {/* Icon */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    marginBottom: '24px',
                    boxShadow: '0 8px 20px rgba(14,165,233,0.2)',
                    flexShrink: 0
                  }}>
                    {ICON_MAP[service.icon_name] || <LayoutGrid />}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', letterSpacing: '-0.3px' }}>
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.75, marginBottom: '24px', flex: 1 }}>
                    {service.description}
                  </p>

                  {/* CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', fontWeight: 700, fontSize: '14px' }}>
                    <span>Enquire Now</span>
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lead Form */}
      <LeadForm />

      <Footer />
    </div>
  )
}
