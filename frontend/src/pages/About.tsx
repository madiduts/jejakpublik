import React from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { AlertTriangle, Users, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <LayoutShell>
      <div className="wrap">
        <Breadcrumbs items={[{ label: 'Tentang & Keterbatasan' }]} />

        <div className="pagehead">
          <div>
            <h1>Tentang JejakPublik & Batas Keterbatasan</h1>
            <div className="meta">
              Komitmen transparansi data publik, metodologi penelusuran audit, dan batasan tanggung jawab platform.
            </div>
          </div>
          <span className="badge badge-accent">
            <Award size={14} /> Multimedia In Action 2026 &middot; Web In Action
          </span>
        </div>

        {/* Section 1: Visi & Nilai Inti */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '12px' }}>
            Visi Kami: Dari Anggaran, Terlihat Hasilnya
          </h2>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--ink-soft)', marginBottom: '16px' }}>
            JejakPublik lahir dari keresahan bahwa informasi anggaran pemerintah sering disajikan dalam bentuk dashboard pasif 
            atau dokumen PDF ratusan halaman yang sulit ditelusuri warga. Warga yang ingin memeriksa aliran dana publik 
            dihadapkan pada istilah rumit, angka yang terputus dari hasil pekerjaan, dan portal resmi yang cenderung 
            meratakan anomali cetak tanpa penjelasan.
          </p>
          <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            Nilai utama yang kami bawa bukan sekadar memvisualisasikan angka, melainkan <strong>menguji dan memverifikasi integritas data</strong>: 
            menandai salah ketik resmi secara terbuka, menahan data yang hierarkinya bermasalah, dan menyajikan audit trail yang bisa diverifikasi hingga nomor tabel dokumen aslinya.
          </p>
        </div>

        {/* Section 2: Keterbatasan & Anti-Goals (Honesty) */}
        <div style={{ background: '#FFFDF5', border: '1px solid var(--warn-line)', borderRadius: '12px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertTriangle size={22} color="var(--warn)" />
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#78350F' }}>
              Batasan Tanggung Jawab & Hal yang Tidak Kami Klaim
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '14px', fontSize: '14px', color: '#78350F', lineHeight: 1.6 }}>
            <div>
              <strong>1. Bukan Data Real-Time:</strong> Seluruh dataset adalah laporan tahunan periode selesai (Tahun Anggaran 2025) yang sudah melalui pembukuan resmi BPKD dan dokumen LKIP. Kami tidak mengklaim integrasi API real-time pemerintah.
            </div>
            <div>
              <strong>2. Bukan Vonis Hukum atau Dakwaan Korupsi:</strong> Selisih angka, sisa anggaran, atau kesalahan salin pada dokumen resmi disajikan sebagai fakta audit data administratif, bukan bukti tindak pidana korupsi. Keputusan hukum berada di tangan penegak hukum dan BPK.
            </div>
            <div>
              <strong>3. Bukan Kanal Aduan Fisik Lapangan Pengganti JAKI/SP4N-LAPOR:</strong> Platform ini berfokus pada audit keterbukaan informasi anggaran dan kinerja administratif, bukan menjanjikan tindak lanjut fisik perbaikan infrastruktur di jalan oleh pemda.
            </div>
            <div>
              <strong>4. Asimetri Kedalaman Data:</strong> Saat ini baru Dinas Lingkungan Hidup yang datanya berhasil ditelusuri sampai tingkat subkegiatan dan indikator kinerja karena format pelaporan LKIP antar-dinas di DKI Jakarta belum seragam.
            </div>
            <div>
              <strong>5. Tanpa Pengumpulan Identitas Asli:</strong> Platform tidak pernah mengumpulkan data pribadi warga seperti NIK, foto KTP asli, atau biometrik.
            </div>
          </div>
        </div>

        {/* Section 3: Tim Pengembang */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '28px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Users size={22} color="var(--accent)" />
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--ink)' }}>
              Tim Pengembang — Tim miamiu
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '16px' }}>
              <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>Muhammad Zayyan Rizka</strong>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600, marginTop: '2px' }}>
                Ketua Tim &middot; Data & Knowledge Lead
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5 }}>
                Memimpin riset sumber primer BPKD/LKIP, verifikasi rekonsiliasi angka, arsitektur indikator kinerja, dan narasi presentasi.
              </p>
            </div>

            <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '16px' }}>
              <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>Mahdi Imantaka Sutejo</strong>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600, marginTop: '2px' }}>
                Lead Frontend & Data Engine
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5 }}>
                Membangun arsitektur React, komponen engine status angka (normal, dikoreksi, ditahan), hierarki interaktif DLH, dan pipeline data.
              </p>
            </div>

            <div style={{ background: 'var(--bg)', borderRadius: '8px', padding: '16px' }}>
              <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>Liaurentino</strong>
              <div style={{ fontSize: '12.5px', color: 'var(--accent)', fontWeight: 600, marginTop: '2px' }}>
                UI/UX & Frontend Developer
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '8px', lineHeight: 1.5 }}>
                Merancang sitemap, sistem tata letak halaman Beranda, responsivitas multi-perangkat, dan katalog interaktif 43 SKPD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
};
