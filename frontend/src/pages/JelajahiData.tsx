import React, { useState } from 'react';
import { LayoutShell } from '../components/layout/LayoutShell';
import rawSkpdData from '../data/bpkd-skpd-2025.json';
import { SkpdItem } from '../types';
import { Link } from 'react-router-dom';

export const JelajahiData: React.FC = () => {
  const skpdList = (rawSkpdData as { data: SkpdItem[] }).data;
  const [searchQuery, setSearchQuery] = useState('');
  const [activePillar, setActivePillar] = useState<'belanja' | 'pendapatan' | 'pembiayaan'>('belanja');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter pencarian
  const filteredSkpd = skpdList.filter((item) =>
    item.NAMA_SKPD.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting menurut pilar aktif
  const sortedSkpd = [...filteredSkpd].sort((a, b) => {
    if (activePillar === 'belanja') {
      return Number(b.BELANJA_ANGGARAN) - Number(a.BELANJA_ANGGARAN);
    }
    if (activePillar === 'pendapatan') {
      return Number(b.PENDAPATAN_ANGGARAN || 0) - Number(a.PENDAPATAN_ANGGARAN || 0);
    }
    return Number(b.PEMBIAYAAN_ANGGARAN || 0) - Number(a.PEMBIAYAAN_ANGGARAN || 0);
  });

  const totalItems = sortedSkpd.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedSkpd = sortedSkpd.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatRupiah = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined || val === '') return 'Tidak dilaporkan';
    const num = Number(val);
    if (isNaN(num)) return 'Tidak dilaporkan';
    return `Rp${num.toLocaleString('id-ID')}`;
  };

  const getPillarValues = (item: SkpdItem) => {
    if (activePillar === 'belanja') {
      const p = Number(item.BELANJA_ANGGARAN) || 0;
      const r = Number(item.BELANJA_REALISASI) || 0;
      const pct = p > 0 ? ((r / p) * 100).toFixed(2) + '%' : '0%';
      return { anggaran: formatRupiah(p), realisasi: formatRupiah(r), pct };
    }
    if (activePillar === 'pendapatan') {
      const p = Number(item.PENDAPATAN_ANGGARAN) || 0;
      const r = Number(item.PENDAPATAN_REALISASI) || 0;
      const pct = p > 0 ? ((r / p) * 100).toFixed(2) + '%' : '0%';
      return { anggaran: formatRupiah(p), realisasi: formatRupiah(r), pct };
    }
    const p = item.PEMBIAYAAN_ANGGARAN ? Number(item.PEMBIAYAAN_ANGGARAN) : null;
    const r = item.PEMBIAYAAN_REALISASI ? Number(item.PEMBIAYAAN_REALISASI) : null;
    const pct = p && p > 0 && r ? ((r / p) * 100).toFixed(2) + '%' : '-';
    return { anggaran: formatRupiah(p), realisasi: formatRupiah(r), pct };
  };

  return (
    <LayoutShell>
      {/* Hero Visual Container Frame 02 Jelajahi Data (node-id 91:267) */}
      <div className="figma-hero-wrapper" style={{ marginBottom: '32px' }}>
        <div className="figma-hero-box" style={{ minHeight: '320px', padding: '48px 32px' }}>
          <img
            src="/assets/jelajahi-bg-raw.jpg"
            alt="Jelajahi Data Jakarta"
            className="figma-hero-bg"
          />
          <div className="figma-hero-overlay" />
          <div className="figma-hero-content" style={{ maxWidth: '840px' }}>
            <div className="figma-breadcrumb" style={{ justifyContent: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.85)' }}>Beranda</Link>
              <span className="sep" style={{ color: 'rgba(255,255,255,0.5)' }}>/</span>
              <span className="current" style={{ color: '#ffffff' }}>Jelajahi Data</span>
            </div>
            <h1 className="figma-hero-h1" style={{ fontSize: '42px', marginBottom: '12px' }}>
              Jelajahi Data
            </h1>
            <p className="figma-hero-p" style={{ marginBottom: 0 }}>
              43 instansi daerah, tahun anggaran 2025. Pilih kelompok anggaran, lalu buka instansi untuk melihat rinciannya.
            </p>
          </div>
        </div>
      </div>

      <div className="figma-container" style={{ paddingTop: 0 }}>
        {/* Search Input Box */}
        <div className="figma-search-wrapper">
          <label htmlFor="search-skpd" className="figma-search-label">
            Cari instansi atau program
          </label>
          <div className="figma-search-input-box">
            <span className="figma-search-icon">⌕</span>
            <input
              id="search-skpd"
              type="text"
              placeholder="Contoh: Lingkungan Hidup, Pendidikan, Bina Marga"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="figma-search-input"
            />
          </div>
        </div>

        {/* Pillar Tabs (Belanja, Pendapatan, Pembiayaan) */}
        <div className="figma-tabs-row">
          <button
            type="button"
            className={`figma-tab-btn ${activePillar === 'belanja' ? 'active' : ''}`}
            onClick={() => {
              setActivePillar('belanja');
              setCurrentPage(1);
            }}
          >
            Belanja
          </button>
          <button
            type="button"
            className={`figma-tab-btn ${activePillar === 'pendapatan' ? 'active' : ''}`}
            onClick={() => {
              setActivePillar('pendapatan');
              setCurrentPage(1);
            }}
          >
            Pendapatan
          </button>
          <button
            type="button"
            className={`figma-tab-btn ${activePillar === 'pembiayaan' ? 'active' : ''}`}
            onClick={() => {
              setActivePillar('pembiayaan');
              setCurrentPage(1);
            }}
          >
            Pembiayaan
          </button>
        </div>

        {/* Subtitle Count */}
        <div className="figma-table-count">
          Menampilkan {paginatedSkpd.length} dari {totalItems} instansi &middot; diurutkan menurut anggaran {activePillar}
        </div>

        {/* Empty State (Frame 09 node-id 102:2) */}
        {totalItems === 0 ? (
          <div className="figma-empty-state">
            <div className="figma-empty-icon">⌕</div>
            <h3 className="figma-empty-title">
              Tidak ditemukan instansi atau program dengan kata “{searchQuery}”
            </h3>
            <p className="figma-empty-desc">
              JejakPublik hanya menampilkan istilah yang benar-benar ada pada dokumen sumber. Coba kata kunci instansi resmi.
            </p>
          </div>
        ) : (
          /* Table SKPD Rows (Frame 02 node-id 91:2) */
          <div className="figma-skpd-list">
            {paginatedSkpd.map((item) => {
              const isDlh = item.NAMA_SKPD.toLowerCase().includes('lingkungan hidup');
              const { anggaran, realisasi, pct } = getPillarValues(item);

              return (
                <div key={item.I_IDINDUK} className="figma-skpd-row">
                  <div className="figma-skpd-left">
                    <div className="figma-skpd-name-row">
                      {isDlh ? (
                        <Link to="/instansi/lingkungan-hidup" className="figma-skpd-link">
                          {item.NAMA_SKPD}
                        </Link>
                      ) : (
                        <span className="figma-skpd-name">{item.NAMA_SKPD}</span>
                      )}
                      <span className={`figma-depth-badge ${isDlh ? 'deep' : ''}`}>
                        {isDlh ? 'Rincian sampai sub kegiatan' : 'Tingkat SKPD'}
                      </span>
                    </div>
                  </div>

                  <div className="figma-skpd-right">
                    <span className="figma-skpd-num">{anggaran}</span>
                    <span className="figma-skpd-num text-muted">{realisasi}</span>
                    <span className="figma-skpd-pct">{pct}</span>
                    {isDlh ? (
                      <Link
                        to="/instansi/lingkungan-hidup"
                        className="figma-program-arrow"
                        aria-label="Buka Rincian DLH"
                      >
                        &rarr;
                      </Link>
                    ) : (
                      <div className="figma-program-arrow disabled">&rarr;</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Baris Bawah */}
        {totalPages > 1 && (
          <div className="figma-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                className={`figma-page-btn ${currentPage === pg ? 'active' : ''}`}
                onClick={() => setCurrentPage(pg)}
              >
                {pg}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                type="button"
                className="figma-page-btn-next"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Berikutnya &rarr;
              </button>
            )}
          </div>
        )}
      </div>
    </LayoutShell>
  );
};
