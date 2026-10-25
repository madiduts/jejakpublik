import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SkpdItem } from '../../types';
import { formatRupiah, formatPersen } from '../../utils/format';
import { Search, Layers, HelpCircle, ArrowRight } from 'lucide-react';

interface SkpdTableProps {
  data: SkpdItem[];
}

export const SkpdTable: React.FC<SkpdTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKomisi, setSelectedKomisi] = useState<string>('all');

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName = item.NAMA_SKPD.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKomisi = selectedKomisi === 'all' || item.C_KOMISI === selectedKomisi;
      return matchName && matchKomisi;
    });
  }, [data, searchTerm, selectedKomisi]);

  const komisiList = useMemo(() => {
    const set = new Set<string>();
    data.forEach((d) => {
      if (d.C_KOMISI) set.add(d.C_KOMISI);
    });
    return Array.from(set).sort();
  }, [data]);

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)' }}>
            Katalog 43 Satuan Kerja Perangkat Daerah (SKPD)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
            Data resmi Dashboard BPKD DKI Jakarta 2025. Klik instansi untuk menelusuri rincian data.
          </p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="text"
              placeholder="Cari nama instansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 14px 8px 36px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                fontSize: '13.5px',
                width: '240px',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <select
            value={selectedKomisi}
            onChange={(e) => setSelectedKomisi(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '13.5px',
              background: 'var(--surface)',
              color: 'var(--ink)',
              fontFamily: 'inherit',
              outline: 'none',
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
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '38%' }}>Nama Perangkat Daerah</th>
              <th style={{ width: '22%' }}>Belanja (Realisasi / Anggaran)</th>
              <th style={{ width: '15%' }}>Serapan Belanja</th>
              <th style={{ width: '15%' }}>Pembiayaan</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  Tidak ditemukan instansi dengan kata kunci "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const isDlh = item.NAMA_SKPD.includes('LINGKUNGAN HIDUP');
                const belanjaAnggaran = parseFloat(item.BELANJA_ANGGARAN || '0') || 0;
                const belanjaRealisasi = parseFloat(item.BELANJA_REALISASI || '0') || 0;
                const pct = belanjaAnggaran > 0 ? (belanjaRealisasi / belanjaAnggaran) * 100 : 0;
                const hasPembiayaan = item.PEMBIAYAAN_ANGGARAN !== null && item.PEMBIAYAAN_ANGGARAN !== '0';

                return (
                  <tr key={item.I_IDINDUK} style={isDlh ? { background: '#F0FDFA' } : {}}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '14.5px', color: 'var(--ink)' }}>
                            {item.NAMA_SKPD}
                          </strong>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                              Komisi {item.C_KOMISI || '-'} &middot; ID: {item.I_IDINDUK}
                            </span>
                            {isDlh ? (
                              <span className="badge badge-accent" style={{ fontSize: '11px', padding: '2px 7px' }}>
                                <Layers size={11} />
                                Penelusuran Penuh sampai Subkegiatan
                              </span>
                            ) : (
                              <span className="badge badge-hold" style={{ fontSize: '11px', padding: '2px 7px' }}>
                                Hanya Tingkat SKPD
                              </span>
                            )}
                          </div>
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

                    <td>
                      {hasPembiayaan ? (
                        <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                          {formatRupiah(item.PEMBIAYAAN_REALISASI)}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' }}>
                          Tidak dilaporkan
                        </span>
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
                          }}
                        >
                          Buka Detail <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--muted)',
                            background: 'var(--bg)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--line)',
                          }}
                          title="Format LKIP dinas ini belum distandarisasi untuk penelusuran hierarki subkegiatan."
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

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '12.5px',
          color: 'var(--muted)',
        }}
      >
        <HelpCircle size={16} color="var(--muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Transparansi Asimetri Data:</strong> Dari 43 SKPD, saat ini baru <strong>Dinas Lingkungan Hidup</strong> yang 
          memiliki rantai audit lengkap sampai 33 subkegiatan dan 12 indikator kinerja terverifikasi silang. 
          SKPD lainnya hanya disajikan pada tingkat agregat SKPD karena ketiadaan format pelaporan LKIP publik yang seragam.
        </div>
      </div>
    </div>
  );
};
