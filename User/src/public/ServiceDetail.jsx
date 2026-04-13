import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { TrendingUp, PieChart, ShieldCheck, ArrowUpRight, LayoutGrid, CheckCircle2, ChevronLeft, ArrowRight } from 'lucide-react'
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

export default function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchService() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .single()
        
        if (error) throw error
        setService(data)
      } catch (err) {
        console.error('Error fetching service:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchService()
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #0EA5E9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  if (!service) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Service not found</h2>
        <Link to="/services" style={{ padding: '10px 20px', background: '#0EA5E9', color: '#fff', borderRadius: '10px', textDecoration: 'none' }}>Back to Services</Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <PublicHeader />

      <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <Link to="/services" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              <ChevronLeft style={{ width: '16px', height: '16px' }} /> Back to Services
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', alignItems: 'center', marginBottom: '48px' }} className="flex flex-col sm:grid">
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 12px 24px rgba(14,165,233,0.3)' }}>
              {ICON_MAP[service.icon_name] || <LayoutGrid style={{width: '32px', height: '32px'}} />}
            </div>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', marginBottom: '8px', letterSpacing: '-1px' }}>{service.title}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, background: '#F0F9FF', color: '#0EA5E9', padding: '4px 12px', borderRadius: '99px', textTransform: 'uppercase' }}>Financial Service</span>
                <span style={{ fontSize: '12px', fontWeight: 700, background: '#DCFCE7', color: '#16A34A', padding: '4px 12px', borderRadius: '99px', textTransform: 'uppercase' }}>Active Growth</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ background: '#F8FAFC', borderRadius: '32px', border: '1px solid #E2E8F0', padding: '48px', overflow: 'hidden' }} className="p-6 sm:p-12 ql-snow">
            <div 
              className="ql-editor"
              style={{ fontSize: '18px', color: '#1E293B', lineHeight: 1.8, padding: 0 }}
              dangerouslySetInnerHTML={{ __html: service.description }} 
            />
            
            <div style={{ marginTop: '48px', paddingTop: '48px', borderTop: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>Ready to get started with {service.title}?</h3>
              <p style={{ color: '#64748B', marginBottom: '32px' }}>Our experts will guide you through the process and help you maximize your returns.</p>
              
              <button 
                onClick={() => document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', 
                  background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', 
                  borderRadius: '16px', fontSize: '16px', fontWeight: 700, border: 'none', 
                  cursor: 'pointer', boxShadow: '0 12px 24px rgba(14,165,233,0.3)' 
                }}
              >
                Inquire Now <ArrowRight style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>

        </div>
      </main>

      <div id="lead-form">
        <LeadForm />
      </div>

      <Footer />
    </div>
  )
}
