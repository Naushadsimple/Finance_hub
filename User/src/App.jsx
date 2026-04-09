import { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './auth/ProtectedRoute'
import Toaster from './components/common/Toaster'

// Lazy-loaded pages
const LandingPage = lazy(() => import('./public/LandingPage'))
const SignIn = lazy(() => import('./auth/SignIn'))
const SignUp = lazy(() => import('./auth/SignUp'))
const ForgotPassword = lazy(() => import('./auth/ForgotPassword'))
const Services = lazy(() => import('./public/Services'))
const UserLayout = lazy(() => import('./user/layout/UserLayout'))
const UserDashboard = lazy(() => import('./user/pages/UserDashboard'))
const MyInvestments = lazy(() => import('./user/pages/MyInvestments'))
const Certificates = lazy(() => import('./user/pages/Certificates'))
const Profile = lazy(() => import('./user/pages/Profile'))
const Support = lazy(() => import('./user/pages/Support'))

function LoadingFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #0EA5E9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>Loading Finance Hub...</p>
      </div>
    </div>
  )
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/services" element={<Services />} />

          {/* Protected User Routes */}
          <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="investments" element={<MyInvestments />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  )
}
