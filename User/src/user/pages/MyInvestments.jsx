import { useState, useEffect } from 'react'
import { useInvestments } from '../../hooks/useInvestments'
import { useToastStore } from '../../store/toastStore'
import { formatCurrency } from '../../utils/formatCurrency'
import { calculateMonthlyInterest, calculateAnnualInterest } from '../../utils/calculateInterest'
import { MONTHLY_RATE } from '../../constants'
import { Wallet, TrendingUp, Calendar, Clock, Plus, X } from 'lucide-react'

export default function MyInvestments() {
  const { investments, totalPrincipal, loading, createRequest, refetch } = useInvestments()
  const addToast = useToastStore((s) => s.addToast)
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [tenure, setTenure] = useState('12')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    refetch()
  }, [])

  const handleInvest = async (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return addToast('Please enter a valid amount', 'error')
    
    setSubmitting(true)
    try {
      await createRequest(amount, tenure, notes)
      addToast('Investment request submitted! Admin will contact you soon.', 'success')
      setShowModal(false)
      setAmount('')
      setNotes('')
    } catch (err) {
      addToast(err.message || 'Failed to submit request', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="skeleton" style={{ height: '32px', width: '192px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '112px' }} />)}</div>
        <div className="skeleton" style={{ height: '384px' }} />
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>My Investments</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,165,233,0.3)', fontSize: '14px' }}
          className="sm:px-6 sm:py-3 sm:text-base"
        >
          <Plus style={{ width: '18px', height: '18px' }} className="sm:w-5 sm:h-5" /> Invest Now
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gap: '12px', marginBottom: '32px' }} className="grid-cols-1 sm:grid-cols-3 sm:gap-4 sm:mb-10">
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }} className="sm:p-5">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: '#E0F2FE', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="sm:w-9 sm:h-9">
              <Wallet style={{ width: '14px', height: '14px', color: '#0EA5E9' }} className="sm:w-4 sm:h-4" />
            </div>
            <span style={{ fontSize: '13px', color: '#64748B' }} className="sm:text-14">Total Principal</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800 }} className="sm:text-24">{formatCurrency(totalPrincipal)}</p>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }} className="sm:p-5">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: '#DCFCE7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="sm:w-9 sm:h-9">
              <TrendingUp style={{ width: '14px', height: '14px', color: '#22C55E' }} className="sm:w-4 sm:h-4" />
            </div>
            <span style={{ fontSize: '13px', color: '#64748B' }} className="sm:text-14">Monthly Interest</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#22C55E' }} className="sm:text-24">{formatCurrency(calculateMonthlyInterest(totalPrincipal))}</p>
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }} className="sm:p-5">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: '#F3E8FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="sm:w-9 sm:h-9">
              <Calendar style={{ width: '14px', height: '14px', color: '#9333EA' }} className="sm:w-4 sm:h-4" />
            </div>
            <span style={{ fontSize: '13px', color: '#64748B' }} className="sm:text-14">Annual Interest</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 800, color: '#7C3AED' }} className="sm:text-24">{formatCurrency(calculateAnnualInterest(totalPrincipal))}</p>
        </div>
      </div>

      {/* Investment Cards */}
      {investments.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '48px 20px', textAlign: 'center' }} className="sm:p-16">
          <Wallet style={{ width: '48px', height: '48px', color: '#E2E8F0', margin: '0 auto 16px' }} className="sm:w-16 sm:h-16" />
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }} className="sm:text-18">No Investments Yet</h3>
          <p style={{ color: '#64748B', fontSize: '14px' }}>Submit a request to start your investment journey!</p>
          <button onClick={() => setShowModal(true)} style={{ marginTop: '20px', padding: '10px 20px', background: '#E0F2FE', color: '#0369A1', borderRadius: '10px', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Make First Request</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="sm:gap-4">
          {investments.map((inv) => {
            const monthly = parseFloat(inv.principal) * MONTHLY_RATE
            const annual = monthly * 12
            return (
              <div key={inv.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', transition: 'all 0.3s' }} className="sm:p-6">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#E0F2FE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="sm:w-12 sm:h-12">
                      <Wallet style={{ width: '20px', height: '20px', color: '#0EA5E9' }} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: 800 }} className="sm:text-18">{formatCurrency(inv.principal)}</p>
                      <p style={{ fontSize: '11px', color: '#64748B' }} className="sm:text-12">Principal Amount</p>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    ...(inv.status === 'active' ? { background: '#DCFCE7', color: '#16A34A' } :
                      inv.status === 'matured' ? { background: '#DBEAFE', color: '#2563EB' } :
                        inv.status === 'pending' ? { background: '#FEF3C7', color: '#D97706' } :
                        { background: '#FEE2E2', color: '#EF4444' })
                  }} className="sm:px-4 sm:py-1.5 sm:text-14">
                    {inv.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }} className="sm:grid-cols-4 sm:gap-4">
                  {[
                    { label: 'Monthly ROI', value: formatCurrency(monthly), color: '#22C55E' },
                    { label: 'Annual ROI', value: formatCurrency(annual), color: '#7C3AED' },
                    { label: 'Start Date', value: new Date(inv.start_date).toLocaleDateString('en-IN'), color: '#1E293B' },
                    { label: 'Tenure', value: `${inv.tenure_months}m`, color: '#1E293B' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '10px', background: '#F8FAFC', borderRadius: '12px' }} className="sm:p-3">
                      <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '4px' }} className="sm:text-11">{item.label}</p>
                      <p style={{ fontWeight: 700, color: item.color, fontSize: '13px' }} className="sm:text-14">{item.value}</p>
                    </div>
                  ))}
                </div>

                {inv.maturity_date && (
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748B' }}>
                    <Clock style={{ width: '16px', height: '16px' }} />
                    Maturity: {new Date(inv.maturity_date).toLocaleDateString('en-IN')}
                  </div>
                )}
                {inv.notes && (
                  <p style={{ marginTop: '12px', fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' }}>Note: {inv.notes}</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Invest Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '440px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', right: '24px', top: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X style={{ width: '24px', height: '24px' }} /></button>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>New Investment Request</h2>
            <form onSubmit={handleInvest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Investment Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 50000" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Tenure (Months)</label>
                <select value={tenure} onChange={(e) => setTenure(e.target.value)} style={{ ...inputStyle, background: '#FFFFFF' }}>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Additional Notes (Optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific requirements?" style={{ ...inputStyle, resize: 'none' }} rows={3} />
              </div>
              <button disabled={submitting} type="submit" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

