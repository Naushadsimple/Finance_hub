import { useState } from 'react'
import { useInvestments } from '../hooks/useInvestments'
import { useClients } from '../hooks/useClients'
import { useToastStore } from '../store/toastStore'
import { formatCurrency } from '../utils/formatCurrency'
import { Wallet, Plus, X, Search, Calendar, Edit2, Trash2, ShieldAlert, CheckCircle, XCircle } from 'lucide-react'
import { MONTHLY_RATE } from '../constants'

export default function Investments() {
  const { investments, loading, createInvestment, updateInvestment, deleteInvestment, refetch } = useInvestments()
  const { clients } = useClients()
  const addToast = useToastStore((s) => s.addToast)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [selectedInvestment, setSelectedInvestment] = useState(null)
  const [formData, setFormData] = useState({ profile_id: '', principal: '', start_date: '', tenure_months: 12, status: 'active' })

  const filtered = investments.filter(inv => {
    const search = searchTerm.toLowerCase();
    const matchSearch = 
      (inv.profiles?.full_name?.toLowerCase() || '').includes(search) || 
      String(inv.principal || '').includes(search)
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalAum = investments.filter(i => i.status === 'active').reduce((sum, inv) => sum + parseFloat(inv.principal || 0), 0)

  const openEdit = (inv) => {
    setSelectedInvestment(inv)
    setFormData({
      profile_id: inv.user_id,
      principal: inv.principal,
      start_date: inv.start_date,
      tenure_months: inv.tenure_months,
      status: inv.status,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    const maturityDate = new Date(formData.start_date)
    maturityDate.setMonth(maturityDate.getMonth() + Number(formData.tenure_months))
    
    const data = {
      ...formData,
      user_id: formData.profile_id,
      principal: Number(formData.principal),
      tenure_months: Number(formData.tenure_months),
      maturity_date: maturityDate.toISOString().split('T')[0],
    }
    delete data.profile_id;

    try {
      if (selectedInvestment) {
        await updateInvestment(selectedInvestment.id, data)
        addToast('Investment updated successfully', 'success')
      } else {
        await createInvestment(data)
        addToast('Investment created successfully', 'success')
      }
      setShowModal(false)
      setSelectedInvestment(null)
      setFormData({ profile_id: '', principal: '', start_date: '', tenure_months: 12, status: 'active' })
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateInvestment(id, { status })
      addToast(`Investment ${status} successfully`, 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteInvestment(id)
      addToast('Investment deleted successfully', 'success')
      setShowDeleteConfirm(null)
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  if (loading) return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><div className="skeleton" style={{ height: '32px', width: '192px' }} /><div className="skeleton" style={{ height: '512px' }} /></div>

  const statusColors = {
    active: { background: '#DCFCE7', color: '#16A34A' },
    pending: { background: '#FEF3C7', color: '#D97706' },
    matured: { background: '#DBEAFE', color: '#2563EB' },
    rejected: { background: '#FEE2E2', color: '#EF4444' },
    closed: { background: '#FEE2E2', color: '#EF4444' },
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Investments</h1>
          <p style={{ color: '#64748B' }}>Active AUM: <span style={{ fontWeight: 700, color: '#16A34A' }}>{formatCurrency(totalAum)}</span></p>
        </div>
        <button onClick={() => { setSelectedInvestment(null); setFormData({ profile_id: '', principal: '', start_date: '', tenure_months: 12, status: 'active' }); setShowModal(true); }} className="btn-animate" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> New Investment
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '320px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search client or amount..." style={{ ...inputStyle, paddingLeft: '40px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'active', 'matured', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="btn-animate" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid', cursor: 'pointer', ...(statusFilter === s ? { background: '#0F172A', color: '#FFFFFF', borderColor: '#0F172A' } : { background: '#FFFFFF', color: '#64748B', borderColor: '#E2E8F0' }) }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', width: '100%' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              {['Client', 'Principal', 'Return (Mo/Yr)', 'Tenure', 'Start Date', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#64748B' }}>No investments found</td></tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{inv.profiles?.full_name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 750 }}>{formatCurrency(inv.principal)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <p style={{ color: '#22C55E', fontWeight: 600, fontSize: '13px' }}>{formatCurrency(parseFloat(inv.principal) * MONTHLY_RATE)}</p>
                    <p style={{ color: '#94A3B8', fontSize: '11px' }}>{formatCurrency(parseFloat(inv.principal) * MONTHLY_RATE * 12)}</p>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{inv.tenure_months} mo</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#64748B' }}>{new Date(inv.start_date).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, ...(statusColors[inv.status] || {}) }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {inv.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusUpdate(inv.id, 'active')} title="Approve" className="btn-animate" style={{ padding: '6px', color: '#16A34A', background: '#DCFCE7', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            <CheckCircle style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button onClick={() => handleStatusUpdate(inv.id, 'rejected')} title="Reject" className="btn-animate" style={{ padding: '6px', color: '#EF4444', background: '#FEE2E2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            <XCircle style={{ width: '14px', height: '14px' }} />
                          </button>
                        </>
                      )}
                      <button onClick={() => setShowDetails(inv)} title="View Details" className="btn-animate" style={{ padding: '6px', color: '#10B981', background: '#D1FAE5', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Wallet style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button onClick={() => openEdit(inv)} title="Edit" className="btn-animate" style={{ padding: '6px', color: '#0EA5E9', background: '#F0F9FF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Edit2 style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(inv.id)} className="btn-animate" style={{ padding: '6px', color: '#EF4444', background: '#FEF2F2', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedInvestment ? 'Edit Investment' : 'New Investment'}</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Client</label>
                <select value={formData.profile_id} onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })} style={{ ...inputStyle, background: '#FFFFFF' }} disabled={!!selectedInvestment}>
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.client_code})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Principal Amount (₹)</label>
                <input value={formData.principal} onChange={(e) => setFormData({ ...formData, principal: e.target.value })} type="number" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Start Date</label>
                  <input value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} type="date" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Tenure (months)</label>
                  <input value={formData.tenure_months} onChange={(e) => setFormData({ ...formData, tenure_months: e.target.value })} type="number" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, background: '#FFFFFF' }}>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="matured">Matured</option>
                  <option value="rejected">Rejected</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <button onClick={handleSave} style={{ width: '100%', padding: '14px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                {selectedInvestment ? 'Update Investment' : 'Create Investment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#FEF2F2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShieldAlert style={{ width: '32px', height: '32px' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Delete Investment</h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>Are you sure you want to delete this investment record? All history will be lost.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#1E293B', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>Investment Information</h2>
              <button onClick={() => setShowDetails(null)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 600 }}>Client Name:</span>
                <span style={{ fontWeight: 700, color: '#1E293B' }}>{showDetails.profiles?.full_name || 'N/A'}</span>
              </div>
              {showDetails.notes && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 600 }}>Request Note:</span>
                  <span style={{ color: '#0EA5E9', fontStyle: 'italic' }}>{showDetails.notes}</span>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 600 }}>Principal Amount:</span>
                <span style={{ fontWeight: 800, fontSize: '18px', color: '#10B981' }}>{formatCurrency(showDetails.principal)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 600 }}>Status:</span>
                <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, width: 'fit-content', ...(statusColors[showDetails.status] || {}) }}>
                  {showDetails.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: '32px' }}>
              {showDetails.status === 'pending' && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <button onClick={() => { handleStatusUpdate(showDetails.id, 'active'); setShowDetails(null); }} style={{ flex: 1, padding: '12px', background: '#16A34A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Approve</button>
                  <button onClick={() => { handleStatusUpdate(showDetails.id, 'rejected'); setShowDetails(null); }} style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Reject</button>
                </div>
              )}
              <button onClick={() => setShowDetails(null)} style={{ width: '100%', padding: '14px', background: '#F1F5F9', color: '#1E293B', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

