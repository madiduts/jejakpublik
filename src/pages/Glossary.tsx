import React from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export const Glossary: React.FC = () => {
  const terms = [
    {
      term: 'APBD Penetapan (Pagu Awal)',
      definition:
        'Anggaran Pendapatan dan Belanja Daerah yang disetujui bersama oleh Pemerintah Daerah dan DPRD pada awal tahun anggaran melalui Peraturan Daerah (Perda). Menjadi plafon batas belanja awal sebelum dilakukan evaluasi berkala.',
      example: 'DLH DKI 2025 ditetapkan awal sebesar Rp3.800.927.272.668.',
    },
    {
      term: 'APBD Perubahan (APBD-P)',
      definition:
        'Penyesuaian resmi atas APBD berjalan yang disahkan di pertengahan tahun karena adanya pergeseran prioritas belanja, perubahan proyeksi pendapatan, atau kebijakan efisiensi nasional (seperti Inpres No. 1 Tahun 2025).',
      example: 'DLH DKI 2025 disesuaikan menjadi Rp3.719.846.734.770 (turun Rp81,08 Miliar).',
      highlight: true,
    },
    {
      term: 'Realisasi Belanja',
      definition:
        'Jumlah dana kas daerah yang secara aktual telah dibelanjakan dan dipertanggungjawabkan oleh instansi pelaksana untuk menyelesaikan program, kegiatan, dan subkegiatan hingga akhir periode anggaran.',
      example: 'Realisasi belanja DLH 2025 adalah Rp3.362.947.632.852.',
    },
    {
      term: 'Terserap / Rasio Penyerapan (%)',
      definition:
        'Persentase perbandingan antara Realisasi Belanja terhadap Anggaran Perubahan. Di dokumen resmi LKIP, persentase serapan selalu dihitung terhadap APBD-P, bukan penetapan awal.',
      example: 'Realisasi DLH Rp3,36 T dibagi APBD-P Rp3,71 T = 90,40% terserap.',
    },
    {
      term: 'Efisiensi Anggaran (Peringatan Semantik!)',
      definition:
        'Dalam dokumen LKIP dan pelaporan akuntansi instansi pemerintah, "Jumlah Efisiensi" adalah istilah resmi untuk sisa anggaran yang tidak terserap (APBD-P dikurangi Realisasi). Ini BUKAN berarti dinas berhasil menghemat ongkos pekerjaan, melainkan ada anggaran yang tidak habis dibelanjakan.',
      example: 'Sisa Rp356,89 Miliar pada DLH dicatat di LKIP sebagai "jumlah efisiensi 9,60%".',
      warning: true,
    },
    {
      term: 'Tiga Pilar Anggaran Daerah (PPKD)',
      definition:
        'Struktur APBD terbagi menjadi 3 kelompok mandiri: (1) Pendapatan, (2) Belanja, dan (3) Pembiayaan. Ketiganya tidak boleh dijumlahkan secara sembarangan karena memiliki fungsi perbendaharaan yang berbeda.',
      example: 'Dinas Kesehatan mengelola Pendapatan Rp3,38 T dan Belanja Rp11,42 T secara terpisah.',
    },
    {
      term: 'Keadaan Angka: Normal, Dikoreksi, Ditahan',
      definition:
        'Standar integritas data JejakPublik: "Normal" untuk data konsisten, "Dikoreksi" bila dokumen cetak salah ketik dan ada sumber pembanding terverifikasi, serta "Ditahan" bila terjadi inkonsistensi hierarki internal tanpa sumber pembanding.',
      example: 'Program B3 dikoreksi; Subkegiatan Gaji ASN ditahan.',
      highlight: true,
    },
  ];

  return (
    <LayoutShell>
      <div className="wrap">
        <Breadcrumbs items={[{ label: 'Penjelasan Istilah' }]} />

        <div className="pagehead">
          <div>
            <h1>Penjelasan Istilah & Glosarium Anggaran</h1>
            <div className="meta">
              Panduan memahami terminologi resmi APBD dan Laporan Kinerja agar warga tidak salah menafsirkan angka.
            </div>
          </div>
          <span className="badge badge-accent">
            <BookOpen size={14} /> Berdasarkan Standar LKIP & Permendagri
          </span>
        </div>

        <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
          {terms.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface)',
                border: t.warning ? '1px solid var(--warn-line)' : t.highlight ? '1px solid #99F6E4' : '1px solid var(--line)',
                borderLeft: t.warning ? '5px solid var(--warn)' : t.highlight ? '5px solid var(--accent)' : '5px solid var(--line-strong)',
                borderRadius: '10px',
                padding: '20px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: t.warning ? 'var(--warn)' : 'var(--ink)' }}>
                  {t.term}
                </h3>
                {t.warning && (
                  <span className="badge badge-warn">
                    <AlertCircle size={12} /> Sering Disalahartikan
                  </span>
                )}
                {t.highlight && (
                  <span className="badge badge-accent">
                    <CheckCircle size={12} /> Konsep Kunci
                  </span>
                )}
              </div>

              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '12px' }}>
                {t.definition}
              </p>

              {t.example && (
                <div
                  style={{
                    background: t.warning ? '#FFFDF5' : 'var(--bg)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    color: 'var(--muted)',
                  }}
                >
                  <strong style={{ color: 'var(--ink)' }}>Contoh Nyata:</strong> {t.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </LayoutShell>
  );
};
