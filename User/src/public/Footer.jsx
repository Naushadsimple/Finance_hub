import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="sm:p-24 sm:pb-10" style={{ background: '#0F172A', color: '#FFFFFF', padding: '64px 16px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-15 sm:mb-20 gap-[48px] mb-[64px]">
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: '#0EA5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp style={{ color: '#FFFFFF', width: '24px', height: '24px' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>Finance<span style={{ color: '#0EA5E9' }}>Hub</span></span>
            </div>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, marginBottom: '32px', maxWidth: '320px', fontSize: '15px' }}>
              Empowering individuals to achieve financial freedom through secure, high-yield investment opportunities.
            </p>

          </div>

          {/* Quick Links */}
          <div className="sm:pl-8">
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Home', 'About Us', 'Services', 'Investment Plan', 'Calculator'].map(link => (
                <li key={link}><a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }}>{link}</a></li>
              ))}
            </ul>
          </div>



          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9', flexShrink: 0 }}><Mail style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Email us at</p>
                  <p style={{ fontSize: '14px', color: '#FFFFFF', margin: 0, fontWeight: 600 }} className="sm:text-15">support@financehub.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sm:flex-row sm:justify-between border-t border-white/5 pt-10 flex flex-col gap-6 items-center">
          <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center' }}>
            © {new Date().getFullYear()} Finance Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function TrendingUp(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}


