import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, CardHead, PageHead, Notice } from '../components/ui';
import { ARTICLES } from '../data/site';

export const Guide: React.FC = () => (
  <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Panduan' }]}>
    <div className="wrap page">
      <PageHead eyebrow="Panduan" title="Membaca anggaran tanpa jadi akuntan" desc="Empat artikel pendek, ditulis untuk warga yang baru pertama kali membuka dokumen anggaran." />
      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 14 }}>
          {ARTICLES.map((a) => (
            <Card key={a.slug} pad>
              <div className="rowgap" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <div className="eyebrow" style={{ marginBottom: 0 }}><BookOpen size={11} aria-hidden="true" />{a.reading}</div>
                <ArrowRight size={15} aria-hidden="true" style={{ color: 'var(--muted)' }} />
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 5 }}>
                <Link to={`/panduan/${a.slug}`} style={{ color: 'var(--ink)' }}>{a.title}</Link>
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>{a.desc}</p>
            </Card>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          <Card>
            <CardHead title="Tiga pertanyaan dasar" sub="Cukup ini untuk mulai" />
            <div className="card-pad" style={{ display: 'grid', gap: 12, fontSize: 13.5 }}>
              <div><b>1. Berapa rencananya?</b><div style={{ color: 'var(--muted)' }}>Lihat kolom anggaran.</div></div>
              <div><b>2. Berapa yang sudah keluar?</b><div style={{ color: 'var(--muted)' }}>Lihat kolom realisasi.</div></div>
              <div><b>3. Hasilnya apa?</b><div style={{ color: 'var(--muted)' }}>Lihat indikator kinerja, bukan hanya persentase.</div></div>
            </div>
          </Card>
          <Notice tone="info" title="Istilah asing?">
            Buka <Link to="/istilah">daftar istilah</Link>. Setiap istilah menyebut dokumen asalnya.
          </Notice>
        </div>
      </div>
    </div>
  </LayoutShell>
);
