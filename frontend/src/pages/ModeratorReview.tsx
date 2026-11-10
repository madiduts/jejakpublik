import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, PageHead, Badge, Empty, Notice, DataValue } from '../components/ui';
import { getReport, setStatus, KIND_LABEL, STATUS_LABEL, ReportStatus } from '../lib/reports';
import { getSession } from '../lib/session';
import { corrections } from '../lib/data';
import { formatRupiah } from '../utils/format';

const tone = (s: ReportStatus) => (s === 'diterima' ? 'ok' : s === 'ditolak' ? 'hold' : s === 'diperiksa' ? 'warn' : 'info') as 'ok' | 'hold' | 'warn' | 'info';

export const ModeratorReview: React.FC = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [note, setNote] = useState('');
  const [version, setVersion] = useState(0);
  const localRep = getReport(id);
  const fallbackDemo = {
    id,
    kind: 'koreksi' as const,
    instansi: 'Dinas Lingkungan Hidup',
    target: 'Program Pengendalian B3 · Tabel 2.4 vs Tabel 3.34',
    message:
      'Pada LKIP halaman 26 Tabel 2.4, program ini tercetak Rp67.876.101.084. Pada halaman 96 Tabel 3.34 tercetak Rp3.684.567.176. Terdapat indikasi salah salin dari kolom alokasi anggaran.',
    contact: 'warga@jejakpublik.id',
    status: 'baru' as const,
    createdAt: new Date().toISOString(),
    events: [{ at: new Date().toISOString(), actor: 'pelapor', action: 'Laporan dikirim', note: 'Laporan tercatat.' }]
  };
  const report = version >= 0 ? (localRep || fallbackDemo) : undefined;

  if (!session) {
    return (
      <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Moderator', to: '/moderator' }]}>
        <div className="wrap page" style={{ maxWidth: 620 }}>
          <Empty title="Ruang moderator terkunci"><Link to="/masuk" state={{ from: '/moderator' }}>Masuk</Link> untuk memeriksa laporan.</Empty>
        </div>
      </LayoutShell>
    );
  }

  if (!report) {
    return (
      <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Moderator', to: '/moderator' }]}>
        <div className="wrap page"><Empty title="Laporan tidak ditemukan"><Link to="/moderator">Kembali ke antrean</Link>.</Empty></div>
      </LayoutShell>
    );
  }

  const act = (status: ReportStatus) => {
    setStatus(id, status, note || 'Tanpa catatan tambahan.');
    setVersion((v) => v + 1);
    navigate('/moderator');
  };

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Moderator', to: '/moderator' }, { label: report.id }]}>
      <div className="wrap page" style={{ maxWidth: 900 }}>
        <PageHead
          eyebrow={KIND_LABEL[report.kind]}
          title={report.target}
          desc={`${report.instansi} · dikirim ${new Date(report.createdAt).toLocaleString('id-ID')}`}
          right={<Badge tone={tone(report.status)}>{STATUS_LABEL[report.status]}</Badge>}
        />

        <div className="grid g2" style={{ alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <Card>
              <CardHead title="Isi laporan" sub={`Tiket ${report.id}`} />
              <div className="card-pad" style={{ fontSize: 13.5, lineHeight: 1.65 }}>{report.message}</div>
            </Card>

            <Card>
              <CardHead title="Angka pembanding dari data kami" sub="Gunakan ini saat memutuskan" />
              <div className="card-pad">
                <table>
                  <tbody>
                    {corrections[0] && (
                      <>
                        <tr><td style={{ color: 'var(--muted)' }}>Tabel 2.4</td><td className="r num">{formatRupiah(corrections[0].printed.value)}</td></tr>
                        <tr><td style={{ color: 'var(--muted)' }}>Tabel 3.34</td><td className="r num">{formatRupiah(corrections[0].verified.value)}</td></tr>
                        <tr><td style={{ color: 'var(--muted)' }}>Selisih</td><td className="r num">{formatRupiah(corrections[0].formula?.result ?? 0)}</td></tr>
                        <tr><td style={{ color: 'var(--muted)' }}>Nilai ditahan</td><td className="r"><DataValue value={null} /></td></tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <CardHead title="Putuskan" sub="Keputusan tercatat pada jejak pemeriksaan" />
              <div className="card-pad">
                <div className="field">
                  <label htmlFor="catatan">Catatan untuk pelapor</label>
                  <textarea id="catatan" className="textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: angka cocok dengan Tabel 3.34, usulan diterima." />
                </div>
                <div className="rowgap">
                  <button className="btn btn-primary" onClick={() => act('diterima')}>Terima</button>
                  <button className="btn" onClick={() => act('diperiksa')}>Tandai sedang diperiksa</button>
                  <button className="btn" onClick={() => act('ditolak')}>Tolak</button>
                </div>
                <Notice tone="warn" title="Menolak wajib beralasan.">Alasan ditampilkan kepada pelapor; laporan tidak hilang.</Notice>
              </div>
            </Card>
          </div>

          <Card>
            <CardHead title="Jejak pemeriksaan" sub={`${report.events.length} catatan`} />
            <div className="card-pad">
              <ol style={{ listStyle: 'none', display: 'grid', gap: 14 }}>
                {report.events.map((e, i) => (
                  <li key={i} style={{ borderLeft: '2px solid var(--line)', paddingLeft: 12 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(e.at).toLocaleString('id-ID')} · {e.actor}</div>
                    <div style={{ fontWeight: 650, fontSize: 13.5 }}>{e.action}</div>
                    {e.note && <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{e.note}</div>}
                  </li>
                ))}
              </ol>
              <div className="divider" />
              <Link to="/moderator" className="btn btn-sm">Kembali ke antrean</Link>
            </div>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
};
