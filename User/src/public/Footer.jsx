import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="sm:p-24 sm:pb-10" style={{ background: '#0F172A', color: '#FFFFFF', padding: '64px 16px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[64px] mb-[64px] md:mb-20">
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: '#0EA5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp style={{ color: '#FFFFFF', width: '24px', height: '24px' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>Finance<span style={{ color: '#0EA5E9' }}>Hub</span></span>
            </div>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, marginBottom: '32px', maxWidth: '360px', fontSize: '15px' }}>
              Empowering individuals to achieve financial freedom through secure, high-yield investment opportunities.
            </p>
          </div>

          {/* Contact Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }} className="md:pl-12">
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '32px', color: '#FFFFFF', position: 'relative' }}>
              Contact Us
              <span style={{ position: 'absolute', bottom: '-8px', left: 0, width: '40px', height: '3px', background: '#0EA5E9', borderRadius: '2px' }}></span>
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9', flexShrink: 0 }}><Mail style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Email us at</p>
                  <p style={{ fontSize: '14px', color: '#FFFFFF', margin: 0, fontWeight: 600 }} className="sm:text-15">support@financehubonline.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9', flexShrink: 0 }}><Phone style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Call us</p>
                  <p style={{ fontSize: '14px', color: '#FFFFFF', margin: 0, fontWeight: 600 }} className="sm:text-15">+91 2235323769</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9', flexShrink: 0 }}><MapPin style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Address 1</p>
                  <p style={{ fontSize: '13px', color: '#FFFFFF', margin: 0, lineHeight: 1.5 }}>25, Ramanathan Street, Kilpauk, Chennai, Tamil Nadu – 600010</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9', flexShrink: 0 }}><MapPin style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Address 2</p>
                  <p style={{ fontSize: '13px', color: '#FFFFFF', margin: 0, lineHeight: 1.5 }}>46, Travelers Bungalow Road, Arasaradi, Madurai, Tamil Nadu – 625010</p>
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


