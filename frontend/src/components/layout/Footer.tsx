import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-foot" role="contentinfo">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shield size={22} color="var(--accent)" aria-hidden="true" />
              <strong style={{ fontSize: '17px', color: 'var(--ink)' }}>JejakPublik</strong>
            </div>
            <p style={{ maxWidth: '440px', lineHeight: 1.6, marginBottom: '14px', color: 'var(--ink-soft)' }}>
              Platform web independen penelusuran akuntabilitas dan audit trail anggaran publik Provinsi DKI Jakarta.
              Menyajikan data resmi apa adanya, menandai salah ketik terbuka, dan meluruskan istilah akuntansi publik.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '440px' }}>
              <div className="badge badge-warn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={13} aria-hidden="true" />
                Bukan data real-time &middot; Bukan vonis hukum korupsi
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} aria-hidden="true" />
                Data ditarik resmi dari BPKD/LKIP: <strong>21 Oktober 2026</strong> (TA 2025 Selesai)
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--ink)', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Navigasi Platform</h4>
            <ul style={{ listStyle: 'none', lineHeight: 2.1 }}>
              <li><Link to="/">Beranda (Ringkasan 43 SKPD)</Link></li>
              <li><Link to="/instansi/lingkungan-hidup">Pilot Dinas Lingkungan Hidup</Link></li>
              <li><Link to="/istilah">Glosarium & Pelurus Istilah</Link></li>
              <li><Link to="/tentang">Metodologi & Sumber Primer</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--ink)', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Dokumen Sumber Primer</h4>
            <ul style={{ listStyle: 'none', lineHeight: 2.1 }}>
              <li>
                <a
                  href="https://dashboard-bpkd.jakarta.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  Dashboard Keuangan BPKD <ExternalLink size={12} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://ppid.jakarta.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  LKIP DLH 2025 (PPID DKI) <ExternalLink size={12} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://jdih.kemenkeu.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  JDIH Regulasi Keuangan <ExternalLink size={12} aria-hidden="true" />
                </a>
              </li>
              <li style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                <CheckCircle size={12} color="var(--success)" style={{ display: 'inline', marginRight: '4px' }} />
                Tabel 2.4, 3.33, 3.34, 3.35 LKIP
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <div>
            &copy; 2026 <strong>Tim miamiu</strong> (Zayyan, Mahdi, Liaurentino) &middot; Multimedia In Action (MIA 2026) Web In Action.
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '12.5px' }}>
            Transparansi Radikal &middot; Menghormati Angka Asli &middot; Audit Trail Terbuka
          </div>
        </div>
      </div>
    </footer>
  );
};
