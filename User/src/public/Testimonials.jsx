import { useEffect, useRef } from 'react'
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react'
import gsap from 'gsap'

export default function Testimonials() {
  const scrollRef = useRef(null)

  const reviews = [
    { name: 'Aditya Sharma', role: 'Business Owner', text: 'Finance Hub has completely changed how I look at my savings. The 12% fixed return is a game changer for my portfolio stability.', rating: 5 },
    { name: 'Priya Verma', role: 'IT Professional', text: 'Simple, transparent, and high-yielding. The dashboard is so easy to use, and I love seeing my monthly returns accurately credited.', rating: 5 },
    { name: 'Rahul Gupta', role: 'Retired Banker', text: 'As a former banker, I was skeptical at first, but their transparency and expert asset management convinced me. Highly recommended.', rating: 5 },
  ]

  return (
    <section style={{ padding: '100px 24px', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ color: '#0EA5E9', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Voices of Trust</span>
          <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#0F172A', marginTop: '12px' }}>What Our Investors Say</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ padding: '40px', background: '#F8FAFC', borderRadius: '32px', border: '1px solid #F1F5F9', position: 'relative', transition: 'transform 0.3s' }}>
              <Quote style={{ position: 'absolute', top: '32px', right: '32px', width: '40px', height: '40px', color: '#0EA5E915' }} />
              <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
                {[...Array(r.rating)].map((_, i) => <Star key={i} style={{ width: '18px', height: '18px', fill: '#FFB800', color: '#FFB800' }} />)}
              </div>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, marginBottom: '24px', fontStyle: 'italic' }}>"{r.text}"</p>
              <div>
                <p style={{ fontWeight: 800, color: '#0F172A', fontSize: '18px' }}>{r.name}</p>
                <p style={{ fontSize: '14px', color: '#64748B', fontWeight: 500 }}>{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
