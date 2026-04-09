import { useToastStore } from '../../store/toastStore'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function Toaster() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          style={{ 
            background: '#FFFFFF', 
            borderRadius: '16px', 
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #E2E8F0',
            padding: '16px',
            minWidth: '320px',
            maxWidth: '440px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <div style={{ flexShrink: 0 }}>
            {toast.type === 'success' && <CheckCircle style={{ color: '#10B981', width: '20px', height: '20px' }} />}
            {toast.type === 'error' && <AlertCircle style={{ color: '#EF4444', width: '20px', height: '20px' }} />}
            {toast.type === 'info' && <Info style={{ color: '#3B82F6', width: '20px', height: '20px' }} />}
          </div>
          <p style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: '#1E293B', margin: 0 }}>{toast.message}</p>
          <button 
            onClick={() => removeToast(toast.id)}
            style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
