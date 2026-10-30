import React from 'react';
import { formatRupiah, formatRupiahShort, formatPersen } from '../../utils/format';
import { SkpdItem } from '../../types';
import { TrendingUp, CreditCard, ArrowDownRight, Info, Calendar } from 'lucide-react';

interface SummaryCardsProps {
  data: SkpdItem[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  // Aggregate totals across all 43 SKPD lines in bpkd-skpd-2025.json
  const totalBelanjaAnggaran = data.reduce(
    (acc, item) => acc + (parseFloat(item.BELANJA_ANGGARAN || '0') || 0),
    0
  );
  const totalBelanjaRealisasi = data.reduce(
    (acc, item) => acc + (parseFloat(item.BELANJA_REALISASI || '0') || 0),
    0
  );
  const belanjaPct = totalBelanjaAnggaran > 0 ? (totalBelanjaRealisasi / totalBelanjaAnggaran) * 100 : 0;

  const totalPendapatanAnggaran = data.reduce(
    (acc, item) => acc + (parseFloat(item.PENDAPATAN_ANGGARAN || '0') || 0),
    0
  );
  const totalPendapatanRealisasi = data.reduce(
    (acc, item) => acc + (parseFloat(item.PENDAPATAN_REALISASI || '0') || 0),
    0
  );
  const pendapatanPct = totalPendapatanAnggaran > 0 ? (totalPendapatanRealisasi / totalPendapatanAnggaran) * 100 : 0;

  const totalPembiayaanAnggaran = data.reduce(
    (acc, item) => acc + (parseFloat(item.PEMBIAYAAN_ANGGARAN || '0') || 0),
    0
  );
  const totalPembiayaanRealisasi = data.reduce(
    (acc, item) => acc + (parseFloat(item.PEMBIAYAAN_REALISASI || '0') || 0),
    0
  );
  const pembiayaanPct = totalPembiayaanAnggaran > 0 ? (totalPembiayaanRealisasi / totalPembiayaanAnggaran) * 100 : 0;

  // Count agencies with reported financing
  const skpdWithPembiayaan = data.filter((item) => item.PEMBIAYAAN_ANGGARAN !== null).length;
  const skpdWithoutPembiayaan = data.length - skpdWithPembiayaan;

  return (
    <section aria-label="Tiga Pilar Anggaran DKI Jakarta" style={{ marginBottom: '32px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)' }}>
            Tiga Pilar Anggaran Provinsi DKI Jakarta (TA 2025)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
            Agregasi menyeluruh 43 SKPD dari Dashboard Keuangan BPKD DKI Jakarta
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Calendar size={12} aria-hidden="true" />
            Penarikan: 21 Oktober 2026
          </span>
          <span className="badge badge-accent">
            Dashboard BPKD &middot; 43 SKPD
          </span>
        </div>
      </div>

      <div className="stats">
        {/* Pilar 1: Belanja */}
        <div className="stat" style={{ borderLeft: '4px solid #0F766E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="lbl" style={{ color: '#0F766E', fontWeight: 700 }}>
              1. BELANJA DAERAH
            </span>
            <ArrowDownRight size={20} color="#0F766E" aria-hidden="true" />
          </div>
          <div className="val big">{formatRupiahShort(totalBelanjaRealisasi)}</div>
          <div className="sub">
            Dari pagu alokasi {formatRupiahShort(totalBelanjaAnggaran)} (
            <strong>{formatPersen(belanjaPct)}</strong> terserap)
          </div>
          <div
            style={{
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid var(--line)',
              fontSize: '11.5px',
              color: 'var(--muted)',
            }}
          >
            Realisasi penuh: <strong>{formatRupiah(totalBelanjaRealisasi)}</strong>
            <br />
            Pagu penetapan & perubahan: {formatRupiah(totalBelanjaAnggaran)}
          </div>
        </div>

        {/* Pilar 2: Pendapatan */}
        <div className="stat" style={{ borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="lbl" style={{ color: '#2563EB', fontWeight: 700 }}>
              2. PENDAPATAN DAERAH
            </span>
            <TrendingUp size={20} color="#2563EB" aria-hidden="true" />
          </div>
          <div className="val" style={{ color: '#2563EB' }}>
            {formatRupiahShort(totalPendapatanRealisasi)}
          </div>
          <div className="sub">
            Target {formatRupiahShort(totalPendapatanAnggaran)} (
            <strong>{formatPersen(pendapatanPct)}</strong> tercapai)
          </div>
          <div
            style={{
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid var(--line)',
              fontSize: '11.5px',
              color: 'var(--muted)',
            }}
          >
            Realisasi kas masuk: <strong>{formatRupiah(totalPendapatanRealisasi)}</strong>
            <br />
            Sumber: Pajak daerah, retribusi, & transfer pemerintah pusat
          </div>
        </div>

        {/* Pilar 3: Pembiayaan */}
        <div className="stat" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="lbl" style={{ color: '#D97706', fontWeight: 700 }}>
              3. PEMBIAYAAN NETTO
            </span>
            <CreditCard size={20} color="#D97706" aria-hidden="true" />
          </div>
          <div className="val" style={{ color: '#D97706' }}>
            {formatRupiahShort(totalPembiayaanRealisasi)}
          </div>
          <div className="sub">
            Plafon {formatRupiahShort(totalPembiayaanAnggaran)} (
            <strong>{formatPersen(pembiayaanPct)}</strong>)
          </div>
          <div
            style={{
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid var(--line)',
              fontSize: '11.5px',
              color: 'var(--muted)',
            }}
          >
            {skpdWithPembiayaan} SKPD mencatat pos pembiayaan ({skpdWithoutPembiayaan} instansi berstatus <em>Tidak dilaporkan</em>)
          </div>
        </div>
      </div>

      {/* Prinsip Pemisahan 3 Pilar */}
      <div
        style={{
          background: '#F1F5F9',
          border: '1px solid var(--line)',
          borderRadius: '10px',
          padding: '12px 16px',
          fontSize: '13px',
          color: 'var(--ink-soft)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <Info size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div>
          <strong>Prinsip Integritas JejakPublik (ADR-001):</strong> Ketiga pilar di atas sengaja{' '}
          <em>disajikan terpisah dan DILARANG dijumlahkan menjadi saldo netto tunggal</em>. Pendapatan daerah
          bukan sekadar pengurang belanja, dan penggabungan serampangan ketiga pilar dapat menyamarkan realitas
          kebutuhan pembiayaan dan defisit riil kas daerah.
        </div>
      </div>
    </section>
  );
};
