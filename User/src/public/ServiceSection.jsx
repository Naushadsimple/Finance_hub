import { useServices } from '../hooks/useServices'
import { TrendingUp, PieChart, ShieldCheck, ArrowUpRight, LayoutGrid, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON_MAP = {
  TrendingUp: <TrendingUp />,
  PieChart: <PieChart />,
  ShieldCheck: <ShieldCheck />,
  ArrowUpRight: <ArrowUpRight />,
  LayoutGrid: <LayoutGrid />,
  CheckCircle2: <CheckCircle2 />,
}

export default function ServiceSection() {
  const { services, loading } = useServices()

  if (loading) return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3].map(i => <div key={i} style={{ height: '280px', borderRadius: '24px', background: '#F1F5F9' }} />)}
      </div>
    </div>
  )

  return (
    <section style={{ padding: '80px 20px', background: '#FFFFFF' }} className="sm:py-24 sm:px-8">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }} className="sm:mb-16">
          <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px' }}>What We Offer</span>
          <h2 style={{ fontWeight: 900, color: '#0F172A', marginTop: '12px', letterSpacing: '-1px' }} className="text-2xl sm:text-4xl">Financial Solutions for Everyone</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 ql-snow">
          {services.slice(0, 3).map((service) => {
            return (
              <Link to={`/services/${service.slug}`} key={service.id} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    padding: '32px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  className="sm:p-10 card-hover group"
                >
                  {/* Icon */}
                  <div className="icon-animate" style={{
                    width: '56px', height: '56px',
                    background: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#FFFFFF',
                    marginBottom: '24px',
                    boxShadow: '0 8px 20px rgba(14,165,233,0.2)',
                    flexShrink: 0
                  }}>
                    {ICON_MAP[service.icon_name] || <LayoutGrid />}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>{service.title}</h3>

                  {/* Description */}
                  <div 
                    className="ql-editor"
                    style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, marginBottom: '20px', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', padding: 0 }}
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />

                  {/* CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', fontWeight: 700, fontSize: '14px' }}>
                    View Details <ArrowRight className="group-hover:translate-x-1 transition-transform" style={{ width: '16px', height: '16px' }} />
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
