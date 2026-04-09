import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#FFFFFF', padding: '80px 24px 40px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '60px', marginBottom: '80px' }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: '#0EA5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp style={{ color: '#FFFFFF', width: '24px', height: '24px' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>Finance<span style={{ color: '#0EA5E9' }}>Hub</span></span>
            </div>
            <p style={{ color: '#94A3B8', lineHeight: 1.8, marginBottom: '32px', maxWidth: '320px' }}>
              Empowering individuals to achieve financial freedom through secure, high-yield investment opportunities.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', transition: '0.3s' }}>
                  <Icon style={{ width: '18px', height: '18px' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Home', 'About Us', 'Services', 'Investment Plan', 'Calculator'].map(link => (
                <li key={link}><a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '15px' }}>{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Help Center', 'Safety Center', 'Community', 'Terms of Service', 'Privacy Policy'].map(link => (
                <li key={link}><a href="#" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '15px' }}>{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Contact Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9' }}><Mail style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Email us at</p>
                  <p style={{ fontSize: '15px', color: '#FFFFFF', margin: 0, fontWeight: 600 }}>support@financehub.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9' }}><Phone style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Call us at</p>
                  <p style={{ fontSize: '15px', color: '#FFFFFF', margin: 0, fontWeight: 600 }}>+91 98765 43210</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ color: '#0EA5E9' }}><MapPin style={{ width: '20px', height: '20px' }} /></div>
                <div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>Visit our office</p>
                  <p style={{ fontSize: '15px', color: '#FFFFFF', margin: 0, fontWeight: 600 }}>Financial District, Gachibowli, Hyderabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            © {new Date().getFullYear()} Finance Hub. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Terms of Service</a>
          </div>
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

function Facebook(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function Twitter(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>; }
function Instagram(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>; }
function Linkedin(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>; }
