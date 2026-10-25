import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shield size={20} color="var(--accent)" />
              <strong style={{ fontSize: '16px', color: 'var(--ink)' }}>JejakPublik</strong>
            </div>
            <p style={{ maxWidth: '420px', lineHeight: 1.6, marginBottom: '14px' }}>
              Platform independen penelusuran akuntabilitas dan audit trail anggaran publik Provinsi DKI Jakarta.
              Data bersumber dari LKIP resmi dan Dashboard BPKD tahun anggaran 2025 (periode selesai).
            </p>
            <div className="badge badge-warn">
              Bukan data real-time &middot; Bukan vonis hukum korupsi
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--ink)', fontSize: '14px', marginBottom: '12px' }}>Navigasi Halaman</h4>
            <ul style={{ listStyle: 'none', lineHeight: 2 }}>
              <li><Link to="/">Beranda (43 SKPD)</Link></li>
              <li><Link to="/instansi/lingkungan-hidup">Dinas Lingkungan Hidup</Link></li>
              <li><Link to="/istilah">Glosarium Istilah Resmi</Link></li>
              <li><Link to="/tentang">Metodologi & Sumber</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--ink)', fontSize: '14px', marginBottom: '12px' }}>Sumber Primer</h4>
            <ul style={{ listStyle: 'none', lineHeight: 2 }}>
              <li>
                <a href="https://dashboard-bpkd.jakarta.go.id" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  BPKD DKI Jakarta <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://ppid.jakarta.go.id" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  PPID Laporan Kinerja <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://jdih.kemenkeu.go.id" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  UU APBN 2026 (JDIH) <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <div>
            &copy; 2026 <strong>Tim miamiu</strong> &middot; Karya untuk Multimedia In Action (MIA) 2026 Cabang Web In Action.
          </div>
          <div>
            Dirancang dengan prinsip kejujuran data & akuntabilitas publik.
          </div>
        </div>
      </div>
    </footer>
  );
};
