import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gsap } from 'gsap'
import { supabase } from '../lib/supabaseClient'
import { Send, User, Mail, Phone, IndianRupee, CheckCircle } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  proposed_amount: z.string().min(1, 'Amount is required').refine(v => Number(v) >= 10000, 'Minimum \u20b910,000'),
})

export default function LeadForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const checkRef = useRef(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (success && checkRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.success-icon', { scale: 0, rotation: -180, duration: 0.6, ease: 'back.out(1.7)' })
        gsap.from('.success-text', { y: 20, opacity: 0, duration: 0.5, delay: 0.3 })
      }, checkRef)
      const timer = setTimeout(() => { setSuccess(false); reset() }, 4000)
      return () => { ctx.revert(); clearTimeout(timer) }
    }
  }, [success])

  const onSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.from('leads').insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        proposed_amount: Number(formData.proposed_amount),
      })
      if (err) throw err

      // Send Emails via Edge Function
      try {
        // To User
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'new_lead_user',
            to: formData.email,
            data: {
              full_name: formData.full_name,
              proposed_amount: Number(formData.proposed_amount),
              phone: formData.phone
            }
          }
        })

        // To Admin
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'new_lead_admin',
            to: 'support@financehubonline.com',
            data: {
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              proposed_amount: Number(formData.proposed_amount)
            }
          }
        })
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr)
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '14px',
    paddingBottom: '14px',
    borderRadius: '14px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: '#64748B',
  }

  return (
    <section id="lead-form" style={{ padding: '80px 20px', background: 'linear-gradient(180deg, #F8FAFC, #FFFFFF)' }} className="sm:py-24 sm:px-8">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }} className="sm:mb-12">
            <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px' }}>Get Started</span>
            <h2 style={{ fontWeight: 900, color: '#0F172A', marginTop: '12px', letterSpacing: '-1px' }} className="text-2xl sm:text-4xl">Ready to Invest?</h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginTop: '12px', lineHeight: 1.6 }} className="sm:text-base">Fill the form below and our team will get in touch within 24 hours.</p>
          </div>

          <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', padding: '32px' }} className="sm:p-10">
            {success ? (
              <div ref={checkRef} style={{ textAlign: 'center', padding: '48px 0' }}>
                <div className="success-icon" style={{ width: '80px', height: '80px', background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle style={{ width: '40px', height: '40px', color: '#22C55E' }} />
                </div>
                <h3 className="success-text" style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Thank You!</h3>
                <p className="success-text" style={{ color: '#64748B' }}>We've received your inquiry. Our team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>{error}</div>}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#1E293B' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User style={iconStyle} />
                    <input {...register('full_name')} placeholder="Your full name" style={inputStyle} />
                  </div>
                  {errors.full_name && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.full_name.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#1E293B' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail style={iconStyle} />
                      <input {...register('email')} type="email" placeholder="you@email.com" style={inputStyle} />
                    </div>
                    {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email.message}</p>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#1E293B' }}>Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone style={iconStyle} />
                      <input {...register('phone')} placeholder="+91 98765 43210" style={inputStyle} />
                    </div>
                    {errors.phone && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.phone.message}</p>}
                  </div>
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#1E293B' }}>Proposed Investment Amount ({'\u20b9'})</label>
                  <div style={{ position: 'relative' }}>
                    <IndianRupee style={iconStyle} />
                    <input {...register('proposed_amount')} type="number" min="10000" placeholder="500000" style={inputStyle} />
                  </div>
                  {errors.proposed_amount && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.proposed_amount.message}</p>}
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '14px', fontWeight: 700, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(14,165,233,0.3)', transition: 'all 0.2s' }}>
                  {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Send style={{ width: '20px', height: '20px' }} /> Submit Inquiry</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
