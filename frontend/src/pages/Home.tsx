import React from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  // Daftar 8 Program DLH (Sesuai Figma Frame 01 node-id 90:247)
  const figmaPrograms = [
    {
      nama: 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH PROVINSI',
      apbdp: 'Rp1.304.175.789.368',
      serapan: '85,40%',
    },
    {
      nama: 'PROGRAM PENGELOLAAN PERSAMPAHAN',
      apbdp: 'Rp2.319.315.815.354',
      serapan: '93,03%',
    },
    {
      nama: 'PROGRAM PERENCANAAN LINGKUNGAN HIDUP',
      apbdp: 'Rp3.219.818.500',
      serapan: '95,52%',
    },
    {
      nama: 'PROGRAM PENGENDALIAN PENCEMARAN DAN/ATAU KERUSAKAN LINGKUNGAN HIDUP',
      apbdp: 'Rp67.876.101.084',
      serapan: '95,94%',
    },
    {
      nama: 'PROGRAM PENGENDALIAN BAHAN BERBAHAYA DAN BERACUN (B3) DAN LIMBAH B3',
      apbdp: 'Rp3.684.567.176',
      serapan: '77,43%',
      isCorrected: true,
    },
    {
      nama: 'PROGRAM PEMBINAAN DAN PENGAWASAN TERHADAP IZIN LINGKUNGAN DAN IZIN PERLINDUNGAN DAN PENGELOLAAN LINGKUNGAN HIDUP (PPLH)',
      apbdp: 'Rp6.059.800.956',
      serapan: '93,48%',
    },
    {
      nama: 'PROGRAM PENINGKATAN PENDIDIKAN, PELATIHAN DAN PENYULUHAN LINGKUNGAN HIDUP UNTUK MASYARAKAT',
      apbdp: 'Rp15.075.311.576',
      serapan: '95,65%',
    },
    {
      nama: 'PROGRAM PENANGANAN PENGADUAN LINGKUNGAN HIDUP',
      apbdp: 'Rp439.530.756',
      serapan: '82,88%',
    },
  ];

  return (
    <LayoutShell>
      {/* 1. Hero Container Figma (node-id 90:244) */}
      <section className="figma-hero-wrapper">
        <div className="figma-hero-box">
          <img
            src="/assets/hero-bg-raw.jpg"
            alt="Jakarta City Panorama"
            className="figma-hero-bg"
          />
          <div className="figma-hero-overlay" />
          <div className="figma-hero-content">
            <div className="figma-hero-kicker">
              TAHUN ANGGARAN 2025 &middot; DKI JAKARTA
            </div>
            <h1 className="figma-hero-h1">
              Uang publik Jakarta, sampai ke sub kegiatan
            </h1>
            <p className="figma-hero-p">
              Pagu, realisasi, dan hasil yang dilaporkan pemerintah daerah, lengkap dengan dokumen asalnya. Warga membaca, memeriksa, lalu menilai sendiri.
            </p>
            <div>
              <Link to="/jelajahi" className="figma-hero-btn">
                Jelajahi data <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stat Metrics Banner (4 Kolom Sesuai Figma node-id 90:43) */}
      <section aria-label="Ringkasan 4 Pilar APBD" className="figma-stat-banner">
        <div className="figma-stat-banner-inner">
          <div className="figma-stat-item">
            <span className="figma-stat-label">Instansi</span>
            <div className="figma-stat-number">43</div>
            <span className="figma-stat-sub">Seluruh perangkat daerah</span>
          </div>

          <div className="figma-stat-item">
            <span className="figma-stat-label">Anggaran belanja</span>
            <div className="figma-stat-number">Rp86,0 T</div>
            <span className="figma-stat-sub">Rp85.979.175.838.982</span>
          </div>

          <div className="figma-stat-item">
            <span className="figma-stat-label">Realisasi</span>
            <div className="figma-stat-number">Rp74,2 T</div>
            <span className="figma-stat-sub">Dilaporkan 43 instansi</span>
          </div>

          <div className="figma-stat-item">
            <span className="figma-stat-label">Terserap</span>
            <div className="figma-stat-number">86,30%</div>
            <span className="figma-stat-sub">Terhadap anggaran perubahan</span>
          </div>
        </div>
      </section>

      {/* 3. Feature Banner (Foto Street + 3 Kartu Glass Sesuai Figma node-id 90:246) */}
      <section aria-label="Prinsip Integritas Data" className="figma-features-wrapper">
        <div className="figma-features-box">
          <img
            src="/assets/features-bg-raw.jpg"
            alt="Jakarta Pedestrian Street"
            className="figma-features-bg"
          />
          <div className="figma-features-overlay" />
          <div className="figma-features-grid">
            <div className="figma-glass-card">
              <div className="figma-glass-num">01</div>
              <h3 className="figma-glass-title">Angka dikoreksi</h3>
              <p className="figma-glass-desc">
                Dokumen sumber memuat dua nilai berbeda. Yang dipakai adalah nilai yang cocok dengan total dokumen dan BPKD, disertai riwayat.
              </p>
            </div>

            <div className="figma-glass-card">
              <div className="figma-glass-num">02</div>
              <h3 className="figma-glass-title">Nilai ditahan</h3>
              <p className="figma-glass-desc">
                Bila tidak ada pembanding, angka tidak diubah menjadi nol. Ditulis apa adanya dan tidak dipakai dalam persentase.
              </p>
            </div>

            <div className="figma-glass-card">
              <div className="figma-glass-num">03</div>
              <h3 className="figma-glass-title">Sumber terbuka</h3>
              <p className="figma-glass-desc">
                Setiap angka membawa dokumen, nomor tabel, periode, dan tanggal pengambilan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Daftar 8 Program Pilot DLH (Figma node-id 90:247) */}
      <section aria-label="Program Pilot DLH" className="figma-program-section">
        <div className="figma-program-header">
          <div className="figma-program-tag">01 &middot; Program</div>
          <h2 className="figma-program-title">Delapan program yang bisa ditelusuri</h2>
        </div>

        <div className="figma-program-list">
          {figmaPrograms.map((prog, idx) => (
            <Link
              key={idx}
              to="/instansi/lingkungan-hidup"
              className="figma-program-row"
            >
              <div className="figma-program-left">
                <span className="figma-program-name">{prog.nama}</span>
                {prog.isCorrected && (
                  <span className="figma-badge-corrected">
                    angka dikoreksi
                  </span>
                )}
              </div>
              <div className="figma-program-right">
                <span className="figma-program-nominal">{prog.apbdp}</span>
                <span className="figma-program-pct">{prog.serapan}</span>
                <div className="figma-program-arrow">&rarr;</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </LayoutShell>
  );
};
