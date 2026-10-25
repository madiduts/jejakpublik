import React from 'react';
import { DlhIndikatorItem } from '../../../types';
import { formatRupiah } from '../../../utils/format';
import { AlertCircle, Target } from 'lucide-react';

interface IndikatorTabProps {
  data: DlhIndikatorItem[];
}

export const IndikatorTab: React.FC<IndikatorTabProps> = ({ data }) => {
  return (
    <div>
      {/* Notice Callout */}
      <div
        style={{
          background: 'var(--warn-bg)',
          border: '1px solid var(--warn-line)',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px',
          color: '#78350F',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <AlertCircle size={18} color="var(--warn)" />
          <strong style={{ fontSize: '14.5px' }}>Peringatan Semantik Istilah "Efisiensi"</strong>
        </div>
        <p style={{ fontSize: '13px', lineHeight: 1.6 }}>
          Dalam sistem akuntansi dan pelaporan kinerja pemerintah daerah (Tabel 3.35 LKIP), kolom <strong>"Efisiensi"</strong> didefinisikan 
          sebagai <strong>selisih sisa anggaran yang tidak terserap</strong> (Anggaran Perubahan &minus; Realisasi), <em>bukan penghematan riil atas efisiensi biaya satuan</em>. 
          Selain itu, satu program dapat muncul di lebih dari satu indikator sehingga total nominal pada tabel ini <strong>tidak boleh dijumlahkan</strong> agar tidak terjadi penghitungan ganda (*double-counting*).
        </p>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Sasaran & Indikator Kinerja</th>
              <th style={{ width: '12%' }}>Capaian Fisik</th>
              <th style={{ width: '25%' }}>Program Pendukung</th>
              <th style={{ width: '18%' }}>Anggaran & Realisasi</th>
              <th style={{ width: '20%' }}>Sisa Anggaran ("Efisiensi")</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>
                  {item.sasaran && (
                    <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                      {item.sasaran}
                    </div>
                  )}
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    {item.indikator || (
                      <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '12.5px' }}>
                        (Indikator sasaran sama)
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  {item.capaian_kinerja ? (
                    <div>
                      <span className="badge badge-accent" style={{ fontWeight: 700 }}>
                        <Target size={12} /> {item.capaian_kinerja}
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                        Target: {item.target_kinerja}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--muted)', fontSize: '12px' }}>-</span>
                  )}
                </td>

                <td>
                  <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
                    {item.program}
                  </div>
                </td>

                <td>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    {formatRupiah(item.realisasi_anggaran)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    Pagu APBD-P: {formatRupiah(item.anggaran_perubahan)}
                  </div>
                </td>

                <td>
                  <div style={{ fontWeight: 700, color: 'var(--warn)' }}>
                    {formatRupiah(item.jumlah_efisiensi)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    Sisa {item.pct_efisiensi} tidak terserap
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
