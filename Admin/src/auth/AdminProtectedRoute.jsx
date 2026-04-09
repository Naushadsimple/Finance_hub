import { Navigate } from 'react-router-dom'
import { useAdminAuthStore } from '../store/adminAuthStore'

export default function AdminProtectedRoute({ children }) {
  const { session, profile, loading } = useAdminAuthStore()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #0EA5E9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/sign-in" replace />
  }

  if (profile?.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#FFFFFF' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '12px', color: '#EF4444' }}>403</h1>
          <p style={{ color: '#94A3B8', marginBottom: '24px' }}>Unauthorized. Admin access required.</p>
          <a href="/" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>← Go Back</a>
        </div>
      </div>
    )
  }

  return children
}
