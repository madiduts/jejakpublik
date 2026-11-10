import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, PageHead, Badge, Empty, Notice } from '../components/ui';
import { listReports, STATUS_LABEL, KIND_LABEL, ReportStatus } from '../lib/reports';
import { getSession } from '../lib/session';

const tone = (s: ReportStatus) => (s === 'diterima' ? 'ok' : s === 'ditolak' ? 'hold' : s === 'diperiksa' ? 'warn' : 'info') as 'ok' | 'hold' | 'warn' | 'info';

export const ModeratorQueue: React.FC = () => {
  const session = getSession();
  const [filter, setFilter] = useState<'semua' | ReportStatus>('semua');
  const reports = listReports().filter((r) => filter === 'semua' || r.status === filter);

  if (!session) {
    return (
      <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Moderator' }]}>
        <div className="wrap page" style={{ maxWidth: 620 }}>
          <Empty title="Ruang moderator terkunci">Masuk terlebih dahulu untuk membuka antrean laporan. <Link to="/masuk" state={{ from: '/moderator' }}>Masuk di sini</Link>.</Empty>
        </div>
      </LayoutShell>
    );
  }

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Moderator' }]}>
      <div className="wrap page">
        <PageHead eyebrow={`Sesi: ${session.name}`} title="Antrean laporan" desc="Periksa setiap laporan terhadap dokumen sumber sebelum mengubah angka." />
        <Notice tone="info" title="Satu peramban, satu antrean.">Pada versi prototipe, laporan disimpan di peramban ini. Antrean karena itu hanya memuat laporan yang dikirim dari perangkat yang sama.</Notice>
        <div className="rowgap" style={{ margin: '16px 0' }}>
          {(['semua', 'baru', 'diperiksa', 'diterima', 'ditolak'] as const).map((f) => (
            <button key={f} className={`chip${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>
              {f === 'semua' ? 'Semua' : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
        {reports.length === 0 ? (
          <Empty title="Antrean kosong">Belum ada laporan dengan status ini. <Link to="/lapor">Kirim satu</Link> untuk mencoba alurnya.</Empty>
        ) : (
          <Card>
            <div className="tbl-wrap">
              <table>
                <thead><tr><th>Tiket</th><th>Jenis</th><th>Sasaran</th><th>Dikirim</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontFamily: 'var(--mono)', fontSize: 12.5 }}>{r.id}</td>
                      <td>{KIND_LABEL[r.kind]}</td>
                      <td>
                        <Link className="tbl-title" to={`/moderator/${r.id}`}>{r.target}</Link>
                        <div className="tbl-sub">{r.instansi}</div>
                      </td>
                      <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>{new Date(r.createdAt).toLocaleDateString('id-ID')}</td>
                      <td><Badge tone={tone(r.status)}>{STATUS_LABEL[r.status]}</Badge></td>
                      <td className="r"><Link className="btn btn-sm" to={`/moderator/${r.id}`}>Periksa</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </LayoutShell>
  );
};
