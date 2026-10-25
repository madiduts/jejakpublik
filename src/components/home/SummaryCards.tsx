import React from 'react';
import { formatRupiah, formatRupiahShort, formatPersen } from '../../utils/format';
import { SkpdItem } from '../../types';
import { TrendingUp, CreditCard, ArrowDownRight } from 'lucide-react';

interface SummaryCardsProps {
  data: SkpdItem[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  // Aggregate totals
  const totalBelanjaAnggaran = data.reduce((acc, item) => acc + (parseFloat(item.BELANJA_ANGGARAN || '0') || 0), 0);
  const totalBelanjaRealisasi = data.reduce((acc, item) => acc + (parseFloat(item.BELANJA_REALISASI || '0') || 0), 0);
  const belanjaPct = totalBelanjaAnggaran > 0 ? (totalBelanjaRealisasi / totalBelanjaAnggaran) * 100 : 0;

  const totalPendapatanAnggaran = data.reduce((acc, item) => acc + (parseFloat(item.PENDAPATAN_ANGGARAN || '0') || 0), 0);
  const totalPendapatanRealisasi = data.reduce((acc, item) => acc + (parseFloat(item.PENDAPATAN_REALISASI || '0') || 0), 0);
  const pendapatanPct = totalPendapatanAnggaran > 0 ? (totalPendapatanRealisasi / totalPendapatanAnggaran) * 100 : 0;

  const totalPembiayaanAnggaran = data.reduce((acc, item) => acc + (parseFloat(item.PEMBIAYAAN_ANGGARAN || '0') || 0), 0);
  const totalPembiayaanRealisasi = data.reduce((acc, item) => acc + (parseFloat(item.PEMBIAYAAN_REALISASI || '0') || 0), 0);
  const pembiayaanPct = totalPembiayaanAnggaran > 0 ? (totalPembiayaanRealisasi / totalPembiayaanAnggaran) * 100 : 0;

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
          Tiga Pilar Anggaran Provinsi DKI Jakarta (TA 2025)
        </h2>
        <span className="badge">
          Sumber: Dashboard BPKD DKI &middot; 43 SKPD
        </span>
      </div>

      <div className="stats">
        {/* Belanja */}
        <div className="stat" style={{ borderLeft: '4px solid #0F766E' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="lbl">1. BELANJA DAERAH</span>
            <ArrowDownRight size={18} color="#0F766E" />
          </div>
          <div className="val big">{formatRupiahShort(totalBelanjaRealisasi)}</div>
          <div className="sub">
            Dari anggaran {formatRupiahShort(totalBelanjaAnggaran)} ({formatPersen(belanjaPct)} terserap)
          </div>
          <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--muted)' }}>
            Realisasi penuh: {formatRupiah(totalBelanjaRealisasi)}
          </div>
        </div>

        {/* Pendapatan */}
        <div className="stat" style={{ borderLeft: '4px solid #2563EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="lbl">2. PENDAPATAN DAERAH</span>
            <TrendingUp size={18} color="#2563EB" />
          </div>
          <div className="val" style={{ color: '#2563EB' }}>{formatRupiahShort(totalPendapatanRealisasi)}</div>
          <div className="sub">
            Target {formatRupiahShort(totalPendapatanAnggaran)} ({formatPersen(pendapatanPct)} tercapai)
          </div>
          <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--muted)' }}>
            Pendapatan masuk kas daerah: pajak, retribusi & transfer pusat
          </div>
        </div>

        {/* Pembiayaan */}
        <div className="stat" style={{ borderLeft: '4px solid #D97706' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="lbl">3. PEMBIAYAAN NETTO</span>
            <CreditCard size={18} color="#D97706" />
          </div>
          <div className="val" style={{ color: '#D97706' }}>{formatRupiahShort(totalPembiayaanRealisasi)}</div>
          <div className="sub">
            Plafon {formatRupiahShort(totalPembiayaanAnggaran)} ({formatPersen(pembiayaanPct)})
          </div>
          <div style={{ marginTop: '10px', fontSize: '11.5px', color: 'var(--muted)' }}>
            Hanya 14 SKPD memiliki pos pembiayaan (29 instansi lainnya tidak lapor)
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#F1F5F9',
          border: '1px solid var(--line)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '12.5px',
          color: 'var(--ink-soft)',
        }}
      >
        <strong>Prinsip Integritas JejakPublik:</strong> Ketiga pilar di atas sengaja <em>dipisahkan dan tidak dijumlahkan</em>. 
        Pendapatan bukan sekadar pengurang belanja, dan menjumlahkannya sembarangan akan menghasilkan angka netto yang menyesatkan pembaca awam.
      </div>
    </div>
  );
};
