import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatCurrency } from '../utils/formatCurrency'
import { Users, Wallet, TrendingUp, Mail, ArrowUpRight, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ clients: 0, totalAum: 0, activeInvestments: 0, pendingLeads: 0 })
  const [recentLeads, setRecentLeads] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [profilesRes, investmentsRes, leadsRes, logsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).neq('role', 'admin'),
        supabase.from('investments').select('*'),
        supabase.from('leads').select('*').order('submitted_at', { ascending: false }).limit(5),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10),
      ])

      const investments = investmentsRes.data || []
      const totalAum = investments.filter(inv => inv.status === 'active').reduce((sum, inv) => sum + parseFloat(inv.principal || 0), 0)
      const active = investments.filter(inv => inv.status === 'active')

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentInvCount = investments.filter(inv => new Date(inv.created_at) >= thirtyDaysAgo).length;

      const leads = leadsRes.data || []
      const pendingLeads = leads.filter(l => l.status === 'new').length

      setStats({
        clients: profilesRes.count || 0,
        totalAum,
        activeInvestments: active.length,
        recentInvestments: recentInvCount,
        totalInvestments: investments.length,
        pendingLeads,
      })

      setRecentLeads(leadsRes.data || [])
      setAuditLogs(logsRes.data || [])

      // Generate dynamic chart data based on actual investments
      const last6Months = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        last6Months.push({
          month: d.toLocaleString('default', { month: 'short' }),
          date: new Date(d.getFullYear(), d.getMonth() + 1, 0), // Last day of that month
          aum: 0,
          returns: 0
        })
      }

      const activeInvestments = investments.filter(inv => inv.status === 'active')
      
      const processedChartData = last6Months.map(slot => {
        // AUM at the end of this month (all investments started on or before this month)
        const monthEnd = slot.date
        const aumAtMonthEnd = activeInvestments
          .filter(inv => new Date(inv.start_date || inv.created_at) <= monthEnd)
          .reduce((sum, inv) => sum + parseFloat(inv.principal || 0), 0)

        // Returns in this specific month (interest from investments active during this month)
        // For simplicity, we calculate interest for all investments active on monthEnd
        const returnsInMonth = activeInvestments
          .filter(inv => new Date(inv.start_date || inv.created_at) <= monthEnd)
          .reduce((sum, inv) => sum + (parseFloat(inv.principal || 0) * parseFloat(inv.monthly_rate || 0)), 0)

        return {
          month: slot.month,
          aum: Math.round(aumAtMonthEnd),
          returns: Math.round(returnsInMonth)
        }
      })

      setChartData(processedChartData)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="skeleton" style={{ height: '32px', width: '256px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '128px' }} />)}
        </div>
        <div className="skeleton" style={{ height: '384px' }} />
      </div>
    )
  }

  const formatAxis = (v) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`
    return `₹${v}`
  }

  const kpis = [
    { icon: Users, label: 'Total Users', value: stats.clients, gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
    { icon: TrendingUp, label: 'Active Investments', value: stats.activeInvestments, gradient: 'linear-gradient(135deg, #10B981, #059669)' },
    { icon: Mail, label: 'Pending Leads', value: stats.pendingLeads, gradient: 'linear-gradient(135deg, #F59E0B, #D97706)' },
    { icon: Wallet, label: 'Total AUM', value: formatCurrency(stats.totalAum), gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Dashboard</h1>
        <p style={{ color: '#64748B' }}>Overview of your finance operations</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card-hover" style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div className="icon-animate" style={{ width: '48px', height: '48px', background: kpi.gradient, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)' }}>
                <kpi.icon style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
              </div>
              <div style={{ padding: '8px', background: '#F8FAFC', borderRadius: '10px' }}>
                <ArrowUpRight style={{ width: '16px', height: '16px', color: '#0EA5E9' }} />
              </div>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>{kpi.label}</p>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>{kpi.value}</h2>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 700 }}>+12%</span>
               <span style={{ fontSize: '12px', color: '#94A3B8' }}>from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>AUM Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={formatAxis} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area type="monotone" dataKey="aum" stroke="#0EA5E9" fill="url(#aumGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Monthly Returns</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={formatAxis} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="returns" fill="#22C55E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads + Audit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ fontWeight: 700 }}>Recent Leads</h3>
          </div>
          {recentLeads.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No leads yet</div>
          ) : (
            recentLeads.map((lead) => (
              <div key={lead.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px' }}>{lead.full_name}</p>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>{lead.email}</p>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                  ...(lead.status === 'new' ? { background: '#DBEAFE', color: '#2563EB' } :
                    lead.status === 'contacted' ? { background: '#FEF3C7', color: '#D97706' } :
                    lead.status === 'converted' ? { background: '#DCFCE7', color: '#16A34A' } :
                    { background: '#FEE2E2', color: '#EF4444' })
                }}>
                  {lead.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0' }}>
            <h3 style={{ fontWeight: 700 }}>Activity Log</h3>
          </div>
          {auditLogs.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No activity yet</div>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock style={{ width: '16px', height: '16px', color: '#94A3B8', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px' }}>{log.action}</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8' }}>{new Date(log.created_at).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
