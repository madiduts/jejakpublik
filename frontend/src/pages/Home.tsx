import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Database, Search, ShieldCheck, GitCompareArrows, AlertTriangle } from 'lucide-react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, Kpi, Donut, Bars, Badge, Notice } from '../components/ui';
import { instansiList, totals, programBars, corrections, programTotals } from '../lib/data';
import { formatRupiahShort, formatPersen } from '../utils/format';

const serapan = (totals.belanjaRealisasi / totals.belanja) * 100;

export const Home: React.FC = () => {
  const top = [...instansiList].sort((a, b) => b.belanja - a.belanja).slice(0, 6);
  return (
    <LayoutShell>
      <div className="wrap page">
        <div className="eyebrow"><ShieldCheck size={12} aria-hidden="true" />Platform independen · DKI Jakarta 2025</div>
        <h1 style={{ fontSize: 34, fontWeight: 750, maxWidth: 820 }}>Uang publik Jakarta, sampai ke rincian terkecilnya</h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, maxWidth: 720, fontSize: 15 }}>
          43 perangkat daerah, 8 program, dan 55 baris anggaran Dinas Lingkungan Hidup. Setiap angka membawa rujukan tabelnya,
          dan angka yang tidak bisa dipastikan kami nyatakan ditahan - bukan dianggap nol.
        </p>

        <div className="kpis">
          <Kpi label="Total belanja 2025" value={formatRupiahShort(totals.belanja)} foot="43 SKPD · APBD-P" icon={<Database size={13} aria-hidden="true" />} />
          <Kpi label="Realisasi" value={formatRupiahShort(totals.belanjaRealisasi)} foot={`${formatPersen(serapan)} terserap`} large />
          <Kpi label="Pendapatan" value={formatRupiahShort(totals.pendapatan)} foot={`realisasi ${formatRupiahShort(totals.pendapatanRealisasi)}`} />
          <Kpi label="Angka dikoreksi" value={String(corrections.length)} foot="dibuka beserta buktinya" icon={<AlertTriangle size={13} aria-hidden="true" />} />
        </div>

        <div className="grid g2">
          <Card>
            <CardHead title="Belanja per program · Dinas Lingkungan Hidup" sub={`${programTotals.kegiatan} kegiatan · ${programTotals.subKegiatan} sub kegiatan`} right={<Badge tone="info">rincian</Badge>} />
            <div className="card-pad"><Bars rows={programBars.slice(0, 6)} /></div>
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <CardHead title="Serapan anggaran" sub="Realisasi terhadap anggaran" />
              <div className="card-pad donut" style={{ justifyContent: 'center' }}>
                <Donut pct={serapan} />
                <div className="legend">
                  <div><i style={{ background: 'var(--accent)' }} />Realisasi<div className="val num">{formatRupiahShort(totals.belanjaRealisasi)}</div></div>
                  <div><i style={{ background: 'var(--line)' }} />Anggaran<div className="val num">{formatRupiahShort(totals.belanja)}</div></div>
                </div>
              </div>
            </Card>
            <Card>
              <CardHead title="Riwayat koreksi" sub="Angka resmi yang tidak konsisten" right={<Link to="/perbandingan" className="btn btn-sm">Bandingkan</Link>} />
              <div className="card-pad" style={{ display: 'grid', gap: 12 }}>
                {corrections.map((c) => (
                  <Link key={c.id} to={`/perbandingan#${c.id}`} style={{ color: 'inherit', display: 'block' }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                      <Badge tone={c.state === 'dikoreksi' ? 'warn' : 'hold'}>{c.state === 'dikoreksi' ? 'Dikoreksi' : 'Ditahan'}</Badge>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 650 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.printed.label} vs {c.verified.label}</div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="section-title">
          <h2>Enam perangkat daerah terbesar</h2>
          <Link to="/jelajahi" className="btn btn-sm">Lihat 43 instansi <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
        <Card>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Perangkat daerah</th><th>Komisi</th><th className="r">Anggaran</th><th className="r">Realisasi</th><th className="r">Serapan</th><th /></tr></thead>
              <tbody>
                {top.map((i) => (
                  <tr key={i.id}>
                    <td><Link to={`/instansi/${i.slug}`} className="tbl-title">{i.nama}</Link></td>
                    <td><span className="num">{i.komisi}</span></td>
                    <td className="r num">{formatRupiahShort(i.belanja)}</td>
                    <td className="r num">{formatRupiahShort(i.belanjaRealisasi)}</td>
                    <td className="r num">{i.belanja ? formatPersen((i.belanjaRealisasi / i.belanja) * 100) : '-'}</td>
                    <td className="r"><Link to={`/instansi/${i.slug}`} className="btn btn-sm btn-quiet"><ArrowRight size={14} aria-hidden="true" /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="section-title"><h2>Cara kami menjaga angka</h2><span className="sub">Tiga aturan yang tidak kami langgar</span></div>
        <div className="grid g3">
          {[
            { icon: <Search size={17} aria-hidden="true" />, t: 'Setiap angka punya rujukan', d: 'Tabel, halaman, dan dokumen sumber tercatat pada tiap nilai rincian.' },
            { icon: <AlertTriangle size={17} aria-hidden="true" />, t: 'Konflik dibuka, bukan disembunyikan', d: 'Dua nilai untuk satu baris ditampilkan keduanya beserta cara memeriksanya.' },
            { icon: <GitCompareArrows size={17} aria-hidden="true" />, t: 'Nilai ditahan tidak dihitung', d: 'Angka yang tidak dapat dipastikan tampil kosong dan tidak masuk penyebut persentase.' },
          ].map((c) => (
            <Card key={c.t} pad>
              <div style={{ color: 'var(--accent)', marginBottom: 8 }}>{c.icon}</div>
              <h3 style={{ fontSize: 14.5, marginBottom: 5 }}>{c.t}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{c.d}</p>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 26 }}>
          <Notice tone="info" title="Periode data:">Seluruh angka berasal dari dokumen TA 2025 yang sudah selesai, diambil 21 Oktober 2026. Ini bukan data waktu nyata.</Notice>
        </div>
        <div style={{ marginTop: 12 }}>
          <Card pad>
            <div className="rowgap" style={{ justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Menemukan angka yang janggal?</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>Kirim laporan. Moderator memeriksanya terhadap dokumen sumber.</div>
              </div>
              <Link to="/lapor" className="btn btn-primary">Lapor Anggaran</Link>
            </div>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
};
