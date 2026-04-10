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
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '64px 20px', textAlign: 'center' }} className="sm:p-16">
          <FileText style={{ width: '48px', height: '48px', color: '#E2E8F0', margin: '0 auto 16px' }} className="sm:w-16 sm:h-16" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No Certificates Yet</h3>
          <p style={{ color: '#64748B', fontSize: '14px' }}>Your investment certificates will appear here once issued.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
          {certificates.map((cert) => (
            <div key={cert.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', transition: 'all 0.3s' }} className="sm:p-6">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', background: '#E0F2FE', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="sm:w-12 sm:h-12">
                  <FileText style={{ width: '22px', height: '22px', color: '#0EA5E9' }} className="sm:w-6 sm:h-6" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: '#1E293B', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="sm:text-15">{cert.certificate_number}</p>
                  <p style={{ fontSize: '11px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="sm:text-12">{cert.file_name}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }} className="sm:text-14">
                  <Calendar style={{ width: '15px', height: '15px' }} className="sm:w-4 sm:h-4" />
                  Issued: {new Date(cert.issued_date).toLocaleDateString('en-IN')}
                </div>
                {cert.investments && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }} className="sm:text-14">
                    <Eye style={{ width: '15px', height: '15px' }} className="sm:w-4 sm:h-4" />
                    Value: {formatCurrency(cert.investments?.principal)}
                  </div>
                )}
              </div>

              <button onClick={() => downloadCertificate(cert.file_path)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#E0F2FE', color: '#0369A1', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px' }}>
                <Download style={{ width: '18px', height: '18px' }} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
