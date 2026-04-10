import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useInvestments } from '../../hooks/useInvestments'
import { useAuthStore } from '../../store/authStore'
import { formatCurrency } from '../../utils/formatCurrency'
import { calculateMonthlyInterest, calculateAnnualInterest } from '../../utils/calculateInterest'
import { Wallet, TrendingUp, BarChart3, FileText, ArrowUpRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function UserDashboard() {
  const { profile } = useAuthStore()
  const { investments, totalPrincipal, activeInvestments, loading, refetch } = useInvestments()
  const dashRef = useRef(null)

  // Force refresh on mount as requested previously
  useEffect(() => {
    if (refetch) refetch()
  }, [])

  const monthlyInterest = calculateMonthlyInterest(totalPrincipal)
  const annualReturn = calculateAnnualInterest(totalPrincipal)

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from('.kpi-card', { 
          y: 20, 
          opacity: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'power2.out' 
        })
        gsap.from('.recent-section', { 
          y: 20, 
          opacity: 0, 
          duration: 0.8, 
          delay: 0.4, 
          ease: 'power2.out' 
        })
      }, dashRef)
      return () => ctx.revert()
    }
  }, [loading])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="skeleton" style={{ height: '32px', width: '256px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '140px', borderRadius: '24px' }} />)}
        </div>
        <div className="skeleton" style={{ height: '400px', borderRadius: '24px' }} />
      </div>
    )
  }

  const kpis = [
    { icon: Wallet, label: 'Total Principal', value: formatCurrency(totalPrincipal), color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
    { icon: TrendingUp, label: 'Monthly Interest', value: formatCurrency(monthlyInterest), color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
    { icon: BarChart3, label: 'Annual Projected', value: formatCurrency(annualReturn), color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
    { icon: FileText, label: 'Active Plans', value: activeInvestments.length, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  ]

  return (
    <div ref={dashRef} style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }} className="sm:text-3xl">Dashboard Overview</h1>
        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }} className="sm:text-15">Real-time summary of your financial portfolio.</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6 sm:mb-10">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card sm:p-7" style={{ 
            background: '#FFFFFF', 
            borderRadius: '24px', 
            padding: '24px', 
            border: '1px solid #E2E8F0', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', background: kpi.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="sm:w-13 sm:h-13 sm:rounded-16">
                <kpi.icon style={{ width: '22px', height: '22px', color: kpi.color }} className="sm:w-6 sm:h-6" />
              </div>
              <div style={{ padding: '8px', borderRadius: '12px', background: '#F8FAFC' }}>
                <ArrowUpRight style={{ width: '16px', height: '16px', color: '#94A3B8' }} />
              </div>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }} className="sm:text-14">{kpi.label}</p>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0 }} className="sm:text-28">{kpi.value}</h2>
            </div>
            {/* Subtle Gradient decoration */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '100px', height: '100px', background: kpi.bg, filter: 'blur(40px)', opacity: 0.5, borderRadius: '50%' }} />
          </div>
        ))}
      </div>

      {/* Recent Investments Section */}
      <div className="recent-section" style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="sm:p-6 sm:px-8">
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }} className="sm:text-18">Recent Investments</h2>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }} className="sm:text-13">Latest updates from your portfolio</p>
          </div>
          <Link to="/user/investments" style={{ 
            padding: '8px 16px', 
            background: '#F1F5F9', 
            color: '#0F172A', 
            borderRadius: '10px', 
            fontSize: '13px', 
            fontWeight: 700, 
            textDecoration: 'none',
            transition: 'all 0.2s'
          }} className="sm:px-5 sm:py-2.5 sm:rounded-12 sm:text-14">
            View All
          </Link>
        </div>

        <div style={{ padding: '8px' }} className="sm:p-3">
          {investments.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }} className="sm:py-20 sm:px-8">
              <div style={{ width: '64px', height: '64px', background: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Wallet style={{ width: '32px', height: '32px', color: '#E2E8F0' }} />
              </div>
              <p style={{ color: '#64748B', fontWeight: 500 }}>No active investments found.</p>
              <Link to="/user/support" style={{ color: '#0EA5E9', fontSize: '14px', marginTop: '8px', display: 'inline-block', fontWeight: 600 }}>Need help? Contact support</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} className="sm:gap-2">
              {investments.slice(0, 5).map((inv) => (
                <div key={inv.id} className="sm:p-4 sm:px-5" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '12px 16px', 
                  borderRadius: '16px',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="sm:gap-4">
                    <div style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }} className="sm:w-11 sm:h-11">
                      <Wallet style={{ width: '18px', height: '18px', color: '#3B82F6' }} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }} className="sm:text-15">{formatCurrency(inv.principal)}</p>
                      <p style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }} className="sm:text-12">
                        <Calendar style={{ width: '11px', height: '11px' }} className="sm:w-3 sm:h-3" />
                        {new Date(inv.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="sm:px-3.5 sm:py-1.5 sm:text-12" style={{
                      padding: '4px 10px', 
                      borderRadius: '999px', 
                      fontSize: '10px', 
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      ...(inv.status === 'active' ? { background: '#DCFCE7', color: '#16A34A' } :
                        inv.status === 'matured' ? { background: '#DBEAFE', color: '#2563EB' } :
                        { background: '#FEF3C7', color: '#D97706' })
                    }}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
