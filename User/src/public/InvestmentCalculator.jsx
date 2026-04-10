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
    <section ref={sectionRef} id="calculator" style={{ padding: '80px 20px', background: 'linear-gradient(180deg, #FFFFFF, #F8FAFC)' }} className="sm:py-24 sm:px-8">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }} className="sm:mb-14">
          <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px' }}>Investment Calculator</span>
          <h2 style={{ fontWeight: 900, color: '#0F172A', marginTop: '12px', letterSpacing: '-1px' }} className="text-2xl sm:text-4xl">Calculate Your Returns</h2>
          <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '600px', margin: '16px auto 0', lineHeight: 1.6 }} className="sm:text-base">See how much you can earn with our fixed-return investment plan.</p>
        </div>

        <div className="calc-content sm:p-12" style={{ maxWidth: '896px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', padding: '32px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B' }}>Investment Amount</label>
              <span style={{ fontWeight: 800, color: '#0EA5E9' }} className="text-xl sm:text-3xl">{formatCurrency(amount)}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: '#64748B' }}>
              <span>{'\u20b9'}10,000</span>
              <span>{'\u20b9'}50,00,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #E0F2FE, #F0F9FF)', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(14,165,233,0.2)' }}>
                  <TrendingUp style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Monthly Return</span>
              </div>
              <p style={{ fontWeight: 800, color: '#0369A1' }} className="text-xl sm:text-2xl">{formatCurrency(monthlyReturn)}</p>
              <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>1% per month</p>
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #DCFCE7, #F0FDF4)', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(34,197,94,0.2)' }}>
                  <Calculator style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>Annual Return</span>
              </div>
              <p style={{ fontWeight: 800, color: '#16A34A' }} className="text-xl sm:text-2xl">{formatCurrency(annualReturn)}</p>
              <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>12% per year</p>
            </div>

            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #F3E8FF, #FAF5FF)', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #9333EA, #7C3AED)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(147,51,234,0.2)' }}>
                  <Calendar style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>3-Year Yield</span>
              </div>
              <p style={{ fontWeight: 800, color: '#7C3AED' }} className="text-xl sm:text-2xl">{formatCurrency(threeYearReturn)}</p>
              <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>36 months growth</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
