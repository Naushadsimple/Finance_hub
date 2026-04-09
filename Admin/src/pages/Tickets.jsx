import { useState } from 'react'
import { useSupportTickets } from '../hooks/useSupportTickets'
import { useToastStore } from '../store/toastStore'
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Reply, 
  X,
  User,
  Mail,
  MoreVertical
} from 'lucide-react'

export default function Tickets() {
  const { tickets, loading, updateTicketStatus, replyToTicket } = useSupportTickets()
  const addToast = useToastStore((s) => s.addToast)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = (
      (t.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (t.profiles?.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (t.profiles?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleReply = async () => {
    if (!replyText.trim()) return addToast('Please enter a reply', 'error')
    
    setSubmitting(true)
    try {
      const err = await replyToTicket(selectedTicket.id, replyText)
      if (err) throw err
      addToast('Reply sent and ticket resolved', 'success')
      setSelectedTicket(null)
      setReplyText('')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const err = await updateTicketStatus(id, status)
      if (err) throw err
      addToast(`Status updated to ${status}`, 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="skeleton" style={{ height: '32px', width: '256px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>{[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '100px' }} />)}</div>
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    )
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    pending: tickets.filter(t => t.status === 'in_progress').length,
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Support Tickets</h1>
        <p style={{ color: '#64748B' }}>Manage and respond to user queries</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Tickets', value: stats.total, color: '#3B82F6', bg: '#EFF6FF', icon: MessageSquare },
          { label: 'Open', value: stats.open, color: '#EF4444', bg: '#FEF2F2', icon: AlertCircle },
          { label: 'In Progress', value: stats.pending, color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
          { label: 'Resolved', value: stats.resolved, color: '#10B981', bg: '#F0FDF4', icon: CheckCircle },
        ].map((s, i) => (
          <div key={i} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: s.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon style={{ width: '24px', height: '24px', color: s.color }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#64748B' }}>{s.label}</p>
              <p style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#94A3B8' }} />
          <input 
            type="text" 
            placeholder="Search by subject, name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '12px 16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Tickets List */}
      <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>User</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Subject</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: '#F1F5F9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#64748B' }}>
                      {ticket.profiles?.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{ticket.profiles?.full_name}</p>
                      <p style={{ fontSize: '12px', color: '#64748B' }}>{ticket.profiles?.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#1E293B' }}>{ticket.subject}</p>
                  <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.message}</p>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 600,
                    ...(ticket.status === 'open' ? { background: '#FEF2F2', color: '#EF4444' } :
                      ticket.status === 'in_progress' ? { background: '#FFFBEB', color: '#F59E0B' } :
                      { background: '#F0FDF4', color: '#10B981' })
                  }}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748B' }}>
                  {new Date(ticket.created_at).toLocaleDateString('en-IN')}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      title="Reply"
                      style={{ padding: '8px', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', color: '#0EA5E9', cursor: 'pointer' }}
                    >
                      <Reply style={{ width: '16px', height: '16px' }} />
                    </button>
                    {ticket.status !== 'resolved' && (
                      <button 
                        onClick={() => handleStatusChange(ticket.id, 'in_progress')}
                        title="Mark In Progress"
                        style={{ padding: '8px', background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: '8px', color: '#D97706', cursor: 'pointer' }}
                      >
                        <Clock style={{ width: '16px', height: '16px' }} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTickets.length === 0 && (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <MessageSquare style={{ width: '64px', height: '64px', color: '#E2E8F0', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>No Tickets Found</h3>
            <p style={{ color: '#64748B' }}>Adjust filters or search criteria</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '600px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button 
              onClick={() => setSelectedTicket(null)} 
              style={{ position: 'absolute', right: '24px', top: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <X style={{ width: '24px', height: '24px' }} />
            </button>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User style={{ width: '20px', height: '20px', color: '#64748B' }} />
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700 }}>{selectedTicket.profiles?.full_name}</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>{selectedTicket.profiles?.email}</p>
                </div>
              </div>
              
              <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>User Message</p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>{selectedTicket.subject}</p>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{selectedTicket.message}</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#1E293B' }}>Admin Reply</label>
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response here..."
                rows={5}
                style={{ width: '100%', padding: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '14px', outline: 'none', resize: 'none' }}
              />
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px' }}>Replying will automatically mark this ticket as "Resolved".</p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setSelectedTicket(null)}
                style={{ flex: 1, padding: '14px', border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: 600, color: '#64748B', background: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleReply}
                disabled={submitting}
                style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
            
            {selectedTicket.admin_reply && (
              <div style={{ marginTop: '24px', padding: '16px', background: '#F0FDF4', borderRadius: '16px', border: '1px solid #DCFCE7' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', marginBottom: '4px' }}>Previous Reply</p>
                <p style={{ fontSize: '14px', color: '#1E293B' }}>{selectedTicket.admin_reply}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
