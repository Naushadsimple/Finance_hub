import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/authStore'
import { Mail, ArrowLeft, Send, CheckCircle, TrendingUp } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

export default function ForgotPassword() {
  const { resetPassword } = useAuthStore()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      await resetPassword(formData.email)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F0F9FF, #FFFFFF, #E0F2FE)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Finance Hub</span>
          </Link>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', padding: '40px', border: '1px solid #E2E8F0' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: '64px', height: '64px', background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle style={{ width: '32px', height: '32px', color: '#22C55E' }} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Check Your Email</h2>
              <p style={{ color: '#64748B', marginBottom: '24px' }}>We've sent a password reset link to your email address.</p>
              <Link to="/sign-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Forgot Password</h1>
              <p style={{ color: '#64748B', marginBottom: '32px' }}>Enter your email and we'll send you a reset link.</p>

              {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
                    <input {...register('email')} type="email" placeholder="you@email.com" style={{ width: '100%', paddingLeft: '48px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.email.message}</p>}
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }}>
                  {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Send style={{ width: '20px', height: '20px' }} /> Send Reset Link</>}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '24px' }}>
                <Link to="/sign-in" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>
                  <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
