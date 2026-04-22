import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/authStore'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.svg'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function SignIn() {
  const navigate = useNavigate()
  const { signIn, session } = useAuthStore()
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
      await signIn(formData.email, formData.password)
      navigate('/user/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', paddingLeft: '48px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }
  const iconStyle = { position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F0F9FF, #FFFFFF, #E0F2FE)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src={logo} alt="Finance Hub" style={{ width: '56px', height: '56px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px' }}>FinanceHub</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '2px', textTransform: 'uppercase' }}>One Stop Solution</span>
            </div>
          </Link>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', padding: '40px', border: '1px solid #E2E8F0' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Sign In</h1>
          <p style={{ color: '#64748B', marginBottom: '32px' }}>Welcome back! Access your investment dashboard.</p>

          {error && <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px' }}>{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={iconStyle} />
                <input {...register('email')} type="email" placeholder="you@email.com" style={inputStyle} />
              </div>
              {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#334155' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={iconStyle} />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '48px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}>
                  {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.password.message}</p>}
            </div>

            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <Link to="/forgot-password" style={{ fontSize: '14px', color: '#0EA5E9', textDecoration: 'none', fontWeight: 500 }}>Forgot Password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }}>
              {loading ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><LogIn style={{ width: '20px', height: '20px' }} /> Sign In</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748B', marginTop: '24px' }}>
            Don't have an account? <Link to="/sign-up" style={{ color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
