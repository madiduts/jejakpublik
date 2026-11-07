import React from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <LayoutShell>
      {/* Hero Visual Container Frame 06 Tentang (node-id 95:198) */}
      <div className="figma-hero-wrapper" style={{ marginBottom: '32px' }}>
        <div className="figma-hero-box" style={{ minHeight: '320px', padding: '48px 32px' }}>
          <img
            src="/assets/hero-bg-raw.jpg"
            alt="Tentang JejakPublik"
            className="figma-hero-bg"
          />
          <div className="figma-hero-overlay" />
          <div className="figma-hero-content" style={{ maxWidth: '840px' }}>
            <div className="figma-breadcrumb" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.85)' }}>Beranda</Link>
              <span className="sep" style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
              <span className="current" style={{ color: '#ffffff' }}>Tentang</span>
            </div>
            <h1 className="figma-hero-h1" style={{ fontSize: '42px', marginBottom: '12px' }}>
              Tentang JejakPublik
            </h1>
            <p className="figma-hero-p" style={{ marginBottom: 0 }}>
              Portal informasi anggaran publik. Warga membaca fakta, sumber, dan keterbatasannya, lalu menilai sendiri.
            </p>
          </div>
        </div>
      </div>

      <div className="figma-container" style={{ paddingTop: 0 }}>
        {/* Section 01: Cakupan dan Periode Sesuai Figma node-id 95:35 */}
        <div className="figma-program-section" style={{ padding: 0, margin: '0 0 48px' }}>
          <div className="figma-program-header">
            <div className="figma-program-tag">01 &middot; Cakupan dan Periode</div>
            <h2 className="figma-program-title">Dua lapis keterbukaan anggaran</h2>
          </div>

          <div className="figma-stat-grid" style={{ margin: '24px 0' }}>
            <div className="figma-stat-card">
              <span className="figma-stat-label">Lapis Luas</span>
              <div className="figma-stat-value" style={{ fontSize: '24px' }}>43 Instansi</div>
              <span className="figma-stat-subtext">Dashboard Keuangan BPKD DKI tingkat dinas</span>
            </div>
            <div className="figma-stat-card">
              <span className="figma-stat-label">Lapis Dalam</span>
              <div className="figma-stat-value" style={{ fontSize: '24px' }}>Pilot DLH</div>
              <span className="figma-stat-subtext">8 Program, 15 Kegiatan, 33 Subkegiatan LKIP 2025</span>
            </div>
          </div>
        </div>

        {/* Section 02: Batas Tanggung Jawab / Keterbatasan */}
        <div className="figma-program-section" style={{ padding: 0, margin: '0 0 48px' }}>
          <div className="figma-program-header">
            <div className="figma-program-tag">02 &middot; Batas Sistem</div>
            <h2 className="figma-program-title">Hal yang tidak kami klaim</h2>
          </div>

          <div className="figma-feature-grid" style={{ margin: '24px 0' }}>
            <div className="figma-feature-card">
              <div className="figma-feature-num">01</div>
              <h3 className="figma-feature-title">Bukan data real-time</h3>
              <p className="figma-feature-desc">
                Data bersumber dari dokumen resmi tahun anggaran 2025 (periode selesai) bertanggal penarikan 21 Oktober 2026.
              </p>
            </div>

            <div className="figma-feature-card">
              <div className="figma-feature-num">02</div>
              <h3 className="figma-feature-title">Bukan kanal pengaduan</h3>
              <p className="figma-feature-desc">
                JejakPublik adalah sarana audit independen warga, bukan sistem layanan tiket pengaduan pemerintah resmi.
              </p>
            </div>

            <div className="figma-feature-card">
              <div className="figma-feature-num">03</div>
              <h3 className="figma-feature-title">Bukan vonis korupsi</h3>
              <p className="figma-feature-desc">
                Anomali angka ditandai untuk menjaga keabsahan dokumen dan transparansi, bukan bentuk penetapan tindak pidana hukum.
              </p>
            </div>
          </div>
        </div>

        {/* Section 03: Profil Tim miamiu */}
        <div className="figma-program-section" style={{ padding: 0, margin: '0 0 48px' }}>
          <div className="figma-program-header">
            <div className="figma-program-tag">03 &middot; Pengembang</div>
            <h2 className="figma-program-title">Tim miamiu &middot; MIA 2026</h2>
          </div>
          <p style={{ fontSize: '14.5px', color: 'var(--text-sub)', lineHeight: 1.6 }}>
            Karya kompetisi Multimedia In Action (MIA 2026) cabang Web In Action (WIA). Dikembangkan oleh Muhammad Zayyan Rizka, Mahdi Imantaka Sutejo, dan Liaurentino.
          </p>
        </div>
      </div>
    </LayoutShell>
  );
};
