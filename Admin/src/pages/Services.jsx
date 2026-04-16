import { useState } from 'react'
import { useServices } from '../hooks/useServices'
import { LayoutGrid, Plus, Edit2, Trash2, X, ShieldAlert, TrendingUp, PieChart, ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import ReactQuill from 'react-quill'

const ICON_OPTIONS = [
  { name: 'TrendingUp', icon: <TrendingUp /> },
  { name: 'PieChart', icon: <PieChart /> },
  { name: 'ShieldCheck', icon: <ShieldCheck /> },
  { name: 'ArrowUpRight', icon: <ArrowUpRight /> },
  { name: 'LayoutGrid', icon: <LayoutGrid /> },
  { name: 'CheckCircle2', icon: <CheckCircle2 /> },
]

export default function Services() {
  const { services, loading, createService, updateService, deleteService } = useServices()
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', icon_name: 'TrendingUp', is_active: true, sort_order: 0 })
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const openEdit = (service) => {
    setSelectedService(service)
    setFormData({
      title: service.title,
      description: service.description || '',
      icon_name: service.icon_name || 'TrendingUp',
      is_active: service.is_active,
      sort_order: service.sort_order || 0,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) return setFormError('Title is required')

    setIsSaving(true)
    setFormError('')

    // Auto-generate slug
    const slug = formData.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const dataToSave = { ...formData, slug }

    try {
      let err;
      if (selectedService) {
        err = await updateService(selectedService.id, dataToSave)
      } else {
        err = await createService(dataToSave)
      }

      if (err) throw err

      setShowModal(false)
      setSelectedService(null)
      setFormData({ title: '', description: '', icon_name: 'TrendingUp', is_active: true, sort_order: 0 })
    } catch (err) {
      setFormError(err.message || 'Error saving service')
    } finally {
      setIsSaving(false)
    }
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  if (loading) return <div className="skeleton" style={{ height: '400px' }} />

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Managed Services</h1>
          <p style={{ color: '#64748B' }}>These services are displayed on the user home page</p>
        </div>
        <button onClick={() => { setSelectedService(null); setFormData({ title: '', description: '', icon_name: 'TrendingUp', is_active: true, sort_order: 0 }); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#0F172A', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus style={{ width: '16px', height: '16px' }} /> Add Service
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {services.map((service) => (
          <div key={service.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', position: 'relative', opacity: service.is_active ? 1 : 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: '#F0F9FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                {ICON_OPTIONS.find(o => o.name === service.icon_name)?.icon || <LayoutGrid />}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(service)} style={{ padding: '8px', color: '#0EA5E9', background: '#F0F9FF', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Edit2 style={{ width: '14px', height: '14px' }} /></button>
                <button onClick={() => setShowDeleteConfirm(service.id)} style={{ padding: '8px', color: '#EF4444', background: '#FEF2F2', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Trash2 style={{ width: '14px', height: '14px' }} /></button>
              </div>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>{service.title}</h3>
            <div
              style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, marginBottom: '16px', maxHeight: '100px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: service.is_active ? '#16A34A' : '#EF4444', padding: '4px 8px', background: service.is_active ? '#DCFCE7' : '#FEE2E2', borderRadius: '6px' }}>
                {service.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{selectedService ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={() => setShowModal(false)} style={{ padding: '8px', background: '#F1F5F9', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} className="hover:scale-110">
                <X style={{ width: '20px', height: '20px', color: '#64748B' }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Title</label>
                <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Mutual Fund" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Position (Sort Order)</label>
                <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} placeholder="0 for first" style={inputStyle} />
                <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Lower numbers (e.g. 0) appear first.</p>
              </div>
              <div style={{ marginBottom: '40px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Description</label>
                <div style={{ height: '200px' }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(val) => setFormData({ ...formData, description: val })}
                    style={{ height: '150px' }}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['link'],
                        ['clean'],
                        [{ 'color': [] }, { 'background': [] }]
                      ],
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Icon</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                  {ICON_OPTIONS.map(opt => (
                    <button key={opt.name} onClick={() => setFormData({ ...formData, icon_name: opt.name })} style={{ padding: '12px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', ...(formData.icon_name === opt.name ? { background: '#0F172A', color: '#FFFFFF', borderColor: '#0F172A' } : { background: '#FFFFFF', color: '#64748B', borderColor: '#E2E8F0' }) }}>
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} id="is_active" />
                <label htmlFor="is_active" style={{ fontSize: '14px', cursor: 'pointer' }}>Visible to users</label>
              </div>
              {formError && <div style={{ color: '#EF4444', fontSize: '13px', background: '#FEF2F2', padding: '10px', borderRadius: '8px' }}>{formError}</div>}

              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  width: '100%', padding: '14px', background: '#0F172A', color: '#FFFFFF',
                  borderRadius: '12px', fontWeight: 700, border: 'none',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? 'Saving...' : (selectedService ? 'Update Service' : 'Create Service')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '24px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#FEF2F2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <ShieldAlert style={{ width: '32px', height: '32px' }} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Delete Service</h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>Are you sure? This will remove the service from the home page for all users.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#1E293B', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { deleteService(showDeleteConfirm); setShowDeleteConfirm(null); }} style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
