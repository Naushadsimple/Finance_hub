import { useServices } from '../hooks/useServices'
import { TrendingUp, PieChart, ShieldCheck, ArrowUpRight, LayoutGrid, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON_MAP = {
  TrendingUp: <TrendingUp style={{ width: '32px', height: '32px' }} />,
  PieChart: <PieChart style={{ width: '32px', height: '32px' }} />,
  ShieldCheck: <ShieldCheck style={{ width: '32px', height: '32px' }} />,
  ArrowUpRight: <ArrowUpRight style={{ width: '32px', height: '32px' }} />,
  LayoutGrid: <LayoutGrid style={{ width: '32px', height: '32px' }} />,
  CheckCircle2: <CheckCircle2 style={{ width: '32px', height: '32px' }} />,
}

export default function ServiceSection() {
  const { services, loading } = useServices()

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', padding: '0 24px' }}>
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '24px' }} />)}
    </div>
  )

  return (
    <section style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>What We Offer</span>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A', marginTop: '12px' }}>Financial Solutions for Everyone</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {services.slice(0, 3).map((service) => {
            const truncateDescription = (text) => {
              const words = text.split(' ')
              if (words.length > 25) {
                return words.slice(0, 25).join(' ') + '...'
              }
              return text
            }

            return (
              <Link to="/services" key={service.id} style={{ textDecoration: 'none' }}>
                <div className="service-card" style={{ padding: '40px', background: '#FFFFFF', borderRadius: '32px', border: '1px solid #E2E8F0', transition: 'all 0.3s', cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ width: '60px', height: '60px', background: '#F0F9FF', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '24px' }}>
                    {ICON_MAP[service.icon_name] || <LayoutGrid style={{ width: '32px', height: '32px' }} />}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>{service.title}</h3>
                  <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
                    {truncateDescription(service.description)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', fontWeight: 700, fontSize: '14px' }}>
                    Explore Details <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
