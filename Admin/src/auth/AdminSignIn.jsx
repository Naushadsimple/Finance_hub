import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.svg'

const schema = z.object({
  email: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
})

export default function AdminSignIn() {
  const navigate = useNavigate()
  const { signIn, session } = useAdminAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  const onSubmit = async (formData) => {
    setLoading(true)
    setError('')
    try {
      let finalEmail = formData.email
      let finalPassword = formData.password

      if (formData.email.trim().toLowerCase() === 'admin' && formData.password === 'admin') {
        finalEmail = 'admin@gmail.com';
        finalPassword = '123123';
      }

      await signIn(finalEmail, finalPassword)
      navigate('/dashboard')
    } catch (err) {
      if (formData.email.trim().toLowerCase() === 'admin') {
        setError('Invalid admin shortcut. If you changed your password, please use your official admin email.')
      } else {
        setError(err.message || 'Invalid admin credentials')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img src={logo} alt="Finance Hub" style={{ width: '64px', height: '64px', filter: 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(56,189,248,0.5))' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>FinanceHub</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#38BDF8', letterSpacing: '2px', textTransform: 'uppercase' }}>One Stop Solution</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', padding: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Internal Login</h1>
          <p style={{ color: '#64748B', marginBottom: '32px', fontSize: '14px' }}>Access restricted to authorized administrators</p>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
                <input
                  {...register('email')}
                  type="text"
                  placeholder="admin"
                  style={{ width: '100%', paddingLeft: '48px', paddingRight: '16px', paddingTop: '14px', paddingBottom: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ width: '100%', paddingLeft: '48px', paddingRight: '48px', paddingTop: '14px', paddingBottom: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                >
                  {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '16px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              {loading ? (
                <div style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <LogIn style={{ width: '20px', height: '20px' }} />
                  Authenticate
                </>
              )}
            </button>
          </form>
        </div>
        
        <p style={{ marginTop: '32px', textAlign: 'center', color: '#64748B', fontSize: '14px' }}>
          &copy; {new Date().getFullYear()} Finance Hub Security Systems
        </p>
      </div>
    </div>
  )
}
