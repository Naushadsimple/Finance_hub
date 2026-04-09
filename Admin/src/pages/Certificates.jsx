import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useClients } from '../hooks/useClients'
import { useInvestments } from '../hooks/useInvestments'
import { useCertificates } from '../hooks/useCertificates'
import { useAdminAuthStore } from '../store/adminAuthStore'
import { useToastStore } from '../store/toastStore'
import { FileText, Upload, Plus, X, Download, Calendar, Wallet, Trash2, ShieldAlert, UserCheck } from 'lucide-react'
import { formatCurrency } from '../utils/formatCurrency'

export default function Certificates() {
  const { user: currentAdmin } = useAdminAuthStore()
  const { clients } = useClients()
  const { investments } = useInvestments()
  const { certificates, loading, deleteCertificate, refetch } = useCertificates()
  const addToast = useToastStore((s) => s.addToast)
  
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [formData, setFormData] = useState({ profile_id: '', investment_id: '', certificate_number: '' })
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleUpload = async () => {
    if (!selectedFile || !formData.profile_id || !formData.certificate_number) return
    setUploading(true)
    try {
      const filePath = `${formData.profile_id}/${Date.now()}_${selectedFile.name}`
      const { error: uploadError } = await supabase.storage.from('certificates').upload(filePath, selectedFile)
      if (uploadError) throw uploadError

      const { error: dbError } = await supabase.from('certificates').insert({
        user_id: formData.profile_id,
        investment_id: formData.investment_id || null,
        certificate_number: formData.certificate_number,
        file_name: selectedFile.name,
        file_path: filePath,
        issued_date: new Date().toISOString().split('T')[0],
        uploaded_by: currentAdmin?.id
      })
      if (dbError) throw dbError

      addToast('Certificate uploaded and issued successfully!', 'success')
      setShowModal(false)
      setSelectedFile(null)
      setFormData({ profile_id: '', investment_id: '', certificate_number: '' })
      refetch()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (cert) => {
    try {
      await deleteCertificate(cert.id, cert.file_path)
      addToast('Certificate deleted successfully', 'success')
      setShowDeleteConfirm(null)
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  if (loading) return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><div className="skeleton" style={{ height: '32px', width: '192px' }} /><div className="skeleton" style={{ height: '384px' }} /></div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Certificates</h1>
          <p style={{ color: '#64748B' }}>{certificates.length} certificates issued</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Upload style={{ width: '16px', height: '16px' }} /> Upload Certificate
        </button>
      </div>

      {certificates.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '64px', textAlign: 'center' }}>
          <FileText style={{ width: '48px', height: '48px', color: '#E2E8F0', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748B' }}>No certificates issued yet</p>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', width: '100%' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                  {['Certificate #', 'Client', 'Investment', 'Issued By', 'Issued Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certificates.map(cert => (
                  <tr key={cert.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: '#0EA5E9' }}>{cert.certificate_number}</td>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#1E293B' }}>{cert.user?.full_name || '—'}</td>
                    <td style={{ padding: '14px 20px' }}>{cert.investments ? formatCurrency(cert.investments.principal) : <span style={{ color: '#94A3B8' }}>General</span>}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#0F172A', fontWeight: 500 }}>
                        <UserCheck style={{ width: '14px', height: '14px', color: '#10B981' }} />
                        {cert.admin?.full_name || 'System Admin'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#64748B' }}>{new Date(cert.issued_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setShowDeleteConfirm(cert)} style={{ padding: '8px', color: '#EF4444', background: '#FEF2F2', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Upload Certificate</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Client</label>
                <select value={formData.profile_id} onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })} style={{ ...inputStyle, background: '#FFFFFF' }}>
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.client_code})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Investment (optional)</label>
                <select value={formData.investment_id} onChange={(e) => setFormData({ ...formData, investment_id: e.target.value })} style={{ ...inputStyle, background: '#FFFFFF' }}>
                  <option value="">Select investment</option>
                  {investments.filter(inv => inv.user_id === formData.profile_id).map(inv => (
                    <option key={inv.id} value={inv.id}>{formatCurrency(inv.principal)} - {new Date(inv.start_date).toLocaleDateString('en-IN')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Certificate Number</label>
                <input value={formData.certificate_number} onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })} placeholder="CERT-2026-001" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>File</label>
                <div onClick={() => fileRef.current?.click()} style={{ padding: '24px', border: '2px dashed #E2E8F0', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <Upload style={{ width: '24px', height: '24px', color: '#94A3B8', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '14px', color: '#64748B' }}>{selectedFile ? selectedFile.name : 'Click to upload PDF or Image'}</p>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.png,.jpeg" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ display: 'none' }} />
              </div>
              <button onClick={handleUpload} disabled={uploading || !selectedFile || !formData.profile_id || !formData.certificate_number} style={{ width: '100%', padding: '16px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: (uploading || !selectedFile) ? 'not-allowed' : 'pointer', opacity: uploading ? 0.5 : 1 }}>
                {uploading ? 'Uploading...' : 'Confirm & Issue Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#FEF2F2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShieldAlert style={{ width: '32px', height: '32px' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Delete Certificate</h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>Are you sure you want to delete this certificate? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#1E293B', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

