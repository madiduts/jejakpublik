import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Badge, Empty } from '../components/ui';
import { getReport, setStatus, KIND_LABEL, STATUS_LABEL, Report, ReportStatus } from '../lib/reports';
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
  const fallbackDemo: Report = {
    id,
    kind: 'koreksi' as const,
    instansi: 'Dinas Lingkungan Hidup',
    target: 'Program Pengendalian B3 · Tabel 2.4 vs Tabel 3.34',
    message:
      'Pada LKIP halaman 26 Tabel 2.4, program ini tercetak Rp67.876.101.084. Pada halaman 96 Tabel 3.34 tercetak Rp3.684.567.176. Terdapat indikasi salah salin dari kolom alokasi anggaran.',
    contact: 'warga@jejakpublik.id',
    status: 'baru' as const,
    createdAt: new Date().toISOString(),
    events: [{ at: new Date().toISOString(), actor: 'pelapor', action: 'Laporan dikirim', note: 'Laporan tercatat.' }],
  };
  const report = version >= 0 ? localRep || fallbackDemo : undefined;

  if (!session) {
    return (
      <LayoutShell>
        <div className="wrap page" style={{ maxWidth: 620 }}>
          <Breadcrumbs items={[{ label: 'Beranda', to: '/' }, { label: 'Moderator', to: '/moderator' }]} />
          <Empty title="Ruang moderator terkunci">
            <Link to="/masuk" state={{ from: '/moderator' }}>Masuk</Link> untuk memeriksa laporan.
          </Empty>
        </div>
      </LayoutShell>
    );
  }

  if (!report) {
    return (
      <LayoutShell>
        <div className="wrap page">
          <Breadcrumbs items={[{ label: 'Beranda', to: '/' }, { label: 'Moderator', to: '/moderator' }]} />
          <Empty title="Laporan tidak ditemukan">
            <Link to="/moderator">Kembali ke antrean</Link>.
          </Empty>
        </div>
      </LayoutShell>
    );
  }

  const act = (status: ReportStatus) => {
    setStatus(id, status, note || 'Tanpa catatan tambahan.');
    setVersion((v) => v + 1);
    navigate('/moderator');
  };

  const bukti = [...(report.evidenceUrls ?? [])];
  if (report.docUrl && !bukti.includes(report.docUrl)) bukti.push(report.docUrl);

  return (
    <LayoutShell>
      <div className="mr-wrap">
        <Breadcrumbs items={[{ label: 'Beranda', to: '/' }, { label: 'Moderator', to: '/moderator' }, { label: report.id }]} />
        <div className="mr-head">
          <div>
            <p className="mr-eyebrow">{KIND_LABEL[report.kind]}</p>
            <h1 className="mr-title">{report.target}</h1>
            <p className="mr-meta">
              <span className="mr-ticket">{report.id}</span> · {report.instansi} · dikirim{' '}
              {new Date(report.createdAt).toLocaleString('id-ID')}
            </p>
          </div>
          <Badge tone={tone(report.status)}>{STATUS_LABEL[report.status]}</Badge>
        </div>

        <div className="mr-grid">
          <div className="mr-main">
            <section className="mr-panel">
              <div className="mr-panel-h">
                <h2>Isi laporan</h2>
                <span>dari pelapor</span>
              </div>
              <div className="mr-panel-b mr-prose">{report.message}</div>
            </section>

            <section className="mr-panel">
              <div className="mr-panel-h">
                <h2>Angka pembanding</h2>
                <span>dari data kami</span>
              </div>
              <div className="mr-panel-b">
                <table className="mr-table">
                  <tbody>
                    {corrections[0] ? (
                      <>
                        <tr>
                          <td className="k">{corrections[0].printed.label}</td>
                          <td className="v">{formatRupiah(corrections[0].printed.value)}</td>
                        </tr>
                        <tr>
                          <td className="k">{corrections[0].verified.label}</td>
                          <td className="v">{formatRupiah(corrections[0].verified.value)}</td>
                        </tr>
                        <tr className="diff">
                          <td className="k">Selisih</td>
                          <td className="v">{formatRupiah(Math.abs(corrections[0].printed.value - corrections[0].verified.value))}</td>
                        </tr>
                        <tr>
                          <td className="k">Status angka</td>
                          <td className="v">
                            <Badge tone={corrections[0].state === 'ditahan' ? 'hold' : 'ok'}>
                              {corrections[0].state === 'ditahan' ? 'Ditahan' : 'Sudah dikoreksi'}
                            </Badge>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr><td className="k">Data pembanding</td><td className="v">Tidak tersedia</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mr-panel">
              <div className="mr-panel-h">
                <h2>Bukti dari pelapor</h2>
                <span>{bukti.length > 0 ? `${bukti.length} berkas` : 'tidak ada'}</span>
              </div>
              <div className="mr-panel-b">
                {bukti.length === 0 ? (
                  <p className="mr-empty">
                    Pelapor tidak melampirkan berkas atau tautan. Putusan sebaiknya berdasar angka pembanding di atas.
                  </p>
                ) : (
                  <div className="mr-files">
                    {bukti.map((url) => {
                      const tanpaQuery = url.split('?')[0];
                      const nama = tanpaQuery.split('/').filter(Boolean).pop() || url;
                      const ekst = nama.split('.').pop()?.toLowerCase() ?? '';
                      const jenis = ekst === 'pdf' ? 'PDF' : ['png', 'jpg', 'jpeg', 'webp'].includes(ekst) ? 'IMG' : 'FILE';
                      return (
                        <a key={url} className="mr-file" href={url} target="_blank" rel="noreferrer">
                          <span className="mr-file-ico" aria-hidden="true">{jenis}</span>
                          <span style={{ minWidth: 0 }}>
                            <span className="mr-file-nm">{nama}</span>
                            <span className="mr-file-sz">{url.startsWith('/uploads/') ? 'berkas lokal' : 'tautan pelapor'}</span>
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="mr-rail">
            <section className="mr-panel">
              <div className="mr-panel-h">
                <h2>Keputusan</h2>
              </div>
              <div className="mr-panel-b">
                <div className="mr-field">
                  <label htmlFor="catatan">Catatan untuk pelapor</label>
                  <textarea
                    id="catatan"
                    className="mr-textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: angka cocok dengan Tabel 3.34, usulan diterima."
                  />
                </div>
                <div className="mr-actions">
                  <button type="button" className="mr-btn primary" onClick={() => act('diterima')}>Terima</button>
                  <button type="button" className="mr-btn danger" onClick={() => act('ditolak')}>Tolak</button>
                </div>
                <button type="button" className="mr-btn ghost mr-btn-block" onClick={() => act('diperiksa')}>
                  Tandai sedang diperiksa
                </button>
                <p className="mr-note">Menolak wajib beralasan; alasan ditampilkan kepada pelapor.</p>
              </div>
            </section>

            <section className="mr-panel">
              <div className="mr-panel-h">
                <h2>Jejak pemeriksaan</h2>
                <span>{report.events.length} catatan</span>
              </div>
              <div className="mr-panel-b">
                <ol className="mr-tl">
                  {report.events.map((e, i) => (
                    <li key={i} className="mr-tl-item">
                      <div className="mr-tl-when">{new Date(e.at).toLocaleString('id-ID')} · {e.actor}</div>
                      <div className="mr-tl-act">{e.action}</div>
                      {e.note && <div className="mr-tl-note">{e.note}</div>}
                    </li>
                  ))}
                </ol>
                <div className="mr-rail-foot"><Link to="/moderator" className="mr-btn ghost">Kembali ke antrean</Link></div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </LayoutShell>
  );
};

export default ModeratorReview;
