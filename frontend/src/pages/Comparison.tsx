import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, PageHead, Notice, Badge } from '../components/ui';
import { Evidence } from '../components/Evidence';
import { programList, corrections, programTotals } from '../lib/data';
import { formatRupiah, formatRupiahShort, formatPersen } from '../utils/format';

export const Comparison: React.FC = () => {
  const [leftSlug, setLeft] = useState(programList[3]?.slug ?? programList[0].slug);
  const [rightSlug, setRight] = useState(programList[4]?.slug ?? programList[0].slug);
  const left = useMemo(() => programList.find((p) => p.slug === leftSlug) ?? programList[0], [leftSlug]);
  const right = useMemo(() => programList.find((p) => p.slug === rightSlug) ?? programList[0], [rightSlug]);

  const max = Math.max(left.apbdp ?? 0, right.apbdp ?? 0, 1);
  const diff = (left.apbdp ?? 0) - (right.apbdp ?? 0);

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Jelajahi data', to: '/jelajahi' }, { label: 'Perbandingan' }]}>
      <div className="wrap page">
        <PageHead eyebrow="Bukti, bukan klaim" title="Perbandingan angka" desc="Letakkan dua program berdampingan, atau lihat bagaimana sebuah angka resmi yang saling bertentangan diselesaikan." />

        <Notice tone="warn" title="Dua tabel memuat nilai berbeda untuk satu baris.">
          Halaman ini memperlihatkan angka yang kami pakai, angka yang kami tolak, dan hitungan yang menghubungkan keduanya.
        </Notice>

        <div className="section-title"><h2>Dua program berdampingan</h2><span className="sub">Anggaran perubahan 2025</span></div>

        <div className="grid g2" style={{ alignItems: 'start' }}>
          <Card pad>
            <div className="field">
              <label htmlFor="kiri">Program kiri</label>
              <select id="kiri" className="select" value={leftSlug} onChange={(e) => setLeft(e.target.value)}>
                {programList.map((p) => <option key={p.slug} value={p.slug}>{p.nama}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="kanan">Program kanan</label>
              <select id="kanan" className="select" value={rightSlug} onChange={(e) => setRight(e.target.value)}>
                {programList.map((p) => <option key={p.slug} value={p.slug}>{p.nama}</option>)}
              </select>
            </div>
            <table>
              <tbody>
                <tr><td style={{ color: 'var(--muted)' }}>Anggaran kiri</td><td className="r num">{formatRupiah(left.apbdp)}</td></tr>
                <tr><td style={{ color: 'var(--muted)' }}>Anggaran kanan</td><td className="r num">{formatRupiah(right.apbdp)}</td></tr>
                <tr><td style={{ color: 'var(--muted)' }}>Selisih</td><td className="r num" style={{ fontWeight: 700 }}>{formatRupiah(Math.abs(diff))}</td></tr>
                <tr><td style={{ color: 'var(--muted)' }}>Realisasi kiri</td><td className="r num">{formatRupiah(left.realisasi)}</td></tr>
                <tr><td style={{ color: 'var(--muted)' }}>Realisasi kanan</td><td className="r num">{formatRupiah(right.realisasi)}</td></tr>
              </tbody>
            </table>
          </Card>

          <Card>
            <CardHead title="Perbandingan panjang batang" sub="Skala sama untuk keduanya" />
            <div className="card-pad">
              <div className="bars">
                <div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 6 }}>Kiri · {left.pct ?? '-'}</div>
                  <div className="bar-track" style={{ height: 26 }}><div className="bar-fill" style={{ width: `${Math.max(2, ((left.apbdp ?? 0) / max) * 100)}%` }} /></div>
                  <div className="num" style={{ fontWeight: 700, marginTop: 5 }}>{formatRupiahShort(left.apbdp)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 6 }}>Kanan · {right.pct ?? '-'}</div>
                  <div className="bar-track" style={{ height: 26 }}><div className="bar-fill warn" style={{ width: `${Math.max(2, ((right.apbdp ?? 0) / max) * 100)}%` }} /></div>
                  <div className="num" style={{ fontWeight: 700, marginTop: 5 }}>{formatRupiahShort(right.apbdp)}</div>
                </div>
              </div>
              <div className="divider" />
              <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                Total anggaran delapan program: <b className="num" style={{ color: 'var(--ink)' }}>{formatRupiahShort(programTotals.apbdp)}</b>.
                Serapan program kiri {formatPersen(left.apbdp ? ((left.realisasi ?? 0) / left.apbdp) * 100 : 0)}.
              </div>
            </div>
          </Card>
        </div>

        <div className="section-title"><h2>Dua angka yang tidak konsisten</h2><span className="sub">Diselesaikan dengan rekonsiliasi total</span></div>
        <div className="grid" style={{ gap: 18 }}>
          {corrections.map((c) => (
            <Card key={c.id} pad id={c.id}>
              <div className="rowgap" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: 15 }}>{c.title}</h3>
                <div className="rowgap">
                  <Badge tone={c.state === 'dikoreksi' ? 'warn' : 'hold'}>{c.state}</Badge>
                  {c.programSlug && <Link to={`/program/${c.programSlug}`} className="btn btn-sm">Lihat program</Link>}
                </div>
              </div>
              <Evidence c={c} />
            </Card>
          ))}
        </div>
      </div>
    </LayoutShell>
  );
};
