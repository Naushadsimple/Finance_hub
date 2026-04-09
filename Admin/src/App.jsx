import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAdminAuthStore } from './store/adminAuthStore'
import AdminProtectedRoute from './auth/AdminProtectedRoute'
import Toaster from './components/common/Toaster'

// Lazy-loaded Admin pages
const AdminSignIn = lazy(() => import('./auth/AdminSignIn'))
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Clients = lazy(() => import('./pages/Clients'))
const Investments = lazy(() => import('./pages/Investments'))
const Certificates = lazy(() => import('./pages/Certificates'))
const Leads = lazy(() => import('./pages/Leads'))
const Services = lazy(() => import('./pages/Services'))
const Tickets = lazy(() => import('./pages/Tickets'))
const Settings = lazy(() => import('./pages/Settings'))
const Unauthorized = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
    <div style={{ textAlign: 'center', padding: '32px', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxWidth: '400px', border: '1px solid #FEE2E2' }}>
      <div style={{ width: '80px', height: '80px', background: '#FEF2F2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '40px', height: '40px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Access Denied</h2>
      <p style={{ color: '#64748B', marginBottom: '24px', lineHeight: 1.5 }}>Your account does not have administrative privileges required for this console.</p>
      <button 
        onClick={() => window.location.href = import.meta.env.VITE_USER_APP_URL} 
        style={{ width: '100%', py: '12px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', padding: '12px' }}
      >
        Go to User Portal
      </button>
    </div>
  </div>
)

export default function App() {
  const initialize = useAdminAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #0EA5E9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      }>
        <Routes>
          <Route path="/sign-in" element={<AdminSignIn />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Admin Routes */}
          <Route path="/" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="investments" element={<Investments />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="leads" element={<Leads />} />
            <Route path="services" element={<Services />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  )
}
