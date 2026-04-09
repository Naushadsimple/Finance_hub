import { useCertificates } from '../../hooks/useCertificates'
import { formatCurrency } from '../../utils/formatCurrency'
import { FileText, Download, Eye, Calendar } from 'lucide-react'

export default function Certificates() {
  const { certificates, loading, downloadCertificate } = useCertificates()

  if (loading) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}><div className="skeleton" style={{ height: '32px', width: '192px' }} />{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '128px' }} />)}</div>
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', marginBottom: '24px' }}>My Certificates</h1>

      {certificates.length === 0 ? (
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '64px', textAlign: 'center' }}>
          <FileText style={{ width: '64px', height: '64px', color: '#E2E8F0', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No Certificates Yet</h3>
          <p style={{ color: '#64748B' }}>Your investment certificates will appear here once issued.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {certificates.map((cert) => (
            <div key={cert.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: '#E0F2FE', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText style={{ width: '24px', height: '24px', color: '#0EA5E9' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1E293B' }}>{cert.certificate_number}</p>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>{cert.file_name}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748B' }}>
                  <Calendar style={{ width: '16px', height: '16px' }} />
                  Issued: {new Date(cert.issued_date).toLocaleDateString('en-IN')}
                </div>
                {cert.investments && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#64748B' }}>
                    <Eye style={{ width: '16px', height: '16px' }} />
                    Investment: {formatCurrency(cert.investments.principal)}
                  </div>
                )}
              </div>

              <button onClick={() => downloadCertificate(cert.file_path)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#E0F2FE', color: '#0369A1', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                <Download style={{ width: '16px', height: '16px' }} /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
