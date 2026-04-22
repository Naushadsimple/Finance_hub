import { useEffect, useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import gsap from 'gsap'

export default function Testimonials() {
  const scrollRef = useRef(null)

  const reviews = [
    { name: 'Aditya Sharma', role: 'Business Owner', text: 'Finance Hub has completely changed how I look at my savings. The 12% fixed return is a game changer for my portfolio stability.', rating: 5 },
    { name: 'Priya Verma', role: 'IT Professional', text: 'Simple, transparent, and high-yielding. The dashboard is so easy to use, and I love seeing my monthly returns accurately credited.', rating: 5 },
    { name: 'Rahul Gupta', role: 'Retired Banker', text: 'As a former banker, I was skeptical at first, but their transparency and expert asset management convinced me. Highly recommended.', rating: 5 },
  ]

  return (
    <section style={{ padding: '80px 20px', background: '#FFFFFF' }} className="sm:py-24 sm:px-8">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px' }}>Voices of Trust</span>
          <h2 style={{ fontWeight: 900, color: '#0F172A', marginTop: '12px', letterSpacing: '-1px' }} className="text-2xl sm:text-4xl">What Our Investors Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              style={{
                background: '#F8FAFC',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '32px',
                position: 'relative',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
              className="sm:p-10 card-hover"
            >
              <Quote style={{ position: 'absolute', top: '28px', right: '28px', width: '36px', height: '36px', color: '#E2E8F0' }} />
              <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                {[...Array(r.rating)].map((_, i) => <Star key={i} style={{ width: '16px', height: '16px', fill: '#FFB800', color: '#FFB800' }} />)}
              </div>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, marginBottom: '24px', fontStyle: 'italic' }}>"{r.text}"</p>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <p style={{ fontWeight: 800, color: '#0F172A', fontSize: '16px' }}>{r.name}</p>
                <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
