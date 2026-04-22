import { useState } from 'react'
import { useClients } from '../hooks/useClients'
import { useToastStore } from '../store/toastStore'
import { formatCurrency } from '../utils/formatCurrency'
import { Users, Search, Plus, Mail, Phone, Calendar, X, Edit2, Trash2, ShieldAlert } from 'lucide-react'

export default function Clients() {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients()
  const addToast = useToastStore((s) => s.addToast)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', address: '', password: '', confirm_password: '' })

  const filteredClients = clients.filter(c => {
    const search = searchTerm.toLowerCase();
    return (
      (c.full_name?.toLowerCase() || '').includes(search) ||
      (c.email?.toLowerCase() || '').includes(search) ||
      (c.client_code?.toLowerCase() || '').includes(search)
    )
  })

  const openCreate = () => {
    setSelectedClient(null)
    setFormData({ full_name: '', email: '', phone: '', address: '', password: '', confirm_password: '' })
    setShowModal(true)
  }

  const openEdit = (client) => {
    setSelectedClient(client)
    setFormData({ full_name: client.full_name, email: client.email, phone: client.phone || '', address: client.address || '', password: '', confirm_password: '' })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (!selectedClient) {
        if (!formData.password) throw new Error('Password is required')
        if (formData.password !== formData.confirm_password) throw new Error('Passwords do not match')
        if (formData.password.length < 6) throw new Error('Password must be at least 6 characters')
      }

      if (selectedClient) {
        const { password, confirm_password, ...updateData } = formData
        await updateClient(selectedClient.id, updateData)
        addToast('Client updated successfully', 'success')
      } else {
        await createClient(formData)
        addToast('Client created successfully', 'success')
      }
      setShowModal(false)
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateClient(id, { status })
      addToast(`Client status set to ${status}`, 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteClient(id)
      addToast('Client deleted successfully', 'success')
      setShowDeleteConfirm(null)
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  if (loading) return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><div className="skeleton" style={{ height: '32px', width: '192px' }} /><div className="skeleton" style={{ height: '512px' }} /></div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Clients</h1>
          <p style={{ color: '#64748B' }}>{clients.length} registered clients</p>
        </div>
        <button onClick={openCreate} className="btn-animate" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Add Client
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name, email or code..." style={{ ...inputStyle, paddingLeft: '40px' }} />
      </div>

      {/* Client Cards */}
      {filteredClients.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '64px', textAlign: 'center' }}>
          <Users style={{ width: '48px', height: '48px', color: '#E2E8F0', margin: '0 auto 12px' }} />
          <p style={{ color: '#64748B' }}>No clients found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {filteredClients.map((client) => (
            <div key={client.id} className="card-hover" style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#0F172A', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 700 }}>
                  {client.full_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: '#1E293B' }}>{client.full_name}</p>
                  <p style={{ fontSize: '12px', color: '#0EA5E9', fontWeight: 500 }}>{client.client_code || 'Pending'}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(client)} title="Edit" className="btn-animate" style={{ padding: '8px', color: '#0EA5E9', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', cursor: 'pointer' }}>
                    <Edit2 style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button onClick={() => handleStatusUpdate(client.id, client.status === 'suspended' ? 'active' : 'suspended')} title={client.status === 'suspended' ? 'Unsuspend' : 'Suspend'} className="btn-animate" style={{ padding: '8px', color: '#F59E0B', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', cursor: 'pointer' }}>
                    <Users style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button onClick={() => handleStatusUpdate(client.id, client.status === 'banned' ? 'active' : 'banned')} title={client.status === 'banned' ? 'Unban' : 'Ban'} className="btn-animate" style={{ padding: '8px', color: '#9333EA', background: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '8px', cursor: 'pointer' }}>
                    <ShieldAlert style={{ width: '14px', height: '14px' }} />
                  </button>
                  <button onClick={() => setShowDeleteConfirm(client.id)} title="Delete" className="btn-animate" style={{ padding: '8px', color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', cursor: 'pointer' }}>
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <Users style={{ width: '14px', height: '14px', color: '#94A3B8' }} /> 
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{client.id}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail style={{ width: '14px', height: '14px' }} /> {client.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone style={{ width: '14px', height: '14px' }} /> {client.phone || 'N/A'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar style={{ width: '14px', height: '14px' }} /> 
                  Joined: {new Date(client.created_at).toLocaleDateString('en-IN')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, 
                    background: client.status === 'banned' ? '#FEE2E2' : client.status === 'suspended' ? '#FEF3C7' : '#DCFCE7', 
                    color: client.status === 'banned' ? '#EF4444' : client.status === 'suspended' ? '#D97706' : '#16A34A',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    ● {client.status || 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedClient ? 'Edit Client' : 'Add Client'}</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: '4px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Full Name</label><input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Email</label><input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" style={inputStyle} disabled={!!selectedClient} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Phone</label><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Address (Optional)</label><textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'none' }} /></div>
              
              {!selectedClient && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Password</label><input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" style={inputStyle} /></div>
                  <div><label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Confirm Password</label><input value={formData.confirm_password} onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} type="password" style={inputStyle} /></div>
                </div>
              )}

              <button onClick={handleSave} className="btn-animate" style={{ width: '100%', padding: '14px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '8px' }}>
                {selectedClient ? 'Update Client' : 'Create Client'}
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
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Confirm Deletion</h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>Are you sure you want to delete this client? This action cannot be undone and will remove all associated records.</p>
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
