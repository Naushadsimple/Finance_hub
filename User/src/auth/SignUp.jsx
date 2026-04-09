import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Phone, TrendingUp } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords don\'t match',
  path: ['confirm_password'],
})

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp, session } = useAuthStore()
  const addToast = useToastStore((s) => s.addToast)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  if (session) {
    return <Navigate to="/user/dashboard" replace />
  }

  const onSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      await signUp(formData.email, formData.password, formData.full_name, formData.phone)
      
      // Post-signup Welcome Email via Edge Function
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'verification',
            to: formData.email,
            data: {
              name: formData.full_name,
              url: `${window.location.origin}/sign-in` // Simple redirection info
            }
          }
        })
      } catch (e) {
        console.error('Welcome email failed', e)
      }

      addToast('Registration successful! Please check your email to verify your account.', 'success')
      navigate('/sign-in')
    } catch (err) {
      setError(err.message || 'Registration failed')
      addToast(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', paddingLeft: '48px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
  const iconStyle = { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F0F9FF, #FFFFFF, #E0F2FE)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
            </div>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Finance Hub</span>
          </Link>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', padding: '40px', border: '1px solid #E2E8F0' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: '#64748B', marginBottom: '32px' }}>Start your investment journey today.</p>

          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User style={iconStyle} />
                <input {...register('full_name')} placeholder="Your full name" style={inputStyle} />
              </div>
              {errors.full_name && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.full_name.message}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={iconStyle} />
                  <input {...register('email')} type="email" placeholder="you@email.com" style={inputStyle} />
                </div>
                {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.email.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Phone</label>
                <div style={{ position: 'relative' }}>
                  <Phone style={iconStyle} />
                  <input {...register('phone')} placeholder="+91 98765 43210" style={inputStyle} />
                </div>
                {errors.phone && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.phone.message}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '48px' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}>
                    {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                  </button>
                </div>
                {errors.password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.password.message}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input {...register('confirm_password')} type="password" placeholder="••••••••" style={inputStyle} />
                </div>
                {errors.confirm_password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.confirm_password.message}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }}>
              {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><UserPlus style={{ width: '20px', height: '20px' }} /> Create Account</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '24px' }}>
            Already have an account? <Link to="/sign-in" style={{ color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
