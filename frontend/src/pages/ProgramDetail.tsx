import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, Kpi, Tabs, Badge, Empty, DataValue } from '../components/ui';
import { Evidence } from '../components/Evidence';
import { getProgram, corrections, dlhSource } from '../lib/data';
import { formatRupiah, formatRupiahShort, formatPersen } from '../utils/format';

export const ProgramDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const program = getProgram(slug);
  const [tab, setTab] = useState('kegiatan');
  const correction = corrections.find((c) => c.programSlug === slug);

  if (!program) {
    return (
      <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Jelajahi data', to: '/jelajahi' }, { label: 'Program tidak ditemukan' }]}>
        <div className="wrap page"><Empty title="Program tidak ditemukan">Program ini tidak ada pada data Dinas Lingkungan Hidup. <Link to="/instansi/dinas-lingkungan-hidup">Kembali ke instansi</Link>.</Empty></div>
      </LayoutShell>
    );
  }

  const subs = program.kegs.flatMap((k) => k.subs.map((s) => ({ ...s, kegiatan: k.nama })));
  const serapan = program.apbdp ? ((program.realisasi ?? 0) / program.apbdp) * 100 : 0;

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Jelajahi data', to: '/jelajahi' }, { label: 'Dinas Lingkungan Hidup', to: '/instansi/dinas-lingkungan-hidup' }, { label: 'Program' }]}>
      <div className="wrap page">
        <div className="rowgap" style={{ marginBottom: 10 }}>
          {correction && <Badge tone="warn">Program dikoreksi</Badge>}
          <Badge tone="plain">APBD-P 2025</Badge>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 750, maxWidth: 900 }}>{program.nama}</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14, maxWidth: 700 }}>
          {program.kegs.length} kegiatan dan {subs.length} sub kegiatan. Sumber: {dlhSource}.
        </p>

        <div className="kpis">
          <Kpi label="Anggaran perubahan" value={formatRupiahShort(program.apbdp)} foot={program.apbdp ? formatRupiah(program.apbdp) : 'ditahan'} large />
          <Kpi label="Realisasi" value={formatRupiahShort(program.realisasi)} foot={program.realisasi ? formatRupiah(program.realisasi) : 'ditahan'} />
          <Kpi label="Serapan" value={formatPersen(serapan)} foot="realisasi / anggaran" />
          <Kpi label="Sub kegiatan" value={String(subs.length)} foot={`${program.kegs.length} kegiatan`} />
        </div>

        <Tabs items={[{ id: 'kegiatan', label: 'Kegiatan' }, { id: 'sub', label: 'Sub kegiatan' }, ...(correction ? [{ id: 'koreksi', label: 'Koreksi angka' }] : [])]} active={tab} onChange={setTab} />

        {tab === 'kegiatan' && (
          <Card>
            <CardHead title="Kegiatan" sub="Angka induk untuk tiap baris" />
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Kegiatan</th><th className="r">Anggaran</th><th className="r">Realisasi</th><th className="r">Serapan</th></tr></thead>
                <tbody>
                  {program.kegs.map((k) => (
                    <tr key={k.nama}>
                      <td>
                        <div className="tbl-title">{k.nama}</div>
                        <div className="tbl-sub">{k.subs.length} sub kegiatan</div>
                      </td>
                      <td className="r num">{k.apbdp === null ? <DataValue value={null} /> : formatRupiah(k.apbdp)}</td>
                      <td className="r num">{k.realisasi === null ? <DataValue value={null} /> : formatRupiah(k.realisasi)}</td>
                      <td className="r num">{k.pct ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'sub' && (
          <Card>
            <CardHead title="Sub kegiatan" sub={`${subs.length} baris`} />
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Sub kegiatan</th><th>Kegiatan induk</th><th className="r">Anggaran</th><th className="r">Realisasi</th><th className="r">Serapan</th></tr></thead>
                <tbody>
                  {subs.map((s, i) => (
                    <tr key={`${s.nama}-${i}`}>
                      <td className="tbl-title" style={{ maxWidth: 400 }}>{s.nama}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{s.kegiatan}</td>
                      <td className="r num">{s.apbdp === null ? <DataValue value={null} /> : formatRupiah(s.apbdp)}</td>
                      <td className="r num">{s.realisasi === null ? <DataValue value={null} /> : formatRupiah(s.realisasi)}</td>
                      <td className="r num">{s.pct ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'koreksi' && correction && (
          <Card pad>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>{correction.title}</h3>
            <Evidence c={correction} />
          </Card>
        )}
      </div>
    </LayoutShell>
  );
};
