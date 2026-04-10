import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useSupport } from '../../hooks/useSupport'
import { useToastStore } from '../../store/toastStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HelpCircle, Send, ChevronDown, MessageSquare, Clock, Mail, Phone } from 'lucide-react'

const ticketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const faqs = [
  { q: 'How does the 1% monthly return work?', a: 'You invest a principal amount, and every month you earn 1% of that principal as interest. This means 12% annual returns on your investment.' },
  { q: 'When can I withdraw my investment?', a: 'You can withdraw your investment after the agreed tenure is completed. Early withdrawal may have different terms — contact admin for details.' },
  { q: 'How do I download my certificate?', a: 'Go to the Certificates page, find your certificate, and click the Download button. A secure signed URL will be generated for your download.' },
  { q: 'Can I change my email address?', a: 'Email changes require admin intervention for security. Please contact support to update your email.' },
  { q: 'How is my investment secured?', a: 'All investments are tracked digitally with official certificates. The platform uses bank-grade encryption and security measures.' },
]

export default function Support() {
  const { tickets, loading, createTicket } = useSupport()
  const addToast = useToastStore((s) => s.addToast)
  const [openFaq, setOpenFaq] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(ticketSchema),
  })

  const toggleFaq = (i) => {
    setOpenFaq(openFaq === i ? null : i)
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await createTicket(data.subject, data.message)
      setSuccess(true)
      addToast('Ticket raised! Support Team will contact you soon.', 'success')
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to raise ticket', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', marginBottom: '24px' }}>Support</h1>

      <div style={{ display: 'grid', gap: '24px' }} className="grid-cols-1 lg:grid-cols-2 lg:gap-8">
        {/* FAQs */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <button onClick={() => toggleFaq(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{faq.q}</span>
                  <ChevronDown style={{ width: '20px', height: '20px', color: '#64748B', transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 16px 16px', fontSize: '14px', color: '#64748B', lineHeight: 1.7 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Contact Us</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a href="mailto:support@financehub.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', background: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail style={{ width: '16px', height: '16px', color: '#0EA5E9' }} />
                </div>
                support@financehub.com
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', background: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone style={{ width: '16px', height: '16px', color: '#22C55E' }} />
                </div>
                WhatsApp: +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        {/* Ticket Form + History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Submit a Ticket</h2>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
              {success && <div style={{ background: '#DCFCE7', color: '#16A34A', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px' }}>Ticket submitted successfully!</div>}
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Subject</label>
                  <select {...register('subject')} style={{ ...inputStyle, background: '#FFFFFF' }}>
                    <option value="">Select a topic</option>
                    <option value="Investment Query">Investment Query</option>
                    <option value="Certificate Issue">Certificate Issue</option>
                    <option value="Account Issue">Account Issue</option>
                    <option value="Technical Problem">Technical Problem</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.subject.message}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Message</label>
                  <textarea {...register('message')} rows={4} placeholder="Describe your issue..." style={{ ...inputStyle, resize: 'none' }} />
                  {errors.message && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={submitting} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: 'linear-gradient(135deg, #0EA5E9, #0369A1)', color: '#FFFFFF', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, fontSize: '15px' }}>
                  {submitting ? 'Submitting...' : <><Send style={{ width: '16px', height: '16px' }} /> Submit Ticket</>}
                </button>
              </form>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Your Tickets</h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{[1, 2].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '16px' }} />)}</div>
            ) : tickets.length === 0 ? (
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '48px', textAlign: 'center' }}>
                <MessageSquare style={{ width: '40px', height: '40px', color: '#E2E8F0', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '14px', color: '#64748B' }}>No tickets submitted yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tickets.map((ticket) => (
                  <div key={ticket.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{ticket.subject}</span>
                      <span style={{
                        padding: '4px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700,
                        ...(ticket.status === 'open' ? { background: '#FEF3C7', color: '#D97706' } :
                          ticket.status === 'in_progress' ? { background: '#DBEAFE', color: '#2563EB' } :
                          { background: '#DCFCE7', color: '#16A34A' })
                      }}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{ticket.message}</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '12px', height: '12px' }} /> {new Date(ticket.created_at).toLocaleDateString('en-IN')}
                    </p>
                    {ticket.admin_reply && (
                      <div style={{ marginTop: '12px', padding: '12px', background: '#E0F2FE', borderRadius: '12px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#0369A1', marginBottom: '4px' }}>Admin Reply</p>
                        <p style={{ fontSize: '14px', color: '#1E293B' }}>{ticket.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
