import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, PageHead, Kpi, Empty } from '../components/ui';
import { instansiList, totals } from '../lib/data';
import { formatRupiahShort, formatPersen } from '../utils/format';

const KOMISI = ['3', 'B', 'C', 'D', 'E'];

export const Explore: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const komisi = params.get('komisi') ?? '';
  const [sort, setSort] = useState<'belanja' | 'nama' | 'serapan'>('belanja');

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    const filtered = instansiList.filter((i) =>
      (!term || i.nama.toLowerCase().includes(term)) && (!komisi || i.komisi === komisi)
    );
    const val = (i: typeof instansiList[number]) =>
      sort === 'nama' ? 0 : sort === 'belanja' ? -i.belanja : -((i.belanjaRealisasi / (i.belanja || 1)) * 100);
    return filtered.sort((a, b) => (sort === 'nama' ? a.nama.localeCompare(b.nama) : val(a) - val(b)));
  }, [q, komisi, sort]);

  const sum = rows.reduce((a, b) => a + b.belanja, 0);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Jelajahi data' }]}>
      <div className="wrap page">
        <PageHead
          eyebrow="Lapisan pertama"
          title="43 perangkat daerah"
          desc="Ringkasan anggaran dan realisasi seluruh SKPD Provinsi DKI Jakarta. Pilih satu instansi untuk melihat rinciannya."
        />
        <div className="kpis" style={{ marginTop: 0 }}>
          <Kpi label="Instansi ditampilkan" value={String(rows.length)} foot={`dari ${totals.instansi} SKPD`} />
          <Kpi label="Anggaran pada tampilan ini" value={formatRupiahShort(sum)} foot="APBD-P 2025" />
          <Kpi label="Dengan rincian penuh" value="1" foot="Dinas Lingkungan Hidup" />
          <Kpi label="Total provinsi" value={formatRupiahShort(totals.belanja)} foot="seluruh SKPD" />
        </div>

        <Card>
          <div className="card-pad" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid var(--line)' }}>
            <label className="search" style={{ minWidth: 260 }}>
              <Search size={16} aria-hidden="true" />
              <input className="input" placeholder="Cari nama instansi…" value={q} onChange={(e) => update('q', e.target.value)} aria-label="Cari instansi" />
            </label>
            <div className="rowgap">
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 650 }}>Komisi</span>
              <button className={`chip${komisi === '' ? ' on' : ''}`} onClick={() => update('komisi', '')}>Semua</button>
              {KOMISI.map((k) => (
                <button key={k} className={`chip${komisi === k ? ' on' : ''}`} onClick={() => update('komisi', k)}>Komisi {k}</button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <select className="select" style={{ height: 36, padding: '0 10px' }} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Urutkan">
                <option value="belanja">Anggaran terbesar</option>
                <option value="serapan">Serapan tertinggi</option>
                <option value="nama">Nama A-Z</option>
              </select>
            </div>
          </div>
          {rows.length === 0 ? (
            <Empty title="Tidak ada instansi yang cocok">Coba hapus penyaring atau gunakan kata kunci lain.</Empty>
          ) : (
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Perangkat daerah</th><th>Komisi</th><th className="r">Anggaran</th><th className="r">Realisasi</th><th className="r">Serapan</th><th /></tr></thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id}>
                      <td>
                        <Link className="tbl-title" to={`/instansi/${i.slug}`}>{i.nama}</Link>
                        <div className="tbl-sub">Asisten {i.asisten}{i.detailed ? ' · ada rincian penuh' : ''}</div>
                      </td>
                      <td className="num">{i.komisi}</td>
                      <td className="r num">{formatRupiahShort(i.belanja)}</td>
                      <td className="r num">{formatRupiahShort(i.belanjaRealisasi)}</td>
                      <td className="r num">{i.belanja ? formatPersen((i.belanjaRealisasi / i.belanja) * 100) : '-'}</td>
                      <td className="r"><Link to={`/instansi/${i.slug}`} className="btn btn-sm btn-quiet"><ArrowRight size={14} aria-hidden="true" /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </LayoutShell>
  );
};
