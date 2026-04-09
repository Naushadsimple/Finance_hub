import { useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import { formatCurrency } from '../utils/formatCurrency'
import { Mail, Phone, Calendar, IndianRupee, ArrowRight, Search, Trash2, ShieldAlert, X, Edit2 } from 'lucide-react'

export default function Leads() {
  const { leads, loading, updateLead, deleteLead } = useLeads()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showEditModal, setShowEditModal] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [editFormData, setEditFormData] = useState({ full_name: '', email: '', phone: '', proposed_amount: '' })

  const filtered = leads.filter(lead => {
    const search = searchTerm.toLowerCase();
    const matchSearch = 
      (lead.full_name?.toLowerCase() || '').includes(search) || 
      (lead.email?.toLowerCase() || '').includes(search)
    const matchStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusColors = {
    new: { bg: '#DBEAFE', text: '#2563EB' },
    contacted: { bg: '#FEF3C7', text: '#D97706' },
    converted: { bg: '#DCFCE7', text: '#16A34A' },
    closed: { bg: '#FEE2E2', text: '#EF4444' },
  }

  const statusFlow = { new: 'contacted', contacted: 'converted' }

  const openEdit = (lead) => {
    setShowEditModal(lead.id)
    setEditFormData({
      full_name: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      proposed_amount: lead.proposed_amount,
    })
  }

  const handleUpdate = async () => {
    await updateLead(showEditModal, editFormData)
    setShowEditModal(null)
  }

  const handleDelete = async (id) => {
    await deleteLead(id)
    setShowDeleteConfirm(null)
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  if (loading) return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><div className="skeleton" style={{ height: '32px', width: '192px' }} /><div className="skeleton" style={{ height: '512px' }} /></div>

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    closed: leads.filter(l => l.status === 'closed').length,
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Leads</h1>
        <p style={{ color: '#64748B' }}>{leads.length} total inquiries</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'New', count: counts.new, color: '#3B82F6' },
          { label: 'Contacted', count: counts.contacted, color: '#F59E0B' },
          { label: 'Converted', count: counts.converted, color: '#22C55E' },
          { label: 'Closed', count: counts.closed, color: '#EF4444' },
        ].map((stat) => (
          <div key={stat.label} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color }} />
            <div>
              <p style={{ fontSize: '12px', color: '#64748B' }}>{stat.label}</p>
              <p style={{ fontSize: '20px', fontWeight: 800 }}>{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search leads..." style={{ ...inputStyle, paddingLeft: '40px' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'new', 'contacted', 'converted', 'closed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: '1px solid', cursor: 'pointer', ...(statusFilter === s ? { background: '#0F172A', color: '#FFFFFF', borderColor: '#0F172A' } : { background: '#FFFFFF', color: '#64748B', borderColor: '#E2E8F0' }) }}>
              {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Lead Cards */}
      {filtered.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '64px', textAlign: 'center' }}>
          <Mail style={{ width: '48px', height: '48px', color: '#E2E8F0', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748B' }}>No leads found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((lead) => (
            <div key={lead.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{ width: '48px', height: '48px', background: statusColors[lead.status]?.bg || '#F1F5F9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusColors[lead.status]?.text, fontWeight: 700 }}>
                  {lead.full_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1E293B' }}>{lead.full_name}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748B', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail style={{ width: '12px', height: '12px' }} /> {lead.email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone style={{ width: '12px', height: '12px' }} /> {lead.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IndianRupee style={{ width: '12px', height: '12px' }} /> {formatCurrency(lead.proposed_amount)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar style={{ width: '12px', height: '12px' }} /> {new Date(lead.submitted_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 600, background: statusColors[lead.status]?.bg, color: statusColors[lead.status]?.text }}>
                  {lead.status}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {statusFlow[lead.status] && (
                    <button onClick={() => updateLead(lead.id, { status: statusFlow[lead.status] })} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', background: '#F0F9FF', color: '#0EA5E9', borderRadius: '10px', fontWeight: 600, fontSize: '12px', border: '1px solid #BAE6FD', cursor: 'pointer' }}>
                      {statusFlow[lead.status]} <ArrowRight style={{ width: '12px', height: '12px' }} />
                    </button>
                    )}
                  <button onClick={() => openEdit(lead)} style={{ padding: '8px', color: '#0EA5E9', background: '#F0F9FF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <Edit2 style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(lead.id)} style={{ padding: '8px', color: '#EF4444', background: '#FEF2F2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Edit Lead</h2>
              <button onClick={() => setShowEditModal(null)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label><input value={editFormData.full_name} onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Email</label><input value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Phone</label><input value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Proposed Amount</label><input value={editFormData.proposed_amount} onChange={(e) => setEditFormData({ ...editFormData, proposed_amount: e.target.value })} type="number" style={inputStyle} /></div>
              <button onClick={handleUpdate} style={{ width: '100%', padding: '14px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Update Lead</button>
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
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Delete Lead</h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>Are you sure you want to delete this lead? This inquiry will be permanently removed.</p>
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
