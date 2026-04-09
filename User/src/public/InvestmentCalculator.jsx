import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { formatCurrency } from '../utils/formatCurrency'
import { MONTHLY_RATE } from '../constants'
import { Calculator, TrendingUp, Calendar } from 'lucide-react'

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(500000)
  const sectionRef = useRef(null)

  const monthlyReturn = amount * MONTHLY_RATE
  const annualReturn = monthlyReturn * 12
  const threeYearReturn = monthlyReturn * 36

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.calc-content', { y: 40, opacity: 0, duration: 0.7 })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="calculator" style={{ padding: '96px 0', background: 'linear-gradient(180deg, #FFFFFF, #F8FAFC)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Investment Calculator</p>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#1E293B', marginBottom: '16px' }}>Calculate Your Returns</h2>
          <p style={{ fontSize: '18px', color: '#64748B' }}>See how much you can earn with our fixed-return investment plan.</p>
        </div>

        <div className="calc-content" style={{ maxWidth: '896px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 4px 24px rgba(14,165,233,0.08)', border: '1px solid #E2E8F0', padding: '48px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <label style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>Investment Amount</label>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0EA5E9' }}>{formatCurrency(amount)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="5000000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{ width: '100%', height: '8px', borderRadius: '4px', cursor: 'pointer', accentColor: '#0EA5E9' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#64748B' }}>
              <span>₹10,000</span>
              <span>₹50,00,000</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #E0F2FE, #F0F9FF)', borderRadius: '16px', border: '1px solid rgba(14,165,233,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <TrendingUp style={{ width: '20px', height: '20px', color: '#0EA5E9' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>Monthly Return</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#0369A1' }}>{formatCurrency(monthlyReturn)}</p>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>1% per month</p>
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)', borderRadius: '16px', border: '1px solid rgba(34,197,94,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <Calculator style={{ width: '20px', height: '20px', color: '#22C55E' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>Annual Return</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#22C55E' }}>{formatCurrency(annualReturn)}</p>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>12% per year</p>
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #F3E8FF, #FAF5FF)', borderRadius: '16px', border: '1px solid rgba(147,51,234,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <Calendar style={{ width: '20px', height: '20px', color: '#9333EA' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>3-Year Projection</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#7C3AED' }}>{formatCurrency(threeYearReturn)}</p>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>36 months total interest</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
