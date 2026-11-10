import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, Donut, Bars, Tabs, Badge, Notice, Empty, DataValue } from '../components/ui';
import { Evidence } from '../components/Evidence';
import { getInstansi, programList, programBars, programTotals, corrections, unitKerja, unitTotal, indikator, dlhSource } from '../lib/data';
import { formatRupiah, formatRupiahShort, formatPersen } from '../utils/format';

export const InstansiDetail: React.FC = () => {
  const { slug = '' } = useParams();
  const instansi = getInstansi(slug);
  const [tab, setTab] = useState('ringkasan');

  if (!instansi) {
    return (
      <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Jelajahi data', to: '/jelajahi' }, { label: 'Tidak ditemukan' }]}>
        <div className="wrap page">
          <Empty title="Instansi tidak ditemukan">Nama instansi tidak cocok dengan daftar 43 perangkat daerah. <Link to="/jelajahi">Kembali ke daftar</Link>.</Empty>
        </div>
      </LayoutShell>
    );
  }

  const pct = instansi.belanja ? (instansi.belanjaRealisasi / instansi.belanja) * 100 : 0;
  const dlh = instansi.detailed;

  const tabs = dlh
    ? [{ id: 'ringkasan', label: 'Ringkasan' }, { id: 'kegiatan', label: 'Program & kegiatan' }, { id: 'sub', label: 'Sub kegiatan' }, { id: 'koreksi', label: 'Riwayat koreksi' }, { id: 'dokumen', label: 'Dokumen' }]
    : [{ id: 'ringkasan', label: 'Ringkasan' }, { id: 'dokumen', label: 'Dokumen' }];

  const allSubs = programList.flatMap((p) => p.kegs.flatMap((k) => k.subs.map((s) => ({ ...s, program: p.nama, kegiatan: k.nama }))));

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Jelajahi data', to: '/jelajahi' }, { label: instansi.judul }]}>
      <div className="wrap page">
        <div className="grid g2" style={{ alignItems: 'start' }}>
          <div>
            <div className="eyebrow">{dlh ? 'Rincian penuh' : 'Ringkasan instansi'}</div>
            <h1 style={{ fontSize: 30, fontWeight: 750 }}>{instansi.judul}</h1>
            <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14.5, maxWidth: 640 }}>
              {dlh
                ? 'Dinas percontohan: anggaran ditelusuri sampai sub kegiatan, dilengkapi indikator kinerja dan unit kerja pelaksana.'
                : 'Angka ringkasan dari dashboard keuangan daerah. Rincian program dan kegiatan untuk instansi ini belum kami kumpulkan.'}
            </p>
            <div className="rowgap" style={{ marginTop: 14 }}>
              <Badge tone="plain">Komisi {instansi.komisi}</Badge>
              <Badge tone="plain">Asisten {instansi.asisten}</Badge>
              <Badge tone="plain">APBD-P 2025</Badge>
              <Badge tone="info">diambil 21 Oktober 2026</Badge>
            </div>
          </div>
          <Card pad>
            <div className="lbl" style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>Anggaran belanja</div>
            <div className="num" style={{ fontSize: 27, fontWeight: 750, letterSpacing: '-.03em', marginTop: 4 }}>{formatRupiah(instansi.belanja)}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Realisasi {formatRupiah(instansi.belanjaRealisasi)}</div>
            <div className="divider" style={{ margin: '14px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, fontSize: 12.5 }}>
              <div><div style={{ color: 'var(--muted)' }}>Pendapatan</div><div className="num" style={{ fontWeight: 700 }}>{formatRupiahShort(instansi.pendapatan)}</div></div>
              <div><div style={{ color: 'var(--muted)' }}>Pembiayaan</div><div className="num" style={{ fontWeight: 700 }}>{instansi.pembiayaan === null ? '-' : formatRupiahShort(instansi.pembiayaan)}</div></div>
              <div><div style={{ color: 'var(--muted)' }}>Serapan</div><div className="num" style={{ fontWeight: 700 }}>{formatPersen(pct)}</div></div>
            </div>
          </Card>
        </div>

        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === 'ringkasan' && (
          <>
            {!dlh && (
              <Notice tone="hold" title="Rincian belum tersedia untuk instansi ini.">
                Kami hanya mengumpulkan rincian program sampai sub kegiatan untuk satu dinas percontohan.
                <Link to="/instansi/dinas-lingkungan-hidup" style={{ marginLeft: 6 }}>Lihat contoh lengkap <ArrowRight size={12} aria-hidden="true" /></Link>
              </Notice>
            )}
            {dlh && (
              <>
                <div className="grid g2">
                  <Card>
                    <CardHead title="Belanja per program" sub={`${programTotals.kegiatan} kegiatan · ${programTotals.subKegiatan} sub kegiatan`} />
                    <div className="card-pad"><Bars rows={programBars} /></div>
                  </Card>
                  <Card>
                    <CardHead title="Serapan" sub="Realisasi terhadap anggaran" />
                    <div className="card-pad donut" style={{ justifyContent: 'center' }}>
                      <Donut pct={(programTotals.realisasi / programTotals.apbdp) * 100} size={170} />
                      <div className="legend">
                        <div><i style={{ background: 'var(--accent)' }} />Realisasi<div className="val num">{formatRupiahShort(programTotals.realisasi)}</div></div>
                        <div><i style={{ background: 'var(--line)' }} />Anggaran<div className="val num">{formatRupiahShort(programTotals.apbdp)}</div></div>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="section-title"><h2>Unit kerja pelaksana</h2><span className="sub">Angka pembanding dari tabel unit kerja</span></div>
                <Card>
                  <div className="tbl-wrap">
                    <table>
                      <thead><tr><th>Unit kerja</th><th className="r">Penetapan</th><th className="r">Perubahan</th><th className="r">Realisasi</th><th className="r">Serapan</th></tr></thead>
                      <tbody>
                        {unitKerja.map((u) => (
                          <tr key={u.nama}>
                            <td className="tbl-title">{u.nama}</td>
                            <td className="r num">{formatRupiahShort(u.penetapan)}</td>
                            <td className="r num">{formatRupiahShort(u.perubahan)}</td>
                            <td className="r num">{formatRupiahShort(u.realisasi)}</td>
                            <td className="r num">{formatPersen(u.pct)}</td>
                          </tr>
                        ))}
                        <tr style={{ background: '#FAFAFA' }}>
                          <td style={{ fontWeight: 700 }}>Jumlah</td>
                          <td className="r num" style={{ fontWeight: 700 }}>{formatRupiahShort(unitTotal.penetapan)}</td>
                          <td className="r num" style={{ fontWeight: 700 }}>{formatRupiahShort(unitTotal.perubahan)}</td>
                          <td className="r num" style={{ fontWeight: 700 }}>{formatRupiahShort(unitTotal.realisasi)}</td>
                          <td className="r num" style={{ fontWeight: 700 }}>{formatPersen(unitTotal.pct)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}
            {dlh && (
              <>
                <div className="section-title"><h2>Indikator kinerja</h2><span className="sub">Anggaran dan capaian per sasaran</span></div>
                <Card>
                  <div className="tbl-wrap">
                    <table>
                      <thead><tr><th>Indikator</th><th>Program</th><th className="r">Anggaran</th><th className="r">Realisasi</th><th className="r">Capaian</th></tr></thead>
                      <tbody>
                        {indikator.slice(0, 6).map((k) => (
                          <tr key={k.indikator + k.program}>
                            <td>
                              <div className="tbl-title">{k.indikator}</div>
                              <div className="tbl-sub">Target {k.target} · realisasi {k.realisasiKinerja}</div>
                            </td>
                            <td style={{ color: 'var(--muted)', fontSize: 12.5, maxWidth: 240 }}>{k.program}</td>
                            <td className="r num">{formatRupiahShort(k.anggaran)}</td>
                            <td className="r num">{formatRupiahShort(k.realisasi)}</td>
                            <td className="r num">{k.capaianAnggaran}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}
            <div className="section-title"><h2>Pendapatan dan belanja</h2></div>
            <Card pad>
              <dl className="kv">
                <dt>Pendapatan anggaran</dt><dd className="num">{formatRupiah(instansi.pendapatan)}</dd>
                <dt>Pendapatan realisasi</dt><dd className="num">{formatRupiah(instansi.pendapatanRealisasi)}</dd>
                <dt>Belanja anggaran</dt><dd className="num">{formatRupiah(instansi.belanja)}</dd>
                <dt>Belanja realisasi</dt><dd className="num">{formatRupiah(instansi.belanjaRealisasi)}</dd>
                <dt>Pembiayaan</dt><dd>{instansi.pembiayaan === null ? <DataValue value={null} /> : <span className="num">{formatRupiah(instansi.pembiayaan)}</span>}</dd>
              </dl>
            </Card>
          </>
        )}

        {tab === 'kegiatan' && (
          <Card>
            <CardHead title="Program dan kegiatan" sub={dlhSource} />
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Program</th><th className="r">Anggaran</th><th className="r">Realisasi</th><th className="r">Serapan</th><th /></tr></thead>
                <tbody>
                  {programList.map((p) => (
                    <tr key={p.slug}>
                      <td>
                        <Link className="tbl-title" to={`/program/${p.slug}`}>{p.nama}</Link>
                        <div className="tbl-sub">{p.kegs.length} kegiatan · {p.kegs.reduce((a, k) => a + k.subs.length, 0)} sub kegiatan</div>
                      </td>
                      <td className="r num">{p.apbdp === null ? <DataValue value={null} /> : formatRupiah(p.apbdp)}</td>
                      <td className="r num">{p.realisasi === null ? <DataValue value={null} /> : formatRupiah(p.realisasi)}</td>
                      <td className="r num">{p.pct ?? '-'}</td>
                      <td className="r"><Link className="btn btn-sm btn-quiet" to={`/program/${p.slug}`}><ArrowRight size={14} aria-hidden="true" /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === 'sub' && (
          <Card>
            <CardHead title="Seluruh sub kegiatan" sub={`${allSubs.length} baris dari ${programList.length} program`} />
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Sub kegiatan</th><th>Induk kegiatan</th><th className="r">Anggaran</th><th className="r">Realisasi</th><th className="r">Serapan</th></tr></thead>
                <tbody>
                  {allSubs.map((s, i) => (
                    <tr key={`${s.nama}-${i}`}>
                      <td className="tbl-title" style={{ maxWidth: 420 }}>{s.nama}</td>
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

        {tab === 'koreksi' && (
          <div className="grid" style={{ gap: 18 }}>
            {corrections.map((c) => (
              <Card key={c.id} pad>
                <div className="rowgap" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15 }}>{c.title}</h3>
                  <Badge tone={c.state === 'dikoreksi' ? 'warn' : 'hold'}>{c.state}</Badge>
                </div>
                <Evidence c={c} />
              </Card>
            ))}
          </div>
        )}

        {tab === 'dokumen' && (
          <Card>
            <CardHead title="Dokumen sumber" sub="Semua angka berasal dari dokumen berikut" />
            <div className="card-pad" style={{ display: 'grid', gap: 12 }}>
              {[
                { t: 'LKIP Dinas Lingkungan Hidup Jakarta 2025', d: 'Tabel 2.4, 3.33, 3.34, 3.35' },
                { t: 'Dashboard Keuangan BPKD Jakarta', d: 'Total belanja dan realisasi per SKPD' },
                { t: 'APBD-P DKI Jakarta 2025', d: 'Pagu perubahan seluruh perangkat daerah' },
              ].map((d) => (
                <div key={d.t} className="rowgap" style={{ justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--line)' }}>
                  <div className="rowgap">
                    <FileText size={16} aria-hidden="true" style={{ color: 'var(--muted)' }} />
                    <div>
                      <div style={{ fontWeight: 650, fontSize: 13.5 }}>{d.t}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{d.d}</div>
                    </div>
                  </div>
                  <Badge tone="plain">21 Okt 2026</Badge>
                </div>
              ))}
              <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                Kredit gambar dan ikon tercantum di <Link to="/tentang">halaman Tentang</Link>.
              </p>
            </div>
          </Card>
        )}
      </div>
    </LayoutShell>
  );
};
