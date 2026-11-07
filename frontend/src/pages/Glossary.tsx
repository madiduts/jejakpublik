import React, { useState } from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Link } from 'react-router-dom';

export const Glossary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
    },
    {
      term: 'Efisiensi Anggaran (Peringatan Semantik!)',
      definition:
        'Dalam dokumen LKIP dan pelaporan akuntansi instansi pemerintah, "Jumlah Efisiensi" adalah istilah resmi untuk sisa anggaran yang tidak terserap (APBD-P dikurangi Realisasi). Ini BUKAN berarti dinas berhasil menghemat ongkos pekerjaan, melainkan ada anggaran yang tidak habis dibelanjakan.',
      example: 'Sisa Rp356,89 Miliar pada DLH dicatat di LKIP sebagai "jumlah efisiensi 9,60%".',
    },
    {
      term: 'Keadaan Angka: Normal, Dikoreksi, Ditahan',
      definition:
        'Standar integritas data JejakPublik: "Normal" untuk data konsisten, "Dikoreksi" bila dokumen cetak salah ketik dan ada sumber pembanding terverifikasi, serta "Ditahan" bila terjadi inkonsistensi hierarki internal tanpa sumber pembanding.',
      example: 'Program B3 dikoreksi; Subkegiatan Gaji ASN ditahan.',
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
      term: 'Tiga Pilar Anggaran Daerah (PPKD)',
      definition:
        'Struktur APBD terbagi menjadi 3 kelompok mandiri: (1) Pendapatan, (2) Belanja, dan (3) Pembiayaan. Ketiganya tidak boleh dijumlahkan secara sembarangan karena memiliki fungsi perbendaharaan yang berbeda.',
      example: 'Dinas Kesehatan mengelola Pendapatan Rp3,38 T dan Belanja Rp11,42 T secara terpisah.',
    },
  ];

  const filteredTerms = terms.filter((t) => {
    const matchQuery = t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
    const matchLetter = selectedLetter ? t.term.toUpperCase().startsWith(selectedLetter) : true;
    return matchQuery && matchLetter;
  });

  return (
    <LayoutShell>
      {/* Hero Visual Container Frame 05 Glosarium (node-id 94:245) */}
      <div className="figma-hero-wrapper" style={{ marginBottom: '32px' }}>
        <div className="figma-hero-box" style={{ minHeight: '320px', padding: '48px 32px' }}>
          <img
            src="/assets/features-bg-raw.jpg"
            alt="Glosarium Istilah"
            className="figma-hero-bg"
          />
          <div className="figma-hero-overlay" />
          <div className="figma-hero-content" style={{ maxWidth: '840px' }}>
            <div className="figma-breadcrumb" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.85)' }}>Beranda</Link>
              <span className="sep" style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
              <span className="current" style={{ color: '#ffffff' }}>Glosarium</span>
            </div>
            <h1 className="figma-hero-h1" style={{ fontSize: '42px', marginBottom: '12px' }}>
              Glosarium
            </h1>
            <p className="figma-hero-p" style={{ marginBottom: 0 }}>
              Istilah anggaran yang dipakai di JejakPublik, dengan definisi singkat dan contoh bila perlu.
            </p>
          </div>
        </div>
      </div>

      <div className="figma-container" style={{ paddingTop: 0 }}>
        {/* Search Input Box */}
        <div className="figma-search-wrapper">
          <label htmlFor="search-glossary" className="figma-search-label">
            Cari istilah
          </label>
          <div className="figma-search-input-box">
            <span className="figma-search-icon">⌕</span>
            <input
              id="search-glossary"
              type="text"
              placeholder="Contoh: serapan, efisiensi, subkegiatan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="figma-search-input"
            />
          </div>
        </div>

        {/* Alphabet Navigation A-Z Sesuai Figma node-id 94:35 */}
        <div className="figma-alpha-nav">
          <button
            type="button"
            className={`figma-alpha-btn ${selectedLetter === null ? 'active' : ''}`}
            onClick={() => setSelectedLetter(null)}
          >
            Semua
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              type="button"
              className={`figma-alpha-btn ${selectedLetter === letter ? 'active' : ''}`}
              onClick={() => setSelectedLetter(letter === selectedLetter ? null : letter)}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Definition List Sesuai Figma node-id 94:98 */}
        <div className="figma-glossary-list">
          {filteredTerms.map((t, idx) => (
            <div key={idx} className="figma-glossary-item">
              <h3 className="figma-glossary-term">{t.term}</h3>
              <p className="figma-glossary-def">{t.definition}</p>
              {t.example && (
                <div className="figma-glossary-example">
                  <strong>Contoh:</strong> {t.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </LayoutShell>
  );
};
