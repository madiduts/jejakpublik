import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, PageHead, Badge, Empty, Notice } from '../components/ui';
import { listReports, KIND_LABEL, STATUS_LABEL, Report } from '../lib/reports';

const tone = (s: Report['status']) => (s === 'diterima' ? 'ok' : s === 'ditolak' ? 'hold' : s === 'diperiksa' ? 'warn' : 'info') as 'ok' | 'hold' | 'warn' | 'info';

export const MyReports: React.FC = () => {
  const [params] = useSearchParams();
  const baru = params.get('baru');
  const reports = listReports();

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Laporan saya' }]}>
      <div className="wrap page" style={{ maxWidth: 860 }}>
        <PageHead eyebrow="Partisipasi" title="Laporan saya" desc="Daftar laporan yang dikirim dari peramban ini beserta status pemeriksaannya." />
        {baru && (
          <div style={{ marginBottom: 16 }}>
            <Notice tone="info" title="Laporan terkirim.">
              Nomor tiket <b>{baru}</b>. Simpan nomor ini untuk menanyakan tindak lanjut.
            </Notice>
          </div>
        )}
        {reports.length === 0 ? (
          <Empty title="Belum ada laporan"><Link to="/lapor">Kirim laporan pertama</Link> jika menemukan angka yang janggal.</Empty>
        ) : (
          <div className="grid" style={{ gap: 12 }}>
            {reports.map((r) => (
              <Card key={r.id} pad>
                <div className="rowgap" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <div className="rowgap">
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12.5, color: 'var(--muted)' }}>{r.id}</span>
                    <Badge tone={tone(r.status)}>{STATUS_LABEL[r.status]}</Badge>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(r.createdAt).toLocaleString('id-ID')}</span>
                </div>
                <div style={{ fontWeight: 650, fontSize: 14 }}>{r.target}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{KIND_LABEL[r.kind]} · {r.instansi}</div>
                <p style={{ fontSize: 13, marginTop: 8, color: 'var(--ink-soft)' }}>{r.message}</p>
                <details style={{ marginTop: 10 }}>
                  <summary style={{ cursor: 'pointer', fontSize: 12.5, color: 'var(--accent)' }}>Jejak pemeriksaan ({r.events.length})</summary>
                  <ol style={{ margin: '8px 0 0 18px', fontSize: 12.5, color: 'var(--muted)' }}>
                    {r.events.map((e, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                        <b style={{ color: 'var(--ink-soft)' }}>{e.action}</b> · {e.actor} · {new Date(e.at).toLocaleString('id-ID')}
                        {e.note ? ` — ${e.note}` : ''}
                      </li>
                    ))}
                  </ol>
                </details>
              </Card>
            ))}
          </div>
        )}
        <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--muted)' }}>
          <CheckCircle2 size={13} aria-hidden="true" style={{ verticalAlign: '-2px' }} /> Laporan pada versi prototipe disimpan di peramban ini saja.
        </p>
      </div>
    </LayoutShell>
  );
};
