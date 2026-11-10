import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { LayoutShell } from '../components/layout/LayoutShell';
import { Card, PageHead, Empty, Badge } from '../components/ui';
import { TERMS } from '../data/site';

export const Glossary: React.FC = () => {
  const [q, setQ] = useState('');
  const term = q.toLowerCase();
  const rows = TERMS.filter((t) => !term || t.term.toLowerCase().includes(term) || t.short.toLowerCase().includes(term));

  return (
    <LayoutShell crumbs={[{ label: 'Beranda', to: '/' }, { label: 'Istilah' }]}>
      <div className="wrap page">
        <PageHead eyebrow="Daftar istilah" title="Sepuluh istilah yang paling sering ditanyakan" desc="Setiap definisi menyebut dokumen asalnya, supaya kamu bisa memeriksanya sendiri." />
        <label className="search" style={{ maxWidth: 380, display: 'block', marginBottom: 18 }}>
          <Search size={16} aria-hidden="true" />
          <input className="input" placeholder="Cari istilah…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari istilah" />
        </label>
        {rows.length === 0 ? (
          <Empty title="Istilah tidak ditemukan">Coba kata lain, misalnya “realisasi” atau “serapan”.</Empty>
        ) : (
          <div className="grid" style={{ gap: 12 }}>
            {rows.map((t) => (
              <Card key={t.term} pad>
                <div className="rowgap" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15.5 }}>{t.term}</h3>
                  <Badge tone="plain">{t.source}</Badge>
                </div>
                <div style={{ fontSize: 13, color: 'var(--accent-ink)', fontWeight: 600, marginBottom: 6 }}>{t.short}</div>
                <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.65 }}>{t.long}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </LayoutShell>
  );
};
