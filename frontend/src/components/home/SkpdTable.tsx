import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SkpdItem } from '../../types';
import { formatRupiah, formatPersen } from '../../utils/format';
import { Search, Layers, HelpCircle, ArrowRight, ArrowUpDown } from 'lucide-react';

interface SkpdTableProps {
  data: SkpdItem[];
}

type SortField = 'nama' | 'belanja' | 'realisasi' | 'serapan';
type SortOrder = 'asc' | 'desc';

export const SkpdTable: React.FC<SkpdTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKomisi, setSelectedKomisi] = useState<string>('all');
  const [depthFilter, setDepthFilter] = useState<'all' | 'detailed' | 'basic'>('all');
  const [sortField, setSortField] = useState<SortField>('belanja');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter((item) => {
      const matchName = item.NAMA_SKPD.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const matchKomisi = selectedKomisi === 'all' || item.C_KOMISI === selectedKomisi;
      const isDlh = item.NAMA_SKPD.includes('LINGKUNGAN HIDUP');
      const matchDepth =
        depthFilter === 'all' ||
        (depthFilter === 'detailed' && isDlh) ||
        (depthFilter === 'basic' && !isDlh);

      return matchName && matchKomisi && matchDepth;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'nama') {
        comparison = a.NAMA_SKPD.localeCompare(b.NAMA_SKPD, 'id');
      } else if (sortField === 'belanja') {
        const aVal = parseFloat(a.BELANJA_ANGGARAN || '0') || 0;
        const bVal = parseFloat(b.BELANJA_ANGGARAN || '0') || 0;
        comparison = aVal - bVal;
      } else if (sortField === 'realisasi') {
        const aVal = parseFloat(a.BELANJA_REALISASI || '0') || 0;
        const bVal = parseFloat(b.BELANJA_REALISASI || '0') || 0;
        comparison = aVal - bVal;
      } else if (sortField === 'serapan') {
        const aAngg = parseFloat(a.BELANJA_ANGGARAN || '0') || 0;
        const aReal = parseFloat(a.BELANJA_REALISASI || '0') || 0;
        const aPct = aAngg > 0 ? aReal / aAngg : 0;

        const bAngg = parseFloat(b.BELANJA_ANGGARAN || '0') || 0;
        const bReal = parseFloat(b.BELANJA_REALISASI || '0') || 0;
        const bPct = bAngg > 0 ? bReal / bAngg : 0;

        comparison = aPct - bPct;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, searchTerm, selectedKomisi, depthFilter, sortField, sortOrder]);

  const komisiList = useMemo(() => {
    const set = new Set<string>();
    data.forEach((d) => {
      if (d.C_KOMISI) set.add(d.C_KOMISI);
    });
    return Array.from(set).sort();
  }, [data]);

  return (
    <section aria-label="Katalog SKPD DKI Jakarta" style={{ marginBottom: '40px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
              Katalog 43 Satuan Kerja Perangkat Daerah (SKPD)
            </h2>
            <span
              className="badge"
              style={{ fontSize: '12px', background: '#E2E8F0', color: 'var(--ink-soft)' }}
            >
              {filteredAndSortedData.length} dari {data.length} SKPD
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
            Data resmi Dashboard Keuangan BPKD DKI Jakarta TA 2025. Dilengkapi penanda kedalaman data (two-tier).
          </p>
        </div>

        {/* Controls: Search, Komisi filter, and Depth filter */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              color="var(--muted)"
              style={{ position: 'absolute', left: '12px', top: '10px' }}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Cari nama SKPD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Cari nama SKPD"
              style={{
                padding: '8px 14px 8px 36px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                fontSize: '13.5px',
                width: '220px',
                outline: 'none',
                fontFamily: 'inherit',
                background: 'var(--surface)',
                color: 'var(--ink)',
              }}
            />
          </div>

          {/* Filter Komisi */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={selectedKomisi}
              onChange={(e) => setSelectedKomisi(e.target.value)}
              aria-label="Filter berdasarkan Komisi DPRD"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                fontSize: '13.5px',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontFamily: 'inherit',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="all">Semua Komisi DPRD</option>
              {komisiList.map((k) => (
                <option key={k} value={k}>
                  Komisi {k}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Kedalaman Data */}
          <select
            value={depthFilter}
            onChange={(e) => setDepthFilter(e.target.value as 'all' | 'detailed' | 'basic')}
            aria-label="Filter kedalaman data"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '13.5px',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontFamily: 'inherit',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Semua Kedalaman</option>
            <option value="detailed">Pilot Rinci (DLH)</option>
            <option value="basic">Hanya Tingkat SKPD (42 Dinas)</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabel Anggaran 43 SKPD">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '38%' }}>
                <button
                  type="button"
                  onClick={() => handleSort('nama')}
                  style={{
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    color: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                  title="Urutkan berdasarkan Nama"
                >
                  Nama Perangkat Daerah (SKPD)
                  <ArrowUpDown size={13} aria-hidden="true" />
                </button>
              </th>
              <th scope="col" style={{ width: '24%' }}>
                <button
                  type="button"
                  onClick={() => handleSort('belanja')}
                  style={{
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    color: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                  title="Urutkan berdasarkan Belanja"
                >
                  Belanja (Realisasi / Pagu)
                  <ArrowUpDown size={13} aria-hidden="true" />
                </button>
              </th>
              <th scope="col" style={{ width: '14%' }}>
                <button
                  type="button"
                  onClick={() => handleSort('serapan')}
                  style={{
                    background: 'none',
                    border: 'none',
                    font: 'inherit',
                    color: 'inherit',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0,
                  }}
                  title="Urutkan berdasarkan % Serapan"
                >
                  Serapan
                  <ArrowUpDown size={13} aria-hidden="true" />
                </button>
              </th>
              <th scope="col" style={{ width: '14%' }}>
                Pembiayaan
              </th>
              <th scope="col" style={{ width: '10%', textAlign: 'right' }}>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  Tidak ditemukan perangkat daerah dengan kriteria pencarian & filter saat ini.
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((item) => {
                const isDlh = item.NAMA_SKPD.includes('LINGKUNGAN HIDUP');
                const belanjaAnggaran = parseFloat(item.BELANJA_ANGGARAN || '0') || 0;
                const belanjaRealisasi = parseFloat(item.BELANJA_REALISASI || '0') || 0;
                const pct = belanjaAnggaran > 0 ? (belanjaRealisasi / belanjaAnggaran) * 100 : 0;

                // F-02 Contract: IF kolom PEMBIAYAAN_ANGGARAN bernilai null THEN render teks "Tidak dilaporkan" (bukan Rp0)
                const isPembiayaanNull = item.PEMBIAYAAN_ANGGARAN === null;

                return (
                  <tr
                    key={item.I_IDINDUK}
                    style={
                      isDlh
                        ? { background: '#F0FDFA', borderLeft: '3px solid var(--accent)' }
                        : {}
                    }
                  >
                    <td>
                      <div>
                        <strong style={{ fontSize: '14.5px', color: 'var(--ink)' }}>
                          {item.NAMA_SKPD}
                        </strong>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            marginTop: '4px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                            Komisi {item.C_KOMISI || '-'} &middot; ID: {item.I_IDINDUK}
                          </span>

                          {/* Badge Kedalaman Data Sesuai PRD F-02 */}
                          {isDlh ? (
                            <span
                              className="badge badge-accent"
                              style={{
                                fontSize: '11px',
                                padding: '2px 8px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Layers size={11} aria-hidden="true" />
                              Dapat ditelusuri sampai sub kegiatan
                            </span>
                          ) : (
                            <span
                              className="badge badge-hold"
                              style={{ fontSize: '11px', padding: '2px 7px' }}
                            >
                              Hanya tingkat SKPD
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                        {formatRupiah(belanjaRealisasi)}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                        Pagu: {formatRupiah(belanjaAnggaran)}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 700,
                          background: pct >= 85 ? 'var(--success-bg)' : '#FEF3C7',
                          color: pct >= 85 ? 'var(--success)' : '#B45309',
                        }}
                      >
                        {formatPersen(pct)}
                      </span>
                    </td>

                    {/* F-02 Pembiayaan Column: Penanganan Khusus Null */}
                    <td>
                      {isPembiayaanNull ? (
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--muted)',
                            fontStyle: 'italic',
                          }}
                        >
                          Tidak dilaporkan
                        </span>
                      ) : (
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink-soft)' }}>
                            {formatRupiah(item.PEMBIAYAAN_REALISASI)}
                          </div>
                          {item.PEMBIAYAAN_ANGGARAN && item.PEMBIAYAAN_ANGGARAN !== '0' && (
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                              Plafon: {formatRupiah(item.PEMBIAYAAN_ANGGARAN)}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {isDlh ? (
                        <Link
                          to="/instansi/lingkungan-hidup"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--accent)',
                            color: '#FFFFFF',
                            padding: '6px 12px',
                            borderRadius: '7px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                          aria-label="Buka detail penelusuran hierarki Dinas Lingkungan Hidup"
                        >
                          Buka Detail <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      ) : (
                        <span
                          style={{
                            fontSize: '11.5px',
                            color: 'var(--muted)',
                            background: 'var(--bg)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--line)',
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                          }}
                          title="Data rincian program/kegiatan belum dipublikasikan dalam format terstruktur pada dinas ini."
                        >
                          Tingkat SKPD
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Catatan Asimetri Kedalaman Dua Lapis */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '12.5px',
          color: 'var(--ink-soft)',
          marginTop: '12px',
        }}
      >
        <HelpCircle size={17} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div>
          <strong>Transparansi Arsitektur Dua Lapis (Two-Tier Model):</strong> Dari 43 SKPD, saat ini baru{' '}
          <strong>Dinas Lingkungan Hidup</strong> yang memiliki rantai audit lengkap sampai 33 subkegiatan (dengan Data State Engine),
          12 indikator kinerja LKIP, dan 10 unit kerja pelaksana. 42 SKPD lainnya disajikan pada tingkat agregat SKPD sesuai
          publikasi resmi Dashboard BPKD DKI Jakarta.
        </div>
      </div>
    </section>
  );
};
